import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { CellDataPipe } from './pipes/cell-data.pipe';
import { CellIdentifierPipe } from './pipes/cell-identifier.pipe';
import { SortOrderIconComponent } from './sort-order-icon/sort-order-icon.component';
import { FixedColumnControlComponent } from './fixed-column-control/fixed-column-control.component';
import {FormsModule} from '@angular/forms';
import { RowSelectorComponent } from './row-selector/row-selector.component';
import { TablePaginatorComponent } from './table-paginator/table-paginator.component';
import { TableFilterComponent } from './table-filter/table-filter.component';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { NumberInputComponent } from './number-input/number-input.component';
import { TableContextMenuDirective } from './menu/table-context-menu.directive';
import { TableLoadingSpinnerComponent } from './table-loading-spinner/table-loading-spinner.component';
import { TableContextMenuContentDirective } from './menu/table-context-menu-content.directive';
import { VisibleColumnControlComponent } from './visible-column-control/visible-column-control.component';

@NgModule({
  declarations: [
    TableComponent,
    CellDataPipe,
    CellIdentifierPipe,
    SortOrderIconComponent,
    FixedColumnControlComponent,
    RowSelectorComponent,
    TablePaginatorComponent,
    TableFilterComponent,
    DatepickerComponent,
    NumberInputComponent,
    TableContextMenuDirective,
    TableLoadingSpinnerComponent,
    TableContextMenuContentDirective,
    VisibleColumnControlComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule,
  ],
  exports: [
    TableComponent,
    TableContextMenuDirective,
    TableContextMenuContentDirective,
  ],
})
export class AbcTableModule { }
