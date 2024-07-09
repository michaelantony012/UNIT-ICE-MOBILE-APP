import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-cust-add',
  templateUrl: './sales-cust-add.page.html',
  styleUrls: ['./sales-cust-add.page.scss'],
})
export class SalesCustAddPage implements OnInit {
  public sales_cust_edit_id: number = 0;
  public sales_cust_id: number = 0;
  public sales_cust_name: any = '';
  public sales_cust_type: string = "0";
  public sales_cust_remark: string = '';
  DaftarSalesItem : {cust_order: number, cust_id: number, cust_name: string, cust_remark: string, cust_type: number,
    nilai_cash: number, nilai_BB: number, nilai_credit: number,
    item1_qty: number, item2_qty: number, item3_qty: number, item4_qty: number, item5_qty: number,
    item1_qtyfree: number, item2_qtyfree: number, item3_qtyfree: number, item4_qtyfree: number, item5_qtyfree: number,
    item1_qtyretur: number, item2_qtyretur: number, item3_qtyretur: number, item4_qtyretur: number, item5_qtyretur: number,
    item1_price: number, item2_price: number, item3_price: number, item4_price: number, item5_price: number,
    cust_edited: number, cust_added: number, nomor_nota: string}[] = [];
  CustType = [
    {id: 1, name: "Tetap"},
    {id: 2, name: "Harian"}
  ];

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private route: Router,
    private nav:NavController) { }

  async ngOnInit() {
    await this.storage.create();

    if(await this.storage.get('DaftarSalesItem') == null) {
      this.storage.set('DaftarSalesItem', []);
    }
  }
  
  async ionViewDidEnter(){
    
    this.storage.get('DaftarSalesItem').then((val) => {
      this.DaftarSalesItem = val;
    });
  }
  async backAndSave()
  {
    
    const loadingIndicator = await this.showLoadingIndictator();
    
    const sales_cust_name = this.sales_cust_name.trim();
    // console.log(sales_cust_name);
    let error = 0;
    this.DaftarSalesItem.map(function(val, index){
 
      // console.log(val['cust_name'] + '   ' + sales_cust_name);
      if(val['cust_name'].trim() === sales_cust_name)
      {
        error = 1;
      }
    });

    if(error == 1) // cek cust name tdk boleh kembar --> utk acuan save nominal ketika ada cust baru, dgn id 0
    {
      this.presentToast("Nama customer "+sales_cust_name+" sudah ada.");
    }
    else
    {
      if(this.sales_cust_type == "0" || this.sales_cust_name == "")
        {
          this.presentToast("Harap lengkapi data.");
        }
        else
        {
          // initialize recurring new cust_id (1juta ++)
          let sales_cust_id_add = await this.storage.get('sales_cust_id_add');
          if(!sales_cust_id_add)
          {
            sales_cust_id_add = 1000000;
          }
          sales_cust_id_add++;
          await this.storage.set('sales_cust_id_add',sales_cust_id_add);

          this.DaftarSalesItem.unshift({cust_order: 0, cust_id: sales_cust_id_add, cust_name: this.sales_cust_name, cust_remark: this.sales_cust_remark,
            cust_type: parseInt(this.sales_cust_type),
            nilai_cash: 0, nilai_BB: 0, nilai_credit: 0,
            item1_qty: 0, item2_qty: 0, item3_qty: 0, item4_qty: 0, item5_qty: 0,
            item1_qtyfree: 0, item2_qtyfree: 0, item3_qtyfree: 0, item4_qtyfree: 0, item5_qtyfree: 0,
            item1_qtyretur: 0, item2_qtyretur: 0, item3_qtyretur: 0, item4_qtyretur: 0, item5_qtyretur: 0,
            item1_price: 0, item2_price: 0, item3_price: 0, item4_price: 0, item5_price: 0,
            cust_edited: 0, cust_added: 1, nomor_nota: ""});
          this.storage.set('DaftarSalesItem', this.DaftarSalesItem);
          
          this.route.navigate(['/sales'], { replaceUrl: true });
        }
    }
    
    loadingIndicator.dismiss();
  }
  async cancel()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    this.route.navigate(['/sales'], { replaceUrl: true });
    loadingIndicator.dismiss();
  }
  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }
  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }

}
