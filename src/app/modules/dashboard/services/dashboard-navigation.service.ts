import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardNavigationService {
  private readonly nextTab = new Subject<any>();
  // tslint:disable-next-line: member-ordering
  nextTab$ = this.nextTab.asObservable();

  goToNextTab(): void {
    this.nextTab.next();
  }
}
