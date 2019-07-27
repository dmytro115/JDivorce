import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarSlot, Lawyer, LawyerCalendarService, ProfessionalProfile, SlotSelectionService } from '../../../core';

import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-lawyer-calendar-selection',
  templateUrl: './lawyer-calendar-selection.component.html',
  styleUrls: ['./lawyer-calendar-selection.component.scss']
})
export class LawyerCalendarSelectionComponent implements OnInit {
  @Input() profile: ProfessionalProfile;
  @Output() selectSlot: EventEmitter<CalendarSlot> = new EventEmitter<CalendarSlot>();

  public slideConfig: any = {
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true
  };
  public appointmentDate: Moment = moment().add(1, 'days');
  public slots: CalendarSlot[] = [];
  public selectedSlot: CalendarSlot;

  constructor(private lawyerCalendarService: LawyerCalendarService, private slotSelectionService: SlotSelectionService) { }

  ngOnInit() {
    this.loadLawyerSlots();

    // Clear the current calendar component's selected slot if there's another component with a selected slot.
    this.slotSelectionService.selectedSlot$.subscribe((slot: CalendarSlot) => {
      if (slot != this.selectedSlot) {
        this.selectedSlot = null;
      }
    });
  }

  loadLawyerSlots() {
    this.lawyerCalendarService.getLawyerSlots(this.appointmentDate.format('MM/DD/YYYY'), this.profile.id).subscribe((response: any) => {
      this.slots = response;
    });
  }

  onSlotClick(slot) {
    if (this.selectedSlot == slot) {
      this.selectedSlot = null;
    } else {
      this.selectedSlot = slot;
    }
    this.slotSelectionService.setSelectedSlot(this.selectedSlot);
  }

  isSlotSelected(slot) {
    return this.selectedSlot == slot;
  }

  dateBack() {
    this.appointmentDate = this.appointmentDate.subtract(1, 'days');
    this.loadLawyerSlots();
  }

  dateForward() {
    this.appointmentDate = this.appointmentDate.add(1, 'days');
    this.loadLawyerSlots();
  }
}
