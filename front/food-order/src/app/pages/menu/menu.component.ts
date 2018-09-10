import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from "firebase";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {MenuItem} from "../../model/menu-item";
import {MenuCategory} from "../../model/menu-category";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {
  @ViewChild('fileUploadInput') fileUploadInput: ElementRef;
  @ViewChild('divdiv') divdiv: ElementRef;

  activeUser: User;
  menu: MenuCategory[] = [];
  displayedColumns: string[] = ['name', 'weight', 'price'];


  constructor(fireAuth: AngularFireAuth, private fireDb: AngularFireDatabase) {
    fireAuth.authState.subscribe(user => {
      if (user) {
        this.activeUser = user;
        this.readMenu();
      } else {
        this.activeUser = null;
      }
    });

  }

  updateMenu() {
    this.fireDb.database.ref("/menu").set(this.menu);
  }

  private readMenu() {
    this.fireDb.database.ref("/menu").once("value", (snapshot) => {
      let menu = snapshot.val();
      console.log("Menu: ", menu);
      if (menu) {
        this.menu = menu;
      }
    });
  }

  private handleFileUploaded(content: string) {
    console.log(content);
    let categories = this.parseMenuFromCsv(content);

    let menu = [];
    let idCounter = 1;
    Object.keys(categories).forEach(key => {
      let items = categories[key];
      let menuItems = items.map((item) => {
        let weight = parseFloat(item[1].replace(/,/g, ".")) * 1000; // in gramms
        let price = parseFloat(item[2].replace(/-/g, "."));
        return new MenuItem(idCounter++, item[0], weight, price)
      });

      if (menuItems.length) {
        menu.push(new MenuCategory(key, menuItems));
      }
    });
    console.log(menu);
    this.menu = menu;
  }

  private parseMenuFromCsv(content: string) {
    let lines = content.split("\n");

    let categories = {};
    let lastCategory = "";
    lines.forEach((line, index) => {
      if (index < 3) {
        return; // skip first three
      }
      let columns = this.splitScvLine(line);
      console.log(columns);
      if (!columns[0].trim() && !columns[1].trim() && !columns[2].trim()) {
        return; // skip empty lines
      }

      if (columns[0] && !columns[1].trim() && !columns[2].trim()) {
        lastCategory = columns[0];
        categories[lastCategory] = [];
      } else {
        // console.log(columns);
        categories[lastCategory].push(columns);
      }
    });
    return categories;
  }

  private splitScvLine(line: string): string[] {
    let results = [];
    let activeLine = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      let char = line[i];

      if (char === "," && !inQuote) {
        results.push(this.normalizeString(activeLine));
        activeLine = "";
      } else {
        activeLine += char;
      }
      if (char === "\"") {
        inQuote = !inQuote;
      }
    }
    results.push(this.normalizeString(activeLine));
    return results;
  }

  private normalizeString(str: string) {
    let result = str.trim();
    if (result.startsWith("\"") && result.endsWith("\"")) {
      result = result.substr(1, result.length - 2);
    }
    result = result.replace(/""/g, "\"");
    return result;
  }

  ngAfterViewInit(): void {
    let nativeElement: Element = this.fileUploadInput.nativeElement;
    nativeElement.addEventListener("change", (event) => {
      let files = event.target.files;
      if (files.length) {
        let file = files[0];
        let reader = new FileReader();
        reader.onload = () => {
          this.handleFileUploaded(reader.result);
        };
        reader.readAsText(file);
      }
    })
  }

  ngOnInit() {
  }

}
