import {FoodItem} from "./food-item";

export class Order {
  items: { [itemId: string]: FoodItem };
  finished: boolean;
  comments: string;

  constructor(items: { [p: string]: FoodItem }, finished: boolean, comments: string) {
    this.items = items;
    this.finished = finished;
    this.comments = comments;
  }
}
