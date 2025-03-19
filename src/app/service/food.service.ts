import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private BASE_URL = "http://localhost:8080/api/categories"

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get(this.BASE_URL + "/all/category")
  }
}
