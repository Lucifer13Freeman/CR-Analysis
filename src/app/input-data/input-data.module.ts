import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDataComponent } from './components/input-data.component';
import { DataTableModule } from '../data-table/data-table.module';
import { FileReaderComponent } from '../file-reader/components/file-reader.component';
import { DataTableComponent } from '../data-table/components/data-table/data-table.component';
import { FileReaderModule } from '../file-reader/file-reader.module';
import { MaterialUiModule } from '../material-ui/material-ui.module';


@NgModule(
{
  declarations: [
    InputDataComponent,
    // FileReaderComponent,
    // DataTableComponent
  ],
  imports: [
    CommonModule,
    FileReaderModule,
    DataTableModule,
    MaterialUiModule
  ],
  exports: [
    InputDataComponent, 
    CommonModule
  ]
})
export class InputDataModule { }