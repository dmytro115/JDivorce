import { HttpClient, HttpHeaders, HttpParams, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from './api-response.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export class BaseService {
  constructor(private readonly http: HttpClient) {}

  get<T>(url: string, params = {}, operation = 'operation'): Observable<T> {
    // Assign query params to the request.
    let httpParams = new HttpParams();
    if (Object.keys(params).length > 0) {
      Object.keys(params).forEach((key: string) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http
      .get<ApiResponse>(url, { params: httpParams })
      .pipe(map((res: ApiResponse) => res.response))
      .pipe(catchError(this.handleError<ApiResponse>(operation)));
  }

  postAny<T>(url: string, params = {}, operation = 'operation'): Observable<T> {
    return this.http.post<any>(url, params, httpOptions).pipe(catchError(this.handleError(operation)));
  }

  post<T>(url: string, params = {}, operation = 'operation'): Observable<T> {
    let postHttpOptions = httpOptions as {};
    if (params['reportProgress'] !== undefined) {
      postHttpOptions = httpOptions['reportProgress'] = params['reportProgress'];
    }

    return this.http
      .post<ApiResponse>(url, params, postHttpOptions)
      .pipe(map((res: ApiResponse) => res.response))
      .pipe(catchError(this.handleError(operation)));
  }

  put<T>(url: string, params = {}, operation = 'operation'): Observable<T> {
    return this.http
      .put<ApiResponse>(url, params, httpOptions)
      .pipe(map((res: ApiResponse) => res.response))
      .pipe(catchError(this.handleError(operation)));
  }

  protected baseUrl(): string {
    throw new Error('This method needs to be implemented.');
  }

  protected makeUrl(suffix = ''): string {
    return `${this.baseUrl()}/${suffix}`;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<ApiResponse> {
    return (error: any): Observable<ApiResponse> => {
      // TODO: send the error to remote logging infrastructure
      // tslint:disable-next-line: no-console
      console.log(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return throwError(error);
    };
  }
}
