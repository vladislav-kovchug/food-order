import {Injectable} from '@angular/core';

import * as socketio from 'socket.io-client';
import {ApplicationModelContainer} from "./application-model-container.service";
import {Query} from "./api/query/query";
import {Command} from "./api/command/command";
import {ApplicationEvent} from "./api/event/application-event";

@Injectable({
  providedIn: 'root'
})
export class CommunicatorService {
  static readonly SERVER_URL: string = 'http://localhost:8888';
  private socket;
  private applicationModel: ApplicationModelContainer;

  public sendCommand(command: Command) {
    // if (!this.socket) {
    //   throw new Error("Socket not initialized. Call initializeConnection() first.");
    // }
    //
    // this.socket.emit('command', command);
  }

  public executeQuery(query: Query): Promise<any> {
    if (!this.socket) {
      throw new Error("Socket not initialized. Call initializeConnection() first.");
    }

    return new Promise((resolve => {
      let queryId = CommunicatorService.getQueryId();
      this.socket.emit('query', {queryId: CommunicatorService.getQueryId(), query: query});
      this.socket.on(queryId, resolve);
    }));
  }

  private handleEvent(event: ApplicationEvent) {
    console.log('Have new event %s', JSON.stringify(event));
  }

  public initializeConnection(callback: Function) {
    this.socket = socketio(CommunicatorService.SERVER_URL);
    this.socket.on('connect', () => {
      this.socket.on('event', (data) => {
        this.handleEvent(data);
      });
      // this.socket.on(CommunicatorEvent.FOOD_LIST_UPDATED, this.handleFoodListUpdated);
      // this.socket.on(CommunicatorEvent.ORDER_UPDATED, this.handleOrderUpdated);

      console.log("CONNECTED!!!");
      callback();
    });
  }

  private static getQueryId(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  constructor(applicationModel: ApplicationModelContainer) {
    this.applicationModel = applicationModel;

    console.log("Service Created!!!");
  }
}
