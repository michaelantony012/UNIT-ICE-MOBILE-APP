import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesEditPageRoutingModule } from './sales-edit-routing.module';

import { SalesEditPage } from './sales-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesEditPageRoutingModule
  ],
  declarations: [SalesEditPage]
})
export class SalesEditPageModule {}
