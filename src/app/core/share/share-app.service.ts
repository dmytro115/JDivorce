import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from '../../core/services/base-service';

@Injectable({
  providedIn: 'root'
})
export class ShareAppService extends BaseService {
  private SHARE_URL: string = '/api/users/share_app/share';

  constructor(private _http: HttpClient) { super(_http); }

  share(email: string): Observable<any> {
    return this.post(this.SHARE_URL, { email: email }, 'share');
  }
}
