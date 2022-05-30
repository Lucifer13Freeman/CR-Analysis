import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { INITIAL_TABLE_DATA, READ_FILE_INTERVAL, READ_FILE_SPEED, READ_FILE_TIMOUT } from 'src/app/shared/constants/constants';
import { AnalysisService } from 'src/app/shared/services/analysis/analysis.service';
import { ExcelService } from 'src/app/shared/services/excel/excel.service';
import { FileDataReadService } from 'src/app/shared/services/file-data/read/file-data-read.service';


// export type FileEventTarget = EventTarget & { files: FileList };

@Component(
{
  selector: 'app-file-dnd',
  templateUrl: './file-dnd.component.html',
  styleUrls: ['./file-dnd.component.scss']
})
export class FileDndComponent implements OnInit 
{
  constructor(private readonly excelService: ExcelService, 
              private readonly fileDataReadService: FileDataReadService,
              private readonly analysisService: AnalysisService) { }

  // @Output()
  files: any[] = [];

  @Input() 
  isDark?: boolean = true;

  @Input() 
  isMultiple?: boolean = false;

  @ViewChild("fileDropRef", { static: false }) 
  fileDropEl!: ElementRef;

  // subs?: Subscription;
  

  ngOnInit(): void 
  { 
    // this.subs = this.fileDataService.readFileDataSubject$.subscribe();
  }

  ngOnDestroy(): void
  {
    // this.subs?.unsubscribe();
  }

  /**
   * on file drop handler
   */
  async onFileDropped($event: any) 
  {
    this.prepareFilesList($event);
    await this.readFile();
  }

  /**
   * handle file from browsing
   */
  async fileBrowseHandler($event: any) 
  {
    this.prepareFilesList($event.target.files);
    await this.readFile();
  }

  async readFile()
  {
    const fileData = await this.excelService.readExcel({ file: this.files[0] });

    if (!fileData) return;

    // const isCorrect = this.analysisService.checkReadFileData(fileData);

    // console.log(fileData)
    
    setTimeout(() => 
    { 
      const isCorrect = fileData ? this.analysisService.checkReadFileData(fileData) : false;

      // console.log(this.analysisService.checkReadFileData(fileData))

      // if (!isCorrect/* && !this.isMultiple && this.files.length > 0*/) this.deleteFile(0);

      if (isCorrect) this.fileDataReadService.setReadFileData<any>(fileData as any);
      // else !this.isMultiple && this.files.length > 0 && this.deleteFile(0);
    }, READ_FILE_TIMOUT);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) 
  {
    if (this.files[index].progress < 100) 
    {
      // console.log("Upload in progress.");
      // console.log("Загрузка файла в процессе");
      alert("Уведомление: загрузка файла в процессе!");
      return;
    }
    
    this.files.splice(index, 1);

    // this.fileDataService.setReadFileData<any>({ tableData: { data: [], header: [] } });
    this.fileDataReadService.clearReadFileData();
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) 
  {
    // setTimeout(() => 
    // {
      if (index === this.files.length) return;
      
      const progressInterval = setInterval(() => 
      {
        if (this.files[index]?.progress === 100) 
        {
          clearInterval(progressInterval);
          this.uploadFilesSimulator(index + 1);
        }
        else 
        {
          let progress = this.files[index]?.progress;
          this.files[index].progress = progress + READ_FILE_SPEED;
        }
      }, READ_FILE_INTERVAL);
    // }, READ_FILE_TIMOUT);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) 
  {
    for (const item of files) 
    {
      if (!this.isMultiple && this.files.length > 0) this.deleteFile(0);

      item.progress = 0;
      this.files.push(item);

      // console.log(files[0])
    }

    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals: number = 2) 
  {
    if (bytes === 0) 
    {
      return "0 Bytes";
    }
    
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
