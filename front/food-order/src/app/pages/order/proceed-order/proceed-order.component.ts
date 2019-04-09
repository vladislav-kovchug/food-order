import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

import {GroupOrder} from '../../../model/group-order';
import {ProceedOrderDialogData} from './proceed-order-dialog-data';

@Component({
  selector: 'app-proceed-order',
  templateUrl: './proceed-order.component.html',
  styleUrls: ['./proceed-order.component.scss']
})
export class ProceedOrderComponent implements OnInit {

  public totalCost = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: ProceedOrderDialogData) {

  }

  ngOnInit() {
    this.groupProcessing();
  }

  private groupProcessing(): void {
    if (!this.dialogData.users || !this.dialogData.activeOrder) {
      return;
    }

    this.totalCost = this.calculateTotalCost(this.dialogData.activeOrder);
  }

  private calculateTotalCost(groupOrder: GroupOrder): number {
    let totalCost = 0;
    Object.keys(groupOrder).forEach((userId) => {
      const orderItems = groupOrder[userId].items;
      Object.keys(orderItems).forEach((itemId) => {
        const orderItem = orderItems[itemId];
        totalCost += orderItem.price * orderItem.count;
      });
    });

    return totalCost;
  }
}
