import { transition, trigger, useAnimation } from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Cable, Channel } from 'angular2-actioncable';
import { fadeIn, fadeOut } from 'ng-animate';
import { Subscription } from 'rxjs';
import { ActionCableWrapperService, PNotifyService } from '../../../../core';
import { Document, DocumentsService } from '../../../../core/services';
import { DashboardSharedService } from '../../services/dashboard-shared.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  animations: [
    trigger('tableTransition', [
      transition(
        '* => *',
        useAnimation(fadeIn, {
          params: { timing: 0.5 }
        })
      )
    ]),
    trigger('fadeInOut', [
      transition(':enter', useAnimation(fadeIn, { params: { timing: 0.5 } })),
      transition(':leave', useAnimation(fadeOut, { params: { timing: 0.5 } }))
    ])
  ]
})
export class DocumentsComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table: MatTable<any>;
  inProgress = false;
  documentUrlMap = {};

  documents: Array<Document> = [];
  offers: Array<any> = [];
  genBtnAnimate: any;
  headerColumns = ['form', 'title', 'download'];
  pnotify: any;

  inProgressZip = false;

  cable: Cable;
  subscription: Subscription;
  zipUrl: string;

  constructor(
    private readonly spinnerService: SpinnerService,
    private readonly documentsService: DocumentsService,
    private readonly dashboardSharedService: DashboardSharedService,
    pnotifyService: PNotifyService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly acionCableWrapperService: ActionCableWrapperService
  ) {
    this.pnotify = pnotifyService.get();
  }

  ngOnInit(): void {
    this.spinnerService.isLoading({ isLoading: true, isLoadingText: 'Fetching your documents...' });
    this.loadData();
    this.setupActionCable();
    this.loadZipData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.cable.disconnect();
  }

  generateDocuments(): void {
    this.documentsService.generate(this.dashboardSharedService.urlFragment).subscribe((response: boolean) => {
      this.inProgress = response;
      this.loadData();
    });
  }

  retrieveDocument(id: string, type: string): void {
    this.documentsService.show(id, type).subscribe((courtDocument: Document) => {
      this.documentUrlMap[`${id}#${type}`] = courtDocument[`${type}_url`];
      this.changeDetectorRef.detectChanges();
      const element = document.getElementById(this.retrieveDocumentId(id, type));
      element.click();
    });
  }

  documentUrl(id: string, type: string): string {
    const url = this.documentUrlMap[`${id}#${type}`];
    if (url) {
      return url;
    } else {
      return '#';
    }
  }

  retrieveDocumentId(id: string, type: string): string {
    return `${id}#${type}`;
  }

  isFacebookApp(): boolean {
    const ua = navigator.userAgent || navigator.vendor || window['opera'];

    return ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
  }

  openInBrowser(target, browserScheme): void {
    const ifc = document.createElement('div');
    ifc.innerHTML = `<iframe src='${browserScheme}${target}' style='width:0;height:0;border:0; border:none;visibility: hidden;'></iframe>`;
    document.body.appendChild(ifc);
  }

  isNotExhibits(doc: Document): boolean {
    return doc.id !== 'exhibits.pdf';
  }

  private setupActionCable(): void {
    this.cable = this.acionCableWrapperService.cable;
    const channel: Channel = this.cable.channel('DvDocumentsChannel');
    this.subscription = channel.received().subscribe(message => {
      this.inProgressZip = false;
      if (message) {
        if (message.url) {
          this.zipUrl = message.url;
          this.pnotify.success({
            text: 'Your court documents have been successfully combined. Please click on the download button to download them.'
          });
        } else if (message.documents) {
          this.loadData();
        } else if (message.error) {
          this.pnotify.error({
            text: message.error.message
          });
          this.loadData();
          this.loadZipData();
        }
      }
    });
  }

  private loadZipData(): void {
    this.documentsService.zip().subscribe((zipResponse: any) => {
      if (zipResponse.url) {
        this.zipUrl = zipResponse.url;
      } else {
        this.zipUrl = '#';
      }
    });
  }

  private loadData(): void {
    this.documentsService.list(this.dashboardSharedService.urlFragment).subscribe((response: any) => {
      this.inProgress = response.is_gen_docs_dv;
      this.inProgressZip = response.is_zipping_dv;
      // Cancel the polling if documents are no longer generating.
      if (this.inProgress) {
        this.documents = [];
        this.table.renderRows();
      } else {
        this.documents = response.documents;
        this.table.renderRows();

        if (this.documents.length > 0) {
          this.pnotify.success({
            text: 'Your court documents are here!',
            delay: 2000
          });
        } else {
          this.generateDocuments();
        }
      }
      this.spinnerService.isLoading({ isLoading: false, isLoadingText: '' });
    });
  }
}
