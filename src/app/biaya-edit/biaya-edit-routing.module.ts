import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BiayaEditPage } from './biaya-edit.page';

const routes: Routes = [
  {
    path: '',
    component: BiayaEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BiayaEditPageRoutingModule {}
