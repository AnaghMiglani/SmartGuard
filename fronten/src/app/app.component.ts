// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <nav class="sidebar">
        <div class="logo-container">
          <img src="assets/logo.svg" alt="Smart Guard Logo" class="logo">
          <h1 class="logo-text">Smart Guard</h1>
        </div>
        <ul class="nav-links">
          <li>
            <a routerLink="/analyze" routerLinkActive="active">Analyze</a>
          </li>
          <li>
            <a routerLink="/how-it-works" routerLinkActive="active">How It Works</a>
          </li>
        </ul>
      </nav>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      background-color: #121212;
      color: #e0e0e0;
    }

    .sidebar {
      width: 240px;
      background-color: #1e1e1e;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #333;
    }

    .logo-container {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      padding: 0.5rem;
    }

    .logo {
      width: 32px;
      height: 32px;
      margin-right: 0.75rem;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: bold;
      color: #ffffff;
      margin: 0;
    }

    .nav-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-links li {
      margin-bottom: 0.5rem;
    }

    .nav-links a {
      display: block;
      padding: 0.75rem 1rem;
      color: #b0b0b0;
      text-decoration: none;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .nav-links a:hover {
      background-color: #333;
      color: #ffffff;
    }

    .nav-links a.active {
      background-color: #2c2c2c;
      color: #ffffff;
      border-left: 3px solid #007acc;
    }

    .content {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }
  `]
})
export class AppComponent {
  title = 'smart-guard';
}
