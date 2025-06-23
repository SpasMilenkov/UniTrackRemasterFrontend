import type { ProfileVisibility } from "~/enums/profile-visibility.enum";

export interface PrivacySettings {
  dataAnalytics: boolean;
  emailUpdates: boolean;
  marketingEmails: boolean;
  profileVisibility: ProfileVisibility;
}