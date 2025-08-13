import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-toolbar-page',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './toolbar-page.html',
  styleUrl: './toolbar-page.scss',
})
export class ToolbarPage {
  constructor(private router: Router, private authSvc: AuthService) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout() {
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('refreshToken');
    // this.router.navigate(['/login']);
    this.authSvc.logout();  
  }
}
