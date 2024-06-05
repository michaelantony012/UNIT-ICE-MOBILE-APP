import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BiayaEditPageRoutingModule } from './biaya-edit-routing.module';

import { BiayaEditPage } from './biaya-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BiayaEditPageRoutingModule
  ],
  declarations: [BiayaEditPage]
})
export class BiayaEditPageModule {}
