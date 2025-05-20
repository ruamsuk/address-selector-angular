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
    path: 'new-receipt',
    loadComponent: () => import('./pages/new-receipt.component').then(m => m.NewReceiptComponent),
  },
  {
    path: 'receipt-template',
    loadComponent: () => import('./pages/receipt-template.component').then(m => m.ReceiptTemplateComponent),
  }

];
