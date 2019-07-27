import { Deserializable } from '../deserializable.model';

export class VerixResponse implements Deserializable {
  verix_user_id: string;
  user_id: string;
  payload: Map<any, any>;
  verix_data: Map<any, any>;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
