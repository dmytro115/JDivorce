import { CalendarSlot } from '../../core';

export interface ProfessionalProfile {
  id: string;
  is_public: boolean;
  is_accepting_clients: boolean;
  raw_response: any;
  info: any;
  slug: string;
  calendarSlots: CalendarSlot[];
}
