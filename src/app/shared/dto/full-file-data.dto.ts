import { FILENAME, INITIAL_ANALYSIS_DATA, INITIAL_ANALYSIS_PARAMS, INITIAL_TABLE_DATA } from "../constants/constants";
import { ExcelExtEnum, FuncTypeEnum, WordPdfExtEnum } from "../enums/enums";
import { IAnalysisParams } from "../interfaces/analysis-params.interface";
import { ITableData } from "../interfaces/table-data.interface";
import { PossibleExtEnum } from "../types/types";
import { AnalysisDataDto } from "./analysis-data.dto";


export class FullFileDataDto<T>
{
    readonly readTableData: ITableData<T> = INITIAL_TABLE_DATA;
    readonly calcTableData: ITableData<T> = INITIAL_TABLE_DATA;
    readonly rangTableData: ITableData<T> = INITIAL_TABLE_DATA;
    readonly extCalcTableData: ITableData<T> = INITIAL_TABLE_DATA;
    // readonly analysisData: AnalysisDataDto<any> = INITIAL_ANALYSIS_DATA;
    readonly analysisParams: IAnalysisParams = INITIAL_ANALYSIS_PARAMS;
    readonly funcType: FuncTypeEnum = FuncTypeEnum.LINE;
    readonly canvasElement?: HTMLCanvasElement;
    readonly filename?: string = FILENAME;
    readonly extension?: PossibleExtEnum = WordPdfExtEnum.DOCX;
}