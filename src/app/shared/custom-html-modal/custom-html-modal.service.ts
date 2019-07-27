import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomHtmlModalService {

  private MODAL_STREAM = new Subject();
  public MODAL_STREAM$ = this.MODAL_STREAM.asObservable();

  constructor() { }

  show(block) {
    this.MODAL_STREAM.next(block);
  }

  hide() {
    this.MODAL_STREAM.next(null);
  }
}
