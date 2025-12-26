import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'internships',
        loadComponent: () => import('./pages/internships/internships.page').then(m => m.InternshipsPage)
      },
      {
        path: 'add',
        loadComponent: () => import('./pages/internship-form/internship-form.page').then(m => m.InternshipFormPage)
      },
      {
        path: 'internship-details/:id',
        loadComponent: () => import('./pages/internship-details/internship-details.page').then(m => m.InternshipDetailsPage)
      },
      {
        path: 'internship-form/:id',
        loadComponent: () => import('./pages/internship-form/internship-form.page').then(m => m.InternshipFormPage)
      }
    ]
  }
];