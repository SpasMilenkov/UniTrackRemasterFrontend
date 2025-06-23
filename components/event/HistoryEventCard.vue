<template>
  <div
    class="bg-glass bg-glass-hover rounded-xl p-6 transition-all duration-300 border-l-4 opacity-90"
    :class="[borderColorClass, attendanceColorClass]"
  >
    <!-- Header with Status and Date -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div :class="attendanceIconClass">
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
              :d="attendanceIconPath"
            />
          </svg>
        </div>
        <div class="flex flex-col space-y-1">
          <span
            :class="attendanceBadgeClass"
            class="px-2 py-1 rounded-full text-xs font-medium"
          >
            {{ attendanceStatusLabel }}
          </span>
          <span
            :class="participationBadgeClass"
            class="px-2 py-1 rounded-full text-xs font-medium"
          >
            {{ participationStatusLabel }}
          </span>
        </div>
      </div>

      <!-- Event Date -->
      <div class="text-right">
        <div class="text-xs text-text-secondary">{{ timeAgoLabel }}</div>
        <div class="text-sm font-medium text-text-primary">
          {{ shortFormattedDate }}
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
        <!-- Event Status -->
        <span
          :class="eventStatusBadgeClass"
          class="px-2 py-1 rounded-full text-xs font-medium"
        >
          {{ eventStatusLabel }}
        </span>
      </div>

      <h3 class="text-lg font-semibold text-text-primary mb-1 line-clamp-2">
        {{ event.title }}
      </h3>
      <p class="text-sm text-text-secondary line-clamp-1 mb-3">
        {{ event.topic }}
      </p>

      <!-- Event Summary Info -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <!-- Duration -->
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ eventDuration }}</span>
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
          <span class="line-clamp-1">{{ event.organizerName }}</span>
        </div>

        <!-- Participants -->
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>{{ event.participantCount }} participants</span>
        </div>
      </div>

      <!-- Description (if available) -->
      <div v-if="event.description" class="mb-4">
        <p class="text-sm text-text-secondary line-clamp-2">
          {{ event.description }}
        </p>
      </div>

      <!-- Attendance Summary -->
      <div class="bg-background-secondary rounded-lg p-3 mb-4">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-lg font-semibold text-primary">
              {{ event.participantCount }}
            </div>
            <div class="text-xs text-text-secondary">Total Invited</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-green-400">
              {{ event.attendeeCount }}
            </div>
            <div class="text-xs text-text-secondary">Attended</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-secondary">
              {{ attendanceRate }}%
            </div>
            <div class="text-xs text-text-secondary">Attendance Rate</div>
          </div>
        </div>
      </div>

      <!-- Personal Notes Section (if user had notes) -->
      <div
        v-if="participation?.responseNote"
        class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4"
      >
        <div class="flex items-start space-x-2">
          <svg
            class="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <div>
            <div class="text-xs font-medium text-blue-400 mb-1">Your Note:</div>
            <p class="text-sm text-blue-300">
              {{ participation.responseNote }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between">
      <button
        class="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
        @click="$emit('view', event)"
      >
        View Full Details
      </button>

      <div class="flex items-center space-x-2">
        <!-- Share Experience -->
        <button
          v-if="didAttend"
          class="bg-background-secondary hover:bg-background text-text-secondary hover:text-text-primary px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
          @click="shareExperience"
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
          <span>Share</span>
        </button>

        <!-- Event Certificate/Proof -->
        <button
          v-if="didAttend && canDownloadCertificate"
          class="bg-secondary/10 hover:bg-secondary/20 text-secondary px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
          @click="downloadCertificate"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Certificate</span>
        </button>

        <!-- Rate/Feedback -->
        <button
          v-if="didAttend && canGiveFeedback"
          class="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
          @click="giveFeedback"
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
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <span>Rate</span>
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
}>();

// Computed properties
const shortFormattedDate = computed(() => {
  const start = new Date(props.event.startDate);
  return start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});

const timeAgoLabel = computed(() => {
  const now = new Date();
  const eventEnd = new Date(props.event.endDate);
  const timeDiff = now.getTime() - eventEnd.getTime();

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return 'Recently completed';
  }
});

const eventDuration = computed(() => {
  const start = new Date(props.event.startDate);
  const end = new Date(props.event.endDate);
  const durationMs = end.getTime() - start.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  if (props.event.isAllDay) {
    const days = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
});

const didAttend = computed(() => {
  // Check if user actually attended the event
  // This would ideally come from attendance records
  return (
    props.participation?.status === ParticipantStatus.Accepted &&
    props.event.attendeeCount > 0
  );
});

const participationStatusLabel = computed(() => {
  if (!props.participation) return 'Not Participated';

  const labels = {
    [ParticipantStatus.Invited]: 'Was Invited',
    [ParticipantStatus.Accepted]: 'Accepted',
    [ParticipantStatus.Declined]: 'Declined',
    [ParticipantStatus.Maybe]: 'Maybe',
    [ParticipantStatus.NoResponse]: 'No Response',
  };
  return labels[props.participation.status] || 'Unknown';
});

const attendanceStatusLabel = computed(() => {
  if (
    !props.participation ||
    props.participation.status === ParticipantStatus.Declined
  ) {
    return 'Did Not Attend';
  }

  if (props.participation.status === ParticipantStatus.Accepted) {
    return didAttend.value ? 'Attended' : 'Missed';
  }

  return 'Unknown Attendance';
});

const attendanceRate = computed(() => {
  if (props.event.participantCount === 0) return 0;
  return Math.round(
    (props.event.attendeeCount / props.event.participantCount) * 100
  );
});

const participationBadgeClass = computed(() => {
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

const attendanceBadgeClass = computed(() => {
  if (
    !props.participation ||
    props.participation.status === ParticipantStatus.Declined
  ) {
    return 'bg-gray-500/20 text-gray-300';
  }

  if (props.participation.status === ParticipantStatus.Accepted) {
    return didAttend.value
      ? 'bg-green-500/20 text-green-300'
      : 'bg-red-500/20 text-red-300';
  }

  return 'bg-gray-500/20 text-gray-300';
});

const borderColorClass = computed(() => {
  if (didAttend.value) return 'border-green-400';
  if (props.participation?.status === ParticipantStatus.Declined)
    return 'border-red-400';
  if (props.participation?.status === ParticipantStatus.Accepted)
    return 'border-yellow-400'; // Missed
  return 'border-gray-400';
});

const attendanceColorClass = computed(() => {
  if (didAttend.value) return 'bg-green-500/5';
  if (props.participation?.status === ParticipantStatus.Declined)
    return 'bg-red-500/5';
  if (props.participation?.status === ParticipantStatus.Accepted)
    return 'bg-yellow-500/5'; // Missed
  return 'bg-gray-500/5';
});

const attendanceIconClass = computed(() => {
  if (didAttend.value)
    return 'w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400';
  if (props.participation?.status === ParticipantStatus.Declined)
    return 'w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400';
  if (props.participation?.status === ParticipantStatus.Accepted)
    return 'w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400';
  return 'w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center text-gray-400';
});

const attendanceIconPath = computed(() => {
  if (didAttend.value) return 'M5 13l4 4L19 7'; // Check mark
  if (props.participation?.status === ParticipantStatus.Declined)
    return 'M6 18L18 6M6 6l12 12'; // X mark
  if (props.participation?.status === ParticipantStatus.Accepted)
    return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'; // Exclamation (missed)
  return 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'; // Question mark
});

const eventStatusLabel = computed(() => {
  const labels = {
    [EventStatus.Draft]: 'Draft',
    [EventStatus.Published]: 'Published',
    [EventStatus.Cancelled]: 'Cancelled',
    [EventStatus.Completed]: 'Completed',
    [EventStatus.InProgress]: 'In Progress',
  };
  return labels[props.event.status] || 'Unknown';
});

const eventStatusBadgeClass = computed(() => {
  const classes = {
    [EventStatus.Draft]: 'bg-gray-500/20 text-gray-300',
    [EventStatus.Published]: 'bg-green-500/20 text-green-300',
    [EventStatus.Cancelled]: 'bg-red-500/20 text-red-300',
    [EventStatus.Completed]: 'bg-blue-500/20 text-blue-300',
    [EventStatus.InProgress]: 'bg-yellow-500/20 text-yellow-300',
  };
  return classes[props.event.status] || classes[EventStatus.Draft];
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

// Feature flags for additional functionality
const canDownloadCertificate = computed(() => {
  // Enable certificate download for workshops, training, and conferences that user attended
  return (
    didAttend.value &&
    [EventType.Workshop, EventType.Training, EventType.Conference].includes(
      props.event.type
    )
  );
});

const canGiveFeedback = computed(() => {
  // Allow feedback for events user attended
  return didAttend.value;
});

// Methods
const shareExperience = () => {
  const text = `I attended "${props.event.title}" - ${props.event.topic}`;
  if (navigator.share) {
    navigator.share({
      title: props.event.title,
      text: text,
      url: window.location.href,
    });
  } else {
    // Fallback to copying to clipboard
    navigator.clipboard.writeText(text);
  }
};

const downloadCertificate = () => {
  // Implementation for downloading certificate of attendance
  console.log('Downloading certificate for event:', props.event.id);
};

const giveFeedback = () => {
  // Implementation for giving feedback/rating
  console.log('Opening feedback form for event:', props.event.id);
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
