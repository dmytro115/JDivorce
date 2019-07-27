import { BaseModel } from '../base.model';
import { Deserializable } from '../deserializable.model';

export class Notification extends BaseModel implements Deserializable{
  is_read:boolean = false;
  id: any;
  
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
