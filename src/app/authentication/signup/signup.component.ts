
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    NgFor,
    RouterLink,
    TranslateModule
  ]
})
export class SignupComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  hidePassword = true;
  hideConfirmPassword = true;

  languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirm_password: ['', Validators.required],
      full_name: ['', Validators.required],
      position: [''],
      phone: [''],
      organization: [''],
      language: ['es', Validators.required]
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
    const password = group.get('password');
    const confirmPassword = group.get('confirm_password');
    
    if (password?.value !== confirmPassword?.value) {
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

  get f() { 
    return this.registerForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    const formData = { ...this.registerForm.value };
    delete formData.confirm_password;

    this.subs.sink = this.authService.register(formData).subscribe({
      next: () => {
        this.router.navigate(['/authentication/signin'], {
          queryParams: { message: 'Registro exitoso. Inicia sesión con tus credenciales.' }
        });
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
