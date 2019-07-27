import { Component, OnInit }                               from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService, ClientService } from '../../../core';
import { CheckoutStoreService }       from '../checkout-store.service';

@Component({
  selector:    'app-checkout-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls:   ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  contactInfoForm: FormGroup;
  loggedInUser: any;
  contactInfo: any = {
    firstName: '',
    lastName: '',
    email: '',
    cell: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private checkoutStoreService: CheckoutStoreService,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.contactInfoForm = this.formBuilder.group({
      firstName: [this.contactInfo.firstName, Validators.required],
      lastName: [this.contactInfo.lastName, Validators.required],
      email: [this.contactInfo.email, [Validators.required, Validators.email]],
      cell: ''
    });

    // Mark each control as 'touched' when the payment form submits.
    // Then validate the form and let others know.
    // Eg. When asked to check the contact form.
    this.checkoutStoreService.checkContactForm$.subscribe(
      (source: string) => {
        Object.keys(this.contactInfoForm.controls).forEach(field => {
          const control = this.contactInfoForm.get(field);
          control.markAsTouched();
        });
        // Emit the contact form validity and value.
        this.checkoutStoreService.emitContactInfo({ valid: this.contactInfoForm.valid, value: this.contactInfoForm.value, source: source });
      }
    );

    this.clientService.getClient().subscribe(response => {
      console.log(response);
    });

    this.authService.getLoggedInUser().subscribe(user => {
      this.loggedInUser = user;
      if (user.email && user.email !== '') {
        this.contactInfoForm.get('email').setValue(user.email);
        this.contactInfoForm.get('email').disable();
      }
      this.contactInfoForm.get('firstName').setValue(user.first_name);
      this.contactInfoForm.get('lastName').setValue(user.last_name);
      this.contactInfoForm.get('cell').setValue(user.cell);
    });
  }

  get email() { return this.contactInfoForm.get('email'); }
  get firstName() { return this.contactInfoForm.get('firstName'); }
  get lastName() { return this.contactInfoForm.get('lastName'); }
  get cell() { return this.contactInfoForm.get('cell'); }

  isFormError(form, key) {
    let errors = form.controls[key].errors;
    return errors && (errors.required || errors.email) && (form.controls[key].dirty || form.controls[key].touched);
  }
}
