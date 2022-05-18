import { FTableSelectValueEnum, SignificanceSelectValueEnum } from "src/app/shared/enums/enums";


export interface ISelectValues
{
  value: SignificanceSelectValueEnum | FTableSelectValueEnum;
  viewValue: SignificanceSelectValueEnum | FTableSelectValueEnum;
}