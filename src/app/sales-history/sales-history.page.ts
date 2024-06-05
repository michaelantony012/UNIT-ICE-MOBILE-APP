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
  DaftarHistory : {finished_at: string, doc_date: string, doc_no: string, piutang: string, cicilan: string,
    cash: string, item1_qty: string, item2_qty: string}[] = [];

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
