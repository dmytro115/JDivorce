import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-jd-questionnaire-signature-pad',
  templateUrl: './jd-questionnaire-signature-pad.component.html'
})
export class JDQuestionnaireSignaturePadComponent {
  @Input() hasError = false;
  @Input() error = '';
  @Input() value = '';
  @Input() style = '';
  @Input() placeholder = 'Type your answer here...';
  @Output() answerChange = new EventEmitter();
  mode = 'default';
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    canvasWidth: 500,
    canvasHeight: 300,
    backgroundColor: 'rgb(255, 255, 255)'
  };

  drawComplete(): void {
    this.value = this.signaturePad.toDataURL('image/jpeg'); // base64 format
    this.answerChange.emit(this.value);
  }

  // tslint:disable-next-line: no-empty
  drawStart(): void {}

  clearSignature(): void {
    this.value = '';
    this.answerChange.emit(this.value);
    this.signaturePad.clear();
  }

  editSignature(): void {
    this.mode = 'edit';
  }
}
