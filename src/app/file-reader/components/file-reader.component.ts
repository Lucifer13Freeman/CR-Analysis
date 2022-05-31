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
  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  uploadExcel() {}
}
