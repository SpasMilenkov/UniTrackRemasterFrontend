<template>
  <div class="min-h-screen bg-background">
    <!-- Header Section -->
    <div class="border-b border-border bg-background-card">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gradient">Events</h1>
              <p class="mt-2 text-text-secondary">
                {{ getHeaderDescription }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <!-- Stats Cards -->
              <div
                v-if="eventStats"
                class="hidden lg:flex items-center space-x-6"
              >
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary">
                    {{ eventStats.upcomingEvents }}
                  </div>
                  <div class="text-sm text-text-secondary">Upcoming</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-secondary">
                    {{ eventStats.totalEvents }}
                  </div>
                  <div class="text-sm text-text-secondary">Total</div>
                </div>
              </div>

              <!-- Action Buttons Based on User Type -->
              <div class="flex items-center space-x-3">
                <!-- For Students: Only My Events -->
                <template v-if="!isOrganizer && user?.role === 'Student'">
                  <button
                    class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                    @click="$router.push('/events/my-events')"
                  >
                    My Events
                  </button>
                </template>

                <!-- For Teachers (non-organizers): My Events + Become Organizer -->
                <template v-else-if="!isOrganizer && user?.role === 'Teacher'">
                  <button
                    class="border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
                    @click="$router.push('/events/my-events')"
                  >
                    My Events
                  </button>
                  <button
                    class="bg-gradient-primary hover:scale-105 transition-all duration-200 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 shadow-lg"
                    @click="$router.push('/users/events/become-organizer')"
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
                    <span>Become Organizer</span>
                  </button>
                </template>

                <!-- For Organizers: My Events + Create Event -->
                <template v-else-if="isOrganizer">
                  <button
                    class="border border-border hover:border-primary text-text-primary px-4 py-2 rounded-lg transition-colors"
                    @click="$router.push('/events/my-organized')"
                  >
                    My Events
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
                </template>

                <!-- Fallback for other roles or unauthenticated -->
                <template v-else>
                  <button
                    class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                    @click="$router.push('/users/events/my-events')"
                  >
                    My Events
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Navigation Tabs -->
    <div class="border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              currentTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border',
            ]"
            @click="currentTab = 'all'"
          >
            All Events
          </button>

          <button
            v-if="user"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              currentTab === 'my-participations'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border',
            ]"
            @click="currentTab = 'my-participations'"
          >
            My Participations
          </button>

          <button
            v-if="isOrganizer"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              currentTab === 'my-organized'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border',
            ]"
            @click="currentTab = 'my-organized'"
          >
            My Organized Events
          </button>

          <button
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              currentTab === 'upcoming'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border',
            ]"
            @click="currentTab = 'upcoming'"
          >
            Upcoming
          </button>
        </nav>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-glass rounded-xl p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2"
              >Search</label
            >
            <input
              v-model="filters.searchTerm"
              type="text"
              placeholder="Search events..."
              class="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Event Type -->
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2"
              >Type</label
            >
            <select
              v-model="filters.type"
              class="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Types</option>
              <option
                v-for="(label, value) in eventTypeOptions"
                :key="value"
                :value="value"
              >
                {{ label }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2"
              >Status</label
            >
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option
                v-for="(label, value) in eventStatusOptions"
                :key="value"
                :value="value"
              >
                {{ label }}
              </option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-2"
              >Date Range</label
            >
            <select
              v-model="selectedDateRange"
              class="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
              @change="updateDateFilter"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="flex justify-between items-center mt-6">
          <div class="flex items-center space-x-4">
            <button
              :disabled="isLoadingEvents"
              class="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              @click="applyFilters"
            >
              {{ isLoadingEvents ? 'Searching...' : 'Apply Filters' }}
            </button>
            <button
              class="text-text-secondary hover:text-text-primary border border-border hover:border-primary rounded-lg px-6 py-2 transition-colors"
              @click="clearFilters"
            >
              Clear
            </button>
          </div>

          <!-- View Toggle -->
          <div
            class="flex items-center space-x-2 bg-background-secondary rounded-lg p-1"
          >
            <button
              :class="[
                'px-3 py-1 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary',
              ]"
              @click="viewMode = 'grid'"
            >
              Grid
            </button>
            <button
              :class="[
                'px-3 py-1 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary',
              ]"
              @click="viewMode = 'list'"
            >
              List
            </button>
          </div>
        </div>
      </div>

      <!-- Content based on current tab -->
      <div class="transition-all duration-300">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
          />
        </div>

        <!-- Error State -->
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
            @click="loadCurrentTabData"
          >
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!currentEvents.length" class="text-center py-12">
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

          <!-- Different CTAs based on user type and current tab -->
          <div class="flex justify-center space-x-4">
            <!-- All Events Tab CTAs -->
            <template v-if="currentTab === 'all' && !hasActiveFilters">
              <!-- Students: Just browse message -->
              <div v-if="user?.role === 'Student'" class="text-center">
                <p class="text-text-muted mb-4">
                  Check back later for new events or contact your teachers about
                  upcoming activities
                </p>
              </div>

              <!-- Teachers: Can become organizers -->
              <button
                v-else-if="user?.role === 'Teacher' && !isOrganizer"
                class="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
                @click="$router.push('/users/events/become-organizer')"
              >
                Become an Organizer
              </button>

              <!-- Organizers: Can create events -->
              <button
                v-else-if="isOrganizer"
                class="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
                @click="showCreateModal = true"
              >
                Create Your First Event
              </button>
            </template>

            <button
              v-if="currentTab === 'my-participations'"
              class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
              @click="currentTab = 'all'"
            >
              Browse All Events
            </button>

            <button
              v-if="currentTab === 'my-organized' && isOrganizer"
              class="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
              @click="showCreateModal = true"
            >
              Create Your First Event
            </button>
          </div>
        </div>

        <!-- Events Display -->
        <div v-else>
          <!-- Grid View -->
          <div
            v-if="viewMode === 'grid'"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <EventCard
              v-for="event in currentEvents"
              :key="event.id"
              :event="event"
              :show-organizer-actions="isOrganizer && isMyEvent(event)"
              class="animate-fade-in hover-elevate"
              @view="viewEvent"
              @edit="editEvent"
              @delete="deleteEvent"
              @rsvp="handleRSVP"
            />
          </div>

          <!-- List View -->
          <div v-else class="space-y-4">
            <EventListItem
              v-for="event in currentEvents"
              :key="event.id"
              :event="event"
              :show-organizer-actions="isOrganizer && isMyEvent(event)"
              class="animate-fade-in"
              @view="viewEvent"
              @edit="editEvent"
              @delete="deleteEvent"
              @rsvp="handleRSVP"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Organizer Status Indicator -->
    <div
      v-if="isCheckingOrganizerStatus"
      class="fixed bottom-4 right-4 bg-background-card border border-border rounded-lg p-4 shadow-lg"
    >
      <div class="flex items-center space-x-3">
        <div
          class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"
        />
        <span class="text-text-secondary text-sm"
          >Checking organizer status...</span
        >
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
      @rsvp="handleRSVP"
    />

    <!-- RSVP Modal -->
    <RSVPModal
      v-if="showRSVPModal"
      :event="selectedEventForRSVP"
      @close="showRSVPModal = false"
      @submit="submitRSVP"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  EventStatus,
  type EventResponseDto,
  type EventFilterDto,
  EventType,
  type UpdateParticipantStatusDto,
  type CreateEventDto,
  type UpdateEventDto,
} from '~/interfaces/event';
import { useUserStore } from '~/stores/user';

// Stores
const eventsStore = useEventsStore();
const userStore = useUserStore();

// Reactive data
const currentTab = ref<
  'all' | 'my-participations' | 'my-organized' | 'upcoming'
>('all');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDetailsModal = ref(false);
const showRSVPModal = ref(false);
const selectedEvent = ref<EventResponseDto | null>(null);
const selectedEventForRSVP = ref<EventResponseDto | null>(null);
const viewMode = ref<'grid' | 'list'>('grid');
const selectedDateRange = ref('');
const isCheckingOrganizerStatus = ref(false);

// Organizer status
const organizerProfile = ref(null);

// Filters
const filters = ref<EventFilterDto>({
  searchTerm: '',
  type: undefined,
  status: undefined,
  startDate: undefined,
  endDate: undefined,
  page: 1,
  pageSize: 20,
});

// Computed
const user = computed(() => userStore.userDetails);
const events = computed(() => eventsStore.events);
const myParticipations = computed(() => eventsStore.myParticipations);
const upcomingEvents = computed(() => eventsStore.upcomingEvents);
const loading = computed(() => eventsStore.loading);
const error = computed(() => eventsStore.error);
const eventStats = computed(() => eventsStore.eventStats);
const isLoadingEvents = computed(() => eventsStore.isLoadingEvents);

// Organizer status check
const isOrganizer = computed(() => {
  return !!organizerProfile.value;
});

// Current events based on active tab
const currentEvents = computed(() => {
  switch (currentTab.value) {
    case 'all':
      return events.value;
    case 'my-participations':
      return myParticipations.value;
    case 'my-organized':
      return events.value.filter((event) => isMyEvent(event));
    case 'upcoming':
      return upcomingEvents.value;
    default:
      return events.value;
  }
});

const hasActiveFilters = computed(() => {
  return !!(
    filters.value.searchTerm ||
    filters.value.type !== undefined ||
    filters.value.status !== undefined ||
    filters.value.startDate ||
    filters.value.endDate
  );
});

const emptyStateTitle = computed(() => {
  switch (currentTab.value) {
    case 'all':
      return hasActiveFilters.value ? 'No events found' : 'No events available';
    case 'my-participations':
      return 'No participations yet';
    case 'my-organized':
      return 'No organized events';
    case 'upcoming':
      return 'No upcoming events';
    default:
      return 'No events found';
  }
});

const emptyStateMessage = computed(() => {
  switch (currentTab.value) {
    case 'all':
      if (hasActiveFilters.value) {
        return 'Try adjusting your filters';
      }
      // Role-specific messages for empty all events
      if (user.value?.role === 'Student') {
        return 'No events are currently available. Check back later for new activities!';
      } else if (user.value?.role === 'Teacher' && !isOrganizer.value) {
        return 'No events available yet. Consider becoming an organizer to create events for your students!';
      } else if (isOrganizer.value) {
        return 'Be the first to create an event for your institution';
      }
      return 'Check back later for new events';
    case 'my-participations':
      return 'Start by browsing available events and joining activities that interest you';
    case 'my-organized':
      return 'Create your first event to get started with organizing activities for your students';
    case 'upcoming':
      return 'No events scheduled for the coming week';
    default:
      return 'Try adjusting your search criteria';
  }
});

const getHeaderDescription = computed(() => {
  if (isOrganizer.value) {
    return 'Manage and create events for your institution';
  } else if (user.value?.role === 'Teacher') {
    return 'Discover events and organize activities for your students';
  } else if (user.value?.role === 'Student') {
    return 'Discover and participate in events across your institution';
  }
  return 'Discover and participate in events across your institution';
});

// Updated to use string-based enums
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

// Methods
const checkOrganizerStatus = async () => {
  isCheckingOrganizerStatus.value = true;
  try {
    const profile = await eventsStore.fetchMyOrganizerProfile();
    organizerProfile.value = profile;
  } catch (error: any) {
    // Not an organizer - this is normal for most users
    if (error.status !== 404) {
      console.error('Error checking organizer status:', error);
    }
  } finally {
    isCheckingOrganizerStatus.value = false;
  }
};

const isMyEvent = (event: EventResponseDto): boolean => {
  return (
    organizerProfile.value && event.organizerId === organizerProfile.value.id
  );
};

const loadCurrentTabData = async () => {
  try {
    switch (currentTab.value) {
      case 'all':
        await eventsStore.fetchEvents(filters.value);
        break;
      case 'my-participations':
        await eventsStore.fetchMyParticipations();
        break;
      case 'my-organized':
        if (organizerProfile.value) {
          await eventsStore.fetchEventsByOrganizer(organizerProfile.value.id);
        }
        break;
      case 'upcoming':
        await eventsStore.fetchUpcomingEvents();
        break;
    }
  } catch (error) {
    console.error('Failed to load tab data:', error);
  }
};

const loadEvents = async () => {
  await loadCurrentTabData();
};

const loadStats = async () => {
  try {
    await eventsStore.fetchEventStats();
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
};

const applyFilters = async () => {
  if (currentTab.value === 'all') {
    await eventsStore.fetchEvents(filters.value);
  } else {
    // For other tabs, filters are applied client-side
    await loadCurrentTabData();
  }
};

const clearFilters = () => {
  filters.value = {
    searchTerm: '',
    type: undefined,
    status: undefined,
    startDate: undefined,
    endDate: undefined,
    page: 1,
    pageSize: 20,
  };
  selectedDateRange.value = '';
  loadCurrentTabData();
};

const updateDateFilter = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (selectedDateRange.value) {
    case 'today':
      filters.value.startDate = today.toISOString();
      filters.value.endDate = new Date(
        today.getTime() + 24 * 60 * 60 * 1000
      ).toISOString();
      break;
    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      filters.value.startDate = weekStart.toISOString();
      filters.value.endDate = weekEnd.toISOString();
      break;
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      filters.value.startDate = monthStart.toISOString();
      filters.value.endDate = monthEnd.toISOString();
      break;
    case 'upcoming':
      filters.value.startDate = now.toISOString();
      filters.value.endDate = undefined;
      break;
    default:
      filters.value.startDate = undefined;
      filters.value.endDate = undefined;
  }
};

const viewEvent = (event: EventResponseDto) => {
  selectedEvent.value = event;
  showDetailsModal.value = true;
};

const editEvent = (event: EventResponseDto) => {
  if (isOrganizer.value && isMyEvent(event)) {
    selectedEvent.value = event;
    showEditModal.value = true;
  }
};

const deleteEvent = async (event: EventResponseDto) => {
  if (!isOrganizer.value || !isMyEvent(event)) return;

  if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
    try {
      await eventsStore.deleteEvent(event.id);
      await loadCurrentTabData();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }
};

const handleRSVP = (event: EventResponseDto) => {
  selectedEventForRSVP.value = event;
  showRSVPModal.value = true;
};

const submitRSVP = async (rsvpData: UpdateParticipantStatusDto) => {
  if (!selectedEventForRSVP.value || !user.value?.id) return;

  try {
    await eventsStore.updateParticipantStatus(
      selectedEventForRSVP.value.id,
      user.value.id,
      rsvpData
    );

    showRSVPModal.value = false;
    selectedEventForRSVP.value = null;

    // Refresh current tab data
    await loadCurrentTabData();
  } catch (error) {
    console.error('Failed to update RSVP:', error);
  }
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
    await loadCurrentTabData();
  } catch (error) {
    console.error('Failed to save event:', error);
  }
};

// Watchers
watch(currentTab, (newTab) => {
  loadCurrentTabData();
});

watch(isOrganizer, (newIsOrganizer) => {
  // If user loses organizer status and is on my-organized tab, redirect to all events
  if (!newIsOrganizer && currentTab.value === 'my-organized') {
    currentTab.value = 'all';
  }
});

watch(
  [() => filters.value.searchTerm],
  () => {
    // Debounced search
    const timeoutId = setTimeout(() => {
      if (
        filters.value.searchTerm !== undefined &&
        currentTab.value === 'all'
      ) {
        loadCurrentTabData();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  },
  { deep: true }
);

// Lifecycle
onMounted(async () => {
  await Promise.all([checkOrganizerStatus(), loadStats()]);

  // Load initial data based on default tab
  await loadCurrentTabData();
});

// Meta
definePageMeta({
  layout: 'dashboard-layout',
});

useHead({
  title: 'Events - UniTrack',
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
