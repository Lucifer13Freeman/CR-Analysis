import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { FILENAME, INITIAL_ANALYSIS_PARAMS, INITIAL_GET_ANALYSIS_DATA, INITIAL_TABLE_DATA, WRITE_FILE_TIMOUT } from 'src/app/shared/constants/constants';
import { AnalysisDataDto } from 'src/app/shared/dto/analysis-data.dto';
import { GetAnalysisDataDto } from 'src/app/shared/dto/get-analysis-data.dto';
import { DownloadButtonLabelsEnum, ExcelExtEnum, FTableSelectValueEnum, FullFileDataHeaderWordEnum, SignificanceSelectValueEnum, WordPdfExtEnum } from 'src/app/shared/enums/enums';
import { IAnalysisParams } from 'src/app/shared/interfaces/analysis-params.interface';
import { IFileData } from 'src/app/shared/interfaces/file-data.interface';
import { ITableData } from 'src/app/shared/interfaces/table-data.interface';
import { AnalysisService } from 'src/app/shared/services/analysis/analysis.service';
import { ExcelService } from 'src/app/shared/services/excel/excel.service';
import { WriteAnalysisDataService } from 'src/app/shared/services/file-data/write-analysis/write-analysis.service';
import { FileDataWriteCalcService } from 'src/app/shared/services/file-data/write-calc/file-data-write-calc.service';
import { FileDataWriteRangService } from 'src/app/shared/services/file-data/write-rang/file-data-write-rang.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { WordService } from 'src/app/shared/services/word/word.service';
import { ISelectValues } from '../interfaces/select-values.interface';



@Component(
{
  selector: 'app-analysis-params',
  templateUrl: './analysis-params.component.html',
  styleUrls: ['./analysis-params.component.scss']
})
export class AnalysisParamsComponent implements OnInit
{
  constructor(private readonly analysisService: AnalysisService, 
              private readonly writeAnalysisDataService: WriteAnalysisDataService,
              private readonly wordService: WordService,
              private readonly excelService: ExcelService,
              private readonly utilsService: UtilsService) { }
  
  // @Input()
  // calcTableData: ITableData<any> = {...INITIAL_TABLE_DATA};

  // @Input()
  // rangTableData: ITableData<any> = {...INITIAL_TABLE_DATA};

  title: FullFileDataHeaderWordEnum = FullFileDataHeaderWordEnum.ANALYSIS_PARAMS;
  downloadButtonLabels = DownloadButtonLabelsEnum;

  @Input()
  getAanalysisData: GetAnalysisDataDto<any> = {...INITIAL_GET_ANALYSIS_DATA};

  @Input()
  analysisParams: IAnalysisParams = {...INITIAL_ANALYSIS_PARAMS};

  // wordExt: WordPdfExtEnum = WordPdfExtEnum.DOCX;
  // pdfExt: WordPdfExtEnum = WordPdfExtEnum.PDF;
  // excelExt: ExcelExtEnum = ExcelExtEnum.XLSX;

  selectedSignLvlVal: SignificanceSelectValueEnum = this.analysisParams.signLvlSelectVal.value as SignificanceSelectValueEnum;
  selectedFTableValLvlVal: FTableSelectValueEnum = this.analysisParams.fTableValLvlSelectVal.value as FTableSelectValueEnum;

  signLvlValues: ISelectValues[] = [
    { value: SignificanceSelectValueEnum.VALUE_1, viewValue: SignificanceSelectValueEnum.VALUE_1 },
    { value: SignificanceSelectValueEnum.VALUE_2, viewValue: SignificanceSelectValueEnum.VALUE_2 },
    { value: SignificanceSelectValueEnum.VALUE_3, viewValue: SignificanceSelectValueEnum.VALUE_3 }
  ]

  fTableValues: ISelectValues[] = [
    { value: FTableSelectValueEnum.VALUE_1, viewValue: FTableSelectValueEnum.VALUE_1 },
    { value: FTableSelectValueEnum.VALUE_2, viewValue: FTableSelectValueEnum.VALUE_2 }
  ]

  ngOnInit(): void { }

  editData()
  {
    const analysisData = this.analysisService.getAnalysisData({ ...this.getAanalysisData,
                                                              calcTableData: this.getAanalysisData.calcTableData, 
                                                              rangTableData: this.getAanalysisData.rangTableData, 
                                                              signLvlSelectVal: this.selectedSignLvlVal, 
                                                              fTableValLvlSelectVal: this.selectedFTableValLvlVal});
    this.writeAnalysisDataService.setWriteAnalysisData(analysisData);
  }

  async downloadWord(filename = FILENAME, 
                    extension: WordPdfExtEnum = WordPdfExtEnum.PDF)
  {
    await this.wordService.writeAnalysisParamsToWordPdf({ analysisParams: this.analysisParams, filename, extension });
  }

  async downloadPdf(filename = FILENAME, 
                    extension: WordPdfExtEnum = WordPdfExtEnum.DOCX)
  {
    await this.wordService.writeAnalysisParamsToWordPdf({ analysisParams: this.analysisParams, filename, extension });
  }

  async downloadExcel(filename = FILENAME, 
                      extension: ExcelExtEnum = ExcelExtEnum.XLSX)
  {
    const tableData = this.utilsService.makeTableDataFromAnalysisParams(this.analysisParams);

    console.log(this.analysisParams)
    console.log(tableData)

    // setTimeout(() => 
    // {
    //   this.excelService.writeTableToExcel({ tableData, filename, extension });
    // }, WRITE_FILE_TIMOUT)

    await this.excelService.writeTableToExcel({ tableData, filename, extension });
  }
}
