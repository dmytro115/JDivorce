import { Component, OnInit, ViewChildren } from '@angular/core';
import { Router } from "@angular/router";
import { Form } from './form.model';
import { Post } from './post.model';
import { Comment } from './comment.model';
import { Client } from '../../core/client/client.model';
import { Lawyer } from '../../core/lawyer/lawyer.model';
import { ConversationService } from './conversation.service';
import { ClientService } from '../../core/client/client.service';
import { LawyerService } from '../../core/lawyer/lawyer.service';
import { AuthService } from "../../core/auth/auth.service";
import { FormControl, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {
  forms: Form[] = [];
  posts: Post[] = [];
  comments: Comment[] = [];
  selectedFormId: string;
  selectedClientId: string;
  selectedPost: Post;
  addCommentControl: FormControl;
  client: Client;
  lawyer: Lawyer;
  clients: Client[] = [];
  activatedClientId: string;
  showSelectClientBox: boolean;
  showNoLawyerAlert: boolean = false;
  placeholderUserPicture: '/assets/images/avatars/default-male.svg';

  @ViewChildren('commentBoxScroll')
  private commentBoxScroll: any;

  constructor(
    private conversationService: ConversationService,
    private authService: AuthService,
    private clientService: ClientService,
    private router: Router,
    private lawyerService: LawyerService) {
    this.loadJSLibrary('https://cdnjs.cloudflare.com/ajax/libs/jQuery-slimScroll/1.3.8/jquery.slimscroll.min.js');
  }

  ngOnInit() {
    this.initChatBox();

    this.showSelectClientBox = this.authService.isLawyer();
    if (this.authService.isClient()) {
      this.conversationService.listFormsWithConversations().subscribe((result: any) => {
        this.forms = result.form_lists;
      });
    } 

    this.addCommentControl = new FormControl({ value: '', disabled: true }, [Validators.required]);

    this.getUserInfo();
  }

  ngAfterViewInit() {
    this.commentBoxScroll.changes.subscribe(t => {
      this.scrollChatToBottom();
    });
  }

  loadJSLibrary(url: string): Promise<any> {
    return new Promise((resolve) => {
      let script: HTMLScriptElement = document.createElement('script');
      script.addEventListener('load', r => resolve());
      script.src = url;
      document.head.appendChild(script);
    });
  }

  getUserInfo() {
    if (this.authService.isClient()) {
      this.clientService.getClient().subscribe((client: Client) => {
        this.client = new Client().deserialize(client);

        this.clientService.getPaidLawyer(client.id).subscribe((lawyers: any) => {
          this.showNoLawyerAlert = lawyers.length == 0;
        });

        this.conversationService.getPostsForUser(client.id).subscribe((posts: Post[]) => {
          this.posts = posts;
        });
      });
    } else {
      this.lawyerService.getLawyer().subscribe((lawyer: Lawyer) => {
        this.lawyer = new Lawyer().deserialize(lawyer);

        this.lawyerService.getLawyerClients(lawyer.id).subscribe((result: any) => {
          this.clients = result.response;

          this.forms = [];
        });
      });
    }
  }

  initChatBox() {
    ($('.chat-left-inner > .chatonline') as any).slimScroll({
      height: '100%',
      position: 'right',
      size: "5px",
      color: '#dcdcdc'

    });
    ($('.chat-list') as any).slimScroll({
      position: 'right'
      , size: "5px"
      , height: '100%'
      , color: '#dcdcdc'
    });

    var cht = function() {
      var topOffset = 445;
      var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
      height = height - topOffset;
      $(".chat-list").css("height", (height) + "px");
    };
    $(window).ready(cht);
    $(window).on("resize", cht);

    // this is for the left-aside-fix in content area with scroll
    var chtin = function() {
      var topOffset = 270;
      var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
      height = height - topOffset;
      $(".chat-left-inner").css("height", (height) + "px");
    };
    $(window).ready(chtin);
    $(window).on("resize", chtin);

    $(".open-panel").on("click", function() {
      $(".chat-left-aside").toggleClass("open-pnl");
      $(".open-panel i").toggleClass("fa fa-angle-left");
    });    
  }

  selectForm(form: Form) {
    if (form) {
      if (this.authService.isClient()) {
        this.conversationService.getPostsForForm(form.id).subscribe((posts: Post[]) => {
          this.posts = posts;
        });
      } else {
        this.conversationService.getPostsForFormByClient(form.id, this.activatedClientId).subscribe((posts: Post[]) => {
          this.posts = posts;
        });
      }
    } else {
      this.conversationService.getPostsForUser(this.client.id).subscribe((posts: Post[]) => {
        this.posts = posts;
      })
    }
    this.comments = [];
    this.addCommentControl.disable();
  }

  selectClient(client) {
    this.forms = [];
    this.posts = [];
    this.comments = [];
    this.addCommentControl.disable();

    if (client) {
      this.conversationService.listFormsWithConversationsByClient(client.client_id).subscribe((result: any) => {
        this.forms = result.form_lists;
        this.activatedClientId = client.client_id;
        this.client = new Client().deserialize(result.client);

        this.conversationService.getPostsForUser(client.client_id).subscribe((posts: Post[]) => {
          this.posts = posts;
        })
      });

      this.addCommentControl = new FormControl({ value: '', disabled: true }, [Validators.required]);
    }
  }

  selectPost(post: Post) {
    if (!this.selectedPost || this.selectedPost.id !== post.id || this.comments.length === 0) {
      this.selectedPost = post;
      this.conversationService.getCommentsForPost(post.id).subscribe((comments: Comment[]) => {
        this.comments = comments;

        this.addCommentControl.enable();
      })
    }
  }

  isCurrentUser(id: string) {
    return id === this.authService.getCurrentUser().id;
  }

  getCommentName(comment: Comment) {
    if (this.isCurrentUser(comment.user_id)) return 'You';

    return comment.user.name ? comment.user.name : comment.user.email;
  }

  formatCreatedAt(createdAt: string) {
    return dayjs(createdAt).format('HH:mm A, MM/DD')
  }

  addComment() {
    this.addCommentControl.disable();
    return this.conversationService.addComment(this.authService.getCurrentUser().id, this.addCommentControl.value, this.selectedPost.id, this.selectedFormId).subscribe((comment: Comment) => {
      this.addCommentControl.reset();
      this.addCommentControl.enable();
      this.comments.push(comment);
      this.scrollChatToBottom();
    });
  }

  getProfileUrl(user) {
    return user.picture_url ? user.picture_url : this.placeholderUserPicture;
  }

  goToCheckout() {
    this.router.navigate(["/a/c/checkout/lawyers"]);
  }

  private scrollChatToBottom() {
    ($('.chat-list') as any).slimScroll({ scrollTo: 100000 });
  }
}
