<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
      @click="$emit('close')"
    />

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative w-full max-w-4xl bg-background-card rounded-xl shadow-xl animate-scale-in max-h-[90vh] overflow-hidden"
      >
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
          />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-6">
          <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <div class="flex items-center space-x-3">
              <svg
                class="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 class="font-medium text-red-400">
                  Error loading event details
                </h3>
                <p class="text-red-300 text-sm mt-1">{{ error }}</p>
              </div>
            </div>
            <button
              class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              @click="loadEventDetails"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Event Details -->
        <div v-else-if="eventDetails" class="flex flex-col h-full max-h-[90vh]">
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 border-b border-border bg-background-secondary"
          >
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <span :class="typeIconClass">
                  <component :is="typeIcon" class="w-5 h-5" />
                </span>
                <span
                  :class="statusBadgeClass"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ statusLabel }}
                </span>
                <span
                  v-if="eventDetails.isRecurring"
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
              <h2 class="text-2xl font-bold text-text-primary mb-1">
                {{ eventDetails.title }}
              </h2>
              <p class="text-lg text-text-secondary">
                {{ eventDetails.topic }}
              </p>
            </div>

            <div class="flex items-center space-x-3">
              <!-- Only show edit button if user is the organizer of this event -->
              <button
                v-if="canEditEvent"
                class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
                @click="$emit('edit', eventDetails)"
              >
                Edit Event
              </button>

              <!-- Show RSVP button for non-organizers -->
              <button
                v-else-if="canRSVP"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                @click="$emit('rsvp', eventDetails)"
              >
                RSVP to Event
              </button>

              <!-- Join Meeting button if available and event is happening soon/now -->
              <button
                v-if="showJoinMeeting"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                @click="joinMeeting"
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
                <span>Join Meeting</span>
              </button>

              <button
                class="text-text-secondary hover:text-text-primary transition-colors"
                @click="$emit('close')"
              >
                <svg
                  class="w-6 h-6"
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
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto">
            <div class="p-6 space-y-8">
              <!-- Event Information -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column -->
                <div class="space-y-6">
                  <!-- Date & Time -->
                  <div class="bg-background-secondary rounded-lg p-4">
                    <h3
                      class="font-semibold text-text-primary mb-3 flex items-center"
                    >
                      <svg
                        class="w-5 h-5 mr-2"
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
                      Date & Time
                    </h3>
                    <div class="space-y-2 text-sm text-text-secondary">
                      <div>
                        <span class="font-medium">Start:</span>
                        {{ formattedStartDate }}
                      </div>
                      <div>
                        <span class="font-medium">End:</span>
                        {{ formattedEndDate }}
                      </div>
                      <div v-if="eventDetails.isAllDay" class="text-primary">
                        All Day Event
                      </div>
                    </div>
                  </div>

                  <!-- Location -->
                  <div
                    v-if="eventDetails.location || eventDetails.meetingLink"
                    class="bg-background-secondary rounded-lg p-4"
                  >
                    <h3
                      class="font-semibold text-text-primary mb-3 flex items-center"
                    >
                      <svg
                        class="w-5 h-5 mr-2"
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
                      Location
                    </h3>
                    <div class="space-y-2 text-sm text-text-secondary">
                      <div v-if="eventDetails.location">
                        <span class="font-medium">Venue:</span>
                        {{ eventDetails.location }}
                      </div>
                      <div v-if="eventDetails.meetingLink">
                        <span class="font-medium">Online:</span>
                        <a
                          :href="eventDetails.meetingLink"
                          target="_blank"
                          class="text-primary hover:text-primary-dark ml-2 underline"
                        >
                          Join Meeting
                        </a>
                      </div>
                    </div>
                  </div>

                  <!-- Organizer -->
                  <div class="bg-background-secondary rounded-lg p-4">
                    <h3
                      class="font-semibold text-text-primary mb-3 flex items-center"
                    >
                      <svg
                        class="w-5 h-5 mr-2"
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
                      Organizer
                    </h3>
                    <div class="text-sm text-text-secondary">
                      <div>{{ eventDetails.organizerName || 'Unknown' }}</div>
                      <div
                        v-if="eventDetails.institutionName"
                        class="text-text-muted"
                      >
                        {{ eventDetails.institutionName }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-6">
                  <!-- Statistics -->
                  <div class="bg-background-secondary rounded-lg p-4">
                    <h3 class="font-semibold text-text-primary mb-4">
                      Event Statistics
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="text-center p-3 bg-background rounded-lg">
                        <div class="text-2xl font-bold text-primary">
                          {{ eventDetails.participantCount }}
                        </div>
                        <div class="text-xs text-text-secondary">
                          Participants
                        </div>
                      </div>
                      <div class="text-center p-3 bg-background rounded-lg">
                        <div class="text-2xl font-bold text-secondary">
                          {{ eventDetails.attendeeCount }}
                        </div>
                        <div class="text-xs text-text-secondary">Attended</div>
                      </div>
                      <div
                        v-if="eventDetails.maxParticipants"
                        class="text-center p-3 bg-background rounded-lg"
                      >
                        <div class="text-2xl font-bold text-text-primary">
                          {{ eventDetails.maxParticipants }}
                        </div>
                        <div class="text-xs text-text-secondary">
                          Max Allowed
                        </div>
                      </div>
                      <div class="text-center p-3 bg-background rounded-lg">
                        <div class="text-2xl font-bold text-text-primary">
                          {{ attendanceRate }}%
                        </div>
                        <div class="text-xs text-text-secondary">
                          Attendance Rate
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Event Options -->
                  <div class="bg-background-secondary rounded-lg p-4">
                    <h3 class="font-semibold text-text-primary mb-3">
                      Event Settings
                    </h3>
                    <div class="space-y-2 text-sm">
                      <div class="flex items-center justify-between">
                        <span class="text-text-secondary"
                          >Requires Approval</span
                        >
                        <span
                          :class="
                            eventDetails.requiresApproval
                              ? 'text-green-400'
                              : 'text-text-muted'
                          "
                        >
                          {{ eventDetails.requiresApproval ? 'Yes' : 'No' }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-text-secondary">Recurring</span>
                        <span
                          :class="
                            eventDetails.isRecurring
                              ? 'text-green-400'
                              : 'text-text-muted'
                          "
                        >
                          {{ eventDetails.isRecurring ? 'Yes' : 'No' }}
                        </span>
                      </div>
                      <div
                        v-if="
                          eventDetails.isRecurring &&
                          eventDetails.recurrencePattern
                        "
                        class="flex items-center justify-between"
                      >
                        <span class="text-text-secondary">Pattern</span>
                        <span class="text-text-primary">{{
                          recurrencePatternLabel
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div
                v-if="eventDetails.description"
                class="bg-background-secondary rounded-lg p-4"
              >
                <h3 class="font-semibold text-text-primary mb-3">
                  Description
                </h3>
                <p class="text-text-secondary whitespace-pre-wrap">
                  {{ eventDetails.description }}
                </p>
              </div>

              <!-- Notes -->
              <div
                v-if="eventDetails.notes"
                class="bg-background-secondary rounded-lg p-4"
              >
                <h3 class="font-semibold text-text-primary mb-3">Notes</h3>
                <p class="text-text-secondary whitespace-pre-wrap">
                  {{ eventDetails.notes }}
                </p>
              </div>

              <!-- Participants - Only show to organizers or with limited info to others -->
              <div
                v-if="canViewParticipants"
                class="bg-background-secondary rounded-lg p-4"
              >
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-semibold text-text-primary">
                    Participants ({{ eventDetails.participants.length }})
                  </h3>
                  <button
                    v-if="canEditEvent"
                    class="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm transition-colors"
                    @click="showAddParticipant = true"
                  >
                    Add Participant
                  </button>
                </div>

                <div
                  v-if="eventDetails.participants.length === 0"
                  class="text-center py-8 text-text-muted"
                >
                  No participants yet
                </div>

                <div v-else class="space-y-3 max-h-64 overflow-y-auto">
                  <div
                    v-for="participant in displayedParticipants"
                    :key="participant.id"
                    class="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
                      >
                        <span class="text-primary text-sm font-medium">
                          {{ getInitials(participant.userName) }}
                        </span>
                      </div>
                      <div>
                        <div class="font-medium text-text-primary">
                          {{ participant.userName }}
                        </div>
                        <div
                          v-if="canEditEvent"
                          class="text-sm text-text-secondary"
                        >
                          {{ participant.userEmail }}
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center space-x-2">
                      <span
                        :class="getParticipantStatusClass(participant.status)"
                        class="px-2 py-1 rounded text-xs font-medium"
                      >
                        {{ getParticipantStatusLabel(participant.status) }}
                      </span>
                      <button
                        v-if="canEditEvent"
                        class="text-text-secondary hover:text-red-400 transition-colors"
                        title="Remove Participant"
                        @click="removeParticipant(participant)"
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
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Attendees -->
              <div
                v-if="eventDetails.attenders.length > 0 && canViewParticipants"
                class="bg-background-secondary rounded-lg p-4"
              >
                <h3 class="font-semibold text-text-primary mb-4">
                  Attendees ({{ eventDetails.attenders.length }})
                </h3>

                <div class="space-y-3 max-h-64 overflow-y-auto">
                  <div
                    v-for="attender in eventDetails.attenders"
                    :key="attender.id"
                    class="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center"
                      >
                        <span class="text-secondary text-sm font-medium">
                          {{ getInitials(attender.userName) }}
                        </span>
                      </div>
                      <div>
                        <div class="font-medium text-text-primary">
                          {{ attender.userName }}
                        </div>
                        <div class="text-sm text-text-secondary">
                          {{
                            getAttendanceStatusLabel(attender.attendanceStatus)
                          }}
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="attender.checkInTime"
                      class="text-sm text-text-secondary"
                    >
                      {{ formatDateTime(attender.checkInTime) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Participant Modal -->
    <div
      v-if="showAddParticipant && canEditEvent"
      class="fixed inset-0 z-60 overflow-y-auto"
    >
      <div
        class="fixed inset-0 bg-black bg-opacity-75"
        @click="showAddParticipant = false"
      />
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-md bg-background-card rounded-xl shadow-xl"
        >
          <div class="p-6">
            <h3 class="text-lg font-semibold text-text-primary mb-4">
              Add Participant
            </h3>
            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-text-secondary mb-2"
                  >User ID</label
                >
                <input
                  v-model="newParticipantId"
                  type="text"
                  placeholder="Enter user ID"
                  class="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent"
                >
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  class="px-4 py-2 text-text-secondary hover:text-text-primary border border-border rounded-lg transition-colors"
                  @click="showAddParticipant = false"
                >
                  Cancel
                </button>
                <button
                  :disabled="!newParticipantId || isUpdatingParticipant"
                  class="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                  @click="addParticipant"
                >
                  {{ isUpdatingParticipant ? 'Adding...' : 'Add' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  AttendanceStatus,
  EventStatus,
  ParticipantStatus,
  RecurrencePattern,
  type EventDetailResponseDto,
  EventType,
  type ParticipantResponseDto,
} from '~/interfaces/event';
import { useUserStore } from '~/stores/user';

interface Props {
  eventId?: string | null;
}

const props = defineProps<Props>();

defineEmits<{
  close: [];
  edit: [event: EventDetailResponseDto];
  rsvp: [event: EventDetailResponseDto];
}>();

const eventsStore = useEventsStore();
const userStore = useUserStore();
const showAddParticipant = ref(false);
const newParticipantId = ref('');
const currentOrganizerProfile = ref(null);

// Computed
const eventDetails = computed(() => eventsStore.eventDetails);
const loading = computed(() => eventsStore.loading);
const error = computed(() => eventsStore.error);
const isUpdatingParticipant = computed(() => eventsStore.isUpdatingParticipant);
const user = computed(() => userStore.userDetails);

// Check if current user can edit this specific event
const canEditEvent = computed(() => {
  if (!eventDetails.value || !currentOrganizerProfile.value) return false;
  return eventDetails.value.organizerId === currentOrganizerProfile.value.id;
});

// Check if user can RSVP (not the organizer and event is open)
const canRSVP = computed(() => {
  if (!eventDetails.value) return false;
  const now = new Date();
  const eventStart = new Date(eventDetails.value.startDate);

  return (
    !canEditEvent.value && // Not the organizer
    eventDetails.value.status === EventStatus.Published && // Event is published
    eventStart > now // Event hasn't started yet
  );
});

// Check if user can view participants (organizer sees all, others see limited info)
const canViewParticipants = computed(() => {
  // Organizers can see full participant details
  // Non-organizers can see basic participant count/status but not emails
  return !!eventDetails.value;
});

// For non-organizers, show limited participant info
const displayedParticipants = computed(() => {
  if (!eventDetails.value?.participants) return [];

  if (canEditEvent.value) {
    // Organizers see everything
    return eventDetails.value.participants;
  } else {
    // Non-organizers see limited info (no emails, just names and status)
    return eventDetails.value.participants;
  }
});

// Check if meeting join button should be shown
const showJoinMeeting = computed(() => {
  if (!eventDetails.value?.meetingLink) return false;

  const now = new Date();
  const eventStart = new Date(eventDetails.value.startDate);
  const eventEnd = new Date(eventDetails.value.endDate);
  const timeDiff = eventStart.getTime() - now.getTime();
  const minutesUntilStart = timeDiff / (1000 * 60);

  // Show join button if event starts within 15 minutes or is currently happening
  return (
    (minutesUntilStart <= 15 && minutesUntilStart >= -15) ||
    (now >= eventStart && now <= eventEnd)
  );
});

const formattedStartDate = computed(() => {
  if (!eventDetails.value) return '';
  const date = new Date(eventDetails.value.startDate);
  return eventDetails.value.isAllDay
    ? date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
});

const formattedEndDate = computed(() => {
  if (!eventDetails.value) return '';
  const date = new Date(eventDetails.value.endDate);
  return eventDetails.value.isAllDay
    ? date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
});

const attendanceRate = computed(() => {
  if (!eventDetails.value || eventDetails.value.participantCount === 0)
    return 0;
  return Math.round(
    (eventDetails.value.attendeeCount / eventDetails.value.participantCount) *
      100
  );
});

const typeIcon = computed(() => 'svg'); // Replace with actual icon component

// Updated to use string-based EventType enum
const typeIconClass = computed(() => {
  if (!eventDetails.value) return '';
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
  return `inline-flex items-center justify-center w-8 h-8 rounded-lg ${classes[eventDetails.value.type] || classes[EventType.Other]}`;
});

// Updated to use string-based EventStatus enum
const statusLabel = computed(() => {
  if (!eventDetails.value) return '';
  const labels = {
    [EventStatus.Draft]: 'Draft',
    [EventStatus.Published]: 'Published',
    [EventStatus.Scheduled]: 'Scheduled',
    [EventStatus.Cancelled]: 'Cancelled',
    [EventStatus.Completed]: 'Completed',
    [EventStatus.InProgress]: 'Live',
  };
  return labels[eventDetails.value.status] || 'Unknown';
});

// Updated to use string-based EventStatus enum
const statusBadgeClass = computed(() => {
  if (!eventDetails.value) return '';
  const classes = {
    [EventStatus.Draft]: 'bg-gray-500/20 text-gray-300',
    [EventStatus.Published]: 'bg-green-500/20 text-green-300',
    [EventStatus.Scheduled]: 'bg-blue-500/20 text-blue-300',
    [EventStatus.Cancelled]: 'bg-red-500/20 text-red-300',
    [EventStatus.Completed]: 'bg-blue-500/20 text-blue-300',
    [EventStatus.InProgress]: 'bg-yellow-500/20 text-yellow-300',
  };
  return classes[eventDetails.value.status] || classes[EventStatus.Draft];
});

const recurrencePatternLabel = computed(() => {
  if (!eventDetails.value?.recurrencePattern) return '';
  const labels = {
    [RecurrencePattern.None]: 'None',
    [RecurrencePattern.Daily]: 'Daily',
    [RecurrencePattern.Weekly]: 'Weekly',
    [RecurrencePattern.Monthly]: 'Monthly',
    [RecurrencePattern.Yearly]: 'Yearly',
  };
  return labels[eventDetails.value.recurrencePattern] || 'Unknown';
});

// Methods
const loadEventDetails = async () => {
  if (!props.eventId) return;

  try {
    await eventsStore.fetchEventDetails(props.eventId);
  } catch (error) {
    console.error('Failed to load event details:', error);
  }
};

const loadOrganizerProfile = async () => {
  try {
    const profile = await eventsStore.fetchMyOrganizerProfile();
    currentOrganizerProfile.value = profile;
  } catch (error: any) {
    // Not an organizer - this is normal for most users
    if (error.status !== 404) {
      console.error('Error checking organizer status:', error);
    }
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getParticipantStatusLabel = (status: ParticipantStatus) => {
  const labels = {
    [ParticipantStatus.Invited]: 'Invited',
    [ParticipantStatus.Accepted]: 'Accepted',
    [ParticipantStatus.Declined]: 'Declined',
    [ParticipantStatus.Maybe]: 'Maybe',
    [ParticipantStatus.NoResponse]: 'No Response',
  };
  return labels[status] || 'Unknown';
};

const getParticipantStatusClass = (status: ParticipantStatus) => {
  const classes = {
    [ParticipantStatus.Invited]: 'bg-blue-500/20 text-blue-300',
    [ParticipantStatus.Accepted]: 'bg-green-500/20 text-green-300',
    [ParticipantStatus.Declined]: 'bg-red-500/20 text-red-300',
    [ParticipantStatus.Maybe]: 'bg-yellow-500/20 text-yellow-300',
    [ParticipantStatus.NoResponse]: 'bg-gray-500/20 text-gray-300',
  };
  return classes[status] || classes[ParticipantStatus.NoResponse];
};

const getAttendanceStatusLabel = (status: AttendanceStatus) => {
  const labels = {
    [AttendanceStatus.NotCheckedIn]: 'Not Checked In',
    [AttendanceStatus.CheckedIn]: 'Checked In',
    [AttendanceStatus.CheckedOut]: 'Checked Out',
    [AttendanceStatus.NoShow]: 'No Show',
  };
  return labels[status] || 'Unknown';
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const joinMeeting = () => {
  if (eventDetails.value?.meetingLink) {
    window.open(eventDetails.value.meetingLink, '_blank');
  }
};

const addParticipant = async () => {
  if (!props.eventId || !newParticipantId.value) return;

  try {
    await eventsStore.addParticipant(props.eventId, newParticipantId.value);
    await loadEventDetails(); // Reload to get updated participant list
    showAddParticipant.value = false;
    newParticipantId.value = '';
  } catch (error) {
    console.error('Failed to add participant:', error);
  }
};

const removeParticipant = async (participant: ParticipantResponseDto) => {
  if (!props.eventId) return;

  if (confirm(`Remove ${participant.userName} from this event?`)) {
    try {
      await eventsStore.removeParticipant(props.eventId, participant.userId);
      await loadEventDetails(); // Reload to get updated participant list
    } catch (error) {
      console.error('Failed to remove participant:', error);
    }
  }
};

// Lifecycle
onMounted(async () => {
  await loadOrganizerProfile();
  if (props.eventId) {
    loadEventDetails();
  }
});

watch(
  () => props.eventId,
  (newId) => {
    if (newId) {
      loadEventDetails();
    }
  },
  { immediate: true }
);
</script>
