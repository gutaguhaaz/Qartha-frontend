
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentListComponent } from './document-list/document-list.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [
    DocumentListComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    SharedModule
  ]
})
export class DocumentsModule { }
