import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactUsService } from "../../core";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: [
      './contact-form.component.scss'
  ]
})

export class ContactFormComponent {
 contactForm: FormGroup;
 alertText: string;
 isRequestInProgress: boolean = false;
 isSuccess: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactUsService: ContactUsService) {
    this.createForm();
  }

  createForm() {
    this.contactForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      name: new FormControl('', [
        Validators.required
      ]),
       feedback: new FormControl('', [
        Validators.required
      ]),
       phone: new FormControl('', [])
    });
  }

  // Convenience getter for easy access to form fields.
  get form() { return this.contactForm.controls; }

  contact() {
    this.isRequestInProgress = true;
    this.isSuccess=false;
    this.contactUsService.sendContactUsRequest(
      this.form.email.value,
      this.form.name.value,
      this.form.feedback.value,
      "Contact Form",
      this.form.phone.value,
      ""
    ).subscribe((resp:any)=>{
      this.isRequestInProgress = false;
      this.createForm();
      this.isSuccess=true;
    })
}
}
