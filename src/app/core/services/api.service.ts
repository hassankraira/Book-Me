import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  PaginatedResponse,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ForgetPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  Category,
  City,
  ServiceItem,
  TimeSlot,
  TimeSlotRange,
  Booking,
  CreateBookingRequest,
  SubscriptionPlan,
  Subscription,
  Payment,
  User,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://aboodhassan-001-site1.jtempurl.com/api';

  // Auth
  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    let params = new HttpParams()
      .set('FirstName', data.firstName)
      .set('LastName', data.lastName)
      .set('Email', data.email)
      .set('Password', data.password)
      .set('ConfirmPassword', data.confirmPassword)
      .set('PhoneNumber', data.phoneNumber)
      .set('Address', data.address);
    if (data.description) params = params.set('Description', data.description);
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/Account/register`, null, { params });
  }

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/Account/login`, data);
  }

  forgetPassword(data: ForgetPasswordRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}/Account/ForgetPassword`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/Account/ResetPassword`, data);
  }

  // Users
  getAllActiveUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/User/GetAllActiveUser`);
  }

  getActiveUsersWithPagination(pageNumber: number, pageSize: number): Observable<ApiResponse<User[]>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/User/GetAllActiveUserWithPagination`, { params });
  }

  getServiceProviders(pageNumber: number, pageSize: number): Observable<ApiResponse<User[]>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/User/ServiceProviders`, { params });
  }

  getCustomers(pageNumber: number, pageSize: number): Observable<ApiResponse<User[]>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/User/Customers`, { params });
  }

  deactivateUser(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/User/${id}`);
  }

  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/User/Profile`);
  }

  updateProfile(data: UpdateProfileRequest): Observable<ApiResponse<boolean>> {
    const q = [];
    if (data.firstName) q.push('FirstName=' + encodeURIComponent(data.firstName));
    if (data.lastName) q.push('LastName=' + encodeURIComponent(data.lastName));
    if (data.phoneNumber) q.push('PhoneNumber=' + encodeURIComponent(data.phoneNumber));
    if (data.address) q.push('Address=' + encodeURIComponent(data.address));
    if (data.description) q.push('Description=' + encodeURIComponent(data.description));
    const url = `${this.baseUrl}/User/Profile` + (q.length ? '?' + q.join('&') : '');
    const formData = new FormData();
    if (data.imagePath instanceof File) {
      formData.append('ImagePath', data.imagePath);
      return this.http.put<ApiResponse<boolean>>(url, formData);
    }
    return this.http.put<ApiResponse<boolean>>(url, null);
  }

  // Categories
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/Categories`);
  }

  getCategory(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.baseUrl}/Categories/${id}`);
  }

  createCategory(data: { name: string; description: string; imagePath?: string }): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${this.baseUrl}/Categories`, data);
  }

  updateCategory(id: number, name: string, description: string, imageFile?: File): Observable<ApiResponse<Category>> {
    const params = new HttpParams().set('Name', name).set('Description', description);
    if (imageFile) {
      const fd = new FormData();
      fd.append('ImagePath', imageFile);
      return this.http.put<ApiResponse<Category>>(`${this.baseUrl}/Categories/${id}`, fd, { params });
    }
    return this.http.put<ApiResponse<Category>>(`${this.baseUrl}/Categories/${id}`, null, { params });
  }

  deleteCategory(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/Categories/${id}`);
  }

  // Cities
  getCities(): Observable<ApiResponse<City[]>> {
    return this.http.get<ApiResponse<City[]>>(`${this.baseUrl}/City`);
  }

  getCity(id: number): Observable<ApiResponse<City>> {
    return this.http.get<ApiResponse<City>>(`${this.baseUrl}/City/${id}`);
  }

  createCity(data: { cityName: string }): Observable<ApiResponse<City>> {
    return this.http.post<ApiResponse<City>>(`${this.baseUrl}/City`, data);
  }

  updateCity(id: number, data: { cityName: string }): Observable<ApiResponse<City>> {
    return this.http.put<ApiResponse<City>>(`${this.baseUrl}/City/${id}`, data);
  }

  deleteCity(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/City/${id}`);
  }

  // Services
  createService(params: HttpParams, imageFile?: File): Observable<ApiResponse<ServiceItem>> {
    const fd = new FormData();
    fd.append('ImagePath', imageFile ?? new Blob([]), '');
    return this.http.post<ApiResponse<ServiceItem>>(`${this.baseUrl}/Service/CreateService`, fd, { params });
  }

  updateService(id: number, params: HttpParams, imageFile?: File): Observable<ApiResponse<ServiceItem>> {
    if (imageFile) {
      const fd = new FormData();
      fd.append('ImagePath', imageFile);
      return this.http.put<ApiResponse<ServiceItem>>(`${this.baseUrl}/Service/${id}`, fd, { params });
    }
    return this.http.put<ApiResponse<ServiceItem>>(`${this.baseUrl}/Service/${id}`, null, { params });
  }

  deleteService(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/Service/${id}`);
  }

  getService(id: number): Observable<ApiResponse<ServiceItem>> {
    return this.http.get<ApiResponse<ServiceItem>>(`${this.baseUrl}/Service/${id}`);
  }

  getAllActiveServices(): Observable<ApiResponse<ServiceItem[]>> {
    return this.http.get<ApiResponse<ServiceItem[]>>(`${this.baseUrl}/Service/GetAllActiveServices`);
  }

  getAllServicesWithDeleted(): Observable<ApiResponse<ServiceItem[]>> {
    return this.http.get<ApiResponse<ServiceItem[]>>(`${this.baseUrl}/Service/GetAllServicesWithDeleted`);
  }

  getServicesWithPagination(params?: { pageNumber?: number; pageSize?: number }): Observable<ApiResponse<PaginatedResponse<ServiceItem>>> {
    let httpParams = new HttpParams();
    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    return this.http.get<ApiResponse<PaginatedResponse<ServiceItem>>>(`${this.baseUrl}/Service/GetServicesWithPagination`, { params: httpParams });
  }

  getServiceByName(name: string): Observable<ApiResponse<ServiceItem[]>> {
    return this.http.get<ApiResponse<ServiceItem[]>>(`${this.baseUrl}/Service/GetByName/${encodeURIComponent(name)}`);
  }

  getServicesByCity(cityId: number): Observable<ApiResponse<ServiceItem[]>> {
    return this.http.get<ApiResponse<ServiceItem[]>>(`${this.baseUrl}/Service/GetByCity/${cityId}`);
  }

  getServicesByCategory(categoryId: number): Observable<ApiResponse<ServiceItem[]>> {
    return this.http.get<ApiResponse<ServiceItem[]>>(`${this.baseUrl}/Service/GetByCategory/${categoryId}`);
  }

  getAvailableSlots(serviceId: number, date: string): Observable<ApiResponse<TimeSlotRange[]>> {
    const params = new HttpParams().set('serviceId', serviceId).set('date', date);
    return this.http.get<ApiResponse<TimeSlotRange[]>>(`${this.baseUrl}/Service/GetAvailableSlots`, { params });
  }

  // Bookings
  createBooking(data: CreateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(`${this.baseUrl}/Booking/Create`, data);
  }

  acceptBooking(id: number): Observable<ApiResponse<Booking>> {
    return this.http.put<ApiResponse<Booking>>(`${this.baseUrl}/Booking/Accept/${id}`, {});
  }

  rejectBooking(id: number): Observable<ApiResponse<Booking>> {
    return this.http.put<ApiResponse<Booking>>(`${this.baseUrl}/Booking/Reject/${id}`, {});
  }

  cancelBooking(id: number): Observable<ApiResponse<Booking>> {
    return this.http.put<ApiResponse<Booking>>(`${this.baseUrl}/Booking/Cancel/${id}`, {});
  }

  getCustomerBookingHistory(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.baseUrl}/Booking/CustomerHistory`);
  }

  getProviderIncomingBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.baseUrl}/Booking/ProviderIncoming`);
  }

  // Subscriptions
  createOrUpgradeSubscription(planId: number, method: number = 0): Observable<ApiResponse<boolean>> {
    const params = new HttpParams().set('subscriptionTypeId', planId).set('method', method);
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/Subscription/CreateOrUpgrade`, null, { params });
  }

  checkSubscriptionValidity(): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/Subscription/CheckValidity`);
  }

  getAllSubscriptions(): Observable<ApiResponse<Subscription[]>> {
    return this.http.get<ApiResponse<Subscription[]>>(`${this.baseUrl}/Subscription/GetAllSubscriptions`);
  }

  getSubscriptionsWithPagination(pageNumber: number, pageSize: number): Observable<ApiResponse<Subscription[]>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<ApiResponse<Subscription[]>>(`${this.baseUrl}/Subscription/GetSubscriptionsWithPagination`, { params });
  }

  getSubscriptionPlans(): Observable<ApiResponse<SubscriptionPlan[]>> {
    return this.http.get<ApiResponse<SubscriptionPlan[]>>(`${this.baseUrl}/Subscription/Plans`);
  }

  createSubscriptionPlan(data: { name: string; price: number; durationDays: number }): Observable<ApiResponse<SubscriptionPlan>> {
    const params = new HttpParams()
      .set('Name', data.name)
      .set('DurationDays', data.durationDays)
      .set('Price', data.price);
    return this.http.post<ApiResponse<SubscriptionPlan>>(`${this.baseUrl}/Subscription/Plans`, null, { params });
  }

  updateSubscriptionPlan(id: number, data: { name: string; price: number; durationDays: number }): Observable<ApiResponse<SubscriptionPlan>> {
    const params = new HttpParams()
      .set('Name', data.name)
      .set('DurationDays', data.durationDays)
      .set('Price', data.price);
    return this.http.put<ApiResponse<SubscriptionPlan>>(`${this.baseUrl}/Subscription/Plans/${id}`, null, { params });
  }

  deleteSubscriptionPlan(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/Subscription/Plans/${id}`);
  }

  // Payments
  getAllPayments(params?: { pageNumber?: number; pageSize?: number }): Observable<ApiResponse<PaginatedResponse<Payment>>> {
    let httpParams = new HttpParams();
    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    return this.http.get<ApiResponse<PaginatedResponse<Payment>>>(`${this.baseUrl}/Payment/GetAllPayments`, { params: httpParams });
  }

  getPaymentsByBranch(userName: string): Observable<ApiResponse<Payment[]>> {
    return this.http.get<ApiResponse<Payment[]>>(`${this.baseUrl}/Payment/GetPaymentsByBranch/${encodeURIComponent(userName)}`);
  }
}
