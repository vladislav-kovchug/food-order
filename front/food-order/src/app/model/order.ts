import {FoodItem} from "./food-item";

export class Order {
  used: number;
  items: Array<FoodItem>;


  constructor(used: number, items: Array<FoodItem>) {
    this.used = used;
    this.items = items;
  }
}
