import type { SchoolBaseResponseDto } from "./school-base-response.dto";

export interface SchoolWithAddressResponseDto extends SchoolBaseResponseDto {
  address: string;
  logoUrl: string;
  images: string[];
}
