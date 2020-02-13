import {CellDataPipe} from '../pipes/cell-data.pipe';
import {SortedColumn} from '../table/table.component';

/**
 * sort data as ascending
 * @param a data 1
 * @param b data 2
 */
export function sortMethodAsc(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}

/**
 * sort data with order
 * @param order sort order
 */
export function sortMethodWithOrder(order: 'asc' | 'desc') {
  if (order === undefined || order === 'asc') {
    return sortMethodAsc;
  } else {
    return (a, b) => {
      return -sortMethodAsc(a, b);
    };
  }
}

/**
 * sort data with ordered column
 * @param property property string
 * @param order sort order
 */
export function sortMethodWithOrderByColumn(property, order: 'asc' | 'desc') {
  const cellDataPipe = new CellDataPipe();
  const sortMethod = sortMethodWithOrder(order);
  return (a, b) => {
    const v1 = cellDataPipe.transform(a, property);
    const v2 = cellDataPipe.transform(b, property);

    return sortMethod(v1 && v1[0], v2 && v2[0]);
  };
}

/**
 * sort data with ordered multiple columns
 * @param sortedColumns sorted column list
 */
export function sortMethodWithOrderMultiColumn(sortedColumns: SortedColumn[]) {
  const sortMethodsForColumn = (sortedColumns || []).map(item => sortMethodWithOrderByColumn(item.property, item.order));

  return (a, b) => {
    let sorted = 0;
    let index = 0;

    while (sorted === 0 && index < sortMethodsForColumn.length) {
      sorted = sortMethodsForColumn[index++](a, b);
    }

    return sorted;
  };
}
