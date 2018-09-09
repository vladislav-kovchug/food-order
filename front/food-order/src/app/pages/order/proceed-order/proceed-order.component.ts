import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import {ProceedOrderDialogData} from "./proceed-order-dialog-data";
import {UserData} from "../../../model/user-data";
import {FoodItem} from "../../../model/food-item";

@Component({
  selector: 'app-proceed-order',
  templateUrl: './proceed-order.component.html',
  styleUrls: ['./proceed-order.component.scss']
})
export class ProceedOrderComponent implements OnInit {
  orders: {
    user: UserData,
    items: FoodItem[],
    totalCost: number,
    comments: string
  }[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: ProceedOrderDialogData) {
    Object.keys(this.dialogData.activeOrder).forEach((key) => {
      let user = this.dialogData.users[key];
      let comments = this.dialogData.activeOrder[key].comments;
      let items: FoodItem[] = [];
      let totalCost = 0;
      Object.keys(this.dialogData.activeOrder[key].items).forEach((itemKey) => {
        let foodItem = this.dialogData.activeOrder[key].items[itemKey];
        totalCost += foodItem.price;
        items.push(foodItem);
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
