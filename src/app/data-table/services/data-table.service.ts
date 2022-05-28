import { Injectable } from '@angular/core';
import { IColumnSchemaElement } from '../interfaces/column-schema-element.interface';


@Injectable(
{
  providedIn: 'root'
})
export class DataTableService 
{
  constructor() { }

  public generateColumnSchema(header: Array<string>, data: Array<any>): Array<IColumnSchemaElement>
  {
    let columnSchema: Array<IColumnSchemaElement> = [];

    const selectCheckBox: IColumnSchemaElement = {
      key: 'isSelected',
      label: '',
      type: 'isSelected'
    }

    if (!data[0]) return columnSchema;

    const dataKeys = Object.keys(data[0]);

    for (let i = 0; i < header.length; i++)
    {
      const col: IColumnSchemaElement = {
        key: dataKeys[i],
        label: header[i],
        type: 'text'
      }

      if (i % header.length === 0) columnSchema.push(selectCheckBox);

      columnSchema.push(col);
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
}
