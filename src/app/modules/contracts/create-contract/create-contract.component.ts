
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
import { ContractsService } from '../services/contracts.service';
import { Template, TemplateField, ContractGenerateRequest } from '../models/contract.models';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TranslateModule } from '@ngx-translate/core';

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
    BreadcrumbComponent,
    TranslateModule
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
      tipo_contrato: ['', Validators.required],
      clausula_extra: ['']
    });
  }

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.contractsService.getTemplates().subscribe({
      next: (response) => {
        // Convertir array de strings a objetos Template
        this.templates = response.templates.map(name => ({
          name: name,
          displayName: this.formatDisplayName(name)
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
    if (!templateName) {
      this.templateFields = [];
      this.selectedTemplate = '';
      return;
    }

    this.selectedTemplate = templateName;
    this.isLoading = true;
    
    this.contractsService.getTemplateFields(templateName).subscribe({
      next: (fields) => {
        this.templateFields = fields;
        this.buildDynamicForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading template fields:', error);
        this.snackBar.open('Error al cargar los campos de la plantilla', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  buildDynamicForm(): void {
    const group: any = {
      tipo_contrato: [this.selectedTemplate, Validators.required],
      clausula_extra: ['']
    };

    this.templateFields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      group[field.name] = ['', validators];
    });

    this.contractForm = this.fb.group(group);
  }

  generateContract(): void {
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
      if (formValue[field.name]) {
        campos[field.name] = formValue[field.name];
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
