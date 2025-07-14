
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// Shared Components
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

// Translate
import { TranslateModule } from '@ngx-translate/core';

// Routes
import { UsersRoutingModule } from './users-routing.module';

// Components
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    
    // Angular Material
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    
    // Shared
    BreadcrumbComponent,
    
    // Translate
    TranslateModule,
    
    // Routes
    UsersRoutingModule,
    
    // Components (standalone)
    ProfileComponent
  ]
})
export class UsersModule { }
