import { AnalisysDataNamesEnum, ExcelExtEnum, FTableSelectValueEnum, FTableValueLevelTypeEnum, RelationTypeEnum, SignificentTypeEnum, SignificanceSelectValueEnum, WordPdfExtEnum, ImageExtEnum, RelationDirectionEnum } from "../enums/enums";

// export type ExcelType = 'xlsx' | 'csv';
export type CsvSeparatorType = ExcelExtEnum | undefined;
export type PossibleExtEnum = ExcelExtEnum | WordPdfExtEnum | ImageExtEnum;
// export type TableType = 'input' | 'output_calc' | 'output_rang';

export type AnalysisParamsValueType = number 
                                | SignificanceSelectValueEnum
                                | FTableSelectValueEnum
                                | FTableValueLevelTypeEnum 
                                | RelationTypeEnum 
                                | RelationDirectionEnum
                                | SignificentTypeEnum 
                                | RelationType
                                | '';

export type AnalysisParamsType = {
    name: AnalisysDataNamesEnum | string;
    value: AnalysisParamsValueType;
}

export type RelationType = `${RelationDirectionEnum.DIRECT} ${RelationTypeEnum.STRONG}` 
                        | `${RelationDirectionEnum.DIRECT} ${RelationTypeEnum.MEDIUM}`
                        | `${RelationDirectionEnum.DIRECT} ${RelationTypeEnum.WEAK}`
                        | `${RelationDirectionEnum.BACK} ${RelationTypeEnum.STRONG}`
                        | `${RelationDirectionEnum.BACK} ${RelationTypeEnum.MEDIUM}`
                        | `${RelationDirectionEnum.BACK} ${RelationTypeEnum.WEAK}`
                        | RelationTypeEnum.NONE | RelationTypeEnum;
