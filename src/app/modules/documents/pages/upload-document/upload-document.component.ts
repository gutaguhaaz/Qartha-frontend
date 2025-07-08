
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { DocumentsService } from '../../services/documents.service';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    BreadcrumbComponent
  ]
})
export class UploadDocumentComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  uploadForm!: FormGroup;
  isLoading = false;
  selectedFile: File | null = null;

  documentTypes = [
    { value: 'Contrato', label: 'Contrato' },
    { value: 'Boletín', label: 'Boletín' },
    { value: 'Comunicado', label: 'Comunicado' },
    { value: 'Informe', label: 'Informe' },
    { value: 'Otro', label: 'Otro' }
  ];

  constructor(
    private fb: FormBuilder,
    private documentsService: DocumentsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required]],
      file: ['', [Validators.required]]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (allowedTypes.includes(file.type)) {
        this.selectedFile = file;
        this.uploadForm.patchValue({ file: file.name });
      } else {
        this.snackBar.open('Solo se permiten archivos PDF, DOC y DOCX', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        event.target.value = '';
      }
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      this.isLoading = true;
      
      const title = this.uploadForm.get('title')?.value;
      const type = this.uploadForm.get('type')?.value;

      this.documentsService.uploadDocument(this.selectedFile, title, type).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Documento subido exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.resetForm();
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.message || 'Error al subir el documento';
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  resetForm(): void {
    this.uploadForm.reset();
    this.selectedFile = null;
    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  getErrorMessage(field: string): string {
    const control = this.uploadForm.get(field);
    if (control?.hasError('required')) {
      return `${field === 'title' ? 'Título' : field === 'type' ? 'Tipo' : 'Archivo'} es requerido`;
    }
    if (control?.hasError('minlength')) {
      return 'El título debe tener al menos 3 caracteres';
    }
    return '';
  }
}
