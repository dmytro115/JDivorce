export class EvaluatorExpression {
  private _type: string;
  private _value: string;
  private _qidSource: string;
  private _boolTrue: string;
  private _boolFalse:  string;
  private _neutral: string;
  private _content: string;

  constructor(type: string, value: string, qidSource: string, boolTrue: string, boolFalse: string, neutral: string, content: string) {
    this._type = type;
    this._value = value;
    this._qidSource = qidSource;
    this._boolTrue = boolTrue;
    this._boolFalse = boolFalse;
    this._neutral = neutral;
    this._content = content;
  }

  get type(): string {
    return this._type;
  }

  get value() {
    return this._value;
  }

  get qidSource() {
    return this._qidSource;
  }

  get boolTrue() {
    return this._boolTrue;
  }

  get boolFalse() {
    return this._boolFalse;
  }

  get neutral() {
    return this._neutral;
  }

  get content() {
    return this._content;
  }

  serialize(): string {
    return JSON.stringify({ 'type': this._type, 'value': this._value });
  }

  public static deserialize(jsonString: string): EvaluatorExpression {
    let json = JSON.parse(jsonString);
    return new EvaluatorExpression(json.type, json.value, json.qidSource, json.boolTrue, json.boolFalse, json.neutral, json.content);
  }
}
