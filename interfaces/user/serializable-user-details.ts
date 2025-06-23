import type { UserRoleType } from "~/enums/user-role.enum";

// Serializable version of ExtendedUserDetails for localStorage
export interface SerializableUserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImageUrl?: string;
  isLinked: boolean;
  role: UserRoleType;
  institutionId?: string;
  institutionRoles: Record<string, UserRoleType[]>; // Map serialized as object
  currentRole?: UserRoleType | null;
}
