import {FilterChangeEvent} from '../table-filter/table-filter.component';
import {DateChangeEvent} from '../datepicker/datepicker.component';
import {NumberChangeEvent} from '../number-input/number-input.component';
import {CellDataPipe} from '../pipes/cell-data.pipe';
import {CellDefinition} from '../table/table.component';

const cellDataPipe = new CellDataPipe();

/**
 * filter all fields
 * @param filter filter event
 * @param data data to filter
 * @param cellDefinitions cell definitions
 */
export function filterAll(filter: FilterChangeEvent, data: any, cellDefinitions: CellDefinition[]) {
  const filtered = cellDefinitions.filter(cellDefinition => {
    if (cellDefinition.property) {
      const target = cellDataPipe.transform(data, cellDefinition.property)[0] || null;

      return filterStringType(filter.value as string, target);
    }
  });

  return filtered.length > 0;
}

/**
 * filter by data type
 * @param filter filter event
 * @param data data
 */
export function filterByType(filter: FilterChangeEvent, data: any) {
  const {value, property} = filter;
  const target = cellDataPipe.transform(data, property)[0] || null;

  switch (filter.dataType) {
    case 'date': {
      return filterDateType(value as DateChangeEvent, target);
    }

    case 'number': {
      return filterNumberType(value as NumberChangeEvent, target);
    }

    default: {
      return filterStringType(value as string, target);
    }
  }
}

/**
 * filter date type data
 * @param value from, to date string from date filter
 * @param target target value
 */
export function filterDateType(value: DateChangeEvent, target: any) {
  if (target) {
    const targetTime = new Date(target);
    const startTime = new Date(value.from);
    const endTime = new Date(value.to);

    startTime.setHours(0);
    endTime.setHours(0);

    let from = true;
    let to = true;

    if (value.from) {
      from = targetTime.getTime() >= startTime.getTime();
    }

    if (value.to) {
      to = targetTime.getTime() <= endTime.getTime();
    }

    return from && to;
  }
}

/**
 * filter number type data
 * @param value from, to number from number filter
 * @param target target value
 */
export function filterNumberType(value: NumberChangeEvent, target: any) {
  if (target) {
    return target >= value.from && target <= value.to;
  }
}

/**
 * filter string type data
 * @param value string value
 * @param target target value
 */
export function filterStringType(value: string, target: any) {
  if (target !== null && target !== undefined) {
    if (value.trim() === '') {
      return true;
    } else {
      return (target as any).toString().toLowerCase().indexOf(value) !== -1;
    }
  }
}
