import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CellDefinition, TableColumnData} from '../table/table.component';
import {
  getChildrenFromColumn,
  isColumnContainedInColumns, isColumnsContainedInColumns, isParentColumn, isSameColumn
} from '../util/column-definition.util';

@Component({
  selector: 'app-visible-column-control',
  templateUrl: './visible-column-control.component.html',
  styleUrls: ['./visible-column-control.component.scss']
})
export class VisibleColumnControlComponent implements OnInit, OnChanges {
  @Input() columns: TableColumnData[] = [];
  @Input() cellDefinitions: CellDefinition[] = [];
  @Input() hiddenCellDefinitions: CellDefinition[] = [];
  @Output() hiddenCellDefinitionsChange: EventEmitter<CellDefinition[]> = new EventEmitter<CellDefinition[]>();

  @Input() hiddenColumns: TableColumnData[] = [];
  @Output() hiddenColumnsChange: EventEmitter<TableColumnData[]> = new EventEmitter<TableColumnData[]>();

  allColumns: TableColumnData[] = [];
  showController = false;

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {columns} = changes;

    if (columns && (columns.previousValue || []).length !== (columns.currentValue || []).length) {
      this.setAllColumns();
    }
  }

  /**
   * detect outside click and hide controller
   * @param event click event
   */
  @HostListener('document:click', ['$event'])
  detectOutsideClick(event: Event) {
    if (this.elementRef && this.elementRef.nativeElement) {
      if (!this.elementRef.nativeElement.contains(event.target as HTMLElement)) {
        this.showController = false;
      }
    }
  }

  /**
   * toggle controller visible
   */
  toggleController() {
    this.showController = !this.showController;
  }

  /**
   * show all columns
   */
  showAllColumns() {
    this.hiddenColumnsChange.emit([]);
  }

  /**
   * when hidden column changed, toggle from the hidden column lists and emit event
   * @param column column
   */
  onChangeHiddenColumns(column: TableColumnData) {
    let hiddenColumns = [...this.hiddenColumns];
    const children = getChildrenFromColumn(this.getOriginalColumn(column));
    const index = hiddenColumns.findIndex(item => isSameColumn(item, column));
    const parents = this.getParents(column);

    hiddenColumns = hiddenColumns.filter(item =>
      !isColumnContainedInColumns(item, children) && !isColumnContainedInColumns(item, parents) && !isSameColumn(item, column));

    if (index === -1) {
      hiddenColumns.push(column, ...children);
      hiddenColumns.push(...this.getParentsWithNoChildren(hiddenColumns, column));
    }

    this.hiddenColumnsChange.emit(hiddenColumns);
  }

  /**
   * set all columns inline
   */
  setAllColumns() {
    this.allColumns = [];
    this.columns.forEach(column => {
      this.allColumns.push({...column, children: undefined}, ...getChildrenFromColumn({...column}));
    });
  }

  /**
   * return true when cell is hidden
   * @param column column
   */
  isHidden(column: TableColumnData) {
    return isColumnContainedInColumns(column, this.hiddenColumns);
  }

  /**
   * get original column from columns
   * @param column column
   * @param columns columns
   */
  private getOriginalColumn(column: TableColumnData, columns: TableColumnData[] = this.columns) {
    let target: TableColumnData = null;

    for (const item of columns) {
      if (item.label === column.label && item.property === column.property) {
        target = item;
      } else if (!target && item.children && item.children.length > 0) {
        target = this.getOriginalColumn(column, item.children);
      }

      if (target) {
        break;
      }
    }

    return target;
  }

  /**
   * get parent columns with no children
   * @param hiddenColumns hidden columns
   * @param column column
   * @param columns columns
   */
  private getParentsWithNoChildren(hiddenColumns: TableColumnData[], column: TableColumnData, columns?: TableColumnData[]) {
    columns = (columns || JSON.parse(JSON.stringify(this.columns)));

    const parents: TableColumnData[] = [];
    let parent = this.getParentWithNoChildren(hiddenColumns, column, columns);

    while (parent) {
      parents.push(parent);

      parent = this.getParentWithNoChildren(hiddenColumns, parent, columns);
    }

    return parents;
  }

  /**
   * get parent with no children
   * @param hiddenColumns hidden columns
   * @param column column
   * @param columns columns
   */
  private getParentWithNoChildren(hiddenColumns: TableColumnData[], column: TableColumnData, columns?: TableColumnData[]) {
    columns = (columns || JSON.parse(JSON.stringify(this.columns)));

    let parent: TableColumnData = null;

    for (const item of columns) {
      if (item.children && item.children.length) {
        if (
          isParentColumn(column, item)
          && isColumnsContainedInColumns(item.children, hiddenColumns)
        ) {
          parent = item;
          break;
        }

        parent = this.getParentWithNoChildren(hiddenColumns, column, item.children);

        if (parent) {
          break;
        }
      }
    }

    return parent;
  }

  /**
   * get all parent columns
   * @param column child
   * @param columns parents candidates
   */
  private getParents(column: TableColumnData, columns?: TableColumnData[]) {
    columns = (columns || JSON.parse(JSON.stringify(this.columns)));

    const parents: TableColumnData[] = [];
    let parent = this.getParent(column, columns);

    while (parent) {
      parents.push(parent);

      parent = this.getParent(parent, columns);
    }

    return parents;
  }

  /**
   * get parent column
   * @param column child
   * @param columns parents candidates
   */
  private getParent(column: TableColumnData, columns?: TableColumnData[]) {
    columns = (columns || JSON.parse(JSON.stringify(this.columns)));

    let parent: TableColumnData = null;

    for (const item of columns) {
      if (isParentColumn(column, item)) {
        parent = item;
        break;
      }

      if (item.children && item.children.length) {
        parent = this.getParent(column, item.children);

        if (parent) {
          break;
        }
      }
    }

    return parent;
  }
}
