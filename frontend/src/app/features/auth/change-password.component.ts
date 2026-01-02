import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SuccessModalComponent } from '../../shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, SuccessModalComponent],
  template: `
    <div class="min-h-screen bg-premium-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in relative z-0">
      <!-- Decorative background elements -->
      <div class="absolute top-10 left-10 w-24 h-24 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-32 h-32 bg-rose-400 opacity-20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s;"></div>

      <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
        <div class="glass-card py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border-t-4 border-primary">
          
          <div class="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <div class="flex justify-center mb-6 animate-float">
               <!-- Using same logo as login -->
              <img src="assets/logo.png" alt="Saazvat Helpdesk" class="h-24 w-auto object-contain drop-shadow-xl filter">
            </div>
            <h2 class="text-center text-3xl font-bold text-gray-900 tracking-tight">Setup Password</h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              Create a new secure password for your account
            </p>
          </div>

          <form (ngSubmit)="onSubmit()" #passwordForm="ngForm" class="space-y-6">
            
            <!-- Global Error -->
            <div *ngIf="errorMessage" class="rounded-xl bg-red-50 p-4 border border-red-100 animate-shake mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
                </div>
              </div>
            </div>

            <!-- New Password -->
            <div class="relative group">
              <input id="password" name="password" type="password" required [(ngModel)]="password" minlength="6" #newPass="ngModel" placeholder=" "
                class="float-input appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-gray-50 focus:bg-white transition-all duration-300"
                [class.border-red-300]="newPass.invalid && (newPass.dirty || newPass.touched)"
                [class.focus:ring-red-500]="newPass.invalid && (newPass.dirty || newPass.touched)">
              <label for="password" class="float-label absolute left-3 transition-all duration-200 pointer-events-none text-gray-400">
                New Password
              </label>
            </div>
             <div *ngIf="newPass.invalid && (newPass.dirty || newPass.touched)" class="text-xs text-red-600 pl-1 mt-1">
                <span *ngIf="newPass.errors?.['required']">Password is required.</span>
                <span *ngIf="newPass.errors?.['minlength']">Must be at least 6 characters.</span>
             </div>

            <!-- Confirm Password -->
            <div class="relative group">
              <input id="confirmPassword" name="confirmPassword" type="password" required [(ngModel)]="confirmPassword" #confPass="ngModel" placeholder=" "
                class="float-input appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-gray-50 focus:bg-white transition-all duration-300"
                [class.border-red-300]="confPass.invalid && (confPass.dirty || confPass.touched)"
                [class.focus:ring-red-500]="confPass.invalid && (confPass.dirty || confPass.touched)">
              <label for="confirmPassword" class="float-label absolute left-3 transition-all duration-200 pointer-events-none text-gray-400">
                Confirm Password
              </label>
            </div>
            <div *ngIf="confPass.invalid && (confPass.dirty || confPass.touched)" class="text-xs text-red-600 pl-1 mt-1">
                <span *ngIf="confPass.errors?.['required']">Confirmation is required.</span>
             </div>

            <div>
              <button type="submit" [disabled]="!passwordForm.form.valid || isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primary to-rose-700 hover:from-rose-700 hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:-translate-y-0.5 active:scale-95">
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg *ngIf="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg *ngIf="!isLoading" class="h-5 w-5 text-rose-200 group-hover:text-rose-100 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                     <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                {{ isLoading ? 'Saving Password...' : 'Save New Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>


      <app-success-modal 
        [isOpen]="showSuccessModal" 
        [title]="'Password Changed'"
        [message]="'Your password has been updated successfully. Please login with your new password.'"
        (close)="closeSuccessModal()">
      </app-success-modal>
    </div>
  `
})
export class ChangePasswordComponent {
  password = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  email = '';

  private apiService = inject(ApiService);
  private router = inject(Router);

  constructor() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { email: string };
    if (state?.email) {
      this.email = state.email;
    } else {
      // If no email in state, redirect back to login
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.apiService.setupPassword({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccessModal = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Failed to update password';
      }
    });
  }

  showSuccessModal = false;

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }
}
