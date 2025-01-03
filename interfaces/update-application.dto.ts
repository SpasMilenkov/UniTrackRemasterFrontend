export interface UpdateSchoolApplicationDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  schoolName: string;
  schoolId: string;
  address: {
    country: string;
    settlement: string;
    street: string;
    postalCode: string;
  };
}
