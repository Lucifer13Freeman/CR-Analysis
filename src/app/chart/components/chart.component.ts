import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { INITIAL_ANALYSIS_DATA, INITIAL_CHART_DATA, INITIAL_GET_ANALYSIS_DATA, WRITE_FILE_TIMOUT } from 'src/app/shared/constants/constants';
import { ChartDataDto } from 'src/app/shared/dto/chart-data.dto';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { AnalysisDataDto } from 'src/app/shared/dto/analysis-data.dto';
import { WriteAnalysisService } from 'src/app/shared/services/file-data/write-analysis/write-analysis.service';
import { FuncTypeViewValuesEnum } from '../enums/func-type-view-values.enum';
import { FuncTypeEnum, ImageExtEnum } from 'src/app/shared/enums/enums';
import { IFuncTypeValues } from '../interfaces/func-type-values.interface';
import { AnalysisService } from 'src/app/shared/services/analysis/analysis.service';
import { GetAnalysisDataDto } from 'src/app/shared/dto/get-analysis-data.dto';
import { ImageService } from 'src/app/shared/services/image/image.service';


@Component(
{
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy
{
  constructor(private readonly analysisService: AnalysisService, 
              private readonly writeAnalysisDataService: WriteAnalysisService,
              private readonly imageService: ImageService) { }

  @ViewChild('chart')
  private chartRef!: ElementRef;

  private chart?: Chart;

  // private data: Point[] = [];

  @Input()
  chartData: ChartDataDto = {...INITIAL_CHART_DATA};

  @Input()
  analysisData: AnalysisDataDto<any> = {...INITIAL_ANALYSIS_DATA};

  @Input()
  getAanalysisData: GetAnalysisDataDto<any> = INITIAL_GET_ANALYSIS_DATA;

  subs?: Subscription;

  selectedFuncType: FuncTypeEnum = this.chartData.funcType;

  funcTypeValues: IFuncTypeValues[] = [
    { value: FuncTypeEnum.LINE, viewValue: FuncTypeViewValuesEnum.LINE },
    { value: FuncTypeEnum.PARABOLA, viewValue: FuncTypeViewValuesEnum.PARABOLA },
    { value: FuncTypeEnum.EXPONENTIAL, viewValue: FuncTypeViewValuesEnum.EXPONENTIAL }
  ]

  pngExt: ImageExtEnum = ImageExtEnum.PNG;
  jpgExt: ImageExtEnum = ImageExtEnum.JPG;

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

    this.writeAnalysisDataService.setWriteAnalysisData(analysisData);
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
    // console.log(this.chartData.resChartData)
    // console.log(this.chartData.stdChartData)

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
          label: 'Результирующие X и Y',
          data: this.chartData.resChartData,
          borderColor: "#8e5ea2",
          // backgroundColor: [
          //   "#1fc8f8",
          //   "#76a346"
          // ]
        }, 
        { 
          type: 'scatter',
          label: 'Входные X и Y',
          data: this.chartData.stdChartData,
          borderColor: "#3e95cd"
        }, 
      ]
      // datasets: [
      // {
      //   data: [{x: 1, y: 5}, {x: 2, y: 10}, {x: 3, y: 6}, {x: 4, y: 2}, {x: 4.1, y: 6}],   // Example data
      //   backgroundColor: [
      //     "#1fc8f8",
      //     "#76a346"
      //   ]
      // }]
    };

    this.chart = new Chart(this.chartRef.nativeElement, 
    {
      type: 'line',
      data,
      options: {
        // cutoutPercentage: 50,
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
  }
}
