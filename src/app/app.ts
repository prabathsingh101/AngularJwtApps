import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarPage } from './toolbar-page/toolbar-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarPage],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'AngularJwtApps';
}
