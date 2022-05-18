import { FuncTypeEnum } from "../enums/enums";


export class GetAValsAndElastDto<T>
{
    readonly funcVariant?: FuncTypeEnum = FuncTypeEnum.LINE;
    sumRow!: T;
    avgRow!: T;
    readonly xArr: number[] = [];
}