import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';



@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);
  currentYear = new Date().getFullYear();
  products = signal<Product[]>([]);

  user = signal<User | null>(null);;

  constructor() {
    this.authService.getProfile().subscribe({
      next : (response) => {
        this.user.set(response);

        console.log('Profile', response);
        
      },
      error : (error) => {
        console.error('Profile failed', error);
      }
    })

    this.productService.getProducts().subscribe({
    next: (response) => {
      this.products.set(response.products);
      console.log('Products', response.products); 
    },
    error: (error) => {
      console.error('Failed to fetch products', error);
    }
  })
  
  }

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }

  
}
