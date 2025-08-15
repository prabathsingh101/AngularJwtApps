import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../Auth/auth.service';

@Component({
  selector: 'app-refresh-prompt',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './refresh-prompt.html',
  styleUrl: './refresh-prompt.scss',
})
export class RefreshPrompt {
  logout = inject(AuthService);

  onNo() {
    this.logout.logout();
  }
}
