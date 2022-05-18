import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './components/chart.component';
import { MaterialUiModule } from '../material-ui/material-ui.module';


@NgModule(
{
  declarations: [
    ChartComponent
  ],
  imports: [
    CommonModule,
    MaterialUiModule
  ],
  exports: [
    ChartComponent
  ]
})
export class ChartModule { }
