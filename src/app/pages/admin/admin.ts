import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CategoryService } from '../../services/category';
import { Category } from '../../models/category';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  newProduct = {
    name: '',
    description: '',
    image: '',
    price: 0,
    category: '',
    stock: 0,
  };

  private ProductService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  showProductForm = signal(false);

  ngOnInit(): void {
    this.ProductService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.products);
        console.log('Admin products', response.products);
      },
      error: (error) => {
        console.error('failed to fetch products :', error);
      },
    });

    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.categories);
        console.log('Admin categories', response.categories);
      },
      error: (error) => {
        console.error('failed to fetch categories :', error);
      },
    });
  }
  addProduct(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();  
      return;
    }
    this.ProductService.createProduct(this.newProduct).subscribe({
      next: (response) => {
        console.log('Product created succesfully', response);

        this.ProductService.getProducts().subscribe({
          next: (ProductResponse) => {
            this.products.set(ProductResponse.products);
          },
          error: (error) => {
            console.log('Failed to refresh products:', error);
            form.resetForm();
          }
        })
        form.resetForm();
      },
      error: (error) => {
        console.error('Failed to create product:', error);
        form.resetForm();
      }
    })
    
    
  }
}
