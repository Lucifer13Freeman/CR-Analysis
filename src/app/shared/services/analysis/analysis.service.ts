import { Injectable } from '@angular/core';
import { argv0 } from 'process';
import { DIGIT_ACCURACY, TCrit } from '../../constants/constants';
import { AnalysisDataDto } from '../../dto/analysis-data.dto';
import { GetYxArrayDto } from '../../dto/get-yx-array.dto';
import { ChartDataDto } from '../../dto/chart-data.dto';
import { ExcelExtEnum, FTableSelectValueEnum, FTableValueLevelTypeEnum, FuncTypeEnum, HeaderLabelsEnum, RelationDirectionEnum, RelationTypeEnum, SignificanceSelectValueEnum, SignificentTypeEnum } from '../../enums/enums';
import { IFileData } from '../../interfaces/file-data.interface';
import { IAValuesAndElasticy } from '../../interfaces/graph-data.interface';
import { ITableData } from '../../interfaces/table-data.interface';
import { UtilsService } from '../utils/utils.service';
import { Point } from 'chart.js';
import { GetAnalysisDataDto } from '../../dto/get-analysis-data.dto';
import { IGetAnalysisData } from '../../interfaces/get-analysis-data.interface';
import { RelationType } from '../../types/types';


@Injectable(
{
  providedIn: 'root'
})
export class AnalysisService 
{
  constructor(private readonly utilsService: UtilsService) { }

  public checkReadFileData<T>(fileData: IFileData<T>)
  {
    if (!fileData) return false;

    const { tableData, extension } = fileData;

    // if (!tableData) return false;

    if (extension !== ExcelExtEnum.XLSX && 
        extension !== ExcelExtEnum.CSV) 
    {
      // alert('Alert: Incorrect file extension!');
      alert('Уведомление: некорректное расширение файла!');
      return false;
    }

    if (Object.keys(tableData.data[0]).length !== tableData.header.length) 
    {
      // alert('Alert: Header and data columns count are different!');
      alert('Уведомление: количество колонок заголовка и данных различны!');
      return false;
    }

    // const X = HeaderLabelsEnum.X;
    // const Y = HeaderLabelsEnum.Y;

    if (!(tableData.data[0] as any).hasOwnProperty('X') && 
        !(tableData.data[0] as any).hasOwnProperty('Y'))
    {
      // alert(`Alert: Incorrect file data format: missing X and Y columns!`);
      alert('Уведомление: некорректный формат данных файла: отсутствуют колонки X и Y!');
      return false;
    }

    return true;
  }

  public getCalcTableData<T>(tableData: ITableData<T>, isExtended: boolean = false)
  {
    let calcTableData = JSON.parse(JSON.stringify(tableData));

    calcTableData.data = calcTableData.data.map((row: T | any) => 
    {
      return {
        ...row,
        X2: this.utilsService.roundNum(row.X ** 2, DIGIT_ACCURACY),
        Y2: this.utilsService.roundNum(row.Y ** 2, DIGIT_ACCURACY),
        XY: this.utilsService.roundNum(row.X * row.Y, DIGIT_ACCURACY),
        X3: this.utilsService.roundNum(row.X ** 3, DIGIT_ACCURACY), 
        X4: this.utilsService.roundNum(row.X ** 4, DIGIT_ACCURACY), 
        X2Y: this.utilsService.roundNum((row.X ** 2) * row.Y, DIGIT_ACCURACY),
        lnY: this.utilsService.roundNum(Math.log(row.Y), DIGIT_ACCURACY),
        XlnY: this.utilsService.roundNum(row.X * Math.log(row.Y), DIGIT_ACCURACY)
      }
    });

    // console.log(calcTableData.data)

    const sumRow = this.getCalcSumRow(calcTableData.data);
    const avgRow = this.getCalcAvgRow(calcTableData.data);

    calcTableData.data.push(...[sumRow, avgRow]);

    const stdHeader: string[] = [
      HeaderLabelsEnum.X2, 
      HeaderLabelsEnum.Y2, 
      HeaderLabelsEnum.XY
    ]

    const extHeader: string[] = [
      ...stdHeader,
      HeaderLabelsEnum.X3,
      HeaderLabelsEnum.X4,
      HeaderLabelsEnum.X2Y,
      HeaderLabelsEnum.lnY,
      HeaderLabelsEnum.XlnY
    ]

    const header: string[] = !isExtended ? stdHeader : extHeader;
  
    calcTableData.header.push(...header);

    return calcTableData;
  }

  public getRangTableData<T>(tableData: ITableData<T>)
  {
    let rangTableData = JSON.parse(JSON.stringify(tableData));

    rangTableData.data = this.getDataWithRangs(rangTableData.data);
    rangTableData.data = this.getDataWithRangsDiff(rangTableData.data);

    rangTableData.data.push(this.getLastRow(rangTableData.data));

    // console.log(rangTableData.data)

    const header = [
      HeaderLabelsEnum.Nx,
      HeaderLabelsEnum.Ny,
      HeaderLabelsEnum.d,
      HeaderLabelsEnum.d2
    ];

    rangTableData.header.push(...header);

    return rangTableData;
  }

  public getAnalysisData<T>({ calcTableData, 
                            rangTableData, 
                            signLvlSelectVal = SignificanceSelectValueEnum.VALUE_1,
                            fTableValLvlSelectVal = FTableSelectValueEnum.VALUE_1,
                            funcType = FuncTypeEnum.LINE}: IGetAnalysisData<T>)
  {
    // const { calcTableData, rangTableData, 
    //         signLvlSelectVal, fTableValLvlSelectVal, 
    //         funcType } = dto;

    let analysisData: AnalysisDataDto<T> = new AnalysisDataDto();

    let { params } = analysisData;

    const { data: calcData } = calcTableData;
    const { data: rangData } = rangTableData;

    // console.log(calcData)
    // console.log(rangData)

    const count = calcData.length - 2;

    // console.log(count)

    // const xArr: number[] = calcData.map((row: any) => 
    // {
    //   if (!Number.isNaN(parseFloat(row.id))) return row.x;
    // });

    let xArr: number[] = [];
    let yArr: number[] = [];

    for (let i = 0; i < count; i++)
    {
      if (!Number.isNaN((calcData[i] as any).id)) 
      {
        xArr.push((calcData[i] as any).X);
        yArr.push((calcData[i] as any).Y);
      }
    }

    // console.log(xArr)

    let sumRow: any = calcData[count];
    let avgRow: any = calcData[count + 1];

    // console.log(sumRow)
    // console.log(avgRow)

    const d2Sum = (rangData[count] as any).d2;

    // console.log(avgX, avgY, avgX2, avgY2, avgXY)

    // const funcType = FuncVariantEnum.LINE;
    // const funcYx = 0;

    const aValuesAndElasticity: IAValuesAndElasticy = this.getAValuesAndElasticity(funcType, sumRow, avgRow, count);

    const { a0, a1, a2, elasticity, m } = aValuesAndElasticity;

    const xArrSorted = [...xArr].sort((a, b) => a - b);

    const YxArr: number[] = this.getYxArray({ funcType, a0, a1, a2, xArr });

    const YxArrGraph: number[] = this.getYxArray({ funcType, a0, a1, a2, xArr: xArrSorted });
    // console.log({YxArr, xArr})

    const resChartData: Point[] = this.utilsService.getPointsArray(xArrSorted, YxArrGraph);
    const stdChartData: Point[] = this.utilsService.getPointsArray(xArr, yArr);

    const chartData: ChartDataDto = {
      funcType,
      // xArr: xArrSorted,
      // YxArr: YxArrGraph,
      resChartData,
      stdChartData
    }

    // console.log(graphData)

    // console.log(YxArr)

    // console.log(a0, a1, a2, elasticity, m, YxArr)

    const extCalcTableData: ITableData<any> = this.getExtenedCalcTableData(calcTableData, YxArr); //?

    const { data: extCalcData, header: extCalcDataHeader } = extCalcTableData;

    // console.log(extCalcTableData)

    const meanSqrOffX: number = this.getMeanSqrOff(avgRow.X, avgRow.X2);
    const meanSqrOffY = this.getMeanSqrOff(avgRow.Y, avgRow.Y2);

    const linearCorrCoef: number = this.getLinerCorrelCoef(avgRow.X, avgRow.Y, avgRow.XY, meanSqrOffX, meanSqrOffY);
    const avgCorrCoefErr: number = this.getAvgCorrelCoefError(linearCorrCoef, count);     
    const coefCorrSignCheck: number = this.getCoefCorrelSignCheck(linearCorrCoef, avgCorrCoefErr);

    const relXY: RelationType = this.getRelationXY(linearCorrCoef);


    
    //TODO: signLvlSelectType: selection index of comboBox with values: 0.05, 0.01, 0.01 for example
    const signLvlSelectValIdx = signLvlSelectVal === SignificanceSelectValueEnum.VALUE_3 ? 2 
                                : signLvlSelectVal === SignificanceSelectValueEnum.VALUE_1 ? 0 
                                : 1;

    const tTable: number = this.getTtable(signLvlSelectValIdx, count);

    const coefCorrSign: SignificentTypeEnum = this.coefCorrelSignificance(coefCorrSignCheck, tTable);

    const spearmanCoeff: number = this.getSpiermanCoef(d2Sum, count);

    const relXYspearman: RelationType = this.getRelationXYspearman(spearmanCoeff);

    sumRow = extCalcData[count];
    avgRow = extCalcData[count + 1];

    // console.log(sumRow)
    // console.log(avgRow)

    const avgApproxErr: number = this.getAvgApproximationError(sumRow.Y, sumRow.YYx);

    const totalDispersion: number = this.getTotalDispersion(sumRow.YAvgY2, count); 
    const factorDispersion: number = this.getFactorDispersion(sumRow.AvgYxAvgY2, count); //?
    const residualDispersion: number = this.getResidualDispersion(sumRow.YAvgYx2, count); //?

    const residualDispersionSqrt: number = this.getResidualDispersionSqrt(residualDispersion);

    const totalDispersionCheck: number = this.getTotalDispersionCheck(factorDispersion, residualDispersion); //?

    const theorCoefDeterm: number = this.getTheorCoefDetermination(factorDispersion, totalDispersion);
    const theorCorrRel: number = this.getTheorCorrelRelation(theorCoefDeterm);

    const avgA0Err: number = this.getAvgA0Error(residualDispersionSqrt, count);
    const avgA1Err: number = this.getAvgA1Error(residualDispersionSqrt, meanSqrOffX, count);

    const tA0: number = this.getTa(a0, avgA0Err);
    const tA1: number = this.getTa(a1, avgA1Err);

    const tA0Check: SignificentTypeEnum | "" = this.getTaCheck(tA0, tTable, count); 
    const tA1Check: SignificentTypeEnum | "" = this.getTaCheck(tA1, tTable, count); 

    const V1 = parseInt((m - 1).toString()); 
    const V2 = parseInt((count - m).toString());

    const fisherCrit: number = this.getFisherCrit(factorDispersion, residualDispersion, V1, V2);
    
    //TODO: fTableValLvlSelectVal: selection index of comboBox with values: 0.05, 0.01 for example
    // const fTableValLvlSelectVal = 1;

    const fTableValLvl: number = this.getFtableValueLevel(V1 - 1, V2 - 1, fTableValLvlSelectVal, count); //?
    const fTableValueLevelCheck: FTableValueLevelTypeEnum = this.getFTableValueLevelCheck(fisherCrit, fTableValLvl); //?
    

    // const fTableValLvlCheck = this.getFTableValueLevelCheck(fisherCrit, fTableValLvl);


    params.meanSqrOffX.value = meanSqrOffX;
    params.meanSqrOffY.value = meanSqrOffY;

    params.linearCorrCoef.value = linearCorrCoef;
    params.avgCorrCoefErr.value = avgCorrCoefErr;
    params.coefCorrSignCheck.value = coefCorrSignCheck;

    params.signLvlSelectVal.value = signLvlSelectVal;
    params.tTable.value = tTable;

    params.relXY.value = relXY;
    params.coefCorrSign.value = coefCorrSign;

    params.spearmanCoeff.value = spearmanCoeff;
    params.relXYspearman.value = relXYspearman;

    params.elasticity.value = elasticity;

    params.avgApproxErr.value = avgApproxErr;

    params.totalDispersion.value = totalDispersion;
    params.factorDispersion.value = factorDispersion;
    params.residualDispersion.value = residualDispersion;
    params.totalDispersionCheck.value = totalDispersionCheck;

    params.theorCoefDeterm.value = theorCoefDeterm;
    params.theorCorrRel.value = theorCorrRel;

    params.avgA0Err.value = avgA0Err;
    params.avgA1Err.value = avgA1Err;

    params.tA0.value = tA0;
    params.tA1.value = tA1;

    params.tA0Check.value = tA0Check;
    params.tA1Check.value = tA1Check;

    params.fisherCrit.value = fisherCrit;

    params.fTableValLvl.value = fTableValLvl;
    params.fTableValLvlSelectVal.value = fTableValLvlSelectVal;
    params.fTableValLvlCheck.value = fTableValueLevelCheck;
    
    // console.log(params);

    const newExtCalcDataHeader = [
      HeaderLabelsEnum.id,
      HeaderLabelsEnum.X,
      HeaderLabelsEnum.Y,
      HeaderLabelsEnum.X3,
      HeaderLabelsEnum.X4,
      HeaderLabelsEnum.X2Y,
      HeaderLabelsEnum.lnY,
      HeaderLabelsEnum.XlnY,
      HeaderLabelsEnum.Yx,
      HeaderLabelsEnum.YYx,
      HeaderLabelsEnum.YxY2,
      HeaderLabelsEnum.YAvgY2,
      HeaderLabelsEnum.YAvgYx2,
      HeaderLabelsEnum.AvgYxAvgY2
    ];

    analysisData = {
      params,
      tableData: {
        data: extCalcData,
        header: newExtCalcDataHeader
      },
      chartData
    }

    // console.log(analysisData)

    return analysisData;
  }

  private getAvgApproximationError(sumY: number, sumYYx: number)
  {
    const avgApproxErr = this.utilsService.roundNum(
        sumYYx / sumY
    , DIGIT_ACCURACY);
    return avgApproxErr;
  }

  private getTotalDispersion(sumYAvgY2: number, count: number)
  {
    const totalDispersion = this.utilsService.roundNum(
        sumYAvgY2 / count
    , DIGIT_ACCURACY);
    return totalDispersion;
  }

  private getFactorDispersion(sumAvgYxAvgY2: number, count: number)
  {
    const factorDispersion = this.utilsService.roundNum(
        sumAvgYxAvgY2 / count
    , DIGIT_ACCURACY);
    return factorDispersion;
  }

  private getResidualDispersion(sumYAvgYx2: number, count: number)
  {
    const residualDispersion = this.utilsService.roundNum(
        sumYAvgYx2 / count
    , DIGIT_ACCURACY);
  return residualDispersion;
  }

  private getResidualDispersionSqrt(residualDispersion: number)
  {
    const residualDispersionSqrt = this.utilsService.roundNum(
        Math.sqrt(residualDispersion)
    , DIGIT_ACCURACY);
    return residualDispersionSqrt;
  }
  
  private getTotalDispersionCheck(factorDispersion: number, residualDispersion: number)
  {
    const totalDispersionCheck = this.utilsService.roundNum(
        factorDispersion + residualDispersion
    , DIGIT_ACCURACY);
    return totalDispersionCheck;
  }

  private getTheorCoefDetermination(factorDispersion: number, totalDispersion: number)
  {
    const theorCoefDeterm = this.utilsService.roundNum(
        factorDispersion / totalDispersion
    , DIGIT_ACCURACY);
    return theorCoefDeterm;
  }

  private getTheorCorrelRelation(theorCoefDeterm: number)
  {
    const theorCoefRel = this.utilsService.roundNum(
        Math.sqrt(theorCoefDeterm)
    , DIGIT_ACCURACY);
    return theorCoefRel;
  }

  private getAvgA0Error(residualDispersionSqrt: number, count: number)
  {
    const avgA0Err = this.utilsService.roundNum(
      residualDispersionSqrt / Math.sqrt(count - 2)
    , DIGIT_ACCURACY);
    return avgA0Err;
  }

  private getAvgA1Error(residualDispersionSqrt: number, meanSqrOffX: number, count: number)
  {
    const avgA0Err = this.utilsService.roundNum(
      residualDispersionSqrt / (meanSqrOffX * Math.sqrt(count - 2))
    , DIGIT_ACCURACY);
    return avgA0Err;
  }

  private getTa(a: number, avgAError: number)
  {
    const Ta = this.utilsService.roundNum(
        a / avgAError
    , DIGIT_ACCURACY);
    return Ta;
  }

  private getFisherCrit(factorDispersion: number, 
                        residualDispersion: number, 
                        V1: number, V2: number)
  {
    const fisherCrit = this.utilsService.roundNum(
        (factorDispersion / V1) / (residualDispersion / V2)
    , DIGIT_ACCURACY);
    return fisherCrit;
  }

  // private getSigma(xArrSorted: number[], avgX: number, count: number)
  // {
  //   let sumX = 0;

  //   for (let i = 0; i < xArrSorted.length; i++)
  //   {
  //     sumX += (xArrSorted[i] - avgX) ** 2;
  //   }

  //   return Math.sqrt(sumX / (count - 1));
  // }

  private getExtenedCalcTableData<T>(calcTableData: ITableData<T>, YxArr: number[])
  {
    // const { data, header } = calcTableData;

    let extCalcTableData: any = JSON.parse(JSON.stringify(calcTableData));

    let { data, header } = extCalcTableData;

    const count = data.length - 2;

    let sumRow: any = data[count];
    let avgRow: any = data[count + 1];

    // const f = count + 3;

    sumRow = {
      ...sumRow,
      Yx: 0,
      YYx: 0,
      YxY2: 0,
      YAvgY2: 0,
      YAvgYx2: 0,
      AvgYxAvgY2: 0
    }

    // let corCoefArr = [3][f];

    for (let i = 0; i < count; i++)
    {
      data[i].Yx = YxArr[i];
      sumRow.Yx += +data[i].Yx;
    }

    avgRow.Yx = sumRow.Yx / count;


    for (let i = 0; i < count; i++)
    {
      // data[i].YYx = Math.abs(data[i].Y - avgRow.Yx /*data[i].Yx*/); //?
      data[i].YYx = Math.abs(data[i].Y - data[i].Yx);
      sumRow.YYx += data[i].YYx;

      data[i].YxY2 = (YxArr[i] - data[i].Y) ** 2;
      sumRow.YxY2 += data[i].YxY2;

      data[i].YAvgY2 = (data[i].Y - avgRow.Y) ** 2;
      sumRow.YAvgY2 += data[i].YAvgY2;

      //TODO: research this
      // data[i].YAvgYx2 = (data[i].Y - avgRow.Yx) ** 2;
      data[i].YAvgYx2 = (data[i].Y - data[i].Yx) ** 2; //?
      sumRow.YAvgYx2 += data[i].YAvgYx2;
      // console.log(data[i].Y, avgRow.Yx, data[i].YAvgYx2)

      //TODO: research this
      // data[i].AvgYxAvgY2 = (avgRow.Yx - avgRow.Y) ** 2;
      data[i].AvgYxAvgY2 = (data[i].Yx - avgRow.Y) ** 2; //?
      sumRow.AvgYxAvgY2 += data[i].AvgYxAvgY2;

      // console.log(data[i].YAvgYx2, data[i].AvgYxAvgY2)
    }

    // console.log(sumRow.YAvgYx2)

    // console.log(sumRow.YAvgYx2, sumRow.AvgYxAvgY2)

    avgRow = {
      ...avgRow,
      YYx: sumRow.YYx / count,
      YxY2: sumRow.YxY2 / count,
      YAvgY2: sumRow.YAvgY2 / count,
      YAvgYx2: sumRow.YAvgYx2 / count,
      AvgYxAvgY2: sumRow.AvgYxAvgY2 / count
    }

    data[count] = sumRow;
    data[count + 1] = avgRow;

    for (let i = 0; i < data.length; i++)
    {
      data[i] = this.utilsService.roundObjNums(data[i], DIGIT_ACCURACY);
    }

    header = this.utilsService.makeHeaderFromObj(data[0]);

    extCalcTableData = {
      data,
      header
    }

    return extCalcTableData;
  }

  private getTtable(signLvlSelectValIdx: number = 0, count: number)
  {
    const y = count - 3;

    const tTable = y <= 80 ? TCrit.CRIT[signLvlSelectValIdx][y] : 
                  y <= 90 ? TCrit.CRIT_2[signLvlSelectValIdx][0] :
                  y <= 100 ? TCrit.CRIT_2[signLvlSelectValIdx][1] : 
                  y <= 110 ? TCrit.CRIT_2[signLvlSelectValIdx][2] :
                  y <= 120 ? TCrit.CRIT_2[signLvlSelectValIdx][3] : 
                  y <= 130 ? TCrit.CRIT_2[signLvlSelectValIdx][4] :
                  y <= 140 ? TCrit.CRIT_2[signLvlSelectValIdx][5] : 
                  y <= 150 ? TCrit.CRIT_2[signLvlSelectValIdx][6] :
                  y <= 200 ? TCrit.CRIT_2[signLvlSelectValIdx][7] : 
                  y <= 250 ? TCrit.CRIT_2[signLvlSelectValIdx][8] :
                  y <= 300 ? TCrit.CRIT_2[signLvlSelectValIdx][9] : 
                  y <= 350 ? TCrit.CRIT_2[signLvlSelectValIdx][10] : 0;
    return tTable;
  }

  private getFtableValueLevel(x: number = 0, y: number = 0, 
                            fTableValLvlSelectVal: FTableSelectValueEnum = FTableSelectValueEnum.VALUE_1, 
                            count: number)
  {
    if (count > 0) 
    {
      switch (fTableValLvlSelectVal) 
      {
        case FTableSelectValueEnum.VALUE_1:
        default: 
        {
          return count <= 20 ? TCrit.F_CRIT[x][y] 
                : count <= 22 ? TCrit.F_CRIT_V2[x][0]
                : count <= 24 ? TCrit.F_CRIT_V2[x][1]
                : count <= 26 ? TCrit.F_CRIT_V2[x][2]
                : count <= 28 ? TCrit.F_CRIT_V2[x][3]
                : count <= 30 ? TCrit.F_CRIT_V2[x][4]
                : count <= 40 ? TCrit.F_CRIT_V2[x][5]
                : count <= 60 ? TCrit.F_CRIT_V2[x][6]
                : count <= 120 ? TCrit.F_CRIT_V2[x][7]
                : 0;
        }
        case FTableSelectValueEnum.VALUE_2: 
        {
          return count <= 20 ? TCrit.F_CRIT_2[x][y] 
                : count <= 22 ? TCrit.F_CRIT_2_V2[x][0]
                : count <= 24 ? TCrit.F_CRIT_2_V2[x][1]
                : count <= 26 ? TCrit.F_CRIT_2_V2[x][2]
                : count <= 28 ? TCrit.F_CRIT_2_V2[x][3]
                : count <= 30 ? TCrit.F_CRIT_2_V2[x][4]
                : count <= 40 ? TCrit.F_CRIT_2_V2[x][5]
                : count <= 60 ? TCrit.F_CRIT_2_V2[x][6]
                : count <= 120 ? TCrit.F_CRIT_2_V2[x][7]
                : 0;
        }
      }
    } else return 0;
  }

  private getAValuesAndElasticity<T>(funcVariant: FuncTypeEnum = FuncTypeEnum.LINE, 
                                    sumRow: T | any, avgRow: T | any, count: number)
  {
    let a: number = 0;
    let a0: number = 0;
    let a1: number = 0;
    let a2: number = 0;
    let elasticity: number = 0;
    let m = 2;

    switch (funcVariant)
    {
      case FuncTypeEnum.LINE:
      default:
      {
        a0 = this.utilsService.roundNum(
          (sumRow.Y * sumRow.X2 - sumRow.XY * sumRow.X) 
          / (count * sumRow.X2 - sumRow.X ** 2)
        , DIGIT_ACCURACY);

        a1 = this.utilsService.roundNum(
          (count * sumRow.XY - sumRow.X * sumRow.Y) 
          / (count * sumRow.X2 - sumRow.X ** 2)
        , DIGIT_ACCURACY);

        elasticity = this.utilsService.roundNum(
          a1 * (avgRow.X / (a0 + a1 * avgRow.X))
        , DIGIT_ACCURACY);
          
        m = 2;

        break;
      }
      case FuncTypeEnum.PARABOLA:
      {
        const matrA = [
          [ count, sumRow.X, sumRow.X2 ],
          [ sumRow.X, sumRow.X2, sumRow.X3 ],
          [ sumRow.X2, sumRow.X3, sumRow.X4 ],
        ];

        a = this.utilsService.roundNum(
              matrA[0][0] * matrA[1][1] * matrA[2][2] 
                + matrA[1][0] * matrA[2][1] * matrA[0][2] 
                + matrA[2][0] * matrA[0][1] * matrA[1][2] 
              - (matrA[2][0] * matrA[1][1] * matrA[0][2] 
                + matrA[1][2] * matrA[2][1] * matrA[0][0] 
                + matrA[2][2] * matrA[0][1] * matrA[1][0])
        , DIGIT_ACCURACY);

          
        const matrA0 = [
          [ sumRow.Y, sumRow.X, sumRow.X2 ],
          [ sumRow.XY, sumRow.X2, sumRow.X3 ],
          [ sumRow.X2Y, sumRow.X3, sumRow.X4 ]
        ];

        a0 = this.utilsService.roundNum(
              (matrA0[0][0] * matrA0[1][1] * matrA0[2][2] 
              + matrA0[1][0] * matrA0[2][1] * matrA0[0][2]
              + matrA0[2][0] * matrA0[0][1] * matrA0[1][2] 
            - (matrA0[2][0] * matrA0[1][1] * matrA0[0][2] 
              + matrA0[1][2] * matrA0[2][1] * matrA0[0][0] 
              + matrA0[2][2] * matrA0[0][1] * matrA0[1][0])) / a
        , DIGIT_ACCURACY);


        const matrA1 = [
          [ count, sumRow.Y, sumRow.X2 ],
          [ sumRow.X, sumRow.XY, sumRow.X3 ],
          [ sumRow.X2, sumRow.X2Y, sumRow.X4 ]
        ];

        a1 = this.utilsService.roundNum(
              (matrA1[0][0] * matrA1[1][1] * matrA1[2][2] 
              + matrA1[1][0] * matrA1[2][1] * matrA1[0][2] 
              + matrA1[2][0] * matrA1[0][1] * matrA1[1][2] 
            - (matrA1[2][0] * matrA1[1][1] * matrA1[0][2] 
              + matrA1[1][2] * matrA1[2][1] * matrA1[0][0] 
              + matrA1[2][2] * matrA1[0][1] * matrA1[1][0])) / a
        , DIGIT_ACCURACY);


        const matrA2 = [
          [ count, sumRow.X, sumRow.Y ],
          [ sumRow.X, sumRow.X2, sumRow.XY ],
          [ sumRow.X2, sumRow.X3, sumRow.X2Y ]
        ];
          
        a2 = this.utilsService.roundNum(
                (matrA2[0][0] * matrA2[1][1] * matrA2[2][2] 
                + matrA2[1][0] * matrA2[2][1] * matrA2[0][2] 
                + matrA2[2][0] * matrA2[0][1] * matrA2[1][2] 
              - (matrA2[2][0] * matrA2[1][1] * matrA2[0][2] 
                + matrA2[1][2] * matrA2[2][1] * matrA2[0][0] 
                + matrA2[2][2] * matrA2[0][1] * matrA2[1][0])) / a
        , DIGIT_ACCURACY);

        elasticity = this.utilsService.roundNum(
          (a1 * avgRow.X + (2 * a0 * avgRow.X ** 2)) / avgRow.Y
        , DIGIT_ACCURACY);

        m = 3;

        break;
      }
      case FuncTypeEnum.EXPONENTIAL:
      {
        a1 = this.utilsService.roundNum(
              (avgRow.XlnY - (avgRow.X * avgRow.lnY)) 
              / (avgRow.X2 - avgRow.X ** 2)
        , DIGIT_ACCURACY);
        a0 = this.utilsService.roundNum(avgRow.lnY - a1 * avgRow.X, DIGIT_ACCURACY);
         
        elasticity = this.utilsService.roundNum(avgRow.X * a1, DIGIT_ACCURACY);

        m = 2;

        break;
      }
    }

    const values: IAValuesAndElasticy = { a, a0, a1, a2, elasticity, m }

    return values;
  }

  private getYxArray(dto: GetYxArrayDto)
  {
    const { funcType: funcVariant, a0, a1, a2, xArr } = dto;

    let YxArr: number[] = [];

    const count: number = xArr.length;

    for (let i = 0; i < count; i++) 
    {
      let X = xArr[i];
      
      switch (funcVariant)
      {
        case FuncTypeEnum.LINE:
        default:
        {
          YxArr[i] = this.utilsService.roundNum(a0 + (a1 * X), DIGIT_ACCURACY);
          // console.log(a0, a1, Yx[i], elasticity)

          break;
        }
        case FuncTypeEnum.PARABOLA:
        {
          YxArr[i] = this.utilsService.roundNum(a0 + (a1 * X) + (a2 * X ** 2), DIGIT_ACCURACY);
          // console.log(a, a0, a1, a2, Yx[i], elasticity)

          break;
        }
        case FuncTypeEnum.EXPONENTIAL:
        {
          YxArr[i] = this.utilsService.roundNum(Math.exp(a0) * Math.exp(a1) ** X, DIGIT_ACCURACY);
          // console.log(a0, a1, Yx[i], elasticity)

          break;
        }
      }
    }

    return YxArr;
  }

  private getMeanSqrOff(avgX: number, avgX2: number)
  {
    const mean_sqr_off = this.utilsService.roundNum(Math.sqrt(avgX2 - avgX ** 2), DIGIT_ACCURACY);
    return mean_sqr_off;
  }

  private getLinerCorrelCoef(avgX: number, 
                            avgY: number, 
                            avgXY: number, 
                            meanSqrOffX: number, 
                            meanSqrOffY: number)
  {
    const linearCorrCoef = this.utilsService.roundNum(
        (avgXY - avgX * avgY) / (meanSqrOffX * meanSqrOffY)
    , DIGIT_ACCURACY);
    return linearCorrCoef;
  }

  private getAvgCorrelCoefError(linearCorrCoef: number, count: number)
  {
    const avg_corr_coef_err = count > 50 && !(count < 30)
                            ? this.utilsService.roundNum(
                                (1 - linearCorrCoef ** 2) / Math.sqrt(count), DIGIT_ACCURACY)
                            : this.utilsService.roundNum(
                                Math.sqrt(1 - linearCorrCoef ** 2) / Math.sqrt(count - 2), DIGIT_ACCURACY);
    
    return avg_corr_coef_err;
  }

  private getCoefCorrelSignCheck(linearCorrCoef: number, avgCorrCoefErr: number)
  {
    const coef_corr_sign_check = this.utilsService.roundNum(Math.abs(linearCorrCoef) / avgCorrCoefErr, DIGIT_ACCURACY);
    return coef_corr_sign_check;
  }

  private getSpiermanCoef(d2Sum: number, count: number)
  {
    const spearmanCoeff = this.utilsService.roundNum(
        1 - ((6 * d2Sum) / (count * (count ** 2 - 1)))
    , DIGIT_ACCURACY);
    return spearmanCoeff;
  }

  private getRelationXY(linearCorrCoef: number): RelationType
  {
    let relationXY: RelationType = Math.abs(linearCorrCoef) === 0
                        ? RelationTypeEnum.NONE 
                      : (0 < Math.abs(linearCorrCoef) && Math.abs(linearCorrCoef) < 0.3) 
                        ? RelationTypeEnum.WEAK 
                      : (0.3 <= Math.abs(linearCorrCoef) && Math.abs(linearCorrCoef) <= 0.7) 
                        ? RelationTypeEnum.MEDIUM 
                      : RelationTypeEnum.STRONG;
    
    relationXY = linearCorrCoef > 0 ? `${RelationDirectionEnum.DIRECT} ${relationXY}` as RelationType
                : linearCorrCoef < 0 ? `${RelationDirectionEnum.BACK} ${relationXY}` as RelationType
                : relationXY;

    return relationXY as RelationType;
  }

  getRelationXYspearman(spearmanCoeff: number): RelationType 
  {
    let relationXYspearman: RelationType = spearmanCoeff === 0
                        ? RelationTypeEnum.NONE 
                      : (0 < Math.abs(spearmanCoeff) && Math.abs(spearmanCoeff) < 0.3) 
                        ? RelationTypeEnum.WEAK 
                      : (0.3 <= Math.abs(spearmanCoeff) && Math.abs(spearmanCoeff) <= 0.7) 
                        ? RelationTypeEnum.MEDIUM : RelationTypeEnum.STRONG;
    
    relationXYspearman = spearmanCoeff > 0 ? `${RelationDirectionEnum.DIRECT} ${relationXYspearman}` as RelationType
                        : spearmanCoeff < 0 ? `${RelationDirectionEnum.BACK} ${relationXYspearman}` as RelationType
                        : relationXYspearman;

    return relationXYspearman;
  }

  private coefCorrelSignificance(x: number, tTable: number)
  {
    const coefCorrelSignificance = x > tTable
                              ? SignificentTypeEnum.SIGNIFICANCE 
                              : SignificentTypeEnum.NOT_SIGNIFICANCE;
    return coefCorrelSignificance;
  }

  
  private getFTableValueLevelCheck(fisherCrit: number, fTableValLvl: number)
  {
    const fTableValueLevelCheck = fisherCrit > fTableValLvl 
                                    ? FTableValueLevelTypeEnum.SIGNIFICANCE
                                    : FTableValueLevelTypeEnum.NOT_SIGNIFICANCE;
    return fTableValueLevelCheck;
  }
  
  private getTaCheck(tA: number, tTable: number, count: number)
  {
    const taCheck = count > 30 && tA > 3
                      ? SignificentTypeEnum.SIGNIFICANCE 
                      : (count > 30 && tA < 3) 
                      ? SignificentTypeEnum.NOT_SIGNIFICANCE 
                      : (count < 30) 
                      ? this.coefCorrelSignificance(tA, tTable) 
                      : '';
    return taCheck;
  }

  private getCalcSumRow<T>(data: T[])
  {
    let sumRow: any = {
      id: 'Сумма',
      // x: 0,
      // y: 0,
      // x2: 0,
      // y2: 0,
      // xy: 0
    }

    if (!data[0]) return sumRow;
    const keys = Object.keys(data[0]);

    for (let i = 0; i < data.length; i++)
    {
      // sumRow.x += +(data[i] as any).x;
      // sumRow.y += +(data[i] as any).y;
      // sumRow.x2 += +(data[i] as any).x2;
      // sumRow.y2 += +(data[i] as any).y2;
      // sumRow.xy += +(data[i] as any).xy;

      for (let j = 1; j < keys.length; j++)
      {
        if (!sumRow[keys[j] as string]) sumRow[keys[j] as string] = 0;
        sumRow[keys[j] as string] += +(data[i] as any)[keys[j] as string];
      }
    }

    sumRow = this.utilsService.roundObjNums(sumRow, DIGIT_ACCURACY);

    return sumRow;
  }

  private getCalcAvgRow<T>(data: T[], sumRow?: any)
  {
    if (!sumRow) sumRow = this.getCalcSumRow(data);

    const rowCount: number = data.length;

    let avgRow: any = {
      id: 'Среднее',
      // x: sumRow.x / rowCount,
      // y: sumRow.y / rowCount,
      // x2: sumRow.x2 / rowCount,
      // y2: sumRow.y2 / rowCount,
      // xy: sumRow.xy / rowCount
    }

    if (!data[0]) return avgRow;
    const keys = Object.keys(data[0]);

    for (let i = 1; i < keys.length; i++)
    {
      if (!avgRow[keys[i] as string]) avgRow[keys[i] as string] = 0;
      avgRow[keys[i] as string] = sumRow[keys[i] as string] / rowCount;
    }

    avgRow = this.utilsService.roundObjNums(avgRow, DIGIT_ACCURACY);

    return avgRow;
  }

  private getDataWithRangs<T>(data: T[])
  {
    let newData: any[] = [...data];

    let xArr = [];
    let yArr = [];

    for (let i = 0; i < data.length; i++)
    {
      xArr.push(parseFloat(newData[i].X));
      yArr.push(parseFloat(newData[i].Y));
    }
    

    // let xArrSorted = [...xArr];
    // let yArrSorted = [...yArr];

    // xArrSorted.sort((a, b) => b - a);
    // yArrSorted.sort((a, b) => b - a);

    // console.log(xArrSorted, yArrSorted)

    // let dublicated
    
    // for (let i = 0; i < xArr.length; i++)
    // {
    //   let xIndex: number = xArr.indexOf(xArrSorted[i]);
    //   let yIndex: number = yArr.indexOf(yArrSorted[i]);

    //   console.log(xIndex, yIndex)

    //   newData[xIndex].Nx = i + 1;
    //   newData[yIndex].Ny = i + 1;

    //   // console.log(newData[xIndex].Nx, newData[yIndex].Ny)
    //   // console.log(i, newData[i].Nx, newData[i].Ny)
    //   // console.log(xIndex, yIndex)
    // }

    // for (let i = 0; i < xArr.length; i++)
    // {
    //   console.log(newData[i].Nx, newData[i].Ny)
    // }

    const arrNx = this.utilsService.rankArray(xArr as number[], (a, b) => b - a);
    const arrNy = this.utilsService.rankArray(yArr as number[], (a, b) => b - a);

    // this.utilsService.rankArray([1, 3, 52, 6, 100, 64, 71, 100, 100, 100])

    // console.table(arrNx, arrNy)

    for (let i = 0; i < xArr.length; i++)
    {
      newData[i].Nx = arrNx[i];
      newData[i].Ny = arrNy[i];
    }

    return newData;
  }

  private getDataWithRangsDiff<T>(data: T[])
  {
    if (!(data[0] as any)?.hasOwnProperty('Nx') && 
        !(data[0] as any)?.hasOwnProperty('Ny')) return data;

    let newData: any[] = [...data];

    for (let i = 0; i < newData.length; i++)
    {
      newData[i].d = newData[i].Nx - newData[i].Ny;
      newData[i].d2 = newData[i].d ** 2;
    }

    return newData;
  }

  private getLastRow<T>(data: T[])
  {
    const sumRangDiffPow2 = data.reduce((acc: number, val: any) => acc += val.d2, 0);
    const sumElements = data.length;

    const lastRow = {
      id: `n = ${sumElements}`,
      X: '',
      Y: '',
      Nx: '',
      Ny: '',
      d: 'Сумма',
      d2: sumRangDiffPow2
    }

    return lastRow;
  }
}
