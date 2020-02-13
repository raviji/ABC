import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cellIdentifier'
})
export class CellIdentifierPipe implements PipeTransform {
  /**
   * transform string as dashed lowercase style
   * @param value value to transform
   * @example 'Column 1' > 'column-1'
   */
  transform(value: string): any {
    return value.toLowerCase().replace(/\s/gm, '-');
  }
}
