import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from './core/models';
export interface ApiResponse<T> { data: T; isSuccess: boolean; message: string; errors: string[]; statusCode: number; }
@Injectable({
  providedIn: 'root',
})
export class Api {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://aboodhassan-001-site1.jtempurl.com/api';

getCategories(): Observable<ApiResponse<Category[]>>
 { return this.http.get<ApiResponse<Category[]>>( `${this.apiUrl}/Categories` ); }
}