import {Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-row-selector',
  templateUrl: './row-selector.component.html',
  styleUrls: ['./row-selector.component.scss']
})
export class RowSelectorComponent implements OnInit {
  @Input() @HostBinding('class.checked') checked = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * emit checked change event when host clicked
   */
  @HostListener('click')
  onClickHost() {
    this.checkedChange.emit(!this.checked);
  }
}
