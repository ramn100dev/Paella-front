import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltersServiceService {

  private isDrawerOpen = false
  private prefState = false
  private observationState = false
  private day = ""
  private category = ""
  private subCategory = ""
  private food = ""

  constructor() { }

  getDrawerState(): boolean {
    return this.isDrawerOpen
  }

  getPrefState(): boolean {
    return this.prefState
  }

  getObservationState(): boolean {
    return this.observationState
  }

  getDay(): string {
    return this.day
  }

  getCategory(): string {
    return this.category
  }

  getSubCategory(): string {
    return this.subCategory
  }

  getFood(): string {
    return this.food
  }


  setDrawerState(state: boolean): void {
    this.isDrawerOpen = state
  }

  setPrefState(state: boolean): void {
    this.prefState = state
  }

  setObservationState(state: boolean): void {
    this.observationState = state
  }

  setDay(content: string): void {
    this.day = content
  }

  setCategory(content: string): void {
    this.category = content
  }

  setSubCategory(content: string): void {
    this.subCategory = content
  }

  setFood(content: string): void {
    this.food = content
  }
}
