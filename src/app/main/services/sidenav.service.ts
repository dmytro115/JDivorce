import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  largeDock = false;

  private readonly sidenavToggle = new Subject<any>();
  private readonly sidenavOpenedChange = new Subject<boolean>();
  private readonly largeDockChanged = new Subject<boolean>();
  // tslint:disable-next-line: member-ordering
  sidenavToggle$ = this.sidenavToggle.asObservable();

  // tslint:disable-next-line: member-ordering
  sidenavOpened$ = this.sidenavOpenedChange.asObservable();
  // tslint:disable-next-line: member-ordering
  largeDock$ = this.sidenavOpenedChange.asObservable();

  toggleSideNav(): void {
    if (!$('body').hasClass('is-mobile')) {
      $('body').toggleClass('mini-sidebar');
      this.sidenavToggle.next();
    } else {
      this.sidenavToggle.next();
    }
  }

  emitSidenavOpenedChange(opened: boolean): void {
    this.sidenavOpenedChange.next(opened);
  }

  toggleLargeDock(): void {
    this.largeDock = !this.largeDock;
    this.largeDockChanged.next();
  }
}
