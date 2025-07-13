
import { Component, ElementRef, ViewChild, forwardRef, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

export type SignatureType = 'text' | 'canvas' | 'image';

export interface SignatureData {
  type: SignatureType;
  value: string;
}

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    FormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignaturePadComponent),
      multi: true
    }
  ],
  template: `
    <div class="signature-container">
      <mat-tab-group [(selectedIndex)]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">
        <!-- Canvas Signature Tab -->
        <mat-tab label="✏️ Dibujar Firma">
          <div class="tab-content">
            <canvas 
              #signatureCanvas
              class="signature-canvas"
              (mousedown)="startDrawing($event)"
              (mousemove)="draw($event)"
              (mouseup)="stopDrawing()"
              (mouseleave)="stopDrawing()"
              (touchstart)="startDrawing($event)"
              (touchmove)="draw($event)"
              (touchend)="stopDrawing()"
            ></canvas>
            <div class="signature-actions">
              <button mat-raised-button color="warn" (click)="clearCanvas()" type="button">
                <mat-icon>clear</mat-icon>
                Limpiar Firma
              </button>
              <button mat-raised-button color="primary" (click)="saveCanvasSignature()" type="button">
                <mat-icon>save</mat-icon>
                Guardar Firma
              </button>
            </div>
          </div>
        </mat-tab>

        <!-- Text Signature Tab -->
        <mat-tab label="📝 Firma de Texto">
          <div class="tab-content">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Escriba su nombre completo</mat-label>
              <input 
                matInput 
                [(ngModel)]="textSignature"
                (ngModelChange)="onTextSignatureChange()"
                placeholder="Ej: Juan Pérez"
                class="text-signature-input"
              >
            </mat-form-field>
            <div *ngIf="textSignature" class="text-signature-preview">
              <p class="signature-text">{{ textSignature }}</p>
            </div>
          </div>
        </mat-tab>

        <!-- Image Upload Tab -->
        <mat-tab label="🖼️ Subir Imagen">
          <div class="tab-content">
            <input #fileInput type="file" accept="image/*" (change)="onImageSelected($event)" style="display: none;">
            <div class="upload-area" (click)="fileInput.click()">
              <mat-icon>cloud_upload</mat-icon>
              <p>Haz clic para seleccionar una imagen de firma</p>
            </div>
            <div *ngIf="uploadedImage" class="uploaded-preview">
              <img [src]="uploadedImage" alt="Firma subida" class="signature-image">
              <button mat-icon-button color="warn" (click)="clearUploadedImage()" type="button">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>

      <!-- Preview Section -->
      <div *ngIf="currentSignature" class="signature-preview-section">
        <h4>Vista Previa de la Firma:</h4>
        <div class="preview-content">
          <div *ngIf="currentSignature.type === 'text'" class="text-preview">
            <p class="signature-text-display">{{ currentSignature.value }}</p>
          </div>
          <div *ngIf="currentSignature.type === 'canvas'" class="canvas-preview">
            <img [src]="currentSignature.value" alt="Firma dibujada" class="signature-image">
          </div>
          <div *ngIf="currentSignature.type === 'image'" class="image-preview">
            <img [src]="currentSignature.value" alt="Firma subida" class="signature-image">
          </div>
        </div>
        <button mat-icon-button color="warn" (click)="clearCurrentSignature()" type="button">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .signature-container {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 16px;
      background-color: #fafafa;
      min-height: 300px;
    }
    
    .tab-content {
      padding: 16px 0;
      min-height: 200px;
    }
    
    .signature-canvas {
      border: 2px solid #2196f3;
      border-radius: 4px;
      background-color: white;
      cursor: crosshair;
      display: block;
      margin: 16px auto;
      width: 100%;
      max-width: 500px;
      height: 150px;
      touch-action: none;
    }
    
    .signature-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: 16px;
    }

    .upload-area {
      border: 2px dashed #2196f3;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .upload-area:hover {
      background-color: #f3f7ff;
      border-color: #1976d2;
    }

    .upload-area mat-icon {
      font-size: 48px;
      color: #2196f3;
      margin-bottom: 16px;
    }

    .uploaded-preview {
      margin-top: 16px;
      text-align: center;
      position: relative;
    }

    .text-signature-preview {
      margin-top: 16px;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
    }

    .signature-text {
      font-family: 'Brush Script MT', cursive;
      font-size: 24px;
      color: #333;
      margin: 0;
      text-align: center;
    }

    .signature-text-display {
      font-family: 'Brush Script MT', cursive;
      font-size: 20px;
      color: #333;
      margin: 0;
    }

    .signature-image {
      max-width: 300px;
      max-height: 150px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .signature-preview-section {
      margin-top: 20px;
      padding: 16px;
      border: 1px solid #2196f3;
      border-radius: 8px;
      background-color: white;
    }

    .signature-preview-section h4 {
      margin: 0 0 12px 0;
      color: #2196f3;
    }

    .preview-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .text-signature-input {
      font-family: 'Brush Script MT', cursive;
      font-size: 18px;
    }

    .w-100 {
      width: 100%;
    }
  `]
})
export class SignaturePadComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {
  @ViewChild('signatureCanvas', { static: false }) canvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput', { static: false }) fileInputRef?: ElementRef<HTMLInputElement>;
  
  @Input() signatureType: SignatureType = 'canvas';
  
  selectedTabIndex = 0;
  textSignature = '';
  uploadedImage = '';
  currentSignature: SignatureData | null = null;
  
  private isDrawing = false;
  private ctx: CanvasRenderingContext2D | null = null;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    console.log('SignaturePad initialized with type:', this.signatureType);
    
    // Set default tab based on signature type
    switch (this.signatureType) {
      case 'text':
        this.selectedTabIndex = 1;
        break;
      case 'canvas':
        this.selectedTabIndex = 0;
        break;
      case 'image':
        this.selectedTabIndex = 2;
        break;
      default:
        this.selectedTabIndex = 0; // Default to canvas
    }
  }

  ngAfterViewInit(): void {
    // Always try to initialize canvas when component loads
    setTimeout(() => {
      if (this.selectedTabIndex === 0) {
        this.initCanvas();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value) {
      try {
        this.currentSignature = JSON.parse(value);
        if (this.currentSignature) {
          if (this.currentSignature.type === 'text') {
            this.textSignature = this.currentSignature.value;
            this.selectedTabIndex = 1;
          } else if (this.currentSignature.type === 'canvas') {
            this.selectedTabIndex = 0;
          } else if (this.currentSignature.type === 'image') {
            this.uploadedImage = this.currentSignature.value;
            this.selectedTabIndex = 2;
          }
        }
      } catch (e) {
        // If not JSON, treat as text signature
        this.textSignature = value;
        this.currentSignature = { type: 'text', value: value };
        this.selectedTabIndex = 1;
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
    if (event.index === 0) {
      setTimeout(() => {
        this.initCanvas();
      }, 100);
    }
  }

  private initCanvas(): void {
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d');
      if (this.ctx !== null) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
      }
    }
  }

  startDrawing(event: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    if (this.ctx !== null) {
      this.ctx.beginPath();
      const rect = this.canvasRef?.nativeElement.getBoundingClientRect();
      if (rect) {
        const x = (event as MouseEvent).clientX ? (event as MouseEvent).clientX - rect.left : (event as TouchEvent).touches[0].clientX - rect.left;
        const y = (event as MouseEvent).clientY ? (event as MouseEvent).clientY - rect.top : (event as TouchEvent).touches[0].clientY - rect.top;
        this.ctx.moveTo(x, y);
      }
    }
    event.preventDefault();
  }

  draw(event: MouseEvent | TouchEvent): void {
    if (!this.isDrawing || this.ctx === null) return;
    
    const rect = this.canvasRef?.nativeElement.getBoundingClientRect();
    if (rect) {
      const x = (event as MouseEvent).clientX ? (event as MouseEvent).clientX - rect.left : (event as TouchEvent).touches[0].clientX - rect.left;
      const y = (event as MouseEvent).clientY ? (event as MouseEvent).clientY - rect.top : (event as TouchEvent).touches[0].clientY - rect.top;
      
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
    event.preventDefault();
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  clearCanvas(): void {
    if (this.ctx !== null && this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    this.clearCurrentSignature();
  }

  saveCanvasSignature(): void {
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      const dataURL = canvas.toDataURL('image/png');
      
      this.currentSignature = {
        type: 'canvas',
        value: dataURL
      };
      
      this.updateValue();
    }
  }

  onTextSignatureChange(): void {
    if (this.textSignature.trim()) {
      this.currentSignature = {
        type: 'text',
        value: this.textSignature.trim()
      };
    } else {
      this.currentSignature = null;
    }
    
    this.updateValue();
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target?.result as string;
        this.uploadedImage = dataURL;
        
        this.currentSignature = {
          type: 'image',
          value: dataURL
        };
        
        this.updateValue();
      };
      reader.readAsDataURL(file);
    }
  }

  clearUploadedImage(): void {
    this.uploadedImage = '';
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
    this.clearCurrentSignature();
  }

  clearCurrentSignature(): void {
    this.currentSignature = null;
    this.updateValue();
  }

  private updateValue(): void {
    // Send as JSON string for form compatibility
    const value = this.currentSignature ? JSON.stringify(this.currentSignature) : '';
    this.onChange(value);
    this.onTouched();
  }
}
