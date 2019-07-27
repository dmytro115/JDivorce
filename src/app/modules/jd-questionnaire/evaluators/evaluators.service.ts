import { Injectable } from '@angular/core';
import { BaseEvaluator } from './base.evaulator';
import { BooleanExpressionEvaluator } from './boolean-expression.evaluator';
import { EvaluatorExpression } from './evaluator-expression.model';
import { ZipToCountyEvaluator } from './zip-to-county.evaluator';

@Injectable({
  providedIn: 'root'
})
export class EvaluatorsService {
  private expressionRegexGlobal: RegExp = new RegExp(/<%(.*?)%>/g);
  private expressionRegex: RegExp = new RegExp(/<%(.*?)%>/);
  // The key is the 'type' field on the evaluator.
  private evaluators: Map<string, BaseEvaluator>;

  constructor(zipToCountyEvaluator: ZipToCountyEvaluator, booleanExpressionEvaluator: BooleanExpressionEvaluator) {
    this.evaluators = new Map<string, BaseEvaluator>();
    this.evaluators.set(zipToCountyEvaluator.type, zipToCountyEvaluator);
    this.evaluators.set(booleanExpressionEvaluator.type, booleanExpressionEvaluator);
  }

  async evaluate(content: string, answers: any): Promise<string> {
    if (!content) {
      return '';
    }

    let matches = content.match(this.expressionRegexGlobal);
    let replacedContent = content;
    if (matches) {
      for (let match of matches) {
        // JS regex match returns the surrounding tags, like "<% { ... } %>" instead of just the content, like "{ ... }".
        // We replace the surrounding tags here.
        let formattedMatch = match.replace('<%', '').replace('%>', '');
        let evaluatorExpression: EvaluatorExpression = EvaluatorExpression.deserialize(formattedMatch);
        let evaluator: BaseEvaluator = this.evaluators.get(evaluatorExpression.type);
        if (evaluator) {
          await evaluator.evaluate(evaluatorExpression, answers).then(evaluatedContent => {
            replacedContent = replacedContent.replace(this.expressionRegex, evaluatedContent);
          });
        }
      }
    }

    return replacedContent;
  }
}
