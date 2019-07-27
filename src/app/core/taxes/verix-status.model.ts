import { Deserializable } from '../deserializable.model';

export class VerixStatus implements Deserializable {
  static readonly REGISTRATION_IN_PROGRESS: string = 'registration_in_progress';
  static readonly REGISTERED: string = 'registered';
  static readonly READY_FOR_PHONE_AUTH: string = 'ready_for_phone_auth';
  static readonly PHONE_AUTH_IN_PROGRESS: string = 'phone_auth_in_progress';
  static readonly TAX_DATA_PROCESSING: string = 'tax_data_processing';
  static readonly TAX_DATA_AVAILABLE: string = 'tax_data_available';

  static readonly PHONE_AUTH_SUBMITTED: string = 'phone_auth_submitted';

  status: string;
  intermediate_status: string;

  private statusPercentageComplete = {
    registration_in_progress: 1/7,
    registered: 2/7,
    ready_for_phone_auth: 3/7,
    phone_auth_submitted: 4/7,
    phone_auth_in_progress: 5/7,
    tax_data_processing: 6/7,
    tax_data_available: 1
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }

  percentageComplete() {
    if (!this.status) return 0;
    return Math.ceil(this.statusPercentageComplete[this.status] * 100);
  }
}
