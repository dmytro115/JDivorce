import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'length'
})
export class LengthPipe implements PipeTransform {
  private meterPerMile: number = 1609.34;

  transform(value: number, from: string, to: string): number {
    let miles = Math.round(value / this.meterPerMile);
    return miles;
  }
}
