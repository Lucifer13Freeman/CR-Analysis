import { Injectable } from '@angular/core';
import { Associations, DIGIT_ACCURACY } from '../../constants/constants';
import { ITableData } from '../../interfaces/table-data.interface';
import { Point } from 'chart.js';
import { IAnalysisParams } from '../../interfaces/analysis-params.interface';
import { HeaderLabelsEnum } from '../../enums/enums';


@Injectable(
{
  providedIn: 'root'
})
export class UtilsService 
{
  constructor() { }

  filterDataByHeader<T>(tableData: ITableData<T>)
  {
    const { header, data } = tableData;

    const keys = Object.keys(data[0])
                    .filter((key: string) => header.includes(Associations.keysHeaderLabels[key]));

    let newData: any[] = [];

    for (let i = 0; i < data.length; i++)
    {
      let obj: any;

      for (let j = 0; j < keys.length; j++)
      {
        let key: string = keys[j];
        let val = (data[i] as any)[key]

        obj = { ...obj, [key]: val };
      }

      newData.push(obj);
    }

    const newTableData: ITableData<any> = {
      header,
      data: newData
    }

    return newTableData;
  }

  makeHeaderFromObj<T>(obj: T): string[]
  {
    const header = (Object.keys(obj) as string[]).map(
      (key: string) => Associations.keysHeaderLabels[key]
    );
    return header;
  }

  matrDeterminant(matrix: number[][]) 
  {
    const sum = (xs: number[]) => xs.reduce ((a, b) => a + b, 0);
        

    const stripRowAndCol = (r: number, c: number) => (matrix: number[][]) =>
      matrix .filter ((_, j) => j !== r)
        .map (row => row .filter ((_, i) => i !== c))
                              

    const determinant = (matrix: number[][]): number => 
      matrix [0] .length == 1
        ? matrix [0] [0]
        : sum (matrix [0] .map (
          (x, i) => (-1) ** i * x * determinant(stripRowAndCol(0, i) (matrix))
      ))
      
    return determinant(matrix);
  }

  makeTableDataFromAnalysisParams(analysisParams: IAnalysisParams)
  {
    const nullRow = {
      name: undefined,
      value: undefined
    }

    const a2 = analysisParams.a2.name !== undefined ? { 
      name: analysisParams.a2.name,
      value: analysisParams.a2.value
    } : nullRow;

    const avgA2Err = analysisParams.avgA2Err.name !== undefined ? { 
      name: analysisParams.avgA2Err.name,
      value: analysisParams.avgA2Err.value
    } : nullRow;

    const tA2 = analysisParams.tA2.name !== undefined ? { 
      name: analysisParams.tA2.name,
      value: `${analysisParams.tA2.value} - ${analysisParams.tA2Check.value}`
    } : nullRow;


    const tableData: ITableData<any> = {
      header: [
        HeaderLabelsEnum.name,
        HeaderLabelsEnum.value
      ],
      data: [
        { 
          name: analysisParams.meanSqrOffX.name,
          value: analysisParams.meanSqrOffX.value
        },
        { 
          name: analysisParams.meanSqrOffY.name,
          value: analysisParams.meanSqrOffY.value
        },
        { 
          name: analysisParams.linearCorrCoef.name,
          value: analysisParams.linearCorrCoef.value
        },
        { 
          name: analysisParams.relXY.name,
          value: analysisParams.relXY.value
        },
        { 
          name: analysisParams.avgCorrCoefErr.name,
          value: analysisParams.avgCorrCoefErr.value
        },
        { 
          name: analysisParams.coefCorrSignCheck.name,
          value: analysisParams.coefCorrSignCheck.value
        },
        { 
          name: analysisParams.signLvlSelectVal.name,
          value: analysisParams.signLvlSelectVal.value
        },
        { 
          name: analysisParams.tTable.name,
          value: analysisParams.tTable.value
        },
        { 
          name: analysisParams.coefCorrSign.name,
          value: analysisParams.coefCorrSign.value
        },
        { 
          name: analysisParams.spearmanCoeff.name,
          value: analysisParams.spearmanCoeff.value
        },
        { 
          name: analysisParams.relXYspearman.name,
          value: analysisParams.relXYspearman.value
        },
        { 
          name: analysisParams.elasticity.name,
          value: analysisParams.elasticity.value
        },
        { 
          name: analysisParams.avgApproxErr.name,
          value: analysisParams.avgApproxErr.value
        },
        { 
          name: analysisParams.totalDispersion.name,
          value: analysisParams.totalDispersion.value
        },
        { 
          name: analysisParams.factorDispersion.name,
          value: analysisParams.factorDispersion.value
        },
        { 
          name: analysisParams.residualDispersion.name,
          value: analysisParams.residualDispersion.value
        },
        { 
          name: analysisParams.totalDispersionCheck.name,
          value: analysisParams.totalDispersionCheck.value
        },
        { 
          name: analysisParams.theorCoefDeterm.name,
          value: analysisParams.theorCoefDeterm.value
        },
        { 
          name: analysisParams.theorCorrRel.name,
          value: analysisParams.theorCorrRel.value
        },
        { 
          name: analysisParams.func.name,
          value: analysisParams.func.value
        },
        { 
          name: analysisParams.a0.name,
          value: analysisParams.a0.value
        },
        { 
          name: analysisParams.a1.name,
          value: analysisParams.a1.value
        },
        {...a2},
        { 
          name: analysisParams.avgA0Err.name,
          value: analysisParams.avgA0Err.value
        },
        { 
          name: analysisParams.avgA1Err.name,
          value: analysisParams.avgA1Err.value
        },
        {...avgA2Err},
        { 
          name: analysisParams.tA0.name,
          value: `${analysisParams.tA0.value} - ${analysisParams.tA0Check.value}`
        },
        { 
          name: analysisParams.tA1.name,
          value: `${analysisParams.tA1.value} - ${analysisParams.tA1Check.value}`
        },
        {...tA2},
        { 
          name: analysisParams.fisherCrit.name,
          value: analysisParams.fisherCrit.value
        },
        { 
          name: `${analysisParams.fTableValLvl.name} (${analysisParams.fTableValLvlSelectVal.value}):`,
          value: analysisParams.fTableValLvl.value
        },
        { 
          name: analysisParams.fTableValLvlCheck.name,
          value: analysisParams.fTableValLvlCheck.value
        }
      ]
    }

    return tableData;
  }

  renameObjKey(obj: any, oldKey: string, newKey: string) 
  {
    if (oldKey !== newKey) 
    {
      Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, oldKey) as PropertyDescriptor & ThisType<any>);
      delete obj[oldKey];
    }

    return obj;
  }

  objKeysToLowerCase<T>(obj: T): T
  {
    const oldKeys = Object.keys(obj);
    const newKeys = oldKeys.map((key: string) => key.toLowerCase());

    let newObj = {...obj} 
    oldKeys.map((key: string, index: number) => this.renameObjKey(newObj, key, newKeys[index]));

    return newObj;
  }

  objArrKeysToLowerCase<T>(objArr: Array<T>): Array<T>
  {
    return objArr.map(obj => this.objKeysToLowerCase(obj));
  }

  addIdsToObjArr<T>(objArr: Array<T>): Array<T>
  {
    return objArr.map((obj: T, index: number) => { return { id: index + 1, ...obj } });
  }

  roundNum(val: any, accuracy: number = DIGIT_ACCURACY)
  {
    return parseFloat((parseFloat(val)).toFixed(accuracy));
  }

  roundObjNums<T>(obj: T, accuracy: number = DIGIT_ACCURACY)
  {
    const keys = Object.keys(obj);
    let newObj = {...obj};

    for (let i = 0; i < keys.length; i++)
    {
      let val = (newObj as any)[keys[i]];

      if (!Number.isNaN(parseFloat(val)))
      {
        (newObj as any)[keys[i]] = this.roundNum(val, accuracy);
      }
    }

    return newObj;
  }

  rankArray(arr: number[], 
    compareFn: ((a: number, b: number) => number) | undefined = (a, b) => b - a) 
  {
    let rankArr: any = [...arr as number[]];
    const sortedArr = [...rankArr].sort(compareFn);

    for (let i = 0; i < sortedArr.length; i++) 
    {
      let val: number | null = parseFloat(rankArr[i]);

      if (typeof val !== "number" || Number.isNaN(val)) continue;

      rankArr[i] = null;

      if ((rankArr as number[]).indexOf(val) === -1) 
      {
        rankArr[i] = { rank: sortedArr.indexOf(val) + 1 };
      } 
      else 
      {
        rankArr[i] = val;
        
        let pos = sortedArr.indexOf(val);

        let posSum: number = 0;
        let count: number = 0;
        let index: number[] = [];

        for (let j = 0; j < rankArr.length; j++) 
        {
          if (rankArr[j] === val) 
          {
            ++count;
            ++pos;
            posSum += pos;
            rankArr[j] = null;
            index.push(j);
          }
        }

        val = posSum / count;

        for (let j = 0; j < index.length; j++) 
        {
          rankArr[index[j]] = { rank: val };
        }
      }
    }

    for (let i = 0; i < rankArr.length; i++) 
    {
      rankArr[i] = rankArr[i].rank;
    }

    return rankArr;
  }

  getPointsArray(xArr: number[], yArr: number[])
  {
    const pointsArr: Point[] = [];

    if (xArr.length !== yArr.length) return pointsArr;

    for (let i = 0; i < xArr.length; i++)
    {
      pointsArr.push({ x: xArr[i], y: yArr[i] });
    }

    return pointsArr;
  }
}
