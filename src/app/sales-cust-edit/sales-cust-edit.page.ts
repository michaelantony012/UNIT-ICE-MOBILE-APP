import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-cust-edit',
  templateUrl: './sales-cust-edit.page.html',
  styleUrls: ['./sales-cust-edit.page.scss'],
})
export class SalesCustEditPage implements OnInit {
  public sales_cust_edit_id: number = 0;
  public sales_cust_id: number = 0;
  public sales_cust_name: any = '';
  public sales_cust_type: string = "0";
  public sales_cust_remark: string = '';
  public CustNameDisplay = '';
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
    // this.sales_cust_edit_id = await this.storage.get('sales_cust_edit_id');
    // this.presentToast("sales_cust_edit_id : "+this.sales_cust_edit_id);
  }
  async ionViewDidEnter(){
    this.sales_cust_id = await this.storage.get('sales_cust_id');
    this.sales_cust_name = await this.storage.get('sales_cust_name');
    this.CustNameDisplay = this.sales_cust_name;
    let result: string = await this.storage.get('sales_cust_type');
    this.sales_cust_type = result.toString().trim();
    // console.log(result.toString().trim());
    this.sales_cust_remark = await this.storage.get('sales_cust_remark');
    
    this.storage.get('DaftarSalesItem').then((val) => {
      
      this.DaftarSalesItem = val;
    });
  }
  async backAndSave()
  {
    
    const loadingIndicator = await this.showLoadingIndictator();

    const sales_cust_name = this.sales_cust_name.trim();
    const sales_cust_id = this.sales_cust_id;
    
    // cek nama cust tdk boleh kembar
    let error = 0;
    this.DaftarSalesItem.map(function(val, index){
 
      if(val['cust_name'].trim() === sales_cust_name && val['cust_id']!==sales_cust_id)
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
        const sales_cust_id = this.sales_cust_id;
        const sales_cust_name = this.sales_cust_name;
        const sales_cust_type = this.sales_cust_type;
        const sales_cust_remark = this.sales_cust_remark;
        this.DaftarSalesItem.map(function(val, index){
    
          if(val['cust_id'] === sales_cust_id)
            {
              val['cust_name'] = sales_cust_name;
              val['cust_type'] = parseInt(sales_cust_type);
              val['cust_remark'] = sales_cust_remark;
              val['cust_edited'] = 1;
            }

        });
        
        this.storage.set('DaftarSalesItem',this.DaftarSalesItem);
        
        this.route.navigate(['/sales-edit'], { replaceUrl: true });
      }
    }

    loadingIndicator.dismiss();
  }
  async cancel()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    this.route.navigate(['/sales-edit'], { replaceUrl: true });
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
