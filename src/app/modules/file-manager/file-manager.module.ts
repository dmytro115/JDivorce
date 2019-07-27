import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FileManagerRoutingModule } from './file-manager-routing.module';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';

@NgModule({
  declarations: [UploadDocumentsComponent],
  imports: [CommonModule, AngularMaterialModule, FileManagerRoutingModule, NgxSpinnerModule]
})
export class FileManagerModule {}
