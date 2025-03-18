// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'analyze', pathMatch: 'full' },
  {
    path: 'analyze',
    loadComponent: () => import('./analyze/analyze.component').then(m => m.AnalyzeComponent)
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./how-it-works/how-it-works.component').then(m => m.HowItWorksComponent)
  },
  { path: '**', redirectTo: 'analyze' }
];
