import type { AccreditationType } from '~/enums/accreditation-type.enum';
import type { InstitutionType } from '~/enums/institution-type.enum';
import type { LocationType } from '~/enums/location-type.enum';
import type { AddressDto } from '../application-response.dto';
import type { IntegrationStatus } from '~/enums/integration-status.enum';

export interface InstitutionResponseDto {
  id: string;
  name: string;
  description?: string;
  type: InstitutionType;
  location: LocationType;
  accreditationTypes: AccreditationType[];
  address: AddressDto;
  images?: string[];
  logoUrl: string;
  establishedDate: string;
  website?: string;
  email: string;
  phone: string;
  motto?: string;
  integrationStatus: IntegrationStatus;
}
