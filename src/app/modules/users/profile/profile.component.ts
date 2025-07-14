
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { User } from '../../../core/models/user';
import { UnsubscribeOnDestroyAdapter } from '../../../shared';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NgIf,
    BreadcrumbComponent,
    TranslateModule
  ]
})
export class ProfileComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  loading = false;
  message = '';
  messageType = 'success';
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.initializeForms();
  }

  initializeForms(): void {
    this.profileForm = this.formBuilder.group({
      full_name: [this.user?.full_name || '', Validators.required],
      position: [this.user?.position || ''],
      phone: [this.user?.phone || ''],
      organization: [this.user?.organization || ''],
      language: [this.user?.language || 'es', Validators.required]
    });

    this.passwordForm = this.formBuilder.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, this.passwordValidator]],
      confirm_password: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    
    const valid = hasUpperCase && hasLowerCase && hasNumbers && hasMinLength;
    
    if (!valid) {
      return { 
        invalidPassword: {
          hasUpperCase,
          hasLowerCase,
          hasNumbers,
          hasMinLength
        }
      };
    }
    return null;
  }

  passwordMatchValidator(group: AbstractControl): {[key: string]: any} | null {
    const newPassword = group.get('new_password');
    const confirmPassword = group.get('confirm_password');
    
    if (newPassword?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.errors) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      this.message = '';

      this.subs.sink = this.authService.updateProfile(this.profileForm.value).subscribe({
        next: (user) => {
          this.user = user;
          this.message = 'Perfil actualizado exitosamente';
          this.messageType = 'success';
          this.loading = false;
          setTimeout(() => this.message = '', 5000);
        },
        error: (error) => {
          this.message = error.message;
          this.messageType = 'error';
          this.loading = false;
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      this.message = '';

      const { current_password, new_password } = this.passwordForm.value;
      
      this.subs.sink = this.authService.changePassword({ current_password, new_password }).subscribe({
        next: () => {
          this.message = 'Contraseña cambiada exitosamente';
          this.messageType = 'success';
          this.passwordForm.reset();
          this.loading = false;
          setTimeout(() => this.message = '', 5000);
        },
        error: (error) => {
          this.message = error.message;
          this.messageType = 'error';
          this.loading = false;
        }
      });
    }
  }
}
