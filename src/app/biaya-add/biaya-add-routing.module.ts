import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BiayaAddPage } from './biaya-add.page';

const routes: Routes = [
  {
    path: '',
    component: BiayaAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BiayaAddPageRoutingModule {}
