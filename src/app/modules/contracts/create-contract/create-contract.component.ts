
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ContractsService } from '../services/contracts.service';
import { Template, TemplateField, ContractGenerateRequest } from '../models/contract.models';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TranslateModule } from '@ngx-translate/core';
import { SignaturePadComponent } from '../components/signature-pad/signature-pad.component';

@Component({
  selector: 'app-create-contract',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BreadcrumbComponent,
    TranslateModule,
    SignaturePadComponent
  ],
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.scss']
})
export class CreateContractComponent implements OnInit {
  contractForm: FormGroup;
  templates: Template[] = [];
  templateFields: TemplateField[] = [];
  selectedTemplate: string = '';
  isLoading = false;
  isGenerating = false;
  isDownloading = false;

  // Breadcrumb
  breadscrums = [
    {
      title: 'Contratos',
      items: ['Contratos'],
      active: 'Generar Contratos',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private contractsService: ContractsService,
    private snackBar: MatSnackBar
  ) {
    this.contractForm = this.fb.group({
      tipo_contrato: [{ value: '', disabled: false }, Validators.required],
      clausula_extra: [{ value: '', disabled: false }]
    });
  }

  ngOnInit(): void {
    console.log('CreateContractComponent initialized');
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.contractsService.getTemplates().subscribe({
      next: (response) => {
        console.log('Templates loaded:', response);
        // Convertir array de strings a objetos Template
        this.templates = response.templates.map(name => ({
          name: name,
          displayName: this.formatDisplayName(name),
          fields: []
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        this.snackBar.open('Error al cargar las plantillas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.templates = [];
        this.isLoading = false;
      }
    });
  }

  onTemplateChange(templateName: string): void {
    console.log('Template changed to:', templateName);
    
    if (!templateName) {
      this.templateFields = [];
      this.selectedTemplate = '';
      // Reset form to basic structure
      this.contractForm = this.fb.group({
        tipo_contrato: [{ value: '', disabled: false }, Validators.required],
        clausula_extra: [{ value: '', disabled: false }]
      });
      return;
    }

    this.selectedTemplate = templateName;
    this.isLoading = true;
    
    this.contractsService.getTemplateFields(templateName).subscribe({
      next: (fields) => {
        console.log('Template fields loaded:', fields);
        this.templateFields = fields || [];
        this.buildDynamicForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading template fields:', error);
        this.snackBar.open('Error al cargar los campos de la plantilla', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.templateFields = [];
        this.isLoading = false;
      }
    });
  }

  buildDynamicForm(): void {
    console.log('Building dynamic form with fields:', this.templateFields);
    
    const group: any = {
      tipo_contrato: [{ value: this.selectedTemplate, disabled: false }, Validators.required],
      clausula_extra: [{ value: '', disabled: false }]
    };

    this.templateFields.forEach(field => {
      const validators = [];
      
      if (field.required) {
        validators.push(Validators.required);
      }
      
      // Add specific validators based on field type
      switch (field.type) {
        case 'email':
          validators.push(Validators.email);
          break;
        case 'tel':
          // Add phone number pattern if needed
          break;
        case 'date':
          // Date fields will be handled by mat-datepicker
          break;
        case 'signature':
          // Signature validation will be handled by the component
          break;
      }
      
      group[field.field] = [{ value: '', disabled: false }, validators];
    });

    this.contractForm = this.fb.group(group);
    console.log('Dynamic form built:', this.contractForm);
  }

  generateContract(): void {
    // Enable all controls temporarily to get their values
    Object.keys(this.contractForm.controls).forEach(key => {
      this.contractForm.get(key)?.enable();
    });

    if (this.contractForm.invalid) {
      this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isGenerating = true;
    const formValue = this.contractForm.value;
    
    const campos: { [key: string]: string } = {};
    this.templateFields.forEach(field => {
      if (formValue[field.field]) {
        let value = formValue[field.field];
        
        // Format date fields
        if (field.type === 'date' && value instanceof Date) {
          value = value.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
        
        // Handle signature fields
        if (field.type === 'signature') {
          try {
            const signatureData = JSON.parse(value);
            // For backend, send the actual signature value
            value = signatureData.value;
          } catch (e) {
            // If not JSON, use as is (backward compatibility)
          }
        }
        
        campos[field.field] = value;
      }
    });

    const request: ContractGenerateRequest = {
      tipo_contrato: formValue.tipo_contrato,
      campos: campos,
      clausula_extra: formValue.clausula_extra || undefined
    };

    this.contractsService.generateContract(request).subscribe({
      next: (blob) => {
        const filename = `contrato_${this.selectedTemplate}_${new Date().getTime()}.docx`;
        this.contractsService.downloadFile(blob, filename);
        this.snackBar.open('Contrato generado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.isGenerating = false;
      },
      error: (error) => {
        console.error('Error generating contract:', error);
        this.snackBar.open('Error al generar el contrato', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isGenerating = false;
      }
    });
  }

  downloadTemplate(): void {
    if (!this.selectedTemplate) {
      this.snackBar.open('Seleccione una plantilla primero', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isDownloading = true;
    this.contractsService.downloadTemplate(this.selectedTemplate).subscribe({
      next: (blob) => {
        const filename = `plantilla_${this.selectedTemplate}.docx`;
        this.contractsService.downloadFile(blob, filename);
        this.snackBar.open('Plantilla descargada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.isDownloading = false;
      },
      error: (error) => {
        console.error('Error downloading template:', error);
        this.snackBar.open('Error al descargar la plantilla', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isDownloading = false;
      }
    });
  }

  clearForm(): void {
    this.contractForm.reset();
    this.selectedTemplate = '';
    this.templateFields = [];
    this.snackBar.open('Formulario limpiado', 'Cerrar', {
      duration: 2000
    });
  }

  formatDisplayName(name: string): string {
    // Convertir nombres como "cesion_derechos" a "Cesión de Derechos"
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}
