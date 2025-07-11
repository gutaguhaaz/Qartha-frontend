
import { Component, ElementRef, ViewChild, forwardRef, OnInit, OnDestroy, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

export type SignatureType = 'canvas' | 'upload' | 'text';

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
  template: `
    <div class="signature-container">
      <mat-tab-group [(selectedIndex)]="selectedTabIndex" (selectedTabChange)="onTabChange($event)">
        <!-- Canvas Signature Tab -->
        <mat-tab label="Dibujar Firma">
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
            </div>
          </div>
        </mat-tab>

        <!-- Upload Image Tab -->
        <mat-tab label="Subir Imagen">
          <div class="tab-content">
            <div class="upload-area">
              <input 
                #fileInput 
                type="file" 
                accept="image/*" 
                (change)="onFileSelected($event)"
                style="display: none"
              >
              <button mat-raised-button color="primary" (click)="fileInput.click()" type="button">
                <mat-icon>cloud_upload</mat-icon>
                Seleccionar Imagen
              </button>
              <p class="upload-hint">Formatos: PNG, JPG, JPEG</p>
              
              <div *ngIf="uploadedImagePreview" class="image-preview">
                <img [src]="uploadedImagePreview" alt="Vista previa" class="preview-image">
                <button mat-icon-button color="warn" (click)="removeUploadedImage()" type="button">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Text Signature Tab -->
        <mat-tab label="Firma de Texto">
          <div class="tab-content">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Escribe tu firma</mat-label>
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
      </mat-tab-group>
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
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      cursor: crosshair;
      display: block;
      margin: 0 auto;
      width: 100%;
      max-width: 500px;
      height: 150px;
    }
    
    .signature-canvas:hover {
      border-color: #2196f3;
    }
    
    .signature-actions {
      margin-top: 12px;
      text-align: center;
    }
    
    .upload-area {
      text-align: center;
      padding: 20px;
    }
    
    .upload-hint {
      margin: 10px 0;
      color: #666;
      font-size: 14px;
    }
    
    .image-preview {
      margin-top: 16px;
      position: relative;
      display: inline-block;
    }
    
    .preview-image {
      max-width: 300px;
      max-height: 150px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .text-signature-preview {
      text-align: center;
      margin-top: 16px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
    }
    
    .signature-text {
      font-family: 'Brush Script MT', cursive;
      font-size: 24px;
      color: #333;
      margin: 0;
    }
    
    .text-signature-input {
      font-size: 16px;
    }
    
    .w-100 {
      width: 100%;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignaturePadComponent),
      multi: true
    }
  ]
})
export class SignaturePadComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @ViewChild('signatureCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() signatureType: SignatureType = 'canvas';
  
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  
  selectedTabIndex = 0;
  textSignature = '';
  uploadedImagePreview: string | null = null;
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  ngOnInit() {
    this.setupCanvas();
    this.setInitialTab();
  }
  
  ngOnDestroy() {
    // Cleanup if needed
  }
  
  private setupCanvas() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Set canvas size
    this.canvas.width = 500;
    this.canvas.height = 150;
    
    // Configure drawing style
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Fill with white background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  private setInitialTab() {
    switch (this.signatureType) {
      case 'canvas':
        this.selectedTabIndex = 0;
        break;
      case 'upload':
        this.selectedTabIndex = 1;
        break;
      case 'text':
        this.selectedTabIndex = 2;
        break;
    }
  }
  
  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    this.clearAll();
  }
  
  startDrawing(event: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    
    if (event instanceof MouseEvent) {
      this.lastX = event.clientX - rect.left;
      this.lastY = event.clientY - rect.top;
    } else {
      const touch = event.touches[0];
      this.lastX = touch.clientX - rect.left;
      this.lastY = touch.clientY - rect.top;
      event.preventDefault();
    }
  }
  
  draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    
    const rect = this.canvas.getBoundingClientRect();
    let currentX, currentY;
    
    if (event instanceof MouseEvent) {
      currentX = event.clientX - rect.left;
      currentY = event.clientY - rect.top;
    } else {
      const touch = event.touches[0];
      currentX = touch.clientX - rect.left;
      currentY = touch.clientY - rect.top;
      event.preventDefault();
    }
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();
    
    this.lastX = currentX;
    this.lastY = currentY;
    
    // Emit the signature as base64
    this.emitCanvasSignature();
  }
  
  stopDrawing() {
    this.isDrawing = false;
  }
  
  clearCanvas() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.emitCanvasSignature();
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImagePreview = e.target.result;
        this.emitUploadedImage();
      };
      reader.readAsDataURL(file);
    }
  }
  
  removeUploadedImage() {
    this.uploadedImagePreview = null;
    this.onChange('');
    this.onTouched();
  }
  
  onTextSignatureChange() {
    this.emitTextSignature();
  }
  
  private emitCanvasSignature() {
    const dataURL = this.canvas.toDataURL('image/png');
    const signature = {
      type: 'canvas',
      value: dataURL
    };
    this.onChange(JSON.stringify(signature));
    this.onTouched();
  }
  
  private emitUploadedImage() {
    if (this.uploadedImagePreview) {
      const signature = {
        type: 'upload',
        value: this.uploadedImagePreview
      };
      this.onChange(JSON.stringify(signature));
      this.onTouched();
    }
  }
  
  private emitTextSignature() {
    const signature = {
      type: 'text',
      value: this.textSignature
    };
    this.onChange(JSON.stringify(signature));
    this.onTouched();
  }
  
  clearAll() {
    this.clearCanvas();
    this.removeUploadedImage();
    this.textSignature = '';
    this.onChange('');
    this.onTouched();
  }
  
  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (!value) {
      this.clearAll();
      return;
    }
    
    try {
      const signature = JSON.parse(value);
      switch (signature.type) {
        case 'canvas':
          // For canvas, we could reload the image if needed
          break;
        case 'upload':
          this.uploadedImagePreview = signature.value;
          this.selectedTabIndex = 1;
          break;
        case 'text':
          this.textSignature = signature.value;
          this.selectedTabIndex = 2;
          break;
      }
    } catch (e) {
      // If it's not JSON, treat as legacy canvas signature
      // You could load it to canvas if needed
    }
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
}
