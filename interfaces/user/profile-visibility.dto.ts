import type { ProfileVisibility } from '~/enums/profile-visibility.enum';

export interface UpdatePrivacySettingsDto {
  dataAnalytics?: boolean;
  emailUpdates?: boolean;
  marketingEmails?: boolean;
  profileVisibility?: ProfileVisibility;
}
