import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, ReplaySubject} from "rxjs";
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ContactUsService {
  private URL: string = "/api/public/contact";

  constructor(private http: HttpClient) { }

  sendContactUsRequest(email: string, name: string, feedback: string, subject: string, phone: string, topics: string) {
    return this.http.post<any>(this.URL, {
      email: email,
      name: name,
      feedback: feedback,
      subject: subject,
      phone: phone,
      topics: topics
    }, httpOptions);
  }

  sendLawyerEmail(email: string, content: string): Observable<any> {
    console.log(email);
    console.log(content);
    return this.http.post<any>('/api/lawyer/send_email', {
      email: email,
      content: content,
    }, httpOptions);
  }
}
