import { FuncTypeEnum } from "../enums/enums";


export class GetYxArrayDto
{
    readonly funcType?: FuncTypeEnum = FuncTypeEnum.LINE;
    a0: number = 0;
    a1: number = 0;
    a2: number = 0;
    readonly xArr: number[] = [];
}