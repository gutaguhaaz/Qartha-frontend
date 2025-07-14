import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { DashboardService, DashboardSummary, TypeCount, MonthCount, SystemStatus } from './dashboard.service';

export type ChartOptions = {
  series?: any[];
  series2?: any[];
  chart?: any;
  xaxis?: any;
  yaxis?: any;
  plotOptions?: any;
  dataLabels?: any;
  grid?: any;
  fill?: any;
  tooltip?: any;
  colors?: string[];
  labels?: string[];
  legend?: any;
  responsive?: any[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    NgApexchartsModule
  ]
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  systemStatus: SystemStatus | null = null;
  barChartOptions: Partial<ChartOptions> = {};
  pieChartOptions: Partial<ChartOptions> = {};

  isLoadingSummary = true;
  isLoadingCharts = true;
  isLoadingStatus = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadSummary();
    this.loadCharts();
    this.loadSystemStatus();
  }

  private loadSummary(): void {
    this.isLoadingSummary = true;
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
  }

  private loadCharts(): void {
    this.isLoadingCharts = true;

    // Load documents per month chart
    this.dashboardService.getDocumentsPerMonth().subscribe({
      next: (data) => {
        this.initializeBarChart(data);
      },
      error: (error) => {
        console.error('Error loading documents per month:', error);
        this.isLoadingCharts = false;
      }
    });

    // Load type distribution chart
    this.dashboardService.getTypeDistribution().subscribe({
      next: (data) => {
        this.initializePieChart(data);
        this.isLoadingCharts = false;
      },
      error: (error) => {
        console.error('Error loading type distribution:', error);
        this.isLoadingCharts = false;
      }
    });
  }

  private loadSystemStatus(): void {
    this.isLoadingStatus = true;
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

  private initializeBarChart(data: MonthCount[]): void {
    this.barChartOptions = {
      series: [{
        name: 'Documentos',
        data: data.map(item => item.cantidad)
      }],
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#9aa0ac',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: data.map(item => item.mes),
        title: {
          text: 'Mes'
        }
      },
      yaxis: {
        title: {
          text: 'Cantidad de Documentos'
        }
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1
      },
      fill: {
        opacity: 0.8,
        colors: ['#4FC3F7']
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val: number) {
            return val + ' documentos';
          }
        }
      }
    };
  }

  private initializePieChart(data: TypeCount[]): void {
    this.pieChartOptions = {
      series2: data.map(item => item.cantidad),
      chart: {
        type: 'donut',
        height: 350
      },
      labels: data.map(item => item.tipo),
      colors: ['#4FC3F7', '#7460EE', '#E82742', '#2F3149', '#929DB0'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center'
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return Math.round(val) + '%';
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }

  getStatusColor(status: boolean): string {
    return status ? '#4caf50' : '#f44336';
  }

  getStatusText(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }
}