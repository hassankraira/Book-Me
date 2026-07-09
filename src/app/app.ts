import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';
import { NotificationService } from './core/services/notification.service';
import { ToastComponent } from './shared/components/toast.component';

interface NavItem {
  label: string;
  route: string;
  show: 'always' | 'auth' | 'guest' | 'customer' | 'provider' | 'admin';
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, ToastComponent,RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);
  protected readonly notifService = inject(NotificationService);

  constructor() {
    if (typeof window !== 'undefined') {
      this.applyTheme();
    }
  }

  readonly isDarkTheme = signal(this.getStoredTheme());

  private getStoredTheme(): boolean {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('bookme-theme');
    return saved === 'dark';
  }

  ngOnInit(): void {
    this.applyTheme();
    if (this.auth.isAuthenticated()) {
      this.api.getProfile().subscribe({
        next: (res) => { if (res.isSuccess) this.auth.updateUser(res.data); },
      });
    }
  }

  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);
  readonly showUserMenu = signal(false);
  readonly showNotifications = signal(false);

  toggleNotifications(): void {
    this.showNotifications.update((v) => !v);
  }

  formatNotifDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  }

  readonly userMenuItems = computed(() => {
    const role = this.auth.role();
    const items: { label: string; route?: string; action?: () => void }[] = [];
    if (role === 'ServiceProvider') {
      items.push({ label: 'Dashboard', route: '/dashboard' });
    }
    if (role === 'Admin') {
      items.push({ label: 'Admin Dashboard', route: '/admin/dashboard' });
    }
    
    if (role && role !== 'Admin') {
      items.push({ label: 'My Bookings', route: '/customer/my-bookings' });
    }
    items.push({ label: 'My Profile', route: '/profile' });
    items.push({ label: 'Logout', action: () => this.logout() });
    return items;
  });

  readonly userAvatar = computed(() => {
    const u = this.auth.user();
    if (!u || !u.firstName || !u.lastName) return '';
    return `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`;
  });

  readonly userAvatarImage = computed<string | null>(() => {
    const u = this.auth.user();
    if (!u || !u.id) return null;
    if (u.imagePath && u.imagePath.length > 0) {
      if (u.imagePath.startsWith('http') || u.imagePath.startsWith('data:')) {
        return u.imagePath;
      }
      return 'https://aboodhassan-001-site1.jtempurl.com/' + u.imagePath.replace(/^\//, '');
    }
    const saved = localStorage.getItem('bookme_avatar_' + u.id);
    return saved || null;
  });

  toggleTheme(): void {
    this.isDarkTheme.update((value) => !value);
    this.applyTheme();
  }

  private applyTheme(): void {
    const dark = this.isDarkTheme();
    document.documentElement.classList.toggle('theme-dark', dark);
    localStorage.setItem('bookme-theme', dark ? 'dark' : 'light');
  }

  toggleUserMenu() {
    this.showUserMenu.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.showUserMenu.set(false);
    }
    if (!target.closest('.notif-container')) {
      this.showNotifications.set(false);
    }
  }

  readonly navItems: NavItem[] = [
    { label: 'Home', route: '/Home', show: 'always' },
    { label: 'Categories', route: '/Categories', show: 'always' },
    { label: 'My Bookings', route: '/customer/my-bookings', show: 'auth' },
    { label: 'About Us', route: '/about', show: 'always' },
    { label: 'Contact Us', route: '/contact', show: 'always' },
  ];

  readonly visibleNavItems = computed(() => {
    const role = this.auth.role();
    return this.navItems.filter((item) => {
      if (item.show === 'always') return true;
      if (item.show === 'auth') return this.auth.isAuthenticated() && role !== 'Admin';
      if (item.show === 'guest') return !this.auth.isAuthenticated();
      if (item.show === 'customer') return role === 'User';
      if (item.show === 'provider') return role === 'ServiceProvider';
      if (item.show === 'admin') return role === 'Admin';
      return false;
    });
  });

  readonly navbarClasses = computed(() => {
    const base = 'fixed w-full top-0 z-50 transition-all duration-300';
    return this.isScrolled() ? `${base} app-shell-navbar is-scrolled` : `${base} app-shell-navbar`;
  });

  toggleMenu() {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.auth.logout();
    this.closeMenu();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 40);
  }
}
