import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BleClient, BleService, BluetoothLe, textToDataView } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  dataSalesStart: any;
  userlogin: any;
  doc_no: any = '';
  dataLogout: any = '';
  DaftarSalesItem : {cust_order: number, cust_id: number, cust_name: string, cust_remark: string, cust_type: number,
    nilai_piutang: number, nilai_cicilan: number, nilai_cash: number, item1_qty: number, item2_qty: number, cust_edited: number}[] = [];
  sum_piutang: any = 0;
  sum_cicilan: any = 0;
  sum_cash: any = 0;
  sum_item1: any = 0;
  sum_item2: any = 0;
  sum_biaya: any = 0;
  DaftarBiaya : { biaya_id:number, keterangan: string, total_biaya: number }[] = [];
  
  deviceId:any='86:67:7A:13:88:74';

  // Confirmation Dialog untuk Finish button
  // https://ionicframework.com/docs/api/alert#buttons
  public buttonFinishAlert = [
    {
      text: 'Cancel',
      role: 'cancel',
      // handler: () => { console.log('Alert canceled'); },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        // console.log('Alert confirmed');
        this.finish();
      },
    },
  ];

  // Confirmation Dialog Sign Out
  public buttonSignOutAlert = [
    {
      text: 'Cancel',
      role: 'cancel',
      // handler: () => { console.log('Alert canceled'); },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        // console.log('Alert confirmed');
        this.signOut();
      },
    },
  ];
  
  // Confirmation Dialog Start
  public buttonStartAlert = [
    {
      text: 'Cancel',
      role: 'cancel',
      // handler: () => { console.log('Alert canceled'); },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        // console.log('Alert confirmed');
        this.start();
      },
    },
  ];

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private http: HttpClient) { }

  async ngOnInit() {
    await this.storage.create();

    this.Initialize();
  }
  async ionViewDidEnter(){
    // set disabled & enabled button
    await this.storage.get('doc_no').then( res => this.doc_no = res );
    await this.storage.get('userlogin_userlogin').then( res => this.userlogin = res );
    if(this.doc_no == '' || this.doc_no == null)
    {
      (<HTMLInputElement> document.getElementById("btn-sales")).disabled = true;
      (<HTMLInputElement> document.getElementById("btn-biaya")).disabled = true;
      (<HTMLInputElement> document.getElementById("btn-finish")).disabled = true;
    }
    else
    {
      (<HTMLInputElement> document.getElementById("btn-start")).disabled = true;
    }

    // get summary data
    await this.storage.get('DaftarSalesItem').then((val) => {
      
      // console.log(JSON.stringify(val));
      this.DaftarSalesItem = val;
    });
    await this.storage.get('DaftarBiaya').then((val) => {
      
      this.DaftarBiaya = JSON.parse(val);
    });
    
    this.sum_piutang = 0;
    this.sum_cicilan = 0;
    this.sum_cash = 0;
    this.sum_item1 = 0;
    this.sum_item2 = 0;
    this.sum_biaya = 0;

    if(this.DaftarSalesItem !== null)
    {
      // https://chatgpt.com/share/214d3e88-4dd2-4cdb-ba4f-fc682146f158
      let result = this.DaftarSalesItem.reduce((acc, item) => {
        this.sum_piutang += item.nilai_piutang
        this.sum_cicilan += item.nilai_cicilan
        this.sum_cash += item.nilai_cash
        this.sum_item1 += item.item1_qty
        this.sum_item2 += item.item2_qty
        return acc;
      }/*, {sum_piutang: 0, sum_cicilan: 0, sum_cash: 0, sum_item1: 0, sum_item2: 0}*/);
    }
    if(this.DaftarBiaya !== null)
    {
      let result2 = this.DaftarBiaya.reduce((acc, item) => {
        this.sum_biaya += item.total_biaya
        return acc;
      });
    }
    
    // console.log("sum_piutang: "+result.sum_piutang);
    // console.log("sum_cicilan: "+result.sum_cicilan);
    // console.log("sum_cash: "+result.sum_cash);
    // console.log("sum_item1: "+result.sum_item1);
    // console.log("sum_item2: "+result.sum_item2);
  }

  // PRINTER BLE
  async searchPrinter() {
    await this.VerifyAndEnabled();
    await this.Initialize();

    let bleDevice = await BleClient.requestDevice({ allowDuplicates: false });
    if (bleDevice) {
      await BleClient.connect(bleDevice.deviceId, this.Disconnect);
      await this.storage.set('SYS_PRINTER_DEVICE_ID',bleDevice.deviceId);

      await this.AssignServices();
      
      this.presentToast('Connected to Printer');
    }
  }
  async AssignServices() {
    const deviceId = await this.storage.get('SYS_PRINTER_DEVICE_ID');
    let bleService: BleService[] = await BleClient.getServices(this.deviceId);
    if (bleService.length > 0 && bleService[0].characteristics.length > 0) {
      this.storage.set('SYS_PRINTER_SERVICE_UUID', bleService[0].uuid);
      this.storage.set('SYS_PRINTER_CHARACTERISTIC_UUID', bleService[0].characteristics[0].uuid);
    }
  }

  async Initialize() {
    await BleClient.initialize({ androidNeverForLocation: true });
  }

  async Connect(deviceId: string) {
    await BleClient.connect(deviceId);
  }

  async Disconnect(deviceId: string) {
    await BleClient.disconnect(deviceId);
  }

  async VerifyAndEnabled() {
    if (!await BleClient.isEnabled()) {
      await BleClient.enable();
    }
  }
  
  async sales() {
    // Display loading indicator while Auth Connect login window is open
    const loadingIndicator = await this.showLoadingIndictator();
    
    await this.router.navigate(['/sales']);
    loadingIndicator.dismiss();
  }
  async biaya() {
    // Display loading indicator while Auth Connect login window is open
    const loadingIndicator = await this.showLoadingIndictator();
    
    await this.router.navigate(['/biaya']);
    loadingIndicator.dismiss();
  }
  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }
  async start(){
    const loading = await this.loadingController.create({
      cssClass: 'loading-custom',
      message: 'Please wait...'
    });
    await loading.present(); 
    
    const tokenapps = await this.storage.get('userlogin_tokenapps');
    // console.log(tokenapps);
    var formData : FormData = new FormData();
    formData.set('tokenapps', tokenapps);

    this.http.post('https://project.graylite.com/unitice/mobile/start.php', formData)
    .subscribe((data) => {
      // console.log('data', data);
      this.dataSalesStart=data;
      if(this.dataSalesStart.error==true){
        this.presentToast(this.dataSalesStart.message);
      }else{
        this.presentToast(this.dataSalesStart.message);
        this.storage.set('doc_no', this.dataSalesStart.doc_no);
        this.storage.set('doc_id',this.dataSalesStart.doc_id);
        this.storage.set('DaftarSalesItem',this.dataSalesStart.DaftarSalesItem);
        this.doc_no = this.dataSalesStart.doc_no;

        
        (<HTMLInputElement> document.getElementById("btn-sales")).disabled = false;
        (<HTMLInputElement> document.getElementById("btn-biaya")).disabled = false;
        (<HTMLInputElement> document.getElementById("btn-start")).disabled = true;
        (<HTMLInputElement> document.getElementById("btn-finish")).disabled = false;
      }
      loading.dismiss();
    },
    error => {
      let message='Failed to sync data, please re-open App!';
        this.presentToast(message);
        loading.dismiss();
    });

    loading.dismiss();
  }

  async finish()
  {
    const loading = await this.loadingController.create({
      cssClass: 'loading-custom',
      message: 'Please wait...'
    });
    await loading.present(); 

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
    formData.set('DaftarBiaya', daftarbiaya);

    this.http.post('https://project.graylite.com/unitice/mobile/finish.php', formData)
    .subscribe((data) => {
      // console.log('data', data);
      this.dataSalesStart=data;
      if(this.dataSalesStart.error==true){
        this.presentToast(this.dataSalesStart.message);
      }else{
        this.presentToast(this.dataSalesStart.message);
        this.storage.remove('doc_no');
        this.storage.remove('doc_id');
        this.storage.remove('DaftarSalesItem');
        this.storage.remove('DaftarBiaya');
        this.doc_no = '';

        (<HTMLInputElement> document.getElementById("btn-sales")).disabled = true;
        (<HTMLInputElement> document.getElementById("btn-biaya")).disabled = true;
        (<HTMLInputElement> document.getElementById("btn-start")).disabled = false;
        (<HTMLInputElement> document.getElementById("btn-finish")).disabled = true;
      }
      loading.dismiss();
    },
    error => {
      let message='Failed to sync data, please re-open App!';
        this.presentToast(message);
        loading.dismiss();
    });

    loading.dismiss();
  }
  async history()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    await this.router.navigate(['/sales-history']);
    loadingIndicator.dismiss();
  }
  async changePassword()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    await this.router.navigate(['/change-password']);
    loadingIndicator.dismiss();
  }
  async signOut()
  {
    const loading = await this.loadingController.create({
      cssClass: 'loading-custom',
      message: 'Please wait...'
    });
    await loading.present(); 
    const tokenapps = await this.storage.get('userlogin_tokenapps');
    // console.log(tokenapps);
    var formData : FormData = new FormData();
    formData.set('tokenapps', tokenapps);

    this.http.post('https://project.graylite.com/unitice/mobile/logout.php', formData)
    .subscribe((data) => {
      // console.log('data', data);
      this.dataLogout=data;
      if(this.dataLogout.error==true){
        this.presentToast(this.dataLogout.message);
      }else{
        this.presentToast(this.dataLogout.message);
        
        this.storage.remove('userlogin_tokenapps');
        this.storage.remove('userlogin_userlogin');
        this.storage.remove('userlogin_tanggal');
        this.storage.remove('userlogin_ccid');

        this.router.navigate(['/'], { replaceUrl: true });
      }
      loading.dismiss();
    },
    error => {
      let message='Failed to sync data, please re-open App!';
        this.presentToast(message);
        loading.dismiss();
    });

    loading.dismiss();
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
