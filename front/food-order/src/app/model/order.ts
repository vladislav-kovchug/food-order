import {OrderItem} from "./order-item";

export class Order {
  items: { [itemId: string]: OrderItem };
  finished: boolean;
  comments: string;

  constructor(items: { [p: string]: OrderItem }, finished: boolean, comments: string) {
    this.items = items;
    this.finished = finished;
    this.comments = comments;
  }
}
