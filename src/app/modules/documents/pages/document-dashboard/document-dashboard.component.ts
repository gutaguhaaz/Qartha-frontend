
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { DocumentsService } from '../../services/documents.service';

export interface Document {
  id: string;
  title: string;
  type: 'Contrato' | 'Boletín' | 'Comunicado' | 'Informe' | 'Otro';
  clauses: string[];
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
    TranslateModule,
    BreadcrumbComponent
  ],
  templateUrl: './document-dashboard.component.html',
  styleUrls: ['./document-dashboard.component.scss']
})
export class DocumentDashboardComponent implements OnInit {
  documents: Document[] = [];
  displayedColumns: string[] = ['title', 'type', 'clauses', 'created_at'];
  isLoading = true;
  error: string | null = null;

  constructor(private documentsService: DocumentsService) {}

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
      }
    });
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'Contrato': 'primary',
      'Boletín': 'accent',
      'Comunicado': 'warn',
      'Informe': 'primary',
      'Otro': 'basic'
    };
    return colors[type] || 'basic';
  }

  refreshDocuments(): void {
    this.loadDocuments();
  }

  getTotalClauses(): number {
    return this.documents.reduce((total, doc) => total + doc.clauses.length, 0);
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
    return row?.clauses?.reduce((acc: number, c: any) => acc + (c?.clause?.length ?? 0), 0) ?? 0;
  }

  getDocumentsByType(type: string): Document[] {
    return this.documents.filter(doc => doc.type === type);
  }
}
