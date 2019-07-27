import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { LawyerCalendarService } from '../../../../core';
import { ProfileService } from '../../profile.service';
import { ProfileTabComponent } from '../profile-tab.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent extends ProfileTabComponent implements OnInit {
  _isConnected: boolean = undefined;
  calendarForm: FormGroup;

  earliestStartTimes = [
    { label: '8am', value: 8 },
    { label: '9am', value: 9 },
    { label: '10am', value: 10 },
    { label: '11am', value: 11 },
    { label: '12pm', value: 12 },
    { label: '1pm', value: 13 },
    { label: '2pm', value: 14 },
    { label: '3pm', value: 15 },
    { label: '4pm', value: 16 },
    { label: '5pm', value: 17 }
  ];

  latestEndTimes = [
    { label: '9am', value: 9 },
    { label: '10am', value: 10 },
    { label: '11am', value: 11 },
    { label: '12pm', value: 12 },
    { label: '1pm', value: 13 },
    { label: '2pm', value: 14 },
    { label: '3pm', value: 15 },
    { label: '4pm', value: 16 },
    { label: '5pm', value: 17 },
    { label: '6pm', value: 18 }
  ];

  appointmentDurations = [
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 }
  ];
  schedulingNotices = [
    { label: '0 minutes', value: 0 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: '4 hours', value: 240 },
    { label: '1 day', value: 1440 },
    { label: '2 days', value: 2880 },
    { label: '3 days', value: 4320 },
    { label: '4 days', value: 5760 },
    { label: '5 days', value: 7200 },
    { label: '6 days', value: 8640 },
    { label: '7 days', value: 10080 }
  ];
  appointmentBuffers = [
    { label: '0 minutes', value: 0 },
    { label: '5 minutes', value: 5 },
    { label: '10 minutes', value: 10 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '1 hour', value: 60 }
  ];
  daysOfWeek = [
    { label: 'Sun', value: 0 },
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 }
  ];
  rangeTypes = [
    { label: 'Over a period of rolling days', value: 'rolling', hint: 'Your clients will be offered availabilities for the number of days into the future.' },
    { label: 'Indefinitely', value: 'indefinitely', hint: 'Your invites will be offered availabilities indefinitely into the future.' }
  ];

  constructor(protected profileService: ProfileService, private readonly calendarService: LawyerCalendarService) {
    super(profileService);
  }

  onInit(): void {
    this.calendarForm = new FormGroup({
      calendar_settings: new FormGroup({
        earliest_start_time: new FormControl('', Validators.required),
        latest_end_time: new FormControl('', Validators.required),
        appointment_duration: new FormControl('', Validators.required),
        minimum_scheduling_notice: new FormControl('', Validators.required),
        days_of_week: new FormControl('', Validators.required),
        appointment_buffer: new FormGroup({
          before: new FormControl('', Validators.required),
          after: new FormControl('', Validators.required)
        }),
        range: new FormGroup({
          type: new FormControl('', Validators.required),
          value: new FormControl('')
        })
      })
    });
    this.profileService.emitSaveButton(true);

    this.calendarService.isCalendarConnected().subscribe((isConnected: boolean) => {
      this._isConnected = isConnected;
    });

    this.profileService.change.subscribe(() => {
      const settings = this.profileService.profile.info.calendar_settings;
      this.formGroup().get('earliest_start_time').setValue(parseInt(settings.earliest_start_time, 10));
      this.formGroup().get('latest_end_time').setValue(parseInt(settings.latest_end_time, 10));
      this.formGroup().get('appointment_duration').setValue(parseInt(settings.appointment_duration, 10));
      this.formGroup().get('minimum_scheduling_notice').setValue(parseInt(settings.minimum_scheduling_notice, 10));
      this.formGroup().get('days_of_week').setValue(settings.days_of_week);
      this.formGroup().get('appointment_buffer').get('before').setValue(parseInt(settings.appointment_buffer.before, 10));
      this.formGroup().get('appointment_buffer').get('after').setValue(parseInt(settings.appointment_buffer.after, 10));
      this.formGroup().get('range').get('type').setValue(settings.range.type);
      if (settings.range.type === 'rolling') {
        this.formGroup().get('range').get('value').setValidators([Validators.required]);
      }
      if (settings.range.value) {
        this.formGroup().get('range').get('value').setValue(parseInt(settings.range.value, 10));
      }
      this.profileService.onFieldChange(this.form());
    });

    this.formGroup().get('range').get('type').valueChanges.subscribe(value => {
      if (value === 'rolling') {
        this.formGroup().get('range').get('value').setValidators([Validators.required]);
      } else {
        this.formGroup().get('range').get('value').setValidators(undefined);
      }
    });
  }

  form(): FormGroup {
    return this.calendarForm;
  }

  formGroup(): AbstractControl {
    return this.calendarForm.get('calendar_settings');
  }

  // Override the function profile-tab.component to use "formGroup()".
  // TODO: This is messy, fix it.
  isFieldError(key, group = null): boolean {
    let control;
    if (group) {
      control = this.formGroup()['controls'][group]['controls'][key];
    } else {
      control = this.formGroup()['controls'][key];
    }
    const errors = control.errors;

    return errors && (control.dirty || control.touched);
  }

  appointmentTypeHint(): string {
    const selectedValue = this.formGroup().get('range').get('type').value;
    const type = this.rangeTypes.find(type => type.value === selectedValue);
    if (type) {
      return type.hint;
    } else {
      return 'How far in advance can your clients schedule appointments with you?';
    }
  }

  isRangeTypeRolling(): boolean {
    return this.formGroup().get('range').get('type').value === 'rolling';
  }

  connect(isConnected: boolean): void {
    this._isConnected = isConnected;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }
}
