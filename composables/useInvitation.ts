import type {
  PendingInvitationDto,
  AcceptInvitationDto,
  DeclineInvitationDto,
  AcceptInvitationResponseDto,
  InstitutionInvitationDto,
  ResendInvitationDto,
  CancelInvitationDto,
  InvitationStatisticsDto,
  NotificationBadgeData,
  InvitationFilters,
} from '~/interfaces/invitation';

export const useInvitationApi = () => {
  const { $apiFetch } = useNuxtApp();

  // User endpoints
  const getPendingInvitations = async (): Promise<PendingInvitationDto[]> => {
    return await $apiFetch<PendingInvitationDto[]>(
      '/profileinvitations/pending'
    );
  };

  const acceptInvitation = async (
    data: AcceptInvitationDto
  ): Promise<AcceptInvitationResponseDto> => {
    return await $apiFetch<AcceptInvitationResponseDto>(
      '/profileinvitations/accept',
      {
        method: 'POST',
        body: data,
      }
    );
  };

  const declineInvitation = async (
    data: DeclineInvitationDto
  ): Promise<void> => {
    return await $apiFetch('/profileinvitations/decline', {
      method: 'POST',
      body: data,
    });
  };

  const getNotificationBadgeData = async (): Promise<NotificationBadgeData> => {
    return await $apiFetch<NotificationBadgeData>(
      '/profileinvitations/has-pending'
    );
  };

  const getPendingCount = async (): Promise<number> => {
    return await $apiFetch<number>('/profileinvitations/pending/count');
  };

  // Admin endpoints
  const getInstitutionInvitations = async (
    institutionId: string,
    filters?: InvitationFilters
  ): Promise<InstitutionInvitationDto[]> => {
    const queryParams = new URLSearchParams();

    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

    const queryString = queryParams.toString();
    const url = `/profileinvitations/institution/${institutionId}${queryString ? `?${queryString}` : ''}`;

    return await $apiFetch<InstitutionInvitationDto[]>(url);
  };

  const resendInvitation = async (data: ResendInvitationDto): Promise<void> => {
    return await $apiFetch('/profileinvitations/resend', {
      method: 'POST',
      body: data,
    });
  };

  const cancelInvitation = async (data: CancelInvitationDto): Promise<void> => {
    return await $apiFetch('/profileinvitations/cancel', {
      method: 'DELETE',
      body: data,
    });
  };

  const getInvitationStatistics = async (
    institutionId: string
  ): Promise<InvitationStatisticsDto> => {
    return await $apiFetch<InvitationStatisticsDto>(
      `/profileinvitations/institution/${institutionId}/statistics`
    );
  };

  // Bulk operations
  const bulkResendInvitations = async (
    invitations: ResendInvitationDto[]
  ): Promise<void> => {
    return await $apiFetch('/profileinvitations/bulk/resend', {
      method: 'POST',
      body: { invitations },
    });
  };

  const bulkCancelInvitations = async (
    invitations: CancelInvitationDto[]
  ): Promise<void> => {
    return await $apiFetch('/profileinvitations/bulk/cancel', {
      method: 'DELETE',
      body: { invitations },
    });
  };

  return {
    // User API
    getPendingInvitations,
    acceptInvitation,
    declineInvitation,
    getNotificationBadgeData,
    getPendingCount,

    // Admin API
    getInstitutionInvitations,
    resendInvitation,
    cancelInvitation,
    getInvitationStatistics,

    // Bulk operations
    bulkResendInvitations,
    bulkCancelInvitations,
  };
};
