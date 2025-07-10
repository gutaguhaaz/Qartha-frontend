
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { DocumentsService } from '../../services/documents.service';
import { EditClauseLabelComponent } from '../../dialogs/edit-clause-label/edit-clause-label.component';
import { FilterPipe } from '../../../../shared/pipes/filter.pipe';

export interface ClauseExample {
  _id: string;
  document_id: string;
  clause_text: string;
  label: 'riesgosa' | 'neutra';
  created_at: string;
}

export interface ClauseUpdateRequest {
  label: 'riesgosa' | 'neutra';
}

@Component({
  selector: 'app-clauses',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    BreadcrumbComponent,
    FilterPipe,
  ],
  templateUrl: './clauses.component.html',
  styleUrls: ['./clauses.component.scss'],
})
export class ClausesComponent implements OnInit {
  clauses: ClauseExample[] = [];
  filteredClauses: ClauseExample[] = [];
  displayedColumns: string[] = ['id', 'document_id', 'clause_text', 'label', 'created_at', 'actions'];
  isLoading = true;
  error: string | null = null;
  searchText = '';
  labelFilter = '';

  constructor(
    private documentsService: DocumentsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClauses();
  }

  loadClauses(): void {
    this.isLoading = true;
    this.error = null;

    this.documentsService.getClauses().subscribe({
      next: (clauses) => {
        this.clauses = clauses;
        this.filteredClauses = clauses;
        this.isLoading = false;
        this.applyFilters();
      },
      error: (error) => {
        this.error = 'Error al cargar las cláusulas';
        this.isLoading = false;
        console.error('Error loading clauses:', error);
      },
    });
  }

  applyFilters(): void {
    this.filteredClauses = this.clauses.filter(clause => {
      const matchesSearch = this.searchText === '' || 
        clause.clause_text.toLowerCase().includes(this.searchText.toLowerCase()) ||
        clause.document_id.toLowerCase().includes(this.searchText.toLowerCase());
      
      const matchesLabel = this.labelFilter === '' || clause.label === this.labelFilter;
      
      return matchesSearch && matchesLabel;
    });
  }

  onSearchChange(event: any): void {
    this.searchText = event.target.value;
    this.applyFilters();
  }

  onLabelFilterChange(value: string): void {
    this.labelFilter = value;
    this.applyFilters();
  }

  getTruncatedText(text: string, maxLength: number = 100): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  getShortId(id: string): string {
    return id.length > 6 ? id.substring(id.length - 6) : id;
  }

  getLabelColor(label: string): string {
    return label === 'riesgosa' ? 'warn' : 'primary';
  }

  getLabelClass(label: string): string {
    return label === 'riesgosa' ? 'text-red-500' : 'text-green-500';
  }

  refreshClauses(): void {
    this.loadClauses();
  }

  openEditDialog(clause: ClauseExample): void {
    const dialogRef = this.dialog.open(EditClauseLabelComponent, {
      width: '450px',
      data: { clause }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.label) {
        this.updateClauseLabel(clause._id, result.label);
      }
    });
  }

  updateClauseLabel(clauseId: string, newLabel: 'riesgosa' | 'neutra'): void {
    this.documentsService.updateClauseLabel(clauseId, { label: newLabel }).subscribe({
      next: (updatedClause) => {
        // Actualizar la cláusula en la lista local
        const index = this.clauses.findIndex(c => c._id === clauseId);
        if (index !== -1) {
          this.clauses[index] = updatedClause;
          this.applyFilters();
        }
        
        // Mostrar mensaje de éxito
        this.snackBar.open(
          'Etiqueta actualizada correctamente',
          'Cerrar',
          {
            duration: 3000,
            panelClass: ['snackbar-success']
          }
        );
      },
      error: (error) => {
        console.error('Error al actualizar etiqueta:', error);
        
        let errorMessage = 'Error al actualizar la etiqueta';
        if (error.status === 404) {
          errorMessage = 'La cláusula no fue encontrada';
        } else if (error.status === 400) {
          errorMessage = 'ID de cláusula inválido';
        }
        
        this.snackBar.open(
          errorMessage,
          'Cerrar',
          {
            duration: 5000,
            panelClass: ['snackbar-error']
          }
        );
      }
    });
  }
}
