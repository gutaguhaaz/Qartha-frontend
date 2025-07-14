import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['admin@software.com', Validators.required],
      password: ['admin@123', Validators.required],
    });
    
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
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      this.subs.sink = this.authService
        .login(this.f['username'].value, this.f['password'].value)
        .subscribe({
          next: (res) => {
            if (res) {
              if (res) {
                const token = this.authService.currentUserValue.token;
                if (token) {
                  this.router.navigate(['/dashboard/dashboard1']);
                }
              } else {
                this.error = 'Invalid Login';
              }
            } else {
              this.error = 'Invalid Login';
            }
          },
          error: (error) => {
            this.error = error;
            this.submitted = false;
            this.loading = false;
          },
        });
    }
  }
}
