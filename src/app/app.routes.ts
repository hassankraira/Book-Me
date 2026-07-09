import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Categories } from './categories/categories';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: Home, title: 'Home page' },
  { path: 'Categories', component: Categories, title: 'Categories' },
  { path: 'Categories/:id', loadComponent: () => import('./categories/category-services').then((c) => c.CategoryServices), title: 'Category Services' },
  { path: 'service/:id', loadComponent: () => import('./customer/service-detail').then((c) => c.ServiceDetail), title: 'Service Detail' },
  { path: 'booking/:serviceId', loadComponent: () => import('./customer/create-booking').then((c) => c.CreateBooking), canActivate: [authGuard], title: 'Book Service' },
  { path: 'about', loadComponent: () => import('./about/about').then((c) => c.About), title: 'About Us' },
  { path: 'contact', loadComponent: () => import('./contact/contact').then((c) => c.Contact), title: 'Contact Us' },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./auth/login').then((c) => c.Login), title: 'Sign In' },
      { path: 'register', loadComponent: () => import('./auth/register').then((c) => c.Register), title: 'Create Account' },
    ],
  },
  {
    path: 'profile',
    loadComponent: () => import('./auth/profile').then((c) => c.Profile),
    canActivate: [authGuard],
    title: 'My Profile',
  },
  {
    path: 'subscription',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./provider/subscription').then((c) => c.ProviderSubscription), title: 'Subscription' },
      { path: 'payment/:planId', loadComponent: () => import('./provider/payment').then((c) => c.Payment), title: 'Payment' },
    ],
  },
  {
    path: 'customer',
    canActivate: [authGuard],
    children: [
      { path: 'services', loadComponent: () => import('./customer/services-list').then((c) => c.ServicesList), title: 'Browse Services' },
      { path: 'services/:id', loadComponent: () => import('./customer/service-detail').then((c) => c.ServiceDetail), title: 'Service Detail' },
      { path: 'my-bookings', loadComponent: () => import('./customer/my-bookings').then((c) => c.MyBookings), title: 'My Bookings' },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, roleGuard('ServiceProvider')],
    loadComponent: () => import('./provider/provider-layout').then((c) => c.ProviderLayout),
    children: [
      { path: '', loadComponent: () => import('./provider/dashboard').then((c) => c.ProviderDashboard), title: 'Dashboard' },
      { path: 'Add_service', loadComponent: () => import('./provider/service-form').then((c) => c.ServiceForm), title: 'New Service' },
      { path: 'services', loadComponent: () => import('./provider/manage-services').then((c) => c.ManageServices), title: 'My Services' },
      { path: 'services/new', loadComponent: () => import('./provider/service-form').then((c) => c.ServiceForm), title: 'New Service' },
      { path: 'services/:id/edit', loadComponent: () => import('./provider/service-form').then((c) => c.ServiceForm), title: 'Edit Service' },
      { path: 'bookings', loadComponent: () => import('./provider/incoming-bookings').then((c) => c.IncomingBookings), title: 'Incoming Bookings' },
      { path: 'subscription', loadComponent: () => import('./provider/subscription').then((c) => c.ProviderSubscription), title: 'Subscription' },
      { path: 'profile', loadComponent: () => import('./auth/profile').then((c) => c.Profile), title: 'My Profile' },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('Admin')],
    loadComponent: () => import('./admin/admin-layout').then((c) => c.AdminLayout),
    children: [
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard').then((c) => c.AdminDashboard), title: 'Admin Dashboard' },
      { path: 'users', loadComponent: () => import('./admin/users').then((c) => c.AdminUsers), title: 'Manage Users' },
      { path: 'services', loadComponent: () => import('./admin/services').then((c) => c.AdminServices), title: 'Manage Services' },
      { path: 'categories', loadComponent: () => import('./admin/categories').then((c) => c.AdminCategories), title: 'Manage Categories' },
      { path: 'cities', loadComponent: () => import('./admin/cities').then((c) => c.AdminCities), title: 'Manage Cities' },
      { path: 'plans', loadComponent: () => import('./admin/subscription-plans').then((c) => c.AdminSubscriptionPlans), title: 'Subscription Plans' },
      { path: 'subscriptions', loadComponent: () => import('./admin/subscriptions').then((c) => c.AdminSubscriptions), title: 'Subscriptions' },
      { path: 'payments', loadComponent: () => import('./admin/payments').then((c) => c.AdminPayments), title: 'Payments' },
    ],
  },
  { path: '**', redirectTo: 'Home' },
];
