import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule  } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Observable, throwError } from 'rxjs';

import { SigninComponent } from './signin.component';
import { TestModule } from '../../../../test/test.module';
import { users } from '../../user-mock';
import { AuthService } from '../../../../core';

let translations: any = { CARDS_TITLE: 'This is a test' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
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
      declarations: [SigninComponent],
      providers: [
        AuthService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();

    injector = getTestBed();
    authService = injector.get(AuthService)
    router = injector.get(Router)
  });

  it('should create', () => {
    expect(component).toBeTruthy;
  });

  it('should invalid when the signin form in empty', () => {
    expect(component.signInForm.valid).toBeFalsy();
  });

  it('email validacy', () => {
    let error;
    let { email } = component.signInForm.controls;
    expect(email.valid).toBeFalsy();
    //email required
    error = email.errors || {};
    expect(error.required).toBeTruthy();
    //email valid
    email.setValue('test');
    error = email.errors || {};
    expect(error.required).toBeFalsy;
    expect(error.valid).toBeTruthy;
    //corrct email
    email.setValue('test@test.com');
    error = email.errors || {};
    expect(error.required).toBeFalsy();
    expect(error.valid).toBeFalsy();
  });

  it('password validacy', () => {
    const { password } = component.signInForm.controls;
    let error = password.errors;

    //password required
    expect(error.required).toBeTruthy();

    //input password
    password.setValue('psword');
    error = password.errors || {};
    expect(error.required).toBeFalsy();

    //correct password
    password.setValue('password');
    error = password.errors || {};
    expect(error.required).toBeFalsy();
  });

  it('submit button should be enabled when the form is valid', () => {
    component.signInForm.setValue(users[3]);
    expect(component.signInForm.valid).toBeTruthy();
  });

  it('it should navigate to dashboard when user signed in', fakeAsync(() => {
    fixture.detectChanges()
    const mockUser = users[3];
    spyOn(router, 'navigate');
    spyOn(authService, 'login').and.returnValue(of(mockUser));
    spyOn(authService, 'isLawyer').and.returnValue(true);
    component.signIn();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/a/l/dashboard']);
  }));

  it('it should reset signin form and throw alert when user failed to signin', fakeAsync(() => {
    fixture.detectChanges();
    const mockUser = users[3];
    component.signInForm.setValue(mockUser);
    const error = new HttpErrorResponse({ status: 403 });
    spyOn(router, 'navigate');
    spyOn(authService, 'login').and.returnValue(throwError(error));
    spyOn(component.signInForm, 'reset').and.callThrough();

    component.signIn();
    tick();
    expect(component.signInForm.reset).toHaveBeenCalled();
    expect(component.alertText).toBe('Sorry, this email and password combination is incorrect.');
  }));
});
