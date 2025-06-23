<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-background-card border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gradient">
              Profile Invitations
            </h1>
            <p class="mt-2 text-text-secondary">
              Manage your pending invitations from institutions
            </p>
          </div>

          <div class="flex items-center gap-4">
            <NButton
              type="tertiary"
              :loading="invitationStore.isLoading"
              @click="refreshInvitations"
            >
              <template #icon>
                <Icon name="mdi:refresh" />
              </template>
              Refresh
            </NButton>

            <NotificationBadge
              :count="invitationStore.pendingCount"
              color="primary"
              show-pulse
            >
              <Icon
                name="mdi:bell"
                class="w-6 h-6 text-text-secondary hover:text-text-primary transition-colors"
              />
            </NotificationBadge>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div
        v-if="invitationStore.isLoading && !invitations.length"
        class="text-center py-12"
      >
        <NSpin size="large" />
        <p class="mt-4 text-text-secondary">Loading your invitations...</p>
      </div>

      <!-- Error State -->
      <NAlert
        v-else-if="invitationStore.uiState.error"
        type="error"
        closable
        class="mb-6"
        @close="invitationStore.clearError"
      >
        <template #icon>
          <Icon name="mdi:alert-circle" />
        </template>
        <template #header> Error Loading Invitations </template>
        {{ invitationStore.uiState.error }}
      </NAlert>

      <!-- Empty State -->
      <div v-else-if="!invitations.length" class="text-center py-16">
        <div
          class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        >
          <Icon name="mdi:email-outline" class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-text-primary mb-2">
          No Pending Invitations
        </h3>
        <p class="text-text-secondary max-w-md mx-auto">
          You don't have any pending invitations at the moment. Check back later
          or contact your institution administrator.
        </p>
        <NButton type="primary" class="mt-6" @click="refreshInvitations">
          <template #icon>
            <Icon name="mdi:refresh" />
          </template>
          Check Again
        </NButton>
      </div>

      <!-- Invitations Grid -->
      <div v-else class="space-y-6">
        <!-- Stats Header -->
        <div class="bg-background-card rounded-lg p-6 border border-border">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary">
                {{ invitations.length }}
              </div>
              <div class="text-sm text-text-secondary">Total Invitations</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-amber-500">
                {{ pendingInvitations.length }}
              </div>
              <div class="text-sm text-text-secondary">Pending Response</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-text-primary">
                {{ getUniqueInstitutions.length }}
              </div>
              <div class="text-sm text-text-secondary">Institutions</div>
            </div>
          </div>
        </div>

        <!-- Invitations List -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InvitationCard
            v-for="invitation in invitations"
            :key="invitation.id"
            :invitation="invitation"
            :accept-loading="
              isAcceptingInvitation && selectedInvitation?.id === invitation.id
            "
            :decline-loading="
              isDecliningInvitation && selectedInvitation?.id === invitation.id
            "
            @accept="handleAcceptClick"
            @decline="handleDeclineClick"
            @view-details="handleViewDetails"
            @card-click="handleCardClick"
          />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AcceptModal
      v-model:show="invitationStore.showAcceptModal"
      :invitation="invitationStore.selectedInvitation"
      :loading="invitationStore.isAcceptingInvitation"
      :error="invitationStore.uiState.error"
      @accept="handleAcceptInvitation"
      @cancel="invitationStore.closeAcceptModal"
      @clear-error="invitationStore.clearError"
    />

    <DeclineModal
      v-model:show="invitationStore.showDeclineModal"
      :invitation="invitationStore.selectedInvitation"
      :loading="invitationStore.isDecliningInvitation"
      :error="invitationStore.uiState.error"
      @decline="handleDeclineInvitation"
      @cancel="invitationStore.closeDeclineModal"
      @clear-error="invitationStore.clearError"
    />

    <InvitationDetailsModal
      v-model:show="invitationStore.showDetailsModal"
      :invitation="invitationStore.selectedInvitation"
      @accept="handleAcceptClick"
      @decline="handleDeclineClick"
    />
  </div>
</template>

<script setup lang="ts">
import { NSpin, NAlert, NButton } from 'naive-ui';
import type { PendingInvitationDto } from '~/interfaces/invitation';
import { ProfileStatus } from '~/interfaces/invitation';
import DeclineModal from '~/components/user/invitations/DeclineModal.vue';
import AcceptModal from '~/components/user/invitations/AcceptModal.vue';
import InvitationDetailsModal from '~/components/user/invitations/DetailsModal.vue';
import InvitationCard from '~/components/user/invitations/InvitationCard.vue';

// Store composables
const invitationStore = useInvitationStore();
const authStore = useAuthStore();
const router = useRouter();

// Page metadata
definePageMeta({
  title: 'Profile Invitations',
  requiresAuth: true,
  layout: 'dashboard-layout',
});

useSeoMeta({
  title: 'Profile Invitations',
  description: 'Manage your pending profile invitations from institutions',
});

// Computed properties
const invitations = computed(() => invitationStore.pendingInvitations);
const isAcceptingInvitation = computed(
  () => invitationStore.isAcceptingInvitation
);
const isDecliningInvitation = computed(
  () => invitationStore.isDecliningInvitation
);
const selectedInvitation = computed(() => invitationStore.selectedInvitation);

const pendingInvitations = computed(() =>
  invitations.value.filter((inv) => inv.status === ProfileStatus.Pending)
);

const getUniqueInstitutions = computed(() => {
  const institutions = new Set(
    invitations.value.map((inv) => inv.institutionId)
  );
  return Array.from(institutions);
});

// Event handlers
const refreshInvitations = async () => {
  await invitationStore.fetchPendingInvitations();
};

const handleAcceptClick = (invitation: PendingInvitationDto) => {
  invitationStore.showAcceptDialog(invitation);
};

const handleDeclineClick = (invitation: PendingInvitationDto) => {
  invitationStore.showDeclineDialog(invitation);
};

const handleViewDetails = (invitation: PendingInvitationDto) => {
  invitationStore.showDetailsDialog(invitation);
};

const handleCardClick = (invitation: PendingInvitationDto) => {
  handleViewDetails(invitation);
};

const handleAcceptInvitation = async (invitation: PendingInvitationDto) => {
  const response = await invitationStore.acceptInvitation(invitation);

  if (response) {
    // Navigate to dashboard after successful acceptance
    const message = useMessage();
    message.success('Redirecting to your dashboard...');

    // Wait a bit for the success message, then redirect
    setTimeout(() => {
      const userRole = authStore.user?.role;
      if (userRole === 'SuperAdmin') {
        router.push('/super-admins/dashboard');
      } else {
        router.push('/users/dashboard');
      }
    }, 2000);
  }
};

const handleDeclineInvitation = async (
  invitation: PendingInvitationDto,
  reason?: string
) => {
  await invitationStore.declineInvitation(invitation, reason);
};

// Initialize data on mount
onMounted(async () => {
  // Only fetch if we don't have data yet
  if (!invitations.value.length && !invitationStore.isLoading) {
    await refreshInvitations();
  }
});

// Auto-refresh every 5 minutes
const refreshInterval = ref<number | null>(null);

onMounted(() => {
  refreshInterval.value = setInterval(
    () => {
      refreshInvitations();
    },
    5 * 60 * 1000
  ) as unknown as number;
});

onBeforeUnmount(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});
</script>

<style scoped>
.text-gradient {
  background-image: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}
</style>
