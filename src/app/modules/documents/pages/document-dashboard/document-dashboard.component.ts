import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { DocumentsService } from '../../services/documents.service';
import { DeleteDocumentComponent } from '../../dialogs/delete-document/delete-document.component';

export interface RiskClause {
  clause_text: string;
  label: 'riesgosa' | 'neutra';
}

export interface Document {
  id: string;
  custom_id: number;
  title: string;
  type: 'Contrato' | 'Boletín' | 'Comunicado' | 'Informe' | 'Otro';
  clauses?: string[]; // opcional
  risk_clauses?: RiskClause[]; // Updated to new object format
  created_at: string;
}

@Component({
  selector: 'app-document-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    BreadcrumbComponent,
  ],
  templateUrl: './document-dashboard.component.html',
  styleUrls: ['./document-dashboard.component.scss'],
})
export class DocumentDashboardComponent implements OnInit {
  documents: Document[] = [];
  displayedColumns: string[] = ['title', 'type', 'clauses', 'created_at', 'actions'];
  isLoading = true;
  error: string | null = null;

  constructor(
    private documentsService: DocumentsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.error = null;

    this.documentsService.getDocuments().subscribe({
      next: (documents) => {
        this.documents = documents;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los documentos';
        this.isLoading = false;
        console.error('Error loading documents:', error);
      },
    });
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      Contrato: 'primary',
      Boletín: 'accent',
      Comunicado: 'warn',
      Informe: 'primary',
      Otro: 'basic',
    };
    return colors[type] || 'basic';
  }

  refreshDocuments(): void {
    this.loadDocuments();
  }

  getTotalClauses(): number {
    if (!this.documents || !Array.isArray(this.documents)) {
      return 0;
    }
    return this.documents.reduce((total, doc) => {
      const riskClauses = doc.risk_clauses || [];
      const regularClauses = doc.clauses || [];
      return total + riskClauses.length + regularClauses.length;
    }, 0);
  }

  getTotalClausesForRow(row: any): number {
    // Versión segura con validaciones
    if (!row || !row.clauses || !Array.isArray(row.clauses)) {
      return 0;
    }

    return row.clauses.reduce((acc: number, c: any) => {
      if (!c || typeof c.clause !== 'string') {
        return acc;
      }
      return acc + c.clause.length;
    }, 0);
  }

  // Versión más compacta usando optional chaining y nullish coalescing
  getTotalClausesCompact(row: any): number {
    return (
      row?.clauses?.reduce(
        (acc: number, c: any) => acc + (c?.clause?.length ?? 0),
        0,
      ) ?? 0
    );
  }

  getDocumentsByType(type: string): Document[] {
    return this.documents.filter((doc) => doc.type === type);
  }

  openDeleteDialog(document: Document): void {
    const dialogRef = this.dialog.open(DeleteDocumentComponent, {
      width: '450px',
      data: { document }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteDocument(document);
      }
    });
  }

  deleteDocument(document: Document): void {
    this.documentsService.deleteDocument(document.custom_id).subscribe({
      next: (response) => {
        // Eliminar el documento de la lista local
        this.documents = this.documents.filter(doc => doc.custom_id !== document.custom_id);
        
        // Mostrar mensaje de éxito
        this.snackBar.open(
          `Documento "${document.title}" eliminado exitosamente`,
          'Cerrar',
          {
            duration: 3000,
            panelClass: ['snackbar-success']
          }
        );
      },
      error: (error) => {
        console.error('Error al eliminar documento:', error);
        
        let errorMessage = 'Error al eliminar el documento';
        if (error.status === 404) {
          errorMessage = 'El documento no fue encontrado';
        } else if (error.status === 400) {
          errorMessage = 'ID de documento inválido';
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
