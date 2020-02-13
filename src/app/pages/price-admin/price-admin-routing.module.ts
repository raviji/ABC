import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DefaultPriceMethodComponent} from './default-price-method/default-price-method.component';
import {PriceAdminComponent} from './price-admin/price-admin.component';


const routes: Routes = [{
    path: '',
    component: PriceAdminComponent,
    children: [
        {path: '', redirectTo: 'default-pricing', pathMatch: 'prefix'},
        {path: 'default-pricing', component: DefaultPriceMethodComponent},
    ],
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PriceAdminRoutingModule {
}
