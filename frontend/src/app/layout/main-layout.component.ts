import { Component, inject, signal, ElementRef, ViewChild, HostListener } from '@angular/core';
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
            <div class="flex items-center relative ml-3" #dropdownContainer>
               <div>
                <button (click)="toggleDropdown()" type="button" class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 hover:ring-2 hover:ring-offset-1 hover:ring-primary/50" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span class="sr-only">Open user menu</span>
                  <div class="h-9 w-9 rounded-full ring-2 ring-white p-0.5 bg-gradient-to-tr from-rose-500 to-orange-500">
                    <img class="h-full w-full rounded-full object-cover" [src]="'https://ui-avatars.com/api/?name=' + (user()?.name || 'User') + '&background=random'" alt="User avatar">
                  </div>
                </button>
               </div>

               <!-- Dropdown menu -->
               <div *ngIf="isDropdownOpen()" 
                class="origin-top-right absolute right-0 top-12 mt-2 w-72 rounded-[2rem] shadow-2xl bg-white ring-1 ring-black/5 focus:outline-none z-50 animate-fade-in-down transform origin-top-right">
                  
                  <!-- Profile Header -->
                  <div class="p-2">
                    <div class="flex items-center justify-between p-3 rounded-[1.5rem] hover:bg-gray-50 transition-colors cursor-default">
                        <div class="flex flex-col">
                           <span class="text-base font-bold text-gray-900 tracking-tight">{{ user()?.name }}</span>
                           <span class="text-xs text-gray-400 font-medium">{{ user()?.email }}</span>
                        </div>
                        <div class="h-10 w-10 rounded-full ring-2 ring-white p-0.5 bg-gradient-to-tr from-rose-500 to-orange-500 shadow-sm">
                           <img class="h-full w-full rounded-full object-cover" [src]="'https://ui-avatars.com/api/?name=' + (user()?.name || 'User') + '&background=random'" alt="User avatar">
                        </div>
                    </div>
                  </div>

                  <!-- Menu Items -->
                  <div class="px-2 pb-2">
                    <a routerLink="/profile" class="flex items-center px-4 py-3 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 group">
                        <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        Profile
                    </a>

                    <div class="border-t border-gray-100 my-1 mx-2"></div>

                    <a (click)="logout()" class="flex items-center px-4 py-3 rounded-2xl text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-700 cursor-pointer transition-all duration-200 group">
                        <svg class="h-5 w-5 mr-3 text-gray-400 group-hover:text-rose-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                    </a>
                  </div>
               </div>
               
                <!-- Backdrop to close dropdown on click outside -> REMOVED in favor of HostListener -->

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
  private elementRef = inject(ElementRef); // Inject ElementRef

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef; // Access the container

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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // If dropdown is open and the click is NOT inside the dropdown container, close it.
    if (this.isDropdownOpen() && this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
      this.isDropdownOpen.set(false);
    }
  }
}
