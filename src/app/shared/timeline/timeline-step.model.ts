import { TimelineStepDocument } from './timeline-step-document.model';
import { Deserializable } from './../../core/deserializable.model';

export class TimelineStep implements Deserializable {
  stepTitle: string;
  summary: string;
  ownerDesc: string;
  durationDesc: string;
  costDesc: string;
  instructions: string[];
  documents: TimelineStepDocument[];
  duration: string;
  cost: number;
  owner: string;
  date: string;
  isCollapsed: boolean;

  deserialize(input: any) {
    Object.assign(this, input);
    this.documents = [];
    for (let stepDocument of input.documents) {
      this.documents.push(new TimelineStepDocument().deserialize(stepDocument));
    }
    return this;
  }
}
