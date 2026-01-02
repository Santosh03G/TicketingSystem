import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-warning-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div class="relative w-full max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-xl ring-1 ring-gray-900/5 sm:p-8 transform transition-all animate-scale-in">
        
        <!-- Close Button -->
        <button (click)="onCancel()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <!-- Icon -->
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
             [ngClass]="{
               'bg-emerald-50': variant === 'success',
               'bg-orange-50': variant === 'warning',
               'bg-red-50': variant === 'delete'
             }">
          
          <!-- Warning Icon -->
          <svg *ngIf="variant === 'warning'" class="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>

          <!-- Success/Confirm Icon -->
          <svg *ngIf="variant === 'success'" class="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!-- Delete/Trash Icon -->
          <svg *ngIf="variant === 'delete'" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </div>

        <!-- Title -->
        <h3 class="mb-2 text-xl font-bold text-gray-900 tracking-tight">
          {{ title }}
        </h3>

        <!-- Message -->
        <p class="mb-8 text-sm text-gray-500">
          {{ message }}
        </p>

        <!-- Buttons -->
        <div class="flex gap-3">
            <button (click)="onCancel()" type="button" class="flex-1 rounded-2xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 transition-all duration-200">
              Cancel
            </button>
            <button (click)="onConfirm()" type="button" 
                class="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                [ngClass]="{
                  'bg-emerald-500 hover:bg-emerald-400 focus-visible:outline-emerald-500': variant === 'success',
                  'bg-orange-400 hover:bg-orange-500 focus-visible:outline-orange-500': variant === 'warning',
                  'bg-red-500 hover:bg-red-600 focus-visible:outline-red-500': variant === 'delete'
                }">
              {{ variant === 'delete' ? 'Delete' : 'Confirm' }}
            </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fade-in 0.2s ease-out;
    }
    @keyframes scale-in {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-scale-in {
      animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class WarningModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Warning';
  @Input() message = 'Are you sure about this action?';
  @Input() variant: 'warning' | 'success' | 'delete' = 'warning';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
