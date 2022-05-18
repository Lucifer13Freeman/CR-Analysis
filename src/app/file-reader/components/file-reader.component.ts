import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExcelService } from 'src/app/shared/services/excel/excel.service';


@Component(
{
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.scss']
})
export class FileReaderComponent implements OnInit 
{
  // subs?: Subscription;
  
  // @ViewChild("fileDndRef", { static: false }) 
  // fileDndEl!: ElementRef;
  
  constructor(
    // private fileDataService: FileDataService
  ) { }

  ngOnInit(): void 
  { 
    // this.subs = this.fileDataService.readFileDataSubject$.subscribe();
  }

  ngOnDestroy(): void
  {
    // this.subs?.unsubscribe();
  }

  uploadExcel()
  {
    // this.excelService.writeExcel({ header, data: ELEMENT_DATA, extension: 'xlsx' });
  }
}
