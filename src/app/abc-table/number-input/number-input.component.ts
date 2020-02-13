import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface NumberChangeEvent {
  from: number;
  to: number;
}

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit {
  @Input() set startNumber(value: string | number) {
    if (typeof value === 'number') {
      value = value.toString();
    }

    this.fromNumber = value;
  }

  @Input() set endNumber(value: string | number) {
    if (typeof value === 'number') {
      value = value.toString();
    }

    this.toNumber = value;
  }

  @Output() valueChange: EventEmitter<NumberChangeEvent> = new EventEmitter<NumberChangeEvent>();

  fromNumber = '0';
  toNumber = '0';

  constructor() { }

  ngOnInit() {
  }

  adjustToValue(event: Event, type: 'from' | 'to') {
    const target = event.target as HTMLInputElement;
    const control = parseInt(type === 'from' ? this.toNumber : this.fromNumber, null);
    let value = target.value;

    if (value !== null && value !== undefined && value !== '') {
      if (type === 'from' && parseInt(value, null) > control) {
        value = this.fromNumber = this.toNumber;
      } else if (type === 'to' && parseInt(value, null) < control) {
        value = this.toNumber = this.fromNumber;
      }

      target.value = value;

      this.onValueChange();
    }
  }

  onValueChange() {
    if (parseInt(this.fromNumber, null) <= parseInt(this.toNumber, null)) {
      this.valueChange.emit({
        from: parseInt(this.fromNumber, null),
        to: parseInt(this.toNumber, null),
      });
    }
  }
}
