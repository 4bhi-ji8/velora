import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);

  createRazorpayOrder(addressId : string) {
    return this.http.post (
      'http://localhost:3000/api/payments/create-order',
      {addressId}
    )
  }
}
