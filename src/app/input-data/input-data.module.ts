import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDataComponent } from './components/input-data.component';
import { DataTableModule } from '../data-table/data-table.module';
import { FileReaderModule } from '../file-reader/file-reader.module';
import { MaterialUiModule } from '../material-ui/material-ui.module';


@NgModule(
{
  declarations: [
    InputDataComponent
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