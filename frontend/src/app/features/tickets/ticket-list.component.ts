import { Component, OnInit, inject, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Ticket, TicketStatus, TicketPriority } from '../../core/models/ticket.model';
import { User, Role } from '../../core/models/user.model';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CustomSelectComponent, SelectOption } from '../../shared/components/custom-select/custom-select.component';
import { SuccessModalComponent } from '../../shared/components/success-modal/success-modal.component';
import { WarningModalComponent } from '../../shared/components/warning-modal/warning-modal.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CustomSelectComponent, SuccessModalComponent, WarningModalComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">All Tickets</h1>
          <p class="text-sm text-gray-500 mt-1">View and manage support tickets</p>
        </div>
        <a routerLink="/tickets/new" class="mt-4 md:mt-0 btn-primary flex items-center justify-center shadow-lg transform hover:-translate-y-0.5 transition-all text-sm px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-rose-700 hover:from-rose-700 hover:to-primary text-white font-medium">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
             New Ticket
        </a>
      </div>

      <!-- Filters -->
      <div class="glass-card p-4 rounded-xl shadow-sm border border-gray-100/50 relative z-20 overflow-visible">
        <div class="flex flex-col sm:flex-row gap-4 sm:items-center">
             <div class="relative flex-grow group">
                 <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg class="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 </div>
                 <input type="text" placeholder="Search tickets..." class="block w-full pl-10 sm:text-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary p-2.5 bg-gray-50 focus:bg-white transition-all">
             </div>
             <div class="w-full sm:w-48 relative">
                <app-custom-select
                    #statusFilterDropdown
                    [options]="statusOptions"
                    [selectedValue]="selectedStatus"
                    (selectionChange)="onStatusFilterChange($event)"
                    (opened)="onDropdownOpen(statusFilterDropdown)"
                    placeholder="All Statuses">
                </app-custom-select>
             </div>
        </div>
      </div>

      <!-- Ticket Table -->
      <div class="glass-card rounded-2xl border border-gray-100/50 shadow-lg"> <!-- Removed overflow-hidden to allow dropdowns -->
        <ul class="divide-y divide-gray-200 rounded-2xl"> <!-- Removed overflow-hidden here too -->
          <li *ngFor="let ticket of filteredTickets" class="block hover:bg-gray-50 transition-colors duration-150 relative first:rounded-t-2xl last:rounded-b-2xl pointer-events-auto"> <!-- Added corner rounding to items -->
            <div class="px-4 py-4 sm:px-6" (click)="viewTicket(ticket.id)">
              <div class="flex items-center justify-between cursor-pointer">
                <div class="flex items-center truncate">
                  <p class="text-sm font-medium text-primary truncate mr-2">
                    #{{ ticket.id }} - {{ ticket.title }}
                  </p>
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [ngClass]="{
                          'bg-blue-100 text-blue-800': ticket.status === 'OPEN',
                          'bg-yellow-100 text-yellow-800': ticket.status === 'IN_PROGRESS',
                          'bg-green-100 text-green-800': ticket.status === 'RESOLVED',
                          'bg-red-100 text-red-800': ticket.status === 'DENIED'
                        }">
                    {{ ticket.status }}
                  </span>
                </div>
                <div class="ml-2 flex-shrink-0 flex">
                   <p class="flex items-center text-sm text-gray-500">
                      {{ ticket.createdBy.name }}
                   </p>
                </div>
              </div>
              
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="flex items-center text-sm text-gray-500">
                    <span class="px-2 py-0.5 rounded text-xs font-medium"
                           [ngClass]="{
                              'bg-gray-100 text-gray-800': ticket.priority === 'LOW',
                              'bg-blue-50 text-blue-700': ticket.priority === 'MEDIUM',
                              'bg-orange-50 text-orange-700': ticket.priority === 'HIGH',
                              'bg-red-50 text-red-700': ticket.priority === 'CRITICAL'
                           }">
                         {{ ticket.priority }} Priority
                     </span>
                  </p>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    Created on <time>{{ ticket.createdAt | date:'mediumDate' }}</time>
                  </p>
                </div>
              </div>

              <!-- Admin Actions -->
              <div class="mt-4 border-t border-gray-100 pt-4 flex items-center justify-between" *ngIf="isAdmin()" (click)="$event.stopPropagation()">
                  <div class="flex items-center space-x-3 w-64"> <!-- Constrained width for the dropdown -->
                      <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Assign to:</label>
                      <app-custom-select 
                          #ticketAssignDropdown
                          [options]="staffOptions" 
                          [selectedValue]="ticket.assignedTo?.id || ''" 
                          placeholder="Unassigned"
                          (selectionChange)="assignTicket(ticket, $event)"
                          (opened)="onDropdownOpen(ticketAssignDropdown)">
                      </app-custom-select>
                  </div>
                  <div class="flex space-x-2">
                      <button *ngIf="ticket.status !== 'RESOLVED'" (click)="updateStatus(ticket, 'RESOLVED')" class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                          Resolve
                      </button>
                      <button *ngIf="ticket.status !== 'DENIED'" (click)="updateStatus(ticket, 'DENIED')" class="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                          Deny
                      </button>
                  </div>
              </div>
            </div>
          </li>
          <li *ngIf="tickets.length === 0" class="px-4 py-8 text-center text-gray-500">
               No tickets found.
          </li>
        </ul>
      </div>
      <app-success-modal 
        [isOpen]="showSuccessModal" 
        [title]="successTitle"
        [message]="successMessage"
        (close)="closeSuccessModal()">
      </app-success-modal>
      
      <app-warning-modal
        [isOpen]="showWarningModal"
        [title]="warningTitle"
        [message]="warningMessage"
        [variant]="warningVariant"
        (confirm)="onWarningConfirm()"
        (cancel)="closeWarningModal()">
      </app-warning-modal>
    </div>
  `
})
export class TicketListComponent implements OnInit {
  @ViewChildren(CustomSelectComponent) dropdowns!: QueryList<CustomSelectComponent>;

  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = []; // Store filtered tickets
  staffUsers: User[] = [];
  staffOptions: SelectOption[] = [];

  statusOptions: SelectOption[] = [
    { label: 'All Statuses', value: '' },
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Denied', value: 'DENIED' }
  ];
  selectedStatus = '';

  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.loadTickets();
    if (this.isAdmin()) {
      this.apiService.getUsers().subscribe(users => {
        this.staffUsers = users.filter(u => u.role === 'ADMIN' || u.role === 'STAFF');
        // Prepare options for the custom select
        this.staffOptions = [
          { label: 'Unassigned', value: '' },
          ...this.staffUsers.map(u => ({ label: u.name, value: u.id }))
        ];
      });
    }
  }

  loadTickets() {
    this.apiService.getTickets().subscribe(data => {
      const user = this.authService.currentUser();
      if (user && user.role === 'USER') {
        this.tickets = data.filter(t => t.createdBy.id === user.id);
      } else {
        this.tickets = data;
      }
      this.applyFilter();
    });
  }

  isAdmin(): boolean {
    return this.authService.hasRole([Role.ADMIN, Role.STAFF]);
  }

  onStatusFilterChange(status: string) {
    this.selectedStatus = status;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedStatus) {
      this.filteredTickets = this.tickets.filter(t => t.status === this.selectedStatus);
    } else {
      this.filteredTickets = this.tickets;
    }
  }

  viewTicket(id: number) {
    this.router.navigate(['/tickets', id]);
  }

  updateStatus(ticket: Ticket, status: string) {
    this.pendingTicket = ticket;
    this.pendingStatus = status;

    // Customize message based on status
    if (status === 'RESOLVED') {
      this.warningTitle = 'Resolve Ticket';
      this.warningMessage = 'Are you sure you want to resolve this ticket?';
      this.warningVariant = 'success';
    } else if (status === 'DENIED') {
      this.warningTitle = 'Deny Ticket';
      this.warningMessage = 'Are you sure you want to deny this ticket?';
      this.warningVariant = 'warning';
    } else {
      this.warningTitle = 'Update Status';
      this.warningMessage = `Are you sure you want to mark this ticket as ${status}?`;
      this.warningVariant = 'warning';
    }

    this.openWarningModal();
  }

  processStatusUpdate(ticket: Ticket, status: string) {
    this.apiService.updateTicket(ticket.id, { status: status as TicketStatus }).subscribe({
      next: () => {
        console.log('Ticket status updated successfully');
        this.loadTickets();
        this.openSuccessModal('Success', `Ticket status has been updated to ${status}.`);
      },
      error: (err) => {
        console.error('Failed to update status', err);
        alert('Failed to update ticket status. Check console for details.');
      }
    });
  }

  assignTicket(ticket: Ticket, userId: any) {
    console.log('Attempting assignment:', { ticketId: ticket.id, userId });

    if (!userId) {
      // If empty string, maybe we want to unassign? currently API might not support setting null easily without specific handling 
      // but assuming we just log warning or support it
      // If the backend `User` field is nullable, we can try sending null.
      // Let's try to unassign if user wants to.
      // For now, I'll assume we can pass null if API supports it, or just stick to existing logic.
      // existing logic was: if (!userId) return;
      // But 'Unassigned' option value is ''.

      // Let's try to handle unassignment.
      // But wait, existing logic said: if (!userId) { console.warn... return; }
      // So I should stick to that unless I change backend.

      if (userId === '') {
        console.log('Unassigning not fully implemented in frontend logic yet, or backend.');
        return;
      }
    }

    const user = this.staffUsers.find(u => u.id === Number(userId));
    if (user) {
      this.apiService.updateTicket(ticket.id, { assignedTo: user }).subscribe({
        next: () => {
          console.log('Ticket assigned successfully in frontend');
          this.loadTickets();
          this.openSuccessModal('Success', 'Ticket assigned successfully!');
        },
        error: (err) => {
          console.error('API Error during assignment:', err);
          alert('Failed to assign ticket. See console for error.');
        }
      });
    } else {
      console.error('User not found in local staff list for ID:', userId);
    }
  }

  onDropdownOpen(openedDropdown: CustomSelectComponent) {
    if (this.dropdowns) {
      this.dropdowns.forEach(dropdown => {
        if (dropdown !== openedDropdown) {
          dropdown.close();
        }
      });
    }
  }

  // Modal State
  showSuccessModal = false;
  successTitle = 'Success';
  successMessage = 'Action is done successfully!';

  openSuccessModal(title?: string, message?: string) {
    if (title) this.successTitle = title;
    if (message) this.successMessage = message;
    this.showSuccessModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  // Warning Modal State
  showWarningModal = false;
  pendingTicket: Ticket | null = null;
  pendingStatus: string | null = null;
  warningTitle = 'Warning';
  warningMessage = 'Are you sure about this action?';
  warningVariant: 'warning' | 'success' = 'warning';

  openWarningModal() {
    this.showWarningModal = true;
  }

  closeWarningModal() {
    this.showWarningModal = false;
    this.pendingTicket = null;
    this.pendingStatus = null;
  }

  onWarningConfirm() {
    if (this.pendingTicket && this.pendingStatus) {
      this.processStatusUpdate(this.pendingTicket, this.pendingStatus);
      this.closeWarningModal();
    }
  }
}
