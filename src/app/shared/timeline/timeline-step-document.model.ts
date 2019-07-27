import { Deserializable } from './../../core/deserializable.model';

export class TimelineStepDocument implements Deserializable {
  title: string;
  notes: string;
  url: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
