import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-sort-order-icon',
  templateUrl: './sort-order-icon.component.html',
  styleUrls: ['./sort-order-icon.component.scss']
})
export class SortOrderIconComponent implements OnInit {
  @Input() order: 'asc' | 'desc';

  constructor() { }

  ngOnInit() {
  }

}
