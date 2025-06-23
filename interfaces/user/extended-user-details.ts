import type { UserRoleType } from "~/enums/user-role.enum";
import type { UserDetails } from "./user-details";

export interface ExtendedUserDetails extends UserDetails {
  institutionRoles: Map<string, UserRoleType[]>;
  currentRole?: UserRoleType | null;
}
