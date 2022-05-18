import { AnalisysDataNamesEnum, ExcelExtEnum, FTableSelectValueEnum, FTableValueLevelTypeEnum, RelationTypeEnum, SignificentTypeEnum, SignificanceSelectValueEnum, WordPdfExtEnum, ImageExtEnum } from "../enums/enums";

// export type ExcelType = 'xlsx' | 'csv';
export type CsvSeparatorType = ExcelExtEnum | undefined;
export type PossibleExtEnum = ExcelExtEnum | WordPdfExtEnum | ImageExtEnum;
// export type TableType = 'input' | 'output_calc' | 'output_rang';

export type AnalysisParamsValueType = number 
                                | SignificanceSelectValueEnum
                                | FTableSelectValueEnum
                                | FTableValueLevelTypeEnum 
                                | RelationTypeEnum 
                                | SignificentTypeEnum 
                                | '';

export type AnalysisParamsType =
{
    name: AnalisysDataNamesEnum | string;
    value: AnalysisParamsValueType
}
