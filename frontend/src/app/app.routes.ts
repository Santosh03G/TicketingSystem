import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TicketListComponent } from './features/tickets/ticket-list.component';
import { TicketCreateComponent } from './features/tickets/ticket-create.component';
import { UserListComponent } from './features/users/user-list.component';
import { UserCreateComponent } from './features/users/user-create.component';
import { SettingsComponent } from './features/settings/settings.component';
import { LoginComponent } from './features/auth/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/user.model';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [roleGuard([Role.ADMIN, Role.STAFF])]
            },
            { path: 'tickets', component: TicketListComponent },
            { path: 'tickets/new', loadComponent: () => import('./features/tickets/ticket-create.component').then(m => m.TicketCreateComponent) },
            { path: 'tickets/:id', loadComponent: () => import('./features/tickets/ticket-detail.component').then(m => m.TicketDetailComponent) },
            {
                path: 'users',
                component: UserListComponent,
                canActivate: [roleGuard([Role.ADMIN])]
            },
            {
                path: 'users/new',
                loadComponent: () => import('./features/users/user-create.component').then(m => m.UserCreateComponent),
                canActivate: [roleGuard([Role.ADMIN])]
            },
            { path: 'settings', component: SettingsComponent }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'verify-otp',
        loadComponent: () => import('./features/auth/verify-otp.component').then(m => m.VerifyOtpComponent)
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password.component').then(m => m.ResetPasswordComponent)
    },
    {
        path: 'change-password',
        loadComponent: () => import('./features/auth/change-password.component').then(m => m.ChangePasswordComponent)
    }
];
