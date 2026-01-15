import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade-in">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
            Support Dashboard
          </h1>
          <p class="mt-2 text-sm text-gray-500 font-medium">
            Overview of your support ticket status and activities
          </p>
        </div>
        <div class="mt-4 md:mt-0">
             <button routerLink="/tickets/new" class="btn-primary flex items-center shadow-lg transform hover:-translate-y-0.5 transition-all text-base px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-rose-700 hover:from-rose-700 hover:to-primary text-white font-medium border border-transparent">
               <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
               Create New Ticket
            </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <!-- Open Tickets -->
        <div class="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
             <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
             <!-- Decorative Circle -->
             <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/20 blur-xl"></div>
             
             <div class="p-6 relative z-10">
                <div class="flex justify-between items-start">
                   <div>
                     <p class="text-rose-100 text-sm font-semibold uppercase tracking-wider">Open Tickets</p>
                      <h3 class="mt-2 text-4xl font-bold text-white">{{ stats?.open || 0 }}</h3>
                   </div>
                   <div class="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white">
                       <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   </div>
                </div>
                 <div class="mt-8 flex items-center text-rose-100 text-sm">
                     <span>Awaiting assignment</span>
                 </div>
             </div>
        </div>

        <!-- In Progress -->
        <div class="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
             <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
             <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/20 blur-xl"></div>
             
             <div class="p-6 relative z-10">
                <div class="flex justify-between items-start">
                   <div>
                     <p class="text-amber-100 text-sm font-semibold uppercase tracking-wider">In Progress</p>
                      <h3 class="mt-2 text-4xl font-bold text-white">{{ stats?.in_progress || 0 }}</h3>
                   </div>
                   <div class="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                   </div>
                </div>
                 <div class="mt-8 flex items-center text-amber-100 text-sm">
                     <span>Currently being worked on</span>
                 </div>
             </div>
        </div>

        <!-- Resolved -->
        <div class="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
             <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
             <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/20 blur-xl"></div>
             
             <div class="p-6 relative z-10">
                <div class="flex justify-between items-start">
                   <div>
                     <p class="text-emerald-100 text-sm font-semibold uppercase tracking-wider">Resolved</p>
                      <h3 class="mt-2 text-4xl font-bold text-white">{{ stats?.resolved || 0 }}</h3>
                   </div>
                   <div class="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white">
                       <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   </div>
                </div>
                 <div class="mt-8 flex items-center text-emerald-100 text-sm">
                     <span>Successfully completed</span>
                 </div>
             </div>
        </div>
      </div>


      <!-- Admin Stats Section -->
      <!-- Admin Stats Section -->
      <div *ngIf="authService.currentUser()?.role === 'ADMIN'" class="mt-12 animate-fade-in-up" style="animation-delay: 200ms;">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Performance Overview
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
             <!-- Resolved Today -->
            <div class="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                 <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                 <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/20 blur-xl"></div>
                 
                 <div class="p-6 relative z-10">
                    <div class="flex justify-between items-start">
                       <div>
                         <p class="text-purple-100 text-sm font-semibold uppercase tracking-wider">Resolved Today</p>
                          <h3 class="mt-2 text-4xl font-bold text-white">{{ stats?.resolved_today || 0 }}</h3>
                       </div>
                       <div class="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white">
                           <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                       </div>
                    </div>
                     <div class="mt-4 text-purple-100 text-sm">
                         Tickets closed in last 24h
                     </div>
                 </div>
            </div>

             <!-- Resolved Month -->
            <div class="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                 <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                 <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/20 blur-xl"></div>
                 
                 <div class="p-6 relative z-10">
                    <div class="flex justify-between items-start">
                       <div>
                         <p class="text-blue-100 text-sm font-semibold uppercase tracking-wider">Resolved This Month</p>
                          <h3 class="mt-2 text-4xl font-bold text-white">{{ stats?.resolved_month || 0 }}</h3>
                       </div>
                       <div class="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white">
                           <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                       </div>
                    </div>
                     <div class="mt-4 text-blue-100 text-sm">
                         Tickets closed since 1st of month
                     </div>
                 </div>
            </div>

             <!-- Resolved Overall -->
            <div class="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                 <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                 <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/20 blur-xl"></div>
                 
                 <div class="p-6 relative z-10">
                    <div class="flex justify-between items-start">
                       <div>
                         <p class="text-teal-100 text-sm font-semibold uppercase tracking-wider">Resolved Overall</p>
                          <h3 class="mt-2 text-4xl font-bold text-white">{{ stats?.resolved_total || 0 }}</h3>
                       </div>
                       <div class="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white">
                           <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                       </div>
                    </div>
                     <div class="mt-4 text-teal-100 text-sm">
                         Total tickets successfully closed
                     </div>
                 </div>
            </div>

        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  private apiService = inject(ApiService);
  public authService = inject(AuthService);

  ngOnInit() {
    this.apiService.getDashboardStats().subscribe(data => {
      this.stats = data;
    });
  }
}
