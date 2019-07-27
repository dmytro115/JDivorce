import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plansFilter'
})
export class PlansFilterPipe implements PipeTransform {
  transform(items: any[], options: any[]): any {
    return items.filter(item => {
      const ids = item.info.plans.map(p => p.id);

      let included = options.some(option => {
        return option.value && ids.includes(option.id);
      });

      return included;
    });
  }
}
