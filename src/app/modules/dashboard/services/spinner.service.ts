import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
   // Set to `false` by default. Only required modules will make it true (eg. case-info, documents).
  isLoadingListner = new BehaviorSubject<any>({ isLoading: false, isLoadingText: '' });

  getSpinnerListener(): Observable<any> {
    return this.isLoadingListner.asObservable();
  }

  isLoading(spinnerInfo: { isLoading: boolean; isLoadingText: string }): void {
    this.isLoadingListner.next(spinnerInfo);
  }
}
