import { INITIAL_TABLE_DATA } from "../constants/constants";
import { FTableSelectValueEnum, FuncTypeEnum, SignificanceSelectValueEnum } from "../enums/enums"
import { ITableData } from "../interfaces/table-data.interface"


export class GetAnalysisDataDto<T> 
{
    calcTableData: ITableData<T> = {...INITIAL_TABLE_DATA};
    rangTableData: ITableData<T> = {...INITIAL_TABLE_DATA};
    signLvlSelectVal: SignificanceSelectValueEnum = SignificanceSelectValueEnum.VALUE_1;
    fTableValLvlSelectVal: FTableSelectValueEnum = FTableSelectValueEnum.VALUE_1;
    funcType?: FuncTypeEnum = FuncTypeEnum.LINE;
}