import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Food } from '../models/Food';
import { Observable } from 'rxjs';
import { SubCategory } from '../models/SubCategory';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private BASE_URL = "http://localhost:8080/api/food/"

  constructor(private http: HttpClient) { }

  postFood(food: Food): Observable<Food> {
    return this.http.post<Food>(this.BASE_URL + "new", food)
  }

  deleteFood(id: number): Observable<Food> {
    return this.http.delete<Food>(this.BASE_URL + "delete/" + id)
  }
}
