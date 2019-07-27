import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AuthService, LawyerProfileService, LawyerService, ProfessionalProfile } from 'src/app/core';
import { PNotifyService } from './../../core/pnotify/pnotify.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  @Output() invalidForm: EventEmitter<boolean> = new EventEmitter();

  isValid: boolean;
  profile: ProfessionalProfile;

  pnotify: any;

  private readonly showSaveButton = new Subject<boolean>();
  // tslint:disable-next-line: member-ordering
  showSaveButton$: Observable<any> = this.showSaveButton.asObservable();
  private readonly CREATE_CALENDAR = '/api/google/auth_calendars/create_calendar';

  constructor(
    private readonly professionalProfileService: LawyerProfileService,
    private readonly lawyerService: LawyerService,
    private readonly authService: AuthService,
    private readonly pnotifyService: PNotifyService,
    private readonly http: HttpClient
  ) {
    this.pnotify = pnotifyService.get();
  }

  emitSaveButton(value: boolean): void {
    this.showSaveButton.next(value);
  }

  set(profile): void {
    this.profile = profile;
    this.formatLawyerFormats(profile.info);
    this.change.emit();
  }

  fetchData(): void {
    const currentUser = this.authService.getCurrentUser();
    this.professionalProfileService.show(currentUser.id).subscribe(profile => {
      // set default calendar_settings data
      if (typeof profile.info['calendar_settings'] === 'undefined') {
        profile.info['calendar_settings'] = {
          earliest_start_time: '9',
          latest_end_time: '17',
          days_of_week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          appointment_duration: '60',
          minimum_scheduling_notice: '0',
          appointment_buffer: {
            before: '0',
            after: '0'
          },
          range: {
            type: 'indefinitely',
            value: null
          }
        };
      }
      this.set(profile);
    });
  }

  update(field: string, value: any): void {
    this[field] = value;
    this.change.emit();
  }

  changeInfo(name: string, value: any): void {
    this.profile.info[name] = value;
    this.professionalProfileService.update({
      lawyer_id: this.authService.getCurrentUser().id,
      lawyer: { info: this.profile.info }
    }).subscribe(
      response => {
        this.change.emit();
      },
      err => console.log(err)
    );
  }

  submit(successText = 'Your changes are saved!'): void {
    if (this.isValid) {
      this.professionalProfileService.update({
        lawyer_id: this.authService.getCurrentUser().id,
        lawyer: { info: this.profile.info }
      }).subscribe(
        response => {
          this.pnotify.success({
            title: 'Saved!',
            text: successText
          });
          this.change.emit();
        },
        err => console.log(err)
      );
    } else {
      this.invalidForm.emit();
    }
  }

  onFieldChange(form: FormGroup): void {
    this.isValid = form.valid;
    this.profile.info = {...this.profile.info, ...form.value};
  }

  formatLawyerFormats(info: any): void {
    if (info) {
      if (!info.experiences) { info.experiences = []; }
      if (!info.practice_areas) { info.practice_areas = []; }
      if (!info.recent_cases) { info.recent_cases = []; }
      if (!info.video_question_and_answers) {
        info.video_question_and_answers = [];
      }

      info.experiences.forEach(function(experience) {
        experience.from_timestamp = new Date(
          parseInt(experience.from_timestamp) * 1000
        );
        experience.to_timestamp = new Date(
          parseInt(experience.to_timestamp) * 1000
        );
      });
      info.practice_areas.forEach(function(practiceArea) {
        practiceArea.relative_percentage = parseInt(practiceArea.relative_percentage, 10);
      });
      if (info.plans) {
        info.plans.forEach(function(plan) {
          plan.cost = parseInt(plan.cost, 10);
          plan.amount = parseInt(plan.amount, 10);
        });
      }
    }
  }

  createCalendar(lawyerId, authCode): Observable<any> {
    return this.http.post<any>(this.CREATE_CALENDAR, { lawyer_id: lawyerId, auth_code: authCode }, httpOptions);
  }
}
