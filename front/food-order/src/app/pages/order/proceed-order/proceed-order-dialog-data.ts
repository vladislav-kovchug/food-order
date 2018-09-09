import {Order} from "../../../model/order";
import {UserData} from "../../../model/user-data";

export interface ProceedOrderDialogData {
  activeOrder: { [userId: string]: Order };
  users: { [userId: string]: UserData };
}
