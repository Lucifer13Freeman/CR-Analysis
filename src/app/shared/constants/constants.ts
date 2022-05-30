import { AnalysisDataDto } from '../dto/analysis-data.dto';
import { ChartDataDto } from '../dto/chart-data.dto';
import { GetAnalysisDataDto } from '../dto/get-analysis-data.dto';
import { ImageDataDto } from '../dto/image-data.dto';
import { TableDataDto } from '../dto/table-data.dto';
import { AnalisysDataNamesEnum, FTableSelectValueEnum, FuncTypeEnum, FuncTypeViewValuesEnum, HeaderLabelsEnum, ImageExtEnum, RegressionFuncEnum, SignificanceSelectValueEnum } from '../enums/enums';
import { IAnalysisParams } from '../interfaces/analysis-params.interface';
import { IFuncTypeValues } from '../interfaces/func-type-values.interface';
import { ITableData } from '../interfaces/table-data.interface';

export const HEADER_LABLES_FOR_KEYS_FROM_FILE = ['x', 'y'];

// export const HEADER_LABLES_FROM_FILE = ['X', 'Y'];

// export const HEADER_LABLES

export const INITIAL_TABLE_DATA: ITableData<any> = {
  data: [],
  header: [],
};

export const INITIAL_MANUAL_READ_TABLE_DATA: ITableData<any> = {
  data: [{ id: 1, X: 0, Y: 0 }],
  header: ['№', 'X', 'Y'],
};

export const INITIAL_FILE_DATA = {
  tableData: { ...INITIAL_TABLE_DATA },
  filename: undefined,
  extension: undefined,
};

// export const INPUT_TABLE_TYPE = 'input';
// export const OUTPUT_CALC_TABLE_TYPE = 'output_calc';
// export const OUTPUT_RANG_TABLE_TYPE = 'output_rang';

export const READ_FILE_TIMOUT: number = 100;
export const READ_FILE_INTERVAL: number = 100;
export const READ_FILE_SPEED: number = 20;

export const WRITE_FILE_TIMOUT: number = 100;

// export const READ_FILE_TIMOUT: number = 50;
// export const READ_FILE_INTERVAL: number = 50;
// export const READ_FILE_SPEED: number = 50;

// export const WRITE_FILE_TIMOUT: number = 50;

export const CSV_DELIMITER = ';';
export const CSV_POSSIBLE_SEPARATORS = [',', ';', '|', '\t'];

// export const EXCEL_MIME_TYPE =
  // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

// export const EXCEL_EXT = 'xlsx';

// export const WORD_MIME_TYPE =
//   '"application/vnd.openxmlformats-officedocument.wordprocessingml.document";';

// export const PDF_MIME_TYPE = 'application/pdf';

export const WORD_FONT_SIZE = 28;
export const WORD_FONT_HEADER_SIZE = 32;

// export const WORDL_EXT = 'docx';


export const FILENAME = 'sr-analysis';
// export const FILENAME = `${BASE_FILENAME}-${new Date().valueOf()}`;

export const DIGIT_ACCURACY = 3;//5;
export const DIGIT_ACCURACY_FOR_SMALL_NUMS = 8;

export const HIDDEN_PARAM_NAME = undefined;
export const HIDDEN_PARAM_VALUE = '';

export const INITIAL_ANALYSIS_PARAMS: IAnalysisParams = {
  meanSqrOffX: { 
      name: AnalisysDataNamesEnum.MEAN_SQUARE_OFF_X, 
      value: 0 
  },
  meanSqrOffY: { 
      name: AnalisysDataNamesEnum.MEAN_SQUARE_OFF_Y, 
      value: 0 
  },
  linearCorrCoef: { 
      name: AnalisysDataNamesEnum.LINEAR_CORREL_COEF, 
      value: 0 
  },
  avgCorrCoefErr: { 
      name: AnalisysDataNamesEnum.AVG_CORREL_COEF_ERROR, 
      value: 0 
  },
  coefCorrSignCheck: { 
      name: AnalisysDataNamesEnum.COEF_CORREL_SIGNIFICANCE_LEVEL_CHECK, 
      value: 0 
  },
  signLvlSelectVal: { 
      name: AnalisysDataNamesEnum.SIGNIFICANCE_LEVEL, 
      value: SignificanceSelectValueEnum.VALUE_1 
  },
  tTable: { 
      name: AnalisysDataNamesEnum.T_TABLE, 
      value: 0 
  },
  relXY: { 
      name: AnalisysDataNamesEnum.RELATION_XY, 
      value: ''
  },
  coefCorrSign: {
      name: AnalisysDataNamesEnum.COEF_CORREL_SIGNIFICANCE,
      value: ''
  },
  spearmanCoeff: { 
      name: AnalisysDataNamesEnum.SPEARMAN_COEF, 
      value: 0 
  },
  relXYspearman: {
    name: AnalisysDataNamesEnum.RELATION_XY_SPEARMAN, 
    value: 0 
  },
  elasticity: { 
      name: AnalisysDataNamesEnum.ELASTICITY, 
      value: 0 
  },
  avgApproxErr: { 
      name: AnalisysDataNamesEnum.AVG_APPROXIMATION_ERROR, 
      value: 0 
  },
  factorDispersion: { 
      name: AnalisysDataNamesEnum.FACTOR_DISPERSION, 
      value: 0 
  },
  residualDispersion: { 
      name: AnalisysDataNamesEnum.RESIDUAL_DISPERSION, 
      value: 0 
  },
  totalDispersion: { 
      name: AnalisysDataNamesEnum.TOTAL_DISPERSION, 
      value: 0 
  },
  totalDispersionCheck: { 
      name: AnalisysDataNamesEnum.TOTAL_DISPERSION_CHECK, 
      value: 0 
  },
  theorCoefDeterm: { 
      name: AnalisysDataNamesEnum.THEOR_COEF_DETERMINATION, 
      value: 0 
  },
  theorCorrRel: { 
      name: AnalisysDataNamesEnum.THEOR_CORREL_RELATION, 
      value: 0 
  },
  func: {
    name: AnalisysDataNamesEnum.FUNC,
    value: RegressionFuncEnum.LINE
  },
  a0: {
    name: AnalisysDataNamesEnum.A0, 
    value: 0
  },
  a1: {
    name: AnalisysDataNamesEnum.A1, 
    value: 0
  },
  a2: {
    name: HIDDEN_PARAM_NAME, 
    value: 0
  },
  avgA0Err: { 
      name: AnalisysDataNamesEnum.AVG_PARAM_A0_ERROR, 
      value: HIDDEN_PARAM_VALUE 
  },
  avgA1Err: { 
      name: AnalisysDataNamesEnum.AVG_PARAM_A1_ERROR, 
      value: 0 
  },
  avgA2Err: { 
    name: HIDDEN_PARAM_NAME, 
    value: HIDDEN_PARAM_VALUE 
  },
  tA0: { 
      name: AnalisysDataNamesEnum.T_A0, 
      value: 0 
  },
  tA1: { 
      name: AnalisysDataNamesEnum.T_A1, 
      value: 0 
  },
  tA2: { 
    name: HIDDEN_PARAM_NAME, 
    value: HIDDEN_PARAM_VALUE 
  },
  tA0Check: { 
      name: '', 
      value: 0 
  },
  tA1Check: { 
      name: '', 
      value: 0 
  },
  tA2Check: { 
    name: HIDDEN_PARAM_NAME, 
    value: HIDDEN_PARAM_VALUE 
  },
  fisherCrit: { 
      name: AnalisysDataNamesEnum.FISHER_CRITERION, 
      value: 0 
  },
  fTableValLvlSelectVal: {
      name: '',
      value: FTableSelectValueEnum.VALUE_1
  },
  fTableValLvl: { 
      name: AnalisysDataNamesEnum.F_TABLE_VAL_LEVEL, 
      value: 0 
  },
  fTableValLvlCheck: {
      name: '',
      value: 0
  },
  count: 0,
  V1: 0,
  V2: 0
}

export const INITIAL_CHART_DATA: ChartDataDto = {
  // xArr: [], 
  // YxArr: []
  funcType: FuncTypeEnum.LINE,
  stdChartData: [],
  resChartData: []
}

export const INITIAL_ANALYSIS_DATA: AnalysisDataDto<any> = {
  params: {...INITIAL_ANALYSIS_PARAMS},
  tableData: {...INITIAL_TABLE_DATA},
  chartData: {...INITIAL_CHART_DATA}
}

export const INITIAL_IMAGE_DATA: ImageDataDto = {
  canvasElement: undefined,
  filename: FILENAME,
  extension: ImageExtEnum.PNG
}

export const INITIAL_GET_ANALYSIS_DATA: GetAnalysisDataDto<any> = {
  calcTableData: {...INITIAL_TABLE_DATA},
  rangTableData: {...INITIAL_TABLE_DATA},
  signLvlSelectVal: SignificanceSelectValueEnum.VALUE_1,
  fTableValLvlSelectVal: FTableSelectValueEnum.VALUE_1,
  funcType: FuncTypeEnum.LINE
}

export const FUNC_TYPE_VALUES: IFuncTypeValues[] = [
  { value: FuncTypeEnum.LINE, viewValue: FuncTypeViewValuesEnum.LINE },
  { value: FuncTypeEnum.PARABOLA, viewValue: FuncTypeViewValuesEnum.PARABOLA },
  { value: FuncTypeEnum.EXPONENTIAL, viewValue: FuncTypeViewValuesEnum.EXPONENTIAL },
  { value: FuncTypeEnum.HYPERBOLA, viewValue: FuncTypeViewValuesEnum.HYPERBOLA },
  { value: FuncTypeEnum.LOGARITHM, viewValue: FuncTypeViewValuesEnum.LOGARITHM }
]

export const COLS_WITH_SMALL_NUMS = ['div1X', 'div1X2'];

export class Associations
{
  static readonly keysHeaderLabels: any = {
    id: HeaderLabelsEnum.id,

    X: HeaderLabelsEnum.X,
    Y: HeaderLabelsEnum.Y,

    X2: HeaderLabelsEnum.X2,
    Y2: HeaderLabelsEnum.Y2,
    XY: HeaderLabelsEnum.XY,
    X3: HeaderLabelsEnum.X3,
    X4: HeaderLabelsEnum.X4,
    X2Y: HeaderLabelsEnum.X2Y,
    lnY: HeaderLabelsEnum.lnY,
    XlnY: HeaderLabelsEnum.XlnY,

    lnX: HeaderLabelsEnum.lnX,
    lnX2: HeaderLabelsEnum.lnX2,
    YlnX: HeaderLabelsEnum.YlnX,

    div1X: HeaderLabelsEnum.div1X,
    div1X2: HeaderLabelsEnum.div1X2,
    YdivX: HeaderLabelsEnum.YdivX,


    Nx: HeaderLabelsEnum.Nx,
    Ny: HeaderLabelsEnum.Ny,
    d: HeaderLabelsEnum.d,
    d2: HeaderLabelsEnum.d2,

    Yx: HeaderLabelsEnum.Yx,
    YYx: HeaderLabelsEnum.YYx,

    YYx2: HeaderLabelsEnum.YYx2,

    YAvgY2: HeaderLabelsEnum.YAvgY2,
    

    YxAvgY2: HeaderLabelsEnum.YxAvgY2,

    // YAvgYx2: HeaderLabelsEnum.YAvgYx2,
    // AvgYxAvgY2: HeaderLabelsEnum.AvgYxAvgY2,
    
    name: HeaderLabelsEnum.name,
    value: HeaderLabelsEnum.value
  }
}

export const HEADER_LABLES_FROM_FILE = [Associations.keysHeaderLabels.X, Associations.keysHeaderLabels.Y];

export class TCrit 
{
  static readonly CRIT: number[][] = [
    [
      12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228,
      2.201, 2.179, 2.16, 2.145, 2.131, 2.12, 2.11, 2.101, 2.093, 2.086, 2.08,
      2.074, 2.069, 2.064, 2.06, 2.056, 2.052, 2.049, 2.045, 2.042, 2.04, 2.037,
      2.035, 2.032, 2.03, 2.028, 2.026, 2.024, 2.023, 2.021, 2.02, 2.018, 2.017,
      2.015, 2.014, 2.013, 2.012, 2.011, 2.01, 2.009, 2.008, 2.007, 2.006,
      2.005, 2.004, 2.003, 2.002, 2.002, 2.001, 2, 2, 1.999, 1.998, 1.998,
      1.997, 1.997, 1.996, 1.995, 1.995, 1.994, 1.994, 1.993, 1.993, 1.993,
      1.992, 1.992, 1.991, 1.991, 1.99, 1.99
    ],
    [
      63.657, 9.925, 5.841, 4.604, 4.032, 3.707, 3.499, 3.355, 3.25, 3.169,
      3.106, 3.055, 3.012, 2.977, 2.947, 2.921, 2.898, 2.878, 2.861, 2.845,
      2.831, 2.819, 2.807, 2.797, 2.787, 2.779, 2.771, 2.763, 2.756, 2.75,
      2.744, 2.738, 2.733, 2.728, 2.724, 2.719, 2.715, 2.712, 2.708, 2.704,
      2.701, 2.698, 2.695, 2.692, 2.69, 2.687, 2.685, 2.682, 2.68, 2.678, 2.676,
      2.674, 2.672, 2.67, 2.688, 2.667, 2.665, 2.663, 2.662, 2.66, 2.659, 2.657,
      2.656, 2.655, 2.654, 2.652, 2.651, 2.65, 2.649, 2.648, 2.647, 2.646,
      2.645, 2.644, 2.643, 2.642, 2.641, 2.64, 2.639, 2.639
    ],
    [
      636.62, 31.598, 12.924, 8.61, 6.869, 5.959, 5.408, 5.041, 4.781, 4.587,
      4.437, 4.318, 4.221, 4.14, 4.073, 4.015, 3.965, 3.922, 3.883, 3.85, 3.819,
      3.792, 3.768, 3.745, 3.725, 3.707, 3.69, 3.674, 3.659, 3.646, 3.633,
      3.622, 3.611, 3.601, 3.591, 3.582, 3.574, 3.566, 3.558, 3.551, 3.544,
      3.538, 3.532, 3.526, 3.52, 3.515, 3.51, 3.505, 3.5, 3.496, 3.492, 3.488,
      3.484, 3.48, 3.476, 3.473, 3.47, 3.466, 3.463, 3.46, 3.457, 3.454, 3.452,
      3.449, 3.447, 3.444, 3.442, 3.439, 3.437, 3.435, 3.433, 3.431, 3.429,
      3.427, 3.425, 3.423, 3.422, 3.42, 3.418, 3.416
    ]
  ];

  static readonly CRIT_2: number[][] = [
    [
      1.987, 1.984, 1.982, 1.98, 1.978, 1.977, 
      1.976, 1.972, 1.969, 1.968, 1.967
    ],
    [
      2.632, 2.626, 2.621, 2.617, 2.614, 2.611,
      2.609, 2.601, 2.596, 2.592, 2.59
    ],
    [
      3.402, 3.39, 3.381, 3.373, 3.367, 3.361, 
      3.357, 3.34, 3.33, 3.323, 3.319
    ]
  ];

  static readonly F_CRIT: number[][] = [
    [
      161, 18.5, 10.1, 7.71, 6.61, 5.99, 5.59, 5.32, 5.12, 4.96, 4.84, 4.75,
      4.67, 4.6, 4.54, 4.49, 4.45, 4.41, 4.38, 4.35
    ],
    [
      200, 19, 9.55, 6.94, 5.79, 5.14, 4.74, 4.46, 4.26, 4.1, 3.98, 3.89, 3.81,
      3.74, 3.68, 3.63, 3.59, 3.55, 3.52, 3.49
    ],
    [
      216, 19.2, 9.28, 6.59, 5.41, 4.76, 4.35, 4.07, 3.86, 3.71, 3.59, 3.49,
      3.41, 3.34, 3.29, 3.24, 3.2, 3.16, 3.13, 3.1
    ]
  ];

  static readonly F_CRIT_V2 = [
    [4.3, 4.26, 4.23, 4.2, 4.17, 4.08, 4, 3.92],
    [3.44, 3.4, 3.37, 3.34, 3.32, 3.23, 3.15, 3.07],
    [3.05, 3.01, 2.98, 2.95, 2.92, 2.84, 2.76, 2.68]
  ];

  static readonly F_CRIT_2 = [
    [
      4052.181, 98.503, 34.116, 21.198, 16.258, 13.745, 12.246, 11.259, 10.561,
      10.044, 9.646, 9.33, 9.074, 8.862, 8.683, 8.531, 8.4, 8.285, 8.185, 8.096
    ],
    [
      4999.5, 99.0, 30.817, 18.0, 13.274, 10.925, 9.547, 8.649, 8.022, 7.559,
      7.206, 6.927, 6.701, 6.515, 6.359, 6.226, 6.112, 6.013, 5.926, 5.849
    ],
    [
      5403.352, 99.166, 29.457, 16.694, 12.06, 9.78, 8.451, 7.591, 6.992, 6.552,
      6.217, 5.953, 5.739, 5.564, 5.417, 5.292, 5.185, 5.092, 5.01, 4.938
    ]
  ];

  static readonly F_CRIT_2_V2 = [
    [7.945, 7.823, 7.721, 7.636, 7.562, 7.314, 7.077, 6.851],
    [5.719, 5.614, 5.526, 5.453, 5.39, 5.179, 4.977, 4.787],
    [4.817, 4.718, 4.637, 4.568, 4.51, 4.313, 4.126, 3.949]
  ];
}
