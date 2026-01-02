import { Component, EventEmitter, Input, Output, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block text-left w-full" [class.z-50]="isOpen">
      <!-- Trigger Button -->
      <!-- Reduced padding for smaller size, increased shadow for immersion -->
      <button type="button" (click)="toggle()" 
              class="inline-flex justify-between items-center w-full rounded-xl border border-gray-200 shadow-sm px-4 py-2.5 bg-white/70 backdrop-blur-md text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-all duration-300 ease-out"
              [class.ring-2]="isOpen" [class.ring-primary]="isOpen" [class.border-primary]="isOpen" [class.bg-white]="isOpen">
        <span class="truncate block mr-2" [class.text-gray-500]="!selectedValue">{{ getSelectedLabel() }}</span>
        <svg class="h-4 w-4 text-gray-400 transition-transform duration-300 ease-spring" [class.rotate-180]="isOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div *ngIf="isOpen" 
           class="origin-top-right absolute right-0 mt-2 w-full min-w-[200px] rounded-xl shadow-2xl bg-white/95 backdrop-blur-2xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down z-[100] max-h-60 overflow-y-auto custom-scrollbar border border-white/50 transform scale-100 opacity-100 transition-all duration-200">
        <div class="py-1" role="menu" aria-orientation="vertical">
          <button *ngFor="let option of options" (click)="select(option)"
                  class="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-primary transition-colors cursor-pointer relative duration-150"
                  [class.bg-rose-50]="option.value === selectedValue" [class.text-primary]="option.value === selectedValue" [class.font-medium]="option.value === selectedValue">
            
             <!-- Checkmark for selected item -->
            <span *ngIf="option.value === selectedValue" class="absolute left-0 inset-y-0 flex items-center pl-3 text-primary animate-scale-in">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            </span>

            <span class="block truncate pl-6" [class.font-semibold]="option.value === selectedValue">
              {{ option.label }}
            </span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(156, 163, 175, 0.5);
      border-radius: 20px;
    }
  `]
})
export class CustomSelectComponent {
  @Input() options: SelectOption[] = [];
  @Input() selectedValue: any;
  @Input() placeholder = 'Select...';
  @Output() selectionChange = new EventEmitter<any>();
  @Output() opened = new EventEmitter<void>();

  isOpen = false;

  constructor(private elementRef: ElementRef) { }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.opened.emit();
    }
  }

  close() {
    this.isOpen = false;
  }

  select(option: SelectOption) {
    this.selectedValue = option.value;
    this.selectionChange.emit(option.value);
    this.isOpen = false;
  }

  getSelectedLabel(): string {
    const selected = this.options.find(o => o.value === this.selectedValue);
    return selected ? selected.label : this.placeholder;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
