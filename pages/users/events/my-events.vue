<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="border-b border-border bg-background-card">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gradient">My Events</h1>
              <p class="mt-2 text-text-secondary">
                {{ getHeaderDescription }}
              </p>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center space-x-4">
              <button
                class="border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
                @click="$router.push('/users/events')"
              >
                Browse Events
              </button>

              <!-- Only show "Become Organizer" for Teachers -->
              <button
                v-if="user?.role === 'Teacher' && !isOrganizer"
                class="bg-gradient-primary hover:scale-105 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                @click="$router.push('/users/events/become-organizer')"
              >
                Become Organizer
              </button>

              <!-- Show "Manage Events" for existing organizers -->
              <button
                v-else-if="isOrganizer"
                class="bg-gradient-primary hover:scale-105 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                @click="$router.push('/users/events/my-organized')"
              >
                Manage Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-glass rounded-xl p-6 text-center">
          <div class="text-3xl font-bold text-primary mb-2">
            {{ pendingInvitations.length }}
          </div>
          <div class="text-text-secondary text-sm">Pending Invitations</div>
        </div>
        <div class="bg-glass rounded-xl p-6 text-center">
          <div class="text-3xl font-bold text-green-400 mb-2">
            {{ acceptedEvents.length }}
          </div>
          <div class="text-text-secondary text-sm">Accepted Events</div>
        </div>
        <div class="bg-glass rounded-xl p-6 text-center">
          <div class="text-3xl font-bold text-secondary mb-2">
            {{ upcomingEvents.length }}
          </div>
          <div class="text-text-secondary text-sm">Upcoming This Week</div>
        </div>
        <div class="bg-glass rounded-xl p-6 text-center">
          <div class="text-3xl font-bold text-text-primary mb-2">
            {{ attendedEvents.length }}
          </div>
          <div class="text-text-secondary text-sm">Events Attended</div>
        </div>
      </div>

      <!-- Pending Invitations -->
      <div v-if="pendingInvitations.length > 0" class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-text-primary">
            Pending Invitations
          </h2>
          <span
            class="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm"
          >
            {{ pendingInvitations.length }} waiting
          </span>
        </div>

        <div class="space-y-4">
          <InvitationCard
            v-for="invitation in pendingInvitations"
            :key="invitation.id"
            :event="invitation"
            @respond="handleRSVP"
          />
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-text-primary">
            Upcoming Events
          </h2>
          <div class="flex items-center space-x-2">
            <button
              :class="[
                'px-3 py-1 rounded-md text-sm transition-colors',
                viewMode === 'upcoming'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary',
              ]"
              @click="viewMode = 'upcoming'"
            >
              This Week
            </button>
            <button
              :class="[
                'px-3 py-1 rounded-md text-sm transition-colors',
                viewMode === 'all'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary',
              ]"
              @click="viewMode = 'all'"
            >
              All Future
            </button>
          </div>
        </div>

        <div
          v-if="displayedUpcomingEvents.length === 0"
          class="bg-glass rounded-xl p-8 text-center"
        >
          <svg
            class="w-12 h-12 text-text-muted mx-auto mb-4"
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
          <h3 class="text-lg font-medium text-text-secondary mb-2">
            No upcoming events
          </h3>
          <p class="text-text-muted mb-4">{{ getUpcomingEmptyMessage }}</p>
          <button
            class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
            @click="$router.push('/users/events')"
          >
            Browse Events
          </button>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ParticipantEventCard
            v-for="event in displayedUpcomingEvents"
            :key="event.id"
            :event="event"
            :participation="getParticipationStatus(event.id)"
            @view="viewEventDetails"
            @rsvp="handleRSVP"
          />
        </div>
      </div>

      <!-- Event History -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-text-primary">Event History</h2>
          <div class="flex items-center space-x-2">
            <select
              v-model="historyFilter"
              class="px-3 py-1 bg-background-secondary border border-border rounded-md text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="attended">Attended</option>
              <option value="missed">Missed</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>

        <div
          v-if="filteredHistoryEvents.length === 0"
          class="bg-glass rounded-xl p-8 text-center"
        >
          <svg
            class="w-12 h-12 text-text-muted mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 class="text-lg font-medium text-text-secondary mb-2">
            No event history
          </h3>
          <p class="text-text-muted">{{ getHistoryEmptyMessage }}</p>
        </div>

        <div v-else class="space-y-4">
          <HistoryEventCard
            v-for="event in filteredHistoryEvents"
            :key="event.id"
            :event="event"
            :participation="getParticipationStatus(event.id)"
            @view="viewEventDetails"
          />
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <EventDetailsModal
      v-if="showEventDetails"
      :event-id="selectedEventId"
      @close="showEventDetails = false"
      @edit="handleEdit"
    />

    <!-- RSVP Modal -->
    <RSVPModal
      v-if="showRSVPModal"
      :event="selectedEvent"
      @close="showRSVPModal = false"
      @submit="submitRSVP"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  type EventResponseDto,
  ParticipantStatus,
  EventStatus,
  type ParticipantResponseDto,
  type UpdateParticipantStatusDto,
} from '~/interfaces/event';
import { useUserStore } from '~/stores/user';
import RSVPModal from '~/components/event/RSVPModal.vue';
import HistoryEventCard from '~/components/event/HistoryEventCard.vue';
import ParticipantEventCard from '~/components/event/ParticipantEventCard.vue';
import InvitationCard from '~/components/event/InvitationCard.vue'
const eventsStore = useEventsStore();
const userStore = useUserStore();

// State
const viewMode = ref<'upcoming' | 'all'>('upcoming');
const historyFilter = ref<'all' | 'attended' | 'missed' | 'declined'>('all');
const showEventDetails = ref(false);
const showRSVPModal = ref(false);
const selectedEventId = ref<string | null>(null);
const selectedEvent = ref<EventResponseDto | null>(null);
const organizerProfile = ref(null);

// Computed
const user = computed(() => userStore.userDetails);
const myParticipations = computed(() => eventsStore.myParticipations);
const upcomingEvents = computed(() => eventsStore.upcomingEvents);

// Check if user is an organizer
const isOrganizer = computed(() => {
  return !!organizerProfile.value;
});

// Role-based messaging
const getHeaderDescription = computed(() => {
  if (user.value?.role === 'Student') {
    return 'Track your event participations and upcoming activities';
  } else if (user.value?.role === 'Teacher' && !isOrganizer.value) {
    return 'Manage your event participations and consider organizing events';
  } else if (isOrganizer.value) {
    return 'Manage your participations and organized events';
  }
  return 'Manage your event participations and upcoming activities';
});

const getUpcomingEmptyMessage = computed(() => {
  if (user.value?.role === 'Student') {
    return 'Browse available events to join activities that interest you';
  } else if (user.value?.role === 'Teacher' && !isOrganizer.value) {
    return 'Browse events to participate or consider becoming an organizer to create events';
  } else if (isOrganizer.value) {
    return 'Browse events to participate or create your own events';
  }
  return 'Browse available events to join activities';
});

const getHistoryEmptyMessage = computed(() => {
  if (user.value?.role === 'Student') {
    return 'Your past event participations will appear here';
  } else if (user.value?.role === 'Teacher') {
    return 'Your event participation history will appear here';
  }
  return 'Your past event participations will appear here';
});

// Filter events based on participation status
const pendingInvitations = computed(() => {
  return myParticipations.value.filter((event) => {
    const participation = getParticipationStatus(event.id);
    return (
      participation?.status === ParticipantStatus.Invited ||
      participation?.status === ParticipantStatus.NoResponse
    );
  });
});

const acceptedEvents = computed(() => {
  return myParticipations.value.filter((event) => {
    const participation = getParticipationStatus(event.id);
    return participation?.status === ParticipantStatus.Accepted;
  });
});

const attendedEvents = computed(() => {
  return myParticipations.value.filter((event) => {
    return event.status === EventStatus.Completed && event.attendeeCount > 0; // User was in attendance
  });
});

const displayedUpcomingEvents = computed(() => {
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  let events = acceptedEvents.value.filter(
    (event) => new Date(event.startDate) > now
  );

  if (viewMode.value === 'upcoming') {
    events = events.filter(
      (event) => new Date(event.startDate) <= oneWeekFromNow
    );
  }

  return events.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
});

const filteredHistoryEvents = computed(() => {
  const now = new Date();
  let events = myParticipations.value.filter(
    (event) => new Date(event.endDate) < now
  );

  switch (historyFilter.value) {
    case 'attended':
      events = events.filter(
        (event) => event.attendeeCount > 0 // User attended
      );
      break;
    case 'missed':
      events = events.filter((event) => {
        const participation = getParticipationStatus(event.id);
        return (
          participation?.status === ParticipantStatus.Accepted &&
          event.attendeeCount === 0
        ); // User accepted but didn't attend
      });
      break;
    case 'declined':
      events = events.filter((event) => {
        const participation = getParticipationStatus(event.id);
        return participation?.status === ParticipantStatus.Declined;
      });
      break;
  }

  return events.sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  );
});

// Methods
const checkOrganizerStatus = async () => {
  try {
    const profile = await eventsStore.fetchMyOrganizerProfile();
    organizerProfile.value = profile;
  } catch (error: any) {
    // Not an organizer - this is normal for most users
    if (error.status !== 404) {
      console.error('Error checking organizer status:', error);
    }
  }
};

const getParticipationStatus = (
  eventId: string
): ParticipantResponseDto | null => {
  // This would come from the event details or a separate participants store
  // For now, we'll simulate it
  return {
    id: `${eventId}-${user.value?.id}`,
    userId: user.value?.id || '',
    userName: user.value
      ? `${user.value.firstName} ${user.value.lastName}`
      : '',
    userEmail: user.value?.email || '',
    status: ParticipantStatus.Invited,
    responseDate: null,
    responseNote: null,
    isRequired: false,
    createdAt: new Date().toISOString(),
  };
};

const handleRSVP = (event: EventResponseDto, status?: ParticipantStatus) => {
  selectedEvent.value = event;
  if (status) {
    // Direct RSVP response
    submitRSVP({ status, responseNote: '' });
  } else {
    // Open RSVP modal for detailed response
    showRSVPModal.value = true;
  }
};

const submitRSVP = async (rsvpData: UpdateParticipantStatusDto) => {
  if (!selectedEvent.value || !user.value?.id) return;

  try {
    await eventsStore.updateParticipantStatus(
      selectedEvent.value.id,
      user.value.id,
      rsvpData
    );

    // Refresh participations
    await loadData();
    showRSVPModal.value = false;
    selectedEvent.value = null;
  } catch (error) {
    console.error('Failed to update RSVP:', error);
  }
};

const viewEventDetails = (event: EventResponseDto) => {
  selectedEventId.value = event.id;
  showEventDetails.value = true;
};

const handleEdit = (event: EventResponseDto) => {
  // Participants can't edit events, but we might want to handle this differently
  console.log('Edit not available for participants');
};

const loadData = async () => {
  try {
    await Promise.all([
      eventsStore.fetchMyParticipations(),
      eventsStore.fetchUpcomingEvents(),
    ]);
  } catch (error) {
    console.error('Failed to load participant data:', error);
  }
};

// Lifecycle
onMounted(async () => {
  await checkOrganizerStatus();
  await loadData();
});

// Meta
definePageMeta({
  layout: 'dashboard-layout ',
});

useHead({
  title: 'My Events - UniTrack',
});
</script>

<style scoped>
/* Custom animations for smoother interactions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
