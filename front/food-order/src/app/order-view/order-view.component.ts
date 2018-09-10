import {Component, Input, OnInit} from '@angular/core';
import {Order} from "../model/order";
import {UserData} from "../model/user-data";
import {OrderItem} from "../model/order-item";

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {
  private _groupOrder: { [userId: string]: Order };
  private _users: { [userId: string]: UserData };
  orders: {
    user: UserData,
    items: OrderItem[],
    totalCost: number,
    comments: string
  }[] = [];

  constructor() {

  }

  @Input("order")
  set order(groupOrder: { [userId: string]: Order }) {
    this._groupOrder = groupOrder;
    this.updateOrders();
  }

  @Input("users")
  set users(users: { [userId: string]: UserData }) {
    this._users = users;
    this.updateOrders();
  }

  ngOnInit() {

  }

  private updateOrders() {
    this.orders = [];
    if (!this._users || !this._groupOrder) {
      return;
    }

    Object.keys(this._groupOrder).forEach((key) => {
      let user = this._users[key];
      let comments = this._groupOrder[key].comments;
      let items: OrderItem[] = [];
      let totalCost = 0;
      Object.keys(this._groupOrder[key].items).forEach((itemKey) => {
        let orderItem = this._groupOrder[key].items[itemKey];
        totalCost += orderItem.price;
        items.push(orderItem);
      });

      this.orders.push({
        user: user,
        items: items,
        totalCost: totalCost,
        comments: comments
      })
    });
  }

}
