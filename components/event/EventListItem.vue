<template>
  <div
    class="bg-glass bg-glass-hover rounded-lg p-6 transition-all duration-300"
  >
    <div class="flex items-center justify-between">
      <!-- Left Section: Event Info -->
      <div class="flex items-center space-x-6 flex-1">
        <!-- Event Type Icon -->
        <div :class="typeIconClass">
          <component :is="typeIcon" class="w-5 h-5" />
        </div>

        <!-- Event Details -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-3 mb-2">
            <h3 class="text-lg font-semibold text-text-primary truncate">
              {{ event.title }}
            </h3>
            <span
              :class="statusBadgeClass"
              class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
            >
              {{ statusLabel }}
            </span>
            <span
              v-if="event.isRecurring"
              class="text-text-secondary"
              title="Recurring Event"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </span>
          </div>

          <div class="flex items-center space-x-6 text-sm text-text-secondary">
            <span class="font-medium text-text-primary">{{ event.topic }}</span>

            <!-- Date -->
            <div class="flex items-center space-x-1">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v8a2 2 0 002 2h4a2 2 0 002-2v-8m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h8"
                />
              </svg>
              <span>{{ formattedDate }}</span>
            </div>

            <!-- Location -->
            <div v-if="event.location" class="flex items-center space-x-1">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="truncate max-w-32">{{ event.location }}</span>
            </div>

            <!-- Online indicator -->
            <div
              v-if="event.meetingLink"
              class="flex items-center space-x-1 text-primary"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <span>Online</span>
            </div>

            <!-- Organizer -->
            <div v-if="event.organizerName" class="flex items-center space-x-1">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="truncate max-w-32">{{ event.organizerName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Center Section: Stats -->
      <div class="hidden lg:flex items-center space-x-8 mx-8">
        <div class="text-center">
          <div class="text-lg font-semibold text-primary">
            {{ event.participantCount }}
          </div>
          <div class="text-xs text-text-secondary">Participants</div>
        </div>

        <div v-if="event.maxParticipants" class="text-center">
          <div class="text-lg font-semibold text-secondary">
            {{ event.maxParticipants }}
          </div>
          <div class="text-xs text-text-secondary">Max</div>
        </div>

        <div class="text-center">
          <div class="text-lg font-semibold text-text-primary">
            {{ event.attendeeCount }}
          </div>
          <div class="text-xs text-text-secondary">Attended</div>
        </div>
      </div>

      <!-- Right Section: Actions -->
      <div class="flex items-center space-x-4">
        <button
          class="text-primary hover:text-primary-dark font-medium text-sm transition-colors whitespace-nowrap"
          @click="$emit('view', event)"
        >
          View Details
        </button>

        <div class="flex items-center space-x-2">
          <!-- Organizer badge -->
          <span
            v-if="showOrganizerBadge"
            class="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs font-medium"
          >
            ORGANIZER
          </span>

          <!-- Participant Actions -->
          <template v-if="!showOrganizerActions">
            <button
              v-if="canRSVP"
              class="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm transition-colors"
              @click="$emit('rsvp', event)"
            >
              RSVP
            </button>
          </template>

          <!-- Organizer Actions -->
          <template v-if="showOrganizerActions">
            <button
              class="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
              title="Edit Event"
              @click="$emit('edit', event)"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <button
              class="p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              title="Delete Event"
              @click="$emit('delete', event)"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile Stats (shown only on smaller screens) -->
    <div
      class="lg:hidden mt-4 flex items-center justify-center space-x-8 py-3 px-4 bg-background-secondary rounded-lg"
    >
      <div class="text-center">
        <div class="text-lg font-semibold text-primary">
          {{ event.participantCount }}
        </div>
        <div class="text-xs text-text-secondary">Participants</div>
      </div>

      <div v-if="event.maxParticipants" class="text-center">
        <div class="text-lg font-semibold text-secondary">
          {{ event.maxParticipants }}
        </div>
        <div class="text-xs text-text-secondary">Max</div>
      </div>

      <div class="text-center">
        <div class="text-lg font-semibold text-text-primary">
          {{ event.attendeeCount }}
        </div>
        <div class="text-xs text-text-secondary">Attended</div>
      </div>
    </div>

    <!-- Description (collapsed by default) -->
    <div
      v-if="event.description && showDescription"
      class="mt-4 pt-4 border-t border-border"
    >
      <p class="text-sm text-text-secondary">{{ event.description }}</p>
    </div>

    <!-- Toggle description button -->
    <div v-if="event.description" class="mt-3 text-center">
      <button
        class="text-xs text-text-muted hover:text-text-secondary transition-colors"
        @click="showDescription = !showDescription"
      >
        {{ showDescription ? 'Hide' : 'Show' }} Description
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  type EventResponseDto,
  EventStatus,
  EventType,
} from '~/interfaces/event';

interface Props {
  event: EventResponseDto;
  showOrganizerActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showOrganizerActions: false,
});

const showDescription = ref(false);

defineEmits<{
  view: [event: EventResponseDto];
  edit: [event: EventResponseDto];
  delete: [event: EventResponseDto];
  rsvp: [event: EventResponseDto];
}>();

// Computed properties
const formattedDate = computed(() => {
  const start = new Date(props.event.startDate);
  const end = new Date(props.event.endDate);
  const isSameDay = start.toDateString() === end.toDateString();

  if (props.event.isAllDay) {
    return isSameDay
      ? start.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      : `${start.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })} - ${end.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}`;
  }

  return start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
});

const typeIcon = computed(() => {
  // Using a generic SVG icon component - replace with actual icon components
  return 'svg';
});

// Updated to use string-based EventType enum
const typeIconClass = computed(() => {
  const classes = {
    [EventType.Workshop]: 'text-blue-400 bg-blue-500/20',
    [EventType.Seminar]: 'text-green-400 bg-green-500/20',
    [EventType.Conference]: 'text-purple-400 bg-purple-500/20',
    [EventType.Meeting]: 'text-yellow-400 bg-yellow-500/20',
    [EventType.Training]: 'text-red-400 bg-red-500/20',
    [EventType.Social]: 'text-pink-400 bg-pink-500/20',
    [EventType.Lecture]: 'text-indigo-400 bg-indigo-500/20',
    [EventType.Other]: 'text-gray-400 bg-gray-500/20',
  };
  return `inline-flex items-center justify-center w-10 h-10 rounded-lg ${classes[props.event.type] || classes[EventType.Other]}`;
});

// Updated to use string-based EventStatus enum
const statusLabel = computed(() => {
  const labels = {
    [EventStatus.Draft]: 'Draft',
    [EventStatus.Published]: 'Published',
    [EventStatus.Scheduled]: 'Scheduled',
    [EventStatus.Cancelled]: 'Cancelled',
    [EventStatus.Completed]: 'Completed',
    [EventStatus.InProgress]: 'Live',
  };
  return labels[props.event.status] || 'Unknown';
});

// Updated to use string-based EventStatus enum
const statusBadgeClass = computed(() => {
  const classes = {
    [EventStatus.Draft]: 'bg-gray-500/20 text-gray-300',
    [EventStatus.Published]: 'bg-green-500/20 text-green-300',
    [EventStatus.Scheduled]: 'bg-blue-500/20 text-blue-300',
    [EventStatus.Cancelled]: 'bg-red-500/20 text-red-300',
    [EventStatus.Completed]: 'bg-blue-500/20 text-blue-300',
    [EventStatus.InProgress]: 'bg-yellow-500/20 text-yellow-300',
  };
  return classes[props.event.status] || classes[EventStatus.Draft];
});

const showOrganizerBadge = computed(() => {
  return props.showOrganizerActions;
});

const canRSVP = computed(() => {
  const now = new Date();
  const eventStart = new Date(props.event.startDate);

  return (
    props.event.status === EventStatus.Published &&
    eventStart > now &&
    !props.showOrganizerActions
  );
});
</script>

<style scoped>
.max-w-32 {
  max-width: 8rem;
}
</style>
