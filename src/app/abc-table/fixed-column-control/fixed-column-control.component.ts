import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CellDefinition, TableColumnData} from '../table/table.component';
import {
  getChildrenFromColumnsWithCellDefinition,
  isCellDefinitionContainedInColumns
} from '../util/column-definition.util';

@Component({
  selector: 'app-fixed-column-control',
  templateUrl: './fixed-column-control.component.html',
  styleUrls: ['./fixed-column-control.component.scss']
})
export class FixedColumnControlComponent implements OnInit {
  @Input() columns: TableColumnData[] = [];
  @Input() cellDefinitions: CellDefinition[] = [];
  @Input() fixableCellDefinitions: CellDefinition[] = [];
  @Input() fixedCellDefinitions: CellDefinition[] = [];
  @Output() fixedCellDefinitionsChange: EventEmitter<CellDefinition[]> = new EventEmitter<CellDefinition[]>();

  fixedColumnSize = '0';

  constructor() { }

  ngOnInit() {
  }

  adjustSize(event: Event) {
    const input = event.target as HTMLInputElement;
    const size = parseInt(input.value, null);

    if (size < 0 || (input.value === undefined || input.value === null || input.value === '')) {
      this.fixedColumnSize = '0';
    } else if (size > this.fixableCellDefinitions.length) {
      this.fixedColumnSize = this.fixableCellDefinitions.length.toString();
    }

    input.value = this.fixedColumnSize;
  }

  /**
   * when fixed size changed, add cell definitions to fixedCellDefinitions array
   * @param value fixed size
   */
  onChangeFixedSize(value: string) {
    const size = parseInt(value, null);
    const fixedCellDefinitions = [];

    this.fixableCellDefinitions.forEach((cellDefinition: CellDefinition, index: number) => {
      if (index < size) {
        fixedCellDefinitions.push(cellDefinition, ...this.getChildrenCellDefinitions(cellDefinition));
      }
    });

    this.fixedCellDefinitionsChange.emit(fixedCellDefinitions);
  }

  /**
   * return children cell definition of parent cell definition
   * @param parentCellDefinition parent cell definition
   */
  private getChildrenCellDefinitions(parentCellDefinition: CellDefinition) {
    const children = getChildrenFromColumnsWithCellDefinition(parentCellDefinition, this.columns);

    return this.cellDefinitions.filter(cellDefinition => isCellDefinitionContainedInColumns(cellDefinition, children));
  }
}
