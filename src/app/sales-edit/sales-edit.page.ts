import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { BleClient, BleService, BluetoothLe, textToDataView } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-sales-edit',
  templateUrl: './sales-edit.page.html',
  styleUrls: ['./sales-edit.page.scss'],
})
export class SalesEditPage implements OnInit {
  public sales_cust_id: number = 0;
  public sales_cust_name: any = '';
  public input_piutang: any;
  public input_cicilan: any;
  public input_cash: any;
  public input_item1qty: any;
  public input_item2qty: any;
  DaftarSalesItem : {cust_order: number, cust_id: number, cust_name: string, cust_remark: string, cust_type: number,
    nilai_piutang: number, nilai_cicilan: number, nilai_cash: number, item1_qty: number, item2_qty: number, cust_edited: number}[] = [];

  deviceId:any = '';
  serviceUuid:any = '';
  characteristicUuid:any = '';

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private route: Router,
    private nav:NavController) { }

  async ngOnInit() {
    await this.storage.create();
    // this.presentToast("sales_cust_id : "+this.sales_cust_id);
  }
  
  async ionViewDidEnter(){
    this.sales_cust_id = await this.storage.get('sales_cust_id');
    this.sales_cust_name = await this.storage.get('sales_cust_name');
    this.input_piutang = await this.storage.get('sales_nilai_piutang');
    this.input_cicilan = await this.storage.get('sales_nilai_cicilan');
    this.input_cash = await this.storage.get('sales_nilai_cash');
    this.input_item1qty = await this.storage.get('sales_nilai_item1qty');
    this.input_item2qty = await this.storage.get('sales_nilai_item2qty');
    
    this.storage.get('DaftarSalesItem').then((val) => {
      
      this.DaftarSalesItem = val;
    });
  }

  async salesCustEdit(cust_id:number)
  {
    this.storage.set('sales_cust_edit_id', cust_id);
    const loadingIndicator = await this.showLoadingIndictator();
    this.nav.navigateForward('/sales-cust-edit');
    loadingIndicator.dismiss();
  }
  async backAndSave()
  {
    
    const loadingIndicator = await this.showLoadingIndictator();

    const sales_cust_id = this.sales_cust_id;
    const input_cicilan = this.input_cicilan;
    const input_piutang = this.input_piutang;
    const input_cash = this.input_cash;
    const input_item1qty = this.input_item1qty;
    const input_item2qty = this.input_item2qty;
    this.DaftarSalesItem.map(function(val, index){
 
      if(val['cust_id'] === sales_cust_id)
        {
          val['nilai_cicilan'] = input_cicilan;
          val['nilai_piutang'] = input_piutang;
          val['nilai_cash'] = input_cash;
          val['item1_qty'] = input_item1qty;
          val['item2_qty'] = input_item2qty;
        }

    });
    
    this.storage.set('DaftarSalesItem',this.DaftarSalesItem);
    
    loadingIndicator.dismiss();
    
    this.route.navigate(['/sales'], { replaceUrl: true });
  }
  async cancel()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    this.route.navigate(['/sales'], { replaceUrl: true });
    loadingIndicator.dismiss();
  }
  
  // PRINTER BLE
  async print(){
    const loadingIndicator = await this.showLoadingIndictator();

    this.deviceId = await this.storage.get('SYS_PRINTER_DEVICE_ID');
    this.serviceUuid = await this.storage.get('SYS_PRINTER_SERVICE_UUID');
    this.characteristicUuid = await this.storage.get('SYS_PRINTER_CHARACTERISTIC_UUID');
    // console.log(this.deviceId)
    // console.log(this.serviceUuid)
    // console.log(this.characteristicUuid)

    if(!this.deviceId)
    {
      loadingIndicator.dismiss();
      this.presentToast('Printer not connected.')
    }
    else
    {

      await this.TurnOnBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
      await this.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);

      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, '-------CUSTOMER RECEIPT------');
      await this.UnderLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
      await this.TurnOffBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
      await this.FeedRight(this.deviceId, this.serviceUuid, this.characteristicUuid);

      const currentDate = formatDate(new Date(), "dd/MM/yyyy hh:mm a", "en");
      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, currentDate);

      await this.FeedLeft(this.deviceId, this.serviceUuid, this.characteristicUuid);

      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Customer: Antony`);
      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Item: BC-001`);
      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Qty: 2}    Weight: 5} kg`);
      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Price: Rp 500.000}   Amount: Rp 500.000`);

      await this.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);

      await this.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);
      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "Please Collect your receipt.");
      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "---Thank you---");
      await this.FeedLeft(this.deviceId, this.serviceUuid, this.characteristicUuid);

      await this.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);

      await this.Disconnect(this.deviceId);
    }
    loadingIndicator.dismiss();
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

  async LineFeed(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView((new Uint8Array([10])).buffer));
  }

  async TurnOnBold(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const boldOn = new Uint8Array([27, 69, 1]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(boldOn.buffer));
  }

  async TurnOffBold(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const boldOff = new Uint8Array([27, 69, 0]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(boldOff.buffer));
  }

  async FeedLeft(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const left = new Uint8Array([27, 97, 0]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(left.buffer));
  }

  async FeedCenter(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const center = new Uint8Array([27, 97, 1]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(center.buffer));
  }

  async FeedRight(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const right = new Uint8Array([27, 97, 2]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(right.buffer));
  }

  async WriteData(deviceId: string, serviceUuid: string, characteristicUuid: string, text: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView(text));
  }

  async UnderLine(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView('-'.repeat(30)));
  }

  async NewEmptyLine(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView(`${' '.repeat(18)}\n`));
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
