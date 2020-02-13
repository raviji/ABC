import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CellDefinition} from '../table/table.component';
import {NumberChangeEvent, NumberInputComponent} from '../number-input/number-input.component';
import {DateChangeEvent, DatepickerComponent} from '../datepicker/datepicker.component';

export type FilterableDataType = 'string' | 'number' | 'date';

export interface FilterChangeEvent {
  property: string;
  dataType: FilterableDataType;
  value: string | {
    from: string | number;
    to: string | number;
  };
}

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit {
  @Input() filterableCellDefinitions: CellDefinition[] = [];
  @Output() filterChange: EventEmitter<FilterChangeEvent> = new EventEmitter<FilterChangeEvent>();

  @ViewChild(NumberInputComponent, {static: false}) private numberInputComponent: NumberInputComponent;
  @ViewChild(DatepickerComponent, {static: false}) private datepickerComponent: DatepickerComponent;

  selectedCellDefinition: CellDefinition = null;
  searchKeyword = '';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  /**
   * handle select change event
   * @param value value
   */
  onSelectChange(value: any) {
    this.searchKeyword = '';

    this.changeDetectorRef.detectChanges();

    if (this.datepickerComponent) {
      const from = this.datepickerComponent.toDateString(this.datepickerComponent.fromDate);

      this.onValueChange({from, to: null});
    } else if (this.numberInputComponent) {
      this.onValueChange({from: 0, to: 0});
    } else {
      this.filterChange.emit(null);
    }
  }

  /**
   * handle filter value change event
   * @param value value
   */
  onValueChange(value: NumberChangeEvent | DateChangeEvent | string) {
    const selected = this.selectedCellDefinition || {} as any;

    this.filterChange.emit({
      property: selected.property,
      dataType: selected.dataType,
      value,
    });
  }
}
