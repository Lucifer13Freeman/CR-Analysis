import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileReaderComponent } from './components/file-reader.component';
import { FileDndModule } from '../dnd/file-dnd.module';


@NgModule(
{
  declarations: [
    FileReaderComponent
  ],
  imports: [
    CommonModule,
    FileDndModule
  ],
  exports: [
    FileReaderComponent
  ]
})
export class FileReaderModule { }
