import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceAdminRoutingModule } from './price-admin-routing.module';
import { DefaultPriceMethodComponent } from './default-price-method/default-price-method.component';
import { TargetGpmComponent } from './target-gpm/target-gpm.component';
import { PriceAdminComponent } from './price-admin/price-admin.component';
import {AbcTableModule} from '../../abc-table/abc-table.module';
import {NbAccordionModule, NbCardModule} from '@nebular/theme';

@NgModule({
  declarations: [DefaultPriceMethodComponent, TargetGpmComponent, PriceAdminComponent],
    imports: [
        CommonModule,
        PriceAdminRoutingModule,
        AbcTableModule,
        NbAccordionModule,
        NbCardModule,
    ],
})
export class PriceAdminModule { }
