
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentDashboardComponent } from './pages/document-dashboard/document-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DocumentListComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    TranslateModule,
    BreadcrumbComponent,
    DocumentDashboardComponent,
    MatTableModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class DocumentsModule { }
