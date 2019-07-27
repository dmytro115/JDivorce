export class DashboardTab {
  constructor(
    private _id: string,
    private _title: string,
    private _isCompleted: boolean,
    private _isEnabled: boolean,
    private _isActive: boolean) { }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  set isCompleted(isCompleted: boolean) {
    this._isCompleted = isCompleted;
  }

  get isEnabled(): boolean {
    return this._isEnabled;
  }

  set isEnabled(isEnabled: boolean) {
    this._isEnabled = isEnabled;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(isActive: boolean) {
    this._isActive = isActive;
  }
}
