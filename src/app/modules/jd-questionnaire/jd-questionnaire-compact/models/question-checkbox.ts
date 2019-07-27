import { QuestionBase } from './question-base';

export class CheckBoxQuestion extends QuestionBase<Array<string>> {
  controlType = 'checkbox';
  options: Array<{ label: string; value: string }> = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
