import { async, ComponentFixture, TestBed, fakeAsync, tick, getTestBed} from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { of, Observable, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ForgetPassComponent } from './forget-pass.component';
import { TestModule } from '../../../../test/test.module';
import { users } from '../../user-mock';
import { PNotifyService } from '../../../../core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { AuthService } from '../../../../core';

let translations: any = { CARDS_TITLE: 'This is a test' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('ForgetPassComponent', () => {
  let component: ForgetPassComponent;
  let fixture: ComponentFixture<ForgetPassComponent>;
  let user: Object;
  let authService: AuthService;
  let injector: TestBed;
  let router: Router;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        }),
      ],
      declarations: [ForgetPassComponent],
      providers: [CookieService, PNotifyService, AuthService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetPassComponent);
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

  it('should email validacy', () => {
    let { user_email } = component.forgotPasswordForm.controls;
    let error;
    expect(user_email.valid).toBeFalsy();

    //email required
    error = user_email.errors || {};
    expect(error.required).toBeTruthy();

    //email valid
    user_email.setValue('test');
    error = user_email.errors || {};
    expect(error.email).toBeTruthy();

    //email corrct
    user_email.setValue('test@test.com');
    error = user_email.errors || {};
    expect(error.required).toBeFalsy();
    expect(user_email.valid).toBeTruthy();
  });

  it('submit button should be enabled when the form is valid', () => {
    component.forgotPasswordForm.setValue(users[1]);
    expect(component.forgotPasswordForm.valid).toBeTruthy();
  });

  it('it should navigate to  when user signed in', fakeAsync(() => {
    fixture.detectChanges();
    const res = {};
    spyOn(authService, 'forgotPassword').and.returnValue(of(res));
    spyOn(component.pnotify, 'success').and.callThrough();
    spyOn(router, 'navigate');
    component.submit();
    tick(15000);
    expect(component.pnotify.success).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  }));
});
