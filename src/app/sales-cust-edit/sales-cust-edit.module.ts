import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesCustEditPageRoutingModule } from './sales-cust-edit-routing.module';

import { SalesCustEditPage } from './sales-cust-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesCustEditPageRoutingModule
  ],
  declarations: [SalesCustEditPage]
})
export class SalesCustEditPageModule {}
