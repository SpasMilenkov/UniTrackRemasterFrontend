// stores/useNotificationStore.ts
import { defineStore } from 'pinia';
import type { NotificationBadgeData } from '~/interfaces/invitation';

export const useNotificationStore = defineStore('notification', () => {
  // NEVER execute on server side
  if (import.meta.server) {
    return {
      invitationBadge: readonly(ref({ hasPending: false, count: 0 })),
      hasPendingInvitations: computed(() => false),
      pendingInvitationsCount: computed(() => 0),
      isLoading: computed(() => false),
      // Stub methods for SSR
      checkInvitationNotifications: async () => {},
      startPolling: () => {},
      stopPolling: () => {},
      clearInvitationBadge: () => {},
    };
  }

  // CLIENT-ONLY implementation
  const queries = useInvitationQueries();

  // Internal state - not readonly
  const _invitationBadge = ref<NotificationBadgeData>({
    hasPending: false,
    count: 0,
  });
  const _pollingInterval = ref<number | null>(null);

  // Query for notification badge data
  const notificationBadgeQuery = queries.notificationBadgeQuery();

  // Watch for query data changes
  watch(
    () => notificationBadgeQuery.data.value,
    (newBadgeData) => {
      if (newBadgeData) {
        _invitationBadge.value = newBadgeData;
      }
    },
    { immediate: true }
  );

  // Computed properties
  const hasPendingInvitations = computed(
    () => _invitationBadge.value.hasPending
  );
  const pendingInvitationsCount = computed(() => _invitationBadge.value.count);
  const isLoading = computed(() => notificationBadgeQuery.isLoading.value);

  // Actions
  const checkInvitationNotifications = async () => {
    try {
      await notificationBadgeQuery.refetch();
    } catch (error) {
      console.error('Error checking invitation notifications:', error);
    }
  };

  const startPolling = (intervalMs: number = 60000) => {
    // Default 1 minute
    if (_pollingInterval.value) {
      clearInterval(_pollingInterval.value);
    }

    _pollingInterval.value = setInterval(() => {
      checkInvitationNotifications();
    }, intervalMs) as unknown as number;
  };

  const stopPolling = () => {
    if (_pollingInterval.value) {
      clearInterval(_pollingInterval.value);
      _pollingInterval.value = null;
    }
  };

  const clearInvitationBadge = () => {
    _invitationBadge.value = { hasPending: false, count: 0 };
  };

  // Auto-start polling when store is created on client
  if (import.meta.client) {
    // Wait for initial load, then start polling
    nextTick(() => {
      setTimeout(() => {
        checkInvitationNotifications();
        startPolling(60000); // Poll every minute
      }, 2000); // Wait 2 seconds after page load
    });

    // Cleanup polling on unmount
    onBeforeUnmount(() => {
      stopPolling();
    });
  }

  return {
    // State - readonly for external consumers
    invitationBadge: readonly(_invitationBadge),

    // Computed getters
    hasPendingInvitations,
    pendingInvitationsCount,
    isLoading,

    // Actions
    checkInvitationNotifications,
    startPolling,
    stopPolling,
    clearInvitationBadge,

    // Direct access to query for advanced usage
    notificationBadgeQuery,
  };
});
