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
        console.log('Summary data received:', data);
        this.summary = data;
        this.isLoadingSummary = false;
      },
      error: (error) => {
        console.error('Error loading summary:', error);
        this.summary = null;
        this.isLoadingSummary = false;
      }
    });

    // Load type distribution
    this.dashboardService.getTypeDistribution().subscribe({
      next: (data) => {
        // Validar y filtrar datos válidos
        if (Array.isArray(data)) {
          this.typeDistribution = data.filter(item => 
            item && 
            typeof item === 'object' && 
            item.tipo && 
            typeof item.cantidad === 'number' &&
            !isNaN(item.cantidad)
          );
        } else {
          this.typeDistribution = [];
        }
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
        // Validar y filtrar datos válidos
        if (Array.isArray(data)) {
          this.documentsPerMonth = data.filter(item => 
            item && 
            typeof item === 'object' && 
            item.mes && 
            typeof item.cantidad === 'number' &&
            !isNaN(item.cantidad)
          );
        } else {
          this.documentsPerMonth = [];
        }
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
        console.log('System status data received:', data);
        this.systemStatus = data;
        this.isLoadingStatus = false;
      },
      error: (error) => {
        console.error('Error loading system status:', error);
        this.systemStatus = null;
        this.isLoadingStatus = false;
      }
    });
  }

  private initializeBarChart(): void {
    // Validación exhaustiva de datos
    const isValidData = this.documentsPerMonth && 
                       Array.isArray(this.documentsPerMonth) && 
                       this.documentsPerMonth.length > 0 &&
                       this.documentsPerMonth.every(item => 
                         item && 
                         typeof item === 'object' && 
                         item.mes && 
                         typeof item.cantidad === 'number'
                       );

    const categories = isValidData
      ? this.documentsPerMonth.map(item => item.mes || 'Sin datos') 
      : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    
    const data = isValidData
      ? this.documentsPerMonth.map(item => item.cantidad || 0)
      : [0, 0, 0, 0, 0, 0];

    // Asegurar que todos los valores sean números válidos
    const safeData = data.map(value => 
      (typeof value === 'number' && !isNaN(value) && isFinite(value)) ? value : 0
    );

    this.barChartOptions = {
      series: [
        {
          name: 'Documentos',
          data: safeData
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false // Deshabilitar animaciones para evitar errores
        }
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
    // Validación exhaustiva de datos para pie chart
    const isValidTypeData = this.typeDistribution && 
                           Array.isArray(this.typeDistribution) && 
                           this.typeDistribution.length > 0 &&
                           this.typeDistribution.every(item => 
                             item && 
                             typeof item === 'object' && 
                             item.tipo && 
                             typeof item.cantidad === 'number'
                           );

    const series = isValidTypeData
      ? this.typeDistribution.map(item => item.cantidad || 0)
      : [33, 33, 34]; // Valores por defecto balanceados
    
    const labels = isValidTypeData
      ? this.typeDistribution.map(item => item.tipo || 'Sin tipo')
      : ['Contratos', 'Documentos', 'Otros'];

    // Asegurar que todas las series sean números válidos y positivos
    const safeSeries = series.map(value => {
      const numValue = (typeof value === 'number' && !isNaN(value) && isFinite(value) && value >= 0) ? value : 0;
      return numValue;
    });

    // Si todos los valores son 0, usar valores por defecto
    const totalSum = safeSeries.reduce((sum, val) => sum + val, 0);
    const finalSeries = totalSum > 0 ? safeSeries : [33, 33, 34];
    const finalLabels = totalSum > 0 ? labels : ['Contratos', 'Documentos', 'Otros'];

    this.pieChartOptions = {
      series2: finalSeries,
      chart: {
        type: 'donut',
        width: 380,
        animations: {
          enabled: false // Deshabilitar animaciones para evitar errores
        }
      },
      labels: finalLabels,
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

  // Método helper para validar datos antes de pasarlos a los gráficos
  private validateChartData(data: any): boolean {
    return data && 
           typeof data === 'object' && 
           data.series && 
           Array.isArray(data.series) && 
           data.series.length > 0 &&
           data.series.every((serie: any) => 
             serie && 
             serie.data && 
             Array.isArray(serie.data) &&
             serie.data.every((value: any) => 
               typeof value === 'number' && 
               !isNaN(value) && 
               isFinite(value)
             )
           );
  }

  // Método para limpiar y validar datos númericos
  private sanitizeNumericValue(value: any, defaultValue: number = 0): number {
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      return value;
    }
    return defaultValue;
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