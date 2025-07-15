
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
    console.log('Iniciando carga de templates...');
    this.isLoading = true;
    
    this.contractsService.getTemplates().subscribe({
      next: (response) => {
        console.log('Raw response from getTemplates():', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response || {}));
        
        if (response && response.templates && Array.isArray(response.templates)) {
          console.log('Templates array found:', response.templates);
          this.templates = response.templates.map(name => ({
            name: name,
            displayName: this.formatDisplayName(name),
            fields: []
          }));
          console.log('Processed templates:', this.templates);
        } else if (response && Array.isArray(response)) {
          // Si la respuesta es directamente un array
          console.log('Direct array response:', response);
          this.templates = response.map(name => ({
            name: name,
            displayName: this.formatDisplayName(name),
            fields: []
          }));
        } else {
          console.error('Unexpected response format:', response);
          this.templates = [];
        }
        
        this.isLoading = false;
        console.log('Templates loading completed. Total templates:', this.templates.length);
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });
        
        this.snackBar.open('Error al cargar las plantillas: ' + (error.message || 'Error desconocido'), 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.templates = [];
        this.isLoading = false;
      }
    });
  }

  onTemplateChange(templateName: string): void {
    console.log('=== Template Change Event ===');
    console.log('Selected template name:', templateName);
    console.log('Available templates:', this.templates);
    
    if (!templateName) {
      console.log('Template cleared - resetting form');
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
    
    console.log('Fetching fields for template:', templateName);
    console.log('Service URL will be called...');
    
    this.contractsService.getTemplateFields(templateName).subscribe({
      next: (response: any) => {
        console.log('=== Template Fields Response ===');
        console.log('Raw response:', response);
        console.log('Response type:', typeof response);
        
        if (response) {
          console.log('Response keys:', Object.keys(response));
        }
        
        // Handle the new backend response format with field arrays
        if (response && response.fields && Array.isArray(response.fields)) {
          console.log('Found fields array in response.fields');
          this.templateFields = response.fields;
        } else if (response && Array.isArray(response)) {
          console.log('Response is direct array');
          this.templateFields = response;
        } else if (response && response.template_fields && Array.isArray(response.template_fields)) {
          console.log('Found fields in response.template_fields');
          this.templateFields = response.template_fields;
        } else {
          console.warn('No valid fields found in response, setting empty array');
          this.templateFields = [];
        }
        
        console.log('Final processed template fields:', this.templateFields);
        console.log('Number of fields:', this.templateFields.length);
        
        this.buildDynamicForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('=== Template Fields Error ===');
        console.error('Error object:', error);
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);
        console.error('Error URL:', error.url);
        
        this.snackBar.open('Error al cargar los campos de la plantilla: ' + (error.message || 'Error desconocido'), 'Cerrar', {
          duration: 5000,
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
            // Signature validation will be handled by the component
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

  generateContract(): void {
    console.log('=== GENERATE CONTRACT DEBUG ===');
    console.log('Selected template:', this.selectedTemplate);
    console.log('Template fields:', this.templateFields);
    
    // Enable all controls temporarily to get their values
    Object.keys(this.contractForm.controls).forEach(key => {
      this.contractForm.get(key)?.enable();
    });

    if (this.contractForm.invalid) {
      console.log('❌ Form is invalid');
      console.log('Form errors:', this.contractForm.errors);
      Object.keys(this.contractForm.controls).forEach(key => {
        const control = this.contractForm.get(key);
        if (control?.invalid) {
          console.log(`❌ Field '${key}' is invalid:`, control.errors);
        }
      });
      this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isGenerating = true;
    const formValue = this.contractForm.value;
    console.log('📝 Raw form value:', formValue);
    
    const campos: { [key: string]: string } = {};
    this.templateFields.forEach(field => {
      console.log(`🔍 Processing field: ${field.field} (type: ${field.type})`);
      console.log(`   Raw value:`, formValue[field.field]);
      
      if (formValue[field.field]) {
        let value = formValue[field.field];
        
        // Format date fields
        if (field.type === 'date' && value instanceof Date) {
          console.log(`📅 Converting date field ${field.field} from:`, value);
          value = value.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          console.log(`📅 Converted to:`, value);
        }
        
        // Handle signature fields
        if (field.type === 'signature') {
          console.log(`✍️ Processing signature field ${field.field}:`, value);
          try {
            const signatureData = JSON.parse(value);
            console.log(`✍️ Parsed signature data:`, signatureData);
            // Send the signature value based on type
            switch (signatureData.type) {
              case 'canvas':
              case 'upload':
                // For canvas and upload, send the base64 data
                value = signatureData.value;
                console.log(`✍️ Using ${signatureData.type} signature value (length: ${value?.length || 0})`);
                break;
              case 'text':
                // For text, send the text directly
                value = signatureData.value;
                console.log(`✍️ Using text signature value:`, value);
                break;
              default:
                value = signatureData.value;
                console.log(`✍️ Using default signature value:`, value);
            }
          } catch (e) {
            // If not JSON, use as is (backward compatibility)
            console.log(`✍️ Signature not JSON, using as is:`, value);
            value = value;
          }
        }
        
        campos[field.field] = value;
        console.log(`✅ Field ${field.field} processed:`, value);
      } else {
        console.log(`⚠️ Field ${field.field} is empty or undefined`);
      }
    });

    console.log('📤 Final campos object:', campos);

    const request: ContractGenerateRequest = {
      tipo_contrato: formValue.tipo_contrato,
      campos: campos,
      clausula_extra: formValue.clausula_extra || undefined
    };

    console.log('🚀 Final request to be sent:', request);
    console.log('📋 Request details:');
    console.log('   - tipo_contrato:', request.tipo_contrato);
    console.log('   - campos count:', Object.keys(request.campos).length);
    console.log('   - clausula_extra:', request.clausula_extra);
    console.log('=== END GENERATE CONTRACT DEBUG ===');

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
