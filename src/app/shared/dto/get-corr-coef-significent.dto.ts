import { SignificanceSelectValueEnum } from "../enums/enums";

export class GetCorrCoefSignificentDto
{
    signLvlSelectVal: SignificanceSelectValueEnum = SignificanceSelectValueEnum.VALUE_1;
    coefCorrSignCheck: number = 0; 
    count: number = 0;
}