import { Deserializable } from '../deserializable.model';

export class ApiResponse implements Deserializable {
  status: string;
  code: number;
  error: string;
  response: any;

  deserialize(input: any) {
    Object.assign(this, input);

    return this;
  }
}
