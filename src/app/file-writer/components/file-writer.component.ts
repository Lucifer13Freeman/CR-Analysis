import { Component, Input, OnInit } from '@angular/core';
import { FILENAME } from 'src/app/shared/constants/constants';
import { DownloadButtonLabelsEnum, 
        ExcelExtEnum, 
        WordPdfExtEnum } from 'src/app/shared/enums/enums';
import { ITableData } from 'src/app/shared/interfaces/table-data.interface';
import { WordService } from 'src/app/shared/services/word/word.service';
import { ExcelService } from '../../shared/services/excel/excel.service';


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

  downloadButtonLabels = DownloadButtonLabelsEnum;

  ngOnInit(): void { }

  async downloadExcel()
  {
    await this.excelService.writeTableToExcel({ tableData: this.tableData, 
                                              filename: FILENAME, 
                                              extension: ExcelExtEnum.XLSX });
  }

  async downloadWord()
  {
    await this.wordService.writeTableToWord({ tableData: this.tableData, 
                                            filename: FILENAME, 
                                            extension: WordPdfExtEnum.DOCX });
  }

  async downloadPdf()
  {
    await this.wordService.writeTableToWord({ tableData: this.tableData, 
                                            filename: FILENAME, 
                                            extension: WordPdfExtEnum.PDF });
  }
}
