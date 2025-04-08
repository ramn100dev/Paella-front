import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubCategory } from '../models/SubCategory';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private BASE_URL = "http://localhost:8080/api/categories"

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get(this.BASE_URL + "/all/category")
  }

  postCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.BASE_URL + "/new/category", category)
  }

  deleteCategory(id: number): Observable<Category> {
    return this.http.delete<Category>(this.BASE_URL + "/delete/category/" + id)
  }

  putCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(this.BASE_URL + "/modify/category/" + id, category)
  }

  //SubCategories
  postSubCategory(sub_category: SubCategory): Observable<SubCategory> {
    return this.http.post<SubCategory>(this.BASE_URL +"/new/subCategory", sub_category)
  }

  putSubCategory(id: number, sub_category: SubCategory): Observable<SubCategory> {
    return this.http.put<SubCategory>(this.BASE_URL + "/modify/subCategory/" + id, sub_category)
  }

  deleteSubCategory(id: number): Observable<SubCategory> {
    return this.http.delete<SubCategory>(this.BASE_URL + "/delete/subCategory/" + id)
  }
}
