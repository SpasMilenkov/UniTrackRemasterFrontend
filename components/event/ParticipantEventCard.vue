<template>
  <div
    class="bg-glass bg-glass-hover rounded-xl p-6 transition-all duration-300 border-l-4"
    :class="borderColorClass"
  >
    <!-- Header with Status -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div :class="statusIconClass">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="statusIconPath"
            />
          </svg>
        </div>
        <div>
          <span
            :class="statusBadgeClass"
            class="px-2 py-1 rounded-full text-xs font-medium"
          >
            {{ participationStatusLabel }}
          </span>
        </div>
      </div>

      <!-- Time Until Event -->
      <div v-if="timeUntilEvent" class="text-right">
        <div class="text-xs text-text-secondary">Starts in</div>
        <div class="text-sm font-medium" :class="timeColorClass">
          {{ timeUntilEvent }}
        </div>
      </div>
    </div>

    <!-- Event Details -->
    <div class="mb-4">
      <div class="flex items-center space-x-2 mb-2">
        <span :class="typeIconClass">
          <component :is="typeIcon" class="w-4 h-4" />
        </span>
        <span
          class="text-xs font-medium text-text-secondary uppercase tracking-wide"
        >
          {{ typeLabel }}
        </span>
        <!-- Recurring indicator -->
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

      <h3 class="text-lg font-semibold text-text-primary mb-1 line-clamp-2">
        {{ event.title }}
      </h3>
      <p class="text-sm text-text-secondary line-clamp-1 mb-3">
        {{ event.topic }}
      </p>

      <!-- Event Info Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <!-- Date & Time -->
        <div class="flex items-center space-x-2 text-sm text-text-secondary">
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
        <div
          v-if="event.location"
          class="flex items-center space-x-2 text-sm text-text-secondary"
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span class="line-clamp-1">{{ event.location }}</span>
        </div>

        <!-- Meeting Link -->
        <div
          v-if="event.meetingLink"
          class="flex items-center space-x-2 text-sm text-primary col-span-full sm:col-span-1"
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
          <a
            :href="event.meetingLink"
            target="_blank"
            class="text-primary hover:text-primary-dark cursor-pointer underline"
            @click.stop
          >
            Join Online Meeting
          </a>
        </div>

        <!-- Organizer -->
        <div
          v-if="event.organizerName"
          class="flex items-center space-x-2 text-sm text-text-secondary"
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>{{ event.organizerName }}</span>
        </div>
      </div>

      <!-- Description (if available) -->
      <div v-if="event.description" class="mb-4">
        <p class="text-sm text-text-secondary line-clamp-2">
          {{ event.description }}
        </p>
      </div>

      <!-- Event Stats -->
      <div
        class="flex items-center justify-between py-3 px-4 bg-background-secondary rounded-lg mb-4"
      >
        <div class="flex items-center space-x-4">
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

        <!-- Approval Required Indicator -->
        <div
          v-if="event.requiresApproval"
          class="flex items-center space-x-1 text-text-secondary"
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span class="text-xs">Requires Approval</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between">
      <button
        class="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
        @click="$emit('view', event)"
      >
        View Details
      </button>

      <div class="flex items-center space-x-2">
        <!-- Add to Calendar -->
        <button
          v-if="isUpcoming"
          class="bg-background-secondary hover:bg-background text-text-secondary hover:text-text-primary px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
          @click="addToCalendar"
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
              d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v8a2 2 0 002 2h4a2 2 0 002-2v-8m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h8"
            />
          </svg>
          <span>Add to Calendar</span>
        </button>

        <!-- Change RSVP -->
        <button
          v-if="
            participation &&
            participation.status !== ParticipantStatus.NoResponse
          "
          class="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded text-sm transition-colors"
          @click="$emit('rsvp', event)"
        >
          Change RSVP
        </button>

        <!-- Quick Join (for online events starting soon) -->
        <button
          v-if="showQuickJoin"
          class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
          @click="quickJoin"
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span>Join Now</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  EventStatus,
  type EventResponseDto,
  EventType,
  ParticipantStatus,
  type ParticipantResponseDto,
} from '~/interfaces/event';

interface Props {
  event: EventResponseDto;
  participation?: ParticipantResponseDto | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  view: [event: EventResponseDto];
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
          weekday: 'short',
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

  return isSameDay
    ? `${start.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })} at ${start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`
    : `${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} ${start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })} - ${end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} ${end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
});

const timeUntilEvent = computed(() => {
  const now = new Date();
  const eventStart = new Date(props.event.startDate);
  const timeDiff = eventStart.getTime() - now.getTime();

  if (timeDiff <= 0) return null;

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes} min`;
  }
});

const timeColorClass = computed(() => {
  const now = new Date();
  const eventStart = new Date(props.event.startDate);
  const timeDiff = eventStart.getTime() - now.getTime();
  const hoursUntil = timeDiff / (1000 * 60 * 60);

  if (hoursUntil <= 1) return 'text-red-400';
  if (hoursUntil <= 24) return 'text-yellow-400';
  return 'text-green-400';
});

const isUpcoming = computed(() => {
  const now = new Date();
  const eventStart = new Date(props.event.startDate);
  return eventStart > now;
});

const showQuickJoin = computed(() => {
  if (!props.event.meetingLink) return false;

  const now = new Date();
  const eventStart = new Date(props.event.startDate);
  const eventEnd = new Date(props.event.endDate);
  const timeDiff = eventStart.getTime() - now.getTime();
  const minutesUntilStart = timeDiff / (1000 * 60);

  // Show join button if event starts within 15 minutes or is currently happening
  return (
    (minutesUntilStart <= 15 && minutesUntilStart >= -60) ||
    (now >= eventStart && now <= eventEnd)
  );
});

const participationStatusLabel = computed(() => {
  if (!props.participation) return 'Not Participating';

  const labels = {
    [ParticipantStatus.Invited]: 'Invited',
    [ParticipantStatus.Accepted]: 'Going',
    [ParticipantStatus.Declined]: 'Declined',
    [ParticipantStatus.Maybe]: 'Maybe',
    [ParticipantStatus.NoResponse]: 'No Response',
  };
  return labels[props.participation.status] || 'Unknown';
});

const statusBadgeClass = computed(() => {
  if (!props.participation) return 'bg-gray-500/20 text-gray-300';

  const classes = {
    [ParticipantStatus.Invited]: 'bg-blue-500/20 text-blue-300',
    [ParticipantStatus.Accepted]: 'bg-green-500/20 text-green-300',
    [ParticipantStatus.Declined]: 'bg-red-500/20 text-red-300',
    [ParticipantStatus.Maybe]: 'bg-yellow-500/20 text-yellow-300',
    [ParticipantStatus.NoResponse]: 'bg-gray-500/20 text-gray-300',
  };
  return classes[props.participation.status] || 'bg-gray-500/20 text-gray-300';
});

const borderColorClass = computed(() => {
  if (!props.participation) return 'border-gray-500';

  const classes = {
    [ParticipantStatus.Invited]: 'border-blue-400',
    [ParticipantStatus.Accepted]: 'border-green-400',
    [ParticipantStatus.Declined]: 'border-red-400',
    [ParticipantStatus.Maybe]: 'border-yellow-400',
    [ParticipantStatus.NoResponse]: 'border-gray-400',
  };
  return classes[props.participation.status] || 'border-gray-400';
});

const statusIconClass = computed(() => {
  if (!props.participation)
    return 'w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center text-gray-400';

  const classes = {
    [ParticipantStatus.Invited]:
      'w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400',
    [ParticipantStatus.Accepted]:
      'w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400',
    [ParticipantStatus.Declined]:
      'w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400',
    [ParticipantStatus.Maybe]:
      'w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400',
    [ParticipantStatus.NoResponse]:
      'w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center text-gray-400',
  };
  return (
    classes[props.participation.status] ||
    'w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center text-gray-400'
  );
});

const statusIconPath = computed(() => {
  if (!props.participation)
    return 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';

  const paths = {
    [ParticipantStatus.Invited]:
      'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    [ParticipantStatus.Accepted]: 'M5 13l4 4L19 7',
    [ParticipantStatus.Declined]: 'M6 18L18 6M6 6l12 12',
    [ParticipantStatus.Maybe]:
      'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    [ParticipantStatus.NoResponse]:
      'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  };
  return (
    paths[props.participation.status] || paths[ParticipantStatus.NoResponse]
  );
});

const typeLabel = computed(() => {
  const labels = {
    [EventType.Workshop]: 'Workshop',
    [EventType.Seminar]: 'Seminar',
    [EventType.Conference]: 'Conference',
    [EventType.Meeting]: 'Meeting',
    [EventType.Training]: 'Training',
    [EventType.Social]: 'Social',
    [EventType.Other]: 'Other',
  };
  return labels[props.event.type] || 'Unknown';
});

const typeIcon = computed(() => 'svg');

const typeIconClass = computed(() => {
  const classes = {
    [EventType.Workshop]: 'text-blue-400 bg-blue-500/20',
    [EventType.Seminar]: 'text-green-400 bg-green-500/20',
    [EventType.Conference]: 'text-purple-400 bg-purple-500/20',
    [EventType.Meeting]: 'text-yellow-400 bg-yellow-500/20',
    [EventType.Training]: 'text-red-400 bg-red-500/20',
    [EventType.Social]: 'text-pink-400 bg-pink-500/20',
    [EventType.Other]: 'text-gray-400 bg-gray-500/20',
  };
  return `inline-flex items-center justify-center w-6 h-6 rounded-full ${classes[props.event.type] || classes[EventType.Other]}`;
});

// Methods
const addToCalendar = () => {
  const startDate = new Date(props.event.startDate);
  const endDate = new Date(props.event.endDate);

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const title = encodeURIComponent(props.event.title);
  const description = encodeURIComponent(props.event.description || '');
  const location = encodeURIComponent(props.event.location || '');

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${description}&location=${location}`;

  window.open(googleCalendarUrl, '_blank');
};

const quickJoin = () => {
  if (props.event.meetingLink) {
    window.open(props.event.meetingLink, '_blank');
  }
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
