import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesCustAddPageRoutingModule } from './sales-cust-add-routing.module';

import { SalesCustAddPage } from './sales-cust-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesCustAddPageRoutingModule
  ],
  declarations: [SalesCustAddPage]
})
export class SalesCustAddPageModule {}
