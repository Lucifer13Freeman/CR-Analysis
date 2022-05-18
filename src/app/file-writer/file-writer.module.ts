import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileWriterComponent } from './components/file-writer.component';
import { MaterialUiModule } from '../material-ui/material-ui.module';


@NgModule({
  declarations: [
    FileWriterComponent
  ],
  imports: [
    CommonModule,
    MaterialUiModule
  ],
  exports: [
    FileWriterComponent
  ]
})
export class FileWriterModule { }
