import { Component, Input, OnInit } from '@angular/core';
import { ExcelExtEnum } from 'src/app/shared/enums/enums';
import { IFileData } from 'src/app/shared/interfaces/file-data.interface';
import { ITableData } from 'src/app/shared/interfaces/table-data.interface';
import { WordService } from 'src/app/shared/services/word/word.service';
import { ExcelService } from '../../shared/services/excel/excel.service';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component(
{
  selector: 'app-file-writer',
  templateUrl: './file-writer.component.html',
  styleUrls: ['./file-writer.component.scss']
})
export class FileWriterComponent implements OnInit 
{
  constructor(private readonly excelService: ExcelService,
              private readonly wordService: WordService) { }

  @Input()
  tableData!: ITableData<any>;

  ngOnInit(): void { }



  downloadExcel()
  {
    // const header = ["Position", "Name", "Weight", "Symbol"];
    // const tableData: ITableData<any> = {
    //   header,
    //   data: ELEMENT_DATA
    // }
    this.excelService.writeExcel({ tableData: this.tableData, extension: ExcelExtEnum.XLSX });
  }

  async downloadWord()
  {
    await this.wordService.writeTableToWord(this.tableData);
  }
}
