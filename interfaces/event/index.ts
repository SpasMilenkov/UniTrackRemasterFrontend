// enums/event.enum.ts
export enum EventType {
  Workshop = 'Workshop',
  Seminar = 'Seminar',
  Conference = 'Conference',
  Meeting = 'Meeting',
  Training = 'Training',
  Social = 'Social',
  Lecture = 'Lecture',
  Other = 'Other',
}

export enum EventStatus {
  Draft = 'Draft',
  Published = 'Published',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
  InProgress = 'InProgress',
  Scheduled = 'Scheduled'
}

export enum RecurrencePattern {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Yearly = 4,
}

export enum ParticipantStatus {
  Invited = 0,
  Accepted = 1,
  Declined = 2,
  Maybe = 3,
  NoResponse = 4,
}

export enum NotificationType {
  Invitation = 0,
  Reminder = 1,
  Update = 2,
  Cancellation = 3,
  Custom = 4,
}

export enum AttendanceStatus {
  NotCheckedIn = 0,
  CheckedIn = 1,
  CheckedOut = 2,
  NoShow = 3,
}

// interfaces/events/event-response.dto.ts
export interface EventResponseDto {
  id: string;
  title: string;
  topic: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  type: EventType;
  status: EventStatus;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  maxParticipants?: number;
  requiresApproval: boolean;
  meetingLink?: string;
  notes?: string;
  organizerId: string;
  organizerName?: string;
  institutionId?: string;
  institutionName?: string;
  participantCount: number;
  attendeeCount: number;
  createdAt: string;
  updatedAt: string;
}

// interfaces/events/event-detail-response.dto.ts
export interface EventDetailResponseDto extends EventResponseDto {
  participants: ParticipantResponseDto[];
  attenders: AttenderResponseDto[];
  notifications: EventNotificationResponseDto[];
}

// interfaces/events/create-event.dto.ts
export interface CreateEventDto {
  title: string;
  topic: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  type: EventType;
  status: EventStatus;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  maxParticipants?: number;
  requiresApproval: boolean;
  meetingLink?: string;
  notes?: string;
  institutionId?: string;
  participantUserIds?: string[];
}

// interfaces/events/update-event.dto.ts
export interface UpdateEventDto {
  title?: string;
  topic?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  type?: EventType;
  status?: EventStatus;
  isAllDay?: boolean;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  maxParticipants?: number;
  requiresApproval?: boolean;
  meetingLink?: string;
  notes?: string;
}

// interfaces/events/event-filter.dto.ts
export interface EventFilterDto {
  startDate?: string;
  endDate?: string;
  type?: EventType;
  status?: EventStatus;
  organizerId?: string;
  institutionId?: string;
  searchTerm?: string;
  isPublic?: boolean;
  page?: number;
  pageSize?: number;
}

// interfaces/events/participant-response.dto.ts
export interface ParticipantResponseDto {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: ParticipantStatus;
  responseDate?: string;
  responseNote?: string;
  isRequired: boolean;
  createdAt: string;
}

// interfaces/events/create-participant.dto.ts
export interface CreateParticipantDto {
  eventId: string;
  userId: string;
  isRequired: boolean;
}

// interfaces/events/update-participant-status.dto.ts
export interface UpdateParticipantStatusDto {
  status: ParticipantStatus;
  responseNote?: string;
}

// interfaces/events/organizer-response.dto.ts
export interface OrganizerResponseDto {
  id: string;
  userId: string;
  userName: string;
  department?: string;
  role?: string;
  canCreatePublicEvents: boolean;
  institutionId?: string;
  institutionName?: string;
  organizedEventsCount: number;
  createdAt: string;
}

// interfaces/events/create-organizer.dto.ts
export interface CreateOrganizerDto {
  userId: string;
  department?: string;
  role?: string;
  canCreatePublicEvents: boolean;
  institutionId?: string;
}

// interfaces/events/event-notification-response.dto.ts
export interface EventNotificationResponseDto {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  type: NotificationType;
  sendAt: string;
  isSent: boolean;
  message?: string;
  createdAt: string;
}

// interfaces/events/create-event-notification.dto.ts
export interface CreateEventNotificationDto {
  eventId: string;
  userId: string;
  type: NotificationType;
  sendAt: string;
  message?: string;
}

// interfaces/events/attender-response.dto.ts
export interface AttenderResponseDto {
  id: string;
  userId: string;
  userName: string;
  attendanceStatus: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  attendanceNotes?: string;
  createdAt: string;
}

// interfaces/events/event-stats.dto.ts
export interface EventStatsDto {
  totalEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  eventsByType: Record<string, number>;
  eventsByMonth: Record<string, number>;
}
