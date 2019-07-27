import { async, ComponentFixture, TestBed, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { of, Observable } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterModule, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResetPasswordComponent } from './reset-password.component';
import { TestModule } from '../../../../test/test.module';
import { users } from '../../user-mock';
import { AuthService } from '../../../../core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { analyzeAndValidateNgModules } from '@angular/compiler';

let translations: any = { CARDS_TITLE: 'This is a test' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let user: Object;
  let authService: AuthService;
  let injector: TestBed;
  let router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        }),
        RouterModule.forRoot([])
      ],
      declarations: [ResetPasswordComponent],
      providers: [AuthService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
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

  it('new password field validacy', () => {
    const {password} = component.resetForm.controls;
    let error = password.errors || {};
    expect(error.required).toBeTruthy();

    //new password minlength failed
    password.setValue('sks');
    error = password.errors || {};
    expect(error.minlength).toBeTruthy();

    //new password input
    password.setValue('password');
    error = password.errors || {};
    expect(error.required).toBeFalsy();
    expect(password.valid).toBeTruthy();
    
  });

  it('confirm password field validacy',() => {
    const { password, confirm } = component.resetForm.controls;
    let error = confirm.errors || {};
    expect(error.required).toBeTruthy();

    // set different password and confirm password
    password.setValue('password');
    confirm.setValue('wrongpassword');
    error = confirm.errors || {};
    expect(error.match).toBeTruthy();
  });

  it('submit button should be enabled when the form is valid', () => {
    // const { password, confirm } = component.resetForm.controls;
    // password.setValue('');
    // confirm.setValue('');
    component.resetForm.setValue(users[2]);
    expect(component.resetForm.valid).toBeTruthy();
  });

  it('it should reset password', fakeAsync(() => {
    fixture.detectChanges();
    const mockUser = users[2];
    spyOn(router, 'navigate');
    spyOn(authService, 'reset').and.returnValue(of(mockUser));
    component.submit();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login' ,({ email: undefined })]);
  }));
});
