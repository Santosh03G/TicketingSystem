import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePipe],
    template: `
    <div class="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Reports</h1>
          <p class="mt-2 text-sm text-gray-500 font-medium">Generate comprehensive insights and track performance metrics.</p>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/20 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        
        <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            Filter Options
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Status Filter -->
            <div class="group">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Status</label>
                <div class="relative">
                    <select [(ngModel)]="filters.status" class="block w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 ease-in-out font-medium text-gray-700 cursor-pointer hover:bg-white hover:shadow-sm">
                        <option value="">All Statuses</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- User Filter -->
            <div class="group">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Created By</label>
                <div class="relative">
                     <select [(ngModel)]="filters.userId" class="block w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 ease-in-out font-medium text-gray-700 cursor-pointer hover:bg-white hover:shadow-sm">
                        <option [ngValue]="null">All Users</option>
                        <option *ngFor="let user of users" [ngValue]="user.id">{{ user.name }}</option>
                    </select>
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Date Range (Start) -->
             <div class="group">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">From</label>
                <div class="relative">
                    <input type="datetime-local" [(ngModel)]="filters.start" class="block w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 ease-in-out font-medium text-gray-700 hover:bg-white hover:shadow-sm">
                     <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Date Range (End) -->
             <div class="group">
                 <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">To</label>
                 <div class="relative">
                    <input type="datetime-local" [(ngModel)]="filters.end" class="block w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 ease-in-out font-medium text-gray-700 hover:bg-white hover:shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-8 flex justify-end border-t border-gray-100 pt-6">
            <button (click)="search()" [disabled]="isLoading" class="btn-primary flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-base px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                <svg *ngIf="!isLoading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ isLoading ? 'Searching...' : 'Search' }}
            </button>
        </div>
      </div>

      <!-- Error Alert -->
      <div *ngIf="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm animate-fade-in mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
          <div class="ml-auto pl-3">
             <div class="-mx-1.5 -my-1.5">
                <button (click)="error = null" class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600">
                  <span class="sr-only">Dismiss</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
             </div>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div *ngIf="hasSearched" class="bg-white shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100 overflow-hidden animate-fade-in-up" style="animation-delay: 150ms;">
        <div class="px-8 py-6 border-b border-gray-100 bg-white flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">Detailed Results</h3>
            <div class="text-sm text-gray-500">Showing {{ tickets.length }} records</div>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50/50">
                    <tr>
                        <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket Details</th>
                        <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                        <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Raised By</th>
                        <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                    <tr *ngFor="let ticket of tickets" class="hover:bg-indigo-50/30 transition-colors group cursor-default">
                        <td class="px-8 py-5 whitespace-nowrap">
                            <div class="flex flex-col">
                                <span class="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{{ ticket.title }}</span>
                                <span class="text-xs text-gray-400">#{{ ticket.id }}</span>
                            </div>
                        </td>
                        <td class="px-8 py-5 whitespace-nowrap">
                             <span class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm"
                                [ngClass]="{
                                    'bg-green-100 text-green-700 border border-green-200': ticket.status === 'RESOLVED',
                                    'bg-yellow-100 text-yellow-700 border border-yellow-200': ticket.status === 'IN_PROGRESS',
                                    'bg-red-100 text-red-700 border border-red-200': ticket.status === 'OPEN',
                                    'bg-gray-100 text-gray-700 border border-gray-200': ticket.status === 'CLOSED'
                                }">
                                {{ ticket.status.replace('_', ' ') }}
                            </span>
                        </td>
                        <td class="px-8 py-5 whitespace-nowrap">
                             <div class="flex items-center">
                                <span class="h-2.5 w-2.5 rounded-full mr-2"
                                    [ngClass]="{
                                        'bg-red-500': ticket.priority === 'HIGH' || ticket.priority === 'URGENT',
                                        'bg-yellow-500': ticket.priority === 'MEDIUM',
                                        'bg-blue-500': ticket.priority === 'LOW'
                                    }"></span>
                                <span class="text-sm font-medium text-gray-600">{{ ticket.priority }}</span>
                             </div>
                        </td>
                        <td class="px-8 py-5 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                                    <img class="h-full w-full rounded-full object-cover border-2 border-white" [src]="'https://ui-avatars.com/api/?name=' + (ticket.createdBy?.name || 'U') + '&background=random'" alt="">
                                </div>
                                <div class="ml-3">
                                    <div class="text-sm font-medium text-gray-900">{{ ticket.createdBy?.name || 'Unknown' }}</div>
                                    <div class="text-xs text-gray-500">{{ ticket.createdBy?.email }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-500">{{ ticket.createdAt | date:'mediumDate' }}</td>
                    </tr>
                    <tr *ngIf="tickets.length === 0">
                        <td colspan="5" class="px-8 py-12 text-center">
                            <div class="flex flex-col items-center justify-center">
                                <div class="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <h3 class="text-lg font-medium text-gray-900">No tickets found</h3>
                                <p class="text-gray-500 mt-1">Try adjusting your filters to broaden your search.</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

    </div>
  `
})
export class ReportsComponent implements OnInit {
    apiService = inject(ApiService);
    users: any[] = [];
    tickets: any[] = [];

    hasSearched = false;
    isLoading = false;
    error: string | null = null;

    filters: any = {
        status: '',
        userId: null,
        start: '',
        end: ''
    };

    ngOnInit() {
        this.loadUsers();
        // Use setTimeout to avoid expression changed errors and ensure initial load
        setTimeout(() => {
            this.search();
        });
    }

    loadUsers() {
        this.apiService.getUsers().subscribe({
            next: (data) => this.users = data,
            error: (err) => {
                console.error('Failed to load users', err);
                this.error = 'Failed to load users. Please check backend connection.';
            }
        });
    }

    search() {
        this.isLoading = true;
        this.hasSearched = false;
        this.error = null;

        // Format dates to ISO
        const params = { ...this.filters };
        if (params.status === '') delete params.status;

        this.apiService.searchTickets(params).subscribe({
            next: (data) => {
                this.tickets = data;
                this.hasSearched = true;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Search failed', err);
                this.error = 'Failed to load reports. Is the backend running?';
                this.isLoading = false;
                this.hasSearched = true; // Show the table container (which will show error or empty state)
            }
        });
    }
}
