
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'generate',
    pathMatch: 'full'
  },
  {
    path: 'generate',
    loadComponent: () => import('./create-contract/create-contract.component').then(m => m.CreateContractComponent)
  },
  {
    path: 'generate-clause',
    loadComponent: () => import('./clause-generator/clause-generator.component').then(m => m.ClauseGeneratorComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule { }
