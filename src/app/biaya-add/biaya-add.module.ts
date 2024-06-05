import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BiayaAddPageRoutingModule } from './biaya-add-routing.module';

import { BiayaAddPage } from './biaya-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BiayaAddPageRoutingModule
  ],
  declarations: [BiayaAddPage]
})
export class BiayaAddPageModule {}
