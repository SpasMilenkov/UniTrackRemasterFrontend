// stores/events.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import type { 
  EventResponseDto,
  EventDetailResponseDto,
  CreateEventDto,
  UpdateEventDto,
  EventFilterDto,
  ParticipantResponseDto,
  CreateParticipantDto,
  UpdateParticipantStatusDto,
  OrganizerResponseDto,
  CreateOrganizerDto,
  EventNotificationResponseDto,
  CreateEventNotificationDto,
  EventStatsDto
} from '~/interfaces/event/index'

export const useEventsStore = defineStore('events', () => {
  // SSR-safe early return
  if (import.meta.server) {
    return {
      // State
      events: readonly(ref([])),
      currentEvent: readonly(ref(null)),
      eventDetails: readonly(ref(null)),
      upcomingEvents: readonly(ref([])),
      myParticipations: readonly(ref([])),
      participants: readonly(ref([])),
      organizers: readonly(ref([])),
      notifications: readonly(ref([])),
      eventStats: readonly(ref(null)),
      error: readonly(ref(null)),
      loading: readonly(ref(false)),

      // Loading states
      isLoadingEvents: false,
      isLoadingEventDetails: false,
      isCreatingEvent: false,
      isUpdatingEvent: false,
      isDeletingEvent: false,
      isLoadingParticipants: false,
      isUpdatingParticipant: false,
      isLoadingStats: false,

      // Stub methods
      fetchEvents: async () => {},
      fetchEventById: async () => {},
      fetchEventDetails: async () => {},
      fetchUpcomingEvents: async () => {},
      fetchMyParticipations: async () => {},
      fetchEventsByOrganizer: async () => {},
      fetchEventsByInstitution: async () => {},
      createEvent: async () => null,
      updateEvent: async () => null,
      deleteEvent: async () => {},
      fetchEventParticipants: async () => {},
      addParticipant: async () => null,
      updateParticipantStatus: async () => null,
      removeParticipant: async () => {},
      fetchParticipantStats: async () => {},
      fetchMyOrganizerProfile: async () => null,
      createOrganizerProfile: async () => null,
      fetchOrganizersByInstitution: async () => {},
      fetchMyNotifications: async () => {},
      fetchEventNotifications: async () => {},
      createNotification: async () => null,
      deleteNotification: async () => {},
      fetchEventStats: async () => {},
      clearError: () => {},
      clearEvents: () => {},
    };
  }

  // CLIENT-ONLY implementation
  const { $apiFetch } = useNuxtApp();

  // Internal state
  const _events = ref<EventResponseDto[]>([]);
  const _currentEvent = ref<EventResponseDto | null>(null);
  const _eventDetails = ref<EventDetailResponseDto | null>(null);
  const _upcomingEvents = ref<EventResponseDto[]>([]);
  const _myParticipations = ref<EventResponseDto[]>([]);
  const _participants = ref<ParticipantResponseDto[]>([]);
  const _organizers = ref<OrganizerResponseDto[]>([]);
  const _notifications = ref<EventNotificationResponseDto[]>([]);
  const _eventStats = ref<EventStatsDto | null>(null);
  const _error = ref<string | null>(null);
  const _loading = ref(false);

  // ===== QUERIES =====

  // Events query
  const eventsQuery = (filter?: MaybeRef<EventFilterDto>) => {
    return useQuery({
      key: () => ['events', 'list', unref(filter) ? JSON.stringify(unref(filter)) : 'all'],
      query: async () => {
        const filterParams = unref(filter);
        let url = '/Events';
        
        if (filterParams) {
          const searchParams = new URLSearchParams();
          Object.entries(filterParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              searchParams.append(key, value.toString());
            }
          });
          url += `?${searchParams.toString()}`;
        }
        
        return await $apiFetch<EventResponseDto[]>(url);
      },
      enabled: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Single event query
  const eventQuery = (eventId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['events', 'single', unref(eventId) || ''],
      query: () => $apiFetch<EventResponseDto>(`/Events/${unref(eventId)}`),
      enabled: false,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Event details query
  const eventDetailsQuery = (eventId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['events', 'details', unref(eventId) || ''],
      query: () => $apiFetch<EventDetailResponseDto>(`/Events/${unref(eventId)}/details`),
      enabled: false,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Upcoming events query
  const upcomingEventsQuery = useQuery({
    key: () => ['events', 'upcoming'],
    query: () => $apiFetch<EventResponseDto[]>('/Events/upcoming'),
    enabled: false,
    staleTime: 5 * 60 * 1000,
  });

  // My participations query
  const myParticipationsQuery = useQuery({
    key: () => ['events', 'my-participations'],
    query: () => $apiFetch<EventResponseDto[]>('/Events/my-participations'),
    enabled: false,
    staleTime: 5 * 60 * 1000,
  });

  // Events by organizer query
  const eventsByOrganizerQuery = (organizerId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['events', 'organizer', unref(organizerId) || ''],
      query: () => $apiFetch<EventResponseDto[]>(`/Events/organizer/${unref(organizerId)}`),
      enabled: false,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Events by institution query
  const eventsByInstitutionQuery = (institutionId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['events', 'institution', unref(institutionId) || ''],
      query: () => $apiFetch<EventResponseDto[]>(`/Events/institution/${unref(institutionId)}`),
      enabled: false,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Event participants query
  const eventParticipantsQuery = (eventId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['events', 'participants', unref(eventId) || ''],
      query: () => $apiFetch<ParticipantResponseDto[]>(`/Events/${unref(eventId)}/participants`),
      enabled: false,
      staleTime: 3 * 60 * 1000,
    });
  };

  // Participant stats query
  const participantStatsQuery = (eventId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['events', 'participant-stats', unref(eventId) || ''],
      query: () => $apiFetch<Record<string, number>>(`/Events/${unref(eventId)}/participants/stats`),
      enabled: false,
      staleTime: 3 * 60 * 1000,
    });
  };

  // My organizer profile query
  const myOrganizerProfileQuery = useQuery({
    key: () => ['events', 'organizer', 'me'],
    query: () => $apiFetch<OrganizerResponseDto>('/Events/organizers/me'),
    enabled: false,
    staleTime: 10 * 60 * 1000,
  });

  // Organizers by institution query
  const organizersByInstitutionQuery = (institutionId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['events', 'organizers', 'institution', unref(institutionId) || ''],
      query: () => $apiFetch<OrganizerResponseDto[]>(`/Events/organizers/institution/${unref(institutionId)}`),
      enabled: false,
      staleTime: 10 * 60 * 1000,
    });
  };

  // My notifications query
  const myNotificationsQuery = useQuery({
    key: () => ['events', 'notifications', 'me'],
    query: () => $apiFetch<EventNotificationResponseDto[]>('/Events/notifications/me'),
    enabled: false,
    staleTime: 2 * 60 * 1000,
  });

  // Event notifications query
  const eventNotificationsQuery = (eventId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['events', 'notifications', 'event', unref(eventId) || ''],
      query: () => $apiFetch<EventNotificationResponseDto[]>(`/Events/${unref(eventId)}/notifications`),
      enabled: false,
      staleTime: 2 * 60 * 1000,
    });
  };

  // Event stats query
  const eventStatsQuery = useQuery({
    key: () => ['events', 'stats'],
    query: () => $apiFetch<EventStatsDto>('/Events/stats'),
    enabled: false,
    staleTime: 10 * 60 * 1000,
  });

  // ===== MUTATIONS =====

  // Create event mutation
  const createEventMutation = useMutation({
    mutation: (eventData: CreateEventDto) =>
      $apiFetch<EventResponseDto>('/Events', {
        method: 'POST',
        body: eventData,
      }),
    onSuccess: (newEvent) => {
      // Add to events list
      _events.value.unshift(newEvent);
      _currentEvent.value = newEvent;
      _error.value = null;
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      _error.value = error.message || 'Failed to create event';
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutation: ({ eventId, eventData }: { eventId: string; eventData: UpdateEventDto }) =>
      $apiFetch<EventResponseDto>(`/Events/${eventId}`, {
        method: 'PUT',
        body: eventData,
      }),
    onSuccess: (updatedEvent) => {
      // Update in events list
      const index = _events.value.findIndex(e => e.id === updatedEvent.id);
      if (index !== -1) {
        _events.value[index] = updatedEvent;
      }
      _currentEvent.value = updatedEvent;
      _error.value = null;
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      _error.value = error.message || 'Failed to update event';
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutation: (eventId: string) =>
      $apiFetch(`/Events/${eventId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, eventId) => {
      // Remove from events list
      _events.value = _events.value.filter(e => e.id !== eventId);
      if (_currentEvent.value?.id === eventId) {
        _currentEvent.value = null;
      }
      _error.value = null;
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      _error.value = error.message || 'Failed to delete event';
    },
  });

  // Add participant mutation
  const addParticipantMutation = useMutation({
    mutation: ({ eventId, userId }: { eventId: string; userId: string }) =>
      $apiFetch<ParticipantResponseDto>(`/Events/${eventId}/participants`, {
        method: 'POST',
        body: userId,
      }),
    onSuccess: (newParticipant) => {
      _participants.value.push(newParticipant);
      _error.value = null;
    },
    onError: (error) => {
      console.error('Error adding participant:', error);
      _error.value = error.message || 'Failed to add participant';
    },
  });

  // Update participant status mutation
  const updateParticipantStatusMutation = useMutation({
    mutation: ({ eventId, userId, statusData }: { 
      eventId: string; 
      userId: string; 
      statusData: UpdateParticipantStatusDto 
    }) =>
      $apiFetch<ParticipantResponseDto>(`/Events/${eventId}/participants/${userId}/status`, {
        method: 'PUT',
        body: statusData,
      }),
    onSuccess: (updatedParticipant) => {
      const index = _participants.value.findIndex(p => p.id === updatedParticipant.id);
      if (index !== -1) {
        _participants.value[index] = updatedParticipant;
      }
      _error.value = null;
    },
    onError: (error) => {
      console.error('Error updating participant status:', error);
      _error.value = error.message || 'Failed to update participant status';
    },
  });

  // Remove participant mutation
  const removeParticipantMutation = useMutation({
    mutation: ({ eventId, userId }: { eventId: string; userId: string }) =>
      $apiFetch(`/Events/${eventId}/participants/${userId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, { userId }) => {
      _participants.value = _participants.value.filter(p => p.userId !== userId);
      _error.value = null;
    },
    onError: (error) => {
      console.error('Error removing participant:', error);
      _error.value = error.message || 'Failed to remove participant';
    },
  });

  // Create organizer profile mutation
  const createOrganizerMutation = useMutation({
    mutation: (organizerData: CreateOrganizerDto) =>
      $apiFetch<OrganizerResponseDto>('/Events/organizers', {
        method: 'POST',
        body: organizerData,
      }),
    onError: (error) => {
      console.error('Error creating organizer profile:', error);
      _error.value = error.message || 'Failed to create organizer profile';
    },
  });

  // Create notification mutation
  const createNotificationMutation = useMutation({
    mutation: (notificationData: CreateEventNotificationDto) =>
      $apiFetch<EventNotificationResponseDto>('/Events/notifications', {
        method: 'POST',
        body: notificationData,
      }),
    onSuccess: (newNotification) => {
      _notifications.value.push(newNotification);
      _error.value = null;
    },
    onError: (error) => {
      console.error('Error creating notification:', error);
      _error.value = error.message || 'Failed to create notification';
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutation: (notificationId: string) =>
      $apiFetch(`/Events/notifications/${notificationId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, notificationId) => {
      _notifications.value = _notifications.value.filter(n => n.id !== notificationId);
      _error.value = null;
    },
    onError: (error) => {
      console.error('Error deleting notification:', error);
      _error.value = error.message || 'Failed to delete notification';
    },
  });

  // ===== COMPUTED =====

  const isLoadingEvents = computed(() => false); // Will be updated when queries are used
  const isLoadingEventDetails = computed(() => false);
  const isCreatingEvent = computed(() => createEventMutation.isLoading.value);
  const isUpdatingEvent = computed(() => updateEventMutation.isLoading.value);
  const isDeletingEvent = computed(() => deleteEventMutation.isLoading.value);
  const isLoadingParticipants = computed(() => false);
  const isUpdatingParticipant = computed(() => 
    updateParticipantStatusMutation.isLoading.value || 
    addParticipantMutation.isLoading.value || 
    removeParticipantMutation.isLoading.value
  );
  const isLoadingStats = computed(() => false);

  // ===== ACTION METHODS =====

  const clearError = () => {
    _error.value = null;
  };

  const clearEvents = () => {
    _events.value = [];
    _currentEvent.value = null;
    _eventDetails.value = null;
    _upcomingEvents.value = [];
    _myParticipations.value = [];
    _participants.value = [];
    _organizers.value = [];
    _notifications.value = [];
    _eventStats.value = null;
    _error.value = null;
  };

  // Event actions
  const fetchEvents = async (filter?: EventFilterDto) => {
    _loading.value = true;
    _error.value = null;
    try {
      const query = eventsQuery(ref(filter));
      await query.refetch();
      if (query.data.value) {
        _events.value = query.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch events';
      throw error;
    } finally {
      _loading.value = false;
    }
  };

  const fetchEventById = async (eventId: string) => {
    _loading.value = true;
    _error.value = null;
    try {
      const query = eventQuery(ref(eventId));
      await query.refetch();
      if (query.data.value) {
        _currentEvent.value = query.data.value;
        return query.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch event';
      throw error;
    } finally {
      _loading.value = false;
    }
  };

  const fetchEventDetails = async (eventId: string) => {
    _loading.value = true;
    _error.value = null;
    try {
      const query = eventDetailsQuery(ref(eventId));
      await query.refetch();
      if (query.data.value) {
        _eventDetails.value = query.data.value;
        return query.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch event details';
      throw error;
    } finally {
      _loading.value = false;
    }
  };

  const fetchUpcomingEvents = async () => {
    _error.value = null;
    try {
      await upcomingEventsQuery.refetch();
      if (upcomingEventsQuery.data.value) {
        _upcomingEvents.value = upcomingEventsQuery.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch upcoming events';
      throw error;
    }
  };

  const fetchMyParticipations = async () => {
    _error.value = null;
    try {
      await myParticipationsQuery.refetch();
      if (myParticipationsQuery.data.value) {
        _myParticipations.value = myParticipationsQuery.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch participations';
      throw error;
    }
  };

  const fetchEventsByOrganizer = async (organizerId: string) => {
    _error.value = null;
    try {
      const query = eventsByOrganizerQuery(ref(organizerId));
      await query.refetch();
      if (query.data.value) {
        _events.value = query.data.value;
        return query.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch organizer events';
      throw error;
    }
  };

  const fetchEventsByInstitution = async (institutionId: string) => {
    _error.value = null;
    try {
      const query = eventsByInstitutionQuery(ref(institutionId));
      await query.refetch();
      if (query.data.value) {
        _events.value = query.data.value;
        return query.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch institution events';
      throw error;
    }
  };

  const createEvent = async (eventData: CreateEventDto) => {
    clearError();
    return await createEventMutation.mutateAsync(eventData);
  };

  const updateEvent = async (eventId: string, eventData: UpdateEventDto) => {
    clearError();
    return await updateEventMutation.mutateAsync({ eventId, eventData });
  };

  const deleteEvent = async (eventId: string) => {
    clearError();
    await deleteEventMutation.mutateAsync(eventId);
  };

  // Participant actions
  const fetchEventParticipants = async (eventId: string) => {
    _error.value = null;
    try {
      const query = eventParticipantsQuery(ref(eventId));
      await query.refetch();
      if (query.data.value) {
        _participants.value = query.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch participants';
      throw error;
    }
  };

  const addParticipant = async (eventId: string, userId: string) => {
    clearError();
    return await addParticipantMutation.mutateAsync({ eventId, userId });
  };

  const updateParticipantStatus = async (
    eventId: string, 
    userId: string, 
    statusData: UpdateParticipantStatusDto
  ) => {
    clearError();
    return await updateParticipantStatusMutation.mutateAsync({ eventId, userId, statusData });
  };

  const removeParticipant = async (eventId: string, userId: string) => {
    clearError();
    await removeParticipantMutation.mutateAsync({ eventId, userId });
  };

  const fetchParticipantStats = async (eventId: string) => {
    _error.value = null;
    try {
      const query = participantStatsQuery(ref(eventId));
      await query.refetch();
      return query.data.value;
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch participant stats';
      throw error;
    }
  };

  // Organizer actions
  const fetchMyOrganizerProfile = async () => {
    _error.value = null;
    try {
      await myOrganizerProfileQuery.refetch();
      return myOrganizerProfileQuery.data.value;
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch organizer profile';
      throw error;
    }
  };

  const createOrganizerProfile = async (organizerData: CreateOrganizerDto) => {
    clearError();
    return await createOrganizerMutation.mutateAsync(organizerData);
  };

  const fetchOrganizersByInstitution = async (institutionId: string) => {
    _error.value = null;
    try {
      const query = organizersByInstitutionQuery(ref(institutionId));
      await query.refetch();
      if (query.data.value) {
        _organizers.value = query.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch organizers';
      throw error;
    }
  };

  // Notification actions
  const fetchMyNotifications = async () => {
    _error.value = null;
    try {
      await myNotificationsQuery.refetch();
      if (myNotificationsQuery.data.value) {
        _notifications.value = myNotificationsQuery.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch notifications';
      throw error;
    }
  };

  const fetchEventNotifications = async (eventId: string) => {
    _error.value = null;
    try {
      const query = eventNotificationsQuery(ref(eventId));
      await query.refetch();
      if (query.data.value) {
        _notifications.value = query.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch event notifications';
      throw error;
    }
  };

  const createNotification = async (notificationData: CreateEventNotificationDto) => {
    clearError();
    return await createNotificationMutation.mutateAsync(notificationData);
  };

  const deleteNotification = async (notificationId: string) => {
    clearError();
    await deleteNotificationMutation.mutateAsync(notificationId);
  };

  // Stats actions
  const fetchEventStats = async () => {
    _error.value = null;
    try {
      await eventStatsQuery.refetch();
      if (eventStatsQuery.data.value) {
        _eventStats.value = eventStatsQuery.data.value;
      }
    } catch (error: any) {
      _error.value = error.message || 'Failed to fetch event stats';
      throw error;
    }
  };

  return {
    // Readonly state
    events: readonly(_events),
    currentEvent: readonly(_currentEvent),
    eventDetails: readonly(_eventDetails),
    upcomingEvents: readonly(_upcomingEvents),
    myParticipations: readonly(_myParticipations),
    participants: readonly(_participants),
    organizers: readonly(_organizers),
    notifications: readonly(_notifications),
    eventStats: readonly(_eventStats),
    error: readonly(_error),
    loading: readonly(_loading),

    // Loading states
    isLoadingEvents,
    isLoadingEventDetails,
    isCreatingEvent,
    isUpdatingEvent,
    isDeletingEvent,
    isLoadingParticipants,
    isUpdatingParticipant,
    isLoadingStats,

    // Actions
    fetchEvents,
    fetchEventById,
    fetchEventDetails,
    fetchUpcomingEvents,
    fetchMyParticipations,
    fetchEventsByOrganizer,
    fetchEventsByInstitution,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEventParticipants,
    addParticipant,
    updateParticipantStatus,
    removeParticipant,
    fetchParticipantStats,
    fetchMyOrganizerProfile,
    createOrganizerProfile,
    fetchOrganizersByInstitution,
    fetchMyNotifications,
    fetchEventNotifications,
    createNotification,
    deleteNotification,
    fetchEventStats,
    clearError,
    clearEvents,

    // Query factories for external use
    eventsQuery,
    eventQuery,
    eventDetailsQuery,
    eventParticipantsQuery,
    participantStatsQuery,
    myOrganizerProfileQuery,
    organizersByInstitutionQuery,
    myNotificationsQuery,
    eventNotificationsQuery,
    eventStatsQuery,
  };
});