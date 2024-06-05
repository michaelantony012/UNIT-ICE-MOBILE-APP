import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-biaya-edit',
  templateUrl: './biaya-edit.page.html',
  styleUrls: ['./biaya-edit.page.scss'],
})
export class BiayaEditPage implements OnInit {
  input_keterangan: string = "";
  input_total_biaya: number = 0;
  biaya_id: number = 0;
  DaftarBiaya : { biaya_id:number, keterangan: string, total_biaya:number }[] = [];

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private nav:NavController,
    private route: Router) { }

  async ngOnInit() {
    await this.storage.create();

  }
  async ionViewDidEnter()
  {
    // ambil data yg diperlukan dari storage, isikan ke variable
    this.storage.get('DaftarBiaya').then((val) => {
      this.DaftarBiaya = JSON.parse(val);
    });
    // biaya_id yang mau diedit
    this.biaya_id = await this.storage.get('biaya_edit_id');
    // isi data ke form input
    this.isiDataKeForm(this.biaya_id);
  }
  async saveAndBack(){
    // this.storage.set('biaya_edit_id', biaya_id);
    const loadingIndicator = await this.showLoadingIndictator();

    if(this.input_keterangan == "" || this.input_total_biaya == 0)
    {
      this.presentToast("Harap lengkapi data");
    }
    else
    {
      this.updateDataDariForm(this.biaya_id, this.input_keterangan, this.input_total_biaya); // update data inside DaftarBiaya
      
      this.storage.set('DaftarBiaya', JSON.stringify(this.DaftarBiaya)); // put the data back into local storage

      // // https://stackoverflow.com/questions/57915373/to-remove-the-previous-pages-from-stack-in-angular-routing
      this.route.navigate(['/biaya'], { replaceUrl: true });
    }

    loadingIndicator.dismiss();
  }
  async cancel()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    this.route.navigate(['/biaya'], { replaceUrl: true });

    loadingIndicator.dismiss();
  }
  updateDataDariForm(biaya_id: number, keterangan: string, total_biaya: number)
  {
    this.DaftarBiaya.forEach((element: { biaya_id: number, keterangan: string, total_biaya: number}) => {
        if(element.biaya_id === biaya_id)
        {
          element.keterangan = keterangan;
          element.total_biaya = total_biaya;
        }
    });
  }
  async isiDataKeForm(biaya_id: number)
  {
    this.DaftarBiaya.forEach((element: { biaya_id: number, keterangan: string, total_biaya: number}) => {
        if(element.biaya_id === biaya_id)
        {
          this.input_keterangan = element.keterangan;
          this.input_total_biaya = element.total_biaya;
        }
    });
  }
  
  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }
  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }

}
