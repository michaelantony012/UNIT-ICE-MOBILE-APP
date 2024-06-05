import { Component, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {
  // ItemList : { order:number, cust_id:number, cust_name: string }[] = [{"order": 3, "cust_id":3, "cust_name": 'Cust Tiga'},{"order": 2, "cust_id": 2, "cust_name":'Cust Dua'},{"order": 1, "cust_id":1, "cust_name":'Cust Satu'}];
  DaftarSalesItem : {cust_order: number, cust_id: number, cust_name: string, cust_remark: string, cust_type: number,
    nilai_piutang: number, nilai_cicilan: number, nilai_cash: number, item1_qty: number, item2_qty: number, cust_edited: number}[] = [];
    /*=
    [
      {cust_order: 1, cust_id: 1, cust_name: "customer satu", cust_remark: "ini keterangan", cust_type: 1, nilai_piutang: 100000, nilai_cicilan: 10000, nilai_cash: 100000, item1_qty: 20, item2_qty: 35, cust_edited: 0},
      {cust_order: 2, cust_id: 2, cust_name: "customer dua", cust_remark: "ini keterangan 2", cust_type: 2, nilai_piutang: 120000, nilai_cicilan: 12000, nilai_cash: 120000, item1_qty: 22, item2_qty: 32, cust_edited: 0},
      {cust_order: 3, cust_id: 3, cust_name: "customer tiga", cust_remark: "ini keterangan 3", cust_type: 3, nilai_piutang: 130000, nilai_cicilan: 13000, nilai_cash: 130000, item1_qty: 23, item2_qty: 33, cust_edited: 0}
    ];*/
  

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private nav:NavController) { }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();

  }
  ionViewDidEnter(){
    this.getData();
  }
  async add()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    this.nav.navigateForward('/sales-cust-add');
    loadingIndicator.dismiss();
  }

  getData(){
    this.storage.get('DaftarSalesItem').then((val) => {
      
      // console.log(JSON.stringify(val));
      this.DaftarSalesItem = val;
    });
  }

  /*sortSalesItem() {
    return this.DaftarSalesItem.sort((b, a) => b.cust_order - a.cust_order)
  }*/

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }

  async handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    // console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Do the reorder
    // https://chatgpt.com/share/23395e72-7549-46e1-be39-e174e7e43aea
    const itemToMove = this.DaftarSalesItem.splice(ev.detail.from, 1)[0];
    this.DaftarSalesItem.splice(ev.detail.to, 0, itemToMove);

    // Save the reordered array to storage
    await this.storage.set('DaftarSalesItem', this.DaftarSalesItem);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }


  async edit(cust_id: number, cust_name: string, cust_type: number, cust_remark: string, nilai_piutang: number,
    nilai_cicilan: number, nilai_cash: number, item1_qty: number, item2_qty: number){
    // console.log(cust_id);
    this.storage.set('sales_cust_id', cust_id);
    this.storage.set('sales_cust_name', cust_name);
    this.storage.set('sales_cust_type', cust_type);
    this.storage.set('sales_cust_remark', cust_remark);
    this.storage.set('sales_nilai_piutang', nilai_piutang);
    this.storage.set('sales_nilai_cicilan', nilai_cicilan);
    this.storage.set('sales_nilai_cash', nilai_cash);
    this.storage.set('sales_nilai_item1qty', item1_qty);
    this.storage.set('sales_nilai_item2qty', item2_qty);
    const loadingIndicator = await this.showLoadingIndictator();
    this.nav.navigateForward('/sales-edit');
    loadingIndicator.dismiss();
  }

  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }

  /*setData(){
    this.storage.set('keyOfData', JSON.stringify(this.ItemList));
  }
  // Or to get a key/value pair
  getData(){
    this.storage.get('keyOfData').then((val) => {
      console.log('Your age is', JSON.parse(val));

      this.presentToast('Your data is here');
    });
  }
  sortItem() {
    return this.ItemList.sort((b, a) => b.order - a.order)
  }*/
}
