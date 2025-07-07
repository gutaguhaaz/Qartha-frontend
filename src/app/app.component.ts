import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, AfterViewInit } from '@angular/core';
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
  RouterModule,
} from '@angular/router';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { ConfigService } from './config/config.service';
import { InConfiguration } from './core/models/config.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, PageLoaderComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'lexia';
  currentUrl!: string;
  public config!: InConfiguration;

  constructor(
    public _router: Router,
    private configService: ConfigService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    this.config = this.configService.configData;

    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1,
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        /* empty */
      }
      window.scrollTo(0, 0);
    });
  }

  ngAfterViewInit(): void {
    this.applyLayoutConfiguration();
  }

  private applyLayoutConfiguration(): void {
    // Apply theme variant (light/dark)
    if (localStorage.getItem('theme')) {
      this.renderer.removeClass(this.document.body, this.config.layout.variant);
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('theme') as string
      );
    } else {
      this.renderer.addClass(this.document.body, this.config.layout.variant);
      localStorage.setItem('theme', this.config.layout.variant);
    }

    // Apply theme color (cyan, etc.)
    if (localStorage.getItem('choose_skin')) {
      this.renderer.removeClass(
        this.document.body,
        'theme-' + this.config.layout.theme_color
      );
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('choose_skin') as string
      );
      localStorage.setItem(
        'choose_skin_active',
        (localStorage.getItem('choose_skin') as string).substring(6)
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        'theme-' + this.config.layout.theme_color
      );
      localStorage.setItem(
        'choose_skin',
        'theme-' + this.config.layout.theme_color
      );
      localStorage.setItem(
        'choose_skin_active',
        this.config.layout.theme_color
      );
    }

    // Apply RTL configuration
    if (localStorage.getItem('isRtl')) {
      if (localStorage.getItem('isRtl') === 'true') {
        this.setRTLSettings();
      } else if (localStorage.getItem('isRtl') === 'false') {
        this.setLTRSettings();
      }
    } else {
      if (this.config.layout.rtl === true) {
        this.setRTLSettings();
      } else {
        this.setLTRSettings();
      }
    }

    // Apply sidebar background color
    if (localStorage.getItem('menuOption')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('menuOption') as string
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        'menu_' + this.config.layout.sidebar.backgroundColor
      );
      localStorage.setItem(
        'menuOption',
        'menu_' + this.config.layout.sidebar.backgroundColor
      );
    }

    // Apply logo background color
    if (localStorage.getItem('choose_logoheader')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('choose_logoheader') as string
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        'logo-' + this.config.layout.logo_bg_color
      );
      localStorage.setItem(
        'choose_logoheader',
        'logo-' + this.config.layout.logo_bg_color
      );
    }

    // Apply sidebar collapsed state
    if (localStorage.getItem('collapsed_menu')) {
      if (localStorage.getItem('collapsed_menu') === 'true') {
        this.renderer.addClass(this.document.body, 'side-closed');
        this.renderer.addClass(this.document.body, 'submenu-closed');
      }
    } else {
      if (this.config.layout.sidebar.collapsed === true) {
        this.renderer.addClass(this.document.body, 'side-closed');
        this.renderer.addClass(this.document.body, 'submenu-closed');
        localStorage.setItem('collapsed_menu', 'true');
      } else {
        this.renderer.removeClass(this.document.body, 'side-closed');
        this.renderer.removeClass(this.document.body, 'submenu-closed');
        localStorage.setItem('collapsed_menu', 'false');
      }
    }
  }

  private setRTLSettings(): void {
    document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
    this.renderer.addClass(this.document.body, 'rtl');
    localStorage.setItem('isRtl', 'true');
  }

  private setLTRSettings(): void {
    document.getElementsByTagName('html')[0].removeAttribute('dir');
    this.renderer.removeClass(this.document.body, 'rtl');
    localStorage.setItem('isRtl', 'false');
  }
}
