import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { BaseService } from '../../core/services/base-service';
import { CalendarSlot } from './calendar-slot.model';

@Injectable({
  providedIn: 'root'
})
export class LawyerCalendarService extends BaseService {
  private GET_SLOTS_URL: string = '/api/lawyers/calendar/get_slots';
  private GET_LAWYER_SLOTS_URL: string = '/api/lawyers/calendar/get_lawyer_slots';
  private IS_CALENDAR_CONNECTED_URL: string = '/api/user/is_calendar_connected';

  constructor(private _http: HttpClient) { super(_http); }

  getSlots(date: string, lawyerIds: Array<string>): Observable<Map<string, Array<CalendarSlot>>> {
    return this.post(this.GET_SLOTS_URL, { date: date, lawyer_ids: lawyerIds }, 'getSlots');
  }

  getLawyerSlots(date: string, lawyerId: string): Observable<Map<string, Array<CalendarSlot>>> {
    return this.post(this.GET_LAWYER_SLOTS_URL, { date: date, lawyer_id: lawyerId }, 'getLawyerSlots');
  }

  isCalendarConnected(): Observable<boolean> {
    return this.post(this.IS_CALENDAR_CONNECTED_URL, null, 'isCalendarConnected');
  }
}
