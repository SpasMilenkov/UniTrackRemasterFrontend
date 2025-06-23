import type { ReactionType } from '~/enums/reaction-type.enum';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId?: string;
  groupId?: string;
  groupType?: string;
  parentMessageId?: string;
  replyToMessage?: ChatMessage;
  status: 'Sending' | 'Sent' | 'Delivered' | 'Read';
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  editedAt?: string;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  isOwnMessage: boolean;
  attachments?: MessageAttachment[];
  reactions?: MessageReactionsSummaryDto;
  replyCount?: number;
}
export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar?: string;
  otherUserId?: string;
  groupId?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  lastActivity?: string;
  onlineUserIds: string[];
}

export interface SendDirectMessageDto {
  recipientId: string;
  content: string;
  parentMessageId?: string;
}

export interface SendGroupMessageDto {
  groupId: string;
  groupType: string;
  content: string;
  parentMessageId?: string;
}

export interface GetMessagesDto {
  conversationType: string;
  otherUserId?: string;
  groupId?: string;
  page?: number;
  pageSize?: number;
  before?: string;
}

export interface TypingIndicator {
  userId: string;
  userName?: string;
  conversationType: string;
  groupId?: string;
}

export interface ConversationMember {
  userId: string;
  userName: string;
  userAvatar?: string;
  role?: string;
  joinedAt: string;
  isOnline: boolean;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  thumbnailUrl?: string;
}

// ===== REQUEST DTOs =====

export interface SendDirectMessageDto {
  recipientId: string;
  content: string;
  parentMessageId?: string;
  attachmentIds?: string[];
}

export interface SendGroupMessageDto {
  groupId: string;
  groupType: string;
  content: string;
  parentMessageId?: string;
  attachmentIds?: string[];
}

export interface GetMessagesDto {
  conversationType: string;
  otherUserId?: string;
  groupId?: string;
  page?: number;
  pageSize?: number;
}

export interface TypingIndicatorDto {
  recipientId?: string;
  groupId?: string;
  groupType?: string;
}

export interface JoinConversationDto {
  conversationType: string; // "direct" or "group"
  groupType?: string; // For group conversations
  otherUserId?: string; // For direct conversations
  groupId?: string; // For group conversations
}

export interface MarkMessagesReadDto {
  messageIds: string[];
}

export interface EditMessageDto {
  content: string;
  editReason?: string;
}

export interface DeleteMessageDto {
  isHardDelete?: boolean;
}

export interface AddReactionDto {
  reactionType: ReactionType;
}

export interface SearchMessagesDto {
  searchTerm: string;
  conversationType?: string;
  conversationId?: string;
}

export interface GetMessageEditHistoryDto {
  messageId: string;
}

export interface GetMessageReactionsDto {
  messageId: string;
}

export interface GetMessageRepliesDto {
  parentMessageId: string;
  page?: number;
  pageSize?: number;
}

// ===== RESPONSE DTOs =====

export interface GetConversationsResponseDto {
  conversations: ConversationDto[];
  totalCount: number;
}

export interface ConversationDto {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastActivity?: string;
  unreadCount: number;
  otherUserId?: string;
  otherUserName?: string;
  otherUserAvatar?: string;
  groupId?: string;
  groupType?: string;
  isOnline?: boolean;
  members?: ConversationMember[];
}

export interface GetMessagesResponseDto {
  messages: ChatMessageDto[];
  totalCount: number;
  hasMore: boolean;
}

export interface ChatMessageDto {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId?: string;
  recipientName?: string;
  groupId?: string;
  groupName?: string;
  groupType?: string;
  parentMessageId?: string;
  replyToMessage?: ChatMessageDto;
  status: 'Sending' | 'Sent' | 'Delivered' | 'Read';
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  editedAt?: string;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  isOwnMessage: boolean;
  attachments?: MessageAttachmentDto[];
  reactions?: MessageReactionsSummaryDto;
  replyCount?: number;
}

export interface MessageAttachmentDto {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  thumbnailUrl?: string;
}

export interface MessageReactionsSummaryDto {
  messageId: string;
  reactionCounts: Record<ReactionType, number>;
  userReactions: ReactionType[];
}

export interface ReactionDto {
  id: string;
  userId: string;
  userName: string;
  reactionType: ReactionType;
  reactedAt: string;
}

export interface GetMessageReactionsResponseDto {
  reactions: ReactionDto[];
  reactionCounts: Record<ReactionType, number>;
}

export interface MessageEditHistoryDto {
  id: string;
  previousContent: string;
  newContent: string;
  editedAt: string;
  editReason?: string;
}

export interface GetMessageEditHistoryResponseDto {
  editHistory: MessageEditHistoryDto[];
  totalCount: number;
}

export interface GetMessageRepliesResponseDto {
  replies: ChatMessageDto[];
  totalCount: number;
  hasMore: boolean;
}

// ===== EVENTS =====

export interface UserTypingEvent {
  userId: string;
  userName: string;
  recipientId?: string;
  groupId?: string;
  groupType?: string;
}

export interface UserStoppedTypingEvent {
  userId: string;
  recipientId?: string;
  groupId?: string;
  groupType?: string;
}

export interface ChatMessageSentEvent {
  message: ChatMessageDto;
  conversationType: string;
  conversationId: string;
}

export interface ChatMessageEditedEvent {
  messageId: string;
  newContent: string;
  editedAt: string;
  editReason?: string;
}

export interface ChatMessageDeletedEvent {
  messageId: string;
  deletedAt: string;
  isHardDelete: boolean;
}

export interface MessageReactionAddedEvent {
  reaction: ReactionDto;
  messageId: string;
}

export interface MessageReactionRemovedEvent {
  userId: string;
  messageId: string;
  reactionType: ReactionType;
}
