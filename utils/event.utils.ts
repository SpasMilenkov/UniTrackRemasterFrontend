// utils/events.ts
import {
  EventType,
  EventStatus,
  ParticipantStatus,
  AttendanceStatus,
  RecurrencePattern,
} from '~/interfaces/event/index'

// Date formatting utilities
export const formatEventDate = (
  dateString: string,
  isAllDay = false,
  includeTime = true
) => {
  const date = new Date(dateString);

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (!isAllDay && includeTime) {
    dateOptions.hour = 'numeric';
    dateOptions.minute = '2-digit';
    dateOptions.hour12 = true;
  }

  return date.toLocaleDateString('en-US', dateOptions);
};

export const formatEventDateRange = (
  startDate: string,
  endDate: string,
  isAllDay = false
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const isSameDay = start.toDateString() === end.toDateString();

  if (isAllDay) {
    if (isSameDay) {
      return start.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } else {
      return `${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`;
    }
  }

  if (isSameDay) {
    return `${start.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })} at ${start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })} - ${end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  }

  return `${start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })} - ${end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })}`;
};

export const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday';
  } else if (diffDays > 1 && diffDays <= 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < -1 && diffDays >= -7) {
    return `${Math.abs(diffDays)} days ago`;
  } else {
    return formatEventDate(dateString, false, false);
  }
};

// Label utilities
export const getEventTypeLabel = (type: EventType): string => {
  const labels = {
    [EventType.Workshop]: 'Workshop',
    [EventType.Seminar]: 'Seminar',
    [EventType.Conference]: 'Conference',
    [EventType.Meeting]: 'Meeting',
    [EventType.Training]: 'Training',
    [EventType.Social]: 'Social',
    [EventType.Other]: 'Other',
  };
  return labels[type] || 'Unknown';
};

export const getEventStatusLabel = (status: EventStatus): string => {
  const labels = {
    [EventStatus.Draft]: 'Draft',
    [EventStatus.Published]: 'Published',
    [EventStatus.Cancelled]: 'Cancelled',
    [EventStatus.Completed]: 'Completed',
    [EventStatus.InProgress]: 'In Progress',
  };
  return labels[status] || 'Unknown';
};

export const getParticipantStatusLabel = (
  status: ParticipantStatus
): string => {
  const labels = {
    [ParticipantStatus.Invited]: 'Invited',
    [ParticipantStatus.Accepted]: 'Accepted',
    [ParticipantStatus.Declined]: 'Declined',
    [ParticipantStatus.Maybe]: 'Maybe',
    [ParticipantStatus.NoResponse]: 'No Response',
  };
  return labels[status] || 'Unknown';
};

export const getAttendanceStatusLabel = (status: AttendanceStatus): string => {
  const labels = {
    [AttendanceStatus.NotCheckedIn]: 'Not Checked In',
    [AttendanceStatus.CheckedIn]: 'Checked In',
    [AttendanceStatus.CheckedOut]: 'Checked Out',
    [AttendanceStatus.NoShow]: 'No Show',
  };
  return labels[status] || 'Unknown';
};

export const getRecurrencePatternLabel = (
  pattern: RecurrencePattern
): string => {
  const labels = {
    [RecurrencePattern.None]: 'None',
    [RecurrencePattern.Daily]: 'Daily',
    [RecurrencePattern.Weekly]: 'Weekly',
    [RecurrencePattern.Monthly]: 'Monthly',
    [RecurrencePattern.Yearly]: 'Yearly',
  };
  return labels[pattern] || 'Unknown';
};

// Style utilities
export const getEventTypeClass = (type: EventType): string => {
  const classes = {
    [EventType.Workshop]: 'text-blue-400 bg-blue-500/20',
    [EventType.Seminar]: 'text-green-400 bg-green-500/20',
    [EventType.Conference]: 'text-purple-400 bg-purple-500/20',
    [EventType.Meeting]: 'text-yellow-400 bg-yellow-500/20',
    [EventType.Training]: 'text-red-400 bg-red-500/20',
    [EventType.Social]: 'text-pink-400 bg-pink-500/20',
    [EventType.Other]: 'text-gray-400 bg-gray-500/20',
  };
  return classes[type] || classes[EventType.Other];
};

export const getEventStatusClass = (status: EventStatus): string => {
  const classes = {
    [EventStatus.Draft]: 'bg-gray-500/20 text-gray-300',
    [EventStatus.Published]: 'bg-green-500/20 text-green-300',
    [EventStatus.Cancelled]: 'bg-red-500/20 text-red-300',
    [EventStatus.Completed]: 'bg-blue-500/20 text-blue-300',
    [EventStatus.InProgress]: 'bg-yellow-500/20 text-yellow-300',
  };
  return classes[status] || classes[EventStatus.Draft];
};

export const getParticipantStatusClass = (
  status: ParticipantStatus
): string => {
  const classes = {
    [ParticipantStatus.Invited]: 'bg-blue-500/20 text-blue-300',
    [ParticipantStatus.Accepted]: 'bg-green-500/20 text-green-300',
    [ParticipantStatus.Declined]: 'bg-red-500/20 text-red-300',
    [ParticipantStatus.Maybe]: 'bg-yellow-500/20 text-yellow-300',
    [ParticipantStatus.NoResponse]: 'bg-gray-500/20 text-gray-300',
  };
  return classes[status] || classes[ParticipantStatus.NoResponse];
};

export const getAttendanceStatusClass = (status: AttendanceStatus): string => {
  const classes = {
    [AttendanceStatus.NotCheckedIn]: 'bg-gray-500/20 text-gray-300',
    [AttendanceStatus.CheckedIn]: 'bg-green-500/20 text-green-300',
    [AttendanceStatus.CheckedOut]: 'bg-blue-500/20 text-blue-300',
    [AttendanceStatus.NoShow]: 'bg-red-500/20 text-red-300',
  };
  return classes[status] || classes[AttendanceStatus.NotCheckedIn];
};

// Validation utilities
export const isEventUpcoming = (startDate: string): boolean => {
  return new Date(startDate) > new Date();
};

export const isEventOngoing = (startDate: string, endDate: string): boolean => {
  const now = new Date();
  return new Date(startDate) <= now && new Date(endDate) >= now;
};

export const isEventCompleted = (endDate: string): boolean => {
  return new Date(endDate) < new Date();
};

export const canEditEvent = (status: EventStatus): boolean => {
  return status !== EventStatus.Completed && status !== EventStatus.Cancelled;
};

export const canCancelEvent = (
  status: EventStatus,
  startDate: string
): boolean => {
  return (
    status !== EventStatus.Completed &&
    status !== EventStatus.Cancelled &&
    isEventUpcoming(startDate)
  );
};

// User utilities
export const getUserInitials = (
  firstName: string,
  lastName?: string
): string => {
  if (lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  const nameParts = firstName.split(' ');
  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }
  return firstName.slice(0, 2).toUpperCase();
};

export const getFullName = (firstName: string, lastName?: string): string => {
  return lastName ? `${firstName} ${lastName}` : firstName;
};

// Search and filter utilities
export const searchEvents = (events: any[], searchTerm: string): any[] => {
  if (!searchTerm.trim()) return events;

  const term = searchTerm.toLowerCase();
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(term) ||
      event.topic.toLowerCase().includes(term) ||
      event.description?.toLowerCase().includes(term) ||
      event.location?.toLowerCase().includes(term) ||
      event.organizerName?.toLowerCase().includes(term)
  );
};

export const filterEventsByDateRange = (
  events: any[],
  startDate?: string,
  endDate?: string
): any[] => {
  if (!startDate && !endDate) return events;

  return events.filter((event) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);

    if (startDate && endDate) {
      const filterStart = new Date(startDate);
      const filterEnd = new Date(endDate);
      return eventStart >= filterStart && eventEnd <= filterEnd;
    } else if (startDate) {
      const filterStart = new Date(startDate);
      return eventEnd >= filterStart;
    } else if (endDate) {
      const filterEnd = new Date(endDate);
      return eventStart <= filterEnd;
    }

    return true;
  });
};

export const sortEvents = (
  events: any[],
  sortBy: 'date' | 'title' | 'status' = 'date',
  ascending = true
): any[] => {
  const sorted = [...events].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'date':
        compareValue =
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        break;
      case 'title':
        compareValue = a.title.localeCompare(b.title);
        break;
      case 'status':
        compareValue = a.status - b.status;
        break;
      default:
        compareValue = 0;
    }

    return ascending ? compareValue : -compareValue;
  });

  return sorted;
};

// Statistics utilities
export const calculateAttendanceRate = (
  participants: number,
  attendees: number
): number => {
  if (participants === 0) return 0;
  return Math.round((attendees / participants) * 100);
};

export const getEventDuration = (
  startDate: string,
  endDate: string
): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    const remainingMinutes = diffMinutes % 60;
    return remainingMinutes > 0
      ? `${diffHours}h ${remainingMinutes}m`
      : `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  }
};

// Export all utilities as a default object
export default {
  // Date utilities
  formatEventDate,
  formatEventDateRange,
  formatRelativeDate,

  // Label utilities
  getEventTypeLabel,
  getEventStatusLabel,
  getParticipantStatusLabel,
  getAttendanceStatusLabel,
  getRecurrencePatternLabel,

  // Style utilities
  getEventTypeClass,
  getEventStatusClass,
  getParticipantStatusClass,
  getAttendanceStatusClass,

  // Validation utilities
  isEventUpcoming,
  isEventOngoing,
  isEventCompleted,
  canEditEvent,
  canCancelEvent,

  // User utilities
  getUserInitials,
  getFullName,

  // Search and filter utilities
  searchEvents,
  filterEventsByDateRange,
  sortEvents,

  // Statistics utilities
  calculateAttendanceRate,
  getEventDuration,
};
