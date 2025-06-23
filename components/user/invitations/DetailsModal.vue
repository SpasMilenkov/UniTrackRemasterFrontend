<template>
  <NModal
    :show="show"
    preset="card"
    :title="modalTitle"
    size="medium"
    :mask-closable="true"
    :closable="true"
    class="w-full max-w-2xl"
    @update:show="handleShowUpdate"
    @close="handleClose"
  >
    <div v-if="invitation" class="space-y-6">
      <!-- Header with Icon and Status -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div :class="iconClasses">
            <Icon :name="typeIcon" class="w-8 h-8" />
          </div>
          <div>
            <h3 class="text-xl font-semibold text-text-primary">
              {{ invitation.role }}
            </h3>
            <p class="text-text-secondary">{{ t('invitationDetailsModal.header.positionType', { type: invitation.type }) }}</p>
          </div>
        </div>
        <ProfileStatusBadge :status="invitation.status" size="medium" />
      </div>

      <!-- Institution Information -->
      <div class="bg-background-secondary rounded-lg p-6">
        <h4
          class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"
        >
          <Icon name="mdi:school" class="w-5 h-5" />
          {{ t('invitationDetailsModal.sections.institutionDetails') }}
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">
              {{ t('invitationDetailsModal.labels.institutionName') }}
            </label>
            <p class="text-text-primary font-medium">
              {{ invitation.institutionName }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">
              {{ t('invitationDetailsModal.labels.institutionId') }}
            </label>
            <p class="text-text-muted font-mono text-sm">
              {{ invitation.institutionId }}
            </p>
          </div>
        </div>
      </div>

      <!-- Role Specific Information -->
      <div class="bg-background-secondary rounded-lg p-6">
        <h4
          class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"
        >
          <Icon :name="typeIcon" class="w-5 h-5" />
          {{ t('invitationDetailsModal.sections.roleInformation') }}
        </h4>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">
                {{ t('invitationDetailsModal.labels.positionTitle') }}
              </label>
              <p class="text-text-primary">
                {{ invitation.role }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">
                {{ t('invitationDetailsModal.labels.profileType') }}
              </label>
              <p class="text-text-primary">
                {{ invitation.type }}
              </p>
            </div>
          </div>

          <div
            v-if="invitation.gradeName"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">
                {{ t('invitationDetailsModal.labels.gradeClassAssignment') }}
              </label>
              <p class="text-text-primary">
                {{ invitation.gradeName }}
              </p>
            </div>
          </div>

          <div
            v-if="invitation.additionalInfo"
            class="pt-4 border-t border-border"
          >
            <label class="block text-sm font-medium text-text-secondary mb-2">
              {{ t('invitationDetailsModal.labels.additionalInformation') }}
            </label>
            <div class="bg-background rounded-lg p-4">
              <p class="text-text-secondary text-sm whitespace-pre-wrap">
                {{ invitation.additionalInfo }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Information -->
      <div class="bg-background-secondary rounded-lg p-6">
        <h4
          class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"
        >
          <Icon name="mdi:timeline" class="w-5 h-5" />
          {{ t('invitationDetailsModal.sections.timeline') }}
        </h4>

        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
            >
              <Icon name="mdi:email-send" class="w-4 h-4 text-primary" />
            </div>
            <div>
              <p class="text-text-primary font-medium">{{ t('invitationDetailsModal.timeline.invitationSent') }}</p>
              <p class="text-text-secondary text-sm">
                {{ formatDateTime(invitation.invitedAt) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center',
                invitation.status === ProfileStatus.Pending
                  ? 'bg-amber-100 dark:bg-amber-900/30'
                  : 'bg-gray-100 dark:bg-gray-800',
              ]"
            >
              <Icon
                name="mdi:clock"
                :class="[
                  'w-4 h-4',
                  invitation.status === ProfileStatus.Pending
                    ? 'text-amber-600'
                    : 'text-gray-500',
                ]"
              />
            </div>
            <div>
              <p class="text-text-primary font-medium">{{ t('invitationDetailsModal.timeline.currentStatus') }}</p>
              <p class="text-text-secondary text-sm">
                {{ invitation.status }} -
                {{ getStatusDescription(invitation.status) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div
        v-if="invitation.status === ProfileStatus.Pending"
        class="bg-primary/5 border border-primary/20 rounded-lg p-6"
      >
        <h4
          class="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2"
        >
          <Icon name="mdi:lightbulb" class="w-5 h-5 text-primary" />
          {{ t('invitationDetailsModal.sections.nextSteps') }}
        </h4>

        <div class="space-y-2 text-sm text-text-secondary">
          <p>• {{ t('invitationDetailsModal.nextSteps.reviewDetails') }}</p>
          <p>• {{ t('invitationDetailsModal.nextSteps.acceptInvitation') }}</p>
          <p>• {{ t('invitationDetailsModal.nextSteps.contactInstitution') }}</p>
          <p>• {{ t('invitationDetailsModal.nextSteps.declineWarning') }}</p>
        </div>
      </div>
    </div>

    <template #action>
      <div class="flex justify-end gap-3">
        <NButton size="medium" @click="handleClose">{{ t('invitationDetailsModal.buttons.close') }}</NButton>

        <NButton
          v-if="invitation?.status === ProfileStatus.Pending"
          type="error"
          size="medium"
          @click="handleDecline"
        >
          <template #icon>
            <Icon name="mdi:close" />
          </template>
          {{ t('invitationDetailsModal.buttons.decline') }}
        </NButton>

        <NButton
          v-if="invitation?.status === ProfileStatus.Pending"
          type="primary"
          size="medium"
          @click="handleAccept"
        >
          <template #icon>
            <Icon name="mdi:check" />
          </template>
          {{ t('invitationDetailsModal.buttons.accept') }}
        </NButton>
      </div>
    </template>
  </NModal>
</template>

<script setup lang="ts">
import { NModal, NButton } from 'naive-ui';
import type { PendingInvitationDto } from '~/interfaces/invitation';
import { ProfileStatus } from '~/interfaces/invitation';
import ProfileStatusBadge from './ProfileStatusBadge.vue';

const { t, locale } = useI18n();

interface Props {
  show: boolean;
  invitation: PendingInvitationDto | null;
}

interface Emits {
  'update:show': [value: boolean];
  accept: [invitation: PendingInvitationDto];
  decline: [invitation: PendingInvitationDto];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const typeIcons = {
  Student: 'mdi:account-school',
  Teacher: 'mdi:account-tie',
  Admin: 'mdi:account-supervisor',
};

const modalTitle = computed(() => {
  if (!props.invitation) return t('invitationDetailsModal.titles.default');
  return t('invitationDetailsModal.titles.withType', { type: props.invitation.type });
});

const typeIcon = computed(() => {
  if (!props.invitation) return 'mdi:account';
  return typeIcons[props.invitation.type] || 'mdi:account';
});

const iconClasses = computed(() => {
  if (!props.invitation) return [];

  const baseClasses = [
    'w-16 h-16 rounded-full flex items-center justify-center',
  ];

  const colorClasses = {
    Student: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    Teacher: 'bg-green-100 dark:bg-green-900/30 text-green-600',
    Admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
  };

  return [
    ...baseClasses,
    colorClasses[props.invitation.type] ||
      'bg-gray-100 dark:bg-gray-800 text-gray-600',
  ];
});

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const localeString = locale.value === 'bg' ? 'bg-BG' : 'en-US';
  
  return date.toLocaleString(localeString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusDescription = (status: ProfileStatus) => {
  const statusKey = `invitationDetailsModal.statusDescriptions.${status.toLowerCase()}`;
  return t(statusKey);
};

const handleShowUpdate = (value: boolean) => {
  emit('update:show', value);
};

const handleClose = () => {
  emit('update:show', false);
};

const handleAccept = () => {
  if (props.invitation) {
    emit('accept', props.invitation);
  }
};

const handleDecline = () => {
  if (props.invitation) {
    emit('decline', props.invitation);
  }
};
</script>

<style scoped>
</style>
