import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatTableModule } from '@angular/material/table';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { FormsModule } from '@angular/forms';
import { DataTableService } from './services/data-table.service';
import { MaterialUiModule } from '../material-ui/material-ui.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule(
{
  declarations: [
    DataTableComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialUiModule,
    // DragDropModule
    // MatButtonModule,
    // MatTableModule,
    // MatNativeDateModule,
    // MatIconModule,
    // MatInputModule,
    // FormsModule
  ],
  providers: [
    DataTableService
  ],
  exports: [
    DataTableComponent
  ]
})
export class DataTableModule { }
