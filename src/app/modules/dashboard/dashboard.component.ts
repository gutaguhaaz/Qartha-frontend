
import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTooltip, ApexYAxis, ApexPlotOptions, ApexStroke, ApexLegend, ApexFill, ApexMarkers, ApexGrid, ApexTitleSubtitle, ApexResponsive, ApexNonAxisChartSeries } from 'ng-apexcharts';
import { DashboardService, DashboardSummary, TypeCount, MonthCount, SystemStatus } from './dashboard.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  series2: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  labels: string[];
  markers: ApexMarkers;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public barChartOptions!: Partial<ChartOptions>;
  public pieChartOptions!: Partial<ChartOptions>;
  
  // Dashboard data
  summary: DashboardSummary | null = null;
  typeDistribution: TypeCount[] = [];
  documentsPerMonth: MonthCount[] = [];
  systemStatus: SystemStatus | null = null;
  
  // Loading states
  isLoadingSummary = true;
  isLoadingCharts = true;
  isLoadingStatus = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load summary data
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.isLoadingSummary = false;
      },
      error: (error) => {
        console.error('Error loading summary:', error);
        this.isLoadingSummary = false;
      }
    });

    // Load type distribution
    this.dashboardService.getTypeDistribution().subscribe({
      next: (data) => {
        this.typeDistribution = data;
        this.initializePieChart();
      },
      error: (error) => {
        console.error('Error loading type distribution:', error);
        this.isLoadingCharts = false;
      }
    });

    // Load documents per month
    this.dashboardService.getDocumentsPerMonth().subscribe({
      next: (data) => {
        this.documentsPerMonth = data;
        this.initializeBarChart();
      },
      error: (error) => {
        console.error('Error loading documents per month:', error);
        this.isLoadingCharts = false;
      }
    });

    // Load system status
    this.dashboardService.getSystemStatus().subscribe({
      next: (data) => {
        this.systemStatus = data;
        this.isLoadingStatus = false;
      },
      error: (error) => {
        console.error('Error loading system status:', error);
        this.isLoadingStatus = false;
      }
    });
  }

  private initializeBarChart(): void {
    this.barChartOptions = {
      series: [
        {
          name: 'Documentos',
          data: this.documentsPerMonth.map(item => item.cantidad)
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: this.documentsPerMonth.map(item => item.mes),
      },
      yaxis: {
        title: {
          text: 'Cantidad de Documentos'
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      fill: {
        opacity: 0.8,
        colors: ['#4FC3F7'],
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
    this.isLoadingCharts = false;
  }

  private initializePieChart(): void {
    this.pieChartOptions = {
      series2: this.typeDistribution.map(item => item.cantidad),
      chart: {
        type: 'donut',
        width: 380,
      },
      labels: this.typeDistribution.map(item => item.tipo),
      colors: ['#4FC3F7', '#7460EE', '#F6A025', '#9BC311', '#E82742'],
      legend: {
        show: true,
        position: 'bottom',
      },
      dataLabels: {
        enabled: true,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
    };
  }

  getStatusColor(status: boolean): string {
    return status ? 'green' : 'red';
  }

  getStatusText(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }
}
