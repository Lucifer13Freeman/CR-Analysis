import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FUNC_TYPE_VALUES, INITIAL_ANALYSIS_DATA, INITIAL_CHART_DATA, INITIAL_GET_ANALYSIS_DATA, LOADING_TIMEOUT, WRITE_FILE_TIMOUT } from 'src/app/shared/constants/constants';
import { ChartDataDto } from 'src/app/shared/dto/chart-data.dto';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { AnalysisDataDto } from 'src/app/shared/dto/analysis-data.dto';
import { WriteAnalysisDataService } from 'src/app/shared/services/file-data/write-analysis/write-analysis.service';
import { DownloadButtonLabelsEnum, 
        FullFileDataHeaderEnum, 
        FuncTypeEnum, 
        ImageExtEnum } from 'src/app/shared/enums/enums';
import { IFuncTypeValues } from '../../shared/interfaces/func-type-values.interface';
import { AnalysisService } from 'src/app/shared/services/analysis/analysis.service';
import { GetAnalysisDataDto } from 'src/app/shared/dto/get-analysis-data.dto';
import { ImageService } from 'src/app/shared/services/image/image.service';
import { FileDataWriteImageService } from 'src/app/shared/services/file-data/write-image/file-data-write-image.service';


@Component(
{
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnDestroy
{
  constructor(private readonly analysisService: AnalysisService, 
              private readonly writeAnalysisDataService: WriteAnalysisDataService,
              private readonly fileDataWriteImageService: FileDataWriteImageService,
              private readonly imageService: ImageService) { }

  @ViewChild('chart')
  private chartRef!: ElementRef;

  private chart?: Chart;

  title: FullFileDataHeaderEnum = FullFileDataHeaderEnum.CHART_DATA;
  downloadButtonLabels = DownloadButtonLabelsEnum;

  @Input()
  chartData: ChartDataDto = {...INITIAL_CHART_DATA};

  @Input()
  analysisData: AnalysisDataDto<any> = {...INITIAL_ANALYSIS_DATA};

  @Input()
  getAanalysisData: GetAnalysisDataDto<any> = INITIAL_GET_ANALYSIS_DATA;

  subs?: Subscription;

  selectedFuncType: FuncTypeEnum = this.chartData.funcType;

  funcTypeValues: IFuncTypeValues[] = FUNC_TYPE_VALUES;

  pngExt: ImageExtEnum = ImageExtEnum.PNG;
  jpgExt: ImageExtEnum = ImageExtEnum.JPG;

  isLoading: boolean = false;

  ngOnInit(): void 
  {
    this.getAnalysisData();
  }

  ngOnDestroy(): void
  {
    this.chart?.destroy();
    this.subs?.unsubscribe();
  }

  // ngAfterViewInit() {}

  downloadImage(extension: ImageExtEnum = ImageExtEnum.PNG)
  {
    const canvasElement: HTMLCanvasElement = this.chartRef.nativeElement;
    this.imageService.writeCanvasImage({ canvasElement, extension });
  }

  selectFuncType()
  {
    this.getAanalysisData = {
      ...this.getAanalysisData,
      funcType: this.selectedFuncType
    }

    const analysisData = this.analysisService.getAnalysisData(this.getAanalysisData);

    this.chart?.destroy();

    this.isLoading = true;

    setTimeout(() => 
    {
      this.writeAnalysisDataService.setWriteAnalysisData(analysisData);
      this.isLoading = false;
    }, LOADING_TIMEOUT);
  }

  getAnalysisData()
  {
    this.subs = this.writeAnalysisDataService.getWriteAnalysisData().subscribe(
    {
      next: () =>
      {
        setTimeout(() => this.setAnalysisData(), WRITE_FILE_TIMOUT);
      }
    });
  }

  setAnalysisData()
  {
    this.chart?.destroy();

    this.selectedFuncType = this.chartData.funcType;

    const data: any = 
    {
      labels: [
        "X",
        "Y"
      ],
      datasets: [
        { 
          type: 'line',
          label: '???????????????????????????? X ?? Y',
          data: this.chartData.resChartData,
          borderColor: "#8e5ea2",
          // backgroundColor: [
          //   "#1fc8f8",
          //   "#76a346"
          // ]
          // fill: true,
          // borderRadius: 15,
        }, 
        { 
          type: 'scatter',
          label: '?????????????? X ?? Y',
          data: this.chartData.stdChartData,
          borderColor: "#3e95cd"
        }, 
      ]
    };

    this.chart = new Chart(this.chartRef.nativeElement, 
    {
      type: 'line',
      data,
      options: {
        // cutoutPercentage: 50,
        elements: {
          line: {
            borderJoinStyle: 'round'
          }
        },
        animation: {
          delay: 1
          // animateScale: true,
          // animateRotate: true
        },
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'X'
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Y'
            }
          },
          // xAxes: [{
          //   type: 'linear',

          // }],
        }
      }
    });

    this.chart.update();

    this.fileDataWriteImageService.setWriteImageFileData({ canvasElement: this.chartRef.nativeElement });
  }
}
