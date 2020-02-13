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
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnDestroy {

  private alive = true;

  solarValue: number;
  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'info',
      },
    ],
    dark: this.commonStatusCardsSet,
  };

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
              private http: HttpClient,
              private solarService: SolarData) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
    });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });
    this.pendingData();
    this.approvedData();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  pendingData() {
    this.loading = true;
    this.http.get('../../../assets/json/dashboard/pending.json')
        .subscribe(data => {
          this.rows = data as any;
          // to show loading spinner
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
  }
  approvedData() {
    this.loading = true;
    this.http.get('../../../assets/json/dashboard/approved.json')
        .subscribe(data => {
          this.rows = data as any;
          // to show loading spinner
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
  }
}
