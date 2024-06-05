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
    nilai_piutang: number, nilai_cicilan: number, nilai_cash: number, item1_qty: number, item2_qty: number, cust_edited: number}[] = [];
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
