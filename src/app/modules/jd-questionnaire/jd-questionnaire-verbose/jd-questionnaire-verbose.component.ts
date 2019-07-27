import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange, MatRadioChange } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import Validator from 'validatorjs';
import { PNotifyService } from '../../../core';
import { EvaluatorsService } from '../evaluators/evaluators.service';
import { HelpSidebarService } from '../help-sidebar/help-sidebar.service';
import { QuestionControlService } from '../jd-questionnaire-compact/services/question-control.service';

@Component({
  selector: 'app-jd-questionnaire-verbose',
  templateUrl: './jd-questionnaire-verbose.component.html',
  styleUrls: ['./jd-questionnaire-verbose.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JdQuestionnaireVerboseComponent implements OnInit, AfterViewInit {
  @Input() continueButtonUrl: string;
  @Input() continueButtonText = 'Continue';
  @Input() submitText = 'Submit';
  @Input() successMessage = 'Thanks!';
  @Input() questions: Array<any>;
  @Input() isLoading = false;
  @Input() isCompleted = false;
  @Input() isFailed = false;
  @Output() questionnaireSubmit = new EventEmitter();
  formGroup: FormGroup;

  el: any;
  pnotify: any;
  failMessage = 'Oops! Something went wrong.';
  tryAgainButtonText = 'Try Again';
  questionsMap: { [id: string]: any } = {};

  private readonly answers: any = {};
  private validationErrors: any = {};
  private readonly tableValidationErrorPos: any = [];
  private readonly validationMessages = {
    required: 'Please answer this question.',
    email: 'Please enter valid e-mail.',
    numeric: 'Please enter valid number.',
    min: 'Please enter value greater then :min.',
    max: 'Please enter value less then :max.'
  };
  private readonly tableValidationMessages = {
    required: "':attribute' field should not be empty.",
    email: "':attribute' field should be valid e-mail.",
    numeric: "':attribute' field should be valid number.",
    min: "':attribute' field should be greater than :min.",
    max: "':attribute' field should be less than :max."
  };

  constructor(
    public sanitizer: DomSanitizer,
    el: ElementRef,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly evaluatorsService: EvaluatorsService,
    private readonly helpSidebarService: HelpSidebarService,
    private readonly questionControlService: QuestionControlService,
    pnotifyService: PNotifyService
  ) {
    this.el = el;
    this.evaluatorsService = evaluatorsService;
    this.pnotify = pnotifyService.get();
  }

  ngOnInit(): void {
    this.fillDefaultValues();

    Validator.register(
      'telephone',
      (value, requirement, attribute) => value.match(/^\d{3}-\d{3}-\d{4}$/), // requirement parameter defaults to null
      'The :attribute phone number is not in the format XXX-XXX-XXXX.'
    );

    this.questions.forEach((question: any) => {
      this.questionsMap[question.id] = question;
    });

    const reactiveQuestions = this.questionControlService.buildQuestionBaseArray(
      this.questions.filter((question: any) => question.type === 'long_text' || question.type === 'checkbox' || question.type === 'radio' || question.type === 'boolean')
    );
    this.formGroup = this.questionControlService.toFormGroup(reactiveQuestions);
  }

  ngAfterViewInit(): void {
    const info = this.el.nativeElement.getElementsByClassName('jd-questionnaire__question-info');
    for (const element of info) {
      const expandable = element.getElementsByClassName('jd-questionnaire__question-info-expandable')[0];
      const toggle = element.getElementsByClassName('jd-questionnaire__question-info-toggle')[0];
      const rect = expandable.getBoundingClientRect();
      if (rect.height > 120) {
        toggle.classList.add('visible');
      }
    }
  }

  toggleShowMore(e: any): void {
    const infoEl = e.target.parentElement.parentElement;
    if (!infoEl.classList.contains('open')) {
      infoEl.classList.add('open');
    } else {
      infoEl.classList.remove('open');
    }
  }

  fillDefaultValues(): void {
    // if the question has a default value (the answer)
    this.questions.forEach(question => {
      if (question.defaultValue) {
        this.answers[question.id] = question.defaultValue;
      } else if (question.default) {
        this.answers[question.id] = question.default;
      } else if (question.type === 'statement') {
        this.answers[question.id] = question.title;
      } else {
        this.answers[question.id] = '';
      }
      this.evaluateShortText(question, true);
    });
  }

  async evaluteQuestionContent(content: string): Promise<string> {
    return this.evaluatorsService.evaluate(content, this.answers);
  }

  onAnswerChange(value: any, id: string): void {
    // TODO: https://github.com/rhuang/jdivorce-ui/issues/472
    delete this.validationErrors[id];
    if ((this.answers[id] === value && !Array.isArray(value)) || value.toString().length === 0) {
      delete this.answers[id];
    } else {
      this.answers[id] = value;
    }

    this.evaluateQuestionsShortText();
  }

  onRadioChange(event: MatRadioChange, id: string): void {
    delete this.validationErrors[id];
    const value = event.value;
    if ((this.answers[id] === value && !Array.isArray(value)) || value.toString().length === 0) {
      delete this.answers[id];
    } else {
      this.answers[id] = value;
    }

    this.evaluateQuestionsShortText();
  }

  onCheckboxChange(event: MatCheckboxChange, id: string, value: string): void {
    const checked = event.checked;
    delete this.validationErrors[id];

    if (checked) {
      if (value === 'None of the above') {
        // set the answer list to only 'None of the above'
        this.answers[id] = ['None of the above'];

        // uncheck every other checkbox except 'None of the above'
        const checkboxFormArray = this.formGroup.get(id) as FormArray;
        checkboxFormArray.controls.forEach((control: FormControl, index: number) => {
          // assumes 'None of the above' is last
          if (index !== checkboxFormArray.controls.length - 1) {
            control.setValue(false);
          }
        });
      } else {
        // remove 'None of of the above' from the answers list if the checked value isn't it
        const index = this.answers[id].indexOf('None of the above', 0);
        if (index > -1) {
          this.answers[id].splice(index, 1);

          // uncheck 'None of the above', assumes 'None of the above' is last
          const checkboxFormArray = this.formGroup.get(id) as FormArray;
          checkboxFormArray.controls[checkboxFormArray.controls.length - 1].setValue(false);
        }

        // if this checkbox is checked, then push the new value into the answer array
        if (this.answers[id]) {
          this.answers[id].push(value);
        } else {
          this.answers[id] = [value];
        }
      }
    } else {
      // if this checkbox is unchecked, then remove its value from the answer array
      const index = this.answers[id].indexOf(value, 0);
      if (index > -1) {
        this.answers[id].splice(index, 1);
      }
    }

    this.evaluateQuestionsShortText();
  }

  onInputChange(event: any, id: string): void {
    this.onAnswerChange(this.formGroup.get(id).value, id);
  }

  _onSubmit(e: Event): void {
    this.isLoading = true;
    e.preventDefault();

    // validation
    const rules = {};
    const tables = {};
    this.questions.forEach(question => {
      if (question.validation) {
        if (question.validation.length) {
          // Don't add the 'required' rule if the question isn't visible.
          const hasRequired: boolean = question.validation.includes('required');
          if (
            ((hasRequired && this.visibleIf(question.visibleIf)) /* check for validations if the question is visible */ ||
            !hasRequired /* don't check for validations if the question is not required */ ||
              question.type === 'matrix') /* don't check for validations if the question is a matrix, it will be checked later in this function */ &&
            question.hide !== 'true' &&
            question.hide !== true
          ) {
            rules[question.id] = question.validation;
          }
        }

        // fill the answers map with textarea value from the FormGroup, since we removed the (input) event from the textarea
        if (question.type === 'long_text') {
          this.answers[question.id] = this.formGroup.get(question.id).value.trim();
        }
      }

      if (question.type === 'matrix' && question.options) {
        tables[question.id] = question.options;
      }
    });

    const answers: any = {};
    // convert answers to string
    Object.keys(this.answers).forEach(key => (answers[key] = this.answers[key].toString()));
    if (answers.email) {
      answers.email = answers.email.trim();
    }

    const validation = new Validator(answers, rules, this.validationMessages);
    const tableValidations = {};

    Object.keys(tables).forEach(key => {
      const tableValidation = this.validateTable(key, tables[key]);

      if (!tableValidation.isValid) {
        tableValidations[key] = tableValidation;
      }
    });

    if (validation.passes() && Object.keys(tableValidations).length === 0) {
      // call event
      this.refineAnswers();
      this.questionnaireSubmit.emit(this.answers);

      this.isLoading = false;
    } else {
      this.validationErrors = validation.errors.errors;
      Object.keys(tableValidations).forEach(key => {
        this.validationErrors[key] = tableValidations[key].errorMessages;
      });
      Object.keys(tableValidations).forEach(key => {
        this.tableValidationErrorPos[key] = tableValidations[key].errorPos;
      });

      const validationErrors = validation.errors.errors;
      const count = Object.keys(validationErrors).length + Object.keys(tableValidations).length;

      const errorQuestions = [];
      this.questions.forEach((question: any, index: number) => {
        if (validationErrors[question.id]) {
          question.number = index + 1;
          errorQuestions.push(question);
        }
      });

      const errorQuestionNumbers = errorQuestions.map(question => question.number).join(', ');

      this.pnotify.error({
        delay: 10000,
        text: `${count} ${count > 1 ? 'questions need' : 'question needs'} to be completed correctly! These are questions ${errorQuestionNumbers}.`
      });

      this.isLoading = false;
    }
  }

  refineAnswers(): void {
    this.questions.forEach(question => {
      if (!this.visibleIf(question.visibleIf) || question.hide) {
        // TODO: https://github.com/rhuang/jdivorce-ui/issues/472
        delete this.answers[question.id];
      }
    });
  }

  validateTable(id: string, options: Array<any>): any {
    let answers = this.answers[id];
    // empty answer
    if (answers === '') {
      answers = [];
    }
    let isValid = true;
    const errorPos = {};
    const errorMessages = [];
    const emptyIndexes = [];

    answers.forEach((answer: any, index: number) => {
      const rules = {};

      options.forEach(option => {
        rules[option.name] = option.validation;
      });

      if (!this.checkAllEmpty(answer)) {
        const validation = new Validator(answer, rules, this.tableValidationMessages);

        if (!validation.passes()) {
          isValid = false;
          errorPos[index] = Object.keys(validation.errors.errors);
          Object.keys(validation.errors.errors).forEach(key => {
            if (errorMessages.indexOf(validation.errors.errors[key][0]) === -1) {
              errorMessages.push(validation.errors.errors[key][0]);
            }
          });
        }
      } else {
        emptyIndexes.push(index);
      }
    });

    emptyIndexes
      .slice()
      .reverse()
      .forEach(i => {
        answers.splice(i, 1);
      });

    return { isValid, errorPos, errorMessages };
  }

  checkAllEmpty(answer: any): boolean {
    let res = true;

    Object.keys(answer).forEach(key => (res = answer[key] && answer[key].toString() ? false : res));

    return res;
  }

  getValue(id: string): any {
    return this.answers[id] ? this.answers[id] : undefined;
  }

  hasError(id: string): boolean {
    return typeof this.validationErrors[id] !== 'undefined';
  }

  getError(id: string): string {
    return this.validationErrors[id] ? this.validationErrors[id][0] : '';
  }

  getTableErrors(id: string): any {
    return this.validationErrors[id] ? this.validationErrors[id] : '';
  }

  getErrorPos(id: string): string {
    return this.tableValidationErrorPos[id] ? this.tableValidationErrorPos[id] : '';
  }

  tryAgain(): void {
    this.isFailed = false;
  }

  findQuestion(id: string): any {
    return this.questionsMap[id];
  }

  visibleIf(conditions: any): boolean {
    if (conditions && conditions.length > 0) {
      return conditions.every((condition: any) => {
        if (condition) {
          if (condition.type === 'not_include') {
            return this.evaluateVisibleIfCondition(condition, false);
          } else if (condition.type === 'include') {
            return this.evaluateVisibleIfCondition(condition, true);
          } else if (condition.type === 'or') {
            return condition.conditions.some((c: any) => this.visibleIf([c]));
          } else if (condition.type === 'and') {
            return condition.conditions.every((c: any) => this.visibleIf([c]));
          } else {
            return this.answers[condition.id] === condition.value;
          }
        }
      });
    } else {
      return true;
    }
  }

  evaluateVisibleIfCondition(condition: any, predicate: boolean): boolean {
    if (this.findQuestion(condition.id).type === 'checkbox') {
      const answer = this.answers[condition.id];

      if (!predicate && (answer === '' || answer === undefined || answer === null)) {
        return true;
      }

      return predicate === answer.includes(condition.value);
    } else {
      // TODO: unimplemented
      return true;
    }
  }

  evaluateShortText(question: any, detectChanges = false): void {
    if (question.shortText) {
      this.evaluteQuestionContent(question.shortText).then(evaluatedShortText => {
        question.evaluatedShortText = evaluatedShortText;
        if (detectChanges) {
          this.changeDetectorRef.detectChanges();
        }
      });
    }
  }

  showHelpContentPanel(question: any, index: number): void {
    question.questionNumber = index + 1;
    this.helpSidebarService.toggleSidebar(question);
  }

  private evaluateQuestionsShortText(): void {
    this.questions.forEach(question => {
      this.evaluateShortText(question, true);
    });
  }
}
