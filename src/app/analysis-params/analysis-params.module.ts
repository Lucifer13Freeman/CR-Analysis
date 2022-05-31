import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisParamsComponent } from './components/analysis-params.component';
import { MaterialUiModule } from '../material-ui/material-ui.module';


@NgModule({
  declarations: [
    AnalysisParamsComponent
  ],
  imports: [
    CommonModule,
    MaterialUiModule
  ],
  exports: [
    AnalysisParamsComponent
  ]
})
export class AnalysisParamsModule { }
