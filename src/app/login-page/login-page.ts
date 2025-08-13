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

  constructor() {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     // Simulate a successful login
  //     localStorage.setItem('token', 'dummy-token');
  //     this.router.navigate(['/dashboard']);
  //   }
  // }
  login() {
    if (this.loginForm.valid) {
      // Normally call API here
      //localStorage.setItem('token', 'dummy-jwt-token');
      //this.router.navigate(['/dashboard']);
      this.authService
        .login(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe({
          next: (res: any) => {
            //localStorage.setItem('accessToken', res.accessToken);
            //console.log('Login successful, token:', res.accessToken);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => console.error(err),
        });
    }
  }
}
