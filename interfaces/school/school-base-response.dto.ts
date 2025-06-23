export interface SchoolBaseResponseDto {
  id: string;
  name: string;
  motto?: string;
  description?: string;
  type: string;
  establishedDate: string | Date;
  programs?: string[];
  email: string;
  phone: string;
}
