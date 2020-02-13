import {Component, OnDestroy, ChangeDetectionStrategy, OnInit} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';
import { TableColumnData } from '../../abc-table/table/table.component';
import {HttpClient} from '@angular/common/http';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {


  loading = false;
  columns: TableColumnData[] = [
    {
      label: 'Date',
      property: 'createdDate',
    },
    {
      label: 'Price Round',
      property: 'priceRound',
    },
    {
      label: 'Summary',
      property: 'summary',
    },
    {
      label: 'Action',
      property: 'action',
    },
  ];

  rows: {
    date: string;
    priceRound: string;
    summary: string;
    property: string;
  }[] = [];

  timer: number;
  constructor(private themeService: NbThemeService,
              private http: HttpClient) { }

  ngOnInit() {
    this.pendingData();
    this.approvedData();
  }
  pendingData() {
    this.loading = true;
    this.http.get('../../../assets/json/dashboard/pending.json')
        .subscribe(data => {
          this.rows = data as any;
          this.loading = false;
        });
  }
  approvedData() {
    this.loading = true;
    this.http.get('../../../assets/json/dashboard/approved.json')
        .subscribe(data => {
          this.rows = data as any;
          this.loading = false;

        });
  }

}

