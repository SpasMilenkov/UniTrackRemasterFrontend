<template>
  <NCard :class="cardClasses" hoverable @click="handleCardClick">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div :class="iconClasses">
            <Icon :name="typeIcon" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-text-primary">
              {{ invitation.role }}
            </h3>
            <p class="text-sm text-text-secondary">
              {{ invitation.type }} Role
            </p>
          </div>
        </div>
        <ProfileStatusBadge :status="invitation.status" size="small" />
      </div>
    </template>

    <div class="space-y-4">
      <!-- Institution Info -->
      <div class="bg-background-secondary rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="mdi:school" class="w-5 h-5 text-text-secondary" />
          <span class="font-medium text-text-primary">Institution</span>
        </div>
        <p class="text-text-primary">{{ invitation.institutionName }}</p>
      </div>

      <!-- Grade Info (for Students) -->
      <div
        v-if="invitation.gradeName"
        class="bg-background-secondary rounded-lg p-4"
      >
        <div class="flex items-center gap-2 mb-2">
          <Icon name="mdi:bookmark" class="w-5 h-5 text-text-secondary" />
          <span class="font-medium text-text-primary">Grade/Class</span>
        </div>
        <p class="text-text-primary">{{ invitation.gradeName }}</p>
      </div>

      <!-- Additional Info -->
      <div
        v-if="invitation.additionalInfo"
        class="bg-background-secondary rounded-lg p-4"
      >
        <div class="flex items-center gap-2 mb-2">
          <Icon name="mdi:information" class="w-5 h-5 text-text-secondary" />
          <span class="font-medium text-text-primary"
            >Additional Information</span
          >
        </div>
        <p class="text-text-secondary text-sm">
          {{ invitation.additionalInfo }}
        </p>
      </div>

      <!-- Invitation Date -->
      <div class="flex items-center gap-2 text-sm text-text-muted">
        <Icon name="mdi:calendar" class="w-4 h-4" />
        <span>Invited {{ formattedDate }}</span>
      </div>
    </div>

    <template #action>
      <div class="flex gap-3 pt-4">
        <NButton
          type="primary"
          size="medium"
          :loading="acceptLoading"
          :disabled="declineLoading"
          @click.stop="handleAccept"
        >
          <template #icon>
            <Icon name="mdi:check" />
          </template>
          Accept
        </NButton>

        <NButton
          type="default"
          size="medium"
          :loading="declineLoading"
          :disabled="acceptLoading"
          @click.stop="handleDecline"
        >
          <template #icon>
            <Icon name="mdi:close" />
          </template>
          Decline
        </NButton>

        <NButton type="tertiary" size="medium" @click.stop="handleViewDetails">
          <template #icon>
            <Icon name="mdi:eye" />
          </template>
          Details
        </NButton>
      </div>
    </template>
  </NCard>
</template>

<script setup lang="ts">
import { NCard, NButton } from 'naive-ui';
import type { PendingInvitationDto } from '~/interfaces/invitation';
import ProfileStatusBadge from './ProfileStatusBadge.vue';

interface Props {
  invitation: PendingInvitationDto;
  acceptLoading?: boolean;
  declineLoading?: boolean;
  clickable?: boolean;
}

interface Emits {
  accept: [invitation: PendingInvitationDto];
  decline: [invitation: PendingInvitationDto];
  viewDetails: [invitation: PendingInvitationDto];
  cardClick: [invitation: PendingInvitationDto];
}

const props = withDefaults(defineProps<Props>(), {
  acceptLoading: false,
  declineLoading: false,
  clickable: true,
});

const emit = defineEmits<Emits>();

// Type icon mapping
const typeIcons = {
  Student: 'mdi:account-school',
  Teacher: 'mdi:account-tie',
  Admin: 'mdi:account-supervisor',
};

// Computed properties
const typeIcon = computed(
  () => typeIcons[props.invitation.type] || 'mdi:account'
);

const iconClasses = computed(() => {
  const baseClasses = [
    'w-12 h-12 rounded-full flex items-center justify-center',
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

const cardClasses = computed(() => {
  const baseClasses = [
    'transition-all duration-200 ease-in-out',
    'border border-border hover:border-border-hover',
    'bg-glass',
  ];

  if (props.clickable) {
    baseClasses.push('cursor-pointer', 'hover-elevate');
  }

  return baseClasses;
});

const formattedDate = computed(() => {
  const date = new Date(props.invitation.invitedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'today';
  } else if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
});

// Event handlers
const handleAccept = () => {
  emit('accept', props.invitation);
};

const handleDecline = () => {
  emit('decline', props.invitation);
};

const handleViewDetails = () => {
  emit('viewDetails', props.invitation);
};

const handleCardClick = () => {
  if (props.clickable) {
    emit('cardClick', props.invitation);
  }
};
</script>

<style scoped>
/* Additional card styling using the theme system */
.bg-glass:hover {
  background: rgba(var(--color-background-card-rgb, 24, 24, 28), 0.9);
  border-color: rgba(var(--color-primary-rgb, 74, 222, 128), 0.3);
}

.hover-elevate:hover {
  transform: translateY(-3px);
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
</style>
