import { QuestionBase } from './question-base';

export class RadioQuestion extends QuestionBase<string> {
  controlType = 'radio';
  options: Array<{ label: string; value: string }> = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
