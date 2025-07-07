
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentListComponent } from './document-list/document-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    DocumentListComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    TranslateModule,
    BreadcrumbComponent
  ]
})
export class DocumentsModule { }
