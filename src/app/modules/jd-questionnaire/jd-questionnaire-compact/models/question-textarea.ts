import { QuestionBase } from './question-base';

export class TextAreaQuestion extends QuestionBase<string> {
  controlType = 'long_text';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
