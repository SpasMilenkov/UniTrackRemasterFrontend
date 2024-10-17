export interface AdminActionCard {
  title: string;
  description: string;
  icon: string;
  primaryButtonContent: string;
  hasSecondary: boolean;
  secondaryButtonButtonContent?: string;
  url?: string;
}
