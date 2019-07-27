import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-landing',
  templateUrl: './auth-landing.component.html',
  styleUrls: ['./auth-landing.component.scss']
})
export class AuthLandingComponent implements OnInit {
  // These are the route names, ie. /auth/login, /auth/password-reset, etc.
  authType: string;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramsAsMap => {
      this.authType = paramsAsMap['params']['authType'];
    });
  }

  isVerify(): boolean {
    return this.authType === 'verify';
  }

  isSignin(): boolean {
    return this.authType === 'login';
  }

  isResetPassword(): boolean {
    return this.authType === 'password-reset';
  }

  isRegister(): boolean {
    return this.authType === 'register';
  }

  isForgetPass(): boolean {
    return this.authType === 'password-recovery';
  }
}
