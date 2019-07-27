import { Deserializable } from './../../core/deserializable.model';

export class Form implements Deserializable {
  id: string;
  name: string;
  url: string;
  token: string;
  title: string;
  description: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
