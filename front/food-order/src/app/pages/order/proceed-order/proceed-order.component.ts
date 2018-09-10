import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import {ProceedOrderDialogData} from "./proceed-order-dialog-data";

@Component({
  selector: 'app-proceed-order',
  templateUrl: './proceed-order.component.html',
  styleUrls: ['./proceed-order.component.scss']
})
export class ProceedOrderComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: ProceedOrderDialogData) {

  }

  ngOnInit() {


  }

}
