import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ClientDashboardDataService } from '../client/dashboard-data.service';
import { Client } from './client.model'
import { AuthService } from '../auth/auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ClientService {
  servicePrefix: string = '/api/client';
  docGenCnt: number = 0;

  constructor(
    private http: HttpClient,
    private clientDashboardDataService: ClientDashboardDataService,
    private authService: AuthService
    ) { }

  getCityByZip(zipcode: string): Observable<any> {
    return this.http.get('/api/home/place?zipcode=' + zipcode);
  }

  getClientPublic(id: string): Observable<Client> {
    return this.http.post<Client>('/api/user/get_client_public', { id: id }, httpOptions);
  }

  getAndUpdateLs(): Observable<any> {
    return this.getAndUpdateLsWithClientId(null);
  }

  getAndUpdateLsWithClientId(clientId: string): Observable<any> {
    if (!clientId) {
      let currentUser = this.authService.getCurrentUser();
      clientId = currentUser['id'];
    }

    let url = this.servicePrefix + '/get_and_update_ls';
    let params = { referrer: document.referrer, is_submit: false };
    if (clientId) {
      params['client_id'] = clientId;
    }

    return this.http.post(url, params, httpOptions).pipe(map((response: any) => {
      this.clientDashboardDataService.formatFormsDisplay(response.forms, false /* isLawyer */, response, 'en');
      return response;
    }));
  }

  getClient(): Observable<Client> {
    return this.http.post<Client>('/api/user/get_client', null, httpOptions);
  }

  getPaidLawyer(clientId: string): Observable<Client> {
    return this.http.post<Client>('/api/user/get_paid_lawyer', { client_id: clientId }, httpOptions);
  }

  setDashboardState(state: string): Observable<any> {
    return this.http.post<Client>(this.servicePrefix + '/set_dashboard_state', { state: state }, httpOptions);
  }

  saveFormEditStatus(form_name, status) {
    return this.http.post<Client>(this.servicePrefix + '/questionnaire_edit_status', { form_name: form_name, status: status }, httpOptions);
  }

  getSimilarCases(): Observable<any> {
    return this.http.post<any>(this.servicePrefix + '/get_similar_cases', null, httpOptions);
  }
}
