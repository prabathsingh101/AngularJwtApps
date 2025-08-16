import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private snackBar = inject(MatSnackBar);

  constructor() {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
    // check if we came from registration
    const tempUser = sessionStorage.getItem('tempUser');
    if (tempUser) {
      const { username, password } = JSON.parse(tempUser);
      this.loginForm.patchValue({ username, password });

      // clear after use
      sessionStorage.removeItem('tempUser');
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe({
          next: (res: any) => {
            this.router.navigate(['/dashboard']);
            this.snackBar.open('Loggedin', 'Close', {
              duration: 3000, // 3 seconds
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
          error: (error: any) => {
            console.error(error.message, error);
            let msg = 'Something went wrong';
            if (error.status === 401) {
              msg = error.error?.message;
              this.snackBar.open(`❌ ${msg}`, 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error'],
                horizontalPosition: 'right',
                verticalPosition: 'top',
              });
            }
          },
        });
    }
  }
}
