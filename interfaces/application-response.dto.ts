import type { ApplicationStatus } from "~/enums/application-status.enum";
import type { InstitutionType } from "~/enums/institution-type.enum";

export interface AddressDto {
  country: string;
  settlement: string;
  postalCode: string;
  street: string;
  schoolId: string;
}

interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  address: AddressDto;
}

export interface ApplicationResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  code: string;
  status: ApplicationStatus;
  institution: Institution;
}
