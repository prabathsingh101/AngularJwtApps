import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login-page';
import { DashboardPage } from './dashboard-page/dashboard-page';
import { authGuard } from './Auth/auth.gaurd';
import { CreateUserPage } from './create-user-page/create-user-page';
import { ChatPages } from './chat-pages/chat-pages';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
  { path: 'chat', component: ChatPages, canActivate: [authGuard] },
  { path: 'register', component: CreateUserPage },
  { path: '**', redirectTo: 'login' },
];
