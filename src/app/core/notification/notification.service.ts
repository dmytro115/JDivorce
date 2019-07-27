import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Notification } from './notification.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  isUpdateNotification: boolean = false;
  notificationUpdate: Subject<boolean> = new Subject<boolean>();

  private URL: string = "/api/notifications/notifications";

  private INVITE_URL: string = "/api/notifications/invite_notifications";

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<Notification> {
    return this.http.post<any>(this.URL + "/list", {}, httpOptions);
  }

  readNotification(id): Observable<Notification> {
    return this.http.post<any>(this.URL + "/read", { id: id }, httpOptions);
  }

  getDetails(id): Observable<Notification> {
    return this.http.post<any>(this.INVITE_URL + "/get_inviter_details", { id: id }, httpOptions);
  }

  acceptNotification(id): Observable<Notification> {
    return this.http.post<any>(this.INVITE_URL + "/accept", { id: id }, httpOptions);
  }

  rejectNotification(id): Observable<Notification> {
    return this.http.post<any>(this.INVITE_URL + "/reject", { id: id }, httpOptions);
  }

  updateNotification(id, type): Observable<Notification> {
    return this.http.post<any>(this.INVITE_URL + "/" + type, { id: id }, httpOptions);
  }
}
