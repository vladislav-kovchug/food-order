import {MenuItem} from "./menu-item";

export class MenuCategory {
  name: string;
  items: MenuItem[];


  constructor(name: string, items: MenuItem[]) {
    this.name = name;
    this.items = items;
  }
}
