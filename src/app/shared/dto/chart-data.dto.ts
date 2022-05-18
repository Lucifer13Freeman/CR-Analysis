import { FuncTypeEnum } from "../enums/enums";
import { Point } from 'chart.js';


export class ChartDataDto
{
    funcType: FuncTypeEnum = FuncTypeEnum.LINE;
    // xArr: number[] = [];
    // YxArr: number[] = [];
    stdChartData: Point[] = [];
    resChartData: Point[] = [];
}