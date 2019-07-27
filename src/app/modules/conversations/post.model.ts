import { Deserializable } from './../../core/deserializable.model';

export class Post implements Deserializable {
  id: string;
  user_id: string;
  form_id: string;
  content: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
