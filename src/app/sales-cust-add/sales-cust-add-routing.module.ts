import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesCustAddPage } from './sales-cust-add.page';

const routes: Routes = [
  {
    path: '',
    component: SalesCustAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesCustAddPageRoutingModule {}
