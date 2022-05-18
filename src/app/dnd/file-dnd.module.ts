import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDndComponent } from './components/dnd/file-dnd.component';
import { ProgressComponent } from './components/progress/progress.component';
import { FileDndDirective } from './directives/file-dnd.directive';


@NgModule({
  declarations: [
    FileDndComponent,
    ProgressComponent,
    FileDndDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FileDndComponent,
    ProgressComponent
  ]
})
export class FileDndModule { }
