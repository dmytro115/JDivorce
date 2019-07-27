import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LawyerService } from '../../core';

@Component({
  selector: 'app-app-clone',
  templateUrl: './app-clone.component.html',
  styleUrls: ['./app-clone.component.scss']
})
export class AppCloneComponent implements OnInit {
  @Input()
  client: any;
  data: any = {};

  inviteFirstNameFocus: boolean = false;
  inviteLastNameFocus: boolean = false;
  inviteEmailFocus: boolean = false;
  cloneApplicationinProgress: boolean = false;


  constructor(public activeModal: NgbActiveModal,
    private lawyerService: LawyerService) { }

  ngOnInit() {
  }

  cloneApplication(){
    if(this.client){
      this.data["source_email"] = this.client.client_email;
    }

    this.cloneApplicationinProgress = true;
    this.lawyerService.cloneApplication(this.data).subscribe((data:any)=>{
      this.cloneApplicationinProgress = false;
        this.activeModal.close('Close click')
      });
  }

}
