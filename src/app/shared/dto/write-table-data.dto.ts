import { FILENAME, INITIAL_TABLE_DATA } from "../constants/constants";
import { ExcelExtEnum } from "../enums/enums";
import { ITableData } from "../interfaces/table-data.interface";
import { PossibleExtEnum } from "../types/types";


export class WriteTableDataDto<T>
{
    readonly tableData: ITableData<T> = {...INITIAL_TABLE_DATA};
    readonly filename?: string = FILENAME;
    readonly extension?: PossibleExtEnum = ExcelExtEnum.XLSX;
}