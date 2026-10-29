import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environments';

interface ProductResponse{
    status: string;
    message: string;
    products: Product[];
    pagination: {
        currentPage: number;
        itemsPerPage: number;
        totalProducts: number;
        totalPages: number;

    }
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.apiUrl);
  }
  createProduct(product: Omit<Product, '_id' | 'category'> & {
    category : string;
  }): Observable<{ status: string; message: string; product: Product }> {
  return this.http.post<{
    status: string;
    message: string;
    product: Product;
  }>(this.apiUrl, product);
} 
}