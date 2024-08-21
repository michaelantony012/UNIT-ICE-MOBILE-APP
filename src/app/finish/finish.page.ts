import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.page.html',
  styleUrls: ['./finish.page.scss'],
})
export class FinishPage implements OnInit {

  input_item1Free: number = 0;
  input_item2Free: number = 0;
  input_item3Free: number = 0;
  input_item4Free: number = 0;
  input_item5Free: number = 0;
  
  input_item1Retur: number = 0;
  input_item2Retur: number = 0;
  input_item3Retur: number = 0;
  input_item4Retur: number = 0;
  input_item5Retur: number = 0;
  
  dataSalesStart: any;

  ware_id: number = 0;

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private route: Router,
    private http: HttpClient,
    private nav:NavController) { }

  async ngOnInit() {
    await this.storage.create();
  }

  async ionViewDidEnter(){
    const loadingIndicator = await this.showLoadingIndictator();

    await this.storage.get('userlogin_wareid').then( res => this.ware_id = res );
    
    loadingIndicator.dismiss();
  }
  
  async finish()
  {
    const loadingIndicator = await this.showLoadingIndictator();

    const tokenapps = await this.storage.get('userlogin_tokenapps');
    const daftarsalesitem = await this.storage.get('DaftarSalesItem');
    const daftarbiaya = await this.storage.get('DaftarBiaya');
    const doc_id = await this.storage.get('doc_id');
    const doc_no = await this.storage.get('doc_no');
    // console.log(tokenapps);
    var formData : FormData = new FormData();
    formData.set('tokenapps', tokenapps);
    formData.set('doc_id', doc_id);
    formData.set('doc_no', doc_no);
    formData.set('DaftarSalesItem', JSON.stringify(daftarsalesitem));
    formData.set('DaftarBiaya', JSON.stringify(daftarbiaya));

    formData.set('item1_retur', this.input_item1Retur.toString());
    formData.set('item2_retur', this.input_item2Retur.toString());
    formData.set('item3_retur', this.input_item3Retur.toString());
    formData.set('item4_retur', this.input_item4Retur.toString());
    formData.set('item5_retur', this.input_item5Retur.toString());
    
    formData.set('item1_free', this.input_item1Free.toString());
    formData.set('item2_free', this.input_item2Free.toString());
    formData.set('item3_free', this.input_item3Free.toString());
    formData.set('item4_free', this.input_item4Free.toString());
    formData.set('item5_free', this.input_item5Free.toString());

    this.http.post('https://project.graylite.com/unitice/mobile/finish.php', formData)
    .subscribe(async (data) => {
      // console.log('data', data);
      this.dataSalesStart=data;
      if(this.dataSalesStart.error==true){
        this.presentToast(this.dataSalesStart.message);
        // console.log(this.dataSalesStart.message);
      }else{
        this.presentToast(this.dataSalesStart.message);
        await this.storage.remove('doc_no');
        await this.storage.remove('doc_id');
        await this.storage.remove('doc_no_nota');
        await this.storage.remove('doc_kode_nota_terakhir');
        await this.storage.remove('doc_item1_SJE');
        await this.storage.remove('doc_item2_SJE');
        await this.storage.remove('doc_item3_SJE');
        await this.storage.remove('doc_item4_SJE');
        await this.storage.remove('doc_item5_SJE');
        await this.storage.remove('sales_cust_id_add');
        await this.storage.remove('DaftarSalesItem');
        await this.storage.remove('DaftarBiaya');
        
        await this.route.navigate(['/home'], { replaceUrl: true });

        // this.doc_no = ''; this.sum_cash = 0; this.sum_BB = 0; this.sum_tagihan_BB = 0; this.sum_tagihan_credit = 0; this.sum_item1 = 0; this.sum_item2 = 0; this.sum_item3 = 0; this.sum_item4 = 0; this.sum_item5 = 0; this.sum_biaya = 0; (<HTMLInputElement> document.getElementById("btn-sales")).disabled = true; (<HTMLInputElement> document.getElementById("btn-biaya")).disabled = true; (<HTMLInputElement> document.getElementById("btn-start00")).disabled = false; (<HTMLInputElement> document.getElementById("btn-finish")).disabled = true;
      }
      loadingIndicator.dismiss();
    },
    error => {
      let message='Failed to sync data, please re-open App!';
        this.presentToast(message);
        loadingIndicator.dismiss();
    });

    loadingIndicator.dismiss();
  }
  async back()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    // await this.save();
    
    this.route.navigate(['/home'], { replaceUrl: true });
    loadingIndicator.dismiss();
  }

  
  // Confirmation Dialog untuk Finish button
  public buttonFinishAlert = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.finish();
      },
    },
  ];

  
  // item 1 Free
  onItem1FreeChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item1Free = value;
  }
  // item 2 Free
  onItem2FreeChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item2Free = value;
  }
  // item 3 Free
  onItem3FreeChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item3Free = value;
  }
  // item 4 Free
  onItem4FreeChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item4Free = value;
  }
  // item 5 Free
  onItem5FreeChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item5Free = value;
  }

  // item 1 Retur
  onItem1ReturChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item1Retur = value;
  }
  // item 2 Retur
  onItem2ReturChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item2Retur = value;
  }
  // item 3 Retur
  onItem3ReturChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item3Retur = value;
  }
  // item 4 Retur
  onItem4ReturChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item4Retur = value;
  }
  // item 5 Retur
  onItem5ReturChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item5Retur = value;
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
