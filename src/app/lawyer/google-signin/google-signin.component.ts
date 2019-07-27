import { Component, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { environment } from "../../../environments/environment";
import { AuthService } from "../../core/auth/auth.service";
import { ProfileService } from "../../lawyer/profile/profile.service";
import PNotify from "pnotify/dist/es/PNotify";

declare const gapi: any;

@Component({
  selector: 'google-signin',
  template: '<button class="btn btn-primary btn-connect" (click)="socialSignIn()">Connect Calendar</button>'
})
export class GoogleSigninComponent implements AfterViewInit {
  private clientId: string = environment.calendar.clientId;
  @Output() isConnected: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private profileService: ProfileService) {}

  public auth2: any;
  private scope = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');

  public googleInit() {
    let that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: that.clientId,
        scope: that.scope
      });
    });
  }

  public socialSignIn() {
    this.auth2.grantOfflineAccess().then((signInCallback) => {
      let lawyer = this.authService.getCurrentUser();
      let authCode = signInCallback.code;
      console.log(signInCallback);

      this.profileService.createCalendar(lawyer.id, authCode).subscribe((response) => {
        this.isConnected.emit(true);
        PNotify.success({
          text: "Your calendar is connected successfully!",
          delay: 2000
        });
      });
    });
  }

  ngAfterViewInit() {
    this.googleInit();
  }
}
