import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileWriterModule } from './file-writer/file-writer.module';
import { FileReaderModule } from './file-reader/file-reader.module';
import { DataTableModule } from './data-table/data-table.module';
// import { ReadFileDataPipe } from './shared/pipes/read-file-data.pipe';
import { InputDataComponent } from './input-data/components/input-data.component';
import { FileWriterComponent } from './file-writer/components/file-writer.component';
import { FileReaderComponent } from './file-reader/components/file-reader.component';
import { OutputDataModule } from './output-data/output-data.module';
import { OutputDataComponent } from './output-data/components/output-data.component';
import { InputDataModule } from './input-data/input-data.module';
import { MaterialUiModule } from './material-ui/material-ui.module';


@NgModule(
{
  declarations: [
    AppComponent,
    // ReadFileDataPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // MaterialUiModule,
    InputDataModule,
    OutputDataModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
