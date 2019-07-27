import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { QuestionnaireService } from '../jd-questionnaire.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jd-questionnaire-blog-posts',
  templateUrl: './jd-questionnaire-blog-posts.component.html',
  styleUrls: ['./jd-questionnaire-blog-posts.component.scss']
})
export class JdQuestionnaireBlogPostsComponent implements OnInit {
  @Input() categories: any[] = [];

  public blogPosts: any[];
  public loadingPosts = false;

  constructor(
    private _authService: AuthService,
    private _questionnaireService: QuestionnaireService
  ) {}

  ngOnInit() {
    this.loadingPosts = true;
    this._questionnaireService
      .fetchBlogPosts(this._authService.getViewClientId(), this.categories)
      .subscribe(response => {
        this.loadingPosts = false;
        this.blogPosts = response;
      });
  }
}
