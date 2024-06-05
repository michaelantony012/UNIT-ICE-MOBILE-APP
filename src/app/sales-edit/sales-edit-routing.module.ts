import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesEditPage } from './sales-edit.page';

const routes: Routes = [
  {
    path: '',
    component: SalesEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesEditPageRoutingModule {}
