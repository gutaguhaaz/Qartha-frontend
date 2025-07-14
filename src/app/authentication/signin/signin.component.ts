import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    RouterLink,
    TranslateModule
  ]
})
export class SigninComponent extends UnsubscribeOnDestroyAdapter implements OnInit, AfterViewInit {
  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef<HTMLVideoElement>;
  
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  message = '';
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      remember_me: [false]
    });

    // Capturar mensaje de registro exitoso
    this.message = this.route.snapshot.queryParams['message'] || '';
  }

  ngAfterViewInit(): void {
    // Ensure video autoplay after component loads
    setTimeout(() => {
      this.initializeVideo();
    }, 100);
  }

  private initializeVideo(): void {
    const video = document.querySelector('.background-video') as HTMLVideoElement;
    if (!video) return;

    // Set video properties for better autoplay compatibility
    video.muted = true;
    video.playsInline = true;
    video.defaultMuted = true;

    // Try to play the video
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Video autoplay blocked by browser:', error);
        
        // Fallback strategies
        this.setupVideoFallbacks(video);
      });
    }
  }

  private setupVideoFallbacks(video: HTMLVideoElement): void {
    // Strategy 1: Play on any user interaction
    const playOnInteraction = () => {
      video.play().catch(e => console.log('Play on interaction failed:', e));
      // Remove listeners after successful play attempt
      document.removeEventListener('click', playOnInteraction);
      document.removeEventListener('touchstart', playOnInteraction);
      document.removeEventListener('keydown', playOnInteraction);
    };

    document.addEventListener('click', playOnInteraction, { passive: true });
    document.addEventListener('touchstart', playOnInteraction, { passive: true });
    document.addEventListener('keydown', playOnInteraction, { passive: true });

    // Strategy 2: Show fallback image after a delay if video still isn't playing
    setTimeout(() => {
      if (video.paused) {
        const fallbackImage = video.nextElementSibling as HTMLElement;
        if (fallbackImage) {
          video.style.display = 'none';
          fallbackImage.style.display = 'block';
        }
      }
    }, 3000);
  }

  get f() { 
    return this.loginForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.subs.sink = this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}