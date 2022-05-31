import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { interval, map, Observable, Subscription } from 'rxjs';
import { TableTypeEnum } from 'src/app/data-table/enums/table-type.enum';
import { IColumnSchemaElement } from 'src/app/data-table/interfaces/column-schema-element.interface';
import { INITIAL_MANUAL_READ_TABLE_DATA, INITIAL_TABLE_DATA } from 'src/app/shared/constants/constants';
import { FullFileDataHeaderEnum } from 'src/app/shared/enums/enums';
import { IFileData } from 'src/app/shared/interfaces/file-data.interface';
import { ITableData } from 'src/app/shared/interfaces/table-data.interface';
import { ExcelService } from 'src/app/shared/services/excel/excel.service';
import { FileDataReadService } from 'src/app/shared/services/file-data/read/file-data-read.service';



@Component(
{
  selector: 'app-input-data',
  templateUrl: './input-data.component.html',
  styleUrls: ['./input-data.component.scss'],
})
export class InputDataComponent implements OnInit, OnDestroy
{
  constructor(private readonly fileDataReadService: FileDataReadService) { }

  title: FullFileDataHeaderEnum = FullFileDataHeaderEnum.READ_TABLE_DATA;

  subs?: Subscription;

  // header: string[] =  [];//['Position', 'Name', 'Weight', 'Symbol']//[];
  // data: any[] = [];//ELEMENT_DATA_MOCK //[];

  tableData: ITableData<any> = {...INITIAL_TABLE_DATA};

  isManual: boolean = false;

  readonly inputTableType: TableTypeEnum = TableTypeEnum.INPUT_TABLE_TYPE;

  
  ngOnInit(): void 
  { 
    this.getReadFileData();
  }

  ngOnDestroy(): void
  {
    this.subs?.unsubscribe();
  }

  manualDataInput()
  {
    this.isManual = true;
    this.fileDataReadService.setReadFileData<any>({ tableData: INITIAL_MANUAL_READ_TABLE_DATA });
    // this.fileDataReadService.setReadManualFileData();
  }

  fileDataInput()
  {
    this.isManual = false;
    this.fileDataReadService.clearReadFileData();
  }

  private getReadFileData()
  {
    this.subs = this.fileDataReadService.getReadFileData().subscribe(
    {
      next: (fileData: IFileData<any>) => this.setReadFileData(fileData),
      error: this.handleError
    });
  }

  // private getData()
  // {
  //   return this.fileDataService.getReadFileData().pipe(
  //     interval(1200),
  //     map(
  //       (fileData: IFileData<any>) => {
  //         console.log('fileData ' + fileData);
  //         this.data = fileData.data;
  //         console.log(this.data);
  //     })
  //   )
  // }

  private setReadFileData(fileData: IFileData<any>)
  {
    // this.data = fileData.data;
    // this.header = fileData.header as Array<string>;

    const { data, header } = fileData.tableData;
    this.tableData = { data, header }
  }

  private handleError(error: any)
  {
    const errMsg = error.message || 'Something went wrong!';
    throw new Error(errMsg);
  }
}
