// types/invitation.ts
export enum ProfileStatus {
  Pending = 'Pending',
  Active = 'Active',
  Rejected = 'Rejected',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
}
export interface PendingInvitationDto {
  id: string;
  type: 'Student' | 'Teacher' | 'Admin';
  institutionId: string;
  institutionName: string;
  role: string;
  gradeName?: string;
  additionalInfo?: string;
  invitedAt: string;
  status: ProfileStatus;
}
export interface AcceptInvitationDto {
  profileId: string;
  profileType: 'Student' | 'Teacher' | 'Admin';
}
export interface DeclineInvitationDto {
  profileId: string;
  profileType: 'Student' | 'Teacher' | 'Admin';
  reason?: string;
}
export interface AcceptInvitationResponseDto {
  profileType: string;
  institutionName: string;
  role: string;
  acceptedAt: string;
}
export interface InstitutionInvitationDto {
  id: string;
  type: 'Student' | 'Teacher' | 'Admin';
  userName: string;
  email: string;
  role: string;
  status: ProfileStatus;
  invitedAt: string;
  acceptedAt?: string;
}
export interface ResendInvitationDto {
  profileId: string;
  profileType: 'Student' | 'Teacher' | 'Admin';
}
export interface CancelInvitationDto {
  profileId: string;
  profileType: 'Student' | 'Teacher' | 'Admin';
}
export interface InvitationStatisticsDto {
  totalInvitations: number;
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
  inactiveCount: number;
  acceptanceRate: number;
  invitationsByType: Record<string, number>;
  recentInvitations: InstitutionInvitationDto[];
}
// Updated existing DTOs to include status
export interface StudentResponseDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isSchoolStudent: boolean;
  isUniversityStudent: boolean;
  schoolId?: string;
  schoolName?: string;
  universityId?: string;
  universityName?: string;
  gradeId: string;
  gradeName: string;
  markCount?: number;
  attendanceCount?: number;
  clubMembershipsCount?: number;
  electivesCount?: number;
  status: ProfileStatus; // Added
  createdAt: string;
  updatedAt: string;
}
export interface TeacherResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  institutionId: string;
  classGradeId?: string;
  status: ProfileStatus; // Added
}
export interface AdminDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department?: string;
  startDate: string;
  role: string;
  adminStatus: string;
  notes?: string;
  institutionId: string;
  institutionName: string;
  profileStatus: ProfileStatus; // Added
}
// Notification types
export interface NotificationBadgeData {
  hasPending: boolean;
  count: number;
}
// Filter types for admin dashboard
export interface InvitationFilters {
  status?: ProfileStatus;
  type?: 'Student' | 'Teacher' | 'Admin';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
// UI State types
export interface InvitationUIState {
  isLoading: boolean;
  error: string | null;
  selectedInvitation: PendingInvitationDto | null;
  showAcceptModal: boolean;
  showDeclineModal: boolean;
  showDetailsModal: boolean;
}
export interface AdminDashboardUIState {
  isLoading: boolean;
  error: string | null;
  filters: InvitationFilters;
  selectedInvitations: string[];
  showBulkActions: boolean;
  showStatistics: boolean;
}
