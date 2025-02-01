import type { InstitutionType } from '~/enums/institution-type.enum';

export interface InitSchoolDto {
  id: string;
  name: string;
  description: string;
  motto: string;
  website: string;
  type: InstitutionType;
  programs: string[];
}
