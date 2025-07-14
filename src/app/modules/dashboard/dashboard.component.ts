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
    this.initializeChartData();
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
        this.typeDistribution = data || [];
        this.initializePieChart();
      },
      error: (error) => {
        console.error('Error loading type distribution:', error);
        this.typeDistribution = [];
        this.initializePieChart();
      }
    });

    // Load documents per month
    this.dashboardService.getDocumentsPerMonth().subscribe({
      next: (data) => {
        this.documentsPerMonth = data || [];
        this.initializeBarChart();
      },
      error: (error) => {
        console.error('Error loading documents per month:', error);
        this.documentsPerMonth = [];
        this.initializeBarChart();
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
    const categories = this.documentsPerMonth && this.documentsPerMonth.length > 0 
      ? this.documentsPerMonth.map(item => item.mes) 
      : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    
    const data = this.documentsPerMonth && this.documentsPerMonth.length > 0
      ? this.documentsPerMonth.map(item => item.cantidad)
      : [0, 0, 0, 0, 0, 0];

    this.barChartOptions = {
      series: [
        {
          name: 'Documentos',
          data: data
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
        categories: categories,
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Cantidad de Documentos',
          style: {
            color: '#9aa0ac',
          },
        },
        labels: {
          style: {
            colors: '#9aa0ac',
          },
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
    const series = this.typeDistribution && this.typeDistribution.length > 0
      ? this.typeDistribution.map(item => item.cantidad)
      : [1, 1, 1];
    
    const labels = this.typeDistribution && this.typeDistribution.length > 0
      ? this.typeDistribution.map(item => item.tipo)
      : ['Contratos', 'Documentos', 'Otros'];

    this.pieChartOptions = {
      series2: series,
      chart: {
        type: 'donut',
        width: 380,
      },
      labels: labels,
      colors: ['#4FC3F7', '#7460EE', '#F6A025', '#9BC311', '#E82742'],
      legend: {
        show: true,
        position: 'bottom',
        labels: {
          colors: '#9aa0ac',
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#fff']
        }
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

  private initializeChartData(): void {
    // Inicializar con datos vacíos seguros
    this.barChartOptions = {
      series: [{
        name: 'Documentos',
        data: [0, 0, 0, 0, 0, 0]
      }],
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#9aa0ac',
        toolbar: { show: false },
        animations: {
          enabled: false
        }
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      },
      yaxis: {
        title: { 
          text: 'Cantidad',
          style: {
            color: '#9aa0ac',
          },
        },
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      },
      dataLabels: { enabled: false },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1
      },
      fill: {
        colors: ['#4FC3F7']
      },
      tooltip: {
        theme: 'dark'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%'
        }
      }
    };

    this.pieChartOptions = {
      series2: [33, 33, 34],
      chart: {
        type: 'donut',
        width: 380,
        animations: {
          enabled: false
        }
      },
      labels: ['Contratos', 'Documentos', 'Otros'],
      colors: ['#4FC3F7', '#7460EE', '#F6A025'],
      legend: {
        position: 'bottom',
        labels: {
          colors: '#9aa0ac',
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#fff']
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          }
        }
      }]
    };
  }
}