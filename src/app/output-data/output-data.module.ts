import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputDataComponent } from './components/output-data.component';
import { FileWriterModule } from '../file-writer/file-writer.module';
import { DataTableModule } from '../data-table/data-table.module';
import { AnalysisParamsModule } from '../analysis-params/analysis-params.module';
import { ChartModule } from '../chart/chart.module';



@NgModule(
{
  declarations: [
    OutputDataComponent
  ],
  imports: [
    CommonModule,
    FileWriterModule,
    DataTableModule,
    AnalysisParamsModule,
    ChartModule
  ],
  exports: [
    OutputDataComponent
  ]
})
export class OutputDataModule { }
