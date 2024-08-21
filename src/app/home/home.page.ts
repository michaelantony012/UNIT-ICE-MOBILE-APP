import { Component, OnInit, Injector, LOCALE_ID } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BleClient, BleService, BluetoothLe, textToDataView } from '@capacitor-community/bluetooth-le';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  dataSalesStart: any;
  dataSalesStart00: any;
  userlogin: any;
  doc_no: any = '';
  dataLogout: any = '';
  DaftarSalesItem : {cust_order: number, cust_id: number, cust_name: string, cust_remark: string, cust_type: number,
    payment_type: number, nilai_BB: number, nilai_credit: number,
    item1_qty: number, item2_qty: number, item3_qty: number, item4_qty: number, item5_qty: number,
    item1_qtyfree: number, item2_qtyfree: number, item3_qtyfree: number, item4_qtyfree: number, item5_qtyfree: number,
    item1_qtyretur: number, item2_qtyretur: number, item3_qtyretur: number, item4_qtyretur: number, item5_qtyretur: number,
    item1_price: number, item2_price: number, item3_price: number, item4_price: number, item5_price: number,
    cust_edited: number, cust_added: number, nomor_nota: string}[] = [];
  sum_cash: any = 0;
  sum_BB: any = 0;
  sum_tagihan_BB: any = 0;
  sum_tagihan_credit: any = 0;
  sum_item1: any = 0;
  sum_item2: any = 0;
  sum_item3: any = 0;
  sum_item4: any = 0;
  sum_item5: any = 0;
  // free
  sum_item1free: any = 0;
  sum_item2free: any = 0;
  sum_item3free: any = 0;
  sum_item4free: any = 0;
  sum_item5free: any = 0;

  // retur
  sum_item1retur: any = 0;
  sum_item2retur: any = 0;
  sum_item3retur: any = 0;
  sum_item4retur: any = 0;
  sum_item5retur: any = 0;

  sum_biaya: any = 0;
  DaftarBiaya : { biaya_id:number, keterangan: string, total_biaya: number }[] = [];
  item1_desc: string = '';
  item2_desc: string = '';
  item3_desc: string = '';
  item4_desc: string = '';
  item5_desc: string = '';
  
  localeId: string;

  DaftarMarketing : { sales_id: number, sales_name: string, sales_no: string }[] = [];
  DaftarTruck : { truck_id: number, truck_nopol: string }[] = [];

  sales_id1: number = 0;
  sales_id2: number = 0;
  sales_id3: number = 0;
  truck_id: number = 0;
  start00flag: number = 0;

  ware_city: any;
  ware_id: number = 0;
  input_item1SJE: number = 0;
  input_item2SJE: number = 0;
  input_item3SJE: number = 0;
  input_item4SJE: number = 0;
  input_item5SJE: number = 0;

  item1_SJE: number = 0;
  item2_SJE: number = 0;
  item3_SJE: number = 0;
  item4_SJE: number = 0;
  item5_SJE: number = 0;

  item1_totalqty: number = 0;
  item2_totalqty: number = 0;
  item3_totalqty: number = 0;
  item4_totalqty: number = 0;
  item5_totalqty: number = 0;

  // Confirmation Dialog untuk Finish button
  // https://ionicframework.com/docs/api/alert#buttons
  /*public buttonFinishAlert = [
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
  ];*/

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
    private http: HttpClient,
    private injector: Injector) {
      //https://stackoverflow.com/questions/73580402/how-can-i-by-default-display-decimal-numbers-in-ionic-angular-app-in-correct-loc
      this.localeId = this.injector.get(LOCALE_ID);
    }

  async ngOnInit() {
    await this.storage.create();

    this.Initialize();
    
    // https://stackoverflow.com/a/50886941/10126635
    registerLocaleData( en );
  }
  async ionViewDidEnter(){
    const loading = await this.loadingController.create({
      cssClass: 'loading-custom',
      message: 'Please wait...'
    });
    await loading.present(); 
    
    // set disabled & enabled button
    await this.storage.get('doc_no').then( res => this.doc_no = res??"" );
    await this.storage.get('userlogin_userlogin').then( res => this.userlogin = res );
    await this.storage.get('userlogin_warecity').then( res => this.ware_city = res );
    await this.storage.get('userlogin_wareid').then( res => this.ware_id = res );
      
    await this.storage.get('doc_item1_SJE').then( res => this.item1_SJE = res );
    await this.storage.get('doc_item2_SJE').then( res => this.item2_SJE = res );
    await this.storage.get('doc_item3_SJE').then( res => this.item3_SJE = res );
    await this.storage.get('doc_item4_SJE').then( res => this.item4_SJE = res );
    await this.storage.get('doc_item5_SJE').then( res => this.item5_SJE = res );

    if(this.doc_no == '' || this.doc_no == null)
    {
      (<HTMLInputElement> document.getElementById("btn-sales")).disabled = true;
      (<HTMLInputElement> document.getElementById("btn-biaya")).disabled = true;
      (<HTMLInputElement> document.getElementById("btn-finish")).disabled = true;
      (<HTMLInputElement> document.getElementById("btn-start00")).disabled = false;
    }
    else
    {
      (<HTMLInputElement> document.getElementById("btn-start00")).disabled = true;

      // get summary data
      await this.storage.get('DaftarSalesItem').then((val) => {
        
        // console.log(JSON.stringify(val));
        this.DaftarSalesItem = val;
      });
      await this.storage.get('DaftarBiaya').then((val) => {
        
        this.DaftarBiaya = val;
      });
      // await this.storage.get('DaftarNamaItem').then((val) => {
        
      //   this.item1_desc = val[0]['item1_name'];
      //   this.item2_desc = val[0]['item2_name'];
      //   this.item3_desc = val[0]['item3_name'];
      //   this.item4_desc = val[0]['item4_name'];
      //   this.item5_desc = val[0]['item5_name'];
      // });
      
      this.sum_cash = 0;
      this.sum_BB = 0;
      this.sum_tagihan_BB = 0;
      this.sum_tagihan_credit = 0;
      this.sum_item1 = 0;
      this.sum_item2 = 0;
      this.sum_item3 = 0;
      this.sum_item4 = 0;
      this.sum_item5 = 0;
      this.sum_biaya = 0;
      
      this.sum_item1free = 0;
      this.sum_item2free = 0;
      this.sum_item3free = 0;
      this.sum_item4free = 0;
      this.sum_item5free = 0;
      
      this.sum_item1retur = 0;
      this.sum_item2retur = 0;
      this.sum_item3retur = 0;
      this.sum_item4retur = 0;
      this.sum_item5retur = 0;

      this.item1_totalqty = 0;
      this.item2_totalqty = 0;
      this.item3_totalqty = 0;
      this.item4_totalqty = 0;
      this.item5_totalqty = 0;

      if(this.DaftarSalesItem !== null)
      {
        // https://chatgpt.com/share/214d3e88-4dd2-4cdb-ba4f-fc682146f158
        let result = this.DaftarSalesItem.reduce((acc, item) => {

          this.sum_tagihan_BB += item.nilai_BB
          this.sum_tagihan_credit += item.nilai_credit

          this.sum_item1 += item.item1_qty * item.item1_price
          this.sum_item2 += item.item2_qty * item.item2_price
          this.sum_item3 += item.item3_qty * item.item3_price
          this.sum_item4 += item.item4_qty * item.item4_price
          this.sum_item5 += item.item5_qty * item.item5_price
          // // free
          // this.sum_item1free += item.item1_qtyfree * item.item1_price
          // this.sum_item2free += item.item2_qtyfree * item.item2_price
          // this.sum_item3free += item.item3_qtyfree * item.item3_price
          // this.sum_item4free += item.item4_qtyfree * item.item4_price
          // this.sum_item5free += item.item5_qtyfree * item.item5_price

          // // retur
          // this.sum_item1retur += item.item1_qtyretur * item.item1_price
          // this.sum_item2retur += item.item2_qtyretur * item.item2_price
          // this.sum_item3retur += item.item3_qtyretur * item.item3_price
          // this.sum_item4retur += item.item4_qtyretur * item.item4_price
          // this.sum_item5retur += item.item5_qtyretur * item.item5_price

          // item total qty
          this.item1_totalqty += item.item1_qty
          this.item2_totalqty += item.item2_qty
          this.item3_totalqty += item.item3_qty
          this.item4_totalqty += item.item4_qty
          this.item5_totalqty += item.item5_qty
          
          if(item.payment_type == 1) // Cash
          {
            this.sum_cash += item.item1_qty * item.item1_price +
            item.item2_qty * item.item2_price +
            item.item3_qty * item.item3_price +
            item.item4_qty * item.item4_price +
            item.item5_qty * item.item5_price;

          }
          else if(item.payment_type == 2) // BB
          {
            this.sum_BB += item.item1_qty * item.item1_price +
            item.item2_qty * item.item2_price +
            item.item3_qty * item.item3_price +
            item.item4_qty * item.item4_price +
            item.item5_qty * item.item5_price;
          }
          
          return acc;
        }, {sum_cash: 0, sum_item1: 0, sum_item2: 0, sum_item3: 0, sum_item4: 0, sum_item5: 0});
      }
      if(this.DaftarBiaya !== null)
      {
        let result2 = this.DaftarBiaya.reduce((acc, item) => {
          this.sum_biaya += item.total_biaya
          return acc;
        }, {sum_biaya: 0});
        // console.log("Biaya: "+this.sum_biaya);
      }
    }
    
    loading.dismiss();

    // console.log("sum_piutang: "+this.sum_piutang);
    // console.log("sum_cicilan: "+result.sum_cicilan);
    // console.log("sum_cash: "+result.sum_cash);
    // console.log("sum_item1: "+result.sum_item1);
    // console.log("sum_item2: "+result.sum_item2);
    // console.log(this.doc_no);
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
      
      this.presentToast('Koneksi dengan Printer berhasil.');
    }
  }
  async AssignServices() {
    const deviceId = await this.storage.get('SYS_PRINTER_DEVICE_ID');
    let bleService: BleService[] = await BleClient.getServices(deviceId);
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
      duration: 10000
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }
  async start00()
  {
    const loading = await this.loadingController.create({
      cssClass: 'loading-custom',
      message: 'Please wait...'
    });
    await loading.present(); 

    const tokenapps = await this.storage.get('userlogin_tokenapps');
    const wareid = await this.storage.get('userlogin_wareid');
    // console.log(tokenapps);
    var formData : FormData = new FormData();
    formData.set('tokenapps', tokenapps);
    formData.set('ware_id',wareid);

    this.http.post('https://project.graylite.com/unitice/mobile/start_00.php', formData)
    .subscribe((data) => {
      // console.log('data', data);
      this.dataSalesStart00=data;
      if(this.dataSalesStart00.error==true){
        this.presentToast(this.dataSalesStart00.message);
        // console.log(this.dataSalesStart00.message);
      }else{
        this.presentToast(this.dataSalesStart00.message);
        this.DaftarMarketing=this.dataSalesStart00.DaftarMarketing;
        this.DaftarTruck=this.dataSalesStart00.DaftarTruck;
      }
      loading.dismiss();
  
      this.start00flag = 1;
      (<HTMLInputElement> document.getElementById("btn-start00")).disabled = true;
    },
    error => {
      let message='Failed to sync data, please re-open App!';
        this.presentToast(message);
        loading.dismiss();
    });

    loading.dismiss();
  }

  async start(){
    const loading = await this.loadingController.create({
      cssClass: 'loading-custom',
      message: 'Please wait...'
    });
    await loading.present(); 

    if(this.sales_id1==0 || this.sales_id2==0 || this.truck_id==0)
    {
      this.presentToast("Anda belum memilih Sales / Truck!");
    }
    else if(this.input_item1SJE + this.input_item2SJE + this.input_item3SJE + this.input_item4SJE + this.input_item5SJE == 0)
    {
      this.presentToast("Anda belum mengisi jumlah item SJE!");
    }
    else
    {
      const tokenapps = await this.storage.get('userlogin_tokenapps');
      const wareid = await this.storage.get('userlogin_wareid');
      // console.log(tokenapps);
      var formData : FormData = new FormData();
      formData.set('tokenapps', tokenapps);
      formData.set('sales_id1', this.sales_id1.toString());
      formData.set('sales_id2', this.sales_id2.toString());
      formData.set('sales_id3', this.sales_id3.toString());
      formData.set('truck_id', this.truck_id.toString());
      formData.set('ware_id', wareid.toString());
      formData.set('input_item1SJE', this.input_item1SJE.toString());
      formData.set('input_item2SJE', this.input_item2SJE.toString());
      formData.set('input_item3SJE', this.input_item3SJE.toString());
      formData.set('input_item4SJE', this.input_item4SJE.toString());
      formData.set('input_item5SJE', this.input_item5SJE.toString());

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
          this.storage.set('doc_no_nota', this.dataSalesStart.doc_no_nota);
          this.storage.set('doc_kode_nota_terakhir', 0);
          this.storage.set('DaftarSalesItem',this.dataSalesStart.DaftarSalesItem);
          this.storage.set('DaftarJenisBiaya',this.dataSalesStart.DaftarJenisBiaya);
          this.storage.set('DaftarNamaItem',this.dataSalesStart.DaftarNamaItem);
          this.storage.set('DaftarHargaItem',this.dataSalesStart.DaftarHargaItem);
          this.storage.set('doc_item1_SJE', this.input_item1SJE);
          this.storage.set('doc_item2_SJE', this.input_item2SJE);
          this.storage.set('doc_item3_SJE', this.input_item3SJE);
          this.storage.set('doc_item4_SJE', this.input_item4SJE);
          this.storage.set('doc_item5_SJE', this.input_item5SJE);
          this.doc_no = this.dataSalesStart.doc_no;
          
          (<HTMLInputElement> document.getElementById("btn-sales")).disabled = false;
          (<HTMLInputElement> document.getElementById("btn-biaya")).disabled = false;
          (<HTMLInputElement> document.getElementById("btn-start00")).disabled = true;
          (<HTMLInputElement> document.getElementById("btn-finish")).disabled = false;
          this.start00flag=0;

          this.sales_id1=0;
          this.sales_id2=0;
          this.sales_id3=0;
          this.truck_id=0;

          this.sum_cash = 0;
          this.sum_BB = 0;
          this.sum_tagihan_BB = 0;
          this.sum_tagihan_credit = 0;
          this.sum_item1 = 0;
          this.sum_item2 = 0;
          this.sum_item3 = 0;
          this.sum_item4 = 0;
          this.sum_item5 = 0;
          this.sum_biaya = 0;

          this.item1_totalqty = 0;
          this.item2_totalqty = 0;
          this.item3_totalqty = 0;
          this.item4_totalqty = 0;
          this.item5_totalqty = 0;

          this.item1_SJE = this.input_item1SJE;
          this.item2_SJE = this.input_item2SJE;
          this.item3_SJE = this.input_item3SJE;
          this.item4_SJE = this.input_item4SJE;
          this.item5_SJE = this.input_item5SJE;
          
          this.input_item1SJE=0;
          this.input_item2SJE=0;
          this.input_item3SJE=0;
          this.input_item4SJE=0;
          this.input_item5SJE=0;
        }
        loading.dismiss();
      },
      error => {
        let message='Failed to sync data, please re-open App!';
          this.presentToast(message);
          loading.dismiss();
      });
    }

    loading.dismiss();
  }

  async cancelStart(){
    const loading = await this.loadingController.create({
      cssClass: 'loading-custom',
      message: 'Please wait...'
    });
    await loading.present(); 
    
    this.start00flag=0;

    this.sales_id1=0;
    this.sales_id2=0;
    this.sales_id3=0;
    this.truck_id=0;
    this.input_item1SJE=0;
    this.input_item2SJE=0;
    this.input_item3SJE=0;
    this.input_item4SJE=0;
    this.input_item5SJE=0;

    (<HTMLInputElement> document.getElementById("btn-start00")).disabled = false;

    loading.dismiss();
  }

  async finish()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    
    await this.router.navigate(['/finish']);
    loadingIndicator.dismiss();
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
        this.storage.remove('userlogin_routeno');
        this.storage.remove('userlogin_wareid');
        this.storage.remove('userlogin_warename');
        this.storage.remove('userlogin_warecity');

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

  // item 1 SJE
  onItem1SJEChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item1SJE = value;
  }
  // item 2 SJE
  onItem2SJEChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item2SJE = value;
  }
  // item 3 SJE
  onItem3SJEChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item3SJE = value;
  }
  // item 4 SJE
  onItem4SJEChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item4SJE = value;
  }
  // item 5 SJE
  onItem5SJEChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item5SJE = value;
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
