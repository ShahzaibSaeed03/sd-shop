import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
    { path: 'products', loadComponent: () => import('./pages/product-listing-page/product-listing-page').then(m => m.ProductListingPage) },
    { path: 'product-all', loadComponent: () => import('./pages/product-listing-page/product-listing-page').then(m => m.ProductListingPage) },
    { path: 'product-details', loadComponent: () => import('./pages/product-review/product-review').then(m => m.ProductReview) },
    { path: 'checkout', loadComponent: () => import('./shared/components/checkout/checkout').then(m => m.Checkout) },
    { path: 'terms-of-use', loadComponent: () => import('./pages/terms-of-use/terms-of-use').then(m => m.TermsOfUse) },
    { path: 'privacy-policy', loadComponent: () => import('./pages/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy) },
    { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) },
    {path:'orders', loadComponent: () => import('./pages/order-record/order-record').then(m => m.OrderRecord) },
];

