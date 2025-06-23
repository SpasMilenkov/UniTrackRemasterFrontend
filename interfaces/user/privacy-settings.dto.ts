import type { ProfileVisibility } from '~/enums/profile-visibility.enum';

export interface PrivacySettingsDto {
  dataAnalytics: boolean;
  emailUpdates: boolean;
  marketingEmails: boolean;
  profileVisibility: ProfileVisibility;
}
