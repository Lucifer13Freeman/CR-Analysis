import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { WriteTableDataDto } from '../../dto/write-table-data.dto';
import { ReadExcelDto } from '../../dto/read-excel.dto';
import { IFileData } from '../../interfaces/file-data.interface';
import { UtilsService } from '../utils/utils.service';
import { CSV_POSSIBLE_SEPARATORS,
  FILENAME, 
  HEADER_LABLES_FROM_FILE,
  INITIAL_TABLE_DATA } from '../../constants/constants';
import { ITableData } from '../../interfaces/table-data.interface';
import { CsvSeparatorType, PossibleExtEnum } from '../../types/types';
import { CsvSeparatorTypeEnum, ExcelExtEnum, FullFileDataHeaderExcelEnum } from '../../enums/enums';
import { FullFileDataDto } from '../../dto/full-file-data.dto';


@Injectable({ providedIn: 'root' })
export class ExcelService 
{
  constructor(private readonly utilsService: UtilsService) { }

  private checkExtension(extension?: PossibleExtEnum) 
  {
    if (extension !== ExcelExtEnum.XLSX 
      && extension !== ExcelExtEnum.CSV) extension = ExcelExtEnum.XLSX

    return extension;
  }

  private getCsvSeparators(str: string, possibleSeparators: Array<string>) 
  {
    return possibleSeparators.filter(weedOut);

    function weedOut(separator: string) 
    {
        let cache = -1;
        return str.split('\n').every(checkLength);

        function checkLength(line: string) 
        {
          if (!line) return true;

          let length = line.split(separator).length;

          if (cache < 0) cache = length;
            
          return cache === length && length > 1;
        }
    }
  }

  private getCsvSeparator(str: string): CsvSeparatorTypeEnum
  {
    const separators = this.getCsvSeparators(str, CSV_POSSIBLE_SEPARATORS);
    const separator = separators.includes(CsvSeparatorTypeEnum.DOT_COMMA) 
                        ? CsvSeparatorTypeEnum.DOT_COMMA 
                        : CsvSeparatorTypeEnum.COMMA;
    return separator;
  }

  private extractRowData(worksheet: XLSX.WorkSheet, rowNumer: number = 1)
  {
    let rowData = [];
    const columnCount = XLSX.utils.decode_range(worksheet['!ref'] as string).e.c + 1;

    for (let i = 0; i < columnCount; i++) 
    {
      rowData[i] = worksheet[`${XLSX.utils.encode_col(i)}${rowNumer}`]?.v;
    }
   
    return rowData;
  }

  private checkHeader(worksheet: XLSX.WorkSheet): boolean
  {
    const header = this.extractRowData(worksheet, 1);
    const hasHeader = header.every((item) => Number.isNaN(Number.parseFloat(item)));
    return hasHeader;
  }

  public getWorksheetWithHeaderAndCheck(worksheet: XLSX.WorkSheet/*, forKeys: boolean = false*/): XLSX.WorkSheet
  {
    const hasHeader = this.checkHeader(worksheet);

    if (hasHeader) return worksheet;

    const range = XLSX.utils.decode_range(worksheet['!ref'] as string);

    let columnCount = range.e.c + 1;
    const rowCount = range.e.r + 1;

    let aoaData: any[][] = [];

    let isCorrect = true;

    for (let i = 0; i < rowCount; i++)
    { 
      let rowData = this.extractRowData(worksheet, i + 1);

      rowData = rowData.filter(item => item !== undefined);

      if (rowData.length === 0) break;

      if (i === 0 && rowData.length !== columnCount) 
      {
        isCorrect = false;
        columnCount = rowData.length;
      }

      if (rowData.length > columnCount) 
      {
        rowData.splice(rowData.length - 1, rowData.length - columnCount);
      }

      if (i === 0)
      {
        const header = this.generateHeader(columnCount/*, forKeys*/);
        if (header) aoaData.push(header);
      }

      rowData = rowData.map((item: number | string) => 
      {
        if (item.toString().includes('o') 
          || item.toString().includes('O'))
        {
          isCorrect = false;
          item = +item.toString().replaceAll(/[oO]/ig, '0');
        }
        return item;
      });

      // console.log(rowData)

      if (rowData.length === columnCount) aoaData.push(rowData);
      else isCorrect = false;
    }

    // console.log(aoaData)

    if (!isCorrect) alert('Уведомление: проверьте данные файла!');
    // Alert: Please, check your file data!

    const newWorksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoaData);

    return newWorksheet;
  }

  private generateHeader(columnCount: number/*, forKeys: boolean = false*/): string[] | null
  {
    let header = [...HEADER_LABLES_FROM_FILE[0]]; // [forKeys ? HEADER_LABLES_FOR_KEYS_FROM_FILE[0] : HEADER_LABLES_FROM_FILE[0]];
    if (columnCount === 0) return null;

    for (let i = 0; i < columnCount - header.length; i++)
    {
      header.push(HEADER_LABLES_FROM_FILE[i + 1]); 
        // forKeys ? HEADER_LABLES_FOR_KEYS_FROM_FILE[i + 1] : HEADER_LABLES_FROM_FILE[i + 1]);
    }

    return header;
  }

  public async readExcel(dto: ReadExcelDto): Promise<IFileData<any> | null>
  {
    const { file } = dto;
    
    if (!file) return null;

    const extension = file.name.split('.').pop();

    let fileData: IFileData<any> = {
      tableData: {...INITIAL_TABLE_DATA},
      extension: extension as ExcelExtEnum,
      filename: file.name
    };
    
    const isCsv = extension === ExcelExtEnum.CSV;

    const fileReader = new FileReader();

    fileReader.readAsBinaryString(file);

    fileReader.onload = () => 
    {
      let binaryString: ArrayBuffer | string | null = fileReader.result;
      let csvSep: CsvSeparatorTypeEnum | CsvSeparatorType;

      if (binaryString)
      {
        if (isCsv)
        {
          csvSep = this.getCsvSeparator(binaryString.toString());
          
          if (csvSep === CsvSeparatorTypeEnum.DOT_COMMA) 
          {
            binaryString = binaryString.toString().replaceAll(',', '.');
          }
        }

        const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary', FS: csvSep });
        // let worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
        const worksheet = this.getWorksheetWithHeaderAndCheck(workbook.Sheets[workbook.SheetNames[0]]/*, true*/);

        let data = XLSX.utils.sheet_to_json(worksheet);

        data = this.utilsService.addIdsToObjArr(data);
  
        fileData.tableData.data = data;// this.utilsService.objArrKeysToLowerCase(data);
        fileData.tableData.header = this.utilsService.makeHeaderFromObj(fileData.tableData.data[0]); 
      }
    }

    // console.log(data)
    // console.log(extension)
    
    return fileData;
  }

  public async writeTableToExcel<T>(dto: WriteTableDataDto<T>): Promise<void>
  {
    const { tableData, filename } = dto;
    
    let { extension } = dto; 
    extension = this.checkExtension(extension);

    const filteredTableData = this.utilsService.filterDataByHeader(tableData);

    const worksheet: XLSX.WorkSheet = this.createWsFromJson(filteredTableData);

    const workbook: XLSX.WorkBook = { 
      Sheets: { 'Данные': worksheet },
      SheetNames: ['Данные']
    };
 
    const excelBuffer = XLSX.write(workbook, { bookType: extension, type: 'array' });

    this.saveFile(excelBuffer, filename, extension);
  }

  public async writeFullFileDataToExcel<T>(dto: FullFileDataDto<T>): Promise<void>
  {
    const { readTableData, calcTableData, rangTableData, 
            extCalcTableData, analysisParams, 
            funcType, canvasElement, filename } = dto;
    
    let { extension } = dto; 
    extension = this.checkExtension(extension);

    const filteredReadTableData = this.utilsService.filterDataByHeader(readTableData);
    const worksheetReadTable: XLSX.WorkSheet = this.createWsFromJson(filteredReadTableData);

    const filteredCalcTableData = this.utilsService.filterDataByHeader(calcTableData);
    const worksheetCalcTable: XLSX.WorkSheet = this.createWsFromJson(filteredCalcTableData);

    const filteredRangTableData = this.utilsService.filterDataByHeader(rangTableData);
    const worksheetRangTable: XLSX.WorkSheet = this.createWsFromJson(filteredRangTableData);

    const filteredExtCalcTableData = this.utilsService.filterDataByHeader(extCalcTableData);
    const worksheetExtCalcTable: XLSX.WorkSheet = this.createWsFromJson(filteredExtCalcTableData);

    const analysisParamsTableData = this.utilsService.makeTableDataFromAnalysisParams(analysisParams);
    const filteredAnalysisParamsTableData = this.utilsService.filterDataByHeader(analysisParamsTableData);
    const worksheetAnalysisParamsTable: XLSX.WorkSheet = this.createWsFromJson(filteredAnalysisParamsTableData);

    // const worksheetChartData: any = {
    //   { name: 'image1.jpg',
    //     data: this.picBlob,
    //     opts: { base64: true },
    //     position: {
    //       type: 'twoCellAnchor',
    //       attrs: { editAs: 'oneCell' },
    //       from: { col: 2, row : 2 },
    //       to: { col: 6, row: 5 }
    //   }
    // }

    // FULL_FILE_DATA_HEADER_EXCEL.analysisParams
    // FULL_FILE_DATA_HEADER_EXCEL.chartData

    const worksheetChartData: any = {}

    const sheets: any = {}
    
    sheets[FullFileDataHeaderExcelEnum.READ_TABLE_DATA as string] = worksheetReadTable;
    sheets[FullFileDataHeaderExcelEnum.CALC_TABLE_DATA as string] = worksheetCalcTable;
    sheets[FullFileDataHeaderExcelEnum.RANG_TABLE_DATA as string] = worksheetRangTable;
    sheets[FullFileDataHeaderExcelEnum.EXT_CALC_TABLE_DATA as string] = worksheetExtCalcTable;
    sheets[FullFileDataHeaderExcelEnum.ANALYSIS_PARAMS as string] = worksheetAnalysisParamsTable;
    sheets[FullFileDataHeaderExcelEnum.CHART_DATA as string];

    const workbook: XLSX.WorkBook = { 
      Sheets: {
        ...sheets},
      SheetNames: [
        FullFileDataHeaderExcelEnum.READ_TABLE_DATA,
        FullFileDataHeaderExcelEnum.CALC_TABLE_DATA,
        FullFileDataHeaderExcelEnum.RANG_TABLE_DATA,
        FullFileDataHeaderExcelEnum.EXT_CALC_TABLE_DATA,
        FullFileDataHeaderExcelEnum.ANALYSIS_PARAMS//,
        // 'График'
      ]
    };

    // const blob = canvasElement?.toDataURL().split(',')[1];

    // workbook.Sheets['График']['!images']= [
    // {
    //       name: filename,
    //       data: blob,
    //       opts: { base64: true },
    //       position: {
    //           type: 'twoCellAnchor',
    //           attrs: { editAs: 'oneCell' },
    //           from: { col: 8, row : 2 },
    //           to: { col: 8, row: 4 }
    //       }
    //   }
    // ]
 
    const excelBuffer = XLSX.write(workbook, { bookType: extension, type: 'array' });

    this.saveFile(excelBuffer, filename, extension);
  }

  private createWsFromJson<T>(tableData: ITableData<any>,
                              opts?: Omit<XLSX.JSON2SheetOpts, 'header'>): XLSX.WorkSheet
  {
    const { data, header } = tableData;
    const fields: Array<keyof T> = Object.keys(data[0]) as Array<keyof T>;

    const worksheet = XLSX.utils.json_to_sheet(
      data, 
      { 
        header: fields as string[],
        ...opts
      }
    )

    if (!header) return worksheet;

    const range = XLSX.utils.decode_range(worksheet['!ref'] as string);
    
    for (let i = range.s.c; i <= range.e.c; i++) 
    {
      const col = XLSX.utils.encode_col(i) + '1';
      // ws[col].v = header[ ws[col].v ];
      worksheet[col].v = header[i];
      worksheet[col].s = { font: { sz: 14, bold: true }};
    }
    
    return worksheet;
  }

  // private jsonToSheet<T>(worksheet: Worksheet, data: T[])
  // {
  //   for (let obj of data)
  //   {
  //     let keys: Array<keyof T> = Object.keys(obj) as Array<keyof T>;
  //     let row: Array<Partial<T>> = [];

  //     for (let key of keys) row.push(obj[key]);

  //     worksheet.addRow(row);
  //   }
  // }

  private saveFile(buffer: any, 
                  filename: string = FILENAME,
                  extension: string = ExcelExtEnum.XLSX): void
  {
    const data: Blob = new Blob([buffer], { type: ExcelExtEnum.XLSX });
    saveAs(data, `${filename}-${new Date().valueOf()}.${extension}`);
  }
}