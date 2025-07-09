
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { DocumentsService } from '../../services/documents.service';

export interface ClauseAnalysisResult {
  label: string;
  confidence: number;
  original_text: string;
}

@Component({
  selector: 'app-analyze-clause',
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
    MatSnackBarModule,
    TranslateModule,
    BreadcrumbComponent,
  ],
  templateUrl: './analyze-clause.component.html',
  styleUrls: ['./analyze-clause.component.scss'],
})
export class AnalyzeClauseComponent implements OnInit {
  analyzeForm: FormGroup;
  isLoading = false;
  analysisResult: ClauseAnalysisResult | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private documentsService: DocumentsService,
    private snackBar: MatSnackBar
  ) {
    this.analyzeForm = this.fb.group({
      clause_text: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Inicialización del componente
  }

  onAnalyze(): void {
    if (this.analyzeForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.error = null;
      this.analysisResult = null;

      const clauseText = this.analyzeForm.get('clause_text')?.value;

      this.documentsService.analyzeClause(clauseText).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.analysisResult = result;
          this.showSnackbar('Análisis completado exitosamente', 'success');
        },
        error: (error) => {
          this.isLoading = false;
          this.error = 'Error al analizar la cláusula. Inténtalo nuevamente.';
          this.showSnackbar('Error al analizar la cláusula', 'error');
          console.error('Error analyzing clause:', error);
        },
      });
    }
  }

  getResultCardClass(): string {
    if (!this.analysisResult) return '';
    return this.analysisResult.label.toLowerCase() === 'riesgosa' ? 'result-card-risk' : 'result-card-neutral';
  }

  getResultIcon(): string {
    if (!this.analysisResult) return '';
    return this.analysisResult.label.toLowerCase() === 'riesgosa' ? 'warning' : 'check_circle';
  }

  getResultColor(): string {
    if (!this.analysisResult) return '';
    return this.analysisResult.label.toLowerCase() === 'riesgosa' ? 'warn' : 'primary';
  }

  clearAnalysis(): void {
    this.analysisResult = null;
    this.error = null;
    this.analyzeForm.reset();
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  getErrorMessage(field: string): string {
    const control = this.analyzeForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      return 'El texto debe tener al menos 10 caracteres';
    }
    return '';
  }
}
