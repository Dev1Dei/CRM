import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SnackbarService } from '../../services/snackbar/snackbar-service';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-authentication-form',
  standalone: true,
  templateUrl: './authentication-form.html',
  styleUrls: ['./authentication-form.css'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressBarModule,
  ],
})
export class AuthenticationForm {
  private fb = inject(FormBuilder);
  private snackBar = inject(SnackbarService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode = true;
  loading = false;
  showForm = true;
  statusMessage: string | null = null;
  statusType: 'success' | 'error' | 'info' | null = null;

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.statusMessage = null;
    this.showForm = false;

    setTimeout(() => {
      this.authForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });

      this.showForm = true;
    }, 10);
  }

  isFieldInvalid(name: string): boolean {
    const control = this.authForm.get(name);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.authForm.value;

    try {
      if (this.isLoginMode) {
        await firstValueFrom(this.authService.login(email!, password!));
        this.statusMessage = 'Sėkmingai prisijungta';
        this.snackBar.success(this.statusMessage);
        await this.router.navigate(['/dashboard']);
      } else {
        await firstValueFrom(this.authService.register(email!, password!));
        this.statusMessage = 'Paskyra sėkmingai sukurta';
        this.statusType = 'success';
        this.snackBar.success(this.statusMessage);
        this.toggleMode();
        this.authForm.reset();
      }
      this.statusType = 'success';
      this.authForm.reset();
    } catch (err: any) {
      console.error(err);
      this.statusMessage = 'Klaida: ' + (err?.message || 'Nepavyko prisijungti');
      this.statusType = 'error';
      this.snackBar.error(this.statusMessage);
    } finally {
      this.loading = false;
    }
  }
}
