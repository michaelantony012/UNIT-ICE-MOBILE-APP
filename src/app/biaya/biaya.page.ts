import { Component, OnInit, Injector, LOCALE_ID } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-biaya',
  templateUrl: './biaya.page.html',
  styleUrls: ['./biaya.page.scss'],
})
export class BiayaPage implements OnInit {
  DaftarBiaya : { biaya_id:number, keterangan: string, total_biaya: number }[] = [];
  
  localeId: string;

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private nav:NavController,
    private route: Router,
    private injector: Injector) {
      //https://stackoverflow.com/questions/73580402/how-can-i-by-default-display-decimal-numbers-in-ionic-angular-app-in-correct-loc
      this.localeId = this.injector.get(LOCALE_ID); }

  async ngOnInit() {
    await this.storage.create();

  }
  ionViewWillEnter(){
    // Actions
  }
  ionViewDidEnter(){
    // Actions
    this.getData();
  }
  // // Or to get a key/value pair
  getData(){
    this.storage.get('DaftarBiaya').then((val) => {
      
      this.DaftarBiaya = val;
      // console.log(this.DaftarBiaya);
      // this.presentToast('Your data is here');
    });
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }

  async edit(biaya_id: number){
    // console.log(biaya_id);
    await this.storage.set('biaya_edit_id', biaya_id);
    const loadingIndicator = await this.showLoadingIndictator();
    this.nav.navigateForward('/biaya-edit');
    loadingIndicator.dismiss();
  }

  async back()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    
    this.route.navigate(['/home'], { replaceUrl: true });
    loadingIndicator.dismiss();
  }
  
  async delete(biaya_id: number){
    const loadingIndicator = await this.showLoadingIndictator();
    
    // delete the item from DaftarBiaya
    // https://chatgpt.com/share/9855cc5a-fcc9-4500-bc07-c239df4f4c81
    // Find the index of the item with id
    const index = this.DaftarBiaya.findIndex(item => item.biaya_id === biaya_id);

    if (index !== -1) {
      // Remove the item at that index
      this.DaftarBiaya.splice(index, 1);
    }

    loadingIndicator.dismiss();
  }

  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }
  async add(){
    const loadingIndicator = await this.showLoadingIndictator();
    this.nav.navigateForward('/biaya-add');
    loadingIndicator.dismiss();
  }

}
