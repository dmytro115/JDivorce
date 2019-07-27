import { QuestionBase } from './question-base';

export class DropdownQuestion extends QuestionBase<string> {
  controlType = 'dropdown';
  options: Array<{ value: string }> = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
