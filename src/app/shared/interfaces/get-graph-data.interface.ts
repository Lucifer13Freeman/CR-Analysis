import { FuncTypeEnum } from "../enums/enums";


export interface getYxArray<T>
{
    funcVariant: FuncTypeEnum;
    sumRow: T,
    avgRow: T,
    xArr: number[];
}