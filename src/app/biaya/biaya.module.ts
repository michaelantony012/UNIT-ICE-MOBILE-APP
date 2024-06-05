import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BiayaPageRoutingModule } from './biaya-routing.module';

import { BiayaPage } from './biaya.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BiayaPageRoutingModule
  ],
  declarations: [BiayaPage]
})
export class BiayaPageModule {}
