import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../core/services/toast.service';

interface ContactInfo {
  icon: string;
  title: string;
  detail: string;
  subtitle?: string;
  bg: string;
}

interface FaqItem {
  q: string;
  a: string;
  open: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <div class="hero-blob-1 absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-vibe-200/20 blur-3xl"></div>
      <div class="hero-blob-2 absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-200/15 blur-3xl"></div>
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-36 sm:pb-28 text-center">
        <div class="inline-flex items-center gap-2 rounded-full border border-vibe-100 bg-white/80 px-4 py-1.5 shadow-sm mb-6">
          <span class="text-sm">💬</span>
          <span class="text-xs font-semibold text-vibe-600">Get in Touch</span>
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
          We'd Love to
          <span class="gradient-text">Hear From You</span>
        </h1>
        <p class="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-slate-500">
          Have a question, suggestion, or just want to say hello? Our team is here to help.
        </p>
      </div>
    </section>

    <!-- Contact Form + Info -->
    <section class="bg-slate-50 after-hero-surface py-20 sm:py-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-5 gap-8 items-start">

          <!-- Contact Info -->
          <div class="lg:col-span-2 space-y-5">
            @for (info of contactInfo; track info.title) {
              <div class="group rounded-2xl bg-white border border-slate-100 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-vibe-200">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all duration-300 group-hover:scale-110"
                    [class]="info.bg">{{ info.icon }}</div>
                  <div>
                    <h3 class="text-sm font-semibold text-slate-900">{{ info.title }}</h3>
                    <p class="text-sm text-slate-500">{{ info.detail }}</p>
                    @if (info.subtitle) {
                      <p class="text-xs text-slate-400">{{ info.subtitle }}</p>
                    }
                  </div>
                </div>
              </div>
            }

            <!-- Social -->
            <div class="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
              <h3 class="text-sm font-semibold text-slate-900 mb-4">Follow Us</h3>
              <div class="flex gap-3">
                <a href="#" target="_blank" rel="noopener noreferrer" title="Facebook"
                  class="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 text-slate-400 hover:bg-vibe-50 hover:text-vibe-600">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" title="Twitter"
                  class="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 text-slate-400 hover:bg-vibe-50 hover:text-vibe-600">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" title="GitHub"
                  class="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 text-slate-400 hover:bg-vibe-50 hover:text-vibe-600">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                  class="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 text-slate-400 hover:bg-vibe-50 hover:text-vibe-600">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="lg:col-span-3 rounded-[28px] bg-white border border-slate-100 p-6 sm:p-8 shadow-lg shadow-slate-200/40">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Send Us a Message</h2>
            <p class="mt-1 text-sm text-slate-400">We typically respond within 24 hours</p>

            <form (ngSubmit)="onSubmit()" class="mt-7 space-y-5">
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5" for="name">Full Name</label>
                  <input #nameRef="ngModel" id="name" type="text" [(ngModel)]="name" name="name" required
                    class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400"
                    placeholder="John Doe"
                    [class.input-error]="nameRef.invalid && (nameRef.dirty || nameRef.touched || submitted())" />
                  @if (nameRef.invalid && (nameRef.dirty || nameRef.touched || submitted())) {
                    <div class="field-error">
                      <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                      Name is required
                    </div>
                  }
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5" for="email">Email Address</label>
                  <input #emailRef="ngModel" id="email" type="email" [(ngModel)]="email" name="email" required
                    class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400"
                    placeholder="john&#64;example.com"
                    [class.input-error]="emailRef.invalid && (emailRef.dirty || emailRef.touched || submitted())" />
                  @if (emailRef.invalid && (emailRef.dirty || emailRef.touched || submitted())) {
                    <div class="field-error">
                      <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                      @if (emailRef.errors?.['required']) { Email is required }
                      @if (emailRef.errors?.['email']) { Enter a valid email }
                    </div>
                  }
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5" for="subject">Subject</label>
                <input id="subject" type="text" [(ngModel)]="subject" name="subject"
                  class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400"
                  placeholder="How can we help?" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5" for="message">Message</label>
                <textarea #msgRef="ngModel" id="message" [(ngModel)]="message" name="message" rows="5" required
                  class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400 resize-y"
                  placeholder="Tell us more about your inquiry..."
                  [class.input-error]="msgRef.invalid && (msgRef.dirty || msgRef.touched || submitted())"></textarea>
                @if (msgRef.invalid && (msgRef.dirty || msgRef.touched || submitted())) {
                  <div class="field-error">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    Message is required
                  </div>
                }
              </div>
              <button type="submit" [disabled]="submitting()"
                class="w-full rounded-xl bg-purple-600 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                @if (submitting()) {
                  <span class="inline-flex items-center gap-2">
                    <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Sending...
                  </span>
                } @else {
                  <span class="inline-flex items-center gap-2">
                    Send Message
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                  </span>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Map -->
    <section class="bg-white py-20 sm:py-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="inline-flex items-center rounded-full bg-vibe-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-vibe-700">Our Location</span>
          <h2 class="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Find Us Here</h2>
          <p class="mt-4 text-base text-slate-500">Visit our office or drop us a line — we'd love to meet you</p>
        </div>
        <div class="overflow-hidden rounded-[28px] shadow-xl shadow-slate-200/50 border border-slate-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.123456789!2d35.123456!3d31.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDA3JzI0LjQiTiAzNcKwMDcnMjQuNCJF!5e0!3m2!1sen!2s!4v1"
            width="100%" height="400" style="border:0; border-radius: 28px;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            title="BookMe Office Location">
          </iframe>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="bg-slate-50 py-20 sm:py-28">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="inline-flex items-center rounded-full bg-white border border-slate-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">FAQ</span>
          <h2 class="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
          <p class="mt-4 text-base text-slate-500">Quick answers to common questions</p>
        </div>
        <div class="space-y-3">
          @for (item of faqItems; track item.q; let i = $index) {
            <div class="rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-200"
              [class]="item.open ? 'shadow-md border-vibe-200' : 'hover:shadow-md hover:border-slate-200'">
              <button (click)="toggleFaq(i)"
                class="w-full flex items-center justify-between px-6 py-5 text-left transition-all duration-200">
                <span class="text-sm font-semibold text-slate-900 pr-4">{{ item.q }}</span>
                <svg class="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300"
                  [class.rotate-180]="item.open"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              @if (item.open) {
                <div class="px-6 pb-5 text-sm text-slate-500 leading-relaxed animate-fade-in">
                  {{ item.a }}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class Contact {
  private readonly toast = inject(ToastService);

  name = '';
  email = '';
  subject = '';
  message = '';
  readonly submitting = signal(false);
  readonly submitted = signal(false);

  readonly contactInfo: ContactInfo[] = [
    { icon: '📍', title: 'Our Address', detail: '123 Business Street, Amman, Jordan', subtitle: 'Downtown district', bg: 'bg-vibe-50' },
    { icon: '📧', title: 'Email Us', detail: 'support@bookme.com', subtitle: 'We reply within 24h', bg: 'bg-emerald-50' },
    { icon: '📞', title: 'Call Us', detail: '+1 (555) 123-4567', subtitle: 'Mon–Fri, 9 AM – 6 PM', bg: 'bg-purple-50' },
    { icon: '🕐', title: 'Business Hours', detail: 'Monday – Friday, 9:00 AM – 6:00 PM', subtitle: 'Weekend inquiries replied on Monday', bg: 'bg-amber-50' },
  ];



  readonly faqItems: FaqItem[] = [
    { q: 'How do I book a service?', a: 'Simply browse our categories, pick a service, choose your preferred date and time, and confirm your booking. You\'ll receive an instant confirmation and the provider will be notified right away.', open: false },
    { q: 'Can I cancel or reschedule a booking?', a: 'Yes, you can cancel or reschedule bookings from your "My Bookings" page. Please note that some providers may have specific cancellation policies.', open: false },
    { q: 'How do I become a service provider?', a: 'Register for an account, navigate to your profile, and click "Become a Provider". Choose a subscription plan that fits your needs and start listing your services.', open: false },
    { q: 'Is my payment information secure?', a: 'Absolutely. We use industry-standard encryption to protect your data. We never store full payment details on our servers.', open: false },
    { q: 'How long does it take to get a response?', a: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.', open: false },
  ];

  toggleFaq(index: number): void {
    this.faqItems[index].open = !this.faqItems[index].open;
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (!this.name || !this.email || !this.message) return;
    this.submitting.set(true);
    setTimeout(() => {
      this.toast.success('Message sent! We will get back to you soon.');
      this.name = '';
      this.email = '';
      this.subject = '';
      this.message = '';
      this.submitting.set(false);
    }, 1000);
  }
}
