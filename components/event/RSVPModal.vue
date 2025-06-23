<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="fixed inset-0 bg-black bg-opacity-75" @click="$emit('close')" />
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative w-full max-w-md bg-background-card rounded-xl shadow-xl animate-scale-in"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-text-primary">
              RSVP to Event
            </h3>
            <button
              class="text-text-secondary hover:text-text-primary transition-colors"
              @click="$emit('close')"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Event Info -->
          <div class="bg-background-secondary rounded-lg p-4 mb-6">
            <h4 class="font-medium text-text-primary mb-1">
              {{ event?.title }}
            </h4>
            <p class="text-sm text-text-secondary mb-2">{{ event?.topic }}</p>
            <div class="text-xs text-text-secondary">
              {{ formattedDate }}
            </div>
          </div>

          <!-- RSVP Form -->
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <!-- Response Selection -->
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-2"
                >Your Response</label
              >
              <div class="space-y-2">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="rsvpData.status"
                    type="radio"
                    :value="ParticipantStatus.Accepted"
                    class="w-4 h-4 text-green-600 bg-background-secondary border-border focus:ring-green-500 focus:ring-2"
                  />
                  <span class="text-text-primary"
                    >✅ Accept - I will attend</span
                  >
                </label>

                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="rsvpData.status"
                    type="radio"
                    :value="ParticipantStatus.Maybe"
                    class="w-4 h-4 text-yellow-600 bg-background-secondary border-border focus:ring-yellow-500 focus:ring-2"
                  />
                  <span class="text-text-primary"
                    >🤔 Maybe - I'm not sure yet</span
                  >
                </label>

                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="rsvpData.status"
                    type="radio"
                    :value="ParticipantStatus.Declined"
                    class="w-4 h-4 text-red-600 bg-background-secondary border-border focus:ring-red-500 focus:ring-2"
                  />
                  <span class="text-text-primary"
                    >❌ Decline - I cannot attend</span
                  >
                </label>
              </div>
            </div>

            <!-- Optional Note -->
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-2">
                Note (Optional)
              </label>
              <textarea
                v-model="rsvpData.responseNote"
                rows="3"
                placeholder="Add a note to the organizer..."
                class="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                class="px-4 py-2 text-text-secondary hover:text-text-primary border border-border rounded-lg transition-colors"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="rsvpData.status === null"
                class="bg-gradient-primary hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Submit RSVP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type {
  EventResponseDto,
  UpdateParticipantStatusDto,
  ParticipantStatus,
} from '~/interfaces/event';

interface Props {
  event?: EventResponseDto | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [rsvpData: UpdateParticipantStatusDto];
}>();

// Import ParticipantStatus enum values - these are still numeric
const ParticipantStatus = {
  Invited: 0,
  Accepted: 1,
  Declined: 2,
  Maybe: 3,
  NoResponse: 4,
} as const;

const rsvpData = ref<{
  status: ParticipantStatus | null;
  responseNote: string;
}>({
  status: null,
  responseNote: '',
});

const formattedDate = computed(() => {
  if (!props.event) return '';
  return formatEventDate(props.event.startDate, props.event.isAllDay);
});

const formatEventDate = (dateString: string, isAllDay: boolean) => {
  const date = new Date(dateString);

  if (isAllDay) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const handleSubmit = () => {
  if (rsvpData.value.status !== null) {
    emit('submit', {
      status: rsvpData.value.status,
      responseNote: rsvpData.value.responseNote || undefined,
    });
  }
};
</script>
