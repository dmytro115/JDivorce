import { transition, trigger, useAnimation } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { fadeIn, tada } from 'ng-animate';
import { ClientService, MixpanelService, PNotifyService } from '../../../../core';
import { DashboardTabComponent } from '../../../dashboard/components/dashboard-tab/dashboard-tab.component';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-lime-survey-gdocs-documents',
  templateUrl: './lime-survey-gdocs-documents.component.html',
  styleUrls: ['./lime-survey-gdocs-documents.component.scss'],
  animations: [
    trigger('tableTransition', [
      transition(
        '* => *',
        useAnimation(fadeIn, {
          params: { timing: 0.5 }
        })
      )
    ]),
    trigger('tada', [transition('* => *', useAnimation(tada))])
  ]
})
export class LimeSurveyGdocsDocumentsComponent extends DashboardTabComponent implements OnInit {
  documents = [];
  @Input() docsParams: { postURL: string; progressFlagKey: string; documentsKey: string };
  headerColumns = ['title', 'download'];
  inProgress = false;
  pollTimerId: any;

  genBtnAnimate: any;
  genBtnAnimatePollTimerId: any;

  constructor(
    private readonly pnotify: PNotifyService,
    private readonly clientService: ClientService,
    private readonly http: HttpClient,
    protected mixpanelService: MixpanelService
  ) {
    super(mixpanelService);
  }

  onInit() {
    this.loadData();
    // this.documents = [{
    //   title: 'title 1',
    //   url: 'drive.com/edit?usp=drivesdk'
    // }, {
    //   title: 'title 2',
    //   url: 'drive.com/edit?usp=drivesdk'
    // }];
  }

  generateDocuments() {
    this.http.post(this.docsParams.postURL, { is_pleading: false }, httpOptions).subscribe((data: any) => {
      this.inProgress = data[this.docsParams['progressFlagKey']];
      this.loadData();
    });
  }

  loadData() {
    this.clientService.getAndUpdateLs().subscribe(
      data => {
        this.inProgress = data[this.docsParams['progressFlagKey']];
        if (this.inProgress) {
          this.documents = [];
          this.setupPolling();
          this.cancelLoopAnimation();
        } else {
          this.documents = data[this.docsParams['documentsKey']];
          if (this.documents && this.documents.length > 0) {
            this.pnotify.get().success({
              text: 'Your documents are here!',
              delay: 2000
            });
          } else {
            this.setupLoopAnimation();
          }
          this.cancelPolling();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  setupLoopAnimation() {
    if (!this.genBtnAnimatePollTimerId) {
      this.genBtnAnimatePollTimerId = setInterval(() => {
        this.genBtnAnimate = new Date();
      }, 3000);
    }
  }

  setupPolling() {
    if (!this.pollTimerId) {
      this.pollTimerId = setInterval(() => {
        this.loadData();
      }, 10000);
    }
  }

  cancelLoopAnimation() {
    if (this.genBtnAnimatePollTimerId) {
      clearInterval(this.genBtnAnimatePollTimerId);
    }
  }

  cancelPolling() {
    if (this.pollTimerId) {
      clearInterval(this.pollTimerId);
    }
  }

  ngOnDestroy() {
    this.cancelPolling();
  }
}
