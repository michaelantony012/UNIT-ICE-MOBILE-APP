import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.page.html',
  styleUrls: ['./sales-history.page.scss'],
})
export class SalesHistoryPage implements OnInit {
  dataHistory: any;
  DaftarHistory : {started_at: string, finished_at: string, doc_date: string, doc_no: string,
    route_name: string, truck_nopol: string, sales_name1: string, sales_name2: string, sales_name3: string,
    cash: string, BB: string,
    tagihan_BB: string, tagihan_credit: string,
    total_biaya: string,
    item1_total: string, item2_total: string, item3_total: string, item4_total: string, item5_total: string,
    item1_SJE: string, item2_SJE: string, item3_SJE: string, item4_SJE: string, item5_SJE: string,
    item1_Retur: string, item2_Retur: string, item3_Retur: string, item4_Retur: string, item5_Retur: string,
    item1_Free: string, item2_Free: string, item3_Free: string, item4_Free: string, item5_Free: string}[] = [];

  ware_id: number = 0;

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private http: HttpClient) { }

  async ngOnInit() {
    await this.storage.create();
  }
  async ionViewDidEnter(){
    
    const loadingIndicator = await this.showLoadingIndictator();

    const tokenapps = await this.storage.get('userlogin_tokenapps');
    // console.log(tokenapps);
    var formData : FormData = new FormData();
    formData.set('tokenapps', tokenapps);
    
    await this.storage.get('userlogin_wareid').then( res => this.ware_id = res );

    this.http.post('https://project.graylite.com/unitice/mobile/history.php', formData)
    .subscribe((data) => {
      // console.log('data', data);
      this.dataHistory=data;
      if(this.dataHistory.error==true){
        this.presentToast(this.dataHistory.message);
      }else{
        this.presentToast(this.dataHistory.message);
        
        this.DaftarHistory = this.dataHistory.DaftarHistory;
      }
      loadingIndicator.dismiss();
    },
    error => {
      let message='Failed to sync data, please re-open App!';
        this.presentToast(message);
        loadingIndicator.dismiss();
    });

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
  
  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();

  }


}
