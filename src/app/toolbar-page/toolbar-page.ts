import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../Auth/auth.service';
import { CreateUserPage } from '../create-user-page/create-user-page';

@Component({
  selector: 'app-toolbar-page',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './toolbar-page.html',
  styleUrl: './toolbar-page.scss',
})
export class ToolbarPage {
  constructor(private router: Router, private authSvc: AuthService) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout() {
    this.authSvc.logout();
  }
}
