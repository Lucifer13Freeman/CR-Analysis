import { FuncTypeEnum } from "../enums/enums";


export interface getYxArray<T>
{
    funcVariant: FuncTypeEnum;
    sumRow: T,
    avgRow: T,
    // sumX: number; 
    // sumX2: number;
    // sumX3: number;
    // sumX4: number;
    // sumY: number;
    // sumX2Y: number;
    // sumLnY: number;
    // sumXLnY: number;
    xArr: number[];
}