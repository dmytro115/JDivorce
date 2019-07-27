export class FillExpression {
  private _type: string;
  private _qid: string;
  private _evalTrue: string;
  private _evalFalse:  string;

  constructor(type: string, qid: string, evalTrue: string, evalFalse: string) {
    this._type = type;
    this._qid = qid;
    this._evalTrue = evalTrue;
    this._evalFalse = evalFalse;
  }

  get type(): string {
    return this._type;
  }

  get qid(): string {
    return this._qid;
  }

  get evalTrue() {
    return this._evalTrue;
  }

  get evalFalse() {
    return this._evalFalse;
  }

  serialize(): string {
    return JSON.stringify({ 'type': this._type, 'qid': this._qid, 'evalTrue': this._evalTrue, 'evalFalse': this._evalFalse });
  }

  public static deserialize(jsonString: string): FillExpression {
    let json = JSON.parse(jsonString);
    return new FillExpression(json.type, json.qid, json.evalTrue, json.evalFalse);
  }
}
