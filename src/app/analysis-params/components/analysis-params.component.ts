import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { DIGIT_ACCURACY, FILENAME, INITIAL_ANALYSIS_DATA, INITIAL_ANALYSIS_PARAMS, INITIAL_GET_ANALYSIS_DATA, INITIAL_TABLE_DATA, WRITE_FILE_TIMOUT } from 'src/app/shared/constants/constants';
import { AnalysisDataDto } from 'src/app/shared/dto/analysis-data.dto';
import { GetAnalysisDataDto } from 'src/app/shared/dto/get-analysis-data.dto';
import { DownloadButtonLabelsEnum, ExcelExtEnum, FTableSelectValueEnum, FullFileDataHeaderEnum, SignificanceSelectValueEnum, WordPdfExtEnum } from 'src/app/shared/enums/enums';
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
export class AnalysisParamsComponent implements OnInit, OnChanges
{
  constructor(private readonly analysisService: AnalysisService, 
              private readonly writeAnalysisDataService: WriteAnalysisDataService,
              private readonly wordService: WordService,
              private readonly excelService: ExcelService,
              private readonly utilsService: UtilsService) { }
  
  title: FullFileDataHeaderEnum = FullFileDataHeaderEnum.ANALYSIS_PARAMS;
  downloadButtonLabels = DownloadButtonLabelsEnum;

  @Input()
  analysisData: AnalysisDataDto<any> = {...INITIAL_ANALYSIS_DATA}; 

  analysisParams: IAnalysisParams = {...INITIAL_ANALYSIS_PARAMS};

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

  ngOnInit(): void 
  { 
    this.analysisParams = this.analysisData.params;
  }

  ngOnChanges(changes: SimpleChanges): void 
  {
    this.analysisParams = this.analysisData.params;
  }

  editCorrCoefValLvl()
  {
    if (!this.analysisParams) return;

    const { tTable, 
      coefCorrSign } = this.analysisService.getCorrCoeffSignificent(
                        { signLvlSelectVal: this.selectedSignLvlVal, 
                          coefCorrSignCheck: this.analysisParams.coefCorrSignCheck.value as number, 
                          count: this.analysisParams.count });

                          
    const analysisParams: IAnalysisParams = {
      ...this.analysisParams,
      signLvlSelectVal: {
        name: this.analysisParams.signLvlSelectVal.name,
        value: this.selectedSignLvlVal
      },
      tTable: {
        name: this.analysisParams.tTable.name,
        value: this.utilsService.roundNum(tTable, DIGIT_ACCURACY)
      },
      coefCorrSign: {
        name: this.analysisParams.coefCorrSign.name,
        value: coefCorrSign
      }
    }

    const updatedAnalysisData: AnalysisDataDto<any> = {
      ...this.analysisData,
      params: analysisParams
    }

    this.writeAnalysisDataService.setWriteAnalysisData(updatedAnalysisData);
  }

  editFisherCritValLvl()
  {
    if (!this.analysisParams) return;

    const { fisherCrit, 
      fTableValLvl, 
      fTableValueLevelCheck } = this.analysisService.getFisherCriterion({ 
        V1: this.analysisParams.V1, 
        V2: this.analysisParams.V2, 
        count: this.analysisParams.count, 
        fTableValLvlSelectVal: this.selectedFTableValLvlVal, 
        factorDispersion: this.analysisParams.factorDispersion.value as number, 
        residualDispersion: this.analysisParams.residualDispersion.value as number 
      });
                          
    const analysisParams: IAnalysisParams = {
      ...this.analysisParams,
      fTableValLvlSelectVal: {
        name: this.analysisParams.fTableValLvlSelectVal.name,
        value: this.selectedFTableValLvlVal
      },
      fisherCrit: {
        name: this.analysisParams.fisherCrit.name,
        value: this.utilsService.roundNum(fisherCrit, DIGIT_ACCURACY)
      },
      fTableValLvl: {
        name: this.analysisParams.fTableValLvl.name,
        value: this.utilsService.roundNum(fTableValLvl, DIGIT_ACCURACY)
      },
      fTableValLvlCheck: {
        name: this.analysisParams.fTableValLvlCheck.name,
        value: fTableValueLevelCheck
      }
    }

    const updatedAnalysisData: AnalysisDataDto<any> = {
      ...this.analysisData,
      params: analysisParams
    }

    this.writeAnalysisDataService.setWriteAnalysisData(updatedAnalysisData);
  }

  async downloadWord(filename = FILENAME, 
                    extension: WordPdfExtEnum = WordPdfExtEnum.DOCX)
  {
    await this.wordService.writeAnalysisParamsToWordPdf({ analysisParams: this.analysisParams, filename, extension });
  }

  async downloadPdf(filename = FILENAME, 
                    extension: WordPdfExtEnum = WordPdfExtEnum.PDF)
  {
    await this.wordService.writeAnalysisParamsToWordPdf({ analysisParams: this.analysisParams, filename, extension });
  }

  async downloadExcel(filename = FILENAME, 
                      extension: ExcelExtEnum = ExcelExtEnum.XLSX)
  {
    const tableData = this.utilsService.makeTableDataFromAnalysisParams(this.analysisParams);
    await this.excelService.writeTableToExcel({ tableData, filename, extension });
  }
}
