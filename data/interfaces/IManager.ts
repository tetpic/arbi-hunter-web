import { HirerRole, HirerRolePermission } from "types/enums";
import { IUser, IUserProfile } from "./IUser";

export interface IManagerCreate {
  hirerRole: HirerRole,
  firstName : string,
  lastName : string,
  position: string,
  password?: string,
  email: string,
  phone: string,
  permissions?: HirerRolePermission[]
}

export interface IManager extends IUserProfile {
  owner?: IUserProfile
  user?: IUser,
}