import { Component, NgZone } from '@angular/core';

import { BLE } from '@awesome-cordova-plugins/ble/ngx';
import { BleClient, BleService, BluetoothLe, textToDataView } from '@capacitor-community/bluetooth-le';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  devices:any[] = [];
  deviceId:any='86:67:7A:13:88:74';
  serviceUuid:any='00001800-0000-1000-8000-00805f9b34fb';
  characteristicUuid:any='00002a00-0000-1000-8000-00805f9b34fb';
  constructor(private ble: BLE,private ngZone: NgZone,private storage: Storage,public toastController: ToastController) {}

  ngOnInit(){
    this.storage.create(); 
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

  async Scan() {
    await this.VerifyAndEnabled();
    await this.Initialize();
    // let bleDevice = await BleClient.requestDevice({ allowDuplicates: false });
    // if (bleDevice) {
      await BleClient.connect(this.deviceId, this.Disconnect);
      this.presentToast('Connected');
      // await this.storage.set('BLUETOOTH_DEVICE_ID',deviceId);

      await this.AssignServices();
    // }
  }

  async AssignServices() {
    // const deviceId = await this.storage.get('BLUETOOTH_DEVICE_ID');
    let bleService: BleService[] = await BleClient.getServices(this.deviceId);
    // if (bleService.length > 0 && bleService[0].characteristics.length > 0) {
    //   this.storage.set('BLUETOOTH_Service_UUID', bleService[0].uuid);
    //   this.storage.set('BLUETOOTH_CHARACTERISTIC_UUID', bleService[0].characteristics[0].uuid);
    // }
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

  async print(){
    // this.deviceId = await this.storage.get('BLUETOOTH_DEVICE_ID');
    // this.serviceUuid = await this.storage.get('BLUETOOTH_Service_UUID');
    // this.characteristicUuid = await this.storage.get('BLUETOOTH_CHARACTERISTIC_UUID');
    // console.log(this.deviceId)
    // console.log(this.serviceUuid)
    // console.log(this.characteristicUuid)
    await this.Scan();

    await this.TurnOnBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, 'Narkoboy Mania');
    await this.UnderLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.TurnOffBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.FeedRight(this.deviceId, this.serviceUuid, this.characteristicUuid);

    const currentDate = formatDate(new Date(), "dd/MM/yyyy hh:mm a", "en");
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, currentDate);

    await this.FeedLeft(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Customer: Affi`);
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Item: Narkoboy`);
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Qty: 2}    Weight: 5} grms`);
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, `Price: Rp 1.000.000.000}   Amount: Rp 1.000.000.000`);

    await this.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "Please Collect after one hour.");
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "---Thank you---");
    await this.FeedLeft(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.Disconnect(this.deviceId);
  }

  async presentToast(Message:any) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }
  

}
