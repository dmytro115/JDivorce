import { Pipe, PipeTransform } from '@angular/core';
import { FillExpression } from './fill-expression.model';

@Pipe({
  name: 'fill',
  pure: false
})
export class FillPipe implements PipeTransform {
  private readonly expressionRegexGlobal: RegExp = new RegExp(/<%(.*?)%>/g);
  private readonly expressionRegex: RegExp = new RegExp(/<%(.*?)%>/);

  transform(value: string, answers: any): string {
    if (!value) {
      return '';
    }

    const matches = value.match(this.expressionRegexGlobal);
    let replacedContent = value;

    if (matches) {
      for (const match of matches) {
        const formattedMatch = match.replace('<%', '').replace('%>', '');
        const fillExpression: FillExpression = FillExpression.deserialize(formattedMatch);
        let content: string = fillExpression.evalFalse;

        if (answers[fillExpression.qid]) {
          content = fillExpression.evalTrue.replace('%s', answers[fillExpression.qid]);
        }

        replacedContent = replacedContent.replace(this.expressionRegex, content);
      }
    }

    return replacedContent;
  }
}
