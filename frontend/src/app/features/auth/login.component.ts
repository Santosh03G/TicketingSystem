import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.login(this.credentials).subscribe({
      next: (response: any) => {
        console.log('Login response', response);

        if (response.mustChangePassword) {
          this.router.navigate(['/change-password'], {
            state: { email: response.email }
          });
          return;
        }

        const user = response;
        this.authService.login(user);

        // Redirect based on role
        if (user.role === 'USER') {
          this.router.navigate(['/tickets/new']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Invalid email or password';
      }
    });
  }
}
