import { Injectable } from '@angular/core';
// import PptxGenJS from 'pptxgenjs/types';
import { FILENAME } from '../../constants/constants';
import { FullFileDataDto } from '../../dto/full-file-data.dto';
import { FullFileDataHeaderEnum, ImageExtEnum, PPTXExtEnum } from '../../enums/enums';
import pptxgen from "pptxgenjs";
import { TableTypeEnum } from 'src/app/data-table/enums/table-type.enum';
import { ITableData } from '../../interfaces/table-data.interface';
import { IAnalysisParams } from '../../interfaces/analysis-params.interface';


@Injectable(
{
  providedIn: 'root'
})
export class PptxService 
{
  constructor() { }

  async writeFullDataToPPTX<T>(fullFileData: FullFileDataDto<T>) 
  {
    const { readTableData, calcTableData, rangTableData, 
          extCalcTableData, analysisParams, 
          funcType, canvasElement, 
          extension, filename } = fullFileData;

    let pptx = new pptxgen();

    let slides: pptxgen.Slide[] = [];

    let slide0 = pptx.addSlide();

    slide0.addText(FullFileDataHeaderEnum.MAIN_HEADER, {
        x: 1.5,
        y: 1.5,
        color: "363636",
        fill: { color: "F1F1F1" },
        align: pptx.AlignH.center,
    });

    this.addTable(pptx, readTableData, FullFileDataHeaderEnum.READ_TABLE_DATA, 15);
    this.addTable(pptx, calcTableData, FullFileDataHeaderEnum.CALC_TABLE_DATA, 5);
    this.addTable(pptx, rangTableData, FullFileDataHeaderEnum.RANG_TABLE_DATA, 15);
    this.addTable(pptx, extCalcTableData, FullFileDataHeaderEnum.EXT_CALC_TABLE_DATA, 3);

    this.addAnalysisParams(pptx, analysisParams, FullFileDataHeaderEnum.ANALYSIS_PARAMS);

    const chartImageURL: string | undefined = canvasElement?.toDataURL(`image/${ImageExtEnum.PNG}`, 1);

    if (chartImageURL) 
    {
      this.addImage(pptx, chartImageURL);
    }
    
    await this.saveFile(pptx, filename, extension);
  }

  addImage(pptx: any, imageURL: string, title: string = FullFileDataHeaderEnum.CHART_DATA)
  {
    let slide = pptx.addSlide();

    slide.addText(title, { 
      x: 4,
			y: 0.5,
			w: 1,
			h: 0.4,
      fontSize: 16,
      bold: true,
      // color: "363636",
      // fill: { color: "F1F1F1" },
      align: 'center'
    });
    
    slide.addImage({ path: imageURL, x: 1, y: 1, w: 8, h: 4, });
  }

  addAnalysisParams(pptx: any, 
                    analysisParams: IAnalysisParams, 
                    title: string = FullFileDataHeaderEnum.ANALYSIS_PARAMS) 
  {
    let slide1 = pptx.addSlide();
    let slide2 = pptx.addSlide();
    let slide3 = pptx.addSlide();
    let slide4 = pptx.addSlide();

    const headerOptions = {
      fontSize: 16,
      bold: true,
      color: "363636",
      fill: { color: "F1F1F1" },
      align: 'center'
    };

    const paramsOptions = { fontSize: 14 };

    const textBoxOptions = { 
      x: 0.5, 
      y: 0.5, 
      w: 8.5, 
      h: 4.5, 
      color: "000000",  
      valign: "top", 
      // align: "center", 
      isTextBox: true 
    };

    const nullRow = {
      text: '',
      options: paramsOptions
    }

    const a2 = analysisParams.a2.name !== undefined ? {
      text: `\n${analysisParams.a2.name}: ${analysisParams.a2.value}`,
      options: paramsOptions
    } : nullRow;

    const avgA2Err = analysisParams.avgA2Err.name !== undefined ? {
      text: `\n${analysisParams.avgA2Err.name}: ${analysisParams.avgA2Err.value}`,
      options: paramsOptions
    } : nullRow;

    const tA2 = analysisParams.tA2.name !== undefined ? {
      text: `\n${analysisParams.tA2.name}: ${analysisParams.tA2.value} - ${analysisParams.tA2Check.value}`,
      options: paramsOptions
    } : nullRow;

    slide1.addText(
      [
        {
          text: `${title}\n`,
          options: headerOptions
        },
        {
          text: `\n${analysisParams.meanSqrOffX.name}: ${analysisParams.meanSqrOffX.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.meanSqrOffY.name}: ${analysisParams.meanSqrOffY.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.linearCorrCoef.name}: ${analysisParams.linearCorrCoef.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.relXY.name}: ${analysisParams.relXY.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.avgCorrCoefErr.name}: ${analysisParams.avgCorrCoefErr.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.coefCorrSignCheck.name}: ${analysisParams.coefCorrSignCheck.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.signLvlSelectVal.name}: ${analysisParams.signLvlSelectVal.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.tTable.name}: ${analysisParams.tTable.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.coefCorrSign.name}: ${analysisParams.coefCorrSign.value}`,
          options: paramsOptions
        },
      ],
      { ...textBoxOptions }
    );

    slide2.addText(
      [
        {
          text: `\n${analysisParams.spearmanCoeff.name}: ${analysisParams.spearmanCoeff.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.relXYspearman.name}: ${analysisParams.relXYspearman.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.elasticity.name}: ${analysisParams.elasticity.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.avgApproxErr.name}: ${analysisParams.avgApproxErr.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.totalDispersion.name}: ${analysisParams.totalDispersion.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.factorDispersion.name}: ${analysisParams.factorDispersion.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.residualDispersion.name}: ${analysisParams.residualDispersion.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.totalDispersionCheck.name}: ${analysisParams.totalDispersionCheck.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.theorCoefDeterm.name}: ${analysisParams.theorCoefDeterm.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.theorCorrRel.name}: ${analysisParams.theorCorrRel.value}`,
          options: paramsOptions
        }
      ],
      { ...textBoxOptions }
    );

    slide3.addText(
      [
        {
          text: `\n${analysisParams.func.name}: ${analysisParams.func.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.a0.name}: ${analysisParams.a0.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.a1.name}: ${analysisParams.a1.value}`,
          options: paramsOptions
        },
        {...a2},
        {
          text: `\n${analysisParams.avgA0Err.name}: ${analysisParams.avgA0Err.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.avgA1Err.name}: ${analysisParams.avgA1Err.value}`,
          options: paramsOptions
        },
        {...avgA2Err},
        {
          text: `\n${analysisParams.tA0.name}: ${analysisParams.tA0.value} - ${analysisParams.tA0Check.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.tA1.name}: ${analysisParams.tA1.value} - ${analysisParams.tA1Check.value}`,
          options: paramsOptions
        },
        {...tA2},
      ],
      { ...textBoxOptions }
    );

    slide4.addText(
      [
        {
          text: `\n${analysisParams.fisherCrit.name}: ${analysisParams.fisherCrit.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.fTableValLvl.name} (${analysisParams.fTableValLvlSelectVal.value}): ${analysisParams.fTableValLvl.value}`,
          options: paramsOptions
        },
        {
          text: `\n${analysisParams.fTableValLvlCheck.value}`,
          options: paramsOptions
        }
      ],
      { ...textBoxOptions }
    );
  }

  addTable<T>(pptx: any, 
            tableData: ITableData<T>, 
            title: string = "Таблица", 
            rowsPerSlide: number = 12) 
  {
    const tableRows = [];
    const tableHeaderRow = [];

    for (let i = 0; i < tableData.header.length; i++) 
    {
      const label = tableData.header[i];

      const cell = { 
        text: label, 
        options: { 
          valign: "center", 
          align: "center", 
          fontFace: "Arial" 
        }, 
        fontSize: 14,
        bold: true
      }

      tableHeaderRow.push(cell);
    }

    tableRows.push(tableHeaderRow);

    const keysReadTableData = Object.keys(tableData.data[0]);

    for (let i = 0; i < tableData.data.length; i++) 
    {
      const row = [];

      for (let j = 0; j < keysReadTableData.length; j++) 
      {
        const text = (tableData.data[i] as any)[keysReadTableData[j] as string];

        const cell = { 
          text: text, 
          options: { 
            valign: "center", 
            align: "left", 
            fontFace: "Arial" 
          }, 
          fontSize: 10
        }

        row.push(cell);
      }

      tableRows.push(row);
    }

    for (let i = 0; i < tableRows.length; i++)
    {
      let rowsChunk: any = i === 0 
                        ? tableRows.slice(i, i + rowsPerSlide - 1) 
                        : tableRows.slice(i, i + rowsPerSlide);

      if (i === 0 || ((i + 1) % rowsPerSlide == 0)) 
      {
        let slide = pptx.addSlide();

        if (i === 0) slide.addText(title,
        {
          x: 0,
          y: 0.2,
          color: "363636",
          fill: { color: "F1F1F1" },
          align: pptx.AlignH.center
        });

        slide.addTable(rowsChunk, { 
          border: { pt: "1", color: "000000" },
          valign: "center",
          align: "center", 
        });
      }
    }
  }

  async saveFile(pptx: any,//PptxGenJS, 
                filename: string = FILENAME, 
                extension: string = PPTXExtEnum.PPTX) 
  {
    pptx.writeFile({ fileName: `${filename}-${new Date().valueOf()}.${extension}` });
  }
}
