
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    BreadcrumbComponent
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  liquidacionForm!: FormGroup;
  finiquitoForm!: FormGroup;
  vacacionesForm!: FormGroup;
  interesesForm!: FormGroup;
  contratoForm!: FormGroup;

  // Resultados
  liquidacionResult: any = {};
  finiquitoResult: any = {};
  vacacionesResult: any = {};
  interesesResult: any = {};
  contratoResult: any = {};

  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.setupFormSubscriptions();
  }

  initializeForms(): void {
    // Formulario de Liquidación
    this.liquidacionForm = this.fb.group({
      sdi: [0, [Validators.required, Validators.min(0)]],
      sueldoDiario: [0, [Validators.required, Validators.min(0)]],
      anosTrabajados: [0, [Validators.required, Validators.min(0)]],
      diasTrabajados: [0, [Validators.required, Validators.min(0), Validators.max(365)]]
    });

    // Formulario de Finiquito
    this.finiquitoForm = this.fb.group({
      sueldoDiario: [0, [Validators.required, Validators.min(0)]],
      diasTrabajados: [0, [Validators.required, Validators.min(0), Validators.max(365)]],
      diasVacaciones: [12, [Validators.required, Validators.min(0)]]
    });

    // Formulario de Vacaciones y Aguinaldo
    this.vacacionesForm = this.fb.group({
      sueldoDiario: [0, [Validators.required, Validators.min(0)]],
      diasTrabajados: [0, [Validators.required, Validators.min(0), Validators.max(365)]],
      diasVacaciones: [12, [Validators.required, Validators.min(0)]]
    });

    // Formulario de Intereses Moratorios
    this.interesesForm = this.fb.group({
      monto: [0, [Validators.required, Validators.min(0)]],
      tasa: [6, [Validators.required, Validators.min(0), Validators.max(100)]],
      fechaInicio: [new Date(), Validators.required],
      fechaFin: [new Date(), Validators.required]
    });

    // Formulario de Vencimiento de Contrato
    this.contratoForm = this.fb.group({
      fechaFirma: [new Date(), Validators.required],
      plazoMeses: [12, [Validators.required, Validators.min(1)]]
    });
  }

  setupFormSubscriptions(): void {
    // Suscripciones para cálculos en tiempo real
    this.liquidacionForm.valueChanges.subscribe(() => {
      this.calculateLiquidacion();
    });

    this.finiquitoForm.valueChanges.subscribe(() => {
      this.calculateFiniquito();
    });

    this.vacacionesForm.valueChanges.subscribe(() => {
      this.calculateVacaciones();
    });

    this.interesesForm.valueChanges.subscribe(() => {
      this.calculateIntereses();
    });

    this.contratoForm.valueChanges.subscribe(() => {
      this.calculateContrato();
    });
  }

  calculateLiquidacion(): void {
    if (this.liquidacionForm.valid) {
      const { sdi, sueldoDiario, anosTrabajados, diasTrabajados } = this.liquidacionForm.value;
      
      // Cálculos según la LFT
      const tresMesesSalario = sdi * 90;
      const veinteDiasPorAno = sdi * 20 * anosTrabajados;
      const primaAntiguedad = sueldoDiario * 12 * anosTrabajados;
      const aguinaldoProporcional = (15 * diasTrabajados / 365) * sueldoDiario;
      const vacacionesProporcionales = (12 * diasTrabajados / 365) * sueldoDiario;
      const primaVacacional = vacacionesProporcionales * 0.25;

      this.liquidacionResult = {
        tresMesesSalario,
        veinteDiasPorAno,
        primaAntiguedad,
        aguinaldoProporcional,
        vacacionesProporcionales,
        primaVacacional,
        total: tresMesesSalario + veinteDiasPorAno + primaAntiguedad + 
               aguinaldoProporcional + vacacionesProporcionales + primaVacacional
      };
    }
  }

  calculateFiniquito(): void {
    if (this.finiquitoForm.valid) {
      const { sueldoDiario, diasTrabajados, diasVacaciones } = this.finiquitoForm.value;
      
      const diasPendientes = sueldoDiario * diasTrabajados;
      const aguinaldoProporcional = (15 * diasTrabajados / 365) * sueldoDiario;
      const vacacionesProporcionales = (diasVacaciones * diasTrabajados / 365) * sueldoDiario;
      const primaVacacional = vacacionesProporcionales * 0.25;

      this.finiquitoResult = {
        diasPendientes,
        aguinaldoProporcional,
        vacacionesProporcionales,
        primaVacacional,
        total: diasPendientes + aguinaldoProporcional + vacacionesProporcionales + primaVacacional
      };
    }
  }

  calculateVacaciones(): void {
    if (this.vacacionesForm.valid) {
      const { sueldoDiario, diasTrabajados, diasVacaciones } = this.vacacionesForm.value;
      
      const aguinaldoProporcional = (15 * diasTrabajados / 365) * sueldoDiario;
      const vacacionesProporcionales = (diasVacaciones * diasTrabajados / 365) * sueldoDiario;
      const primaVacacional = vacacionesProporcionales * 0.25;

      this.vacacionesResult = {
        aguinaldoProporcional,
        vacacionesProporcionales,
        primaVacacional,
        total: aguinaldoProporcional + vacacionesProporcionales + primaVacacional
      };
    }
  }

  calculateIntereses(): void {
    if (this.interesesForm.valid) {
      const { monto, tasa, fechaInicio, fechaFin } = this.interesesForm.value;
      
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);
      const diasTranscurridos = Math.abs(fechaFinDate.getTime() - fechaInicioDate.getTime()) / (1000 * 60 * 60 * 24);
      
      const interesesMoratorios = monto * (tasa / 100) * (diasTranscurridos / 365);
      const montoTotal = monto + interesesMoratorios;

      this.interesesResult = {
        diasTranscurridos: Math.round(diasTranscurridos),
        interesesMoratorios,
        montoTotal,
        tasaDiaria: tasa / 365
      };
    }
  }

  calculateContrato(): void {
    if (this.contratoForm.valid) {
      const { fechaFirma, plazoMeses } = this.contratoForm.value;
      
      const fechaFirmaDate = new Date(fechaFirma);
      const fechaVencimiento = new Date(fechaFirmaDate);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + plazoMeses);
      
      const fechaAvisoPrevio = new Date(fechaVencimiento);
      fechaAvisoPrevio.setMonth(fechaAvisoPrevio.getMonth() - 1);

      this.contratoResult = {
        fechaVencimiento,
        fechaAvisoPrevio,
        diasRestantes: Math.ceil((fechaVencimiento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      };
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-MX').format(date);
  }

  clearForm(formName: string): void {
    switch (formName) {
      case 'liquidacion':
        this.liquidacionForm.reset();
        this.liquidacionResult = {};
        break;
      case 'finiquito':
        this.finiquitoForm.reset();
        this.finiquitoResult = {};
        break;
      case 'vacaciones':
        this.vacacionesForm.reset();
        this.vacacionesResult = {};
        break;
      case 'intereses':
        this.interesesForm.reset();
        this.interesesResult = {};
        break;
      case 'contrato':
        this.contratoForm.reset();
        this.contratoResult = {};
        break;
    }
  }
}
