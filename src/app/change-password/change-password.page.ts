import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  passwordForm: FormGroup = this.formBuilder.group({});  // Initialize here
  response: any;
  old_password: any = '';
  new_password: any = '';
  confirm_password: any = '';

  constructor(
    private storage: Storage,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private http: HttpClient,) {}

  async ngOnInit() {

    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!%&@#$^*?_~]).+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
    
    await this.storage.create();
  }

  passwordsMatch(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value ?? '';
    const confirmPassword = form.get('confirmPassword')?.value ?? '';
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  } 

  async onSubmit() {
    if (this.passwordForm.valid) {
      // Handle the password change logic here
      // console.log('Password changed successfully');

      const loading = await this.loadingController.create({
        cssClass: 'loading-custom',
        message: 'Please wait...'
      });
      await loading.present(); 
  
      const tokenapps = await this.storage.get('userlogin_tokenapps');
      // console.log(tokenapps);
      var formData : FormData = new FormData();
      formData.set('tokenapps', tokenapps);
      formData.set('oldPassword', this.old_password);
      formData.set('newPassword', this.new_password);
      formData.set('confirmPassword', this.confirm_password);
  
      this.http.post('https://project.graylite.com/unitice/mobile/change-password.php', formData)
      .subscribe((data) => {
        // console.log('data', data);
        this.response=data;
        if(this.response.error==true){
          this.presentToast(this.response.message);
        }else{
          this.presentToast(this.response.message);
  
          // https://stackoverflow.com/questions/43759590/angular-reactive-forms-how-to-reset-form-state-and-keep-values-after-submit
          this.passwordForm.reset();
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
