import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Ticket } from '../models/ticket.model';
import { Comment } from '../models/comment.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    // Dashboard
    getDashboardStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/dashboard/stats`);
    }

    // Tickets
    getTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`);
    }

    createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
        return this.http.post<Ticket>(`${this.apiUrl}/tickets`, ticket);
    }

    updateTicket(id: number, ticket: Partial<Ticket>): Observable<Ticket> {
        return this.http.put<Ticket>(`${this.apiUrl}/tickets/${id}`, ticket);
    }

    // Users
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/users`, user);
    }

    updateUser(id: number, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
    }

    login(credentials: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/auth/login`, credentials);
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
    }

    verifyOtp(email: string, otp: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/verify-otp`, { email, otp });
    }

    resetPassword(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/reset-password`, data);
    }

    // Search Tickets for Reports
    searchTickets(params: any): Observable<any[]> {
        let queryParams = new HttpParams();
        if (params.status) queryParams = queryParams.set('status', params.status);
        if (params.userId) queryParams = queryParams.set('userId', params.userId);
        if (params.start) queryParams = queryParams.set('start', params.start);
        if (params.end) queryParams = queryParams.set('end', params.end);

        return this.http.get<any[]>(`${this.apiUrl}/tickets/search`, { params: queryParams });
    }

    setupPassword(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/setup-password`, data);
    }

    // Settings
    getSettings(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/settings`);
    }

    saveSettings(settings: any[]): Observable<any[]> {
        return this.http.post<any[]>(`${this.apiUrl}/settings/batch`, settings);
    }

    // Ticket Details & Comments
    getTicket(id: number): Observable<Ticket> {
        return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`);
    }

    getComments(ticketId: number): Observable<any[]> { // Using any[] for now, or import Comment
        return this.http.get<any[]>(`${this.apiUrl}/tickets/${ticketId}/comments`);
    }

    addComment(ticketId: number, comment: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/tickets/${ticketId}/comments`, comment);
    }

    // Categories
    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/categories`);
    }

    createCategory(category: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/categories`, category);
    }

    deleteCategory(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/categories/${id}`);
    }
    uploadUsers(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/users/bulk-import`, formData, { responseType: 'text' });
    }
}
