import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Category } from '../../core/models/category.model';

interface Setting {
    key: string;
    value: string;
}

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6 animate-fade-in">
       <!-- Header -->
      <div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your IT support system configuration</p>
      </div>

      <!-- Tabs -->
      <div class="glass-card p-1.5 rounded-xl inline-flex space-x-1 border border-gray-100/50">
          <button (click)="activeTab = 'general'" 
                  [class.bg-white]="activeTab === 'general'" [class.shadow-md]="activeTab === 'general'" [class.text-primary]="activeTab === 'general'"
                  class="px-6 py-2.5 text-sm font-medium rounded-lg focus:outline-none transition-all duration-300 text-gray-500 hover:text-gray-900">
              General
          </button>
          <button (click)="activeTab = 'notifications'" 
                  [class.bg-white]="activeTab === 'notifications'" [class.shadow-md]="activeTab === 'notifications'" [class.text-primary]="activeTab === 'notifications'"
                  class="px-6 py-2.5 text-sm font-medium rounded-lg focus:outline-none transition-all duration-300 text-gray-500 hover:text-gray-900">
              Notifications
          </button>
          <button (click)="activeTab = 'categories'" 
                  [class.bg-white]="activeTab === 'categories'" [class.shadow-md]="activeTab === 'categories'" [class.text-primary]="activeTab === 'categories'"
                  class="px-6 py-2.5 text-sm font-medium rounded-lg focus:outline-none transition-all duration-300 text-gray-500 hover:text-gray-900">
              Categories
          </button>
          <button (click)="activeTab = 'bulk'" 
                  [class.bg-white]="activeTab === 'bulk'" [class.shadow-md]="activeTab === 'bulk'" [class.text-primary]="activeTab === 'bulk'"
                  class="px-6 py-2.5 text-sm font-medium rounded-lg focus:outline-none transition-all duration-300 text-gray-500 hover:text-gray-900">
              Bulk Import
          </button>
      </div>

      <!-- Content -->
      <div class="glass-card rounded-2xl border border-gray-100/50 shadow-lg p-8 relative overflow-hidden">
          
          <div *ngIf="message" [class.bg-green-50]="!isError" [class.text-green-800]="!isError" [class.border-green-200]="!isError"
               [class.bg-red-50]="isError" [class.text-red-800]="isError" [class.border-red-200]="isError"
               class="mb-6 p-4 rounded-xl border flex items-center shadow-sm animate-fade-in">
                <svg *ngIf="!isError" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <svg *ngIf="isError" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               {{ message }}
          </div>

          <!-- General Tab -->
          <div *ngIf="activeTab === 'general'" class="space-y-8 animate-fade-in">
              <!-- System Info Section -->
               <div class="max-w-3xl">
                  <h2 class="text-lg font-bold text-gray-900 mb-1">System Information</h2>
                  <p class="text-sm text-gray-500 mb-6">Basic information about your support system</p>
                  
                  <div class="grid gap-6">
                      <div>
                          <label for="system_name" class="block text-sm font-semibold text-gray-700 mb-1">System Name</label>
                          <input type="text" [(ngModel)]="settingsMap['system_name']" name="system_name" 
                                 class="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white">
                      </div>
                      
                      <div>
                          <label for="support_email" class="block text-sm font-semibold text-gray-700 mb-1">Support Email</label>
                          <input type="email" [(ngModel)]="settingsMap['support_email']" name="support_email" 
                                 class="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white">
                      </div>

                       <div>
                          <label for="target_response_time" class="block text-sm font-semibold text-gray-700 mb-1">Target Response Time (hours)</label>
                          <input type="number" [(ngModel)]="settingsMap['target_response_time']" name="target_response_time" 
                                 class="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 focus:bg-white">
                      </div>
                  </div>
              </div>

               <hr class="border-gray-100">

               <!-- Ticket Management Section -->
               <div>
                  <h2 class="text-lg font-bold text-gray-900 mb-1">Ticket Management</h2>
                  <p class="text-sm text-gray-500 mb-6">Configure how tickets are handled</p>

                   <div class="space-y-4">
                      <!-- Auto Assign -->
                      <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div class="flex flex-col">
                              <span class="text-sm font-medium text-gray-900">Auto-assign tickets</span>
                              <span class="text-sm text-gray-500">Automatically assign new tickets to available staff</span>
                          </div>
                          <button (click)="toggle('auto_assign_tickets')" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                                  [class.bg-primary]="settingsMap['auto_assign_tickets'] === 'true'" [class.bg-gray-300]="settingsMap['auto_assign_tickets'] !== 'true'">
                              <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    [class.translate-x-5]="settingsMap['auto_assign_tickets'] === 'true'" [class.translate-x-0]="settingsMap['auto_assign_tickets'] !== 'true'"></span>
                          </button>
                      </div>
                      
                      <!-- Ticket Reopening -->
                      <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div class="flex flex-col">
                              <span class="text-sm font-medium text-gray-900">Allow ticket reopening</span>
                              <span class="text-sm text-gray-500">Users can reopen resolved tickets</span>
                          </div>
                          <button (click)="toggle('allow_ticket_reopening')" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                                  [class.bg-primary]="settingsMap['allow_ticket_reopening'] === 'true'" [class.bg-gray-300]="settingsMap['allow_ticket_reopening'] !== 'true'">
                              <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    [class.translate-x-5]="settingsMap['allow_ticket_reopening'] === 'true'" [class.translate-x-0]="settingsMap['allow_ticket_reopening'] !== 'true'"></span>
                          </button>
                      </div>
                   </div>
               </div>

              <div class="pt-4">
                  <button (click)="saveSettings()" class="px-8 py-3 bg-[#be123c] hover:bg-[#9f1239] text-white rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl font-medium text-sm tracking-wide">
                      Save Changes
                  </button>
              </div>
          </div>

          <!-- Notifications Tab -->
          <div *ngIf="activeTab === 'notifications'" class="space-y-8 animate-fade-in">
              <div>
                  <h2 class="text-lg font-bold text-gray-900 mb-1">Email Notifications</h2>
                  <p class="text-sm text-gray-500 mb-6">Configure when to send email notifications</p>

                  <div class="grid gap-4">
                      <!-- Toggles -->
                      <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition-colors hover:bg-white hover:shadow-sm">
                          <div class="flex flex-col">
                              <span class="text-sm font-medium text-gray-900">New ticket created</span>
                              <span class="text-sm text-gray-500">Notify staff when a new ticket is created</span>
                          </div>
                          <button (click)="toggle('notify_new_ticket')" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                                  [class.bg-primary]="settingsMap['notify_new_ticket'] === 'true'" [class.bg-gray-300]="settingsMap['notify_new_ticket'] !== 'true'">
                              <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    [class.translate-x-5]="settingsMap['notify_new_ticket'] === 'true'" [class.translate-x-0]="settingsMap['notify_new_ticket'] !== 'true'"></span>
                          </button>
                      </div>

                      <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition-colors hover:bg-white hover:shadow-sm">
                          <div class="flex flex-col">
                              <span class="text-sm font-medium text-gray-900">Ticket assigned</span>
                              <span class="text-sm text-gray-500">Notify staff when a ticket is assigned to them</span>
                          </div>
                          <button (click)="toggle('notify_ticket_assigned')" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                                  [class.bg-primary]="settingsMap['notify_ticket_assigned'] === 'true'" [class.bg-gray-300]="settingsMap['notify_ticket_assigned'] !== 'true'">
                              <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    [class.translate-x-5]="settingsMap['notify_ticket_assigned'] === 'true'" [class.translate-x-0]="settingsMap['notify_ticket_assigned'] !== 'true'"></span>
                          </button>
                      </div>

                      <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition-colors hover:bg-white hover:shadow-sm">
                          <div class="flex flex-col">
                              <span class="text-sm font-medium text-gray-900">Ticket resolved</span>
                              <span class="text-sm text-gray-500">Notify users when their ticket is resolved</span>
                          </div>
                          <button (click)="toggle('notify_ticket_resolved')" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                                  [class.bg-primary]="settingsMap['notify_ticket_resolved'] === 'true'" [class.bg-gray-300]="settingsMap['notify_ticket_resolved'] !== 'true'">
                              <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    [class.translate-x-5]="settingsMap['notify_ticket_resolved'] === 'true'" [class.translate-x-0]="settingsMap['notify_ticket_resolved'] !== 'true'"></span>
                          </button>
                      </div>

                      <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition-colors hover:bg-white hover:shadow-sm">
                          <div class="flex flex-col">
                              <span class="text-sm font-medium text-gray-900">New comment added</span>
                              <span class="text-sm text-gray-500">Notify when someone comments on a ticket</span>
                          </div>
                          <button (click)="toggle('notify_new_comment')" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                                  [class.bg-primary]="settingsMap['notify_new_comment'] === 'true'" [class.bg-gray-300]="settingsMap['notify_new_comment'] !== 'true'">
                              <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    [class.translate-x-5]="settingsMap['notify_new_comment'] === 'true'" [class.translate-x-0]="settingsMap['notify_new_comment'] !== 'true'"></span>
                          </button>
                      </div>
                  </div>
              </div>
               <div class="pt-4">
                  <button (click)="saveSettings()" class="px-8 py-3 bg-[#be123c] hover:bg-[#9f1239] text-white rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl font-medium text-sm tracking-wide">
                      Save Changes
                  </button>
              </div>
          </div>

          <!-- Categories Tab -->
          <div *ngIf="activeTab === 'categories'" class="space-y-8 animate-fade-in">
              <div>
                  <h2 class="text-lg font-bold text-gray-900 mb-1">Ticket Categories</h2>
                  <p class="text-sm text-gray-500 mb-6">Manage the list of categories available for new tickets</p>

                  <!-- Add Category Form -->
                  <div class="flex gap-4 items-end mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div class="flex-grow">
                          <label for="newCategory" class="block text-sm font-semibold text-gray-700 mb-1">New Category Name</label>
                          <input type="text" [(ngModel)]="newCategoryName" (keyup.enter)="addCategory()" placeholder="e.g. Hardware, Software, Network"
                                 class="block w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white">
                      </div>
                      <button (click)="addCategory()" [disabled]="!newCategoryName.trim() || isAddingCategory"
                              class="px-6 py-2.5 bg-[#be123c] hover:bg-[#9f1239] text-white rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl font-medium text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                          {{ isAddingCategory ? 'Adding...' : 'Add Category' }}
                      </button>
                  </div>

                  <!-- Categories List -->
                   <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                       <ul class="divide-y divide-gray-100">
                           <li *ngFor="let cat of categories" class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                               <span class="text-gray-900 font-medium">{{ cat.name }}</span>
                               <button (click)="deleteCategory(cat.id)" class="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50">
                                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                               </button>
                           </li>
                           <li *ngIf="categories.length === 0" class="p-8 text-center text-gray-500 italic">
                               No categories found. Add one above.
                           </li>
                       </ul>
                   </div>
              </div>
          </div>

          <!-- Bulk Import Tab -->
          <div *ngIf="activeTab === 'bulk'" class="space-y-8 animate-fade-in">
              <div>
                  <h2 class="text-lg font-bold text-gray-900 mb-1">Bulk User Creation</h2>
                  <p class="text-sm text-gray-500 mb-6">Upload an Excel file (.xlsx) to create multiple users at once.</p>

                  <div class="glass-card p-8 rounded-xl border border-gray-100/50 flex flex-col items-center justify-center border-dashed border-2 border-gray-200 hover:border-primary/50 transition-colors bg-gray-50/50 relative">
                      
                      <input #fileInput id="file-upload" name="file-upload" type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".xlsx, .xls" (change)="onFileSelected(fileInput.files)">

                      <div class="flex flex-col items-center justify-center pointer-events-none">
                          <div class="mb-4 text-gray-300 transition-colors" [class.text-primary]="selectedFile">
                              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          </div>

                          <div class="mb-6 w-full max-w-md text-center">
                              <span class="mt-2 block text-sm font-medium text-gray-900">
                                  {{ selectedFile ? selectedFile.name : 'Click to select a file' }}
                              </span>
                              <span class="mt-1 block text-xs text-gray-500">Allowed formats: .xlsx, .xls</span>
                          </div>
                      </div>

                      <button (click)="uploadUsers()" [disabled]="!selectedFile" class="z-20 px-8 py-3 bg-[#be123c] hover:bg-[#9f1239] text-white rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl font-medium text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                          Upload Users
                      </button>
                  </div>

                  <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start">
                      <svg class="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                          <h4 class="text-sm font-bold text-blue-900">Excel Format Instructions</h4>
                          <p class="text-sm text-blue-800 mt-1">The Excel file must contain the following columns in order (starting from the second row):</p>
                          <ul class="list-disc list-inside text-xs text-blue-700 mt-2 space-y-1">
                              <li>Column 1: Name</li>
                              <li>Column 2: Email (must be unique)</li>
                              <li>Column 3: Password</li>
                              <li>Column 4: Role (USER, ADMIN, STAFF)</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>

      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
    activeTab = 'general';
    settingsMap: { [key: string]: string } = {
        'system_name': 'IT Support Portal',
        'support_email': 'support@company.com',
        'target_response_time': '24',
        'auto_assign_tickets': 'false',
        'allow_ticket_reopening': 'true',
        'notify_new_ticket': 'true',
        'notify_ticket_assigned': 'true',
        'notify_ticket_resolved': 'true',
        'notify_new_comment': 'true'
    };
    message = '';
    isError = false;

    // Categories
    categories: Category[] = [];
    newCategoryName = '';
    isAddingCategory = false;

    // Bulk Import
    selectedFile: File | null = null;

    private apiService = inject(ApiService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.loadSettings();
        this.loadCategories();
    }

    loadSettings() {
        this.apiService.getSettings().subscribe({
            next: (settings: Setting[]) => {
                settings.forEach(s => {
                    this.settingsMap[s.key] = s.value;
                });
            },
            error: (err) => console.error('Failed to load settings', err)
        });
    }

    loadCategories() {
        this.apiService.getCategories().subscribe({
            next: (data) => this.categories = data,
            error: (err) => console.error('Failed to load categories', err)
        });
    }

    addCategory() {
        if (!this.newCategoryName.trim()) return;

        this.isAddingCategory = true;
        this.apiService.createCategory({ name: this.newCategoryName }).subscribe({
            next: (cat) => {
                this.categories.push(cat);
                this.newCategoryName = '';
                this.isAddingCategory = false;
                this.message = 'Category added successfully';
                this.isError = false;
                setTimeout(() => this.message = '', 3000);
            },
            error: (err) => {
                this.isAddingCategory = false;
                this.isError = true;
                this.message = err.error?.message || 'Failed to add category';
            }
        });
    }

    deleteCategory(id: number) {
        if (!confirm('Are you sure you want to delete this category?')) return;

        this.apiService.deleteCategory(id).subscribe({
            next: () => {
                this.categories = this.categories.filter(c => c.id !== id);
                this.message = 'Category deleted';
                this.isError = false;
                setTimeout(() => this.message = '', 3000);
            },
            error: (err) => {
                this.isError = true;
                this.message = 'Failed to delete category';
            }
        });
    }

    toggle(key: string) {
        const current = this.settingsMap[key] === 'true';
        this.settingsMap[key] = String(!current);
    }

    saveSettings() {
        const settingsList: Setting[] = Object.keys(this.settingsMap).map(key => ({
            key: key,
            value: this.settingsMap[key]
        }));

        this.apiService.saveSettings(settingsList).subscribe({
            next: () => {
                this.isError = false;
                this.message = 'Settings saved successfully';
                setTimeout(() => this.message = '', 3000);
            },
            error: (err) => {
                console.error(err);
                this.isError = true;
                this.message = 'Failed to save settings';
            }
        });
    }

    // @ts-ignore
    onFileSelected(files: FileList | null) {
        if (files && files.length > 0) {
            this.selectedFile = files.item(0);
            console.log('File selected:', this.selectedFile);
        } else {
            this.selectedFile = null;
        }
        this.cdr.detectChanges();
    }

    uploadUsers() {
        if (!this.selectedFile) return;
        this.message = 'Uploading...';
        this.isError = false;

        this.apiService.uploadUsers(this.selectedFile).subscribe({
            next: (res) => {
                this.message = res || 'Users imported successfully';
                this.selectedFile = null;
                this.isError = false;
                setTimeout(() => this.message = '', 5000);
            },
            error: (err) => {
                this.isError = true;
                if (err.error && typeof err.error === 'object') {
                    this.message = err.error.message || err.error.error || 'Failed to import users';
                } else {
                    this.message = err.error || 'Failed to import users';
                }
                console.error('Upload failed:', err);
            }
        });
    }
}
