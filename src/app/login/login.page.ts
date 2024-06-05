import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  dataLogin:any;
  input_username: string = '';
  input_password: string = '';
  tokenjwt: any;

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private http: HttpClient) { }

  async ngOnInit() {
    await this.storage.create();
  }
  
  ionViewWillEnter(){
  }
  async ionViewDidEnter(){
    // https://stackoverflow.com/questions/43698352/how-can-i-access-the-zone-symbol-value-on-the-zoneawarepromise-in-angular-2 --> fabricio
    let tokenapps = null;
    await this.storage.get('userlogin_tokenapps').then( res => tokenapps = res );
    // console.log('tokenapps :', tokenapps);
    if(tokenapps !== null)
    {
      this.router.navigate(['/home'], { replaceUrl: true });
    }
  }

  async login() {
    const loading = await this.loadingController.create({
      cssClass: 'loading-custom',
      message: 'Please wait...'
    });
    await loading.present(); 
    
    var formData : FormData = new FormData();
    formData.set('userlogin', this.input_username);
    formData.set('password',this.input_password);

    this.http.post('https://project.graylite.com/unitice/mobile/login.php', formData)
    .subscribe((data) => {
      // console.log('data', data);
      this.dataLogin=data;
      if(this.dataLogin.error==true){
        this.presentToast(this.dataLogin.message);
      }else{
        this.presentToast(this.dataLogin.message);
        this.storage.set('userlogin_userlogin', this.dataLogin.user_login);
        this.storage.set('userlogin_tanggal',this.dataLogin.tanggal);
        this.storage.set('userlogin_tokenapps', this.dataLogin.tokenjwt);
        this.storage.set('userlogin_ccid',this.dataLogin.cc_id);
        
        this.router.navigate(['/home'], { replaceUrl: true });
      }
      loading.dismiss();
    },
    error => {
      let message='Failed to sync data, please re-open App!';
        this.presentToast(message);
        loading.dismiss();
    });

    loading.dismiss();
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
