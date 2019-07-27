import { Injectable } from '@angular/core';
import { BaseEvaluator } from './base.evaulator';
import { EvaluatorExpression } from './evaluator-expression.model';

@Injectable({
  providedIn: 'root'
})
export class BooleanExpressionEvaluator extends BaseEvaluator {
  private static readonly TYPE: string = 'BOOL_EXP';

  constructor() {
    super();
  }

  get type(): string {
    return BooleanExpressionEvaluator.TYPE;
  }

  evaluate(expression: EvaluatorExpression, answers: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const expressionRegex = /#s/;
      // `expression.qidSource` contains the question id.
      const shareTheCustody = answers[expression.qidSource];
      if (shareTheCustody === 'true') {
        resolve(expression.content.replace(expressionRegex, expression.boolTrue));
      } else if (shareTheCustody === 'false') {
        resolve(expression.content.replace(expressionRegex, expression.boolFalse));
      } else {
        resolve(expression.content.replace(expressionRegex, expression.neutral));
      }
    });
  }
}
