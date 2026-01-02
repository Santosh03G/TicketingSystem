import { Component, inject } from '@angular/core';
import { SuccessModalComponent } from '../../shared/components/success-modal/success-modal.component';
import { ErrorModalComponent } from '../../shared/components/error-modal/error-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { User, Role } from '../../core/models/user.model';

@Component({
    selector: 'app-user-create',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, SuccessModalComponent, ErrorModalComponent],
    template: `
    <div class="space-y-6 animate-fade-in">
       <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
        <div>
           <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Create New User</h1>
           <p class="text-sm text-gray-500 mt-1">Add a new user to the system</p>
        </div>
        <a routerLink="/tickets" class="mt-4 md:mt-0 text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center transition-colors">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Users
        </a>
      </div>

      <div class="glass-card max-w-3xl mx-auto p-8 rounded-2xl shadow-lg border border-gray-100/50">
        <form (ngSubmit)="onSubmit()" #userForm="ngForm" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <!-- Name -->
                <div>
                    <label for="name" class="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input type="text" id="name" name="name" [(ngModel)]="user.name" required placeholder="John Doe"
                           class="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white placeholder-gray-400">
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input type="email" id="email" name="email" [(ngModel)]="user.email" required email placeholder="john@company.com"
                           class="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white placeholder-gray-400">
                </div>
            </div>

            <!-- Role -->
            <div>
                 <label for="role" class="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                 <div class="relative">
                     <select id="role" name="role" [(ngModel)]="user.role" required
                            class="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer">
                        <option [value]="role" *ngFor="let role of roles">{{role}}</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                 </div>
            </div>

            <!-- Password -->
            <!-- Password Info -->
            <div class="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm border border-blue-100 flex items-start gap-3">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>
                    A temporary password will be automatically generated and sent to the user's email address.
                    They will be required to change it upon first login.
                </p>
            </div>

             <!-- Actions -->
            <div class="flex justify-end space-x-4 pt-6 mt-4 border-t border-gray-100">
                <a routerLink="/users" class="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                    Cancel
                </a>
                <button type="submit" [disabled]="!userForm.form.valid || isLoading"
                        class="px-8 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primary to-rose-700 hover:from-rose-700 hover:to-primary transform transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                    {{ isLoading ? 'Creating...' : 'Create User' }}
                </button>
            </div>
        </form>
      </div>
      <app-success-modal 
        [isOpen]="showSuccessModal" 
        [title]="'User Created'"
        [message]="'User has been created successfully and a welcome email has been sent.'"
        (close)="closeSuccessModal()">
      </app-success-modal>
      <app-error-modal 
        [isOpen]="showErrorModal" 
        [title]="'Creation Failed'"
        [message]="errorMessage"
        (close)="closeErrorModal()">
      </app-error-modal>
    </div>
  `
})
export class UserCreateComponent {
    user: Partial<User> = {
        role: Role.USER
    };
    roles = Object.values(Role);
    isLoading = false;

    private apiService = inject(ApiService);
    private router = inject(Router);

    onSubmit() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.apiService.createUser(this.user as User).subscribe({
            next: () => {
                this.isLoading = false;
                this.showSuccessModal = true;
            },
            error: (error) => {
                console.error('Error creating user:', error);
                this.isLoading = false;
                this.errorMessage = error?.error?.message || 'Failed to create user. Please try again.';
                this.showErrorModal = true;
            }
        });
    }

    // Modal State
    showSuccessModal = false;

    closeSuccessModal() {
        this.showSuccessModal = false;
        this.router.navigate(['/users']);
    }

    showErrorModal = false;
    errorMessage = '';

    closeErrorModal() {
        this.showErrorModal = false;
    }
}
