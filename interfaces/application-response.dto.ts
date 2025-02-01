
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
  type: number;
  address: AddressDto;
}

export interface ApplicationResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  code: string;
  status: number;
  institution: Institution;
}
