import { Injectable } from '@angular/core';
import { EvaluatorExpression } from './evaluator-expression.model';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseEvaluator {
  abstract evaluate(expression: EvaluatorExpression, answers: any): Promise<any>;
  abstract get type(): string;
}
