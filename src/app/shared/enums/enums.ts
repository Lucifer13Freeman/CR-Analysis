
// export enum TableTypeEnum
// {
//     INPUT_TABLE_TYPE = 'INPUT_TABLE_TYPE',
//     OUTPUT_CALC_TABLE_TYPE = 'OUTPUT_CALC_TABLE_TYPE',
//     OUTPUT_RANG_TABLE_TYPE = 'OUTPUT_RANG_TABLE_TYPE',
//     OUTPUT_EXT_CALC_TABLE_TYPE = 'OUTPUT_EXT_CALC_TABLE_TYPE'
// }

// export type ExcelType = 'xlsx' | 'csv';
// export type CsvSeparatorType = ';' | ',' | undefined;

export enum CsvSeparatorTypeEnum
{
    DOT_COMMA = ';',
    COMMA = ','
}

export enum ExcelExtEnum
{
    XLSX = 'xlsx',
    CSV = 'csv'
}

export enum WordPdfExtEnum
{
    DOCX = 'docx',
    DOC = 'doc',
    PDF = 'pdf'
}

export enum ImageExtEnum
{
    PNG = 'png',
    JPG = 'jpg'
}

export enum MimeTypeEnum
{
    WORD = '"application/vnd.openxmlformats-officedocument.wordprocessingml.document";',
    EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    PDF = 'application/pdf'
}

export enum HeaderLabelsEnum
{
  id = '№',

  X = 'X',
  Y = 'Y',

  X2 = 'X^2',
  Y2 = 'Y^2',
  XY = 'XY',
  X3 = 'X^3',
  X4 = 'X^4',
  X2Y = 'X^2 * Y',
  lnY = 'ln(Y)',
  XlnY = 'X * ln(Y)',

  Nx = 'Ранги Nx',
  Ny = 'Ранги Ny',
  d = 'd = Nx - Ny',
  d2 = 'd^2',

  Yx = 'F(X)',
  YYx = '|Y - F(X)|',
  YxY2 = '(F(X) - Y)^2',
  YAvgY2 = '(Y - avg(Y))^2',
  YAvgYx2 = '(Y - avg(F(X)))^2',
  AvgYxAvgY2 = '(avg(F(X)) - avg(Y))^2',

  name = 'Параметр',
  value = 'Значение'
}

export enum DownloadButtonLabelsEnum
{
    WORD = 'Скачать Word',
    EXCEL = 'Скачать Excel',
    PDF = 'Скачать PDF',
    PNG = 'Скачать PNG',
    JPG = 'Скачать JPG'
}

export enum FullFileDataHeaderWordEnum 
{
    MAIN_HEADER = "Результаты корреляционно-регрессионного анализа",
    READ_TABLE_DATA = "Таблица входных данных",
    CALC_TABLE_DATA= "Таблица промежуточных вычислений 1",
    RANG_TABLE_DATA = "Таблица рангов",
    EXT_CALC_TABLE_DATA = "Таблица промежуточных вычислений 2",
    ANALYSIS_PARAMS = "Параметры анализа",
    CHART_DATA = "График"
}

export enum FullFileDataHeaderExcelEnum 
{
    READ_TABLE_DATA = "Входные данные",
    CALC_TABLE_DATA= "Промежуточные вычисления 1",
    RANG_TABLE_DATA = "Ранги",
    EXT_CALC_TABLE_DATA = "Промежуточные вычисления 2",
    ANALYSIS_PARAMS = "Параметры анализа",
    CHART_DATA = "График"
}

export enum FuncTypeEnum
{
    LINE = 'LINE',
    PARABOLA = 'PARABOLA',
    EXPONENTIAL = 'EXPONENTIAL'
}

export enum FuncTypeViewValuesEnum
{
    LINE = 'Прямая',
    PARABOLA = 'Парабола',
    EXPONENTIAL = 'Показательная функция'
}

export enum RelationDirectionEnum
{
    DIRECT = 'прямая',
    BACK = 'обратная',
    NONE = ''
}

export enum RelationTypeEnum
{
    NONE = 'отсутствует',
    WEAK = 'слабая',
    MEDIUM = 'средней силы',
    STRONG = 'сильная'
}

export enum SignificentTypeEnum
{
    SIGNIFICANCE = 'значим',
    NOT_SIGNIFICANCE = 'не значим'
}

export enum FTableValueLevelTypeEnum
{
    SIGNIFICANCE = 'F расч > F табл - значим',
    NOT_SIGNIFICANCE = 'F расч < F табл - не значим'
}

export enum SignificanceSelectValueEnum
{
    VALUE_1 = '0.05',
    VALUE_2 = '0.01',
    VALUE_3 = '0.001'
}

export enum FTableSelectValueEnum
{
    VALUE_1 = '0.05',
    VALUE_2 = '0.01'
}

export enum AnalisysDataNamesEnum
{
    MEAN_SQUARE_OFF_X = 'Среднеквадратичное отклонение для признака X',
    MEAN_SQUARE_OFF_Y = 'Среднеквадратичное отклонение для признака Y',
    
    LINEAR_CORREL_COEF = 'Линейный коэффициент корреляции',
    AVG_CORREL_COEF_ERROR = 'Средняя ошибка коэффициента корреляции',

    COEF_CORREL_SIGNIFICANCE_LEVEL_CHECK = 'Проверка коэффициента корреляции на значимость',
    
    SIGNIFICANCE_LEVEL = 'Уровень значимости',
    T_TABLE= 't - таблицы',

    RELATION_XY = 'Связь между признаками X и Y по коэффициенту корреляции',
    COEF_CORREL_SIGNIFICANCE = 'Коэффициент корреляции',
    
    RELATION_XY_SPEARMAN = 'Связь между признаками X и Y по коэффициенту Спирмена',
    SPEARMAN_COEF = 'Коэффициент Спирмена',
    ELASTICITY = 'Эластичность',
    
    AVG_APPROXIMATION_ERROR = 'Средняя ошибка аппроксимации',

    FACTOR_DISPERSION = 'Факторная дисперсия',
    RESIDUAL_DISPERSION = 'Остаточная дисперсия',

    TOTAL_DISPERSION = 'Общая дисперсия',
    TOTAL_DISPERSION_CHECK = 'Проверка общей дисперсии',

    THEOR_COEF_DETERMINATION = 'Теоретический коэффициент детерминации',
    THEOR_CORREL_RELATION = 'Теоретическое корреляционное отношение',

    AVG_PARAM_A0_ERROR = 'Средняя ошибка параметров а0',
    AVG_PARAM_A1_ERROR = 'Средняя ошибка параметров а1',

    T_A0 = 't a0',
    T_A1 = 't a1',

    FISHER_CRITERION = 'F-критерий Фишера',

    F_TABLE_VAL_LEVEL = 'Уровень значений F-таблицы'
}
