// idle-refresh.service.ts
import { Injectable, inject, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';

import { getTokenExpiry } from './token.utils';
import { RefreshPrompt } from '../popups/refresh-prompt/refresh-prompt';

@Injectable({ providedIn: 'root' })
export class IdleRefreshService {
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private zone = inject(NgZone);

  private idleTimeout: any;
  private checkInterval: any;

  // configure how long before expiry the dialog should open (ms)
  private promptWhenRemainingMs = 2 * 60 * 1000; // 2 minutes before expiry

  constructor() {
    this.initIdleListener();
    this.startTokenWatcher();
  }

  private initIdleListener() {
    const resetTimer = () => {
      if (this.idleTimeout) clearTimeout(this.idleTimeout);
      // logout if idle more than 10 min
      this.idleTimeout = setTimeout(() => this.authService.logout(), 10 * 60 * 1000);
    };

    ['mousemove', 'keydown', 'click'].forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();
  }

  private startTokenWatcher() {
    this.zone.runOutsideAngular(() => {
      this.checkInterval = setInterval(() => {
        const token = this.authService.accessToken;
        if (!token) return;

        const expiry = getTokenExpiry(token);
        if (!expiry) return;

        const now = new Date();
        const diff = expiry.getTime() - now.getTime();

        // 🟢 only prompt if expiry is close AND not expired
        if (diff < this.promptWhenRemainingMs && diff > 0) {
          this.zone.run(() => this.openRefreshDialog());
        }
      }, 30 * 1000); // check every 30s
    });
  }

  private openRefreshDialog() {
    // don’t open if already open
    if (this.dialog.openDialogs.length > 0) return;

    const ref = this.dialog.open(RefreshPrompt, { disableClose: true });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.authService.refreshTokenRequest().subscribe({
          next: () => console.log('Token refreshed'),
          error: () => this.authService.logout()
        });
      } else {
        this.authService.logout();
      }
    });
  }
}
