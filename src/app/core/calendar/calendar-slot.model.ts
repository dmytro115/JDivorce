import { Deserializable } from './../../core/deserializable.model';

export class CalendarSlot implements Deserializable {
  start_time: string;
  end_time: string;
  availability: boolean;
  profile_id: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
