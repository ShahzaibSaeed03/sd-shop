import { Routes } from '@angular/router';

export const routes: Routes = [

    {path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home)},
    {path: 'products', loadComponent: () => import('./pages/product-listing-page/product-listing-page').then(m => m.ProductListingPage)},
    {path:'product-details', loadComponent: () => import('./pages/product-review/product-review').then(m => m.ProductReview)},
    {path: 'checkout', loadComponent: () => import('./shared/components/checkout/checkout').then(m => m.Checkout)},
];
