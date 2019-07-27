import { Deserializable } from './../../core/deserializable.model';

export class Comment implements Deserializable {
  post_id: string;
  user_id: string;
  form_id: string;
  content: string;
  created_at: string;
  user: {
    email: string,
    name: string
  };

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
