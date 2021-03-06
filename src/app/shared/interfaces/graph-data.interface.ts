import { FuncTypeEnum, RegressionFuncEnum } from "../enums/enums";

export interface IAValuesAndElasticy
{
    a: number; 
    a0: number;
    a1: number;
    a2: number;
    elasticity: number;
    funcParamsCount: number;
    func: RegressionFuncEnum;
}