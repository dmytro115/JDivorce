import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelpSidebarService {
  private readonly sidebarToggle = new Subject<any>();

  // tslint:disable-next-line: member-ordering
  sidebarToggle$ = this.sidebarToggle.asObservable();

  // tslint:disable-next-line: no-empty
  constructor() {}

  toggleSidebar(question: any): void {
    this.sidebarToggle.next(question);
  }
}
