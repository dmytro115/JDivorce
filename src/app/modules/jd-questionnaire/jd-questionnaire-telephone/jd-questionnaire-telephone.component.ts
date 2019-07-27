import { Component, EventEmitter, Input, Output } from '@angular/core';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@Component({
  selector: 'app-jd-questionnaire-telephone',
  templateUrl: './jd-questionnaire-telephone.component.html',
  styleUrls: ['./jd-questionnaire-telephone.component.scss']
})
export class JdQuestionnaireTelephoneComponent {
  @Input()
  hasError = false;
  @Input()
  error = '';
  @Input()
  value = '';
  @Input()
  style = '';
  @Input()
  placeholder = 'Type your answer here...';
  @Output() answerChange = new EventEmitter();

  initTelephone(val: string): void {
    const sanitizedPhoneNo = val.replace(/\s|\(|\)|-/g, '');
    if (sanitizedPhoneNo.length === 10) {
      this.hasError = false;
      const phoneNumber = parsePhoneNumberFromString('+1'.concat(sanitizedPhoneNo)).format('NATIONAL');
      this.answerChange.emit(phoneNumber);
    } else {
      this.hasError = true;
      this.error = 'Please enter a valid telephone number';
    }
  }

  handleUndefined(val: string): string {
    if (val === undefined || val === 'undefined' || val === null) {
      return '';
    }

    return val;
  }
}
