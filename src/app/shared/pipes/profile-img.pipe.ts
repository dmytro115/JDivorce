import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'profileImg'
})
export class ProfileImgPipe implements PipeTransform {
  private types = {
    'lawyer': environment.localUrl + '/assets/images/profile/default-lawyer.svg',
    'client': environment.localUrl + '/assets/images/profile/default-lawyer.svg'
  };

  transform(value: string, type: string): string {
    if (!this.types[type]) {
      throw new Error('Invalid type: ' + type);
    }

    return value || this.types[type];
  }
}
