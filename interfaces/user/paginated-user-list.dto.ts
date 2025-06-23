import type { UserDetailsResponse } from "./user-response.dto";

export interface PaginatedUserListDto {
  users: UserDetailsResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
