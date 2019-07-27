import { Injectable }   from '@angular/core';
import { Subject }      from 'rxjs';
import { CalendarSlot } from '../../core';

@Injectable({ providedIn: 'root' })
export class SlotSelectionService {
  private slot = new Subject<CalendarSlot>();
  public selectedSlot$ = this.slot.asObservable();

  constructor() {}

  setSelectedSlot(slot: CalendarSlot) {
    this.slot.next(slot);
  }
}
