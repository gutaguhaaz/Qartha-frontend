import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SignatureData } from '../../models/contract.models';

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
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
      <!-- Selector de tipo de firma -->
      <mat-button-toggle-group 
        [(value)]="signatureType" 
        (change)="onSignatureTypeChange($event)"
        class="mb-3">
        <mat-button-toggle value="canvas">
          <mat-icon>brush</mat-icon>
          Dibujar
        </mat-button-toggle>
        <mat-button-toggle value="upload">
          <mat-icon>upload</mat-icon>
          Subir Imagen
        </mat-button-toggle>
        <mat-button-toggle value="text">
          <mat-icon>text_fields</mat-icon>
          Escribir Nombre
        </mat-button-toggle>
      </mat-button-toggle-group>

      <!-- Canvas para dibujar -->
      <div *ngIf="signatureType === 'canvas'" class="canvas-container">
        <canvas 
          #signatureCanvas 
          width="400" 
          height="200" 
          class="signature-canvas"
          (mousedown)="startDrawing($event)"
          (mousemove)="draw($event)"
          (mouseup)="stopDrawing()"
          (mouseleave)="stopDrawing()"
          (touchstart)="startDrawing($event)"
          (touchmove)="draw($event)"
          (touchend)="stopDrawing()">
        </canvas>
        <div class="canvas-controls mt-2">
          <button mat-stroked-button (click)="clearCanvas()" type="button">
            <mat-icon>clear</mat-icon>
            Limpiar
          </button>
        </div>
      </div>

      <!-- Upload de imagen -->
      <div *ngIf="signatureType === 'upload'" class="upload-container">
        <input 
          type="file" 
          #fileInput 
          accept="image/*" 
          (change)="onFileSelect($event)"
          style="display: none;">
        <button 
          mat-raised-button 
          color="primary" 
          (click)="fileInput.click()" 
          type="button">
          <mat-icon>upload</mat-icon>
          Seleccionar Imagen de Firma
        </button>
        <div *ngIf="uploadedImage" class="uploaded-preview mt-2">
          <img [src]="uploadedImage" alt="Firma subida" class="signature-preview">
          <button mat-icon-button (click)="clearUpload()" type="button">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <!-- Campo de texto -->
      <div *ngIf="signatureType === 'text'" class="text-container">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Escriba su nombre completo</mat-label>
          <input 
            matInput 
            [(ngModel)]="textSignature" 
            (ngModelChange)="onTextChange()"
            placeholder="Ej: Juan Pérez - Firma Digital">
          <mat-icon matSuffix>edit</mat-icon>
        </mat-form-field>
      </div>
    </div>
  `,
  styles: [`
    .signature-container {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 16px;
      margin: 8px 0;
    }

    .signature-canvas {
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: crosshair;
      background: white;
      width: 100%;
      max-width: 400px;
    }

    .canvas-container {
      text-align: center;
    }

    .upload-container {
      text-align: center;
    }

    .signature-preview {
      max-width: 200px;
      max-height: 100px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-right: 8px;
    }

    .uploaded-preview {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mat-button-toggle-group {
      width: 100%;
    }

    .text-container {
      margin-top: 16px;
    }
  `]
})
export class SignaturePadComponent implements ControlValueAccessor, OnInit {
  @ViewChild('signatureCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  signatureType: 'canvas' | 'upload' | 'text' = 'canvas';
  textSignature = '';
  uploadedImage = '';

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  ngOnInit() {
    // Canvas se inicializa después de que la vista esté lista
  }

  ngAfterViewInit() {
    if (this.signatureType === 'canvas') {
      this.initCanvas();
    }
  }

  onSignatureTypeChange(event: any) {
    this.signatureType = event.value;
    this.clearAll();

    if (this.signatureType === 'canvas') {
      setTimeout(() => this.initCanvas(), 0);
    }
  }

  private initCanvas() {
    if (this.canvasRef) {
      this.canvas = this.canvasRef.nativeElement;
      this.ctx = this.canvas.getContext('2d')!;
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    }
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    if (!this.canvas) return;

    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();

    if (event instanceof TouchEvent) {
      this.lastX = event.touches[0].clientX - rect.left;
      this.lastY = event.touches[0].clientY - rect.top;
    } else {
      this.lastX = event.clientX - rect.left;
      this.lastY = event.clientY - rect.top;
    }
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing || !this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    let currentX, currentY;

    if (event instanceof TouchEvent) {
      currentX = event.touches[0].clientX - rect.left;
      currentY = event.touches[0].clientY - rect.top;
      event.preventDefault();
    } else {
      currentX = event.clientX - rect.left;
      currentY = event.clientY - rect.top;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;

    this.updateValue();
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearCanvas() {
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.updateValue();
    }
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImage = e.target?.result as string;
        this.updateValue();
      };
      reader.readAsDataURL(file);
    }
  }

  clearUpload() {
    this.uploadedImage = '';
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
    this.updateValue();
  }

  onTextChange() {
    this.updateValue();
  }

  private updateValue() {
    let value = '';

    switch (this.signatureType) {
      case 'canvas':
        if (this.canvas) {
          value = this.canvas.toDataURL('image/png');
        }
        break;
      case 'upload':
        value = this.uploadedImage;
        break;
      case 'text':
        value = this.textSignature;
        break;
    }

    const signatureData: SignatureData = {
      type: this.signatureType,
      value: value
    };

    this.onChange(JSON.stringify(signatureData));
    this.onTouched();
  }

  private clearAll() {
    this.textSignature = '';
    this.uploadedImage = '';
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
    this.updateValue();
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (value) {
      try {
        const signatureData: SignatureData = JSON.parse(value);
        this.signatureType = signatureData.type;

        switch (signatureData.type) {
          case 'text':
            this.textSignature = signatureData.value;
            break;
          case 'upload':
            this.uploadedImage = signatureData.value;
            break;
          case 'canvas':
            // Para canvas, podrías cargar la imagen si es necesario
            break;
        }
      } catch (e) {
        // Si no es JSON válido, tratar como texto simple
        this.signatureType = 'text';
        this.textSignature = value;
      }
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implementar si es necesario
  }
}