
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
      next: (response: any) => {
        console.log('Template fields response:', response);
        
        // Check if response has template_fields array or if it's a fields object
        if (response && Array.isArray(response)) {
          this.templateFields = response;
        } else if (response && response.template_fields && Array.isArray(response.template_fields)) {
          this.templateFields = response.template_fields;
        } else if (response && response.fields && typeof response.fields === 'object') {
          // Convert fields object to array format
          this.templateFields = Object.entries(response.fields).map(([key, label]) => ({
            field: key,
            label: label as string,
            type: 'text',
            required: true,
            placeholder: `Ingrese ${label}`
          }));
        } else if (response && typeof response === 'object' && !Array.isArray(response)) {
          // If response is directly the fields object
          this.templateFields = Object.entries(response).map(([key, label]) => ({
            field: key,
            label: label as string,
            type: 'text',
            required: true,
            placeholder: `Ingrese ${label}`
          }));
        } else {
          this.templateFields = [];
        }
        
        console.log('Processed template fields:', this.templateFields);
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

    if (this.templateFields && this.templateFields.length > 0) {
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
          case 'signature-text':
          case 'signature-canvas':
          case 'signature-image':
            // Custom signature validator
            if (field.required) {
              validators.push(this.signatureValidator);
            }
            break;
        }
        
        group[field.field] = [{ value: '', disabled: false }, validators];
      });
    }

    // Rebuild the form with new controls
    this.contractForm = this.fb.group(group);
    console.log('Dynamic form built:', this.contractForm);
    console.log('Form controls:', Object.keys(this.contractForm.controls));
  }

  // Custom validator for signature fields
  private signatureValidator(control: any) {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    
    try {
      const signatureData = JSON.parse(value);
      if (!signatureData.type || !signatureData.value) {
        return { invalidSignature: true };
      }
      return null;
    } catch (e) {
      // If it's not JSON, treat as text signature
      return value.trim() ? null : { required: true };
    }
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
    
    const campos: { [key: string]: any } = {};
    this.templateFields.forEach(field => {
      if (formValue[field.field]) {
        let value = formValue[field.field];
        
        // Format date fields
        if (field.type === 'date' && value instanceof Date) {
          value = value.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
        
        // Handle signature fields
        if (this.isSignatureField(field.type)) {
          try {
            const signatureData = JSON.parse(value);
            // Send signature object with type and value
            campos[field.field] = {
              type: signatureData.type,
              value: signatureData.value
            };
          } catch (e) {
            // If not JSON, treat as text signature (backward compatibility)
            campos[field.field] = {
              type: 'text',
              value: value
            };
          }
        } else {
          campos[field.field] = value;
        }
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

  isSignatureField(fieldType: string): boolean {
    return fieldType === 'signature' || 
           fieldType === 'signature-text' || 
           fieldType === 'signature-canvas' || 
           fieldType === 'signature-image';
  }

  getSignatureType(fieldType: string): 'text' | 'canvas' | 'image' {
    switch (fieldType) {
      case 'signature-text':
        return 'text';
      case 'signature-canvas':
        return 'canvas';
      case 'signature-image':
        return 'image';
      default:
        return 'canvas'; // Default to canvas for 'signature' type
    }
  }
}
