import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableService } from './services/data-table.service';
import { MaterialUiModule } from '../material-ui/material-ui.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from './components/data-table/data-table.component';


@NgModule(
{
  declarations: [
    DataTableComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialUiModule
  ],
  providers: [
    DataTableService
  ],
  exports: [
    DataTableComponent
  ]
})
export class DataTableModule { }
