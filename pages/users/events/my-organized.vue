<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="border-b border-border bg-background-card">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gradient">
                My Organized Events
              </h1>
              <p class="mt-2 text-text-secondary">
                Manage and track all events you've created
              </p>
            </div>

            <div class="flex items-center space-x-4">
              <!-- Organizer Stats -->
              <div
                v-if="organizerProfile"
                class="hidden lg:flex items-center space-x-6"
              >
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary">
                    {{ myEvents.length }}
                  </div>
                  <div class="text-sm text-text-secondary">Total Events</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-400">
                    {{ upcomingEventsCount }}
                  </div>
                  <div class="text-sm text-text-secondary">Upcoming</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-secondary">
                    {{ totalParticipants }}
                  </div>
                  <div class="text-sm text-text-secondary">
                    Total Participants
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center space-x-3">
                <button
                  class="border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
                  @click="$router.push('/events')"
                >
                  Browse All Events
                </button>
                <button
                  class="bg-gradient-primary hover:scale-105 transition-all duration-200 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 shadow-lg"
                  @click="showCreateModal = true"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Create Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Organizer Profile Info -->
    <div
      v-if="organizerProfile"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      <div class="bg-glass rounded-xl p-6 mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div
              class="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-white"
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
            </div>
            <div>
              <h3 class="text-xl font-semibold text-text-primary">
                {{ organizerProfile.userName }}
              </h3>
              <div
                class="flex items-center space-x-4 text-sm text-text-secondary"
              >
                <span v-if="organizerProfile.department">{{
                  organizerProfile.department
                }}</span>
                <span v-if="organizerProfile.role">{{
                  organizerProfile.role
                }}</span>
                <span v-if="organizerProfile.institutionName">{{
                  organizerProfile.institutionName
                }}</span>
              </div>
              <div class="flex items-center space-x-2 mt-1">
                <span
                  class="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs"
                  >Organizer</span
                >
                <span
                  v-if="organizerProfile.canCreatePublicEvents"
                  class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs"
                >
                  Can Create Public Events
                </span>
              </div>
            </div>
          </div>

          <button
            class="text-text-secondary hover:text-text-primary transition-colors"
            @click="showEditProfile = true"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-glass rounded-xl p-6 text-center">
          <div class="text-3xl font-bold text-primary mb-2">
            {{ draftEventsCount }}
          </div>
          <div class="text-text-secondary text-sm">Draft Events</div>
          <div class="text-xs text-text-muted mt-1">Need to be published</div>
        </div>

        <div class="bg-glass rounded-xl p-6 text-center">
          <div class="text-3xl font-bold text-green-400 mb-2">
            {{ publishedEventsCount }}
          </div>
          <div class="text-text-secondary text-sm">Published Events</div>
          <div class="text-xs text-text-muted mt-1">
            Active and accepting RSVPs
          </div>
        </div>

        <div class="bg-glass rounded-xl p-6 text-center">
          <div class="text-3xl font-bold text-yellow-400 mb-2">
            {{ inProgressEventsCount }}
          </div>
          <div class="text-text-secondary text-sm">In Progress</div>
          <div class="text-xs text-text-muted mt-1">Currently happening</div>
        </div>

        <div class="bg-glass rounded-xl p-6 text-center">
          <div class="text-3xl font-bold text-blue-400 mb-2">
            {{ completedEventsCount }}
          </div>
          <div class="text-text-secondary text-sm">Completed</div>
          <div class="text-xs text-text-muted mt-1">Successfully finished</div>
        </div>
      </div>
    </div>

    <!-- Events Management -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Filter Tabs -->
      <div class="border-b border-border mb-6">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              currentFilter === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border',
            ]"
            @click="currentFilter = 'all'"
          >
            All Events ({{ myEvents.length }})
          </button>

          <button
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              currentFilter === 'upcoming'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border',
            ]"
            @click="currentFilter = 'upcoming'"
          >
            Upcoming ({{ upcomingEventsCount }})
          </button>

          <button
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              currentFilter === 'draft'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border',
            ]"
            @click="currentFilter = 'draft'"
          >
            Drafts ({{ draftEventsCount }})
          </button>

          <button
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              currentFilter === 'completed'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border',
            ]"
            @click="currentFilter = 'completed'"
          >
            Completed ({{ completedEventsCount }})
          </button>
        </nav>
      </div>

      <!-- Events List -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        />
      </div>

      <div
        v-else-if="error"
        class="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-8"
      >
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
            <h3 class="font-medium text-red-400">Error loading events</h3>
            <p class="text-red-300 text-sm mt-1">{{ error }}</p>
          </div>
        </div>
        <button
          class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          @click="loadMyEvents"
        >
          Try Again
        </button>
      </div>

      <div v-else-if="!filteredEvents.length" class="text-center py-12">
        <svg
          class="w-16 h-16 text-text-muted mx-auto mb-4"
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
        <h3 class="text-xl font-medium text-text-secondary mb-2">
          {{ emptyStateTitle }}
        </h3>
        <p class="text-text-muted mb-6">{{ emptyStateMessage }}</p>
        <button
          class="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
          @click="showCreateModal = true"
        >
          Create Your First Event
        </button>
      </div>

      <div v-else class="space-y-4">
        <OrganizerEventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
          class="animate-fade-in"
          @view="viewEvent"
          @edit="editEvent"
          @delete="deleteEvent"
          @duplicate="duplicateEvent"
          @manage-participants="manageParticipants"
          @publish="publishEvent"
        />
      </div>
    </div>

    <!-- Create/Edit Event Modal -->
    <EventModal
      v-if="showCreateModal || showEditModal"
      :event="selectedEvent"
      :is-edit="showEditModal"
      @close="closeModals"
      @save="handleEventSave"
    />

    <!-- Event Details Modal -->
    <EventDetailsModal
      v-if="showDetailsModal"
      :event-id="selectedEvent?.id"
      @close="showDetailsModal = false"
      @edit="editEvent"
    />

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfile" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="fixed inset-0 bg-black bg-opacity-75"
        @click="showEditProfile = false"
      />
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-md bg-background-card rounded-xl shadow-xl"
        >
          <div class="p-6">
            <h3 class="text-lg font-semibold text-text-primary mb-4">
              Edit Organizer Profile
            </h3>
            <form class="space-y-4" @submit.prevent="updateProfile">
              <div>
                <label
                  class="block text-sm font-medium text-text-secondary mb-2"
                  >Department</label
                >
                <input
                  v-model="editForm.department"
                  type="text"
                  class="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                >
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-text-secondary mb-2"
                  >Role</label
                >
                <input
                  v-model="editForm.role"
                  type="text"
                  class="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                >
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  class="px-4 py-2 text-text-secondary hover:text-text-primary border border-border rounded-lg transition-colors"
                  @click="showEditProfile = false"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isUpdating"
                  class="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {{ isUpdating ? 'Updating...' : 'Update' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { type EventResponseDto, EventStatus, type CreateEventDto, type UpdateEventDto } from '~/interfaces/event';
import { useUserStore } from '~/stores/user';
import OrganizerEventCard from '~/components/event/RSVPModal.vue'

const eventsStore = useEventsStore();
const userStore = useUserStore();

// State
const currentFilter = ref<'all' | 'upcoming' | 'draft' | 'completed'>('all');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDetailsModal = ref(false);
const showEditProfile = ref(false);
const selectedEvent = ref<EventResponseDto | null>(null);
const organizerProfile = ref(null);
const isUpdating = ref(false);

const editForm = ref({
  department: '',
  role: '',
});

// Computed
const user = computed(() => userStore.userDetails);
const myEvents = computed(() => eventsStore.events);
const loading = computed(() => eventsStore.loading);
const error = computed(() => eventsStore.error);

// Event counts by status
const draftEventsCount = computed(
  () =>
    myEvents.value.filter((event) => event.status === EventStatus.Draft).length
);

const publishedEventsCount = computed(
  () =>
    myEvents.value.filter((event) => event.status === EventStatus.Published)
      .length
);

const inProgressEventsCount = computed(
  () =>
    myEvents.value.filter((event) => event.status === EventStatus.InProgress)
      .length
);

const completedEventsCount = computed(
  () =>
    myEvents.value.filter((event) => event.status === EventStatus.Completed)
      .length
);

const upcomingEventsCount = computed(() => {
  const now = new Date();
  return myEvents.value.filter(
    (event) =>
      new Date(event.startDate) > now && event.status === EventStatus.Published
  ).length;
});

const totalParticipants = computed(() =>
  myEvents.value.reduce((total, event) => total + event.participantCount, 0)
);

// Filtered events based on current tab
const filteredEvents = computed(() => {
  const now = new Date();

  switch (currentFilter.value) {
    case 'upcoming':
      return myEvents.value
        .filter(
          (event) =>
            new Date(event.startDate) > now &&
            event.status === EventStatus.Published
        )
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

    case 'draft':
      return myEvents.value.filter(
        (event) => event.status === EventStatus.Draft
      );

    case 'completed':
      return myEvents.value
        .filter((event) => event.status === EventStatus.Completed)
        .sort(
          (a, b) =>
            new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        );

    case 'all':
    default:
      return myEvents.value.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
});

const emptyStateTitle = computed(() => {
  switch (currentFilter.value) {
    case 'upcoming':
      return 'No upcoming events';
    case 'draft':
      return 'No draft events';
    case 'completed':
      return 'No completed events';
    default:
      return 'No events created yet';
  }
});

const emptyStateMessage = computed(() => {
  switch (currentFilter.value) {
    case 'upcoming':
      return 'Publish some draft events or create new ones';
    case 'draft':
      return 'Create an event and save it as draft';
    case 'completed':
      return 'Your completed events will appear here';
    default:
      return 'Start by creating your first event';
  }
});

// Methods
const loadMyEvents = async () => {
  if (!organizerProfile.value) return;

  try {
    await eventsStore.fetchEventsByOrganizer(organizerProfile.value.id);
  } catch (error) {
    console.error('Failed to load organizer events:', error);
  }
};

const loadOrganizerProfile = async () => {
  try {
    const profile = await eventsStore.fetchMyOrganizerProfile();
    organizerProfile.value = profile;

    if (profile) {
      editForm.value = {
        department: profile.department || '',
        role: profile.role || '',
      };
    }
  } catch (error) {
    console.error('Failed to load organizer profile:', error);
    // Redirect to become organizer page if not an organizer
    await navigateTo('/events/become-organizer');
  }
};

const viewEvent = (event: EventResponseDto) => {
  selectedEvent.value = event;
  showDetailsModal.value = true;
};

const editEvent = (event: EventResponseDto) => {
  selectedEvent.value = event;
  showEditModal.value = true;
};

const deleteEvent = async (event: EventResponseDto) => {
  if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
    try {
      await eventsStore.deleteEvent(event.id);
      await loadMyEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }
};

const duplicateEvent = async (event: EventResponseDto) => {
  const duplicateData: CreateEventDto = {
    title: `${event.title} (Copy)`,
    topic: event.topic,
    description: event.description,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    endDate: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ).toISOString(), // 2 hours later
    location: event.location,
    type: event.type,
    status: EventStatus.Draft,
    isAllDay: event.isAllDay,
    isRecurring: false, // Don't duplicate recurring settings
    maxParticipants: event.maxParticipants,
    requiresApproval: event.requiresApproval,
    meetingLink: event.meetingLink,
    notes: event.notes,
    institutionId: event.institutionId,
  };

  try {
    await eventsStore.createEvent(duplicateData);
    await loadMyEvents();
  } catch (error) {
    console.error('Failed to duplicate event:', error);
  }
};

const publishEvent = async (event: EventResponseDto) => {
  try {
    await eventsStore.updateEvent(event.id, { status: EventStatus.Published });
    await loadMyEvents();
  } catch (error) {
    console.error('Failed to publish event:', error);
  }
};

const manageParticipants = (event: EventResponseDto) => {
  // Open detailed participants management
  viewEvent(event);
};

const closeModals = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  selectedEvent.value = null;
};

const handleEventSave = async (eventData: CreateEventDto | UpdateEventDto) => {
  try {
    if (showEditModal.value && selectedEvent.value) {
      await eventsStore.updateEvent(
        selectedEvent.value.id,
        eventData as UpdateEventDto
      );
    } else {
      await eventsStore.createEvent(eventData as CreateEventDto);
    }
    closeModals();
    await loadMyEvents();
  } catch (error) {
    console.error('Failed to save event:', error);
  }
};

const updateProfile = async () => {
  isUpdating.value = true;
  try {
    // Note: This would need an API endpoint to update organizer profile
    // For now, just update local state
    if (organizerProfile.value) {
      organizerProfile.value = {
        ...organizerProfile.value,
        department: editForm.value.department,
        role: editForm.value.role,
      };
    }
    showEditProfile.value = false;
  } catch (error) {
    console.error('Failed to update profile:', error);
  } finally {
    isUpdating.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await loadOrganizerProfile();
  if (organizerProfile.value) {
    await loadMyEvents();
  }
});

// Meta
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
});

useHead({
  title: 'My Organized Events - UniTrack',
});
</script>

<style scoped>
/* Smooth transitions for tab changes */
.transition-all {
  transition: all 0.3s ease;
}

/* Tab indicator animation */
.border-b-2 {
  transition: border-color 0.2s ease;
}
</style>
