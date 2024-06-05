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
  DaftarBiaya : any;

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
      this.storage.set('DaftarBiaya', '[]');
    }
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
      this.storage.get('DaftarBiaya').then((val) => {
        this.DaftarBiaya = JSON.parse(val);
        let biaya_id = this.DaftarBiaya.length;
        this.DaftarBiaya.push({"biaya_id":biaya_id+1, "keterangan": this.input_keterangan, "total_biaya": this.input_total_biaya});
        this.storage.set('DaftarBiaya', JSON.stringify(this.DaftarBiaya));
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
