export interface Address {
  country: string;
  settlement: string;
  postalCode: string;
  street: string;
  schoolId: string;
}

export interface ApplicationResponseDto {
  id: string;
  schoolId: string;
  schoolName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  code: string;
  status: number;
  address: Address;
}
