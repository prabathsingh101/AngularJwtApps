// Yes 💯 — that’s a great UX improvement.
// We’ll make the Material Dialog auto-close after 30s if the user doesn’t respond.

// Behavior will be:

// When the dialog opens → show countdown (30 → 0).

// If user clicks Yes → refresh immediately.

// If user clicks No → logout immediately.

// If user does nothing → after 30s, dialog auto-closes with default action (logout).

import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../Auth/auth.service';

@Component({
  selector: 'app-refresh-prompt',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './refresh-prompt.html',
  styleUrl: './refresh-prompt.scss',
})
export class RefreshPrompt implements OnInit, OnDestroy {
  logout = inject(AuthService);
  countdown = 30;
  private intervalId: any;

  private dialogRef = inject(MatDialogRef<RefreshPrompt>);

  onYes() {
    this.dialogRef.close(true);
  }

  onNo() {
    this.dialogRef.close(false);
  }
  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.dialogRef.close(false); // auto logout
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
