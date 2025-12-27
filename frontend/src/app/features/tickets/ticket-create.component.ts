import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Ticket, TicketPriority, TicketStatus } from '../../core/models/ticket.model';
import { User, Role } from '../../core/models/user.model';
import { CustomSelectComponent, SelectOption } from '../../shared/components/custom-select/custom-select.component';

@Component({
    selector: 'app-ticket-create',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, CustomSelectComponent],
    template: `
    <div class="space-y-6 animate-fade-in">
       <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
        <div>
           <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Create New Ticket</h1>
           <p class="text-sm text-gray-500 mt-1">Submit a new support request</p>
        </div>
        <a routerLink="/tickets" class="mt-4 md:mt-0 text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center transition-colors">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Tickets
        </a>
      </div>

      <div class="glass-card max-w-4xl mx-auto p-8 rounded-2xl shadow-lg border border-gray-100/50">
        <form (ngSubmit)="onSubmit()" #ticketForm="ngForm" class="space-y-8">
            <!-- Title -->
            <div class="relative group">
                <label for="title" class="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input type="text" id="title" name="title" [(ngModel)]="ticket.title" required placeholder="Brief summary of the issue"
                       class="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white placeholder-gray-400 shadow-sm">
            </div>

            <!-- Description -->
            <div>
                <label for="description" class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea id="description" name="description" rows="6" [(ngModel)]="ticket.description" required placeholder="Detailed explanation of the problem..."
                          class="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white placeholder-gray-400 shadow-sm"></textarea>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <!-- Priority -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                    <app-custom-select
                        [options]="priorityOptions"
                        [selectedValue]="ticket.priority"
                        (selectionChange)="ticket.priority = $event"
                        placeholder="Select Priority">
                    </app-custom-select>
                </div>

                <!-- Category -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                     <app-custom-select
                        [options]="categoryOptions"
                        [selectedValue]="ticket.category"
                        (selectionChange)="ticket.category = $event"
                        placeholder="Select Category">
                    </app-custom-select>
                </div>

                <!-- Assigned To (Optional) -->
                <div *ngIf="isAdmin()" class="sm:col-span-2 md:col-span-1">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Assign To (Optional)</label>
                    <app-custom-select
                        [options]="staffOptions"
                        [selectedValue]="ticket.assignedTo"
                        (selectionChange)="ticket.assignedTo = $event"
                        placeholder="Unassigned">
                    </app-custom-select>
                </div>
            </div>

             <!-- Actions -->
            <div class="flex justify-end space-x-4 pt-6 mt-4 border-t border-gray-100">
                <a routerLink="/tickets" class="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                    Cancel
                </a>
                <button type="submit" [disabled]="!ticketForm.form.valid || isLoading"
                        class="px-8 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primary to-rose-700 hover:from-rose-700 hover:to-primary transform transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                    {{ isLoading ? 'Creating...' : 'Create Ticket' }}
                </button>
            </div>
        </form>
      </div>
    </div>
  `
})
export class TicketCreateComponent implements OnInit {
    ticket: Partial<Ticket> = {
        priority: TicketPriority.MEDIUM,
        status: TicketStatus.OPEN,
        assignedTo: undefined
    };

    priorityOptions: SelectOption[] = Object.values(TicketPriority).map(p => ({ label: p, value: p }));
    categoryOptions: SelectOption[] = [];
    staffOptions: SelectOption[] = [];
    isLoading = false;

    private apiService = inject(ApiService);
    private authService = inject(AuthService);
    private router = inject(Router);

    ngOnInit() {
        // Fetch categories
        this.apiService.getCategories().subscribe(categories => {
            this.categoryOptions = categories.map(c => ({ label: c.name, value: c }));
        });

        // Fetch users to populate 'Assign To' dropdown
        this.apiService.getUsers().subscribe(users => {
            // Filter for staff only? Or just all users as per existing logic
            // Adding an 'Unassigned' option is handled by the placeholder or a specific null option
            this.staffOptions = [
                { label: 'Unassigned', value: null }, // Explicit unassigned option
                ...users.map(u => ({ label: u.name || u.email, value: u }))
            ];
        });
    }

    isAdmin(): boolean {
        return this.authService.hasRole([Role.ADMIN, Role.STAFF]);
    }

    onSubmit() {
        if (this.isLoading) return;

        this.isLoading = true;

        const currentUser = this.authService.currentUser();
        if (currentUser) {
            this.ticket.createdBy = currentUser;

            this.apiService.createTicket(this.ticket).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.router.navigate(['/tickets']);
                },
                error: (error) => {
                    console.error('Error creating ticket:', error);
                    this.isLoading = false;
                    alert('Failed to create ticket.');
                }
            });
        } else {
            this.isLoading = false;
            alert('User not authenticated. Please login.');
            this.router.navigate(['/login']);
        }
    }
}
