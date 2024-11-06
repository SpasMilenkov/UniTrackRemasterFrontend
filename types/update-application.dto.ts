export type UpdateSchoolApplicationDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  schoolName: string;
  schoolId: string; // Added this field
  address: {
    country: string;
    settlement: string;
    street: string;
    postalCode: string;
  };
};
