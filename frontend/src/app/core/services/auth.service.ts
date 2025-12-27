import { Injectable, signal } from '@angular/core';
import { User, Role } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSignal = signal<User | null>(null);

    readonly currentUser = this.currentUserSignal.asReadonly();

    constructor() {
        // Restore from local storage if available
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUserSignal.set(JSON.parse(storedUser));
        }
    }

    login(user: User) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSignal.set(user);
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSignal.set(null);
    }

    isAuthenticated(): boolean {
        return this.currentUserSignal() !== null;
    }

    hasRole(allowedRoles: Role[]): boolean {
        const user = this.currentUserSignal();
        return user ? allowedRoles.includes(user.role) : false;
    }

    isAdmin(): boolean {
        return this.hasRole([Role.ADMIN]);
    }
}
