import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finalization-documents',
  templateUrl: './finalization-documents.component.html',
  styleUrls: ['./finalization-documents.component.scss']
})
export class FinalizationDocumentsComponent implements OnInit {
  docsParams = {
    postURL: '/api/client/generate_documents_spouse',
    progressFlagKey: 'is_gen_docs_stage_2',
    documentsKey: 'google_documents_stage_2'
  }

  constructor() { }

  ngOnInit() {
  }
}
