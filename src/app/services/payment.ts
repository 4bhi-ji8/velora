
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/payments`;

  createRazorpayOrder(addressId: string) {
    return this.http.post(
      `${this.apiUrl}/create-order`,
      { addressId }
    );
  }
}
