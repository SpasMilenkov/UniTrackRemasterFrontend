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
        class="relative w-full max-w-2xl bg-background-card rounded-xl shadow-xl animate-scale-in"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-6 border-b border-border"
        >
          <h2 class="text-xl font-semibold text-gradient">
            {{ isEdit ? 'Edit Event' : 'Create New Event' }}
          </h2>
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

        <!-- Form -->
        <form class="p-6 space-y-6" @submit.prevent="handleSubmit">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">
              Title <span class="text-red-400">*</span>
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              placeholder="Enter event title"
              class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>

          <!-- Topic -->
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">
              Topic <span class="text-red-400">*</span>
            </label>
            <input
              v-model="formData.topic"
              type="text"
              required
              placeholder="Enter event topic"
              class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Enter event description"
              class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          <!-- Type and Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-2">
                Event Type <span class="text-red-400">*</span>
              </label>
              <select
                v-model="formData.type"
                required
                class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select type</option>
                <option
                  v-for="(label, value) in eventTypeOptions"
                  :key="value"
                  :value="value"
                >
                  {{ label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-text-secondary mb-2">
                Status
              </label>
              <select
                v-model="formData.status"
                class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option
                  v-for="(label, value) in eventStatusOptions"
                  :key="value"
                  :value="value"
                >
                  {{ label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Date and Time -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <input
                id="isAllDay"
                v-model="formData.isAllDay"
                type="checkbox"
                class="w-4 h-4 text-primary bg-background-secondary border-border rounded focus:ring-primary focus:ring-2"
              >
              <label
                for="isAllDay"
                class="text-sm font-medium text-text-secondary"
              >
                All Day Event
              </label>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-text-secondary mb-2"
                >
                  Start Date <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="startDate"
                  type="date"
                  required
                  class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                >
              </div>

              <div v-if="!formData.isAllDay">
                <label
                  class="block text-sm font-medium text-text-secondary mb-2"
                >
                  Start Time <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="startTime"
                  type="time"
                  required
                  class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-text-secondary mb-2"
                >
                  End Date <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="endDate"
                  type="date"
                  required
                  class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                >
              </div>

              <div v-if="!formData.isAllDay">
                <label
                  class="block text-sm font-medium text-text-secondary mb-2"
                >
                  End Time <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="endTime"
                  type="time"
                  required
                  class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                >
              </div>
            </div>
          </div>

          <!-- Location and Meeting Link -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-2">
                Location
              </label>
              <input
                v-model="formData.location"
                type="text"
                placeholder="Enter location"
                class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-text-secondary mb-2">
                Meeting Link
              </label>
              <input
                v-model="formData.meetingLink"
                type="url"
                placeholder="https://..."
                class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent"
              >
            </div>
          </div>

          <!-- Max Participants and Options -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-2">
                Max Participants
              </label>
              <input
                v-model.number="formData.maxParticipants"
                type="number"
                min="1"
                placeholder="No limit"
                class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent"
              >
            </div>

            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <input
                  id="requiresApproval"
                  v-model="formData.requiresApproval"
                  type="checkbox"
                  class="w-4 h-4 text-primary bg-background-secondary border-border rounded focus:ring-primary focus:ring-2"
                >
                <label
                  for="requiresApproval"
                  class="text-sm font-medium text-text-secondary"
                >
                  Requires Approval
                </label>
              </div>

              <div class="flex items-center space-x-3">
                <input
                  id="isRecurring"
                  v-model="formData.isRecurring"
                  type="checkbox"
                  class="w-4 h-4 text-primary bg-background-secondary border-border rounded focus:ring-primary focus:ring-2"
                >
                <label
                  for="isRecurring"
                  class="text-sm font-medium text-text-secondary"
                >
                  Recurring Event
                </label>
              </div>
            </div>
          </div>

          <!-- Recurrence Pattern (shown only if recurring) -->
          <div v-if="formData.isRecurring">
            <label class="block text-sm font-medium text-text-secondary mb-2">
              Recurrence Pattern
            </label>
            <select
              v-model="formData.recurrencePattern"
              class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option :value="0">None</option>
              <option :value="1">Daily</option>
              <option :value="2">Weekly</option>
              <option :value="3">Monthly</option>
              <option :value="4">Yearly</option>
            </select>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2">
              Notes
            </label>
            <textarea
              v-model="formData.notes"
              rows="3"
              placeholder="Additional notes or instructions"
              class="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
          >
            <p class="text-red-400 text-sm">{{ errorMessage }}</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4 pt-4 border-t border-border">
            <button
              type="button"
              class="px-6 py-3 text-text-secondary hover:text-text-primary border border-border hover:border-primary rounded-lg transition-colors"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="bg-gradient-primary hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              {{
                isLoading
                  ? 'Saving...'
                  : isEdit
                    ? 'Update Event'
                    : 'Create Event'
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import {
  type EventResponseDto,
  type CreateEventDto,
  type UpdateEventDto,
  EventStatus,
  EventType,
} from '~/interfaces/event/index';

interface Props {
  event?: EventResponseDto | null;
  isEdit?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  save: [eventData: CreateEventDto | UpdateEventDto];
}>();

const isLoading = ref(false);
const errorMessage = ref('');

// Form data
const formData = ref({
  title: '',
  topic: '',
  description: '',
  type: undefined as EventType | undefined,
  status: EventStatus.Published,
  isAllDay: false,
  isRecurring: false,
  recurrencePattern: 0,
  maxParticipants: undefined as number | undefined,
  requiresApproval: false,
  location: '',
  meetingLink: '',
  notes: '',
  institutionId: undefined as string | undefined,
  participantUserIds: [] as string[],
});

// Separate date/time fields for easier handling
const startDate = ref('');
const startTime = ref('09:00');
const endDate = ref('');
const endTime = ref('10:00');

// Options - Updated to use string-based enums
const eventTypeOptions = computed(() => ({
  [EventType.Workshop]: 'Workshop',
  [EventType.Seminar]: 'Seminar',
  [EventType.Conference]: 'Conference',
  [EventType.Meeting]: 'Meeting',
  [EventType.Training]: 'Training',
  [EventType.Social]: 'Social',
  [EventType.Lecture]: 'Lecture',
  [EventType.Other]: 'Other',
}));

const eventStatusOptions = computed(() => ({
  [EventStatus.Draft]: 'Draft',
  [EventStatus.Published]: 'Published',
  [EventStatus.Scheduled]: 'Scheduled',
  [EventStatus.Cancelled]: 'Cancelled',
  [EventStatus.Completed]: 'Completed',
  [EventStatus.InProgress]: 'In Progress',
}));

// Initialize form data
const initializeForm = () => {
  if (props.isEdit && props.event) {
    const event = props.event;
    formData.value = {
      title: event.title,
      topic: event.topic,
      description: event.description || '',
      type: event.type,
      status: event.status,
      isAllDay: event.isAllDay,
      isRecurring: event.isRecurring,
      recurrencePattern: event.recurrencePattern || 0,
      maxParticipants: event.maxParticipants || undefined,
      requiresApproval: event.requiresApproval,
      location: event.location || '',
      meetingLink: event.meetingLink || '',
      notes: event.notes || '',
      institutionId: event.institutionId || undefined,
      participantUserIds: [],
    };

    // Parse dates
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    startDate.value = start.toISOString().split('T')[0];
    endDate.value = end.toISOString().split('T')[0];

    if (!event.isAllDay) {
      startTime.value = start.toTimeString().slice(0, 5);
      endTime.value = end.toTimeString().slice(0, 5);
    }
  } else {
    // Set default dates for new events
    const now = new Date();
    const defaultStart = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000); // 2 hours from now

    startDate.value = defaultStart.toISOString().split('T')[0];
    endDate.value = defaultEnd.toISOString().split('T')[0];
    startTime.value = defaultStart.toTimeString().slice(0, 5);
    endTime.value = defaultEnd.toTimeString().slice(0, 5);
  }
};

// Combine date and time into ISO strings
const getStartDateTime = () => {
  if (formData.value.isAllDay) {
    return new Date(`${startDate.value}T00:00:00`).toISOString();
  }
  return new Date(`${startDate.value}T${startTime.value}:00`).toISOString();
};

const getEndDateTime = () => {
  if (formData.value.isAllDay) {
    return new Date(`${endDate.value}T23:59:59`).toISOString();
  }
  return new Date(`${endDate.value}T${endTime.value}:00`).toISOString();
};

// Validation
const validateForm = () => {
  errorMessage.value = '';

  if (!formData.value.title.trim()) {
    errorMessage.value = 'Title is required';
    return false;
  }

  if (!formData.value.topic.trim()) {
    errorMessage.value = 'Topic is required';
    return false;
  }

  if (formData.value.type === undefined) {
    errorMessage.value = 'Event type is required';
    return false;
  }

  if (!startDate.value || !endDate.value) {
    errorMessage.value = 'Start and end dates are required';
    return false;
  }

  if (!formData.value.isAllDay && (!startTime.value || !endTime.value)) {
    errorMessage.value = 'Start and end times are required for timed events';
    return false;
  }

  const start = new Date(getStartDateTime());
  const end = new Date(getEndDateTime());

  if (start >= end) {
    errorMessage.value = 'End date/time must be after start date/time';
    return false;
  }

  if (
    formData.value.meetingLink &&
    !formData.value.meetingLink.startsWith('http')
  ) {
    errorMessage.value = 'Meeting link must be a valid URL';
    return false;
  }

  return true;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const eventData = {
      ...formData.value,
      startDate: getStartDateTime(),
      endDate: getEndDateTime(),
      // Remove undefined values for update DTO
      ...(props.isEdit && {
        type: formData.value.type,
        maxParticipants: formData.value.maxParticipants || null,
      }),
    };

    // Remove empty strings and undefined values
    Object.keys(eventData).forEach((key) => {
      const value = eventData[key as keyof typeof eventData];
      if (value === '' || value === undefined) {
        if (props.isEdit) {
          // For updates, only remove truly undefined values
          if (value === undefined) {
            delete eventData[key as keyof typeof eventData];
          }
        } else {
          // For creates, remove empty strings too
          delete eventData[key as keyof typeof eventData];
        }
      }
    });

    emit('save', eventData);
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to save event';
  } finally {
    isLoading.value = false;
  }
};

// Watch for all day changes to clear times
watch(
  () => formData.value.isAllDay,
  (isAllDay) => {
    if (isAllDay) {
      startTime.value = '00:00';
      endTime.value = '23:59';
    } else {
      startTime.value = '09:00';
      endTime.value = '10:00';
    }
  }
);

// Initialize on mount
onMounted(() => {
  initializeForm();
});

// Re-initialize when props change
watch(
  () => props.event,
  () => {
    initializeForm();
  },
  { deep: true }
);
</script>
