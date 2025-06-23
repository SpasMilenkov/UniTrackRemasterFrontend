// composables/useInvitationQueries.ts
import { useQuery, useMutation } from '@pinia/colada';
import type {
  AcceptInvitationDto,
  DeclineInvitationDto,
  ResendInvitationDto,
  CancelInvitationDto,
  InvitationFilters,
} from '~/interfaces/invitation';

export const useInvitationQueries = () => {
  const api = useInvitationApi();

  // User queries
  const pendingInvitationsQuery = () => {
    return useQuery({
      key: () => ['invitations', 'pending'],
      query: () => api.getPendingInvitations(),
      enabled: () => import.meta.client, // Only run on client
      staleTime: 2 * 60 * 1000, // 2 minutes - invitations can change
    });
  };

  const notificationBadgeQuery = () => {
    return useQuery({
      key: () => ['invitations', 'notification-badge'],
      query: () => api.getNotificationBadgeData(),
      enabled: () => import.meta.client,
      staleTime: 1 * 60 * 1000, // 1 minute for real-time feel
    });
  };

  const pendingCountQuery = () => {
    return useQuery({
      key: () => ['invitations', 'pending-count'],
      query: () => api.getPendingCount(),
      enabled: () => import.meta.client,
      staleTime: 1 * 60 * 1000,
    });
  };

  // Admin queries
  const institutionInvitationsQuery = (
    institutionId: MaybeRef<string | null>,
    filters: MaybeRef<InvitationFilters | null> = ref(null)
  ) => {
    return useQuery({
      key: () => [
        'invitations',
        'institution',
        unref(institutionId) || '',
        JSON.stringify(unref(filters) || {}),
      ],
      query: () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');
        return api.getInstitutionInvitations(
          instId,
          unref(filters) || undefined
        );
      },
      enabled: () => !!unref(institutionId),
      staleTime: 3 * 60 * 1000, // 3 minutes
    });
  };

  const invitationStatisticsQuery = (
    institutionId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => ['invitations', 'statistics', unref(institutionId) || ''],
      query: () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');
        return api.getInvitationStatistics(instId);
      },
      enabled: () => !!unref(institutionId),
      staleTime: 5 * 60 * 1000, // 5 minutes for statistics
    });
  };

  // User mutations
  const acceptInvitationMutation = (onSuccessCallback?: () => void) => {
    return useMutation({
      mutation: (data: AcceptInvitationDto) => api.acceptInvitation(data),
      onSuccess: () => {
        // Call the callback to refetch related queries
        onSuccessCallback?.();
      },
      onError: (error) => {
        console.error('Error accepting invitation:', error);
      },
    });
  };

  const declineInvitationMutation = (onSuccessCallback?: () => void) => {
    return useMutation({
      mutation: (data: DeclineInvitationDto) => api.declineInvitation(data),
      onSuccess: () => {
        // Call the callback to refetch related queries
        onSuccessCallback?.();
      },
      onError: (error) => {
        console.error('Error declining invitation:', error);
      },
    });
  };

  // Admin mutations
  const resendInvitationMutation = (onSuccessCallback?: () => void) => {
    return useMutation({
      mutation: (data: ResendInvitationDto) => api.resendInvitation(data),
      onSuccess: () => {
        // Call the callback to refetch related queries
        onSuccessCallback?.();
      },
      onError: (error) => {
        console.error('Error resending invitation:', error);
      },
    });
  };

  const cancelInvitationMutation = (onSuccessCallback?: () => void) => {
    return useMutation({
      mutation: (data: CancelInvitationDto) => api.cancelInvitation(data),
      onSuccess: () => {
        // Call the callback to refetch related queries
        onSuccessCallback?.();
      },
      onError: (error) => {
        console.error('Error canceling invitation:', error);
      },
    });
  };

  const bulkResendInvitationsMutation = (onSuccessCallback?: () => void) => {
    return useMutation({
      mutation: (invitations: ResendInvitationDto[]) =>
        api.bulkResendInvitations(invitations),
      onSuccess: () => {
        // Call the callback to refetch related queries
        onSuccessCallback?.();
      },
      onError: (error) => {
        console.error('Error bulk resending invitations:', error);
      },
    });
  };

  const bulkCancelInvitationsMutation = (onSuccessCallback?: () => void) => {
    return useMutation({
      mutation: (invitations: CancelInvitationDto[]) =>
        api.bulkCancelInvitations(invitations),
      onSuccess: () => {
        // Call the callback to refetch related queries
        onSuccessCallback?.();
      },
      onError: (error) => {
        console.error('Error bulk canceling invitations:', error);
      },
    });
  };

  return {
    // User queries
    pendingInvitationsQuery,
    notificationBadgeQuery,
    pendingCountQuery,

    // Admin queries
    institutionInvitationsQuery,
    invitationStatisticsQuery,

    // User mutations
    acceptInvitationMutation,
    declineInvitationMutation,

    // Admin mutations
    resendInvitationMutation,
    cancelInvitationMutation,
    bulkResendInvitationsMutation,
    bulkCancelInvitationsMutation,
  };
};
