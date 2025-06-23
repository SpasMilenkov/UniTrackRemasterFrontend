<template>
  <NModal
    :show="show"
    preset="dialog"
    :title="modalTitle"
    positive-text="Decline Invitation"
    negative-text="Cancel"
    :positive-button-props="{
      loading: isLoading,
      type: 'error',
      disabled: !isFormValid || isLoading,
    }"
    :negative-button-props="{ disabled: isLoading }"
    :mask-closable="!isLoading"
    :closable="!isLoading"
    :close-on-esc="!isLoading"
    @update:show="handleShowUpdate"
    @positive-click="handleDecline"
    @negative-click="handleCancel"
    @close="handleClose"
  >
    <div v-if="invitation" class="space-y-6">
      <!-- Decline Header -->
      <div class="text-center">
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
        >
          <Icon name="mdi:close-circle" class="w-8 h-8 text-red-600" />
        </div>
        <p class="text-lg text-text-primary">
          You're about to decline the invitation from
          <strong>{{ invitation.institutionName }}</strong>
        </p>
      </div>

      <!-- Role Information -->
      <div class="bg-background-secondary rounded-lg p-4 space-y-3">
        <h4 class="font-semibold text-text-primary mb-3">Invitation Details</h4>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-text-secondary"
              >Position</label
            >
            <p class="text-text-primary">{{ invitation.role }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-text-secondary">Type</label>
            <p class="text-text-primary">{{ invitation.type }}</p>
          </div>
        </div>

        <div v-if="invitation.gradeName">
          <label class="text-sm font-medium text-text-secondary"
            >Grade/Class</label
          >
          <p class="text-text-primary">{{ invitation.gradeName }}</p>
        </div>
      </div>

      <!-- Reason Form -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-primary mb-2">
            Reason for declining (optional)
          </label>
          <NInput
            v-model:value="declineReason"
            type="textarea"
            placeholder="Please let us know why you're declining this invitation..."
            :rows="4"
            :maxlength="500"
            show-count
            :disabled="isLoading"
            clearable
          />
          <p class="text-xs text-text-muted mt-1">
            This information helps improve our invitation process
          </p>
        </div>
      </div>

      <!-- Warning Notice -->
      <NAlert type="warning" :show-icon="true">
        <template #icon>
          <Icon name="mdi:alert" />
        </template>
        <template #header> Please note </template>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>This action cannot be undone</li>
          <li>The institution administrator will be notified</li>
          <li>You may receive another invitation in the future</li>
          <li>
            You can still apply to join this institution through other means
          </li>
        </ul>
      </NAlert>

      <!-- Error Display -->
      <NAlert
        v-if="error"
        type="error"
        closable
        :show-icon="true"
        @close="clearError"
      >
        <template #icon>
          <Icon name="mdi:alert-circle" />
        </template>
        {{ error }}
      </NAlert>
    </div>
  </NModal>
</template>

<script setup lang="ts">
import { NModal, NAlert, NInput } from 'naive-ui';
import type { PendingInvitationDto } from '~/interfaces/invitation';

interface Props {
  show: boolean;
  invitation: PendingInvitationDto | null;
  loading?: boolean;
  error?: string | null;
}

interface Emits {
  'update:show': [value: boolean];
  decline: [invitation: PendingInvitationDto, reason?: string];
  cancel: [];
  clearError: [];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
});

const emit = defineEmits<Emits>();

// Form state
const declineReason = ref('');

// Computed properties
const isLoading = computed(() => props.loading);

const modalTitle = computed(() => {
  if (!props.invitation) return 'Decline Invitation';
  return `Decline ${props.invitation.type} Invitation`;
});

const isFormValid = computed(() => {
  // Reason is optional, so form is always valid
  // Could add validation rules here if needed
  return true;
});

// Event handlers
const handleShowUpdate = (value: boolean) => {
  emit('update:show', value);
  if (!value) {
    // Reset form when modal closes
    declineReason.value = '';
  }
};

const handleDecline = () => {
  if (props.invitation) {
    const reason = declineReason.value.trim() || undefined;
    emit('decline', props.invitation, reason);
  }
};

const handleCancel = () => {
  emit('cancel');
};

const handleClose = () => {
  emit('update:show', false);
};

const clearError = () => {
  emit('clearError');
};

// Watch for invitation changes to reset form and error
watch(
  () => props.invitation,
  () => {
    declineReason.value = '';
    if (props.error) {
      clearError();
    }
  }
);

// Watch for show prop changes to reset form
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      declineReason.value = '';
    }
  }
);
</script>

<style scoped>
/* Additional styling if needed */
</style>