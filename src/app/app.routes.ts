import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'merchant-form',
    loadComponent: () => import('./pages/merchant-form.component').then(m => m.MerchantFormComponent),
  },
  {
    path: 'receipt',
    loadComponent: () => import('./pages/receipt.component').then(m => m.ReceiptComponent),
  }

];
