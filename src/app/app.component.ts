import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AngularQueryDevtools],
  template: `
    <header>
      <a routerLink="/">Home</a> | <a routerLink="/posts">Posts</a>
    </header>
    <router-outlet></router-outlet>
    <angular-query-devtools initialIsOpen />
  `,
})
export class AppComponent {}
