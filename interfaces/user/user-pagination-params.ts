export interface UserPaginationParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  ascending: boolean;
  role?: string;
}
