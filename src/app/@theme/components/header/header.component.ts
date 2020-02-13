import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import * as $ from 'jquery';
import { LayoutService } from '../../../@core/utils';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private sidebarService: NbSidebarService,
              private layoutService: LayoutService,
              ) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }


  toggleSidebar(): boolean {

    this.sidebarService.toggle(false, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

}
