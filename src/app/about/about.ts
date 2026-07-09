import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <section class="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <div class="hero-blob-1 absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-vibe-200/20 blur-3xl"></div>
      <div class="hero-blob-2 absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-200/15 blur-3xl"></div>

      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-36 sm:pb-28 text-center">
        <div class="inline-flex items-center gap-2 rounded-full border border-vibe-100 bg-white/80 px-4 py-1.5 shadow-sm mb-6">
          <span class="text-sm">💜</span>
          <span class="text-xs font-semibold text-vibe-600">About BookMe</span>
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
          Connecting You With
          <span class="gradient-text">Trusted Professionals</span>
        </h1>
        <p class="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-slate-500">
          We're on a mission to make booking professional services as simple as a few clicks.
          Whether you need a haircut, home repair, or legal consultation — we've got you covered.
        </p>
      </div>
    </section>

    <section class="bg-white after-hero-surface border-y border-slate-100">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          @for (s of stats; track s.label) {
            <div class="group">
              <div class="text-3xl sm:text-4xl font-bold text-vibe-600">{{ s.value }}</div>
              <div class="mt-1 text-sm text-slate-400">{{ s.label }}</div>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="bg-slate-50 py-20 sm:py-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span class="inline-flex items-center rounded-full bg-vibe-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-vibe-700">Our Story</span>
            <h2 class="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Built to Simplify Booking</h2>
            <p class="mt-5 text-base leading-relaxed text-slate-500">
              BookMe was founded with a simple vision: eliminate the back-and-forth of finding and booking
              professional services. What started as a small platform has grown into a trusted marketplace
              connecting thousands of customers with verified providers across multiple categories.
            </p>
            <p class="mt-4 text-base leading-relaxed text-slate-500">
              We believe everyone deserves access to quality services without the hassle of endless phone calls,
              incompatible schedules, or uncertainty about who to trust. Transparency, convenience, and reliability
              are at the core of everything we build.
            </p>
            <div class="mt-8 flex items-center gap-4 rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
              <div class="h-14 w-14 rounded-full bg-gradient-to-br from-vibe-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shrink-0">BM</div>
              <div>
                <div class="text-sm font-bold text-slate-900">"Your time matters. We make every booking count."</div>
                <div class="mt-0.5 text-xs text-slate-400">— BookMe Team</div>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="overflow-hidden rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700" class="w-full h-[420px] object-cover" alt="Team collaboration" />
            </div>
            <div class="absolute -bottom-5 -left-5 rounded-2xl bg-white p-5 shadow-lg border border-slate-100">
              <div class="text-2xl font-bold text-vibe-600">10K+</div>
              <div class="text-xs text-slate-400">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-20 sm:py-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="inline-flex items-center rounded-full bg-vibe-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-vibe-700">Why Choose Us</span>
          <h2 class="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Everything You Need in One Place</h2>
          <p class="mt-4 text-base text-slate-500">We've designed every feature to make booking effortless and reliable</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (f of features; track f.title) {
            <div class="group rounded-[28px] border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 hover:border-vibe-200 hover:shadow-xl">
              <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-vibe-100 to-purple-50 text-2xl">{{ f.icon }}</div>
              <h3 class="mt-6 text-lg font-bold text-slate-900">{{ f.title }}</h3>
              <p class="mt-3 text-sm leading-relaxed text-slate-500">{{ f.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="bg-slate-50 py-20 sm:py-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="inline-flex items-center rounded-full bg-white border border-slate-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Our Team</span>
          <h2 class="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">The People Behind BookMe</h2>
          <p class="mt-4 text-base text-slate-500">A passionate team dedicated to transforming how you book services</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (m of team; track m.name) {
            <div class="group rounded-2xl bg-white border border-slate-100 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div class="mx-auto h-20 w-20 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md"
                [class]="m.color">{{ m.initials }}</div>
              <h3 class="mt-5 text-base font-bold text-slate-900">{{ m.name }}</h3>
              <p class="text-xs text-slate-400">{{ m.role }}</p>
              <div class="mt-4 flex justify-center gap-2">
                <span class="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 hover:bg-vibe-50 hover:text-vibe-600 transition-all cursor-pointer" title="LinkedIn">in</span>
                <span class="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 hover:bg-vibe-50 hover:text-vibe-600 transition-all cursor-pointer" title="Twitter">𝕏</span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="relative overflow-hidden bg-white py-20 sm:py-28">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-vibe-200/15 blur-3xl"></div>
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative">
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Ready to Get Started?</h2>
        <p class="mt-4 text-base text-slate-500 max-w-xl mx-auto">Join thousands of satisfied customers. Find your perfect professional today.</p>
        <div class="mt-8 flex flex-wrap gap-3 justify-center">
          <a routerLink="/Categories"
            class="inline-flex items-center justify-center rounded-xl bg-purple-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-200 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
            Browse Services
            <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
          <a routerLink="/subscription"
            class="inline-flex items-center justify-center rounded-xl bg-vibe-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-vibe-500 focus:ring-offset-2">
            Join as a Provider
          </a>
        </div>
      </div>
    </section>
  `,
})
export class About {
  readonly stats = [
    { value: '15K+', label: 'Bookings Completed' },
    { value: '500+', label: 'Trusted Providers' },
    { value: '50+', label: 'Service Categories' },
    { value: '4.9', label: 'Average Rating' },
  ];

  readonly features = [
    { icon: '🔍', title: 'Easy Discovery', description: 'Browse hundreds of services across multiple categories. Filter by location, price, and availability to find exactly what you need.' },
    { icon: '📅', title: 'Instant Booking', description: 'See real-time availability and book appointments instantly. No phone calls, no back-and-forth — just seamless scheduling.' },
    { icon: '⭐', title: 'Verified Reviews', description: 'Read honest ratings and reviews from real customers. Make informed decisions with confidence.' },
    { icon: '🛡️', title: 'Trusted Providers', description: 'Every provider is verified. We ensure quality and reliability so you can book with peace of mind.' },
    { icon: '💬', title: 'Direct Messaging', description: 'Communicate directly with providers. Ask questions, confirm details, and get updates in real time.' },
    { icon: '📱', title: 'Mobile Friendly', description: 'Book from anywhere, on any device. Our platform is fully responsive and optimized for on-the-go use.' },
  ];

  readonly team = [
    { name: 'Ahmed Hassan', role: 'Founder & CEO', initials: 'AH', color: 'bg-gradient-to-br from-vibe-500 to-vibe-700' },
    { name: 'Sara Khalid', role: 'Head of Product', initials: 'SK', color: 'bg-gradient-to-br from-purple-500 to-purple-700' },
    { name: 'Omar Rashed', role: 'Lead Engineer', initials: 'OR', color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
    { name: 'Lina Nasser', role: 'Design Lead', initials: 'LN', color: 'bg-gradient-to-br from-emerald-500 to-emerald-700' },
  ];
}
