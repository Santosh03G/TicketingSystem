import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Ticket } from '../../core/models/ticket.model';
import { Comment } from '../../core/models/comment.model';

@Component({
    selector: 'app-ticket-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="space-y-8 animate-fade-in" *ngIf="ticket">
      <!-- Header -->
      <div class="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
           <div class="flex items-center space-x-3 mb-2">
             <h1 class="text-2xl font-bold text-gray-900 tracking-tight">#{{ ticket.id }} - {{ ticket.title }}</h1>
             <span class="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm"
                   [ngClass]="{
                     'bg-blue-100 text-blue-800': ticket.status === 'OPEN',
                     'bg-yellow-100 text-yellow-800': ticket.status === 'IN_PROGRESS',
                     'bg-green-100 text-green-800': ticket.status === 'RESOLVED',
                     'bg-red-100 text-red-800': ticket.status === 'DENIED'
                   }">
               {{ ticket.status }}
             </span>
           </div>
           <p class="text-sm text-gray-500 flex items-center">
             <span class="mr-2">Created by <span class="font-medium text-gray-900">{{ ticket.createdBy.name }}</span></span>
             <span class="text-gray-300 mx-2">|</span>
             <span>{{ ticket.createdAt | date:'medium' }}</span>
           </p>
        </div>
        <a routerLink="/tickets" class="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-primary transition-all shadow-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Tickets
        </a>
      </div>

      <!-- Details Card -->
      <div class="glass-card p-6 rounded-2xl shadow-sm border border-gray-100/50">
          <div class="prose max-w-none text-gray-600">
               <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
               <p class="whitespace-pre-wrap leading-relaxed">{{ ticket.description }}</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 mt-6 pt-6 bg-gray-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div class="ml-4">
                      <dt class="text-sm font-medium text-gray-500">Priority</dt>
                      <dd class="mt-1 text-sm font-semibold text-gray-900">{{ ticket.priority }}</dd>
                  </div>
              </div>
              <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                  <div class="ml-4">
                      <dt class="text-sm font-medium text-gray-500">Assigned To</dt>
                      <dd class="mt-1 text-sm font-semibold text-gray-900">{{ ticket.assignedTo?.name || 'Unassigned' }}</dd>
                  </div>
              </div>
          </div>
      </div>

      <!-- Comments Section -->
      <div class="space-y-6 pt-4">
          <h3 class="text-xl font-bold text-gray-900 flex items-center">
              <svg class="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              Discussion
          </h3>
          
          <!-- Add Comment -->
          <div class="glass-card p-6 rounded-2xl shadow-sm border border-gray-100/50">
             <form (ngSubmit)="addComment()">
                 <label for="comment" class="sr-only">Add a comment</label>
                 <div class="relative">
                     <textarea id="comment" name="comment" rows="3" [(ngModel)]="newCommentContent" placeholder="Type your comment here..." 
                               class="block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-4 border bg-gray-50 focus:bg-white transition-colors" required></textarea>
                     <div class="absolute bottom-3 right-3">
                         <button type="submit" [disabled]="!newCommentContent.trim() || isSubmitting" 
                                 class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary to-rose-700 hover:from-rose-700 hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                             {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
                         </button>
                     </div>
                 </div>
             </form>
          </div>

          <!-- Comment List -->
          <div class="space-y-4">
              <div *ngFor="let comment of comments" class="bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-gray-100/60 transition-all hover:shadow-md">
                  <div class="flex space-x-4">
                      <div class="flex-shrink-0">
                           <img class="h-10 w-10 rounded-full bg-gray-200" [src]="'https://ui-avatars.com/api/?name=' + comment.author.name + '&background=random'" alt="">
                      </div>
                      <div class="flex-1 space-y-1">
                          <div class="flex items-center justify-between">
                              <h3 class="text-sm font-bold text-gray-900">{{ comment.author.name }}</h3>
                              <p class="text-xs text-gray-500">{{ comment.createdAt | date:'medium' }}</p>
                          </div>
                          <div class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100/50 block">
                              {{ comment.content }}
                          </div>
                      </div>
                  </div>
              </div>
              <p *ngIf="comments.length === 0" class="text-center text-gray-500 py-8 bg-white/30 rounded-xl border border-dashed border-gray-300">No comments yet. Be the first to start the discussion!</p>
          </div>
      </div>

    </div>
  `
})
export class TicketDetailComponent implements OnInit {
    ticket?: Ticket;
    comments: Comment[] = [];
    newCommentContent = '';
    isSubmitting = false;

    private route = inject(ActivatedRoute);
    private apiService = inject(ApiService);
    private authService = inject(AuthService);

    ngOnInit() {
        const ticketId = Number(this.route.snapshot.paramMap.get('id'));
        if (ticketId) {
            this.loadTicket(ticketId);
            this.loadComments(ticketId);
        }
    }

    loadTicket(id: number) {
        this.apiService.getTicket(id).subscribe(ticket => this.ticket = ticket);
    }

    loadComments(id: number) {
        this.apiService.getComments(id).subscribe(comments => this.comments = comments);
    }

    addComment() {
        if (!this.newCommentContent.trim() || !this.ticket) return;

        this.isSubmitting = true;
        const currentUser = this.authService.currentUser();

        if (!currentUser) {
            alert('You must be logged in to comment');
            this.isSubmitting = false;
            return;
        }

        const commentPayload = {
            content: this.newCommentContent,
            userId: currentUser.id
        };

        this.apiService.addComment(this.ticket.id, commentPayload).subscribe({
            next: (newComment) => {
                this.comments.unshift(newComment);
                this.newCommentContent = '';
                this.isSubmitting = false;
            },
            error: (err) => {
                console.error('Error posting comment:', err);
                alert('Failed to post comment');
                this.isSubmitting = false;
            }
        });
    }
}
