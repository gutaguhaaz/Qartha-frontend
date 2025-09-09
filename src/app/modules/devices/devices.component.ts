
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DevicesService } from '../../core/service/devices.service';
import { Device } from '../../core/models/device';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    BreadcrumbComponent
  ],
  template: `
    <section class="content">
      <div class="content-block">
        <div class="block-header">
          <app-breadcrumb
            [title]="'Gestión de Dispositivos'"
            [items]="['Home']"
            [active_item]="'Dispositivos'"
          ></app-breadcrumb>
        </div>

        <div class="row clearfix">
          <div class="col-lg-12">
            <mat-card>
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>devices</mat-icon>
                  Dispositivos Qartha
                </mat-card-title>
                <div class="spacer"></div>
                <button mat-raised-button color="primary" (click)="createDevice()">
                  <mat-icon>add</mat-icon>
                  Nuevo Dispositivo
                </button>
              </mat-card-header>
              
              <mat-card-content>
                <div class="table-responsive">
                  <table mat-table [dataSource]="devices" class="w-100">
                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef>Nombre</th>
                      <td mat-cell *matCellDef="let device">{{ device.name }}</td>
                    </ng-container>

                    <ng-container matColumnDef="category">
                      <th mat-header-cell *matHeaderCellDef>Categoría</th>
                      <td mat-cell *matCellDef="let device">{{ device.category || '-' }}</td>
                    </ng-container>

                    <ng-container matColumnDef="brand">
                      <th mat-header-cell *matHeaderCellDef>Marca</th>
                      <td mat-cell *matCellDef="let device">{{ device.brand || '-' }}</td>
                    </ng-container>

                    <ng-container matColumnDef="model">
                      <th mat-header-cell *matHeaderCellDef>Modelo</th>
                      <td mat-cell *matCellDef="let device">{{ device.model || '-' }}</td>
                    </ng-container>

                    <ng-container matColumnDef="qr">
                      <th mat-header-cell *matHeaderCellDef>QR Code</th>
                      <td mat-cell *matCellDef="let device">
                        <button mat-icon-button 
                                color="primary" 
                                (click)="generateQR(device)"
                                [disabled]="generatingQR[device.id]">
                          <mat-icon *ngIf="!generatingQR[device.id]">qr_code</mat-icon>
                          <mat-icon *ngIf="generatingQR[device.id]" class="spinning">refresh</mat-icon>
                        </button>
                        <img *ngIf="device.qr_image_url" 
                             [src]="device.qr_image_url" 
                             alt="QR Code"
                             style="width: 50px; height: 50px; margin-left: 8px; cursor: pointer;"
                             (click)="showQR(device)">
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acciones</th>
                      <td mat-cell *matCellDef="let device">
                        <button mat-icon-button color="primary" (click)="editDevice(device)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="accent" (click)="viewScans(device)">
                          <mat-icon>location_on</mat-icon>
                        </button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  </table>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .spinning {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class DevicesComponent implements OnInit {
  devices: Device[] = [];
  displayedColumns: string[] = ['name', 'category', 'brand', 'model', 'qr', 'actions'];
  generatingQR: { [key: string]: boolean } = {};

  constructor(
    private devicesService: DevicesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDevices();
  }

  loadDevices() {
    this.devicesService.getDevices().subscribe({
      next: (devices) => {
        this.devices = devices;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar dispositivos', 'Cerrar', { duration: 3000 });
        console.error('Error loading devices:', error);
      }
    });
  }

  createDevice() {
    // TODO: Implementar dialog para crear dispositivo
    console.log('Create device dialog');
  }

  editDevice(device: Device) {
    // TODO: Implementar dialog para editar dispositivo
    console.log('Edit device:', device);
  }

  generateQR(device: Device) {
    this.generatingQR[device.id] = true;
    
    this.devicesService.generateQR(device.id).subscribe({
      next: (updatedDevice) => {
        const index = this.devices.findIndex(d => d.id === device.id);
        if (index >= 0) {
          this.devices[index] = updatedDevice;
        }
        this.generatingQR[device.id] = false;
        this.snackBar.open('QR Code generado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        this.generatingQR[device.id] = false;
        this.snackBar.open('Error al generar QR Code', 'Cerrar', { duration: 3000 });
        console.error('Error generating QR:', error);
      }
    });
  }

  showQR(device: Device) {
    if (device.qr_image_url) {
      window.open(device.qr_image_url, '_blank');
    }
  }

  viewScans(device: Device) {
    // TODO: Implementar vista de escaneos
    console.log('View scans for device:', device);
  }
}
