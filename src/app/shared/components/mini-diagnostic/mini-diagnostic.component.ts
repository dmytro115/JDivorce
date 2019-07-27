import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import PNotify from 'pnotify/dist/es/PNotify';
import { PNotifyService } from '../../../core';
import { MiniDiagnosticData } from './mini-diagnostic-data.model';
import { MiniDiagnosticQuestionsData } from './mini-diagnostic-questions-data.model';

@Component({
  selector: 'mini-diagnostic',
  templateUrl: './mini-diagnostic.component.html',
  styleUrls: ['./mini-diagnostic.component.scss']
})
export class MiniDiagnosticComponent implements OnInit {
  activeTab = 1;
  showQuestionSubmitSuccess = false;
  diagnosticForm: FormGroup = new FormGroup({
    zip: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    isChildren: new FormControl(''),
    isAgreeOnSplit: new FormControl(''),
    isAgreeOnCustody: new FormControl('')
  });
  questionsForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    phone: new FormControl(''),
    content: new FormControl('')
  });
  pnotify: any;

  @Input() showQuestionsTab = true;
  @Input() landingPage = false;
  @Output() diagnosticData: EventEmitter<MiniDiagnosticData> = new EventEmitter();
  @Output() questionsData: EventEmitter<MiniDiagnosticQuestionsData> = new EventEmitter();

  constructor(private readonly pnotifyService: PNotifyService) {
    this.pnotify = pnotifyService.get();
  }

  ngOnInit(): void {
    this.diagnosticForm.get('isAgreeOnCustody').disable();
    this.diagnosticForm.get('isChildren').valueChanges.subscribe(isChildren => {
      if (isChildren) {
        this.diagnosticForm.get('isAgreeOnCustody').enable();
      } else {
        this.diagnosticForm.get('isAgreeOnCustody').reset();
        this.diagnosticForm.get('isAgreeOnCustody').disable();
      }
    });
  }

  changeTab(index: number): void {
    this.activeTab = index;
  }

  onDiagnosticsDataSubmit(): void {
    this.diagnosticData.emit(this.diagnosticForm.value);
    this.diagnosticForm.reset();
  }

  onQuestionsDataSubmit(): void {
    this.questionsData.emit(this.questionsForm.value);
    this.questionsForm.reset();
    this.pnotify.success({
      text: 'Thanks! You will get a reply shortly.',
      delay: 3000
    });
  }

  isFormError(form: FormGroup, key: string): boolean {
    const errors = form.controls[key].errors;

    return errors && errors.required && form.controls[key].dirty;
  }
}
