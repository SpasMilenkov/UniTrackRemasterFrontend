import type { InstitutionType } from '~/enums/institution-type.enum';
import type { AddressDto } from '../application-response.dto';

export interface Institution {
  id: string;
  name: string;
  description?: string;
  type: InstitutionType;
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
