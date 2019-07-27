import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Notification, NotificationService } from '../../core';
import { AuthDialogService, AuthService, UserAuthorization } from '../../core/auth';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  langToFlagsNameMap: any = {
    en: 'us',
    'es-MX': 'mx'
  };

  user: any = {};
  flagName = 'us';
  isGuest = false;
  email: string;
  notifications: Array<Notification> = [];
  hasUnreadNotifications = false;
  notificationChangeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  currentUser$: BehaviorSubject<UserAuthorization> = new BehaviorSubject({ user: null, expired: false });
  private readonly unsubscribe: Subject<void> = new Subject();
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;

  constructor(
    private readonly translate: TranslateService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notificationService: NotificationService,
    private readonly authDialogService: AuthDialogService,
    private readonly sidenavService: SidenavService
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.flagName = this.langToFlagsNameMap[this.translate.currentLang];
    });
  }

  ngOnInit(): void {
    $('body').addClass('mini-sidebar');
    this.user = this.authService.getCurrentUser();
    this.isGuest = this.user['email'] === undefined;

    // current user as Observable
    this.authService.currentUser$.next({
      user: {
        id: this.user.id,
        email: this.user.email,
        access_token: this.user.token,
        role: this.authService.getRole()
      },
      expired: false
    });
    this.currentUser$ = this.authService.currentUser$;

    this.route.queryParams.subscribe(params => {
      if (params.hire) {
        this.notificationService.readNotification(params.notify_id).subscribe((data: any) => {
          this.notificationChangeEvent.emit(true);
        });

        this.notificationService.updateNotification(params.notify_id, params.hire).subscribe((data: any) => {
          this.notificationChangeEvent.emit(true);
          this.loadNotifications();
          this.notificationService.isUpdateNotification = true;
          this.notificationService.notificationUpdate.next(this.notificationService.isUpdateNotification);
        });
      } else {
        this.currentUser$.pipe(takeUntil(this.unsubscribe)).subscribe((userAuth: UserAuthorization) => {
          if (userAuth && userAuth.expired) {
            // TODO: Add redirect URL.
            this.router.navigate(['/auth/login']);
          }
          if (this.authService.isAuthorized()) {
            this.loadNotifications();
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  logout() {
    this.authService.logout(data => {
      this.router.navigate(['/']);
    });
  }

  displayEmail() {
    if (this.isGuest) {
      return 'Guest';
    } else {
      this.getFormatedEmail(this.user['email']);
    }
  }

  getFormatedEmail(email: string) {
    if (email.length > 9) {
      return email.split('@')[0].slice(0, 9) + '...';
    } else {
      return email.split('@')[0];
    }
  }

  handleFixToggler(): void {
    this.sidenavService.toggleLargeDock();
    this.sidenavService.toggleSideNav();
  }

  loadNotifications() {
    this.hasUnreadNotifications = false;
    this.notificationService.getNotifications().subscribe((data: any) => {
      this.notifications = data.response;
      for (const notification of this.notifications) {
        if (!notification.is_read) {
          this.hasUnreadNotifications = true;
          break;
        }
      }
    });
  }

  openMyMenu() {
    this.matMenuTrigger.openMenu();
  }

  goToOrdersPage() {
    if (this.authService.isClient()) {
      this.router.navigate(['a/c/orders']);
    } else {
      this.router.navigate(['a/l/orders']);
    }
  }

  triggerSignup(): void {
    this.authDialogService.openSignupDialog({ hideLawyerSignup: true, hideLogin: true });
  }
}
