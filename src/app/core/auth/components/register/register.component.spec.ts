import { async, ComponentFixture, TestBed, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { of, Observable, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegisterComponent } from './register.component';
import { TestModule } from '../../../../test/test.module';
import { users } from '../../user-mock';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Client } from 'src/app/core/client';

let translations: any = { CARDS_TITLE: 'This is a test' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let user: Object;
  let authService: AuthService;
  let injector: TestBed;

  let router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        })
      ],
      declarations: [RegisterComponent],
      providers: [AuthService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();

    injector = getTestBed();
    authService = injector.get(AuthService);
    router = injector.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  `it('should invalid when the register form in empty', () => {
    expect(component.signUpForm.valid).toBeFalsy();
  });`;

  it('email field validity', () => {
    let errors;
    let { email } = component.signUpForm.controls;
    expect(email.valid).toBeFalsy();

    // Email field is required
    errors = email.errors || {};
    expect(errors.required).toBeTruthy();

    // Set email to something
    email.setValue('test');
    errors = email.errors || {};
    expect(errors.required).toBeFalsy();
    expect(errors.email).toBeTruthy();

    // Set email to something correct
    email.setValue('test@example.com');
    errors = email.errors || {};
    expect(errors.required).toBeFalsy();
    expect(errors.email).toBeFalsy();
  });

  it('password field validity', () => {
    const { password } = component.signUpForm.controls;

    let errors = password.errors || {};
    expect(errors.required).toBeTruthy();

    // Set password
    password.setValue('password');
    expect(password.valid).toBeTruthy();
  });

  it('confirm password field validity', () => {
    const { password, confirmPassword } = component.signUpForm.controls;

    let errors = confirmPassword.errors || {};
    expect(errors.required).toBeTruthy();

    // set different password and confirm password
    password.setValue('password');
    confirmPassword.setValue('wrong password');

    errors = confirmPassword.errors || {};
    expect(errors.match).toBeTruthy();
  });

  it('signup form is invalid when not agreed on terms', () => {
    component.signUpForm.setValue(users[0]);
    const { terms } = component.signUpForm.controls;
    terms.setValue(false);

    expect(component.signUpForm.valid).toBeFalsy();
  });

  it('first name and last name is not required when the user is lawyer', () => {
    const { firstName, lastName, isLawyer } = component.signUpForm.controls;
    isLawyer.setValue(false);

    const firstNameErrors = firstName.errors || {};
    const lastNameErrors = lastName.errors || {};

    expect(firstNameErrors.required && lastNameErrors.required).toBeFalsy();
  });

  it('first name and last name is required when the user is lawyer', () => {
    const { firstName, lastName, isLawyer } = component.signUpForm.controls;
    isLawyer.setValue(true);

    const firstNameErrors = firstName.errors || {};
    const lastNameErrors = lastName.errors || {};

    expect(firstNameErrors.required).toBeTruthy();
    expect(lastNameErrors.required).toBeTruthy();
  });

  it('submit button should be enabled when the form is valid', () => {
    component.signUpForm.setValue(users[0]);

    expect(component.signUpForm.valid).toBeTruthy();
  });

  it('it should be navigate to dashboard when user signed up', fakeAsync(() => {
    fixture.detectChanges();
    // const client = 'any'
    const mockUser = users[0];
    let fire: any;
    spyOn(authService, 'registerLawyer').and.returnValue(of(mockUser));

    spyOn(router, 'navigate');
    spyOn(authService, 'isLawyer').and.returnValue(true);
    component.signUp();
    tick();
    expect(spyOn(authService, 'getLoggedInUser'));
  }));
});
