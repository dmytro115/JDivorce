import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isRequired'
})
export class IsRequiredPipe implements PipeTransform {
  transform(qid: string, validation: Array<string>): boolean {
    return validation && validation.includes('required');
  }
}
