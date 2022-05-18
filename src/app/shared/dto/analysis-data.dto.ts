import { INITIAL_ANALYSIS_PARAMS, INITIAL_CHART_DATA, INITIAL_TABLE_DATA } from "../constants/constants";
import { IAnalysisParams } from "../interfaces/analysis-params.interface";
import { ITableData } from "../interfaces/table-data.interface";
import { ChartDataDto } from "./chart-data.dto";


export class AnalysisDataDto<T>
{
    params: IAnalysisParams = {...INITIAL_ANALYSIS_PARAMS};
    tableData: ITableData<T> = {...INITIAL_TABLE_DATA};
    chartData: ChartDataDto = {...INITIAL_CHART_DATA};
}