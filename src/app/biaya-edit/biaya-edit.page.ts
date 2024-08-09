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
  input_jenisbiaya_id: number = 0;
  biaya_id: number = 0;
  DaftarBiaya : { biaya_id:number, keterangan: string, total_biaya:number, jenisbiaya_id: number }[] = [];
  DaftarJenisBiaya: any;

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private nav:NavController,
    private route: Router) { }

  async ngOnInit() {
    await this.storage.create();
    
    this.DaftarJenisBiaya = await this.storage.get('DaftarJenisBiaya');
  }
  async ionViewDidEnter()
  {
    // ambil data yg diperlukan dari storage, isikan ke variable
    this.storage.get('DaftarBiaya').then((val) => {
      this.DaftarBiaya = val;
    });
    // biaya_id yang mau diedit
    this.biaya_id = await this.storage.get('biaya_edit_id');
    // isi data ke form input
    this.isiDataKeForm(this.biaya_id);
  }

  // https://chatgpt.com/share/6260bdde-646c-4adb-997c-067ed219b185
  // Remove leading zeros
  onTotalBiayaChange(event: any): void {
    let value = event.detail.value;

    // Remove first leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_total_biaya = value;
  }

  async saveAndBack(){
    // this.storage.set('biaya_edit_id', biaya_id);
    const loadingIndicator = await this.showLoadingIndictator();

    if(this.input_keterangan == "" || this.input_total_biaya == 0 || this.input_jenisbiaya_id == 0)
    {
      this.presentToast("Harap lengkapi data");
    }
    else
    {
      console.log(this.input_total_biaya);
      this.updateDataDariForm(this.biaya_id, this.input_keterangan, (this.input_total_biaya ? this.input_total_biaya : 0), this.input_jenisbiaya_id); // update data inside DaftarBiaya
      
      this.storage.set('DaftarBiaya', this.DaftarBiaya); // put the data back into local storage

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
  updateDataDariForm(biaya_id: number, keterangan: string, total_biaya: number, jenisbiaya_id: number)
  {
    this.DaftarBiaya.forEach((element: { biaya_id: number, keterangan: string, total_biaya: number, jenisbiaya_id: number}) => {
        if(element.biaya_id === biaya_id)
        {
          element.keterangan = keterangan;
          element.total_biaya = parseInt(total_biaya.toString());
          element.jenisbiaya_id = jenisbiaya_id;
        }
    });
  }
  async isiDataKeForm(biaya_id: number)
  {
    this.DaftarBiaya.forEach((element: { biaya_id: number, keterangan: string, total_biaya: number, jenisbiaya_id: number}) => {
        if(element.biaya_id === biaya_id)
        {
          this.input_keterangan = element.keterangan;
          this.input_total_biaya = element.total_biaya;
          this.input_jenisbiaya_id = element.jenisbiaya_id;
        }
    });
  }
  
  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Please wait...',
      duration: 10000
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
