import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    return this.checkLogin(url);
  }
  // TODO: check roles and redirect
  checkLogin(url: string): boolean {
    if (this.authService.isAuthorized()) {
      return true;
    }

    // Redirect to login with redirect URL.
    this.router.navigate(['/auth/login', { redirect: url }]);
  }
}
