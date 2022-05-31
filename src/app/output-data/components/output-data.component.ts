import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableTypeEnum } from 'src/app/data-table/enums/table-type.enum';
import { FILENAME, INITIAL_ANALYSIS_DATA, 
      INITIAL_GET_ANALYSIS_DATA, 
      INITIAL_IMAGE_DATA, INITIAL_TABLE_DATA } from 'src/app/shared/constants/constants';
import { AnalysisDataDto } from 'src/app/shared/dto/analysis-data.dto';
import { FullFileDataDto } from 'src/app/shared/dto/full-file-data.dto';
import { GetAnalysisDataDto } from 'src/app/shared/dto/get-analysis-data.dto';
import { ImageDataDto } from 'src/app/shared/dto/image-data.dto';
import { DownloadButtonLabelsEnum, ExcelExtEnum, 
        FTableSelectValueEnum, FullFileDataHeaderEnum, 
        PPTXExtEnum, SignificanceSelectValueEnum, 
        WordPdfExtEnum } from 'src/app/shared/enums/enums';
import { IFileData } from 'src/app/shared/interfaces/file-data.interface';
import { ITableData } from 'src/app/shared/interfaces/table-data.interface';
import { AnalysisService } from 'src/app/shared/services/analysis/analysis.service';
import { ExcelService } from 'src/app/shared/services/excel/excel.service';
import { FileDataReadService } from 'src/app/shared/services/file-data/read/file-data-read.service';
import { WriteAnalysisDataService } from 'src/app/shared/services/file-data/write-analysis/write-analysis.service';
import { FileDataWriteCalcService } from 'src/app/shared/services/file-data/write-calc/file-data-write-calc.service';
import { FileDataWriteImageService } from 'src/app/shared/services/file-data/write-image/file-data-write-image.service';
import { FileDataWriteRangService } from 'src/app/shared/services/file-data/write-rang/file-data-write-rang.service';
import { PptxService } from 'src/app/shared/services/pptx/pptx.service';
import { WordService } from 'src/app/shared/services/word/word.service';
import { PossibleExtEnum } from 'src/app/shared/types/types';


@Component(
{
  selector: 'app-output-data',
  templateUrl: './output-data.component.html',
  styleUrls: ['./output-data.component.scss']
})
export class OutputDataComponent implements OnInit, OnDestroy
{
  constructor(private readonly fileDataReadService: FileDataReadService,
              private readonly fileDataWriteCalcService: FileDataWriteCalcService,
              private readonly fileDataWriteRangService: FileDataWriteRangService,
              private readonly fileDataWriteImageService: FileDataWriteImageService,
              private readonly writeAnalysisDataService: WriteAnalysisDataService,
              private readonly analysisService: AnalysisService,
              private readonly excelService: ExcelService,
              private readonly wordService: WordService,
              private readonly pptxService: PptxService) { }

  subsReadFileData?: Subscription;
  subsWriteCalcFileData?: Subscription;
  subsWriteRangFileData?: Subscription;

  subsWriteAnalysisData?: Subscription;
  subsWriteImageFileData?: Subscription;

  header = FullFileDataHeaderEnum;
  downloadButtonLabels = DownloadButtonLabelsEnum;

  readTableData: ITableData<any> = {...INITIAL_TABLE_DATA};
  analysisData: AnalysisDataDto<any> = {...INITIAL_ANALYSIS_DATA};
  imageData: ImageDataDto = {...INITIAL_IMAGE_DATA};

  getAnalysisData: GetAnalysisDataDto<any> = INITIAL_GET_ANALYSIS_DATA;

  isVisible?: boolean = false;

  readonly outputCalcTableType: TableTypeEnum = TableTypeEnum.OUTPUT_CALC_TABLE_TYPE;
  readonly outputRangTableType: TableTypeEnum = TableTypeEnum.OUTPUT_RANG_TABLE_TYPE;
  readonly outputExtCalcTableType: TableTypeEnum = TableTypeEnum.OUTPUT_EXT_CALC_TABLE_TYPE;


  ngOnInit(): void 
  {
    this.checkReadFileData();
    this.getWriteCalcFileData();
    this.getWriteRangFileData();
    this.getWriteAnalysisData();
    this.getWriteImageFileData();
  }

  ngOnDestroy(): void
  {
    this.subsReadFileData?.unsubscribe();
    this.subsWriteCalcFileData?.unsubscribe();
    this.subsWriteRangFileData?.unsubscribe();
    this.subsWriteAnalysisData?.unsubscribe();
    this.subsWriteImageFileData?.unsubscribe();
  }

  async downloadExcel(filename: string = FILENAME, 
                      extension: ExcelExtEnum = ExcelExtEnum.XLSX)
  {
    const fullFileData: FullFileDataDto<any> = this.getFullFileData(filename, extension);
    await this.excelService.writeFullFileDataToExcel(fullFileData);
  }

  async downloadWord(filename: string = FILENAME, 
                    extension: WordPdfExtEnum = WordPdfExtEnum.DOCX)
  {
    const fullFileData: FullFileDataDto<any> = this.getFullFileData(filename, extension);
    await this.wordService.writeFullDataToWordPdf(fullFileData);
  }

  async downloadPdf(filename: string = FILENAME, 
                    extension: WordPdfExtEnum = WordPdfExtEnum.PDF)
  {
    const fullFileData: FullFileDataDto<any> = this.getFullFileData(filename, extension);
    await this.wordService.writeFullDataToWordPdf(fullFileData);
  }

  async downloadPPTX(filename: string = FILENAME, 
                    extension: PPTXExtEnum = PPTXExtEnum.PPTX)
  {
    const fullFileData: FullFileDataDto<any> = this.getFullFileData(filename, extension);
    await this.pptxService.writeFullDataToPPTX(fullFileData);
  }

  private getFullFileData(filename: string = FILENAME, 
                          extension: PossibleExtEnum = WordPdfExtEnum.DOCX) 
  {
    const fullFileData: FullFileDataDto<any> = {
      readTableData: this.readTableData,
      calcTableData: this.getAnalysisData.calcTableData,
      rangTableData: this.getAnalysisData.rangTableData,
      extCalcTableData: this.analysisData.tableData,
      analysisParams: this.analysisData.params,
      funcType: this.analysisData.chartData.funcType,
      canvasElement: this.imageData.canvasElement,
      filename,
      extension
    }

    return fullFileData;
  }

  private checkReadFileData()
  {
    this.subsReadFileData = this.fileDataReadService.getReadFileData().subscribe(
    {
      next: (fileData: IFileData<any>) => 
      {
        this.isVisible = fileData.tableData.data.length !== 0;


        this.readTableData = fileData.tableData;

        const calcTableData = this.analysisService.getCalcTableData(fileData.tableData, false);
        this.fileDataWriteCalcService.setWriteCalcFileData({ ...fileData, tableData: calcTableData });

        const rangTableData = this.analysisService.getRangTableData(fileData.tableData);
        this.fileDataWriteRangService.setWriteRangFileData({ ...fileData, tableData: rangTableData });

        const analysisData = this.analysisService.getAnalysisData({ calcTableData, rangTableData });
        this.getAnalysisData = { ...this.getAnalysisData, calcTableData, rangTableData }
        this.writeAnalysisDataService.setWriteAnalysisData(analysisData);
      }
    });
  }

  private getWriteCalcFileData()
  {
    this.subsWriteCalcFileData = this.fileDataWriteCalcService.getWriteCalcFileData().subscribe(
    {
      next: (fileData: IFileData<any>) => this.setWriteCalcFileData(fileData),
      error: this.handleError
    });
  }

  private setWriteCalcFileData(fileData: IFileData<any>)
  {
    const { data, header } = fileData.tableData;
    this.getAnalysisData.calcTableData = { data, header };
  }

  private getWriteRangFileData()
  {
    this.subsWriteRangFileData = this.fileDataWriteRangService.getWriteRangFileData().subscribe(
    {
      next: (fileData: IFileData<any>) => this.setWriteRangFileData(fileData),
      error: this.handleError
    });
  }

  private setWriteRangFileData(fileData: IFileData<any>)
  {
    const { data, header } = fileData.tableData;
    this.getAnalysisData.rangTableData = { data, header };
  }

  private getWriteAnalysisData()
  {
    this.subsWriteAnalysisData = this.writeAnalysisDataService.getWriteAnalysisData().subscribe(
    {
      next: (analysisData: AnalysisDataDto<any>) => this.setWriteAnalysisData(analysisData),
      error: this.handleError
    });
  }

  private setWriteAnalysisData(analysisData: AnalysisDataDto<any>)
  {
    this.analysisData = analysisData;
    this.getAnalysisData = {
      ...this.getAnalysisData,
      funcType: analysisData.chartData.funcType,
      fTableValLvlSelectVal: analysisData.params.fTableValLvlSelectVal.value as FTableSelectValueEnum,
      signLvlSelectVal: analysisData.params.signLvlSelectVal.value as SignificanceSelectValueEnum
    }
  }

  private getWriteImageFileData()
  {
    this.subsWriteImageFileData = this.fileDataWriteImageService.getWriteImageFileData().subscribe(
    {
      next: (imageData: ImageDataDto) => this.setWriteImageFileData(imageData),
      error: this.handleError
    });
  }

  private setWriteImageFileData(imageData: ImageDataDto)
  {
    this.imageData = imageData;
  }

  private handleError(error: any)
  {
    const errMsg = error.message || 'Что-то пошло не так!';//'Something went wrong!';
    throw new Error(errMsg);
  }
}
