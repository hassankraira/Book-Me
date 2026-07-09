export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  errors: string[];
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  address: string;
  description?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiration: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'User' | 'ServiceProvider' | 'Admin';
  cityId?: number;
  cityName?: string;
  isActive: boolean;
  imagePath?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imagePath: string;
}

export interface City {
  cityId: number;
  cityName: string;
}

export interface ServiceItem {
  serviceId: number;
  serviceName: string;
  description: string;
  price: number;
  estimatedDuration: number;
  categoryId?: number;
  cityId?: number;
  startWork?: string;
  endWork?: string;
  imagePath?: string;
  serviceProviderId: string;
  providerName?: string;
  cityName?: string;
  categoryName?: string;
}

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TimeSlotRange {
  startDateTime: string;
  endDateTime: string;
}

export interface Booking {
  bookingId: number;
  serviceId: number;
  serviceName?: string;
  serviceDescription?: string;
  servicePrice?: number;
  estimatedServiceTime?: string;
  customerId: string;
  customerName?: string;
  serviceProviderId: string;
  providerName?: string;
  providerPhoneNumber?: string;
  startDateTime: string;
  endDateTime: string;
  status: number;
}

export interface CreateBookingRequest {
  serviceId: number;
  startDateTime: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  isActive: boolean;
}

export interface Subscription {
  id: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  serviceProviderId: string;
  providerName?: string;
  subscriptionTypeId: number;
  subscriptionTypeName?: string;
  pricePaid?: number;
}

export interface Payment {
  id: number;
  userId: string;
  userName?: string;
  amount: number;
  date: string;
  status: string;
  description?: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  description?: string;
  cityId?: number;
  imagePath?: string | File;
}
