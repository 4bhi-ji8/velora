
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "../models/category";
import { environment } from "../../environments/environments";

interface CategoryResponse {
    status: string;
    message: string;
    categories: Category[];
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
   private http = inject(HttpClient);

   private apiUrl = `${environment.apiUrl}/categories`;

   getCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(this.apiUrl);
   }
}
