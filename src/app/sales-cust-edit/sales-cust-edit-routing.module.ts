import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesCustEditPage } from './sales-cust-edit.page';

const routes: Routes = [
  {
    path: '',
    component: SalesCustEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesCustEditPageRoutingModule {}
