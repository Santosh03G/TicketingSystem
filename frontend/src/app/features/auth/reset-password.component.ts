import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-premium-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in relative z-0">
      <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
        <div class="glass-card py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border-t-4 border-primary">
          
          <div class="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <h2 class="text-center text-3xl font-bold text-gray-900 tracking-tight">Reset Password</h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              Create a new password for <span class="font-semibold">{{ email }}</span>
            </p>
          </div>

          <form class="space-y-6" (ngSubmit)="onSubmit()" #resetForm="ngForm">
            
            <div class="relative group">
              <input id="password" name="password" type="password" required [(ngModel)]="password"
                     #passwordInput="ngModel" placeholder=" "
                     class="float-input appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-gray-50 focus:bg-white transition-all duration-300"
                     [class.border-red-300]="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)">
              <label for="password" class="float-label absolute left-3 transition-all duration-200 pointer-events-none text-gray-400">
                New Password
              </label>
            </div>
             <div *ngIf="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)" class="text-xs text-red-600 pl-1">
                Password is required.
            </div>

            <div class="relative group">
                <input id="confirmPassword" name="confirmPassword" type="password" required [(ngModel)]="confirmPassword"
                       #confirmPasswordInput="ngModel" placeholder=" "
                       class="float-input appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-gray-50 focus:bg-white transition-all duration-300"
                       [class.border-red-300]="(confirmPasswordInput.invalid || password !== confirmPassword) && (confirmPasswordInput.dirty || confirmPasswordInput.touched)">
                <label for="confirmPassword" class="float-label absolute left-3 transition-all duration-200 pointer-events-none text-gray-400">
                  Confirm Password
                </label>
            </div>
             <div *ngIf="password !== confirmPassword && (confirmPasswordInput.dirty || confirmPasswordInput.touched)" class="text-xs text-red-600 pl-1">
                Passwords do not match.
            </div>

            <div *ngIf="errorMessage" class="rounded-xl bg-red-50 p-4 border border-red-100 animate-shake">
               <div class="flex">
                 <div class="flex-shrink-0">
                   <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                   </svg>
                 </div>
                 <div class="ml-3">
                   <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
                 </div>
               </div>
            </div>

            <div>
              <button type="submit" [disabled]="!resetForm.form.valid || password !== confirmPassword || isLoading"
                      class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primary to-rose-700 hover:from-rose-700 hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:-translate-y-0.5 active:scale-95">
                {{ isLoading ? 'Resetting...' : 'Reset Password' }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';

  private apiService = inject(ApiService);
  private router = inject(Router);

  ngOnInit() {
    this.email = localStorage.getItem('resetEmail') || '';
    if (!this.email) {
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit() {
    if (this.isLoading) return;
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.resetPassword({ email: this.email, password: this.password }).subscribe({
      next: () => {
        localStorage.removeItem('resetEmail');
        // Optionally show success toast/alert
        alert('Password reset successful. Please login with your new password.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Failed to reset password.';
      }
    });
  }
}
