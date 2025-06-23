<template>
  <NModal
    :show="show"
    preset="dialog"
    :title="modalTitle"
    positive-text="Accept Invitation"
    negative-text="Cancel"
    :positive-button-props="{ loading: isLoading, type: 'primary' }"
    :negative-button-props="{ disabled: isLoading }"
    :mask-closable="!isLoading"
    :closable="!isLoading"
    :close-on-esc="!isLoading"
    @update:show="handleShowUpdate"
    @positive-click="handleAccept"
    @negative-click="handleCancel"
    @close="handleClose"
  >
    <div v-if="invitation" class="space-y-6">
      <!-- Confirmation Header -->
      <div class="text-center">
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Icon name="mdi:check-circle" class="w-8 h-8 text-primary" />
        </div>
        <p class="text-lg text-text-primary">
          You're about to accept an invitation to join
          <strong>{{ invitation.institutionName }}</strong>
        </p>
      </div>

      <!-- Role Information -->
      <div class="bg-background-secondary rounded-lg p-4 space-y-3">
        <h4 class="font-semibold text-text-primary mb-3">Role Details</h4>

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

        <div v-if="invitation.gradeName" class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-text-secondary"
              >Grade/Class</label
            >
            <p class="text-text-primary">{{ invitation.gradeName }}</p>
          </div>
        </div>

        <div
          v-if="invitation.additionalInfo"
          class="pt-2 border-t border-border"
        >
          <label class="text-sm font-medium text-text-secondary"
            >Additional Information</label
          >
          <p class="text-text-secondary text-sm mt-1">
            {{ invitation.additionalInfo }}
          </p>
        </div>
      </div>

      <!-- Important Notice -->
      <NAlert type="info" closable :show-icon="true">
        <template #icon>
          <Icon name="mdi:information" />
        </template>
        <template #header> What happens next? </template>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>You'll gain access to the institution's systems</li>
          <li>Your account will be linked to this role</li>
          <li>You'll be redirected to your new dashboard</li>
          <li v-if="invitation.type === 'Student'">
            You can access your grades, assignments, and class information
          </li>
          <li v-else-if="invitation.type === 'Teacher'">
            You can manage your classes, students, and course materials
          </li>
          <li v-else-if="invitation.type === 'Admin'">
            You'll have administrative access to manage the institution
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
import { NModal, NAlert } from 'naive-ui';
import type { PendingInvitationDto } from '~/interfaces/invitation';

interface Props {
  show: boolean;
  invitation: PendingInvitationDto | null;
  loading?: boolean;
  error?: string | null;
}

interface Emits {
  'update:show': [value: boolean];
  accept: [invitation: PendingInvitationDto];
  cancel: [];
  clearError: [];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
});

const emit = defineEmits<Emits>();

// Computed properties
const isLoading = computed(() => props.loading);

const modalTitle = computed(() => {
  if (!props.invitation) return 'Accept Invitation';
  return `Accept ${props.invitation.type} Invitation`;
});

// Event handlers
const handleShowUpdate = (value: boolean) => {
  emit('update:show', value);
};

const handleAccept = () => {
  if (props.invitation) {
    emit('accept', props.invitation);
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

// Watch for invitation changes to reset error
watch(
  () => props.invitation,
  () => {
    if (props.error) {
      clearError();
    }
  }
);
</script>

<style scoped>
/* Additional styling if needed */
</style>
