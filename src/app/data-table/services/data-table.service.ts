import { Injectable } from '@angular/core';
import { Associations, DIGIT_ACCURACY, DIGIT_ACCURACY_FOR_SMALL_NUMS } from 'src/app/shared/constants/constants';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { IColumnSchemaElement } from '../interfaces/column-schema-element.interface';


@Injectable(
{
  providedIn: 'root'
})
export class DataTableService 
{
  constructor(private readonly utilsService: UtilsService) { }

  public generateColumnSchema(header: string[], data: any[]): IColumnSchemaElement[]
  {
    let columnSchema: IColumnSchemaElement[] = [];

    const selectCheckBox: IColumnSchemaElement = {
      key: 'isSelected',
      label: '',
      type: 'isSelected'
    }

    if (!data[0]) return columnSchema;

    const dataKeys = Object.keys(data[0]);

    for (let i = 0; i < dataKeys.length; i++)
    {
      if (i % dataKeys.length === 0) columnSchema.push(selectCheckBox);

      const label = header.find((label: string) => label === Associations.keysHeaderLabels[dataKeys[i]]);

      if (label)
      {
        const col: IColumnSchemaElement = {
          key: dataKeys[i],
          label: label, //Associations.keysHeaderLabels[dataKeys[i]],
          type: 'text'
        }

        columnSchema.push(col);
      }
    }

    // header.forEach((str: string, index: number) => 
    // { 
    //   const col: IColumnSchemaElement = {
    //     key: str.toLowerCase(),
    //     label: str,
    //     type: 'text'
    //   }

    //   if (index % header.length === 0) columnSchema.push(selectCheckBox);

    //   columnSchema.push(col);
    // });

    return columnSchema;
  }

  public extractData(data: any): any
  {
    let extractedData: Array<any> = data.map((obj: any) =>
    {
      if (obj.hasOwnProperty('isSelected')) delete obj.isSelected;
      return obj;
    });

    const keys = Object.keys(extractedData[0]);

    if (keys.length > 0 && extractedData.length > 0)
    {
      for (let i = 0; i < extractedData.length; i++)
      {
        for (let j = 1; j < keys.length; j++)
        {
          extractedData[i][keys[j] as string] = parseFloat(extractedData[i][keys[j] as string].toString().replace(',', '.'));
        }
      }
    }

    return extractedData;
  }

  public roundTableDataNums(data: any): any
  {
    const newData = [...data];

    const keys = Object.keys(newData[0]);

    if (keys.length > 0 && newData.length > 0)
    {
      for (let i = 0; i < newData.length; i++)
      {
        for (let j = 1; j < keys.length; j++)
        {
          if (!Number.isNaN(parseFloat(newData[i][keys[j] as string])))
          {
            const digitAccuracy = keys[j] as string === 'div1X' 
                                || keys[j] as string === 'div1X2' 
                                  ? DIGIT_ACCURACY_FOR_SMALL_NUMS 
                                  : DIGIT_ACCURACY;
            newData[i][keys[j] as string] = this.utilsService.roundNum(newData[i][keys[j] as string], digitAccuracy);
          }
        }
      }
    }

    return newData;
  }
}
