import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import * as dayjs from 'dayjs';
import { OrderPipe } from 'ngx-order-pipe';
import { CalendarSlot, LawyerCalendarService, LawyerProfileService, ProfessionalProfile, SharedPlanService, SlotSelectionService } from '../../core';
import { ProfileImgPipe } from '../pipes/profile-img.pipe';

import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-lawyers-block',
  templateUrl: './lawyers-block.component.html',
  styleUrls: ['./lawyers-block.component.scss'],
  providers: [ProfileImgPipe],
  animations: [
    trigger('fadeIn', [
      transition(
        '* => *',
        useAnimation(fadeIn, {
          params: { timing: 0.5 }
        })
      )
    ])
  ]
})
export class LawyersBlockComponent implements OnInit {
  @Input() numProfiles = 8;
  @Input() showActions = true;
  @Input() showPlanFilters = true;
  @Input() showSelect = false;
  @Output() selectProfile: any = new EventEmitter<any>();

  _dayjs = dayjs;

  profiles: Array<ProfessionalProfile>;
  defaultPlans: any;

  sortOptions: Array<SelectOption> = [
    { value: 'min_plan.cost', label: 'price (low to high)' },
    { value: 'distance', label: 'distance (nearest first)' },
    {
      value: 'earliest_appointment_time',
      label: 'appointment availability (earliest first)'
    }
  ];
  planOptions: Array<SelectOption> = [{ value: -1, label: '--' }];
  planFilterOptions: Array<SelectOption> = [];
  profileControlForm: FormGroup;

  // This is the plan that is selected from 'analysis', captured via matrix url/
  // TODO: This should also be the plan that is selected from the dropdown when coming to checkout independently.
  selectedPlan: any;
  selectedSlot: CalendarSlot;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly professionalProfileService: LawyerProfileService,
    private readonly lawyerCalendarService: LawyerCalendarService,
    private readonly orderPipe: OrderPipe,
    private readonly profileImgPipe: ProfileImgPipe,
    private readonly sharedPlanService: SharedPlanService,
    private readonly slotSelectionService: SlotSelectionService
  ) {
    this.profileControlForm = new FormGroup({
      sort: new FormControl(this.sortOptions[0].value),
      plan: new FormControl(-1)
    });
  }

  ngOnInit(): void {
    this.loadLawyers();
    this.onChanges();
    this.loadDefaultPlans();

    this.slotSelectionService.selectedSlot$.subscribe((slot: CalendarSlot) => {
      this.selectedSlot = slot;
    });
  }

  loadDefaultPlans(): void {
    this.professionalProfileService.showDefaultPlans().subscribe((plans: Array<any>) => {
      this.defaultPlans = plans;
      this.planFilterOptions = plans.map((plan: any) => ({
        id: plan.id,
        value: plan.id,
        label: plan.name
      }));

      this.planOptions = this.planOptions.concat(this.planFilterOptions);
      const selectedPlanId = this.sharedPlanService.selectedPlanId;
      if (selectedPlanId) {
        this.profileControlForm.get('plan').setValue(this.findPlanFilterOption(selectedPlanId));
      }

      this.setSelectedPlan();
    });
  }

  async loadLawyers(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.professionalProfileService.list(this.numProfiles, [], true).subscribe((profiles: Array<ProfessionalProfile>) => {
        this.profiles = profiles;
        this.loadCalendarSlots();
        resolve();
      });
    });
  }

  loadCalendarSlots(): void {
    const appointmentDate = dayjs().add(1, 'day');
    const lawyerIds = this.profiles.map(profile => profile.id);
    this.lawyerCalendarService.getSlots(appointmentDate.format('MM/DD/YYYY'), lawyerIds).subscribe((response: Map<string, Array<CalendarSlot>>) => {
      this.profiles.forEach(profile => {
        if (response && response[profile.id].length > 0) {
          profile.calendarSlots = response[profile.id];
          profile['earliest_appointment_time'] = dayjs(profile.calendarSlots[0].start_time);
        }
      });
    });
  }

  onChanges(): void {
    this.profileControlForm.get('sort').valueChanges.subscribe(val => {
      if (val === 'distance') {
        const validDistanceProfiles = this.profiles.filter((profile: any) => profile.distance !== null);
        const inValidDistanceProfiles = this.profiles.filter((profile: any) => profile.distance === null);
        this.profiles = this.orderPipe.transform(validDistanceProfiles, val, false).concat(inValidDistanceProfiles);
      } else {
        this.profiles = this.orderPipe.transform(this.profiles, val, false);
      }
    });
  }

  blockPlanDisplayLabel(profile: ProfessionalProfile): string {
    const plan = this.blockPlanDisplay(profile);
    if (plan && plan.short_name) {
      return `The ${plan.short_name} plan at`;
    } else {
      return 'Plans starting from';
    }
  }

  blockPlanDisplayCost(profile: ProfessionalProfile): string {
    const plan = this.blockPlanDisplay(profile);
    if (plan && plan.short_name) {
      return plan.cost;
    } else {
      return profile['min_plan'].cost;
    }
  }

  onPlanSelectionChange(option: SelectOption): void {
    if (option.value === -1) {
      this.selectedPlan = undefined;
      this.planFilterOptions = this.planOptions.slice(1);
      this.showSelect = false;
    } else {
      this.selectedPlan = this.defaultPlans.find((plan: any) => plan.id === option.value);
      this.planFilterOptions = [this.planOptions.find(plan => plan.value === option.value)];
      this.showSelect = true;
    }
  }

  navigateToProfile(router): void {
    const queryParams = {};

    this.router.navigate([router], { queryParams });
  }

  lawyerLocation(profile): string {
    if (profile.info.address) {
      if (profile.info.address.city && profile.info.address.state) {
        return `${profile.info.address.city}, ${profile.info.address.state}`;
      } else if (profile.info.city) {
        return profile.info.address.city;
      } else if (profile.info.address) {
        return profile.info.address.state;
      }
    }

    return undefined;
  }

  profileImage(profile): string {
    return this.profileImgPipe.transform(profile.info.picture_url, 'lawyer');
  }

  onSelect(profile): void {
    const params = {
      p: profile.slug
    };

    if (this.selectedSlot && this.selectedSlot.profile_id === profile.id) {
      params['date'] = this.selectedSlot.start_time; // date=2019-04-23T11:00:00-07:00
    }

    if (this.selectedPlan) {
      params['plan'] = this.selectedPlan.id;
    }

    this.selectProfile.emit({ profile, params });
  }

  appointmentTooltip(profile: ProfessionalProfile): string {
    const name = profile.info.first_name ? `${profile.info.first_name}'s` : 'This';

    return `${name} profile is connected to a calendar so that you can easily schedule appointments.`;
  }

  isConnectedToCalendar(profile: ProfessionalProfile): boolean {
    return (
      profile.info && profile.info.calendar_settings && profile.info.calendar_settings.days_of_week && profile.info.calendar_settings.days_of_week.length > 0
    );
  }

  private blockPlanDisplay(profile: ProfessionalProfile): any {
    if (this.selectedPlan) {
      return profile.info.plans.find((plan: any) => plan.id === this.selectedPlan.id);
    } else {
      return undefined;
    }
  }

  private findPlanFilterOption(planId): SelectOption {
    return this.planOptions.find(plan => plan.value === planId);
  }

  private setSelectedPlan(): void {
    // Grabbing the filtered plan id from 'analysis'.
    // 1. We need to hide the plan filter dropdown.
    // 2. We need to show the cost of the plan in the block.
    this.route.url.subscribe((url: Array<UrlSegment>) => {
      const lawyers = url[0]; // /a/c/checkout/lawyers;plan=2
      if (Object.keys(lawyers.parameters).length === 0) {
        this.showSelect = false;
        this.showPlanFilters = true;
      } else {
        const planIdParam = lawyers.parameters.plan;
        if (planIdParam) {
          const planId = parseInt(planIdParam, 10);
          this.showPlanFilters = false;
          this.selectedPlan = this.findPlanFilterOption(planId);
          this.profileControlForm.get('plan').setValue(this.selectedPlan);
        } else {
          this.showPlanFilters = true;
          this.selectedPlan = undefined;
        }
        this.showSelect = true;
      }
    });
  }
}
