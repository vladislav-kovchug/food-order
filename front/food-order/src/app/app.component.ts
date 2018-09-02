import { Component } from '@angular/core';
import {CommunicatorService} from "./service/communicator.service";
import {CommunicatorEvent} from "./service/communicator-event";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'food-order';

  constructor (communicationService: CommunicatorService) {
    // communicationService.initializeConnection(function () {
    //   communicationService.executeQuery(CommunicatorEvent.GET_FOOD_LIST);
    // })
  }
}
