import { FTableSelectValueEnum, 
        FuncTypeEnum, 
        SignificanceSelectValueEnum } from "../enums/enums";
import { ITableData } from "./table-data.interface";


export interface IGetAnalysisData<T> 
{
    calcTableData: ITableData<T>;
    rangTableData: ITableData<T>;
    signLvlSelectVal?: SignificanceSelectValueEnum;
    fTableValLvlSelectVal?: FTableSelectValueEnum;
    funcType?: FuncTypeEnum;
}