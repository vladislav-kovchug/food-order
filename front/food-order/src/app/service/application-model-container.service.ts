import { Injectable } from '@angular/core';
import {FoodItem} from "../model/food-item";

@Injectable({
  providedIn: 'root'
})
export class ApplicationModelContainer {
  private foodItems: Array<FoodItem>;

  public getFoodItems() {
    return this.foodItems;
  }

  public updateFoodItems(foodItems: Array<FoodItem>) {
    this.foodItems = foodItems;
  }

  constructor() { }
}
