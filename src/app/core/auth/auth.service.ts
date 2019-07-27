import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Client } from '../client/client.model';
import { MixpanelService } from './../mixpanel/mixpanel.service';
import { BaseService } from './../services/base-service';
import { UserAuthorization } from './user-authorization.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private static readonly LOCAL_STORAGE_USER_KEY = 'currentUser';

  // store the URL so we can redirect after logging in
  redirectUrl: string;
  currentUser$: BehaviorSubject<UserAuthorization> = new BehaviorSubject({ user: undefined, expired: false });
  signForms$: BehaviorSubject<{ signInForm: ElementRef; signUpForm: ElementRef }> = new BehaviorSubject({ signInForm: null, signUpForm: null });
  VERIFICATION_URL = '/api/authentication/verify';
  isUserAuthenticated$: BehaviorSubject<any> = new BehaviorSubject(false);

  private readonly SIGNUP_URL = '/api/authentication/signup';
  private readonly SIGNUP_LAWYER_URL = '/api/authentication/signup_lawyer';
  private readonly SIGNIN_URL = '/api/authentication/signin';
  private readonly FORGOT_PASSWORD_URL = '/api/authentication/reset_password';
  private readonly CHECK_PSW_RESET_DIGEST_URL = '/api/authentication/is_valid_reset_digest';
  private readonly currentUser = new ReplaySubject(1);
  private readonly VIEW_CLIENT_ID_KEY = 'viewClientId';
  private readonly VIEW_CLIENT_EMAIL_KEY = 'viewClientEmail';

  constructor(http: HttpClient, private readonly translate: TranslateService, private readonly mixpanelService: MixpanelService) {
    super(http);
  }

  register(email: string, password: string, confirmPassword: string): Observable<Client> {
    return this.postAny<Client>(this.SIGNUP_URL, { email, password, confirm: confirmPassword }).pipe(
      map((res: any) => {
        if (res && res.access_token) {
          this.setCurrentUser(email, res);
        }
        this.isUserAuthenticated$.next(true);
        this.mixpanelService.identify(res.user.id);
        this.mixpanelService.peopleSet(email);

        return new Client().deserialize(res.user);
      })
    );
  }

  verifyUser(email: string, verification: string): Observable<any> {
    return this.postAny(this.VERIFICATION_URL, { email, verification });
  }

  resendVerificationEmail(email: string): Observable<any> {
    return this.postAny('/api/authentication/resend_email_verification', { email });
  }

  registerLawyer(firstName: string, lastName: string, email: string, password: string, confirmPassword: string) {
    return this.postAny<any>(this.SIGNUP_LAWYER_URL, {
      firstName,
      lastName,
      email,
      password,
      confirm: confirmPassword
    }).pipe(
      map((res: any) => {
        if (res && res.access_token) {
          this.setCurrentUser(email, res);
        }
        this.mixpanelService.identify(res.user.id);
        this.mixpanelService.peopleSet(email);

        return new Client().deserialize(res.user);
      })
    );
  }

  login(email: string, password: string): Observable<Client> {
    return this.postAny<Client>(this.SIGNIN_URL, { email, password }).pipe(
      map((res: any) => {
        if (res && res.access_token) {
          this.setCurrentUser(email, res);
          this.currentUser$.next({
            user: { id: res.id, email, access_token: res.access_token, role: this.getRole() },
            expired: false
          });
          this.isUserAuthenticated$.next(true);
        }
        if (res.user) {
          this.mixpanelService.identify(res.user.id);
          this.mixpanelService.peopleSetLastLogin();
        }

        return new Client().deserialize(res.user);
      })
    );
  }

  forgotPassword(email: string) {
    return this.postAny<void>(this.FORGOT_PASSWORD_URL, { email }).pipe(map((res: any) => res));
  }

  checkPasswordResetDigest(digest: string) {
    return this.postAny<void>(this.CHECK_PSW_RESET_DIGEST_URL, { digest }).pipe(map((res: any) => res));
  }

  reset(password: string, confirm: string, digest: string) {
    return this.postAny<void>(this.FORGOT_PASSWORD_URL, { password, confirm, digest }).pipe(map((res: any) => res));
  }

  getCurrentUser(): any {
    return JSON.parse(this.getStorage().getItem('currentUser'));
  }

  isAuthorized(): boolean {
    const value: string = this.getStorage().getItem('currentUser');

    return value && value.length > 0;
  }

  isGuest(): boolean {
    return this.getCurrentUser() !== undefined && (this.getCurrentUser().email === undefined || this.getCurrentUser().email === null);
  }

  logout(resultHandler) {
    this.clearStorage();
    this.currentUser$.next(null);
    this.isUserAuthenticated$.next(false);
    return resultHandler();
  }

  clearStorage(): void {
    this.getStorage().clear();
  }

  getRole(): string {
    return this.getStorage().getItem('role') ? this.getStorage().getItem('role') : undefined;
  }

  isLawyer(): boolean {
    const role = this.getRole();

    return this.isAuthorized() && role && role === 'Lawyer';
  }

  isClient(): boolean {
    const role = this.getRole();

    return this.isAuthorized() && role && role === 'Client';
  }

  getLoggedInUser(): Observable<any> {
    this.postAny('/api/user/get_user', {}).subscribe((response: any) => {
      this.getStorage().setItem('role', response.type);
      this.currentUser.next(response);
    });

    return this.currentUser.asObservable();
  }

  isAdminClient() {
    return this.postAny<boolean>('/api/user/is_admin_user', {});
  }

  getStorage(): Storage {
    return localStorage;
  }

  setCurrentUser(email: string, res: any): void {
    this.getStorage().setItem(AuthService.LOCAL_STORAGE_USER_KEY, JSON.stringify({ email, id: res.user.id, token: res.access_token }));
    this.getStorage().setItem('role', res.user.role);
    this.currentUser$.next({ user: { email, id: res.user.id, access_token: res.access_token, role: res.user.role }, expired: false });
  }

  setViewClientDetails(clientId, clientEmail) {
    this.getStorage().setItem(this.VIEW_CLIENT_ID_KEY, clientId);
    this.getStorage().setItem(this.VIEW_CLIENT_EMAIL_KEY, clientEmail);
  }

  getClientId() {
    if (this.isViewClientMode()) {
      return this.getViewClientId();
    } else if (this.isClient()) {
      return this.getCurrentUser().id;
    }
    return null;
  }

  getViewClientId() {
    return this.getStorage().getItem(this.VIEW_CLIENT_ID_KEY);
  }

  getViewClientEmail() {
    return this.getStorage().getItem(this.VIEW_CLIENT_EMAIL_KEY);
  }

  isViewClientMode() {
    return this.getViewClientId() && this.getViewClientId().length > 0;
  }

  isViewClientId(clientId: string): boolean {
    return this.getViewClientId() && this.getViewClientId() === clientId;
  }

  clearViewClientDetails() {
    this.getStorage().removeItem(this.VIEW_CLIENT_ID_KEY);
    this.getStorage().removeItem(this.VIEW_CLIENT_EMAIL_KEY);
  }
}
