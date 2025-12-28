import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { User, Role } from '../../core/models/user.model';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-8 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p class="text-sm text-gray-500 mt-1">Manage system users, roles, and permissions</p>
        </div>
        <a routerLink="/users/new" class="mt-4 md:mt-0 flex items-center justify-center px-6 py-2.5 bg-[#be123c] hover:bg-[#9f1239] text-white rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl font-medium text-sm tracking-wide">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
             Add User
        </a>
      </div>

       <!-- Stats Cards -->
       <div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
           <!-- Total Users -->
           <div class="group bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
               <div class="flex justify-between items-start">
                   <div>
                       <p class="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                       <h3 class="text-3xl font-bold text-gray-900 tracking-tight">{{ users.length }}</h3>
                   </div>
                   <div class="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                   </div>
               </div>
           </div>
           
           <!-- Administrators -->
           <div class="group bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
               <div class="flex justify-between items-start">
                   <div>
                       <p class="text-sm font-medium text-gray-500 mb-1">Administrators</p>
                       <h3 class="text-3xl font-bold text-gray-900 tracking-tight">{{ getCount('ADMIN') }}</h3>
                   </div>
                   <div class="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                   </div>
               </div>
           </div>
       </div>

      <!-- User Table Section -->
      <div class="glass-card rounded-2xl border border-gray-100/50 shadow-lg overflow-hidden flex flex-col">
          <!-- Toolkit / Search -->
          <div class="p-5 border-b border-gray-100/50 bg-gray-50/30">
               <div class="relative max-w-md group">
                   <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg class="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                   </div>
                   <input type="text" class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-white transition-all duration-300 sm:text-sm" placeholder="Search users by name or email...">
               </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-gray-50/50">
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Profile</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                  <th scope="col" class="relative px-6 py-4">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr *ngFor="let user of users" class="group hover:bg-blue-50/30 transition-all duration-200">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full ring-2 ring-white shadow-sm" [src]="'https://ui-avatars.com/api/?name=' + user.name + '&background=random&color=fff'" alt="">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{{ user.name }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border shadow-sm"
                          [ngClass]="{
                            'bg-purple-50 text-purple-700 border-purple-100': user.role === 'ADMIN',
                            'bg-blue-50 text-blue-700 border-blue-100': user.role === 'STAFF',
                            'bg-gray-50 text-gray-600 border-gray-100': user.role === 'USER'
                          }">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.joinedAt | date:'mediumDate' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                        <button (click)="openEditModal(user)" class="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-2 hover:bg-blue-50 rounded-lg" title="Edit User">
                            <span class="sr-only">Edit</span>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button (click)="deleteUser(user)" class="text-red-400 hover:text-red-600 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg" title="Delete User">
                            <span class="sr-only">Delete</span>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div *ngIf="users.length === 0" class="p-12 text-center text-gray-500">
              <p>No users found matching your search.</p>
          </div>
      </div>
      <!-- Edit User Modal -->
      <div *ngIf="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
           <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-gray-900">Edit User</h3>
              <button (click)="closeEditModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
           </div>
           
           <div class="space-y-4">
              <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" [(ngModel)]="selectedUser.name" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary">
              </div>
              
              <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" [(ngModel)]="selectedUser.email" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary">
              </div>
              
              <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select [(ngModel)]="selectedUser.role" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary">
                      <option [value]="'USER'">User</option>
                      <option [value]="'STAFF'">Staff</option>
                      <option [value]="'ADMIN'">Admin</option>
                  </select>
              </div>
           </div>
           
           <div class="mt-8 flex justify-end space-x-3">
              <button (click)="closeEditModal()" class="px-5 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">Cancel</button>
              <button (click)="saveUser()" class="px-5 py-2 text-white bg-primary hover:bg-blue-700 rounded-xl font-medium shadow-md transition-colors">Save Changes</button>
           </div>
        </div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedUser: any = {}; // Clone for editing
  isEditModalOpen = false;

  private apiService = inject(ApiService);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  getCount(role: string): number {
    return this.users.filter(u => u.role === role).length;
  }

  openEditModal(user: User) {
    this.selectedUser = { ...user }; // Clone
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedUser = {};
  }

  saveUser() {
    if (!this.selectedUser.id) return;

    this.apiService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.closeEditModal();
      },
      error: (err) => console.error('Failed to update user', err)
    });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.apiService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
        },
        error: (err) => console.error('Failed to delete user', err)
      });
    }
  }
}
