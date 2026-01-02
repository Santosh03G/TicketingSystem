import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-error-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div class="relative w-full max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-xl ring-1 ring-gray-900/5 sm:p-8 transform transition-all animate-scale-in">
        
        <!-- Icon -->
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
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

        <!-- Button -->
        <button (click)="onClose()" type="button" class="w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
          OK
        </button>

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
export class ErrorModalComponent {
    @Input() isOpen = false;
    @Input() title = 'Error';
    @Input() message = 'Something went wrong. Please try again.';
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }
}
