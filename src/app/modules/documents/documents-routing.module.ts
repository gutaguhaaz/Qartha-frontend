
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentDashboardComponent } from './pages/document-dashboard/document-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentListComponent
  },
  {
    path: 'dashboard',
    component: DocumentDashboardComponent
  },
  {
    path: 'upload',
    loadComponent: () => import('./pages/upload-document/upload-document.component').then(m => m.UploadDocumentComponent)
  },
  {
    path: 'analyze-clause',
    loadComponent: () => import('./pages/analyze-clause/analyze-clause.component').then(m => m.AnalyzeClauseComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
