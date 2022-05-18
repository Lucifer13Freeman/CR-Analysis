import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableTypeEnum } from 'src/app/data-table/enums/table-type.enum';
import { INITIAL_ANALYSIS_DATA, INITIAL_GET_ANALYSIS_DATA, INITIAL_TABLE_DATA, READ_FILE_TIMOUT } from 'src/app/shared/constants/constants';
import { AnalysisDataDto } from 'src/app/shared/dto/analysis-data.dto';
import { ChartDataDto } from 'src/app/shared/dto/chart-data.dto';
import { GetAnalysisDataDto } from 'src/app/shared/dto/get-analysis-data.dto';
import { FTableSelectValueEnum, SignificanceSelectValueEnum } from 'src/app/shared/enums/enums';
import { IAnalysisParams } from 'src/app/shared/interfaces/analysis-params.interface';
import { IFileData } from 'src/app/shared/interfaces/file-data.interface';
import { ITableData } from 'src/app/shared/interfaces/table-data.interface';
import { AnalysisService } from 'src/app/shared/services/analysis/analysis.service';
import { FileDataReadService } from 'src/app/shared/services/file-data/read/file-data-read.service';
import { WriteAnalysisService } from 'src/app/shared/services/file-data/write-analysis/write-analysis.service';
import { FileDataWriteCalcService } from 'src/app/shared/services/file-data/write-calc/file-data-write-calc.service';
import { FileDataWriteRangService } from 'src/app/shared/services/file-data/write-rang/file-data-write-rang.service';
// import { FileDataService } from 'src/app/shared/services/file-data/file-data.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

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
              private readonly writeAnalysisDataService: WriteAnalysisService,
              private readonly analysisService: AnalysisService,
              private readonly utilsService: UtilsService) { }

  subsReadFileData?: Subscription;
  subsWriteCalcFileData?: Subscription;
  subsWriteRangFileData?: Subscription;

  subsWriteAnalysisData?: Subscription;

  // calcTableData: ITableData<any> = {...INITIAL_TABLE_DATA};
  // rangTableData: ITableData<any> = {...INITIAL_TABLE_DATA};

  analysisData: AnalysisDataDto<any> = {...INITIAL_ANALYSIS_DATA};

  getAanalysisData: GetAnalysisDataDto<any> = INITIAL_GET_ANALYSIS_DATA;

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
  }

  ngOnDestroy(): void
  {
    this.subsReadFileData?.unsubscribe();
    this.subsWriteCalcFileData?.unsubscribe();
    this.subsWriteRangFileData?.unsubscribe();
    this.subsWriteAnalysisData?.unsubscribe();
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

        const calcTableData = this.analysisService.getCalcTableData(fileData.tableData, false);
        this.fileDataWriteCalcService.setWriteCalcFileData({ ...fileData, tableData: calcTableData });

        const rangTableData = this.analysisService.getRangTableData(fileData.tableData);
        this.fileDataWriteRangService.setWriteRangFileData({ ...fileData, tableData: rangTableData });

        const analysisData = this.analysisService.getAnalysisData({ calcTableData, rangTableData });
        this.getAanalysisData = { ...this.getAanalysisData, calcTableData, rangTableData }
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
    this.getAanalysisData.calcTableData = { data, header };
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
    this.getAanalysisData.rangTableData = { data, header };
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
    this.getAanalysisData = {
      ...this.getAanalysisData,
      funcType: analysisData.chartData.funcType,
      fTableValLvlSelectVal: analysisData.params.fTableValLvlSelectVal.value as FTableSelectValueEnum,
      signLvlSelectVal: analysisData.params.signLvlSelectVal.value as SignificanceSelectValueEnum
    }
  }

  private handleError(error: any)
  {
    const errMsg = error.message || 'Something went wrong!';
    throw new Error(errMsg);
  }
}
