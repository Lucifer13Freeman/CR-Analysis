import { ExcelExtEnum } from "../enums/enums";
import { PossibleExtEnum } from "../types/types";
// import { ExcelType } from "../types/types";
import { ITableData } from "./table-data.interface";


export interface IFileData<T>
{
    // data?: Array<T>;
    // header?: Array<string>; 
    tableData: ITableData<T>;
    filename?: string;
    extension?: PossibleExtEnum;
}