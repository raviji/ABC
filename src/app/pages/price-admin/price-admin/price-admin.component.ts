import { Component, OnInit } from '@angular/core';
import {TableColumnData} from "../../../abc-table/table/table.component";
import {NbThemeService} from "@nebular/theme";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'ngx-price-admin',
  templateUrl: './price-admin.component.html',
  styleUrls: ['./price-admin.component.scss']
})
export class PriceAdminComponent implements OnInit {



  loading = false;
  columns: TableColumnData[] = [
    {
      label: 'Product Line',
      property: 'Product Line',
    },
    {
      label: 'Geography',
      property: null,
      children: [
        {
          label: 'Region',
          property: 'Region',
          filterable: true,
        },
        {
          label: 'Sub Regions(s)',
          property: 'status.dex',
        },
        {
          label: 'Country',
          property: 'status.int',
        },
      ],
    },
    {
      label: 'Pricing Hierarchy',
      property: null,
      children: [
        {
          label: 'Class',
          property: 'Class',
        },
        {
          label: 'Family',
          property: 'status.dex',
        },
        {
          label: 'Series',
          property: 'status.int',
        },
        {
          label: 'Model',
          property: 'status.int',
        },
      ],
    },
    {
      label: 'Target GPM %',
      property: 'Target GPM %',
    },
    {
      label: 'Price Method',
      property: 'Price Method',
    },
    {
      label: 'Last Modified By',
      property: 'Last Modified By',
    },
    {
      label: 'Last Modified Date',
      property: 'Last Modified Date',
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
  }
  pendingData() {
    this.loading = true;
    this.http.get('../../../assets/json/admin-pricing/DefaultPriceMethod.json')
        .subscribe(data => {
          this.rows = data as any;
          this.loading = false;
        });
  }

}

