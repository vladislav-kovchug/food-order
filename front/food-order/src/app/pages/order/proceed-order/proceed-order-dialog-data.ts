import {GroupOrder} from "../../../model/group-order";
import {UserGroup} from "../../../model/user-group";

export interface ProceedOrderDialogData {
  activeOrder: GroupOrder;
  users: UserGroup;
}
