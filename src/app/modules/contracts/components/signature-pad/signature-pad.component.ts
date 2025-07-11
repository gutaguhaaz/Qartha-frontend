
import { Component, ElementRef, ViewChild, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="signature-container">
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
        <button mat-raised-button color="warn" (click)="clear()" type="button">
          <mat-icon>clear</mat-icon>
          Limpiar Firma
        </button>
      </div>
    </div>
  `,
  styles: [`
    .signature-container {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      background-color: #fafafa;
    }
    
    .signature-canvas {
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      cursor: crosshair;
      display: block;
      margin: 0 auto;
    }
    
    .signature-actions {
      margin-top: 12px;
    }
    
    .signature-canvas:hover {
      border-color: #2196f3;
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
  
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  ngOnInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Set canvas size
    this.canvas.width = 400;
    this.canvas.height = 200;
    
    // Configure drawing style
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Fill with white background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  ngOnDestroy() {
    // Cleanup if needed
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
    this.emitSignature();
  }
  
  stopDrawing() {
    this.isDrawing = false;
  }
  
  clear() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.onChange('');
    this.onTouched();
  }
  
  private emitSignature() {
    const dataURL = this.canvas.toDataURL('image/png');
    this.onChange(dataURL);
    this.onTouched();
  }
  
  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (!value) {
      this.clear();
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
