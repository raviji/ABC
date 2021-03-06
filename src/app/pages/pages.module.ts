import { NgModule } from '@angular/core';
import { NbMenuModule, NbAlertModule, NbButtonModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbButtonModule,
    NbMenuModule,
    DashboardModule,
    NbAlertModule,
    MiscellaneousModule,
  ],
  declarations: [
    PagesComponent,
    HomeComponent,
  ],
})
export class PagesModule {
}
