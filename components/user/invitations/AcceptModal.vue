<template>
  <NModal
    :show="show"
    preset="dialog"
    :title="modalTitle"
    :positive-text="t('invitationModal.buttons.accept')"
    :negative-text="t('invitationModal.buttons.cancel')"
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
          {{
            t('invitationModal.confirmationText', {
              institutionName: invitation.institutionName,
            })
          }}
        </p>
      </div>

      <!-- Role Information -->
      <div class="bg-background-secondary rounded-lg p-4 space-y-3">
        <h4 class="font-semibold text-text-primary mb-3">
          {{ t('invitationModal.roleDetails.title') }}
        </h4>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-text-secondary">{{
              t('invitationModal.roleDetails.position')
            }}</label>
            <p class="text-text-primary">{{ invitation.role }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-text-secondary">{{
              t('invitationModal.roleDetails.type')
            }}</label>
            <p class="text-text-primary">{{ invitation.type }}</p>
          </div>
        </div>

        <div v-if="invitation.gradeName" class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-text-secondary">{{
              t('invitationModal.roleDetails.gradeClass')
            }}</label>
            <p class="text-text-primary">{{ invitation.gradeName }}</p>
          </div>
        </div>

        <div
          v-if="invitation.additionalInfo"
          class="pt-2 border-t border-border"
        >
          <label class="text-sm font-medium text-text-secondary">{{
            t('invitationModal.roleDetails.additionalInfo')
          }}</label>
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
        <template #header>{{ t('invitationModal.notice.title') }}</template>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>{{ t('invitationModal.notice.general.systemAccess') }}</li>
          <li>{{ t('invitationModal.notice.general.accountLinked') }}</li>
          <li>{{ t('invitationModal.notice.general.redirectDashboard') }}</li>
          <li v-if="invitation.type === 'Student'">
            {{ t('invitationModal.notice.student.access') }}
          </li>
          <li v-else-if="invitation.type === 'Teacher'">
            {{ t('invitationModal.notice.teacher.access') }}
          </li>
          <li v-else-if="invitation.type === 'Admin'">
            {{ t('invitationModal.notice.admin.access') }}
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

const { t } = useI18n();

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

const isLoading = computed(() => props.loading);

const modalTitle = computed(() => {
  if (!props.invitation) return t('invitationModal.titles.default');
  return t('invitationModal.titles.withType', { type: props.invitation.type });
});

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

watch(
  () => props.invitation,
  () => {
    if (props.error) {
      clearError();
    }
  }
);
</script>

<style scoped></style>
