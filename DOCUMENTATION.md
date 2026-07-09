# BookMe - Service Booking System Documentation

---

## 1. Project Overview

**BookMe** is a complete web application (SPA) for managing and booking professional services. It connects customers with service providers in one unified platform. The frontend is built with **Angular 21** and the backend is **ASP.NET Core**.

### The Idea
An application that lets customers browse available services by category and city, book appointments with service providers, while giving providers the ability to manage their services and incoming bookings, and giving the admin full control over the platform.

---

## 2. Team Members

| Name | Role |
|-------|-------|
| [Student Name] | Frontend Developer (Angular) |
| [Student Name] | Backend Developer (ASP.NET Core) |
| [Supervisor Name] | Project Supervisor |

---

## 3. Tech Stack

| Layer | Technology |
|--------|---------|
| **Frontend Framework** | Angular 21.1.0 (Standalone Components) |
| **Programming Language** | TypeScript ~5.9.2 |
| **State Management** | Angular Signals (`signal`, `computed`) + RxJS |
| **Routing** | Angular Router with Lazy Loading |
| **Styling** | Tailwind CSS 4.1.12 |
| **Build System** | Angular CLI + Vite (`@angular/build`) |
| **HTTP Client** | `@angular/common/http` with Functional Interceptors |
| **Forms** | `@angular/forms` (Template-driven with `ngModel`) |
| **Mobile** | Capacitor 8.4.1 (iOS + Android) |
| **Testing** | Vitest 4.x |
| **Backend** | ASP.NET Core REST API |
| **Authentication** | JWT Bearer Tokens |
| **Database** | SQL Server (via Entity Framework Core) |

---

## 4. Project Architecture

### 4.1 Folder Structure

```
bookme/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin Dashboard
│   │   │   ├── admin-layout.ts     # Main admin layout (sidebar)
│   │   │   ├── dashboard.ts        # Platform statistics
│   │   │   ├── users.ts            # User management
│   │   │   ├── services.ts         # Service management
│   │   │   ├── categories.ts       # Category management
│   │   │   ├── cities.ts           # City management
│   │   │   ├── subscription-plans.ts  # Subscription plans
│   │   │   ├── subscriptions.ts    # Subscriptions
│   │   │   └── payments.ts         # Payments
│   │   ├── auth/                # Authentication and profile
│   │   │   ├── login.ts            # Login page
│   │   │   ├── register.ts         # Registration page
│   │   │   └── profile.ts          # User profile
│   │   ├── categories/          # Public categories
│   │   │   ├── categories.ts       # Category listing
│   │   │   └── category-services.ts  # Services by category
│   │   ├── contact/             # Contact Us page
│   │   ├── customer/            # Customer interface
│   │   │   ├── services-list.ts     # Browse services
│   │   │   ├── service-detail.ts    # Service details
│   │   │   ├── create-booking.ts    # Create a booking
│   │   │   └── my-bookings.ts       # My bookings
│   │   ├── home/                # Landing page
│   │   ├── provider/            # Provider interface
│   │   │   ├── provider-layout.ts   # Main provider layout
│   │   │   ├── dashboard.ts         # Provider dashboard
│   │   │   ├── manage-services.ts   # Manage services
│   │   │   ├── service-form.ts      # Add/Edit service
│   │   │   ├── incoming-bookings.ts # Incoming bookings
│   │   │   ├── subscription.ts      # Subscription management
│   │   │   └── payment.ts           # Payment page
│   │   ├── about/               # About Us page
│   │   ├── shared/              # Shared components
│   │   │   ├── components/
│   │   │   │   ├── toast.component.ts     # Toast notifications
│   │   │   │   └── pagination.component.ts # Pagination
│   │   ├── core/                # Core services
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts         # Authentication service
│   │   │   │   ├── api.service.ts          # Central API service
│   │   │   │   ├── toast.service.ts        # Toast service
│   │   │   │   └── notification.service.ts  # Notification service
│   │   │   ├── models/index.ts            # Data models
│   │   │   ├── guards/auth.guard.ts       # Route guards
│   │   │   └── interceptors/auth.interceptor.ts # HTTP interceptor
│   │   ├── app.ts               # Root component
│   │   ├── app.routes.ts        # Route definitions
│   │   └── api.ts               # Legacy API service
│   ├── styles.css               # Global styles
│   ├── index.html               # Main HTML entry
│   └── main.ts                  # Entry point
├── angular.json                 # Angular configuration
├── package.json                 # Package management
├── capacitor.config.ts          # Capacitor configuration
├── proxy.conf.json              # Development proxy
├── tsconfig.json                # TypeScript configuration
├── android/                     # Android project
└── ios/                         # iOS project
```

### 4.2 Architecture Pattern

The project uses **Standalone Components Architecture** (no NgModules). State management is done with **Angular Signals** (`signal`, `computed`) together with RxJS for async operations.

```
┌─────────────────────────────────────────┐
│              App Shell                   │
│    (Navbar, Theme Toggle, Footer)       │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │     Router Outlet       │
    └────────────┬────────────┘
                 │
    ┌────────────┴─────────────────────────┐
    │         Lazy-loaded Pages            │
    │  (Public, Auth, Customer, Provider,  │
    │            Admin)                    │
    └────────────┬─────────────────────────┘
                 │
    ┌────────────┴─────────────────────────┐
    │         Core Services                │
    │  ┌───────────┐  ┌─────────────────┐  │
    │  │ Auth      │  │ ApiService      │  │
    │  │ Service   │  │ (HTTP Client)   │  │
    │  └───────────┘  └────────┬────────┘  │
    │  ┌───────────┐  ┌────────┴────────┐  │
    │  │ Toast     │  │ Notification   │  │
    │  │ Service   │  │ Service        │  │
    │  └───────────┘  └─────────────────┘  │
    └───────────────────────────────────────┘
```

---

## 5. Roles and Permissions

| Role | Database Value | Permissions |
|-------|--------|-----------|
| **Customer** | `User` | Browse services, book appointments, view my bookings |
| **Service Provider** | `ServiceProvider` | Manage services, accept/reject bookings, dashboard |
| **Admin** | `Admin` | Full platform control (users, services, categories, cities, subscriptions, payments) |

---

## 6. Authentication Flow

```
Login
     │
     ▼
POST /Account/login
     │
     ▼
Receive JWT Token
     │
     ▼
Store token in localStorage (bookme_token)
Store user in localStorage (bookme_user)
     │
     ▼
Fetch profile (GET /User/Profile)
     │
     ▼
Redirect based on role:
    Admin          → /admin/dashboard
    ServiceProvider → /dashboard
    User           → /profile
```

### Auth Interceptor

- Automatically adds `Authorization: Bearer <token>` to every HTTP request
- On 401 response: clears storage and redirects to login page

### Route Guards

- **`authGuard`**: Checks if JWT token exists in localStorage
- **`roleGuard(role)`**: Checks if the user's role matches the allowed roles

---

## 7. Routes

| Route | Component | Guard |
|--------|--------|--------|
| `/Home` | `Home` | — |
| `/Categories` | `Categories` | — |
| `/Categories/:id` | `CategoryServices` | — |
| `/service/:id` | `ServiceDetail` | — |
| `/about` | `About` | — |
| `/contact` | `Contact` | — |
| `/auth/login` | `Login` | — |
| `/auth/register` | `Register` | — |
| `/profile` | `Profile` | `authGuard` |
| `/subscription` | `ProviderSubscription` | `authGuard` |
| `/subscription/payment/:planId` | `Payment` | `authGuard` |
| `/booking/:serviceId` | `CreateBooking` | `authGuard` |
| `/customer/services` | `ServicesList` | `authGuard` |
| `/customer/my-bookings` | `MyBookings` | `authGuard` |
| `/dashboard/*` | `ProviderLayout` | `authGuard` + `roleGuard('ServiceProvider')` |
| `/admin/*` | `AdminLayout` | `authGuard` + `roleGuard('Admin')` |

---

## 8. System Modules in Detail

### 8.1 Public Pages

#### Home Page (`/Home`)
- Hero section with two CTAs: "Find Services" and "Become A Provider"
- Platform stats: 15K+ bookings, 500+ professionals, 4.9 rating
- Popular categories grid
- "How It Works" 3-step guide
- Testimonials from customers

#### Categories (`/Categories`)
- Shows all categories fetched from API
- Search by name and description
- Each category links to `/Categories/:id`

#### Category Services (`/Categories/:id`)
- Shows services within a selected category
- Filter by city (All, Near You, Far From You)
- Sort by name or price
- Pagination (9 services per page)

#### Service Detail (`/service/:id`)
- Service image, category/city badges, name, price, duration, description
- Provider information
- "Book This Service" button

#### About Us (`/about`)
- Mission, story, statistics
- 6 key features of the platform
- 4 team members
- Call-to-action buttons

#### Contact Us (`/contact`)
- Contact form (name, email, subject, message)
- Contact info cards (address, email, phone, hours)
- Social media links (Facebook, Twitter, GitHub, LinkedIn)
- Google Maps iframe
- FAQ accordion (5 questions)

### 8.2 Authentication and Profile

#### Login (`/auth/login`)
- Email/password form with validation
- Error display and loading spinner
- Role-based redirect after login
- Supports `returnUrl` query parameter

#### Register (`/auth/register`)
- Registration form (first name, last name, email, phone, address, password)
- Server-side validation message display

#### Profile (`/profile`)
- View and edit personal information
- Profile photo upload
- Role-dependent quick links

### 8.3 Customer Interface

#### Browse Services (`/customer/services`)
- Search by name, filter by category and city
- Service cards with details
- "Book Now" button

#### Create Booking (`/booking/:serviceId`)
- Service summary
- Interactive calendar (past dates disabled)
- Date selection to fetch available time slots
- Time slot selection and booking confirmation

#### My Bookings (`/customer/my-bookings`)
- Monthly calendar showing days with bookings
- Click a day to see the timeline of bookings for that day
- Status display (Pending/Accepted/Rejected/Cancelled/Completed) with color-coded badges
- Cancel pending bookings
- Auto-polling every 30 seconds for status changes with notifications

### 8.4 Provider Interface

#### Dashboard (`/dashboard/`)
- Stats (number of services, pending bookings, subscription status)
- Recent bookings list
- Quick action links

#### Manage Services (`/dashboard/services`)
- Shows the provider's own services
- Edit and delete services

#### Add/Edit Service (`/dashboard/services/new` and `/dashboard/services/:id/edit`)
- Form: name, description, photo, price, duration (minutes), category, city, work hours
- Image upload

#### Incoming Bookings (`/dashboard/bookings`)
- Monthly calendar with booking days
- Daily view with timeline
- Accept and reject bookings
- Auto-polling every 30 seconds

#### Subscription (`/dashboard/subscription`)
- Shows current subscription (plan, price, dates, status)
- Available plans display
- Change plan option

#### Payment (`/subscription/payment/:planId`)
- Plan summary (name, duration, amount)
- Pay and activate button
- Auto-logout after upgrade to get new JWT

### 8.5 Admin Panel

#### Dashboard (`/admin/dashboard`)
- Statistics: total users, services, subscriptions, revenue
- Quick links to all admin sections

#### Manage Users (`/admin/users`)
- User table with search
- Role filter tabs: All, Customers, Providers
- Pagination
- Delete users (deactivate)

#### Manage Services (`/admin/services`)
- Table with all services
- Provider name, price, status
- Delete services

#### Manage Categories (`/admin/categories`)
- Add, edit, delete categories
- Image upload

#### Manage Cities (`/admin/cities`)
- Add, edit, delete cities

#### Subscription Plans (`/admin/plans`)
- Manage plans (name, description, price, duration)

#### Subscriptions (`/admin/subscriptions`)
- Table of provider subscriptions with pagination

#### Payments (`/admin/payments`)
- Payments table with search and pagination

---

## 9. Data Models

| Model | Key Fields |
|---------|-----------------|
| `User` | id, email, firstName, lastName, phoneNumber, role, cityId, isActive, imagePath |
| `Category` | id, name, description, imagePath |
| `City` | cityId, cityName |
| `ServiceItem` | serviceId, serviceName, description, price, estimatedDuration, imagePath, providerName |
| `Booking` | bookingId, serviceId, customerId, providerId, startDateTime, endDateTime, status |
| `TimeSlotRange` | startDateTime, endDateTime |
| `SubscriptionPlan` | id, name, description, price, durationDays, isActive |
| `Subscription` | id, startDate, endDate, isActive, serviceProviderId, planId, pricePaid |
| `Payment` | id, userId, amount, date, status, description |

### Booking Status Values

| Value | Meaning |
|-------|---------|
| 0 | Pending |
| 1 | Accepted |
| 2 | Rejected |
| 3 | Cancelled |
| 4 | Completed |

---

## 10. API Endpoints

### Account and Users
| Method | Endpoint | Purpose |
|---------|--------|-------|
| POST | `/Account/register` | Register new user |
| POST | `/Account/login` | Login |
| POST | `/Account/ForgetPassword` | Request password reset |
| PUT | `/Account/ResetPassword` | Reset password |
| GET | `/User/Profile` | Get profile |
| PUT | `/User/Profile` | Update profile |
| DELETE | `/User/{id}` | Deactivate user |
| GET | `/User/GetAllActiveUser` | All active users |
| GET | `/User/ServiceProviders` | Service providers |
| GET | `/User/Customers` | Customers |

### Categories
| Method | Endpoint | Purpose |
|---------|--------|-------|
| GET | `/Categories` | List categories |
| POST | `/Categories` | Create category |
| PUT | `/Categories/{id}` | Update category |
| DELETE | `/Categories/{id}` | Delete category |

### Cities
| Method | Endpoint | Purpose |
|---------|--------|-------|
| GET | `/City` | List cities |
| POST | `/City` | Create city |
| PUT | `/City/{id}` | Update city |
| DELETE | `/City/{id}` | Delete city |

### Services
| Method | Endpoint | Purpose |
|---------|--------|-------|
| POST | `/Service/CreateService` | Create service |
| PUT | `/Service/{id}` | Update service |
| DELETE | `/Service/{id}` | Delete service |
| GET | `/Service/{id}` | Get service details |
| GET | `/Service/GetAllActiveServices` | All active services |
| GET | `/Service/GetByCategory/{id}` | Services by category |
| GET | `/Service/GetByCity/{id}` | Services by city |
| GET | `/Service/GetByName/{name}` | Search by name |
| GET | `/Service/GetAvailableSlots` | Available time slots |

### Bookings
| Method | Endpoint | Purpose |
|---------|--------|-------|
| POST | `/Booking/Create` | Create booking |
| PUT | `/Booking/Accept/{id}` | Accept booking |
| PUT | `/Booking/Reject/{id}` | Reject booking |
| PUT | `/Booking/Cancel/{id}` | Cancel booking |
| GET | `/Booking/CustomerHistory` | Customer bookings |
| GET | `/Booking/ProviderIncoming` | Provider incoming bookings |

### Subscriptions
| Method | Endpoint | Purpose |
|---------|--------|-------|
| POST | `/Subscription/CreateOrUpgrade` | Create or upgrade subscription |
| GET | `/Subscription/CheckValidity` | Check subscription validity |
| GET | `/Subscription/GetSubscriptionById` | Get current subscription |
| GET | `/Subscription/Plans` | List plans |
| POST | `/Subscription/Plans` | Create plan |
| PUT | `/Subscription/Plans/{id}` | Update plan |
| DELETE | `/Subscription/Plans/{id}` | Delete plan |

### Payments
| Method | Endpoint | Purpose |
|---------|--------|-------|
| GET | `/Payment/GetAllPayments` | All payments (paginated) |
| GET | `/Payment/GetPaymentsByBranch/{userName}` | Payments by username |

**Base URL:** `https://aboodhassan-001-site1.jtempurl.com/api`

---

## 11. Design System

### Color Palette
- **Primary color:** Purple (Purple-600 / `#9333ea`)
- **Light background:** `#f8fafc`
- **Dark background:** `#020617`
- **Light surface:** `#ffffff`
- **Dark surface:** `#111827`

### Dark Theme
- Activated by adding `theme-dark` class on `<html>` element
- Preference saved in `localStorage` with key `bookme-theme`
- All components support dark mode consistently

### Animations
- `fade-in`: Gradual appearance
- `fade-in-up`: Gradual appearance with upward movement
- `slide-up`: Slide upward
- `scale-in`: Gradual scaling
- Stagger delays for multiple elements

### UI Components
- **Card**: `rounded-2xl`, `shadow-sm`, `border`
- **Primary buttons**: Purple background, `rounded-xl`
- **Input fields**: `rounded-xl` with focus effects
- **Badges**: Circular `rounded-full`, color-coded by context
- **Tables**: `bg-slate-50` headers, `hover` rows

---

## 12. Shared Features

### Toast Notifications
- Popup notifications at bottom of screen
- Types: success, error, info, warning
- Auto-dismiss after 4 seconds
- Animated appearance and disappearance

### Notification Center
- In-app notifications stored in localStorage
- Shows unread count
- Mark as read / Mark all read / Clear all

### Dark/Light Theme
- Toggle between dark and light themes
- Preference saved in localStorage

### Responsive Design
- Mobile-adaptive navigation bar
- Mobile hamburger menu with overlay
- Role-responsive footer

---

## 13. Extra Features

### Auto Polling
- **Customer bookings:** Polls every 30 seconds for status changes
- **Provider bookings:** Polls every 30 seconds for new bookings
- Toast + in-app notifications on changes

### Image Upload
- Upload category, service, and profile images
- Uses FormData for multipart submission
- FileReader preview before upload

### Pagination
- Reusable Pagination component
- Previous/Next buttons
- Up to 5 visible page buttons

---

## 14. Setup and Running

### Prerequisites
- Node.js (v20+)
- npm 10.8.2
- Angular CLI 21

### How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
ng serve

# 3. Build for production
ng build
```

The app runs on `http://localhost:4200` and proxies API requests.

### Proxy Configuration (proxy.conf.json)
```json
{
  "/api": {
    "target": "https://aboodhassan-001-site1.jtempurl.com",
    "secure": true,
    "changeOrigin": true
  }
}
```

### Mobile Apps (Capacitor)

```bash
# Add Android platform
npx cap add android

# Add iOS platform
npx cap add ios

# Sync changes
npx cap sync

# Open in IDE
npx cap open android
npx cap open ios
```

---

## 15. Testing

We use **Vitest** as the testing framework with `@angular/build:unit-test`.

```bash
ng test
```

Test files in the project:
- `src/app/app.spec.ts`
- `src/app/home/home.spec.ts`
- `src/app/categories/categories.spec.ts`

---

## 16. Suggested Future Improvements

1. **Real-time chat** between customer and provider
2. **Push notifications** via Firebase for mobile apps
3. **Rating and review system** for completed bookings
4. **Real payment gateway integration** (Stripe, PayPal)
5. **Advanced statistics** with charts (Chart.js)
6. **Multi-language support** (i18n)
7. **More comprehensive tests** (unit + e2e)
8. **Performance optimization** with lazy image loading

---

## 17. References

- [Angular Documentation](https://angular.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Capacitor Documentation](https://capacitorjs.com)
- [RxJS Documentation](https://rxjs.dev)
- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core)
- [JWT.io](https://jwt.io)

---

**© 2026 BookMe - Graduation Project | Software Engineering Department**
