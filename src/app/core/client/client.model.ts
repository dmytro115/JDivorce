import { Deserializable } from '../deserializable.model';

export class Client implements Deserializable {
  id: string;
  email: string;
  showDeluxePlan: boolean;
  showFreePlan: boolean;
  forms: any;
  current_plan: {
    id: string,
    short_description: string
  };
  zip: number;
  picture_url: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
