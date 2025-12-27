import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Role } from '../core/models/user.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 relative selection:bg-blue-100 selection:text-blue-900">
      <!-- Navbar -->
      <nav class="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <img src="assets/logo.png" alt="Saazvat Helpdesk" class="h-10 w-auto object-contain">
              </div>
            <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
                <ng-container *ngIf="isAdmin()">
                    <a routerLink="/dashboard" routerLinkActive="active" 
                       class="nav-link-animated text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                      Dashboard
                    </a>
                </ng-container>
                <a routerLink="/tickets" routerLinkActive="active" 
                   class="nav-link-animated text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                  Tickets
                </a>
                <ng-container *ngIf="isAdmin()">
                    <a routerLink="/users" routerLinkActive="active" 
                       class="nav-link-animated text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                      Users
                    </a>
                </ng-container>
                <ng-container *ngIf="isAdmin()">
                    <a routerLink="/settings" routerLinkActive="active" 
                       class="nav-link-animated text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                      Settings
                    </a>
                </ng-container>
              </div>
            </div>
            
            <!-- User Dropdown -->
            <div class="flex items-center relative ml-3">
               <div>
                <button (click)="toggleDropdown()" type="button" class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span class="sr-only">Open user menu</span>
                  <img class="h-8 w-8 rounded-full" [src]="'https://ui-avatars.com/api/?name=' + (user()?.name || 'User') + '&background=random'" alt="User avatar">
                </button>
               </div>

               <!-- Dropdown menu -->
               <div *ngIf="isDropdownOpen()" 
                class="origin-top-right absolute right-0 top-10 mt-2 w-64 rounded-xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in-down border border-gray-100">
                  
                  <div class="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                      <p class="text-sm font-bold text-gray-900">{{ user()?.name }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ user()?.email }}</p>
                      <p class="text-[10px] uppercase tracking-wider font-bold text-primary mt-1">{{ user()?.role }}</p>
                  </div>
                  
                  <a (click)="logout()" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 cursor-pointer flex items-center transition-colors">
                    <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log out
                  </a>
               </div>
               
               <!-- Backdrop to close dropdown on click outside -->
               <div *ngIf="isDropdownOpen()" (click)="isDropdownOpen.set(false)" class="fixed inset-0 z-40 cursor-default" tabindex="-1"></div>

            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .nav-link-animated {
      position: relative;
      height: 100%;
    }
    .nav-link-animated::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #b0303c; /* Primary Red */
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-link-animated:hover::after {
      width: 100%;
    }
    .nav-link-animated.active::after {
      width: 100%;
    }
    .nav-link-animated.active {
      color: #111827; /* Gray-900 */
    }
  `]
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.currentUser;
  isDropdownOpen = signal(false);

  isAdmin(): boolean {
    return this.authService.hasRole([Role.ADMIN, Role.STAFF]);
  }

  toggleDropdown() {
    this.isDropdownOpen.update(val => !val);
  }

  logout() {
    this.authService.logout();
    this.isDropdownOpen.set(false);
    this.router.navigate(['/login']);
  }
}
