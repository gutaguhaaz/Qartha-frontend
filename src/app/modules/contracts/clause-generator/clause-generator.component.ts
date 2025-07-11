
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ContractsService } from '../services/contracts.service';
import { GPTClauseResponse } from '../models/contract.models';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-clause-generator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
    BreadcrumbComponent,
    TranslateModule
  ],
  templateUrl: './clause-generator.component.html',
  styleUrls: ['./clause-generator.component.scss']
})
export class ClauseGeneratorComponent {
  clauseForm: FormGroup;
  generatedClause: GPTClauseResponse | null = null;
  isGenerating = false;
  generatedClauses: GPTClauseResponse[] = [];

  // Breadcrumb
  breadscrums = [
    {
      title: 'Contratos',
      items: ['Contratos'],
      active: 'Generar Cláusulas',
    },
  ];

  // Sugerencias de prompts
  promptSuggestions = [
    'Generar cláusula de confidencialidad para contrato de servicios',
    'Crear cláusula de responsabilidad civil para contrato de trabajo',
    'Redactar cláusula de terminación anticipada',
    'Generar cláusula de penalización por incumplimiento',
    'Crear cláusula de propiedad intelectual',
    'Redactar cláusula de resolución de conflictos'
  ];

  constructor(
    private fb: FormBuilder,
    private contractsService: ContractsService,
    private snackBar: MatSnackBar
  ) {
    this.clauseForm = this.fb.group({
      prompt: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  generateClause(): void {
    if (this.clauseForm.invalid) {
      this.snackBar.open('Por favor ingrese un prompt válido (mínimo 10 caracteres)', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isGenerating = true;
    const prompt = this.clauseForm.get('prompt')?.value;

    this.contractsService.generateClause(prompt).subscribe({
      next: (response) => {
        this.generatedClause = response;
        this.generatedClauses.unshift(response);
        this.snackBar.open('Cláusula generada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.isGenerating = false;
      },
      error: (error) => {
        console.error('Error generating clause:', error);
        this.snackBar.open('Error al generar la cláusula', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isGenerating = false;
      }
    });
  }

  usePromptSuggestion(suggestion: string): void {
    this.clauseForm.patchValue({ prompt: suggestion });
  }

  insertClause(clause: GPTClauseResponse): void {
    // Copiar al clipboard
    navigator.clipboard.writeText(clause.clause).then(() => {
      this.snackBar.open('Cláusula copiada al portapapeles', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }).catch(() => {
      this.snackBar.open('Error al copiar la cláusula', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  }

  clearForm(): void {
    this.clauseForm.reset();
    this.generatedClause = null;
    this.snackBar.open('Formulario limpiado', 'Cerrar', {
      duration: 2000
    });
  }

  clearHistory(): void {
    this.generatedClauses = [];
    this.generatedClause = null;
    this.snackBar.open('Historial limpiado', 'Cerrar', {
      duration: 2000
    });
  }
}
