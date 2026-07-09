# BookMe

A modern booking management SPA built with Angular 21. Connects customers with service providers — allowing discovery, booking, and management of professional services in real-time.

## Tech Stack

| Layer        | Technology                                                              |
|-------------|-------------------------------------------------------------------------|
| Frontend    | Angular 21, standalone components, signals, computed, control flow syntax |
| Styling     | Tailwind CSS 4 (CSS-first config via `@import "tailwindcss"`)           |
| Backend API | ASP.NET Core REST API (hosted at `aboodhassan-001-site1.jtempurl.com`)  |
| Auth        | JWT Bearer tokens, role-based guards                                    |
| Build       | Angular CLI + Vite                                                      |

## Architecture

The app is organized into feature-based modules, all as **standalone components** (no NgModules):

```
src/app/
├── admin/          # Admin dashboard: users, services, categories, cities, plans, subscriptions, payments
├── auth/           # Login, Register, Profile
├── categories/     # Public category listing + services per category
├── contact/        # Contact Us page
├── core/           # Auth service, API service, models, guards
├── customer/       # Browse services, service detail, create booking, my bookings
├── home/           # Landing page
├── provider/       # Dashboard, manage services, service form, incoming bookings, subscription, payment
├── shared/         # Toast component, pagination component
├── about/          # About Us page
└── app.ts          # App shell — navbar, theme toggle, notifications, footer
```

### Component Architecture

Every component is **standalone** (no NgModule wrappers). State management uses Angular **signals** (`signal`, `computed`) with RxJS for async operations (HTTP requests, polling).

### Routing

All routes are **lazy-loaded** via `loadComponent`. Route hierarchy:

| Route                       | Component              | Guards          |
|----------------------------|------------------------|-----------------|
| `/Home`                    | `Home`                 | —               |
| `/Categories`              | `Categories`           | —               |
| `/Categories/:id`          | `CategoryServices`     | —               |
| `/service/:id`             | `ServiceDetail`        | —               |
| `/about`                   | `About`                | —               |
| `/contact`                 | `Contact`              | —               |
| `/auth/login`              | `Login`                | —               |
| `/auth/register`           | `Register`             | —               |
| `/profile`                 | `Profile`              | `authGuard`     |
| `/subscription`            | `ProviderSubscription` | `authGuard`     |
| `/subscription/payment/:planId` | `Payment`         | `authGuard`     |
| `/booking/:serviceId`      | `CreateBooking`        | `authGuard`     |
| `/customer/services`       | `ServicesList`         | `authGuard`     |
| `/customer/my-bookings`    | `MyBookings`           | `authGuard`     |
| `/dashboard/*`             | `ProviderLayout`       | `authGuard` + `roleGuard('ServiceProvider')` |
| `/admin/*`                 | `AdminLayout`          | `authGuard` + `roleGuard('Admin')` |

## Roles & Permissions

Three roles, stored in the database as:

| DB Value          | Display Name  | Capabilities                                     |
|-------------------|---------------|--------------------------------------------------|
| `Admin`           | Admin         | Full platform control via admin panel             |
| `ServiceProvider` | Provider      | Manage services, accept/reject bookings, dashboard |
| `User`            | Customer      | Browse services, book appointments, my bookings   |

### Auth Flow

1. Login via `/auth/login` → JWT token stored in `localStorage`
2. Token decoded client-side to extract role
3. Route guards (`authGuard`, `roleGuard`) enforce access
4. On subscription upgrade (User → ServiceProvider), user is logged out to receive a new JWT

## Key Features

### Customer
- Browse categories and services with search, city filter, price sort
- Service detail view with pricing, duration, provider info
- Calendar-based booking with available slot selection
- My Bookings — monthly calendar with daily schedule view
- 30-second polling for booking status changes (with toast + notification)
- Subscription upgrade to become a provider

### Provider
- Dashboard with subscription validity check
- Service CRUD (create, edit, delete with image upload)
- Incoming bookings with calendar + accept/reject
- 30-second polling for new bookings
- Subscription management with plan upgrade

### Admin
- Clean sidebar layout with role-aware navigation
- User management with Customer/Provider/All filter tabs + search + delete
- Service management (view, delete)
- Category CRUD with image upload
- City CRUD
- Subscription plans CRUD
- Subscriptions overview with pagination
- Payments overview with search
- Dashboard with user/service/subscription/revenue stats

### Shared
- Dark/Light theme toggle (persisted in localStorage)
- Notification center with localStorage-persisted notifications
- Toast notifications (success, error, info, warning)
- Responsive design (mobile sidebar, adaptive navbar, footer role links)

## UI / Design System

- **Primary accent**: `purple-600` / `vibe-600` for CTAs
- **Cards**: `rounded-2xl`, `shadow-sm`, `border border-slate-100`
- **Forms**: `rounded-xl` inputs with `focus:border-vibe-400 focus:ring-2`
- **Tables**: `bg-slate-50` headers, `divide-y divide-slate-50`, `hover:bg-slate-50/50` rows
- **Dark theme**: Applied via `.theme-dark` class on `<html>`, mapping slate colors to dark CSS variables
- **Animations**: `fade-in-up`, `slide-up`, `scale-in`, stagger delays
- **Validation**: Red error borders (`input-error` class), error messages with SVG icons, shown on blur/submit

## Setup

```bash
# Install dependencies
npm install

# Start dev server
ng serve

# Build for production
ng build
```

The app runs at `http://localhost:4200` and proxies API calls to the backend.

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/Account/register` | Register new user |
| POST | `/Account/login` | Login |
| PUT | `/User/Profile` | Update profile |
| GET | `/User/Profile` | Get profile |
| GET | `/User/GetAllActiveUser` | Admin: all users |
| GET | `/User/GetAllActiveUserWithPagination` | Admin: paginated users |
| GET | `/User/ServiceProviders` | Admin: filter providers |
| GET | `/User/Customers` | Admin: filter customers |
| DELETE | `/User/{id}` | Admin: deactivate user |
| GET | `/Categories` | List all categories |
| POST/PUT/DELETE | `/Categories/{id}` | Admin CRUD |
| GET | `/Service/GetByCategory/{id}` | Services by category |
| GET/POST/PUT/DELETE | `/Service/{id}` | Service CRUD |
| POST | `/Booking/Create` | Create booking |
| PUT | `/Booking/Accept/{id}` | Accept booking |
| PUT | `/Booking/Reject/{id}` | Reject booking |
| PUT | `/Booking/Cancel/{id}` | Cancel booking |
| GET | `/Booking/CustomerHistory` | Customer bookings |
| GET | `/Booking/ProviderIncoming` | Provider incoming |
| GET/POST/PUT/DELETE | `/Subscription/Plans` | Plan CRUD |
| POST | `/Subscription/CreateOrUpgrade` | Subscribe/upgrade |
| GET | `/Subscription/CheckValidity` | Check subscription |
| GET | `/Subscription/GetAllSubscriptions` | Admin: all subscriptions |
| GET | `/Subscription/GetSubscriptionsWithPagination` | Admin: paginated subscriptions |
| GET | `/Payment/GetAllPayments` | Admin: all payments |
