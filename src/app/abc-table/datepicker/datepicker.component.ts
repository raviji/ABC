import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';

export interface DateChangeEvent {
  from: string;
  to: string;
}

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
  // format string only available for 'yyyy', 'mm', 'dd'
  @Input() format = 'yyyy-mm-dd';
  @Input() set startDate(value: string) {
    this.fromDate = this.toNgbDate(value);
  }

  @Input() set endDate(value: string) {
    this.toDate = this.toNgbDate(value);
  }

  @Output() dateChange: EventEmitter<DateChangeEvent> = new EventEmitter<DateChangeEvent>();

  showDatepicker = false;
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  minDate = {
    year: 1990,
    month: 1,
    day: 1,
  };

  constructor(
    private calendar: NgbCalendar,
    private elementRef: ElementRef<HTMLElement>,
  ) {
    this.fromDate = calendar.getToday();
  }

  ngOnInit() {
  }

  openDatepicker() {
    this.showDatepicker = true;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.dateChange.emit({
      from: this.toDateString(this.fromDate),
      to: this.toDateString(this.toDate),
    });
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  toNgbDate(value: string) {
    const yearIndex = this.format.indexOf('y');
    const year = value.substr(yearIndex, 4);

    const monthIndex = this.format.indexOf('m');
    const month = value.substr(monthIndex, 2);

    const dateIndex = this.format.indexOf('d');
    const date = value.substr(dateIndex, 2);

    return new NgbDate(
      parseInt(year, null),
      parseInt(month, null),
      parseInt(date, null),
    );
  }

  toDateString(value: NgbDate) {
    if (!value) {
      return '';
    } else {
      let dateString = this.format;
      const {year, month, day} = value;

      dateString = dateString.replace('yyyy', year + '');
      dateString = dateString.replace('mm', month < 10 ? '0' + month : month + '');
      dateString = dateString.replace('dd', day < 10 ? '0' + day : day + '');

      return dateString;
    }
  }

  @HostListener('document:click', ['$event'])
  detectClickOutside(event) {
    if (this.elementRef && this.elementRef.nativeElement) {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.showDatepicker = false;
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  detectKeyPress(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.showDatepicker = false;
    }
  }
}
