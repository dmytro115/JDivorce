import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../core/services/api-response.model";
import { BaseService } from "../../core/services/base-service";
import { VerixResponse } from "./verix-response.model";
import { VerixStatus } from "./verix-status.model";

@Injectable({
  providedIn: "root"
})
export class VerixService extends BaseService {
  private AUTH_URL: string = "/api/verix/auth";
  private AUTH_PHONE_URL: string = "/api/verix/authorize_phone_number";
  private AUTH_STATUS_URL: string = "/api/verix/auth_status";
  private DATA_URL: string = "/api/verix/data";
  private CLEAR_DATA_URL: string = "/api/verix/clear_data";
  private FETCH_PRIVATE_TOKEN_URL: string =
    "/api/verix_connect/fetch_private_token";

  private IMPORT_DATA_URL: string = "/api/verix_connect/import_data";

  constructor(private _http: HttpClient) {
    super(_http);
  }

  auth(authParams: Map<string, string>): Observable<VerixResponse> {
    return this.post(this.AUTH_URL, authParams, "auth");
  }

  authPhone(code: number): Observable<any> {
    return this.post(this.AUTH_PHONE_URL, { code: code }, "authPhone").pipe(
      map((status: VerixStatus) => {
        return new VerixStatus().deserialize(status);
      })
    );
  }

  authStatus(): Observable<VerixStatus> {
    return this.post(this.AUTH_STATUS_URL, null, "authStatus").pipe(
      map((status: VerixStatus) => {
        return new VerixStatus().deserialize(status);
      })
    );
  }

  data(): Observable<VerixResponse> {
    return this.post(this.DATA_URL, null, "data");
  }

  clearData(): Observable<any> {
    return this.post(this.CLEAR_DATA_URL, null, "clearDta");
  }

  fetchPrivateToken(public_token) {
    return this.post(this.FETCH_PRIVATE_TOKEN_URL, { public_token }, null);
  }

  importData(private_token) {
    return this.post(this.IMPORT_DATA_URL, { private_token }, null);
  }
}
