import type { UserRoleType } from "~/enums/user-role.enum";

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isLinked: boolean;
  role?: UserRoleType;
  phone?: string;
  profileImageUrl?: string;
  institutionId?: string;
}
