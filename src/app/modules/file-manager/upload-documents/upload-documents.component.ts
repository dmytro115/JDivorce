import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import * as dayjs from 'dayjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PNotifyService } from '../../../core';
import { UploadDocumentService, UserUploadedDocument } from '../../../core/upload-document/index';
import { staggerAnimation } from '../../../shared/animations';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss'],
  animations: [staggerAnimation]
})
export class UploadDocumentsComponent implements OnInit {
  private static readonly DOCUMENT_ICON_MAP: { [key: string]: string } = {
    csv: 'fa-file-text-o',
    html: 'fa-code',
    xml: 'fa-code',
    png: 'fa-file-image-o',
    jpg: 'fa-file-image-o',
    pdf: 'fa-file-pdf-o',
    doc: 'fa-file-word-o',
    docx: 'fa-file-word-o',
    xlsx: 'fa-file-excel-o',
    zip: 'fa-file-zip-o'
  };
  private static readonly DEFAULT_DOCUMENT_ICON = 'fa-file-text-o';

  displayedColumns: Array<string> = ['icon', 'name', 'modified', 'uploaded', 'action'];
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<UserUploadedDocument>;
  pnotify: any;

  constructor(private readonly spinner: NgxSpinnerService, private readonly uploadDocumentService: UploadDocumentService, pnotifyService: PNotifyService) {
    this.pnotify = pnotifyService.get();
  }

  ngOnInit(): void {
    setTimeout(async () => this.spinner.show(), 25);

    this.refreshDocuments();
  }

  fileUpload(event: any): void {
    const reader = new FileReader();
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    reader.readAsDataURL(event.target.files[0]);
    this.spinner.show();
    reader.onloadend = () => {
      this.uploadDocumentService.upload(event.target.files[0].name, event.target.files[0].type, reader.result.toString()).subscribe(res => {
        this.pnotify.success({
          text: 'File uploaded successfully!'
        });
        this.refreshDocuments();
      });
    };
  }

  refreshDocuments(): void {
    this.spinner.show();
    this.uploadDocumentService.list().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.sort = this.sort;
      this.spinner.hide();
    });
  }

  documentIcon(document: UserUploadedDocument): string {
    const temp = document.name.split('.');
    const ext = temp.pop().toLowerCase();
    const icon = UploadDocumentsComponent.DOCUMENT_ICON_MAP[ext];

    return icon ? icon : UploadDocumentsComponent.DEFAULT_DOCUMENT_ICON;
  }

  formatUpdatedAt(udpatedAt: string): string {
    return dayjs(udpatedAt).format('MMM D[th] YYYY');
  }

  delete(row: UserUploadedDocument): void {
    this.spinner.show();
    this.uploadDocumentService.delete(row.document_key).subscribe(res => {
      this.pnotify.success({
        text: 'File is deleted successfully!'
      });
      this.refreshDocuments();
    });
  }

  getDocumentWithUrl(documentKey: string): void {
    this.uploadDocumentService.retrieve(documentKey).subscribe((document: UserUploadedDocument) => {
      window.open(document.url, '_blank');
    });
  }
}
