import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import {ProceedOrderDialogData} from "./proceed-order-dialog-data";
import {UserData} from "../../../model/user-data";
import {OrderItem} from "../../../model/order-item";

@Component({
  selector: 'app-proceed-order',
  templateUrl: './proceed-order.component.html',
  styleUrls: ['./proceed-order.component.scss']
})
export class ProceedOrderComponent implements OnInit {
  orders: {
    user: UserData,
    items: OrderItem[],
    totalCost: number,
    comments: string
  }[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: ProceedOrderDialogData) {
    Object.keys(this.dialogData.activeOrder).forEach((key) => {
      let user = this.dialogData.users[key];
      let comments = this.dialogData.activeOrder[key].comments;
      let items: OrderItem[] = [];
      let totalCost = 0;
      Object.keys(this.dialogData.activeOrder[key].items).forEach((itemKey) => {
        let orderItem = this.dialogData.activeOrder[key].items[itemKey];
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

  ngOnInit() {


  }

}
