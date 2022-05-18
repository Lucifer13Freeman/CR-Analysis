import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, 
        Table, TableCell, TableRow, 
        TextRun, WidthType } from "docx";
import { saveAs } from "file-saver";
import { FILENAME, 
        WORD_FONT_HEADER_SIZE, 
        WORD_FONT_SIZE } from '../../constants/constants';
import { WriteWordDto } from '../../dto/write-word.dto';
import { MimeTypeEnum, WordPdfExtEnum } from '../../enums/enums';
import { IAnalysisParams } from '../../interfaces/analysis-params.interface';
import { ITableData } from '../../interfaces/table-data.interface';
import { UtilsService } from '../utils/utils.service';


@Injectable(
{
  providedIn: 'root'
})
export class WordService 
{
  constructor(private readonly utilsService: UtilsService) { }

  async writeTableToWord<T>(tableData: ITableData<T>) 
  {
    const table: Table = this.createTableFromJson(tableData);

    const doc = new Document(
    {
      sections: [
      {
        children: [table],
      }]
    });

    await this.saveFile(doc);
  }

  async writeAnalysisParamsToWord<T>(dto: WriteWordDto<T>) 
  {
    const { analysisParams, extension } = dto;

    if (!analysisParams) return;

    const paragraph: Paragraph[] = this.createDocParagraphFromJson(analysisParams);
    
    const doc = new Document(
    {
      sections: [
      {
        children: [...paragraph],
      }]
    });

    await this.saveFile(doc, FILENAME, extension);
  }

  createTableFromJson<T>(tableData: ITableData<T>): Table
  {
    const filteredTableData = this.utilsService.filterDataByHeader(tableData);

    const { header, data } = filteredTableData;

    const keys = Object.keys(data[0]);

    let rows = [];

    for (let i = 0; i < data.length + 1; i++)
    {
      const row: TableRow = new TableRow({ children: [] });

      for (let j = 0; j < keys.length; j++)
      {
        let val: string = i === 0 
                            ? header[j].toString()
                            : (data[i - 1] as any)[keys[j] as string].toString();

        if (!val) val = '';

        const text = new TextRun({ text: val.toString(), bold: i === 0 });

        const cell = new TableCell(
        {
          children: [ new Paragraph({ children: [text] }) ]         
        });
        
        row.addChildElement(cell);
      }

      rows.push(row);
    }

    const table: Table = new Table(
    { 
      rows, 
      width: { 
        size: 100, 
        type: WidthType.PERCENTAGE 
      }
    });

    return table;
  }

  createDocParagraphFromJson(analysisParams: IAnalysisParams)
  {
    const paragraphs: Paragraph[] = [
      new Paragraph(
      {
        children: [
          new TextRun(
          { 
            text: "Параметры анализа",
            bold: true,
            size: WORD_FONT_HEADER_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [],
      }),
      // new Paragraph(
      // {
      //   children: [],
      // }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.meanSqrOffX.name}: ${analysisParams.meanSqrOffX.value}`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.meanSqrOffY.name}: ${analysisParams.meanSqrOffY.value}`,
            size: WORD_FONT_SIZE
          }) 
        ]
      }),
      new Paragraph(
      {
        children: []
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.linearCorrCoef.name}: ${analysisParams.linearCorrCoef.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.avgCorrCoefErr.name}: ${analysisParams.avgCorrCoefErr.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.coefCorrSignCheck.name}: ${analysisParams.coefCorrSignCheck.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: []
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.signLvlSelectVal.name}: ${analysisParams.signLvlSelectVal.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.tTable.name}: ${analysisParams.tTable.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: []
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.relXY.name}: ${analysisParams.relXY.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
          children: [
            new TextRun({
              text: `${analysisParams.coefCorrSign.name}: ${analysisParams.coefCorrSign.value}\n`,
              size: WORD_FONT_SIZE
            })
          ]
      }),
      new Paragraph(
      {
        children: []
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.spearmanCoeff.name}: ${analysisParams.spearmanCoeff.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.elasticity.name}: ${analysisParams.elasticity.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: []
      }),
      new Paragraph(
      {
        children: [
          new TextRun(
          {
            text: `${analysisParams.avgApproxErr.name}: ${analysisParams.avgApproxErr.value}\n`,
            size: WORD_FONT_SIZE
          }),
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun(
          {
            text: `${analysisParams.totalDispersion.name}: ${analysisParams.totalDispersion.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun(
            {
              text: `${analysisParams.factorDispersion.name}: ${analysisParams.factorDispersion.value}\n`,
              size: WORD_FONT_SIZE
            })
          ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun(
          {
            text: `${analysisParams.residualDispersion.name}: ${analysisParams.residualDispersion.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun(
          {
            text: `${analysisParams.totalDispersionCheck.name}: ${analysisParams.totalDispersionCheck.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: []
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.theorCoefDeterm.name}: ${analysisParams.theorCoefDeterm.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.theorCorrRel.name}: ${analysisParams.theorCorrRel.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: []
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.avgA0Err.name}: ${analysisParams.avgA0Err.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [ 
          new TextRun({
            text: `${analysisParams.avgA1Err.name}: ${analysisParams.avgA1Err.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.tA0.name}: ${analysisParams.tA0.value} - ${analysisParams.tA0Check.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.tA1.name}: ${analysisParams.tA1.value} - ${analysisParams.tA1Check.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: []
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.fisherCrit.name}: ${analysisParams.fisherCrit.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.fTableValLvl.name} (${analysisParams.fTableValLvlSelectVal.value}): ${analysisParams.fTableValLvl.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      }),
      new Paragraph(
      {
        children: [
          new TextRun({
            text: `${analysisParams.fTableValLvlCheck.value}\n`,
            size: WORD_FONT_SIZE
          })
        ]
      })
    ];

    return paragraphs;
  }

  async saveFile(doc: Document, 
                filename: string = FILENAME, 
                extension: string = WordPdfExtEnum.DOCX) 
  {
    const mimeType = extension === WordPdfExtEnum.PDF 
                              ? MimeTypeEnum.PDF 
                              : MimeTypeEnum.WORD;
    
    const blob = await Packer.toBlob(doc);
    const data = blob.slice(0, blob.size, mimeType);

    saveAs(data, `${filename}-${new Date().valueOf()}.${extension}`);

    // Packer.toBlob(doc).then(blob => 
    // {
    //   const mimeType = extension === WordPdfExtEnum.PDF 
    //                     ? MimeTypeEnum.PDF 
    //                     : MimeTypeEnum.WORD;
                        
    //   // const pdf = 
    //   const data = blob.slice(0, blob.size, mimeType);

    //   // const data = new Blob([data], { type: 'application/pdf' });  saveAs(blob, 'filename');

    //   saveAs(data, `${filename}-${new Date().valueOf()}.${extension}`);
    // });
  }
}
