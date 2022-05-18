import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { interval, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataTableService } from '../../services/data-table.service';
import { IColumnSchemaElement } from '../../interfaces/column-schema-element.interface';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ITableData } from 'src/app/shared/interfaces/table-data.interface';
import { INITIAL_TABLE_DATA, READ_FILE_TIMOUT, WRITE_FILE_TIMOUT } from 'src/app/shared/constants/constants';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { ICheckTableType } from '../../interfaces/check-table-type.interface';
import { UseOnTableDto } from '../../dto/use-on-table-type.dto';
import { FileDataReadService } from 'src/app/shared/services/file-data/read/file-data-read.service';
import { FileDataWriteCalcService } from 'src/app/shared/services/file-data/write-calc/file-data-write-calc.service';
import { FileDataWriteRangService } from 'src/app/shared/services/file-data/write-rang/file-data-write-rang.service';
import { WriteAnalysisService } from 'src/app/shared/services/file-data/write-analysis/write-analysis.service';
import { AnalysisService } from 'src/app/shared/services/analysis/analysis.service';
import { TableTypeEnum } from '../../enums/table-type.enum';
// import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';


@Component(
{
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy, AfterViewInit  
{
  constructor(private readonly dataTableService: DataTableService, 
              private readonly fileDataReadService: FileDataReadService,
              private readonly fileDataWriteCalcService: FileDataWriteCalcService,
              private readonly fileDataWriteRangService: FileDataWriteRangService,
              private readonly writeAnalysisDataService: WriteAnalysisService,
              private readonly analysisService: AnalysisService,
              private readonly utilsService: UtilsService,
              public dialog: MatDialog) { }

  @Input()
  columnsSchema: Array<IColumnSchemaElement> = [];

  @Input()
  tableData: ITableData<any> = {...INITIAL_TABLE_DATA};

  @Input()
  tableType: TableTypeEnum = TableTypeEnum.INPUT_TABLE_TYPE;

  @Input()
  isPageble: boolean = false;

  @Input()
  withToolbar: boolean = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild('table')
  table!: MatTable<any[]>;

  isEditable: boolean = false;

  displayedColumns: string[] = []; //this.columnsSchema.map((col) => col.key);

  dataSource: MatTableDataSource<Array<any>> = new MatTableDataSource();

  updateInterval: any;

  subs?: Subscription;
  

  ngOnInit(): void 
  {
    // this.createTable();
    // this.updateInterval = setInterval(()=>{ this.createTable(); }, 1000);

    // setTimeout(() => this.createTable(), 1000);
    
    this.subscribeOn();
  }

  ngAfterViewInit() 
  {
    if (this.isPageble) this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void
  {
    this.subs?.unsubscribe();
  }

  private subscribeOn()
  {
    this.useOnTableType(
    {
      onInput: () => 
      { 
        this.subs = this.fileDataReadService.getReadFileData().subscribe(
        {
          next: () => 
          { 
            setTimeout(() => this.createTable(), READ_FILE_TIMOUT);
          }
        }); 
      },
      onOutputCalc: () => 
      { 
        this.subs = this.fileDataWriteCalcService.getWriteCalcFileData().subscribe(
        {
          next: () =>
          {
            setTimeout(() => this.createTable(), WRITE_FILE_TIMOUT);
          }
        });
      },
      onOutputRang: () => 
      { 
        this.subs = this.fileDataWriteRangService.getWriteRangFileData().subscribe(
        {
          next: () => 
          {
            setTimeout(() => this.createTable(), WRITE_FILE_TIMOUT);
          }
        });
      },
      onOutputExtCalc: () =>
      {
        this.subs = this.writeAnalysisDataService.getWriteAnalysisData().subscribe(
        {
          next: () =>
          {
            setTimeout(() => this.createTable(), WRITE_FILE_TIMOUT);
          }
        });
      }
    });
  }

  private useOnTableType({ onInput, onOutputCalc, onOutputRang, onOutputExtCalc }: UseOnTableDto)
  {
    switch (this.tableType) 
    {
      case TableTypeEnum.INPUT_TABLE_TYPE:
      {        
        if (onInput) onInput();
        break;
      }
      case TableTypeEnum.OUTPUT_CALC_TABLE_TYPE:
      {
        if (onOutputCalc) onOutputCalc();
        break;
      }
      case TableTypeEnum.OUTPUT_RANG_TABLE_TYPE:
      {
        if (onOutputRang) onOutputRang();
        break;
      }
      case TableTypeEnum.OUTPUT_EXT_CALC_TABLE_TYPE:
      {
        if (onOutputExtCalc) onOutputExtCalc();
        break;
      }
      default:
      {
        break;
      }
    }
  }

  private createTable() 
  {
    this.dataSource = new MatTableDataSource(this.tableData.data);

    // console.log(this.tableData.data)
    // console.log(this.data);

    if (this.tableData.header.length === 0 && this.tableData.data[0]) 
    {
      this.tableData.header = this.utilsService.makeHeaderFromObj(this.tableData.data[0]);
    }

    // if (this.columnsSchema.length === 0)
    // {
    this.columnsSchema = this.dataTableService.generateColumnSchema(this.tableData.header , this.tableData.data /*this.tableData.header*/);
    this.displayedColumns = this.columnsSchema.map((col) => col.key);
    // }

    if (this.isPageble) this.dataSource.paginator = this.paginator;

    // console.log(this.columnsSchema)
    // console.log(this.displayedColumns)
  }

  applyFilter($event: Event) 
  {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editData()
  {
    // console.log(($event.target as HTMLInputElement).value)
    // const data: any[] = [...this.dataSource.data];

    const data: any[] = this.dataTableService.extractData([...this.dataSource.data]);
    const tableData: ITableData<any> = { data, header: this.tableData.header} 

    this.useOnTableType(
    {
      onInput: () => { this.fileDataReadService.setReadFileData<any>({ tableData }); },
      // onOutputCalc: () => { this.fileDataWriteCalcService.setWriteCalcFileData<any>({ tableData }); },
      // onOutputRang: () => { this.fileDataWriteRangService.setWriteRangFileData<any>({ tableData }); },
      // onOutputExtCalc: () => 
      // {
      //   // const analysisData = this.analysisService.getAnalysisData();
      //   // this.writeAnalysisDataService.setWriteAnalysisData<any>() 
      // }
    });

    // console.log(this.data);
  }

  // confirmChanges()
  // {
  //   this.isEditable = !this.isEditable;
  //   this.editData();

  //   console.log(this.data);
  // }

  // cancelChanges()
  // {
  //   this.createTable();

  //   console.log(this.data);
  // }

  addRow() 
  {
    let newRow: any = {};
    let currData: any[] = [...this.dataSource.data];

    const keys = Object.keys(this.tableData.data[0]);

    for (let i = 0; i < keys.length; i++)
    {
      if (i === 0) newRow[keys[i]] = 1;
      else newRow[keys[i]] = 0;
    }

    for (let i = 0; i < currData.length; i++) currData[i][keys[0]]++;

    this.dataSource.data = [newRow, ...currData];
    this.editData();
  }

  // removeRow(id) 
  // {
  //   this.dataSource = this.dataSource.filter((u) => u.id !== id);
  // }

  // dropTable($event: CdkDragDrop<any[]>) 
  // {
  //   const prevIndex = this.dataSource.data.findIndex((d) => d === $event.item.data);
  //   moveItemInArray(this.dataSource.data, prevIndex, $event.currentIndex);
  //   this.table.renderRows();
  // }

  removeSelectedRows() 
  {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => 
      {
        if (confirm) 
        {
          this.dataSource.data = this.dataSource.data.filter((row: any) => !row.isSelected);
          this.editData();
        }
      });
  }
}
