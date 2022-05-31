import { AnalisysDataNamesEnum, 
        ExcelExtEnum, 
        FTableSelectValueEnum, 
        FTableValueLevelTypeEnum, 
        RelationTypeEnum, 
        SignificentTypeEnum, 
        SignificanceSelectValueEnum, 
        WordPdfExtEnum, 
        ImageExtEnum, 
        RelationDirectionEnum, 
        RegressionFuncEnum, 
        PPTXExtEnum } from "../enums/enums";

        
export type CsvSeparatorType = ExcelExtEnum | undefined;
export type PossibleExtEnum = ExcelExtEnum | WordPdfExtEnum | ImageExtEnum | PPTXExtEnum;

export type AnalysisParamsValueType = number 
                                | SignificanceSelectValueEnum
                                | FTableSelectValueEnum
                                | FTableValueLevelTypeEnum 
                                | RelationTypeEnum 
                                | RelationDirectionEnum
                                | SignificentTypeEnum 
                                | RelationType
                                | RegressionFuncEnum
                                | '';

export type AnalysisParamsType = {
    name: AnalisysDataNamesEnum | string | undefined;
    value: AnalysisParamsValueType;
}

export type RelationType = `${RelationDirectionEnum.DIRECT} ${RelationTypeEnum.STRONG}` 
                        | `${RelationDirectionEnum.DIRECT} ${RelationTypeEnum.MEDIUM}`
                        | `${RelationDirectionEnum.DIRECT} ${RelationTypeEnum.WEAK}`
                        | `${RelationDirectionEnum.BACK} ${RelationTypeEnum.STRONG}`
                        | `${RelationDirectionEnum.BACK} ${RelationTypeEnum.MEDIUM}`
                        | `${RelationDirectionEnum.BACK} ${RelationTypeEnum.WEAK}`
                        | RelationTypeEnum.NONE | RelationTypeEnum;
