import { BaseModel } from "../base.model";
import { Deserializable } from "../deserializable.model";

export class Lawyer extends BaseModel implements Deserializable {
  id: string;
  email: string;
  info: Map<any, any>;
  first_name: string;
  last_name: string;
  distance: string;
  picture_url: string;
  token: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
