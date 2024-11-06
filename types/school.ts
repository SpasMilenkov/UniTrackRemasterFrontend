export enum IntegrationStatus {
  ACTIVE = 'ACTIVE',
  NOT_INTEGRATED = 'NOT_INTEGRATED',
  PENDING_INTEGRATION = 'PENDING_INTEGRATION',
}
export interface SchoolInput {
  name: string;
  integrated: IntegrationStatus;
  images: string[];
  founded: Date;
  type: string;
  description: string;
  programs: string[];
} 