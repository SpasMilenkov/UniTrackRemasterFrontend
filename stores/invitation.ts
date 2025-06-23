// stores/useInvitationStore.ts
import { defineStore } from 'pinia';
import type {
  PendingInvitationDto,
  AcceptInvitationDto,
  DeclineInvitationDto,
  AcceptInvitationResponseDto,
} from '~/interfaces/invitation';

// Separate UI state interface for better organization
interface InvitationUIState {
  isLoading: boolean;
  error: string | null;
  selectedInvitation: PendingInvitationDto | null;
}

interface ModalStates {
  showAcceptModal: boolean;
  showDeclineModal: boolean;
  showDetailsModal: boolean;
}

export const useInvitationStore = defineStore('invitation', () => {
  // NEVER execute on server side
  if (import.meta.server) {
    return {
      pendingInvitations: readonly(ref([])),
      uiState: readonly(
        ref({
          isLoading: false,
          error: null,
          selectedInvitation: null,
        })
      ),
      modalStates: readonly(
        ref({
          showAcceptModal: false,
          showDeclineModal: false,
          showDetailsModal: false,
        })
      ),
      hasPendingInvitations: computed(() => false),
      pendingCount: computed(() => 0),
      isLoading: computed(() => false),
      isAcceptingInvitation: computed(() => false),
      isDecliningInvitation: computed(() => false),
      // Computed properties for individual modals
      showAcceptModal: computed(() => false),
      showDeclineModal: computed(() => false),
      showDetailsModal: computed(() => false),
      selectedInvitation: computed(() => null),
      // Stub methods for SSR
      fetchPendingInvitations: async () => {},
      acceptInvitation: async () => null,
      declineInvitation: async () => {},
      showAcceptDialog: () => {},
      showDeclineDialog: () => {},
      showDetailsDialog: () => {},
      closeAcceptModal: () => {},
      closeDeclineModal: () => {},
      closeDetailsModal: () => {},
      closeAllModals: () => {},
      setError: () => {},
      clearError: () => {},
    };
  }

  // CLIENT-ONLY implementation
  const queries = useInvitationQueries();

  // Internal state - separate concerns
  const _pendingInvitations = ref<PendingInvitationDto[]>([]);
  const _uiState = ref<InvitationUIState>({
    isLoading: false,
    error: null,
    selectedInvitation: null,
  });
  const _modalStates = ref<ModalStates>({
    showAcceptModal: false,
    showDeclineModal: false,
    showDetailsModal: false,
  });

  // Queries
  const pendingInvitationsQuery = queries.pendingInvitationsQuery();

  // Mutations with refetch callbacks
  const acceptInvitationMutation = queries.acceptInvitationMutation(() => {
    pendingInvitationsQuery.refetch();
  });

  const declineInvitationMutation = queries.declineInvitationMutation(() => {
    pendingInvitationsQuery.refetch();
  });

  // Watch for query data changes
  watch(
    () => pendingInvitationsQuery.data.value,
    (newInvitations) => {
      if (newInvitations) {
        _pendingInvitations.value = newInvitations;
        _uiState.value.error = null;
      }
    },
    { immediate: true }
  );

  // Watch for query errors
  watch(
    () => pendingInvitationsQuery.error.value,
    (error) => {
      if (error) {
        _uiState.value.error = error.message || 'Failed to load invitations';
      }
    }
  );

  // Computed properties for general state
  const hasPendingInvitations = computed(
    () => _pendingInvitations.value.length > 0
  );
  const pendingCount = computed(() => _pendingInvitations.value.length);

  const isLoading = computed(
    () =>
      pendingInvitationsQuery.isLoading.value ||
      acceptInvitationMutation.isLoading.value ||
      declineInvitationMutation.isLoading.value ||
      _uiState.value.isLoading
  );

  const isAcceptingInvitation = computed(
    () => acceptInvitationMutation.isLoading.value
  );
  const isDecliningInvitation = computed(
    () => declineInvitationMutation.isLoading.value
  );

  // Computed properties for individual modals (these are writable)
  const showAcceptModal = computed({
    get: () => _modalStates.value.showAcceptModal,
    set: (value: boolean) => {
      _modalStates.value.showAcceptModal = value;
      if (!value) {
        _uiState.value.selectedInvitation = null;
      }
    },
  });

  const showDeclineModal = computed({
    get: () => _modalStates.value.showDeclineModal,
    set: (value: boolean) => {
      _modalStates.value.showDeclineModal = value;
      if (!value) {
        _uiState.value.selectedInvitation = null;
      }
    },
  });

  const showDetailsModal = computed({
    get: () => _modalStates.value.showDetailsModal,
    set: (value: boolean) => {
      _modalStates.value.showDetailsModal = value;
      if (!value) {
        _uiState.value.selectedInvitation = null;
      }
    },
  });

  const selectedInvitation = computed(() => _uiState.value.selectedInvitation);

  // Actions
  const fetchPendingInvitations = async () => {
    _uiState.value.isLoading = true;
    _uiState.value.error = null;

    try {
      await pendingInvitationsQuery.refetch();
    } catch (error: any) {
      _uiState.value.error = error.message || 'Failed to fetch invitations';
      console.error('Error fetching pending invitations:', error);
    } finally {
      _uiState.value.isLoading = false;
    }
  };

  const acceptInvitation = async (
    invitation: PendingInvitationDto
  ): Promise<AcceptInvitationResponseDto | null> => {
    _uiState.value.error = null;

    try {
      const acceptData: AcceptInvitationDto = {
        profileId: invitation.id,
        profileType: invitation.type,
      };

      const response = await acceptInvitationMutation.mutateAsync(acceptData);

      // Close accept modal on success
      closeAcceptModal();

      // Show success notification
      const message = useMessage();
      message.success(
        `Successfully accepted invitation for ${response.role} role at ${response.institutionName}!`
      );

      return response;
    } catch (error: any) {
      _uiState.value.error = error.message || 'Failed to accept invitation';
      console.error('Error accepting invitation:', error);
      return null;
    }
  };

  const declineInvitation = async (
    invitation: PendingInvitationDto,
    reason?: string
  ) => {
    _uiState.value.error = null;

    try {
      const declineData: DeclineInvitationDto = {
        profileId: invitation.id,
        profileType: invitation.type,
        reason,
      };

      await declineInvitationMutation.mutateAsync(declineData);

      // Close decline modal on success
      closeDeclineModal();

      // Show success notification
      const message = useMessage();
      message.info('Invitation declined successfully');
    } catch (error: any) {
      _uiState.value.error = error.message || 'Failed to decline invitation';
      console.error('Error declining invitation:', error);
    }
  };

  // UI state management - individual modal controls
  const showAcceptDialog = (invitation: PendingInvitationDto) => {
    _uiState.value.selectedInvitation = invitation;
    _modalStates.value.showAcceptModal = true;
  };

  const showDeclineDialog = (invitation: PendingInvitationDto) => {
    _uiState.value.selectedInvitation = invitation;
    _modalStates.value.showDeclineModal = true;
  };

  const showDetailsDialog = (invitation: PendingInvitationDto) => {
    _uiState.value.selectedInvitation = invitation;
    _modalStates.value.showDetailsModal = true;
  };

  // Individual modal close methods
  const closeAcceptModal = () => {
    _modalStates.value.showAcceptModal = false;
    _uiState.value.selectedInvitation = null;
  };

  const closeDeclineModal = () => {
    _modalStates.value.showDeclineModal = false;
    _uiState.value.selectedInvitation = null;
  };

  const closeDetailsModal = () => {
    _modalStates.value.showDetailsModal = false;
    _uiState.value.selectedInvitation = null;
  };

  // Close all modals (for backwards compatibility)
  const closeAllModals = () => {
    _modalStates.value.showAcceptModal = false;
    _modalStates.value.showDeclineModal = false;
    _modalStates.value.showDetailsModal = false;
    _uiState.value.selectedInvitation = null;
  };

  const setError = (error: string) => {
    _uiState.value.error = error;
  };

  const clearError = () => {
    _uiState.value.error = null;
  };

  return {
    // State - readonly for external consumers
    pendingInvitations: readonly(_pendingInvitations),
    uiState: readonly(_uiState),
    modalStates: readonly(_modalStates),

    // Computed getters for general state
    hasPendingInvitations,
    pendingCount,
    isLoading,
    isAcceptingInvitation,
    isDecliningInvitation,

    // Computed properties for individual modals (writable)
    showAcceptModal,
    showDeclineModal,
    showDetailsModal,
    selectedInvitation,

    // Actions
    fetchPendingInvitations,
    acceptInvitation,
    declineInvitation,
    showAcceptDialog,
    showDeclineDialog,
    showDetailsDialog,
    closeAcceptModal,
    closeDeclineModal,
    closeDetailsModal,
    closeAllModals, // backwards compatibility
    setError,
    clearError,

    // Direct access to queries for advanced usage
    pendingInvitationsQuery,
  };
});
