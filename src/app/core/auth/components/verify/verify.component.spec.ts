import { async, ComponentFixture, TestBed, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { of, Observable } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterModule, Router } from '@angular/router';
import { PNotifyService } from '../../../../core';
import { VerifyComponent } from './verify.component';
import { TestModule } from '../../../../test/test.module';
import { users } from '../../user-mock';
import { AuthService } from '../../../../core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';
import { NO_ERRORS_SCHEMA, inject } from '@angular/core';

let translations: any = { CARDS_TITLE: 'This is a test' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe(' VerifyComponent', () => {
  let component: VerifyComponent;
  let fixture: ComponentFixture<VerifyComponent>;
  let user: Object;
  let authService: AuthService;
  let router: Router;
  let injector: TestBed;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        }),
        RouterModule.forRoot([])
      ],
      declarations: [VerifyComponent],
      providers: [ PNotifyService, AuthService, CookieService ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyComponent);
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
  it('email validation', () => {
    let { email } = component.verificationForm.controls;
    let error;
    expect(email.valid).toBeFalsy();

    //email field required
    error = email.errors || {};
    expect(error.required).toBeTruthy();
    
    //email validation
    email.setValue('test');
    error = email.errors || {};
    expect(error.required).toBeFalsy();
    expect(error.email).toBeTruthy();

    //set email correct
    email.setValue('test@test.com');
    error = email.errors || {};
    expect(error.required).toBeFalsy();
    expect(error.email).toBeFalsy();
  });

  it('submit button should be enabled when the form is valid', () => {
    component.verificationForm.setValue(users[4]);
    expect(component.verificationForm.valid).toBeTruthy();
  })

  it('it should navigate to  when user submitted', fakeAsync(() => {
    fixture.detectChanges();
    const res = {response: 'any'};
    spyOn(authService, 'resendVerificationEmail').and.returnValue(of(res));
    spyOn(component.pnotify, 'success').and.callThrough();
    spyOn(router, 'navigate');

    component.onSubmit();
    tick(15000);
    expect(component.pnotify.success).toHaveBeenCalled();
  }));
});