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

    if(await this.storage.get('DaftarSalesItem') == null) {
      this.storage.set('DaftarSalesItem', []);
    }
  }
  
  async ionViewDidEnter(){
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
      this.storage.get('DaftarSalesItem').then((val) => {
        this.DaftarSalesItem = val;
        this.DaftarSalesItem.unshift({cust_order: 0, cust_id: 0, cust_name: this.sales_cust_name, cust_remark: this.sales_cust_remark,
          cust_type: parseInt(this.sales_cust_type),
          nilai_piutang: 0, nilai_cicilan: 0, nilai_cash: 0, item1_qty: 0, item2_qty: 0, cust_edited: 0});
        this.storage.set('DaftarSalesItem', this.DaftarSalesItem);
      });
      
      this.route.navigate(['/sales'], { replaceUrl: true });
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
