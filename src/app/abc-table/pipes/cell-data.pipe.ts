import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cellData'
})
export class CellDataPipe implements PipeTransform {
  /**
   * return cell data as array
   * @param data row data
   * @param property data property string
   */
  transform(data: any, property: string): any {
    const keys = property.split('.');
    const lastIndex = keys.length - 1;
    let target = data;

    keys.forEach((key, index) => {
      target = target[key];

      if (index !== lastIndex && !target) {
        target = {} as any;
      }
    });

    return (target instanceof Array) ? target : [target];
  }
}
