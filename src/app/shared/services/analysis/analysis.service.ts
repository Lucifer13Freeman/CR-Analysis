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
import { ICorrCoefSignificent } from '../../interfaces/corr-coef-significent.interface';
import { IFisherCriterion } from '../../interfaces/fisher-criterion.interface';
import { GetFisherCriterionDto } from '../../dto/get-fisher-criterion.dto';
import { GetCorrCoefSignificentDto } from '../../dto/get-corr-coef-significent.dto';


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
        X2: row.X ** 2, //this.utilsService.roundNum(row.X ** 2, DIGIT_ACCURACY),
        Y2: row.Y ** 2, //this.utilsService.roundNum(row.Y ** 2, DIGIT_ACCURACY),
        XY: row.X * row.Y, //this.utilsService.roundNum(row.X * row.Y, DIGIT_ACCURACY),
        X3: row.X ** 3, //this.utilsService.roundNum(row.X ** 3, DIGIT_ACCURACY), 
        X4: row.X ** 4, //this.utilsService.roundNum(row.X ** 4, DIGIT_ACCURACY), 
        X2Y: (row.X ** 2) * row.Y, //this.utilsService.roundNum((row.X ** 2) * row.Y, DIGIT_ACCURACY),
        lnY: Math.log(row.Y), //this.utilsService.roundNum(Math.log(row.Y), DIGIT_ACCURACY),
        XlnY: row.X * Math.log(row.Y), //this.utilsService.roundNum(row.X * Math.log(row.Y), DIGIT_ACCURACY),

        lnX: Math.log(row.X), //this.utilsService.roundNum(Math.log(row.X), DIGIT_ACCURACY),
        // lnXY: this.utilsService.roundNum(Math.log(row.X * row.Y), DIGIT_ACCURACY),
        lnX2: Math.log(row.X) ** 2, //this.utilsService.roundNum(Math.log(row.X) ** 2, DIGIT_ACCURACY),
        YlnX: row.Y * Math.log(row.X), //this.utilsService.roundNum(row.Y * Math.log(row.X), DIGIT_ACCURACY),

        div1X: 1 / row.X, //this.utilsService.roundNum(1 / row.X, DIGIT_ACCURACY),
        div1X2: 1 / (row.X ** 2), //this.utilsService.roundNum(1 / (row.X ** 2), DIGIT_ACCURACY),
        YdivX: row.Y / row.X, //this.utilsService.roundNum(row.Y / row.X, DIGIT_ACCURACY),

        // div1XY: this.utilsService.roundNum(1 / row.X * row.Y, DIGIT_ACCURACY),

        // div1X2
        
        // div1X3: this.utilsService.roundNum(1 / row.X ** 3, DIGIT_ACCURACY), 
        // div1X4: this.utilsService.roundNum(1 / row.X ** 4, DIGIT_ACCURACY), 
        // div1X2Y: this.utilsService.roundNum(((1 / row.X) ** 2) * row.Y, DIGIT_ACCURACY),
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

    // console.log(calcTableData)

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
                            funcType = FuncTypeEnum.LINE }: IGetAnalysisData<T>)
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

    const { a0, a1, a2, elasticity, funcParamsCount } = aValuesAndElasticity;

    const xArrSorted = [...xArr].sort((a, b) => a - b);

    const YxArr: number[] = this.getYxArray({ funcType, a0, a1, a2, xArr });

    // console.table(YxArr)

    const YxArrGraph: number[] = this.getYxArray({ funcType, a0, a1, a2, xArr: xArrSorted });
    
    // console.log({YxArr, YxArrGraph})

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
    // const signLvlSelectValIdx = signLvlSelectVal === SignificanceSelectValueEnum.VALUE_3 ? 2 
    //                             : signLvlSelectVal === SignificanceSelectValueEnum.VALUE_1 ? 0 
    //                             : 1;

    // const tTable: number = this.getTtable(signLvlSelectValIdx, count);

    // const coefCorrSign: SignificentTypeEnum = this.coefCorrelSignificance(coefCorrSignCheck, tTable);

    const { tTable, 
          coefCorrSign } = this.getCorrCoeffSignificent({ signLvlSelectVal, 
                                                        coefCorrSignCheck, 
                                                        count });


    const spearmanCoeff: number = this.getSpiermanCoef(d2Sum, count);

    const relXYspearman: RelationType = this.getRelationXY(spearmanCoeff);

    sumRow = extCalcData[count];
    avgRow = extCalcData[count + 1];

    // console.log(sumRow)
    // console.log(avgRow)

    const avgApproxErr: number = this.getAvgApproximationError(sumRow.YYx, sumRow.Y);

    // console.log(sumRow.YYx / sumRow.Y)
    // console.log(count)
    // console.log(sumRow.YYx / sumRow.Y / count)

    const totalDispersion: number = this.getTotalDispersion(sumRow.YAvgY2, count); 

    // const factorDispersion: number = this.getFactorDispersion(sumRow.AvgYxAvgY2, count); //?
    // const residualDispersion: number = this.getResidualDispersion(sumRow.YAvgYx2, count); //?

    const factorDispersion: number = this.getFactorDispersion(sumRow.YxAvgY2, count); //?
    const residualDispersion: number = this.getResidualDispersion(sumRow.YYx2, count); //?

    // const factorDispersion: number = this.getFactorDispersion(sumRow.YYx2, count); //?
    // const residualDispersion: number = this.getResidualDispersion(sumRow.YxY2, count); //?

    const residualDispersionSqrt: number = this.getResidualDispersionSqrt(residualDispersion);

    const totalDispersionCheck: number = this.getTotalDispersionCheck(factorDispersion, residualDispersion); //?

    const theorCoefDeterm: number = this.getTheorCoefDetermination(factorDispersion, totalDispersion);
    const theorCorrRel: number = this.getTheorCorrelRelation(theorCoefDeterm);

    const avgA0Err: number = this.getAvgA0Error(residualDispersionSqrt, count, funcParamsCount);
    const avgA1Err: number = this.getAvgA1Error(residualDispersionSqrt, meanSqrOffX, count, funcParamsCount);

    const tA0: number = this.getTa(a0, avgA0Err);
    const tA1: number = this.getTa(a1, avgA1Err);

    const tA0Check: SignificentTypeEnum | "" = this.getTaCheck(tA0, tTable, count); 
    const tA1Check: SignificentTypeEnum | "" = this.getTaCheck(tA1, tTable, count); 

    const V1 = parseInt((funcParamsCount - 1).toString()); 
    const V2 = parseInt((count - funcParamsCount).toString());

    const { fisherCrit, 
          fTableValLvl, 
          fTableValueLevelCheck } = this.getFisherCriterion({ V1, V2, count, 
                                                            fTableValLvlSelectVal, 
                                                            factorDispersion, 
                                                            residualDispersion });

    // const fisherCrit: number = this.getFisherCrit(factorDispersion, residualDispersion, V1, V2);
    // const fTableValLvl: number = this.getFtableValueLevel(V1 - 1, V2 - 1, fTableValLvlSelectVal, count); //?
    // const fTableValueLevelCheck: FTableValueLevelTypeEnum = this.getFTableValueLevelCheck(fisherCrit, fTableValLvl); //?
    

    // const fTableValLvlCheck = this.getFTableValueLevelCheck(fisherCrit, fTableValLvl);


    params.meanSqrOffX.value = this.utilsService.roundNum(meanSqrOffX, DIGIT_ACCURACY);
    params.meanSqrOffY.value = this.utilsService.roundNum(meanSqrOffY, DIGIT_ACCURACY);

    params.linearCorrCoef.value = this.utilsService.roundNum(linearCorrCoef, DIGIT_ACCURACY);
    params.avgCorrCoefErr.value = this.utilsService.roundNum(avgCorrCoefErr, DIGIT_ACCURACY);
    params.coefCorrSignCheck.value = this.utilsService.roundNum(coefCorrSignCheck, DIGIT_ACCURACY);

    params.signLvlSelectVal.value = signLvlSelectVal;
    params.tTable.value = this.utilsService.roundNum(tTable, DIGIT_ACCURACY);

    params.relXY.value = relXY;
    params.coefCorrSign.value = coefCorrSign;

    params.spearmanCoeff.value = this.utilsService.roundNum(spearmanCoeff, DIGIT_ACCURACY);
    params.relXYspearman.value = relXYspearman;

    params.elasticity.value = this.utilsService.roundNum(elasticity, DIGIT_ACCURACY);

    params.avgApproxErr.value = this.utilsService.roundNum(avgApproxErr, DIGIT_ACCURACY);

    params.totalDispersion.value = this.utilsService.roundNum(totalDispersion, DIGIT_ACCURACY);
    params.factorDispersion.value = this.utilsService.roundNum(factorDispersion, DIGIT_ACCURACY);
    params.residualDispersion.value = this.utilsService.roundNum(residualDispersion, DIGIT_ACCURACY);
    params.totalDispersionCheck.value = this.utilsService.roundNum(totalDispersionCheck, DIGIT_ACCURACY);

    params.theorCoefDeterm.value = this.utilsService.roundNum(theorCoefDeterm, DIGIT_ACCURACY);
    params.theorCorrRel.value = this.utilsService.roundNum(theorCorrRel, DIGIT_ACCURACY);

    params.avgA0Err.value = this.utilsService.roundNum(avgA0Err, DIGIT_ACCURACY);
    params.avgA1Err.value = this.utilsService.roundNum(avgA1Err, DIGIT_ACCURACY);

    params.tA0.value = this.utilsService.roundNum(tA0, DIGIT_ACCURACY);
    params.tA1.value = this.utilsService.roundNum(tA1, DIGIT_ACCURACY);

    params.tA0Check.value = tA0Check;
    params.tA1Check.value = tA1Check;

    params.fisherCrit.value = this.utilsService.roundNum(fisherCrit, DIGIT_ACCURACY);

    params.fTableValLvl.value = this.utilsService.roundNum(fTableValLvl, DIGIT_ACCURACY);
    params.fTableValLvlSelectVal.value = fTableValLvlSelectVal;
    params.fTableValLvlCheck.value = fTableValueLevelCheck;

    params.count = count;
    params.V1 = V1;
    params.V2 = V2;
    
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

      HeaderLabelsEnum.lnX,
      HeaderLabelsEnum.lnX2,
      HeaderLabelsEnum.YlnX,

      HeaderLabelsEnum.div1X,
      HeaderLabelsEnum.div1X2,
      HeaderLabelsEnum.YdivX,

      HeaderLabelsEnum.Yx,
      HeaderLabelsEnum.YYx,

      HeaderLabelsEnum.YYx2,

      HeaderLabelsEnum.YxAvgY2,

      HeaderLabelsEnum.YxY2,
      HeaderLabelsEnum.YAvgY2,

      // HeaderLabelsEnum.YAvgYx2,
      // HeaderLabelsEnum.AvgYxAvgY2
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

  // private getFuncParamsCount(funcType: FuncTypeEnum = FuncTypeEnum.LINE)
  // {

  // }

  public getFisherCriterion(dto: GetFisherCriterionDto): IFisherCriterion
  {
    const { fTableValLvlSelectVal, 
          factorDispersion, 
          residualDispersion, 
          count, V1, V2 } = dto;

    // const V1 = parseInt((funcParamsCount - 1).toString()); 
    // const V2 = parseInt((count - funcParamsCountm).toString());

    const fisherCrit: number = this.getFisherCrit(factorDispersion, residualDispersion, V1, V2);

    const fTableValLvl: number = this.getFtableValueLevel(V1 - 1, V2 - 1, fTableValLvlSelectVal, count); //?
    const fTableValueLevelCheck: FTableValueLevelTypeEnum = this.getFTableValueLevelCheck(fisherCrit, fTableValLvl); //
  
    const fisherCriterion = {
      fisherCrit,
      fTableValLvl,
      fTableValueLevelCheck
    }

    return fisherCriterion;
  }

  public getCorrCoeffSignificent(dto: GetCorrCoefSignificentDto): ICorrCoefSignificent
  {
    const { signLvlSelectVal, coefCorrSignCheck, count} = dto;

    const signLvlSelectValIdx: number = signLvlSelectVal === SignificanceSelectValueEnum.VALUE_3 ? 2 
                                      : signLvlSelectVal === SignificanceSelectValueEnum.VALUE_1 ? 0 
                                      : 1;

    const tTable: number = this.getTtable(signLvlSelectValIdx, count);

    const coefCorrSign: SignificentTypeEnum = this.coefCorrelSignificance(coefCorrSignCheck, tTable);
    
    const coefCorrSignificent: ICorrCoefSignificent = {
      signLvlSelectValIdx,
      tTable,
      coefCorrSign
    }

    return coefCorrSignificent;
  }

  private getAvgApproximationError(sumYYx: number, sumY: number)
  {
    const avgApproxErr = sumYYx / sumY;
    return avgApproxErr;
  }

  private getTotalDispersion(sumYAvgY2: number, count: number)
  {
    const totalDispersion = sumYAvgY2 / count;
    return totalDispersion;
  }

  private getFactorDispersion(sumAvgYxAvgY2: number, count: number)
  {
    const factorDispersion = sumAvgYxAvgY2 / count;
    return factorDispersion;
  }

  private getResidualDispersion(sumYAvgYx2: number, count: number)
  {
    const residualDispersion = sumYAvgYx2 / count;
  return residualDispersion;
  }

  private getResidualDispersionSqrt(residualDispersion: number)
  {
    const residualDispersionSqrt = Math.sqrt(residualDispersion);
    return residualDispersionSqrt;
  }
  
  private getTotalDispersionCheck(factorDispersion: number, residualDispersion: number)
  {
    const totalDispersionCheck = factorDispersion + residualDispersion;
    return totalDispersionCheck;
  }

  private getTheorCoefDetermination(factorDispersion: number, totalDispersion: number)
  {
    const theorCoefDeterm = factorDispersion / totalDispersion;
    return theorCoefDeterm;
  }

  private getTheorCorrelRelation(theorCoefDeterm: number)
  {
    const theorCoefRel = Math.sqrt(theorCoefDeterm);
    return theorCoefRel;
  }

  private getAvgA0Error(residualDispersionSqrt: number, 
                        count: number, 
                        funcParamsCount: number = 2)
  {
    const avgA0Err = residualDispersionSqrt / Math.sqrt(count - funcParamsCount);
    return avgA0Err;
  }

  private getAvgA1Error(residualDispersionSqrt: number, 
                      meanSqrOffX: number, 
                      count: number, 
                      funcParamsCount: number = 2)
  {
    const avgA1Err = residualDispersionSqrt / (meanSqrOffX * Math.sqrt(count - funcParamsCount));
    return avgA1Err;
  }

  private getTa(a: number, avgAError: number)
  {
    const Ta = a / avgAError;
    return Ta;
  }

  private getFisherCrit(factorDispersion: number, 
                        residualDispersion: number, 
                        V1: number, V2: number)
  {
    const fisherCrit = (factorDispersion / V1) / (residualDispersion / V2)
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
      AvgYxAvgY2: 0,

      YxAvgY2: 0,

      // lnYx: 0
      YYx2: 0
    }

    // let corCoefArr = [3][f];

    for (let i = 0; i < count; i++)
    {
      data[i].Yx = +YxArr[i];
      sumRow.Yx += +data[i].Yx;
    }

    avgRow.Yx = sumRow.Yx / count;

    for (let i = 0; i < count; i++)
    {
      // data[i].YYx = Math.abs(data[i].Y - avgRow.Yx /*data[i].Yx*/); //?
      data[i].YYx = Math.abs(data[i].Y - data[i].Yx);
      sumRow.YYx += data[i].YYx;

      data[i].YYx2 = (data[i].Y - data[i].Yx) ** 2;
      sumRow.YYx2 += data[i].YYx2;

      // data[i].YxY2 = (data[i].Yx - data[i].Y) ** 2;
      // sumRow.YxY2 += data[i].YxY2;

      // data[i].YYx = Math.abs(data[i].Y - data[i].Yx);
      // sumRow.YYx += data[i].YYx;

      data[i].YAvgY2 = (data[i].Y - avgRow.Y) ** 2;
      sumRow.YAvgY2 += data[i].YAvgY2;

      data[i].YxAvgY2 = (data[i].Yx - avgRow.Y) ** 2;
      sumRow.YxAvgY2 += data[i].YxAvgY2;

      //TODO: research this
      // data[i].YAvgYx2 = (data[i].Y - avgRow.Yx) ** 2;
      data[i].YAvgYx2 = (data[i].Y - data[i].Yx) ** 2; //?
      sumRow.YAvgYx2 += data[i].YAvgYx2;
      // console.log(data[i].Y, avgRow.Yx, data[i].YAvgYx2)

      //TODO: research this
      // data[i].AvgYxAvgY2 = (avgRow.Yx - avgRow.Y) ** 2;
      data[i].AvgYxAvgY2 = (data[i].Yx - avgRow.Y) ** 2; //?
      // data[i].AvgYxAvgY2 = (data[i].Yx - data[i].Y) ** 2;
      sumRow.AvgYxAvgY2 += data[i].AvgYxAvgY2;

      // console.log(data[i].Y, avgRow.Yx, data[i].YAvgYx2, avgRow.Yx, avgRow.Y, data[i].AvgYxAvgY2)
      // console.log(sumRow.AvgYxAvgY2, sumRow.YAvgYx2)

      // data[i].YYx2 = (data[i].Y - data[i].Yx) ** 2;
      // sumRow.YYx2 += data[i].YYx2;

      // data[i].YxY2 = (data[i].Yx - data[i].Y) ** 2;
      // sumRow.YxY2 += data[i].YxY2;

      // console.log(data[i].YAvgYx2, data[i].AvgYxAvgY2)
    }

    // console.log(sumRow.YAvgYx2)

    // console.table(sumRow.AvgYxAvgY2)
    // console.table(sumRow.YAvgYx2)
    // console.log(sumRow.YAvgYx2, sumRow.AvgYxAvgY2)

    avgRow = {
      ...avgRow,
      YYx: sumRow.YYx / count,
      YxY2: sumRow.YxY2 / count,
      YAvgY2: sumRow.YAvgY2 / count,
      YAvgYx2: sumRow.YAvgYx2 / count,
      AvgYxAvgY2: sumRow.AvgYxAvgY2 / count,
      
      YxAvgY2: sumRow.YxAvgY2 / count,
      YYx2: sumRow.YYx2 / count
    }

    data[count] = sumRow;
    data[count + 1] = avgRow;


    // for (let i = 0; i < data.length; i++)
    // {
    //   data[i] = this.utilsService.roundObjNums(data[i], DIGIT_ACCURACY);
    // }

    header = this.utilsService.makeHeaderFromObj(data[0]);

    extCalcTableData = {
      data,
      header
    }

    // console.log(extCalcTableData)

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

  private getAValuesAndElasticity<T>(funcType: FuncTypeEnum = FuncTypeEnum.LINE, 
                                    sumRow: T | any, avgRow: T | any, count: number)
  {
    let a: number = 0;
    let a0: number = 0;
    let a1: number = 0;
    let a2: number = 0;
    let elasticity: number = 0;
    let funcParamsCount = 2;

    switch (funcType)
    {
      case FuncTypeEnum.LINE:
      default:
      {
        a0 = (sumRow.Y * sumRow.X2 - sumRow.XY * sumRow.X) 
            / (count * sumRow.X2 - sumRow.X ** 2);

        a1 = (count * sumRow.XY - sumRow.X * sumRow.Y) 
              / (count * sumRow.X2 - sumRow.X ** 2);

        elasticity = a1 * (avgRow.X / (a0 + a1 * avgRow.X));
          
        funcParamsCount = 2;

        break;
      }
      case FuncTypeEnum.PARABOLA:
      {
        const matrA = [
          [ count, sumRow.X, sumRow.X2 ],
          [ sumRow.X, sumRow.X2, sumRow.X3 ],
          [ sumRow.X2, sumRow.X3, sumRow.X4 ],
        ];

        a = this.utilsService.matrDeterminant(matrA);

          
        const matrA0 = [
          [ sumRow.Y, sumRow.X, sumRow.X2 ],
          [ sumRow.XY, sumRow.X2, sumRow.X3 ],
          [ sumRow.X2Y, sumRow.X3, sumRow.X4 ]
        ];

        a0 = this.utilsService.matrDeterminant(matrA0) / a;


        const matrA1 = [
          [ count, sumRow.Y, sumRow.X2 ],
          [ sumRow.X, sumRow.XY, sumRow.X3 ],
          [ sumRow.X2, sumRow.X2Y, sumRow.X4 ]
        ];

        a1 = this.utilsService.matrDeterminant(matrA1) / a;


        const matrA2 = [
          [ count, sumRow.X, sumRow.Y ],
          [ sumRow.X, sumRow.X2, sumRow.XY ],
          [ sumRow.X2, sumRow.X3, sumRow.X2Y ]
        ];

        a2 = this.utilsService.matrDeterminant(matrA2) / a;

        elasticity = (a1 * avgRow.X + (2 * a2 * avgRow.X ** 2)) / avgRow.Y;
        
        funcParamsCount = 3;

        break;
      }
      case FuncTypeEnum.EXPONENTIAL:
      {
        // a1 = Math.exp((avgRow.XlnY - (avgRow.X * avgRow.lnY))
        //             / (avgRow.X2 - avgRow.X ** 2));

        a1 = Math.exp((count * sumRow.XlnY - sumRow.X * sumRow.lnY)
                    / (count * sumRow.X2 - sumRow.X ** 2));

        // this.utilsService.roundNum(
        //       (avgRow.XlnY - (avgRow.X * avgRow.lnY))
        //       / (avgRow.X2 - avgRow.X ** 2)
        // , DIGIT_ACCURACY);

        a0 = Math.exp(avgRow.lnY - Math.log(a1) * avgRow.X);

        // this.utilsService.roundNum(avgRow.lnY - a1 * avgRow.X, DIGIT_ACCURACY);

        // elasticity = avgRow.X * a1; 

        elasticity = avgRow.X * Math.log(a1); 

        //  this.utilsService.roundNum(avgRow.X * a1, DIGIT_ACCURACY);

        // a1 = this.utilsService.roundNum(
        //       (count * sumRow.XlnY - sumRow.X * sumRow.lnY)
        //       / (count * sumRow.X2 - sumRow.X ** 2)
        // , DIGIT_ACCURACY);
        // a0 = this.utilsService.roundNum(avgRow.lnY - a1 * avgRow.X, DIGIT_ACCURACY);

        // elasticity = this.utilsService.roundNum(avgRow.X * a1, DIGIT_ACCURACY);

        funcParamsCount = 2;

        break;
      }
      case FuncTypeEnum.HYPERBOLA:
      {
        a1 = (count * sumRow.YdivX - sumRow.div1X * sumRow.Y) 
            / (count * sumRow.div1X2 - sumRow.div1X ** 2);
        
        a0 = avgRow.Y - a1 * avgRow.div1X;

        elasticity = -a1 / (a0 * avgRow.X + a1);
        
        funcParamsCount = 2;

        break;
      }
      case FuncTypeEnum.LOGARITHM:
      {
        a1 = (count * sumRow.YlnX - sumRow.lnX * sumRow.Y) 
            / (count * sumRow.lnX2 - sumRow.lnX ** 2);
        
        a0 = avgRow.Y - a1 * avgRow.lnX;

        elasticity = a1 / (a0 + a1 * avgRow.lnX);
          
        funcParamsCount = 2;

        break;
      }
    }

    const values: IAValuesAndElasticy = { a, a0, a1, a2, elasticity, funcParamsCount }

    return values;
  }

  private getYxArray(dto: GetYxArrayDto)
  {
    const { funcType: funcVariant, a0, a1, a2, xArr } = dto;

    const YxArr: number[] = [];

    const count: number = xArr.length;

    for (let i = 0; i < count; i++) 
    {
      let X = xArr[i];
      
      switch (funcVariant)
      {
        case FuncTypeEnum.LINE:
        default:
        {
          YxArr[i] = a0 + a1 * X;
          break;
        }
        case FuncTypeEnum.PARABOLA:
        {
          YxArr[i] = a0 + a1 * X + a2 * X ** 2;
          break;
        }
        case FuncTypeEnum.EXPONENTIAL:
        {
          YxArr[i] = a0 * a1 ** X;
          
          // this.utilsService.roundNum(
          //       Math.exp(a0) * Math.exp(a1) ** X
          // , DIGIT_ACCURACY);
          break;
        }
        case FuncTypeEnum.HYPERBOLA:
        {
          YxArr[i] = a0 + a1 / X;
          break;
        }
        case FuncTypeEnum.LOGARITHM:
        {
          YxArr[i] = a0 + a1 * Math.log(X);
          break;
        }
      }
    }

    return YxArr;
  }

  private getMeanSqrOff(avgX: number, avgX2: number)
  {
    const mean_sqr_off = Math.sqrt(avgX2 - avgX ** 2);
    return mean_sqr_off;
  }

  private getLinerCorrelCoef(avgX: number, 
                            avgY: number, 
                            avgXY: number, 
                            meanSqrOffX: number, 
                            meanSqrOffY: number)
  {
    const linearCorrCoef = (avgXY - avgX * avgY) 
                          / (meanSqrOffX * meanSqrOffY);
    return linearCorrCoef;
  }

  private getAvgCorrelCoefError(linearCorrCoef: number, count: number)
  {
    const avgCorrelCoefError = count > 50 //&& !(count < 30)
                            ? (1 - linearCorrCoef ** 2) / Math.sqrt(count)
                            : Math.sqrt(1 - linearCorrCoef ** 2) / Math.sqrt(count - 2);
    return avgCorrelCoefError;
  }

  private getCoefCorrelSignCheck(linearCorrCoef: number, avgCorrCoefErr: number)
  {
    const coefCorrSignCheck = Math.abs(linearCorrCoef) / avgCorrCoefErr;
    return coefCorrSignCheck;
  }

  private getSpiermanCoef(d2Sum: number, count: number)
  {
    const spearmanCoeff = 1 - ((6 * d2Sum) / (count * (count ** 2 - 1)));
    return spearmanCoeff;
  }

  private getRelationXY(сorrCoef: number): RelationType
  {
    let relationXY: RelationType = Math.abs(сorrCoef) === 0
                        ? RelationTypeEnum.NONE 
                      : (0 < Math.abs(сorrCoef) && Math.abs(сorrCoef) < 0.3) 
                        ? RelationTypeEnum.WEAK 
                      : (0.3 <= Math.abs(сorrCoef) && Math.abs(сorrCoef) <= 0.7) 
                        ? RelationTypeEnum.MEDIUM 
                      : RelationTypeEnum.STRONG;
    
    relationXY = сorrCoef > 0 ? `${RelationDirectionEnum.DIRECT} ${relationXY}` as RelationType
                : сorrCoef < 0 ? `${RelationDirectionEnum.BACK} ${relationXY}` as RelationType
                : relationXY;

    return relationXY as RelationType;
  }

  // getRelationXYspearman(spearmanCoeff: number): RelationType 
  // {
  //   let relationXYspearman: RelationType = spearmanCoeff === 0
  //                       ? RelationTypeEnum.NONE 
  //                     : (0 < Math.abs(spearmanCoeff) && Math.abs(spearmanCoeff) < 0.3) 
  //                       ? RelationTypeEnum.WEAK 
  //                     : (0.3 <= Math.abs(spearmanCoeff) && Math.abs(spearmanCoeff) <= 0.7) 
  //                       ? RelationTypeEnum.MEDIUM : RelationTypeEnum.STRONG;
    
  //   relationXYspearman = spearmanCoeff > 0 ? `${RelationDirectionEnum.DIRECT} ${relationXYspearman}` as RelationType
  //                       : spearmanCoeff < 0 ? `${RelationDirectionEnum.BACK} ${relationXYspearman}` as RelationType
  //                       : relationXYspearman;

  //   return relationXYspearman;
  // }

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
                        : count > 30 && tA < 3
                      ? SignificentTypeEnum.NOT_SIGNIFICANCE 
                        : count < 30 
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
      for (let j = 1; j < keys.length; j++)
      {
        if (!sumRow[keys[j] as string]) sumRow[keys[j] as string] = 0;
        sumRow[keys[j] as string] += +(data[i] as any)[keys[j] as string];
      }
    }

    // sumRow = this.utilsService.roundObjNums(sumRow, DIGIT_ACCURACY);

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

    // avgRow = this.utilsService.roundObjNums(avgRow, DIGIT_ACCURACY);

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
