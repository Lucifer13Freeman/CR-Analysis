import { Injectable } from '@angular/core';
import { Associations, DIGIT_ACCURACY } from '../../constants/constants';
import { ITableData } from '../../interfaces/table-data.interface';
import { Point } from 'chart.js';


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

  // makeHeaderFromObj<T>(obj: T): Array<string>
  // {
  //   const header = (Object.keys(obj) as Array<string>).map(
  //     (str: string, index: number) => 
  //     {
  //       if (index === 0) return '№';
  //       return str.charAt(0).toUpperCase() + str.slice(1);
  //     }
  //   );
  //   return header;
  // }

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

  // addIdsToObj<T>(obj: T): T
  // {
  //   let newObj = {...obj} 
    
  //   return obj;
  // }

  addIdsToObjArr<T>(objArr: Array<T>): Array<T>
  {
    // let newObjArr: Array<T> = JSON.parse(JSON.stringify(objArr));
    return objArr.map((obj: T, index: number) => { return { id: index + 1, ...obj } });
  }

  // binaryToString(str: any) 
  // {
  //   // Removes the spaces from the binary string
  //   str = str.replace(/\s+/g, '');
  //   // Pretty (correct) print binary (add a space every 8 characters)
  //   str = str.match(/.{1,8}/g).join(" ");

  //   let newBinary = str.split(" ");
  //   let binaryCode = [];

  //   for (let i = 0; i < newBinary.length; i++) 
  //   {
  //     binaryCode.push(String.fromCharCode(parseInt(newBinary[i], 2)));
  //   }
    
  //   return binaryCode.join("");
  // }

  roundObjNums<T>(obj: T, accuracy: number = DIGIT_ACCURACY)
  {
    const keys = Object.keys(obj);
    let newObj = {...obj};

    for (let i = 0; i < keys.length; i++)
    {
      let val = (newObj as any)[keys[i]];

      if (!Number.isNaN(parseFloat(val)))
      {
        (newObj as any)[keys[i]] = parseFloat((parseFloat(val)).toFixed(accuracy));
      }
    }

    return newObj;
  }

  roundNum(val: any, num: number = 2)
  {
    return parseFloat((parseFloat(val)).toFixed(num));
  }

  rankArray(arr: number[], compareFn?: ((a: number, b: number) => number) | undefined) 
  {
    // STEP 1
    const arrSorted = arr.slice().sort(compareFn);
    
    const ranks: any = {}; // each value from the input array will become a key here and have a rank assigned
    const ranksCount: any = {}; // each value from the input array will become a key here and will count number of same elements
    
    // STEP 2
    for (let i = 0; i < arrSorted.length; i++) // here we populate ranks and ranksCount
    { 
      const currentValue = arrSorted[i].toString();
    
      if (arrSorted[i] !== arrSorted[i - 1]) ranks[currentValue] = i + 1; // if the current value is the same as the previous one, then do not overwrite the rank that was originally assigned (in this way each unique value will have the lowest rank)
      if (ranksCount[currentValue] == undefined) ranksCount[currentValue] = 1; // if this is the first time we iterate this value, then set count to 1
      else ranksCount[currentValue]++; // else increment by one
    }
    
    const ranked = [];
    
    // STEP 3
    for (let i = arr.length - 1; i >= 0; i--) // we need to iterate backwards because ranksCount starts with maximum values and decreases
    { 
      const currentValue = arr[i].toString();
    
      ranksCount[currentValue]--;

      if (ranksCount[currentValue] < 0) // a check just in case but in theory it should never fail
      { 
        console.error("Негативное значение количества рангов!");
        // console.error("Negative rank count has been found which means something went wrong :(");
        return [];
      }

      ranked[i] = ranks[currentValue]; // start with the lowest rank for that value...
      ranked[i] += ranksCount[currentValue]; // ...and then add the remaining number of duplicate values
    }
    
    return ranked;
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
