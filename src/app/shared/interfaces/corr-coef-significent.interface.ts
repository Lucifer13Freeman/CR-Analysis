import { SignificanceSelectValueEnum, SignificentTypeEnum } from "../enums/enums";


export interface ICorrCoefSignificent
{
  signLvlSelectValIdx: number;
  tTable: number;
  coefCorrSign: SignificentTypeEnum;
}