import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlDirective, FormGroup } from '@angular/forms';

@Component({
  selector: 'show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.scss']
})
export class ShowErrorsComponent implements OnInit {
  @Input() control: AbstractControl | AbstractControlDirective;
  @Input() type: string;
  @Input() triggerError: boolean;

  private readonly errorMessages = {
    required: params =>
      `${this.getControlName(this.control)} is required.`,
    email: params => 'Email is Invalid.'

  };

  constructor() { }

  ngOnInit() { }

  shouldShowErrors(): boolean {
    return (this.control && this.control.errors && this.control.dirty || this.triggerError);
  }

  listOfErrors(): Array<string> {
    const errors = this.control.errors;
    if (errors && errors.required && Object.keys(errors).length > 1) {
      return [this.getMessage('required', errors.required)];
    }
    if (errors) {
      return Object.keys(errors).map(field =>
        this.getMessage(field, errors[field])
      );
    }
  }

  private getMessage(type: string, params: any) {
    return this.errorMessages[type](params);
  }

  getControlName(control: any) {
    let controlName = null;
    const parent = control['_parent'];

    // only such parent, which is FormGroup, has a dictionary
    // with control-names as a key and a form-control as a value
    if (parent instanceof FormGroup) {
      // now we will iterate those keys (i.e. names of controls)
      Object.keys(parent.controls).forEach(name => {
        // and compare the passed control and
        // a child control of a parent - with provided name (we iterate them all)
        if (control === parent.controls[name]) {
          // both are same: control passed to Validator
          //  and this child - are the same references
          controlName = name;
        }
      });
    }
    // we either found a name or simply return null
    return controlName.charAt(0).toUpperCase() + controlName.slice(1);
  }
}
