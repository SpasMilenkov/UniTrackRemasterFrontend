import type { UserRoleType } from "~/enums/user-role.enum";

export interface UserDetailsResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
  department?: string;
  isLinked: boolean;
  role?: UserRoleType;
  institutionId?: string;
}
