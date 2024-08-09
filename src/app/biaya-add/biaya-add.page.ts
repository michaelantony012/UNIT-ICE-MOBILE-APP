import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-biaya-add',
  templateUrl: './biaya-add.page.html',
  styleUrls: ['./biaya-add.page.scss'],
})
export class BiayaAddPage implements OnInit {
  input_keterangan: string = "";
  input_total_biaya: number = 0;
  input_jenisbiaya_id: number = 0;
  DaftarBiaya : any;
  DaftarJenisBiaya: any;

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private nav:NavController,
    private route: Router) { }

  async ngOnInit() {
    await this.storage.create();
    
    // jika local strg DaftarBiaya kosong, inisialisasi dengan array kosong
    if(await this.storage.get('DaftarBiaya') == null) {
      this.storage.set('DaftarBiaya', []);
    }

    this.DaftarJenisBiaya = await this.storage.get('DaftarJenisBiaya');
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

    if(this.input_keterangan == "" || (this.input_total_biaya ?? 0) == 0 || this.input_jenisbiaya_id == 0)
    {
      this.presentToast("Harap lengkapi data");
    }
    else
    {
      this.storage.get('DaftarBiaya').then((val) => {
        this.DaftarBiaya = val;
        let biaya_id = this.DaftarBiaya.length;
        this.DaftarBiaya.push({"biaya_id":biaya_id+1, "keterangan": this.input_keterangan, "total_biaya": parseInt((this.input_total_biaya ? this.input_total_biaya : 0).toString()), "jenisbiaya_id": this.input_jenisbiaya_id});
        this.storage.set('DaftarBiaya', this.DaftarBiaya);
      });
      
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
