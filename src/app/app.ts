import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarPage } from './toolbar-page/toolbar-page';
import { IdleRefreshService } from './Auth/idle-refresh.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'AngularJwtApps';
  private idleRefresh = inject(IdleRefreshService);
  ngOnInit(): void {
    console.log(this.idleRefresh);
  }
}
