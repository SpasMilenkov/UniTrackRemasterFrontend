import type { AddressDto } from '../application-response.dto';

export interface Institution {
  id: string;
  name: string;
  description?: string;
  type: string;
  location: string;
  accreditations: string[];
  address: AddressDto;
  images: string[];
  establishedDate: string;
  website?: string;
  phoneNumber: string;
  email: string;
  motto?: string;
}
