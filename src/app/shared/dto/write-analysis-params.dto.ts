import { FILENAME, INITIAL_ANALYSIS_PARAMS, INITIAL_TABLE_DATA } from "../constants/constants";
import { ExcelExtEnum, WordPdfExtEnum } from "../enums/enums";
import { IAnalysisParams } from "../interfaces/analysis-params.interface";
import { ITableData } from "../interfaces/table-data.interface";
import { TableDataDto } from "./table-data.dto";


export class AnalysisParamsDto//<T>
{
    // readonly tableDataArr?: ITableData<T>[] = [{...INITIAL_TABLE_DATA}];
    readonly analysisParams?: IAnalysisParams = {...INITIAL_ANALYSIS_PARAMS};
    // readonly chartImage?: HTMLCanvasElement;
    readonly filename?: string = FILENAME;
    readonly extension?: WordPdfExtEnum = WordPdfExtEnum.DOCX;
}