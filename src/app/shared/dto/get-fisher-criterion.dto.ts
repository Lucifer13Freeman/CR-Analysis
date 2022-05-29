import { FTableSelectValueEnum } from "../enums/enums";

export class GetFisherCriterionDto 
{
    V1: number = 0;
    V2: number = 0;
    fTableValLvlSelectVal: FTableSelectValueEnum = FTableSelectValueEnum.VALUE_1;
    factorDispersion: number = 0;
    residualDispersion: number = 0;
    count: number = 0;
}