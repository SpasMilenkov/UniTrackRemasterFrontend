<template>
  <div
    class="bg-glass bg-glass-hover rounded-xl p-6 transition-all duration-300 border-l-4 border-yellow-400"
  >
    <!-- Header with Urgent Indicator -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div
          class="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <span
            class="bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full text-xs font-medium"
          >
            INVITATION PENDING
          </span>
        </div>
      </div>

      <!-- Time Remaining -->
      <div v-if="timeUntilEvent" class="text-right">
        <div class="text-xs text-text-secondary">Event starts in</div>
        <div class="text-sm font-medium text-yellow-400">
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

        <!-- Meeting Link -->
        <div
          v-if="event.meetingLink"
          class="flex items-center space-x-2 text-sm text-primary"
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
          <span>Online Meeting</span>
        </div>
      </div>

      <!-- Description (if available) -->
      <div v-if="event.description" class="mb-4">
        <p class="text-sm text-text-secondary line-clamp-2">
          {{ event.description }}
        </p>
      </div>
    </div>

    <!-- Quick RSVP Actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="text-xs text-text-secondary">Respond to invitation:</span>
      </div>

      <div class="flex items-center space-x-2">
        <!-- Quick Accept -->
        <button
          class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
          @click="handleQuickAccept"
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Accept</span>
        </button>

        <!-- Quick Maybe -->
        <button
          class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
          @click="handleQuickMaybe"
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
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Maybe</span>
        </button>

        <!-- Quick Decline -->
        <button
          class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
          @click="handleQuickDecline"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Decline</span>
        </button>

        <!-- Detailed Response Button -->
        <button
          class="text-primary hover:text-primary-dark border border-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          @click="handleDetailedResponse"
        >
          Details
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
} from '~/interfaces/event';

interface Props {
  event: EventResponseDto;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  respond: [event: EventResponseDto, status?: ParticipantStatus];
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

// Event handlers
const handleQuickAccept = () => {
  emit('respond', props.event, ParticipantStatus.Accepted);
};

const handleQuickMaybe = () => {
  emit('respond', props.event, ParticipantStatus.Maybe);
};

const handleQuickDecline = () => {
  emit('respond', props.event, ParticipantStatus.Declined);
};

const handleDetailedResponse = () => {
  emit('respond', props.event);
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
