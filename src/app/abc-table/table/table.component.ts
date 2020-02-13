import {
  AfterViewChecked,
  AfterViewInit, ChangeDetectorRef,
  Component, ContentChild, ElementRef,
  EventEmitter, HostBinding,
  HostListener,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  QueryList, Renderer2,
  SimpleChanges, ViewChild,
  ViewChildren,
} from '@angular/core';
import {sortMethodAsc, sortMethodWithOrderMultiColumn} from '../util/sort.util';
import {Subscription} from 'rxjs';
import {isCellDefinitionContainedInCellDefinitions, isColumnContainedInColumns} from '../util/column-definition.util';
import {PageValueChangeEvent} from '../table-paginator/table-paginator.component';
import {FilterableDataType, FilterChangeEvent} from '../table-filter/table-filter.component';
import {filterAll, filterByType} from '../util/filter.util';
import {TableContextMenuDirective} from '../menu/table-context-menu.directive';
import {FixedColumnControlComponent} from '../fixed-column-control/fixed-column-control.component';

/**
 * cell definition interface for rendering header and data cell
 */
export interface CellDefinition {
  label: string;
  property: string;
  colspan: number;
  rowspan: number;
  filterable: boolean;
  dataType: FilterableDataType;
  // index of renderable cell
  index: number;
  // depth of header row
  depth: number;
  // render data cell or not
  renderData: boolean;
}

export interface SortedColumn {
  label: string;
  property: string;
  order: 'asc' | 'desc';
}

/**
 * column information in table data object
 */
export interface TableColumnData {
  label: string;
  property: string;
  filterable?: boolean;
  dataType?: FilterableDataType;
  children?: TableColumnData[];
}

export type OrderableAction = 'Select' | 'Edit' | 'Delete' | 'Menu';

export const SELECT_ACTION: OrderableAction = 'Select';
export const EDIT_ACTION: OrderableAction = 'Edit';
export const DELETE_ACTION: OrderableAction = 'Delete';
export const MENU_ACTION: OrderableAction = 'Menu';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy, AfterViewChecked {
  @Input() columns: TableColumnData[] = [];
  @Input() rows: any[] = [];

  // loading state
  @HostBinding('class.loading') @Input() loading = false;
  // using status of action column
  @Input() useControls = false;
  // using status of selecting rows
  @Input() selectable = false;
  // using status of editing rows
  @Input() editable = false;
  // using status of deleting rows
  @Input() deletable = false;
  // using status of context menu in rows
  @Input() hasContextMenu = false;
  // using status of fixable columns
  @Input() fixableColumns = false;
  // using status of hidable columns
  @Input() hidableColumns = false;
  // set action order
  @Input() actionOrder: OrderableAction[] = [
    SELECT_ACTION,
    DELETE_ACTION,
    EDIT_ACTION,
    MENU_ACTION,
  ];

  @Input() controlColumnIdentifier = 'abc-table-controller';

  @Input() page = 0;
  @Input() size = 5;
  // total is only useful when using backend pagination
  @Input() total = 0;

  @Input() set headerFix(value) {
    this.fixedHeader = value !== undefined && value !== null;
  }

  @Input() set useBackend(value) {
    this.usingBackend = value !== undefined && value !== null;
  }

  @Output() pageValueChange: EventEmitter<PageValueChangeEvent> = new EventEmitter<PageValueChangeEvent>();
  @Output() sortedColumnsChange: EventEmitter<SortedColumn[]> = new EventEmitter<SortedColumn[]>();
  @Output() selectRowsChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() filterChange: EventEmitter<FilterChangeEvent> = new EventEmitter<FilterChangeEvent>();
  @Output() deleteClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() editClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() menuClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('tableWrapperElement', {static: false}) private tableWrapperElement: ElementRef<HTMLDivElement>;
  @ViewChild('scrollWrapperElement', {static: false}) private scrollWrapperElement: ElementRef<HTMLDivElement>;
  @ViewChild('verticalFixedColumnElement', {static: false}) private verticalFixedColumnElement: ElementRef<HTMLDivElement>;
  @ViewChild('innerWidthDetectorElement', {static: false}) private innerWidthDetectorElement: ElementRef<HTMLDivElement>;
  @ViewChild('controlHeaderColumnElement', {static: false}) private controlHeaderColumnElement: ElementRef<HTMLTableHeaderCellElement>;
  @ViewChild(FixedColumnControlComponent, {static: false}) private fixedColumnControlComponent: FixedColumnControlComponent;
  @ContentChild(TableContextMenuDirective, {static: false}) public tableContextMenuDirective: TableContextMenuDirective;

  @ViewChildren('tableHeaderCellElement') private tableHeaderCellElements: QueryList<ElementRef<HTMLTableHeaderCellElement>>;
  @ViewChildren('contextMenuButtonElement') private contextMenuButtonElement: QueryList<ElementRef<HTMLDivElement>>;

  headerRowIndexes: number[] = [];
  headerColumnIdentifiers: string[] = [];
  cellDefinitions: CellDefinition[] = [];
  sortedColumns: SortedColumn[] = [];
  selectedRows: any[] = [];
  totalDepth = 1;
  inControl = false;
  fixedHeader = false;
  usingBackend = false;
  selectAll = false;

  filterableCellDefinitions: CellDefinition[] = [];
  fixedCellDefinitions: CellDefinition[] = [];
  rootCellDefinitions: CellDefinition[] = [];
  hiddenColumns: TableColumnData[] = [];
  visibleColumns: TableColumnData[] = [];

  headerTop = 0;
  columnLeft = 0;
  scrollWidth = 0;

  appliedFilter: FilterChangeEvent = null;
  filteredData: any[] = [];
  menuOpened: any = null;

  private headerCellChangeSubscription: Subscription;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { useControls } = changes;

    this.generateTable(useControls && useControls.previousValue !== useControls.currentValue);
  }

  ngAfterViewInit(): void {
    this.createHeaderColumnIndexes();
    this.subscribeHeaderCellChange();
  }

  ngAfterViewChecked(): void {
    this.detectScrollInnerWidth();
  }

  ngOnDestroy(): void {
    if (this.headerCellChangeSubscription) {
      this.headerCellChangeSubscription.unsubscribe();
    }
  }

  /**
   * detect scroll inner width
   */
  private detectScrollInnerWidth() {
    const detector = this.innerWidthDetectorElement && this.innerWidthDetectorElement.nativeElement;
    const scroller = this.scrollWrapperElement && this.scrollWrapperElement.nativeElement;

    if (detector && scroller) {
      this.scrollWidth = scroller.offsetWidth - detector.offsetWidth;
    }
  }

  /**
   * generate table
   * @param reRenderFixedColumns true to re-render fixed columns
   */
  generateTable(reRenderFixedColumns: boolean = false) {
    if (this.columns && this.rows) {
      this.headerRowIndexes = [];
      this.cellDefinitions = [];
      this.totalDepth = 1;

      this.visibleColumns = this.getVisibleColumns(JSON.parse(JSON.stringify(this.columns)));
      this.setTotalDepth(this.visibleColumns);
      this.addControlCellDefinition();
      this.createCellDefinitions(this.visibleColumns);
      this.setCellDefinitionIndexes();
      this.setCellDefinitionIndexes(this.fixedCellDefinitions);
      this.createHeaderRowIndexes();
      this.setFixableCellDefinitions();
      this.setFilterableCellDefinitions();

      this.changeDetectorRef.detectChanges();

      if (reRenderFixedColumns) {
        this.reRenderFixedColumns();
      }
    }
  }

  /**
   * set total column depth to render header indexes array
   * @param dataColumns column definition in data
   * @param depth column depth
   */
  private setTotalDepth(dataColumns: TableColumnData[] = [], depth = 1) {
    if (this.totalDepth < depth) {
      this.totalDepth = depth;
    }

    dataColumns.forEach(column => {
      if (column.children && column.children.length > 0) {
        this.setTotalDepth(column.children, depth + 1);
      }
    });
  }

  /**
   * create header row indexes with total column depth
   */
  private createHeaderRowIndexes() {
    for (let i = 0; i < this.totalDepth; i++) {
      this.headerRowIndexes.push(i);
    }
  }

  /**
   * add control cell definition
   */
  private addControlCellDefinition() {
    if (this.useControls) {
      this.cellDefinitions.push({
        label: null,
        property: this.controlColumnIdentifier,
        colspan: 1,
        rowspan: this.totalDepth,
        index: null,
        renderData: true,
        filterable: false,
        dataType: null,
        depth: 0,
      });
    }
  }

  /**
   * create table cell definitions
   * @param dataColumns column definitions in table data
   * @param depth column depth
   * @param parentCellDefinition parent cell definition
   */
  private createCellDefinitions(dataColumns: TableColumnData[], depth = 0, parentCellDefinition?: CellDefinition) {
    dataColumns.forEach((column, index) => {
      const cellDefinition: CellDefinition = this.createCellDefinition(column, depth);

      // if dataColumns are children of some dataColumn,
      // add colspan to parent cell when dataColumns length is bigger than 1
      if (parentCellDefinition && index !== 0) {
        parentCellDefinition.colspan++;
      }

      // if column has children,
      // create cell definitions of children columns.
      // else,
      // set rowspan as totalDepth - depth
      if (column.children && column.children.length > 0) {
        this.createCellDefinitions(column.children, depth + 1, cellDefinition);

        // if dataColumns are children of some dataColumn,
        // add colspan to parent cell when dataColumn's children is exists
        if (parentCellDefinition) {
          parentCellDefinition.colspan += column.children.length - 1;
        }

        cellDefinition.renderData = false;
      } else {
        // set rowspan to merge deeper depth rows
        cellDefinition.rowspan = this.totalDepth - depth;
      }
    });
  }

  /**
   * set visible columns
   * @param columns columns
   */
  private getVisibleColumns(columns: TableColumnData[]) {
    return columns.filter(column => {
      if (column.children && column.children.length) {
        column.children = this.getVisibleColumns(column.children);
      }

      return !isColumnContainedInColumns(column, this.hiddenColumns);
    });
  }

  /**
   * create cell definition with column data
   * @param column column data
   * @param depth cell depth
   */
  private createCellDefinition(column: TableColumnData, depth = 0) {
    // create cell definition and add to cellDefinitions
    const cellDefinition: CellDefinition = {
      label: column.label,
      property: column.property,
      colspan: 1,
      rowspan: 1,
      index: null,
      renderData: true,
      filterable: column.filterable,
      dataType: column.dataType,
      depth,
    };

    this.cellDefinitions.push(cellDefinition);

    return cellDefinition;
  }

  /**
   * set indexes to generated cell definitions
   * @param cellDefinitions definitions to add index
   */
  private setCellDefinitionIndexes(cellDefinitions: CellDefinition[] = this.getReorderedCellDefinitions()) {
    let index = 0;

    // only not fixed cell has index
    cellDefinitions
      .forEach(cellDefinition => {
        if (cellDefinition.renderData) {
          cellDefinition.index = index;
          index++;
        }
      });
  }

  /**
   * return reordered cell definitions
   */
  getReorderedCellDefinitions() {
    return [
      ...this.fixedCellDefinitions,
      ...this.cellDefinitions.filter(cellDefinition =>
        !isCellDefinitionContainedInCellDefinitions(cellDefinition, this.fixedCellDefinitions)
      ),
    ];
  }

  /**
   * if depth of cellDefinition is 0, add to fixable cell definitions
   */
  private setFixableCellDefinitions() {
    this.rootCellDefinitions = this.cellDefinitions.filter(cellDefinition => cellDefinition.depth === 0);
  }

  /**
   * set filterable cell definitions
   */
  private setFilterableCellDefinitions() {
    this.filterableCellDefinitions = this.cellDefinitions.filter(cellDefinition => cellDefinition.filterable);
  }

  /**
   * subscribe header cell change
   */
  private subscribeHeaderCellChange() {
    if (this.tableHeaderCellElements) {
      this.headerCellChangeSubscription = this.tableHeaderCellElements.changes
        .subscribe(() => {
          this.createHeaderColumnIndexes();
        });
    }
  }

  /**
   * create header column indexes for colgroup > col
   */
  private createHeaderColumnIndexes() {
    if (this.tableHeaderCellElements) {
      this.headerColumnIdentifiers = [];

      this.headerColumnIdentifiers = this.tableHeaderCellElements
        .filter(cell =>
          cell
          && cell.nativeElement
          && cell.nativeElement.hasAttribute('header-cell-index')
          && this.tableWrapperElement
          && this.tableWrapperElement.nativeElement
          && this.tableWrapperElement.nativeElement.contains(cell.nativeElement)
        )
        .map((cell => cell.nativeElement))
        .sort((a, b) => {
          const v1 = parseInt(a.getAttribute('header-cell-index'), null);
          const v2 = parseInt(b.getAttribute('header-cell-index'), null);

          return sortMethodAsc(v1, v2);
        })
        .map(cell => cell.getAttribute('header-cell-identifier'));

      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * detect click event
   * @param event event
   */
  @HostListener('document:click', ['$event'])
  detectClick(event: Event) {
    this.detectClickOutsideOfContextMenu(event);
  }

  /**
   * detect click outside of context menu
   * @param event click event
   */
  private detectClickOutsideOfContextMenu(event: Event) {
    if (this.contextMenuButtonElement) {
      this.contextMenuButtonElement.forEach(item => {
        const el = item.nativeElement;

        if (el && el.classList.contains('active')) {
          if (!el.contains(event.target as HTMLElement)) {
            this.menuOpened = null;
          }
        }
      });
    }
  }

  /**
   * detect control key down
   * @param event keyboard event
   */
  @HostListener('document:keydown', ['$event'])
  detectControlKeyDown(event: KeyboardEvent) {
    this.inControl = event.ctrlKey || event.metaKey;
  }

  /**
   * detect control key up
   * @param event keyboard event
   */
  @HostListener('document:keyup', ['$event'])
  detectControlKeyUp(event: KeyboardEvent) {
    this.inControl = event.ctrlKey || event.metaKey;
  }

  /**
   * set resize event listener to detect window resize
   */
  @HostListener('window:resize')
  onResize() {}

  /**
   * toggle sort for selected cell
   * sort order will be changed by following order: null > 'asc' > 'desc > null
   * @param cell selected cell definition
   */
  toggleSort(cell: CellDefinition) {
    if (cell.renderData && this.inControl) {
      const index = this.findSortedColumnIndex(cell);
      const sortedColumns: SortedColumn[] = [...this.sortedColumns];

      if (index !== -1) {
        sortedColumns.splice(index, 1);
      } else {
        sortedColumns.push({
          label: cell.label,
          property: cell.property,
          order: 'asc',
        });
      }

      this.sortedColumns = sortedColumns;
      this.sortedColumnsChange.emit(sortedColumns);
    }
  }

  /**
   * shift sort direction
   * @param cell cell definition
   */
  shiftSort(cell: CellDefinition) {
    const index = this.findSortedColumnIndex(cell);

    if (index !== -1) {
      const sortedColumn = this.sortedColumns[index];

      if (sortedColumn.order === 'asc') {
        sortedColumn.order = 'desc';
      } else {
        sortedColumn.order = 'asc';
      }

      this.sortedColumnsChange.emit(this.sortedColumns);
    }
  }

  /**
   * return sorted column index of cell definition
   * @param cell cell definition
   */
  findSortedColumnIndex(cell: CellDefinition) {
    return this.sortedColumns.findIndex(column => {
      return column.label === cell.label && column.property === cell.property;
    });
  }

  /**
   * return sorted data by frontend
   */
  getSortedData() {
    return [...this.rows].sort(sortMethodWithOrderMultiColumn(this.sortedColumns));
  }

  /**
   * return filtered data by frontend
   */
  getFilteredData() {
    return this.getSortedData().filter(data => {
      if (!this.usingBackend && this.appliedFilter) {
        if (this.appliedFilter.property) {
          return filterByType(this.appliedFilter, data);
        } else {
          return filterAll(this.appliedFilter, data, this.cellDefinitions);
        }
      } else {
        return true;
      }
    });
  }

  /**
   * return paged data by frontend
   */
  getPagedData() {
    this.filteredData = this.getFilteredData();

    return [...this.filteredData].splice(this.page * this.size, this.size);
  }

  /**
   * handle page value change event from paginator
   * @param event event
   */
  onPageValueChange(event: PageValueChangeEvent) {
    this.unSetSelectAll();

    if (this.usingBackend) {
      this.pageValueChange.emit(event);
    } else {
      this.page = event.page;
      this.size = event.size;
    }
  }

  /**
   * set header top position
   * @param event scroll event
   */
  setHeaderTop(event) {
    this.headerTop = event.target.scrollTop;
    this.columnLeft = event.target.scrollLeft;
  }

  /**
   * return true when cell definition contained in fixed cell definition
   * @param cellDefinition cell definition
   */
  isFixedCellDefinition(cellDefinition: CellDefinition) {
    return isCellDefinitionContainedInCellDefinitions(cellDefinition, this.fixedCellDefinitions);
  }

  /**
   * return fixed columns width
   */
  getFixedColumnsWidth() {
    let width = 0;

    if (this.innerWidthDetectorElement && this.innerWidthDetectorElement) {
      const innerDetectorWidth = this.innerWidthDetectorElement.nativeElement.offsetWidth;

      if (this.verticalFixedColumnElement && this.verticalFixedColumnElement.nativeElement) {
        const el = this.verticalFixedColumnElement.nativeElement;

        // get header cells with 'header-cell-index' attribute that are not hidden.
        el.querySelectorAll('th[header-cell-index]:not(.hide)').forEach(cell => {
          width += (cell as HTMLTableCellElement).offsetWidth;
        });
      }

      width = width + 1;
      width = (width >= innerDetectorWidth) ? innerDetectorWidth : width;
    }

    return width;
  }

  /**
   * return header cell width by identifier
   * @param identifier identifier
   */
  getHeaderCellWidthByIdentifier(identifier: string) {
    const header = (this.elementRef.nativeElement
      .querySelector(`.abc-table-wrapper:not(.clone) [header-cell-identifier='${identifier}']`) as HTMLElement);

    if (header) {
      return header.offsetWidth;
    } else {
      return 0;
    }
  }

  /**
   * handle select all button toggle event
   * @param selectAll select all state
   */
  onSelectAllToggled(selectAll: boolean) {
    this.unSelectAllRows();

    if (selectAll) {
      this.selectAllRows();
    }

    this.selectRowsChange.emit(this.selectedRows);
  }

  /**
   * select all rows
   */
  private selectAllRows() {
    this.selectedRows.push(...this.getPagedData());
  }

  /**
   * unselect all rows
   */
  private unSelectAllRows() {
    while (this.selectedRows.length > 0) {
      this.selectedRows.pop();
    }
  }

  /**
   * return true when row item is selected
   * @param item row item
   */
  isSelectedRow(item: any) {
    return this.getSelectedRowIndex(item) !== -1;
  }

  /**
   * unset select all rows
   */
  unSetSelectAll() {
    this.selectAll = false;
    this.unSelectAllRows();
  }

  /**
   * toggle row selected
   * @param item row item
   */
  toggleSelectedRow(item: any) {
    const index = this.getSelectedRowIndex(item);

    if (index !== -1) {
      this.selectedRows.splice(index, 1);
      this.selectAll = false;
    } else {
      this.selectedRows.push(item);
    }

    this.selectRowsChange.emit(this.selectedRows);
  }

  /**
   * return selected row index
   * @param item row item
   */
  private getSelectedRowIndex(item: any) {
    return this.selectedRows.indexOf(item);
  }

  /**
   * handle filter change event
   * @param event event
   */
  onFilterChange(event: FilterChangeEvent) {
    this.appliedFilter = event;
    // reset page
    this.page = 0;
    this.unSetSelectAll();

    this.changeDetectorRef.detectChanges();

    if (this.usingBackend) {
      this.filterChange.emit(event);
    }
  }

  /**
   * return true when action is 'Select'
   * @param action orderable action
   */
  isSelectAction(action: OrderableAction) {
    return action === SELECT_ACTION;
  }

  /**
   * return true when action is 'Delete'
   * @param action orderable action
   */
  isDeleteAction(action: OrderableAction) {
    return action === DELETE_ACTION;
  }

  /**
   * return true when action is 'Edit'
   * @param action orderable action
   */
  isEditAction(action: OrderableAction) {
    return action === EDIT_ACTION;
  }

  /**
   * return true when action is 'Menu'
   * @param action orderable action
   */
  isMenuAction(action: OrderableAction) {
    return action === MENU_ACTION;
  }

  /**
   * emit delete click event
   * @param item data item
   */
  onDeleteClick(item: any) {
    this.deleteClick.emit(item);
  }

  /**
   * emit edit click event
   * @param item data item
   */
  onEditClick(item: any) {
    this.editClick.emit(item);
  }

  /**
   * emit menu click event
   * @param item data item
   */
  onMenuClick(item: any) {
    if (this.menuOpened === item) {
      this.menuOpened = null;
    } else {
      this.menuOpened = item;
      this.menuClick.emit(item);
    }
  }

  /**
   * close context menu
   */
  closeContextMenu() {
    this.menuOpened = false;
  }

  /**
   * re-render fixed columns with emitting fixed size change event
   */
  private reRenderFixedColumns() {
    if (this.fixedColumnControlComponent) {
      this.fixedColumnControlComponent.onChangeFixedSize(this.fixedColumnControlComponent.fixedColumnSize);
    }
  }
}
