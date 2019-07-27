import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from '../models/question-base';
import { CheckBoxQuestion } from '../models/question-checkbox';
import { DropdownQuestion } from '../models/question-dropdown';
import { RadioQuestion } from '../models/question-radio';
import { TextAreaQuestion } from '../models/question-textarea';
import { TextboxQuestion } from '../models/question-textbox';

@Injectable({
  providedIn: 'root'
})
export class QuestionControlService {
  constructor() {}

  toFormGroup(questions: Array<QuestionBase<any>>): FormGroup {
    const group: any = {};

    questions.forEach((question: QuestionBase<any>) => {
      if (question.controlType === 'checkbox') {
        group[question.key] = new FormArray([]);

        question['options'].map((option: any) => {
          // Check if the defaultValue from the backend includes the current option.
          const control = new FormControl(question.value && question.value.includes(option.value));
          (group[question.key] as FormArray).push(control);
        });

        return;
      }

      if (question.required) {
        group[question.key] = new FormControl(question.value || '', Validators.required);
      } else {
        group[question.key] = new FormControl(question.value || '');
      }
    });

    return new FormGroup(group);
  }

  buildQuestionBaseArray(questions: any): Array<QuestionBase<any>> {
    const questionsBase: Array<QuestionBase<any>> = [];

    for (const question of questions) {
      if (question.type === 'input') {
        const ques = new TextboxQuestion({
          key: question.id,
          label: question.title,
          value: question.defaultValue,
          required: question.validation && question.validation.includes('required')
        });
        questionsBase.push(ques);
      } else if (question.type === 'radio') {
        const ques = new RadioQuestion({
          key: question.id,
          label: question.title,
          options: question.options,
          value: this.defaultValue(question),
          required: question.validation && question.validation.includes('required')
        });
        questionsBase.push(ques);
      } else if (question.type === 'boolean') {
        const ques = new RadioQuestion({
          key: question.id,
          label: question.title,
          options: question.options,
          value: this.defaultValue(question),
          required: question.validation && question.validation.includes('required')
        });
        questionsBase.push(ques);
      } else if (question.type === 'checkbox') {
        const ques = new CheckBoxQuestion({
          key: question.id,
          label: question.title,
          options: question.options,
          value: this.defaultValue(question),
          required: question.validation && question.validation.includes('required')
        });
        questionsBase.push(ques);
      } else if (question.type === 'long_text') {
        const ques = new TextAreaQuestion({
          key: question.id,
          label: question.title,
          value: question.defaultValue,
          required: question.validation && question.validation.includes('required')
        });
        questionsBase.push(ques);
      } else if (question.type === 'dropdown') {
        const ques = new DropdownQuestion({
          key: question.id,
          label: question.title,
          value: question.defaultValue,
          options: question.options,
          required: question.validation && question.validation.includes('required')
        });
        questionsBase.push(ques);
      } else {
        //
      }
    }

    return questionsBase;
  }

  defaultValue(question: any): any {
    if (question.default) {
      // default is the default value
      return question.default;
    } else {
      // defaultValue is the user's actual response from the database
      return question.defaultValue;
    }
  }
}
