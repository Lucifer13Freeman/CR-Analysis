import { FTableValueLevelTypeEnum } from "../enums/enums";

export interface IFisherCriterion
{
    // V1: number;
    // V2: number;
    fisherCrit: number;
    fTableValLvl: number;
    fTableValueLevelCheck: FTableValueLevelTypeEnum;
}