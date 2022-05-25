import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableTypeEnum } from 'src/app/data-table/enums/table-type.enum';
import { FILENAME, INITIAL_ANALYSIS_DATA, INITIAL_GET_ANALYSIS_DATA, INITIAL_IMAGE_DATA, INITIAL_TABLE_DATA, READ_FILE_TIMOUT } from 'src/app/shared/constants/constants';
import { AnalysisDataDto } from 'src/app/shared/dto/analysis-data.dto';
import { ChartDataDto } from 'src/app/shared/dto/chart-data.dto';
import { FullFileDataDto } from 'src/app/shared/dto/full-file-data.dto';
import { GetAnalysisDataDto } from 'src/app/shared/dto/get-analysis-data.dto';
import { ImageDataDto } from 'src/app/shared/dto/image-data.dto';
import { ExcelExtEnum, FTableSelectValueEnum, SignificanceSelectValueEnum, WordPdfExtEnum } from 'src/app/shared/enums/enums';
import { IAnalysisParams } from 'src/app/shared/interfaces/analysis-params.interface';
import { IFileData } from 'src/app/shared/interfaces/file-data.interface';
import { ITableData } from 'src/app/shared/interfaces/table-data.interface';
import { AnalysisService } from 'src/app/shared/services/analysis/analysis.service';
import { ExcelService } from 'src/app/shared/services/excel/excel.service';
import { FileDataReadService } from 'src/app/shared/services/file-data/read/file-data-read.service';
import { WriteAnalysisDataService } from 'src/app/shared/services/file-data/write-analysis/write-analysis.service';
import { FileDataWriteCalcService } from 'src/app/shared/services/file-data/write-calc/file-data-write-calc.service';
import { FileDataWriteImageService } from 'src/app/shared/services/file-data/write-image/file-data-write-image.service';
import { FileDataWriteRangService } from 'src/app/shared/services/file-data/write-rang/file-data-write-rang.service';
// import { FileDataService } from 'src/app/shared/services/file-data/file-data.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { WordService } from 'src/app/shared/services/word/word.service';
import { PossibleExtEnum } from 'src/app/shared/types/types';

// interface Element  
// {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

// const ELEMENT_DATA_MOCK: Element[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];

// const HEADER_MOCK = ['Position', 'Name', 'Weight', 'Symbol'];

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
              private readonly utilsService: UtilsService) { }

  subsReadFileData?: Subscription;
  subsWriteCalcFileData?: Subscription;
  subsWriteRangFileData?: Subscription;

  subsWriteAnalysisData?: Subscription;
  subsWriteImageFileData?: Subscription;


  // calcTableData: ITableData<any> = {...INITIAL_TABLE_DATA};
  // rangTableData: ITableData<any> = {...INITIAL_TABLE_DATA};

  readTableData: ITableData<any> = {...INITIAL_TABLE_DATA};
  analysisData: AnalysisDataDto<any> = {...INITIAL_ANALYSIS_DATA};
  imageData: ImageDataDto = {...INITIAL_IMAGE_DATA};

  getAnalysisData: GetAnalysisDataDto<any> = INITIAL_GET_ANALYSIS_DATA;

  // analysisParams: IAnalysisParams = new AnalysisDataDto().params;
  // extCalcTableData: ITableData<any> = {...INITIAL_TABLE_DATA};
  // graphData: GraphDataDto = new GraphDataDto();

  // isCompleted?: boolean = false;
  isVisible?: boolean = false;

  readonly outputCalcTableType: TableTypeEnum = TableTypeEnum.OUTPUT_CALC_TABLE_TYPE;
  readonly outputRangTableType: TableTypeEnum = TableTypeEnum.OUTPUT_RANG_TABLE_TYPE;
  readonly outputExtCalcTableType: TableTypeEnum = TableTypeEnum.OUTPUT_EXT_CALC_TABLE_TYPE;


  ngOnInit(): void 
  {
    // this.fileDataService.setWriteFileData(
    // {
    //   tableData: {
    //     header: this.utilsService.makeHeaderFromObj(ELEMENT_DATA_MOCK[0]),
    //     data: ELEMENT_DATA_MOCK
    //   }
    // });

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

        // setTimeout(() => 
        // {
        // this.fileDataWriteCalcService.clearWriteCalcFileData();
        // this.fileDataWriteRangService.clearWriteRangFileData();

        this.readTableData = fileData.tableData;

        const calcTableData = this.analysisService.getCalcTableData(fileData.tableData, false);
        this.fileDataWriteCalcService.setWriteCalcFileData({ ...fileData, tableData: calcTableData });

        const rangTableData = this.analysisService.getRangTableData(fileData.tableData);
        this.fileDataWriteRangService.setWriteRangFileData({ ...fileData, tableData: rangTableData });

        const analysisData = this.analysisService.getAnalysisData({ calcTableData, rangTableData });
        this.getAnalysisData = { ...this.getAnalysisData, calcTableData, rangTableData }
        this.writeAnalysisDataService.setWriteAnalysisData(analysisData);
        // }, READ_FILE_TIMOUT)
        // console.log(fileData.tableData.data.length === 0)
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
    // this.calcTableData = { data, header }
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
    // this.rangTableData = { data, header }
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
    // this.getAanalysisData.funcType = analysisData.chartData.funcType;
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
    // console.log(imageData)
  }

  private handleError(error: any)
  {
    const errMsg = error.message || 'Что-то пошло не так!';//'Something went wrong!';
    throw new Error(errMsg);
  }
}
