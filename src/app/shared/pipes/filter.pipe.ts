
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], predicate: (item: T) => boolean): T[] {
    if (!items || !predicate) {
      return items;
    }
    return items.filter(predicate);
  }
}
