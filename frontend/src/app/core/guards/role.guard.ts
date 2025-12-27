import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const roleGuard: (allowedRoles: Role[]) => CanActivateFn = (allowedRoles) => {
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (!authService.isAuthenticated()) {
            return router.createUrlTree(['/login']);
        }

        if (authService.hasRole(allowedRoles)) {
            return true;
        }

        // Role not authorized, redirect to home or unauthorized page
        // For 'USER' role trying to access admin pages, maybe send them to tickets
        return router.createUrlTree(['/tickets']);
    };
};
