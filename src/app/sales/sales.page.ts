import { Component, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {
  // ItemList : { order:number, cust_id:number, cust_name: string }[] = [{"order": 3, "cust_id":3, "cust_name": 'Cust Tiga'},{"order": 2, "cust_id": 2, "cust_name":'Cust Dua'},{"order": 1, "cust_id":1, "cust_name":'Cust Satu'}];
  DaftarSalesItem : {cust_order: number, cust_id: number, cust_name: string, cust_remark: string, cust_type: number,
    nilai_cash: number, nilai_BB: number, nilai_credit: number,
    item1_qty: number, item2_qty: number, item3_qty: number, item4_qty: number, item5_qty: number,
    item1_qtyfree: number, item2_qtyfree: number, item3_qtyfree: number, item4_qtyfree: number, item5_qtyfree: number,
    item1_qtyretur: number, item2_qtyretur: number, item3_qtyretur: number, item4_qtyretur: number, item5_qtyretur: number,
    item1_price: number, item2_price: number, item3_price: number, item4_price: number, item5_price: number,
    cust_edited: number, cust_added: number, nomor_nota: string}[] = [];
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
    private route: Router,
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

  async back()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    
    this.route.navigate(['/home'], { replaceUrl: true });
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


  async edit(cust_id: number, cust_name: string, cust_type: number, cust_remark: string,
    nilai_cash: number, nilai_BB: number, nilai_credit: number,
    item1_qty: number, item2_qty: number, item3_qty: number, item4_qty: number, item5_qty: number,
    item1_qtyfree: number, item2_qtyfree: number, item3_qtyfree: number, item4_qtyfree: number, item5_qtyfree: number,
    item1_qtyretur: number, item2_qtyretur: number, item3_qtyretur: number, item4_qtyretur: number, item5_qtyretur: number,
    item1_price: number, item2_price: number, item3_price: number, item4_price: number, item5_price: number,
    nomor_nota: string){
    // console.log(cust_id);
    this.storage.set('sales_cust_id', cust_id);
    this.storage.set('sales_cust_name', cust_name);
    this.storage.set('sales_cust_type', cust_type);
    this.storage.set('sales_cust_remark', cust_remark);
    this.storage.set('sales_nomor_nota', nomor_nota);
    this.storage.set('sales_nilai_cash', nilai_cash);
    this.storage.set('sales_nilai_BB', nilai_BB);
    this.storage.set('sales_nilai_credit', nilai_credit);
    this.storage.set('sales_nilai_item1qty', item1_qty);
    this.storage.set('sales_nilai_item2qty', item2_qty);
    this.storage.set('sales_nilai_item3qty', item3_qty);
    this.storage.set('sales_nilai_item4qty', item4_qty);
    this.storage.set('sales_nilai_item5qty', item5_qty);
    this.storage.set('sales_nilai_item1qtyfree', item1_qtyfree);
    this.storage.set('sales_nilai_item2qtyfree', item2_qtyfree);
    this.storage.set('sales_nilai_item3qtyfree', item3_qtyfree);
    this.storage.set('sales_nilai_item4qtyfree', item4_qtyfree);
    this.storage.set('sales_nilai_item5qtyfree', item5_qtyfree);
    this.storage.set('sales_nilai_item1qtyretur', item1_qtyretur);
    this.storage.set('sales_nilai_item2qtyretur', item2_qtyretur);
    this.storage.set('sales_nilai_item3qtyretur', item3_qtyretur);
    this.storage.set('sales_nilai_item4qtyretur', item4_qtyretur);
    this.storage.set('sales_nilai_item5qtyretur', item5_qtyretur);
    this.storage.set('sales_nilai_item1price', item1_price);
    this.storage.set('sales_nilai_item2price', item2_price);
    this.storage.set('sales_nilai_item3price', item3_price);
    this.storage.set('sales_nilai_item4price', item4_price);
    this.storage.set('sales_nilai_item5price', item5_price);
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
