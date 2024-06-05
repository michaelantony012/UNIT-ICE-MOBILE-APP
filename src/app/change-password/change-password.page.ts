import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  passwordForm: FormGroup = this.formBuilder.group({});  // Initialize here

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!%&@#$^*?_~]).+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value ?? '';
    const confirmPassword = form.get('confirmPassword')?.value ?? '';
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  } 

  onSubmit() {
    if (this.passwordForm.valid) {
      // Handle the password change logic here
      console.log('Password changed successfully');
    }
  }
}
