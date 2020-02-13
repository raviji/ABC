import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

export interface PageValueChangeEvent {
  page: number;
  size: number;
}

@Component({
  selector: 'app-table-paginator',
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.scss']
})
export class TablePaginatorComponent implements OnInit, OnChanges {
  /**
   * set displayable page size
   * @param value value
   */
  @Input() set displayPageSize(value: any) {
    this.displayablePageSize = parseInt(value, null);

    if (this.displayablePageSize < 0) {
      console.warn('displayPageSize cannot be under 0\nSo it will be set to 5 which is default value');
      this.displayablePageSize = 5;
    } else if (this.displayablePageSize % 2 === 0) {
      console.warn('displayPageSize cannot be even number\nSo it will be added 1 to make an odd number');
      this.displayablePageSize = this.displayablePageSize + 1;
    }
  }

  @Input() useSizeOptions = false;
  @Input() page = 0;
  @Input() size = 5;
  @Input() total = 0;
  @Output() pageValueChange: EventEmitter<PageValueChangeEvent> = new EventEmitter<PageValueChangeEvent>();

  options = [
    {
      label: '5',
      value: 5,
    },
    {
      label: '10',
      value: 10,
    },
    {
      label: '15',
      value: 15,
    },
  ];

  startIndex = 0;
  endIndex = 0;
  hasPrev = false;
  hasNext = false;
  pages: number[] = [];

  private displayablePageSize = 5;

  constructor() {
  }

  ngOnInit() {
    this.onPageChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onPageChange();
  }

  onPageChange() {
    this.setIndexes();
    this.checkPageExistence();
    this.createPages();
  }

  /**
   * set start, end index
   */
  private setIndexes() {
    const {page, size, total} = this;

    this.startIndex = (page * size) + 1;
    this.endIndex = (page + 1) * size;

    // correct values
    this.endIndex = this.endIndex > total ? total : this.endIndex;
    this.startIndex = this.startIndex > this.endIndex ? this.endIndex : this.startIndex;
  }

  /**
   * check next/previous page existence
   */
  private checkPageExistence() {
    this.hasPrev = this.startIndex > 1;
    this.hasNext = this.endIndex < this.total;
  }

  /**
   * create page list
   */
  private createPages() {
    const {page, size, total} = this;
    const half = Math.ceil(this.displayablePageSize / 2);
    const totalPage = Math.ceil(total / size);
    let start = page - (half - 1);
    let end = totalPage;

    this.pages = [];

    if (page < half) {
      start = 0;
    } else if (totalPage - start < this.displayablePageSize) {
      start = totalPage - this.displayablePageSize;
      start = start < 0 ? 0 : start;
    }

    if (totalPage > page + half) {
      end = start + this.displayablePageSize;
      end = end > totalPage ? totalPage : end;
    }

    for (let i = start; i < end; i++) {
      this.pages.push(i);
    }
  }

  /**
   * check page is current page
   * @param page page
   */
  isCurrentPage(page: number) {
    return this.page === page;
  }

  /**
   * to next page
   */
  toNextPage() {
    if (this.hasNext) {
      this.toPage(this.page + 1);
    }
  }

  /**
   * to prev page
   */
  toPrevPage() {
    if (this.hasPrev) {
      this.toPage(this.page - 1);
    }
  }

  /**
   * move to page
   * @param page page
   */
  toPage(page: number) {
    this.pageValueChange.emit({
      page,
      size: this.size,
    });
  }

  /**
   * on size change
   * @param event event
   */
  onSizeChange(event) {
    // set to first page
    this.pageValueChange.emit({
      page: 0,
      size: parseInt(event.target.value, null),
    });
  }
}
