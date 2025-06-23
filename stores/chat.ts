// stores/chat.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import type { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';

import type {
  ChatMessageDto,
  ConversationDto,
  SendDirectMessageDto,
  SendGroupMessageDto,
  GetMessagesDto,
  TypingIndicatorDto,
  EditMessageDto,
  AddReactionDto,
  GetConversationsResponseDto,
  GetMessagesResponseDto,
  GetMessageEditHistoryResponseDto,
  GetMessageReactionsResponseDto,
  GetMessageRepliesResponseDto,
  MessageReactionsSummaryDto,
  JoinConversationDto,
  MarkMessagesReadDto,
  SearchMessagesDto,
  UserTypingEvent,
  UserStoppedTypingEvent,
} from '~/interfaces/chat';

import type { ReactionType } from '~/enums/reaction-type.enum';

export interface ChatSettings {
  notifications: boolean;
  sound: boolean;
  desktopNotifications: boolean;
  typingIndicators: boolean;
  readReceipts: boolean;
}

export interface TypingUser {
  userId: string;
  userName: string;
  userAvatar?: string;
  startedAt: string;
}

export const useChatStore = defineStore('chat', () => {
  // Get the API fetch function and utilities
  const { $apiFetch } = useNuxtApp();
  const authStore = useAuthStore();
  const userStore = useUserStore();

  // State
  const hubConnection = ref<HubConnection | null>(null);
  const connectionState = ref<
    'disconnected' | 'connecting' | 'connected' | 'reconnecting'
  >('disconnected');
  const activeConversation = ref<ConversationDto | null>(null);
  const typingUsers = ref<Map<string, TypingUser[]>>(new Map());
  const onlineUsers = ref<string[]>([]);
  const chatSettings = ref<ChatSettings>({
    notifications: true,
    sound: true,
    desktopNotifications: false,
    typingIndicators: true,
    readReceipts: true,
  });
  const typingTimeout = ref<NodeJS.Timeout | null>(null);
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 5;

  // ===== FIXED LOCAL STATE MANAGEMENT WITH PROPER REACTIVITY =====
  const localConversations = ref<ConversationDto[]>([]);
  const localUnreadCount = ref(0);

  // CRITICAL FIX: Use ref instead of reactive for Map to ensure proper reactivity
  const conversationMessages = ref<Map<string, ChatMessageDto[]>>(new Map());
  const messagesLoading = ref<Set<string>>(new Set());
  const messageGaps = ref<
    Map<string, { oldestMessageId?: string; hasMore: boolean }>
  >(new Map());

  // Track initial data load status
  const initialDataLoaded = ref(false);

  // FIXED: Add reactivity trigger for debugging
  const messageUpdateTrigger = ref(0);

  // ===== QUERIES =====

  // Conversations query - Only fetch once on initialization
  const conversationsQuery = useQuery({
    key: () => ['chat', 'conversations'],
    query: async () => {
      const result = await $apiFetch<GetConversationsResponseDto>(
        '/Chat/conversations'
      );

      // Update local state on successful fetch
      if (result.conversations) {
        localConversations.value = result.conversations;
        const totalUnread = result.conversations.reduce(
          (sum, conv) => sum + conv.unreadCount,
          0
        );
        localUnreadCount.value = totalUnread;
      }

      return result;
    },
    enabled: () => authStore.isAuthenticated && !initialDataLoaded.value,
    staleTime: 30 * 60 * 1000, // 30 minutes - very long since we update via SignalR
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Unread count query - Only fetch once on initialization
  const unreadCountQuery = useQuery({
    key: () => ['chat', 'unread-count'],
    query: async () => {
      const count = await $apiFetch<number>('/Chat/unread-count');
      localUnreadCount.value = count;
      return count;
    },
    enabled: () => authStore.isAuthenticated && !initialDataLoaded.value,
    staleTime: 30 * 60 * 1000, // 30 minutes - very long since we update via SignalR
  });

  // Messages query factory - Only fetch when needed (gaps/initial load)
  const messagesQuery = (params: MaybeRef<GetMessagesDto | null>) => {
    return useQuery({
      key: () => {
        const p = unref(params);
        if (!p) return ['chat', 'messages', 'null'];
        return [
          'chat',
          'messages',
          p.conversationType,
          p.otherUserId || p.groupId || '',
          p.page || 1,
        ];
      },
      query: async () => {
        const p = unref(params);
        if (!p) throw new Error('Messages params required');

        const conversationId = p.otherUserId || p.groupId || '';
        messagesLoading.value.add(conversationId);

        try {
          console.log(
            '🔄 Fetching messages for conversation:',
            conversationId,
            p
          );

          const result = await $apiFetch<GetMessagesResponseDto>(
            '/Chat/messages',
            {
              params: p,
            }
          );

          console.log(
            '✅ Messages fetched:',
            result.messages?.length || 0,
            'messages'
          );

          // Update local messages state with query results
          if (result.messages) {
            updateLocalMessages(conversationId, result.messages, p.page === 1);

            // Update gap tracking
            messageGaps.value.set(conversationId, {
              oldestMessageId: result.messages[0]?.id,
              hasMore: result.hasMore || false,
            });
          }

          return result;
        } finally {
          messagesLoading.value.delete(conversationId);
        }
      },
      enabled: () => !!unref(params),
      staleTime: 15 * 60 * 1000, // 15 minutes - longer since we update via SignalR
    });
  };

  // Search and other queries - keep as-is but with longer stale times
  const messageSearchQuery = (
    searchDto: MaybeRef<SearchMessagesDto | null>
  ) => {
    return useQuery({
      key: () => {
        const dto = unref(searchDto);
        if (!dto) return ['chat', 'search', 'null'];
        return [
          'chat',
          'search',
          dto.searchTerm,
          dto.conversationType || '',
          dto.conversationId || '',
        ];
      },
      query: async () => {
        const dto = unref(searchDto);
        if (!dto || !dto.searchTerm || dto.searchTerm.length < 2) {
          return { results: [] };
        }

        const messages = await $apiFetch<ChatMessageDto[]>('/Chat/search', {
          method: 'POST',
          body: dto,
        });
        return { results: messages };
      },
      enabled: () => {
        const dto = unref(searchDto);
        return !!dto && !!dto.searchTerm && dto.searchTerm.length >= 2;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Keep other single-use queries as-is with longer stale times
  const messageQuery = (messageId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['chat', 'message', unref(messageId) || ''],
      query: () =>
        $apiFetch<ChatMessageDto>(`/Chat/messages/${unref(messageId)}`),
      enabled: () => !!unref(messageId),
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  const messageEditHistoryQuery = (messageId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['chat', 'edit-history', unref(messageId) || ''],
      query: () =>
        $apiFetch<GetMessageEditHistoryResponseDto>(
          `/Chat/messages/${unref(messageId)}/edit-history`
        ),
      enabled: () => !!unref(messageId),
      staleTime: 15 * 60 * 1000,
    });
  };

  const messageReactionsQuery = (messageId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['chat', 'reactions', unref(messageId) || ''],
      query: () =>
        $apiFetch<GetMessageReactionsResponseDto>(
          `/Chat/messages/${unref(messageId)}/reactions`
        ),
      enabled: () => !!unref(messageId),
      staleTime: 10 * 60 * 1000,
    });
  };

  const messageRepliesQuery = (
    parentMessageId: MaybeRef<string | null>,
    page: MaybeRef<number> = ref(1)
  ) => {
    return useQuery({
      key: () => ['chat', 'replies', unref(parentMessageId) || '', unref(page)],
      query: () =>
        $apiFetch<GetMessageRepliesResponseDto>(
          `/Chat/messages/${unref(parentMessageId)}/replies`,
          {
            params: { page: unref(page), pageSize: 20 },
          }
        ),
      enabled: () => !!unref(parentMessageId),
      staleTime: 10 * 60 * 1000,
    });
  };

  // ===== FIXED LOCAL STATE MANAGEMENT METHODS WITH PROPER REACTIVITY =====

  const getConversationId = (conversation: ConversationDto): string => {
    return conversation.otherUserId || conversation.groupId || conversation.id;
  };

  const updateLocalMessages = (
    conversationId: string,
    messages: ChatMessageDto[],
    isInitialLoad = false
  ) => {
    console.log(
      '📝 Updating local messages:',
      conversationId,
      messages.length,
      'isInitial:',
      isInitialLoad
    );

    const sortedMessages = [...messages].sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );

    // CRITICAL FIX: Create new Map to trigger reactivity
    const newMap = new Map(conversationMessages.value);

    if (isInitialLoad) {
      newMap.set(conversationId, sortedMessages);
    } else {
      // Merge with existing messages (for pagination)
      const existing = newMap.get(conversationId) || [];
      const merged = [...sortedMessages, ...existing];

      // Remove duplicates and sort
      const unique = merged
        .filter(
          (msg, index, self) => self.findIndex((m) => m.id === msg.id) === index
        )
        .sort(
          (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );

      newMap.set(conversationId, unique);
    }

    // CRITICAL FIX: Assign new Map to trigger reactivity
    conversationMessages.value = newMap;
    messageUpdateTrigger.value++;

    console.log(
      '✅ Local messages updated. Total messages now:',
      newMap.get(conversationId)?.length || 0
    );
  };

  const addLocalMessage = (message: ChatMessageDto) => {
    const conversationId = message.recipientId || message.groupId || '';

    console.log('➕ Adding local message:', {
      id: message.id,
      conversationId,
      content: message.content.substring(0, 50),
      isOwnMessage: message.isOwnMessage,
    });

    // CRITICAL FIX: Create new Map to trigger reactivity
    const newMap = new Map(conversationMessages.value);
    const currentMessages = newMap.get(conversationId) || [];

    // Check if message already exists (avoid duplicates)
    const existingIndex = currentMessages.findIndex((m) => m.id === message.id);
    if (existingIndex >= 0) {
      // Update existing message
      const updatedMessages = [...currentMessages];
      updatedMessages[existingIndex] = {
        ...currentMessages[existingIndex],
        ...message,
      };
      newMap.set(conversationId, updatedMessages);
      console.log('🔄 Updated existing message:', message.id);
    } else {
      // Add new message in correct chronological position
      const newMessages = [...currentMessages];
      const insertIndex = newMessages.findIndex(
        (m) => new Date(m.sentAt).getTime() > new Date(message.sentAt).getTime()
      );

      if (insertIndex >= 0) {
        newMessages.splice(insertIndex, 0, message);
      } else {
        newMessages.push(message);
      }

      newMap.set(conversationId, newMessages);
      console.log(
        '➕ Added new message:',
        message.id,
        'Total messages now:',
        newMessages.length
      );
    }

    // CRITICAL FIX: Assign new Map to trigger reactivity
    conversationMessages.value = newMap;
    messageUpdateTrigger.value++;
  };

  const updateLocalMessage = (
    messageId: string,
    updates: Partial<ChatMessageDto>
  ) => {
    console.log('🔄 Updating local message:', messageId, updates);

    // CRITICAL FIX: Create new Map to trigger reactivity
    const newMap = new Map(conversationMessages.value);
    let updated = false;

    newMap.forEach((messages, conversationId) => {
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex >= 0) {
        const updatedMessages = [...messages];
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          ...updates,
        };
        newMap.set(conversationId, updatedMessages);
        updated = true;
        console.log('✅ Updated message in conversation:', conversationId);
      }
    });

    if (updated) {
      // CRITICAL FIX: Assign new Map to trigger reactivity
      conversationMessages.value = newMap;
      messageUpdateTrigger.value++;
    }
  };

  const removeLocalMessage = (messageId: string) => {
    console.log('🗑️ Removing local message:', messageId);

    // CRITICAL FIX: Create new Map to trigger reactivity
    const newMap = new Map(conversationMessages.value);
    let removed = false;

    newMap.forEach((messages, conversationId) => {
      const filteredMessages = messages.filter((m) => m.id !== messageId);
      if (filteredMessages.length !== messages.length) {
        newMap.set(conversationId, filteredMessages);
        removed = true;
        console.log('✅ Removed message from conversation:', conversationId);
      }
    });

    if (removed) {
      // CRITICAL FIX: Assign new Map to trigger reactivity
      conversationMessages.value = newMap;
      messageUpdateTrigger.value++;
    }
  };

  const updateLocalMessageReactions = (
    messageId: string,
    reactions: MessageReactionsSummaryDto
  ) => {
    console.log('🎭 Updating message reactions:', messageId);

    // CRITICAL FIX: Create new Map to trigger reactivity
    const newMap = new Map(conversationMessages.value);
    let updated = false;

    newMap.forEach((messages, conversationId) => {
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex >= 0) {
        const updatedMessages = [...messages];
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          reactions,
        };
        newMap.set(conversationId, updatedMessages);
        updated = true;
        console.log('✅ Updated reactions in conversation:', conversationId);
      }
    });

    if (updated) {
      // CRITICAL FIX: Assign new Map to trigger reactivity
      conversationMessages.value = newMap;
      messageUpdateTrigger.value++;
    }
  };

  // Update local conversation data
  const updateLocalConversation = (updatedConversation: ConversationDto) => {
    const index = localConversations.value.findIndex(
      (c) => c.id === updatedConversation.id
    );

    if (index >= 0) {
      localConversations.value[index] = {
        ...localConversations.value[index],
        ...updatedConversation,
      };
    } else {
      localConversations.value.push(updatedConversation);
    }

    // Update unread count
    const totalUnread = localConversations.value.reduce(
      (sum, conv) => sum + conv.unreadCount,
      0
    );
    localUnreadCount.value = totalUnread;
  };

  const updateConversationLastMessage = (message: ChatMessageDto) => {
    const conversationId = message.recipientId || message.groupId || '';
    const conversation = localConversations.value.find(
      (c) => getConversationId(c) === conversationId
    );

    if (conversation) {
      updateLocalConversation({
        ...conversation,
        lastMessage: message,
        lastActivity: message.sentAt,
        unreadCount: message.isOwnMessage
          ? conversation.unreadCount
          : conversation.unreadCount + 1,
      });
    }
  };

  // ===== MUTATIONS =====

  const sendDirectMessageMutation = useMutation({
    mutation: (dto: SendDirectMessageDto) => {
      return $apiFetch<ChatMessageDto>('/Chat/messages/direct', {
        method: 'POST',
        body: dto,
      });
    },
    onSuccess: (message) => {
      // Local state is updated via SignalR or optimistic updates
      // No need to refetch conversations here
      if (chatSettings.value.sound) {
        playNotificationSound();
      }
    },
    onError: (error) => {
      console.error('Failed to send direct message:', error);
      showNotification('Failed to send message', 'error');
    },
  });

  const sendGroupMessageMutation = useMutation({
    mutation: (dto: SendGroupMessageDto) => {
      return $apiFetch<ChatMessageDto>('/Chat/messages/group', {
        method: 'POST',
        body: dto,
      });
    },
    onSuccess: (message) => {
      // Local state is updated via SignalR or optimistic updates
      if (chatSettings.value.sound) {
        playNotificationSound();
      }
    },
    onError: (error) => {
      console.error('Failed to send group message:', error);
      showNotification('Failed to send message', 'error');
    },
  });

  const markMessagesAsReadMutation = useMutation({
    mutation: (dto: MarkMessagesReadDto) => {
      return $apiFetch('/Chat/messages/read', {
        method: 'POST',
        body: dto,
      });
    },
    onSuccess: (_, { messageIds }) => {
      // Update local state immediately - no need to refetch
      messageIds.forEach((messageId) => {
        updateLocalMessage(messageId, {
          status: 'Read',
          readAt: new Date().toISOString(),
        });
      });

      // Update conversation unread count locally
      if (activeConversation.value) {
        const updatedConversation = {
          ...activeConversation.value,
          unreadCount: Math.max(
            0,
            activeConversation.value.unreadCount - messageIds.length
          ),
        };
        updateLocalConversation(updatedConversation);
      }
    },
  });

  // Keep other mutations as-is but remove unnecessary refetch calls
  const editMessageMutation = useMutation({
    mutation: ({
      messageId,
      dto,
    }: {
      messageId: string;
      dto: EditMessageDto;
    }) => {
      return $apiFetch<ChatMessageDto>(`/Chat/messages/${messageId}`, {
        method: 'PUT',
        body: dto,
      });
    },
    onSuccess: (editedMessage) => {
      updateLocalMessage(editedMessage.id, editedMessage);
    },
  });

  const deleteMessageMutation = useMutation({
    mutation: ({
      messageId,
      isHardDelete = false,
    }: {
      messageId: string;
      isHardDelete?: boolean;
    }) => {
      return $apiFetch(`/Chat/messages/${messageId}`, {
        method: 'DELETE',
        params: { isHardDelete },
      });
    },
    onSuccess: (_, { messageId, isHardDelete }) => {
      if (isHardDelete) {
        removeLocalMessage(messageId);
      } else {
        updateLocalMessage(messageId, {
          isDeleted: true,
          deletedAt: new Date().toISOString(),
        });
      }
    },
  });

  const addReactionMutation = useMutation({
    mutation: ({
      messageId,
      dto,
    }: {
      messageId: string;
      dto: AddReactionDto;
    }) => {
      console.log('➕ Adding reaction via API:', dto);
      return $apiFetch<MessageReactionsSummaryDto>(
        `/Chat/messages/${messageId}/reactions`,
        {
          method: 'POST',
          body: dto,
        }
      );
    },
    onSuccess: (reactions, { messageId }) => {
      updateLocalMessageReactions(messageId, reactions);
    },
  });

  const removeReactionMutation = useMutation({
    mutation: ({
      messageId,
      dto,
    }: {
      messageId: string;
      dto: AddReactionDto;
    }) => {
      return $apiFetch<MessageReactionsSummaryDto>(
        `/Chat/messages/${messageId}/reactions`,
        {
          method: 'DELETE',
          body: dto,
        }
      );
    },
    onSuccess: (reactions, { messageId }) => {
      updateLocalMessageReactions(messageId, reactions);
    },
  });

  // ===== WATCHERS (SIMPLIFIED) =====

  // Only watch for initial data load completion
  watch(
    () => [conversationsQuery.data.value, unreadCountQuery.data.value],
    ([conversations, unreadCount]) => {
      if (conversations && unreadCount !== undefined) {
        initialDataLoaded.value = true;
      }
    },
    { immediate: true }
  );

  // ===== COMPUTED (USE LOCAL STATE) =====

  const conversations = computed(() => {
    return [...localConversations.value].sort((a, b) => {
      const aTime = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
      const bTime = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
      return bTime - aTime;
    });
  });

  const activeConversationMessages = computed(() => {
    if (!activeConversation.value) return [];
    const conversationId = getConversationId(activeConversation.value);
    const messages = conversationMessages.value.get(conversationId) || [];

    // FIXED: Add dependency on trigger to force reactivity
    messageUpdateTrigger.value; // This forces the computed to re-evaluate

    console.log('🔄 Computing active conversation messages:', {
      conversationId,
      messageCount: messages.length,
      trigger: messageUpdateTrigger.value,
    });

    return messages;
  });

  const unreadCount = computed(() => localUnreadCount.value);

  const isConnected = computed(() => connectionState.value === 'connected');

  const activeTypingUsers = computed(() => {
    if (!activeConversation.value) return [];
    const conversationId =
      activeConversation.value.otherUserId ||
      activeConversation.value.groupId ||
      '';
    return typingUsers.value.get(conversationId) || [];
  });

  const isUserOnline = computed(() => (userId: string) => {
    return onlineUsers.value.includes(userId);
  });

  // ===== ENHANCED SIGNALR SETUP =====

  const initializeConnection = async () => {
    if (hubConnection.value && connectionState.value === 'connected') {
      return;
    }

    if (!authStore.isAuthenticated) {
      console.error('User not authenticated');
      return;
    }

    console.log('🔌 Initializing SignalR connection...');
    connectionState.value = 'connecting';

    try {
      const config = useRuntimeConfig();

      hubConnection.value = new signalR.HubConnectionBuilder()
        .withUrl(`${config.public.socketURL}/hubs/chat`, {
          transport:
            signalR.HttpTransportType.WebSockets |
            signalR.HttpTransportType.ServerSentEvents,
          skipNegotiation: false,
          withCredentials: true,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            reconnectAttempts.value = retryContext.previousRetryCount;
            if (retryContext.previousRetryCount >= maxReconnectAttempts) {
              return null;
            }
            return Math.min(
              1000 * Math.pow(2, retryContext.previousRetryCount),
              30000
            );
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Setup event handlers
      setupEventHandlers();

      // Start connection
      await hubConnection.value.start();
      connectionState.value = 'connected';
      reconnectAttempts.value = 0;
      console.log('✅ SignalR connected successfully');

      // Get initial online users
      if (hubConnection.value.state === signalR.HubConnectionState.Connected) {
        try {
          const users =
            await hubConnection.value.invoke<string[]>('GetOnlineUsers');
          onlineUsers.value = users || [];
        } catch (error) {
          console.error('Failed to get online users:', error);
        }
      }

      // Load initial data ONLY if not already loaded
      if (!initialDataLoaded.value) {
        await Promise.all([
          conversationsQuery.refetch(),
          unreadCountQuery.refetch(),
        ]);
      }
    } catch (error) {
      console.error('SignalR connection failed:', error);
      connectionState.value = 'disconnected';

      if (reconnectAttempts.value < maxReconnectAttempts) {
        const delay = Math.min(
          5000,
          1000 * Math.pow(2, reconnectAttempts.value)
        );
        setTimeout(() => initializeConnection(), delay);
      }
    }
  };

  const setupEventHandlers = () => {
    if (!hubConnection.value) return;

    console.log('🔧 Setting up SignalR event handlers...');

    // Connection events
    hubConnection.value.onreconnecting(() => {
      connectionState.value = 'reconnecting';
      showNotification('Reconnecting to chat...', 'warning');
    });

    hubConnection.value.onreconnected(() => {
      connectionState.value = 'connected';
      reconnectAttempts.value = 0;
      showNotification('Chat reconnected', 'success');

      // Only sync critical data on reconnection - no full refetch
      syncOnlineUsers();
    });

    hubConnection.value.onclose(() => {
      connectionState.value = 'disconnected';
      showNotification('Chat disconnected', 'error');
    });

    // ENHANCED: Message events with better logging and error handling
    hubConnection.value.on(
      'ReceiveDirectMessage',
      (message: ChatMessageDto) => {
        console.log('🔥 SignalR: Received direct message:', {
          id: message.id,
          senderId: message.senderId,
          content: message.content.substring(0, 50),
          isOwnMessage: message.isOwnMessage,
        });

        try {
          handleNewMessage(message);
        } catch (error) {
          console.error('❌ Error handling direct message:', error);
        }
      }
    );

    hubConnection.value.on('ReceiveGroupMessage', (message: ChatMessageDto) => {
      console.log('🔥 SignalR: Received group message:', {
        id: message.id,
        senderId: message.senderId,
        groupId: message.groupId,
        content: message.content.substring(0, 50),
        isOwnMessage: message.isOwnMessage,
      });

      try {
        handleNewMessage(message);
      } catch (error) {
        console.error('❌ Error handling group message:', error);
      }
    });

    // ENHANCED: Message status events with logging
    hubConnection.value.on(
      'MessageDelivered',
      (data: { messageId: string; deliveredAt: string }) => {
        console.log('📬 SignalR: Message delivered:', data.messageId);
        try {
          updateLocalMessage(data.messageId, {
            status: 'Delivered',
            deliveredAt: data.deliveredAt,
          });
        } catch (error) {
          console.error('❌ Error updating message delivery status:', error);
        }
      }
    );

    hubConnection.value.on(
      'MessagesRead',
      (data: { messageIds: string[]; readBy: string; readAt: string }) => {
        console.log(
          '👁️ SignalR: Messages read:',
          data.messageIds.length,
          'messages'
        );
        try {
          data.messageIds.forEach((messageId) => {
            updateLocalMessage(messageId, {
              status: 'Read',
              readAt: data.readAt,
            });
          });
        } catch (error) {
          console.error('❌ Error updating message read status:', error);
        }
      }
    );

    // ENHANCED: Message edit/delete events with logging
    hubConnection.value.on(
      'MessageEdited',
      (data: {
        messageId: string;
        content: string;
        editedAt: string;
        isEdited: boolean;
        editReason?: string;
      }) => {
        console.log('✏️ SignalR: Message edited:', data.messageId);
        try {
          updateLocalMessage(data.messageId, {
            content: data.content,
            editedAt: data.editedAt,
            isEdited: true,
          });
        } catch (error) {
          console.error('❌ Error handling message edit:', error);
        }
      }
    );

    hubConnection.value.on(
      'MessageDeleted',
      (data: {
        messageId: string;
        isHardDelete: boolean;
        deletedAt: string;
        deletedBy: string;
      }) => {
        console.log(
          '🗑️ SignalR: Message deleted:',
          data.messageId,
          'hard:',
          data.isHardDelete
        );
        try {
          if (data.isHardDelete) {
            removeLocalMessage(data.messageId);
          } else {
            updateLocalMessage(data.messageId, {
              isDeleted: true,
              deletedAt: data.deletedAt,
            });
          }
        } catch (error) {
          console.error('❌ Error handling message deletion:', error);
        }
      }
    );

    // ENHANCED: Reaction events with logging
    hubConnection.value.on(
      'ReactionAdded',
      (data: {
        messageId: string;
        userId: string;
        userName: string;
        reactionType: ReactionType;
        reactionCounts: Record<ReactionType, number>;
        timestamp: string;
      }) => {
        console.log(
          '🎭 SignalR: Reaction added:',
          data.reactionType,
          'to message:',
          data.messageId
        );
        try {
          updateLocalMessageReactions(data.messageId, {
            messageId: data.messageId,
            reactionCounts: data.reactionCounts,
            userReactions: [],
          });
        } catch (error) {
          console.error('❌ Error handling reaction addition:', error);
        }
      }
    );

    hubConnection.value.on(
      'ReactionRemoved',
      (data: {
        messageId: string;
        userId: string;
        reactionType: ReactionType;
        reactionCounts: Record<ReactionType, number>;
        timestamp: string;
      }) => {
        console.log(
          '🎭 SignalR: Reaction removed:',
          data.reactionType,
          'from message:',
          data.messageId
        );
        try {
          updateLocalMessageReactions(data.messageId, {
            messageId: data.messageId,
            reactionCounts: data.reactionCounts,
            userReactions: [],
          });
        } catch (error) {
          console.error('❌ Error handling reaction removal:', error);
        }
      }
    );

    // Typing events
    hubConnection.value.on('UserTyping', (data: UserTypingEvent) => {
      addTypingUser(data);
    });

    hubConnection.value.on(
      'UserStoppedTyping',
      (data: UserStoppedTypingEvent) => {
        removeTypingUser(data.userId, data.groupId);
      }
    );

    // Online status events
    hubConnection.value.on('UserOnline', (userId: string) => {
      if (!onlineUsers.value.includes(userId)) {
        onlineUsers.value.push(userId);
      }
    });

    hubConnection.value.on('UserOffline', (userId: string) => {
      onlineUsers.value = onlineUsers.value.filter((id) => id !== userId);
    });

    hubConnection.value.on('UsersOnline', (userIds: string[]) => {
      onlineUsers.value = userIds;
    });

    // Conversation events - UPDATE LOCAL STATE ONLY
    hubConnection.value.on(
      'ConversationUpdated',
      (conversation: ConversationDto) => {
        updateLocalConversation(conversation);
      }
    );

    hubConnection.value.on('UnreadCountChanged', (count: number) => {
      localUnreadCount.value = count;
    });

    console.log('✅ SignalR event handlers set up successfully');
  };

  // FIXED: Enhanced message handling with better reactivity and logging
  const handleNewMessage = (message: ChatMessageDto) => {
    console.log('📨 Handling new message via SignalR:', {
      id: message.id,
      content: message.content.substring(0, 50),
      senderId: message.senderId,
      isOwnMessage: message.isOwnMessage,
      conversationId: message.recipientId || message.groupId,
    });

    const conversationId = message.recipientId || message.groupId || '';
    const currentMessages =
      conversationMessages.value.get(conversationId) || [];

    // Check for existing temp message to replace
    const existingMessage = currentMessages.find(
      (m) =>
        m.id === message.id ||
        (m.content === message.content &&
          m.senderId === message.senderId &&
          Math.abs(
            new Date(m.sentAt).getTime() - new Date(message.sentAt).getTime()
          ) < 5000)
    );

    if (existingMessage?.id.startsWith('temp-')) {
      console.log(
        '🔄 Replacing temp message:',
        existingMessage.id,
        'with:',
        message.id
      );
      removeLocalMessage(existingMessage.id);
      addLocalMessage(message);
    } else if (!existingMessage) {
      console.log('➕ Adding completely new message:', message.id);
      addLocalMessage(message);
    } else {
      console.log('⚠️ Message already exists, skipping:', message.id);
    }

    // Update conversation state locally
    updateConversationLastMessage(message);

    // Handle notifications for non-own messages
    if (!message.isOwnMessage) {
      if (chatSettings.value.notifications) {
        showMessageNotification(message);
      }
      if (chatSettings.value.sound) {
        playNotificationSound();
      }
    }

    console.log('✅ Message handling complete');
  };

  // Helper method to sync online users without full refetch
  const syncOnlineUsers = async () => {
    if (hubConnection.value?.state === signalR.HubConnectionState.Connected) {
      try {
        const users =
          await hubConnection.value.invoke<string[]>('GetOnlineUsers');
        onlineUsers.value = users || [];
      } catch (error) {
        console.error('Failed to sync online users:', error);
      }
    }
  };

  // FIXED: conversation joining with proper message loading
  const joinConversation = async (conversation: ConversationDto) => {
    if (
      !hubConnection.value ||
      hubConnection.value.state !== signalR.HubConnectionState.Connected
    ) {
      console.error('Hub connection not available');
      return;
    }

    if (!authStore.isAuthenticated) {
      console.error('User not authenticated');
      return;
    }

    console.log('🔄 Joining conversation:', conversation.id);

    activeConversation.value = conversation;
    const conversationId = getConversationId(conversation);

    try {
      const dto: JoinConversationDto = {
        conversationType: conversation.type,
        otherUserId: conversation.otherUserId,
        groupId: conversation.groupId,
      };

      await hubConnection.value.invoke('JoinConversation', dto);

      // FIXED: Always load messages when joining a conversation
      // Check if we have messages and they're sufficient, otherwise fetch
      const existingMessages =
        conversationMessages.value.get(conversationId) || [];
      const shouldFetchMessages = existingMessages.length === 0; // Or add other conditions

      if (shouldFetchMessages) {
        const params: GetMessagesDto = {
          conversationType: conversation.type,
          otherUserId: conversation.otherUserId,
          groupId: conversation.groupId,
          page: 1,
          pageSize: 50,
        };

        console.log('🔄 Fetching messages for conversation:', conversationId);
        const messagesQueryResult = messagesQuery(ref(params));
        await messagesQueryResult.refetch();
      } else {
        console.log(
          '📂 Using cached messages for conversation:',
          conversationId,
          existingMessages.length
        );
      }

      // Mark messages as read - update local state
      const messages = conversationMessages.value.get(conversationId) || [];
      const unreadMessageIds = messages
        .filter((m) => !m.isOwnMessage && m.status !== 'Read')
        .map((m) => m.id);

      if (unreadMessageIds.length > 0) {
        await markMessagesAsReadMutation.mutateAsync({
          messageIds: unreadMessageIds,
        });
      }

      console.log('✅ Successfully joined conversation:', conversationId);
    } catch (error) {
      console.error('❌ Failed to join conversation:', error);
    }
  };

  // Rest of the methods remain the same...
  const leaveConversation = async () => {
    if (!hubConnection.value || !activeConversation.value) return;
    if (!authStore.isAuthenticated) {
      console.error('User not authenticated');
      return;
    }

    try {
      const dto: JoinConversationDto = {
        conversationType: activeConversation.value.type,
        otherUserId: activeConversation.value.otherUserId,
        groupId: activeConversation.value.groupId,
      };

      await hubConnection.value.invoke('LeaveConversation', dto);
      activeConversation.value = null;
    } catch (error) {
      console.error('Failed to leave conversation:', error);
    }
  };

  // Keep other methods the same (typing, sending messages, etc.)
  const addTypingUser = (event: UserTypingEvent) => {
    const conversationId = event.groupId || event.recipientId || '';
    const users = typingUsers.value.get(conversationId) || [];

    if (!users.find((u) => u.userId === event.userId)) {
      users.push({
        userId: event.userId,
        userName: event.userName,
        startedAt: new Date().toISOString(),
      });
      typingUsers.value.set(conversationId, users);
    }

    setTimeout(() => {
      removeTypingUser(event.userId, conversationId);
    }, 3000);
  };

  const removeTypingUser = (userId: string, conversationId?: string) => {
    if (conversationId) {
      const users = typingUsers.value.get(conversationId) || [];
      typingUsers.value.set(
        conversationId,
        users.filter((u) => u.userId !== userId)
      );
    } else {
      typingUsers.value.forEach((users, key) => {
        typingUsers.value.set(
          key,
          users.filter((u) => u.userId !== userId)
        );
      });
    }
  };

  const startTyping = async () => {
    if (!hubConnection.value || !activeConversation.value) return;

    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value);
    }

    try {
      const dto: TypingIndicatorDto = {
        recipientId: activeConversation.value.otherUserId,
        groupId: activeConversation.value.groupId,
        groupType:
          activeConversation.value.type === 'group'
            ? activeConversation.value.groupType
            : undefined,
      };

      await hubConnection.value.invoke('StartTyping', dto);

      typingTimeout.value = setTimeout(() => {
        stopTyping();
      }, 2000);
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  };

  const stopTyping = async () => {
    if (!hubConnection.value || !activeConversation.value) return;

    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value);
      typingTimeout.value = null;
    }

    try {
      const dto: TypingIndicatorDto = {
        recipientId: activeConversation.value.otherUserId,
        groupId: activeConversation.value.groupId,
        groupType:
          activeConversation.value.type === 'group'
            ? activeConversation.value.groupType
            : undefined,
      };

      await hubConnection.value.invoke('StopTyping', dto);
    } catch (error) {
      console.error('Failed to stop typing indicator:', error);
    }
  };

  // Continue with message sending methods...
  const sendMessageViaHub = async (
    content: string,
    parentMessageId?: string
  ): Promise<ChatMessageDto | null> => {
    if (!hubConnection.value || !activeConversation.value || !content.trim())
      return null;

    const { type, otherUserId, groupId } = activeConversation.value;

    // Create optimistic message
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMessage: ChatMessageDto = {
      id: tempId,
      content: content.trim(),
      senderId: authStore.user?.id || '',
      senderName:
        userStore.userDetails?.firstName +
          ' ' +
          userStore.userDetails?.lastName || 'You',
      senderAvatar: userStore.userDetails?.profileImageUrl,
      recipientId: type === 'direct' ? otherUserId : undefined,
      groupId: type === 'group' ? groupId : undefined,
      groupType:
        type === 'group' ? activeConversation.value.groupType : undefined,
      parentMessageId,
      status: 'Sending',
      sentAt: new Date().toISOString(),
      isEdited: false,
      isDeleted: false,
      isOwnMessage: true,
    };

    console.log('🚀 Sending message via SignalR:', {
      tempId,
      content: content.substring(0, 50),
      type,
      conversationId: otherUserId || groupId,
    });

    addLocalMessage(optimisticMessage);

    try {
      let result: ChatMessageDto;

      if (type === 'direct' && otherUserId) {
        const dto: SendDirectMessageDto = {
          recipientId: otherUserId,
          content: content.trim(),
          parentMessageId,
        };
        result = await hubConnection.value.invoke<ChatMessageDto>(
          'SendDirectMessage',
          dto
        );
      } else if (type === 'group' && groupId) {
        const dto: SendGroupMessageDto = {
          groupId,
          groupType: activeConversation.value.groupType || 'institution',
          content: content.trim(),
          parentMessageId,
        };
        result = await hubConnection.value.invoke<ChatMessageDto>(
          'SendGroupMessage',
          dto
        );
      } else {
        throw new Error('Invalid conversation type');
      }

      console.log('✅ Message sent successfully via SignalR:', result.id);

      // Remove temp message - the real message will come via SignalR event
      removeLocalMessage(tempId);

      return result;
    } catch (error) {
      console.error('❌ Failed to send message via hub:', error);
      updateLocalMessage(tempId, {
        content: content.trim() + ' (Retrying...)',
      });

      const fallbackResult = await sendMessageViaApi(content, parentMessageId);
      if (fallbackResult) {
        removeLocalMessage(tempId);
      }
      return fallbackResult;
    }
  };

  const sendMessageViaApi = async (
    content: string,
    parentMessageId?: string
  ): Promise<ChatMessageDto | null> => {
    if (!activeConversation.value || !content.trim()) return null;

    const { type, otherUserId, groupId } = activeConversation.value;

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMessage: ChatMessageDto = {
      id: tempId,
      content: content.trim(),
      senderId: authStore.user?.id || '',
      senderName:
        userStore.userDetails?.firstName +
          ' ' +
          userStore.userDetails?.lastName || 'You',
      senderAvatar: userStore.userDetails?.profileImageUrl,
      recipientId: type === 'direct' ? otherUserId : undefined,
      groupId: type === 'group' ? groupId : undefined,
      groupType:
        type === 'group' ? activeConversation.value.groupType : undefined,
      parentMessageId,
      status: 'Sending',
      sentAt: new Date().toISOString(),
      isEdited: false,
      isDeleted: false,
      isOwnMessage: true,
    };

    addLocalMessage(optimisticMessage);

    try {
      let result: ChatMessageDto;

      if (type === 'direct' && otherUserId) {
        const dto: SendDirectMessageDto = {
          recipientId: otherUserId,
          content: content.trim(),
          parentMessageId,
        };
        result = await sendDirectMessageMutation.mutateAsync(dto);
      } else if (type === 'group' && groupId) {
        const dto: SendGroupMessageDto = {
          groupId,
          groupType: activeConversation.value.groupType || 'institution',
          content: content.trim(),
          parentMessageId,
        };
        result = await sendGroupMessageMutation.mutateAsync(dto);
      } else {
        throw new Error('Invalid conversation type');
      }

      removeLocalMessage(tempId);
      addLocalMessage({ ...result, isOwnMessage: true });

      return result;
    } catch (error) {
      console.error('Failed to send message via API:', error);
      updateLocalMessage(tempId, {
        content: content.trim() + ' (Failed to send)',
      });
      throw error;
    }
  };

  const sendMessage = async (
    content: string,
    parentMessageId?: string
  ): Promise<ChatMessageDto | null> => {
    if (
      hubConnection.value &&
      hubConnection.value.state === signalR.HubConnectionState.Connected
    ) {
      return sendMessageViaHub(content, parentMessageId);
    } else {
      return sendMessageViaApi(content, parentMessageId);
    }
  };

  // Rest of the methods (edit, delete, reactions, etc.) remain the same
  const editMessage = async (
    messageId: string,
    newContent: string,
    editReason?: string
  ) => {
    if (
      hubConnection.value &&
      hubConnection.value.state === signalR.HubConnectionState.Connected
    ) {
      try {
        const dto: EditMessageDto = { content: newContent, editReason };
        return await hubConnection.value.invoke<ChatMessageDto>(
          'EditMessage',
          messageId,
          dto
        );
      } catch (error) {
        console.error('Failed to edit message via hub:', error);
        return editMessageMutation.mutateAsync({
          messageId,
          dto: { content: newContent, editReason },
        });
      }
    } else {
      return editMessageMutation.mutateAsync({
        messageId,
        dto: { content: newContent, editReason },
      });
    }
  };

  const deleteMessage = async (messageId: string, isHardDelete = false) => {
    if (
      hubConnection.value &&
      hubConnection.value.state === signalR.HubConnectionState.Connected
    ) {
      try {
        await hubConnection.value.invoke(
          'DeleteMessage',
          messageId,
          isHardDelete
        );
      } catch (error) {
        console.error('Failed to delete message via hub:', error);
        return deleteMessageMutation.mutateAsync({ messageId, isHardDelete });
      }
    } else {
      return deleteMessageMutation.mutateAsync({ messageId, isHardDelete });
    }
  };

  const addReaction = async (messageId: string, reactionType: ReactionType) => {
    if (
      hubConnection.value &&
      hubConnection.value.state === signalR.HubConnectionState.Connected
    ) {
      try {
        const dto: AddReactionDto = { reactionType };
        console.log('🎭 Adding reaction via SignalR:', { messageId, dto });
        return await hubConnection.value.invoke<MessageReactionsSummaryDto>(
          'AddReaction',
          messageId,
          dto
        );
      } catch (error) {
        console.error('Failed to add reaction via hub:', error);
        return addReactionMutation.mutateAsync({
          messageId,
          dto: { reactionType },
        });
      }
    } else {
      return addReactionMutation.mutateAsync({
        messageId,
        dto: { reactionType },
      });
    }
  };

  const removeReaction = async (
    messageId: string,
    reactionType: ReactionType
  ) => {
    if (
      hubConnection.value &&
      hubConnection.value.state === signalR.HubConnectionState.Connected
    ) {
      try {
        const dto: AddReactionDto = { reactionType };
        console.log('🎭 Removing reaction via SignalR:', { messageId, dto });
        return await hubConnection.value.invoke<MessageReactionsSummaryDto>(
          'RemoveReaction',
          messageId,
          dto
        );
      } catch (error) {
        console.error('Failed to remove reaction via hub:', error);
        return removeReactionMutation.mutateAsync({
          messageId,
          dto: { reactionType },
        });
      }
    } else {
      return removeReactionMutation.mutateAsync({
        messageId,
        dto: { reactionType },
      });
    }
  };

  const updateChatSettings = (settings: Partial<ChatSettings>) => {
    chatSettings.value = { ...chatSettings.value, ...settings };
    if (import.meta.client) {
      localStorage.setItem('chatSettings', JSON.stringify(chatSettings.value));
    }
  };

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    const { $message } = useNuxtApp() as {
      $message?: {
        success?: (msg: string) => void;
        error?: (msg: string) => void;
        warning?: (msg: string) => void;
        info?: (msg: string) => void;
      };
    };
    $message?.[type]?.(message);
  };

  const showMessageNotification = (message: ChatMessageDto) => {
    const title = message.senderName;
    const body =
      message.content.length > 100
        ? message.content.substring(0, 100) + '...'
        : message.content;

    if (
      chatSettings.value.desktopNotifications &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      const notification = new Notification(title, {
        body,
        icon: message.senderAvatar || '/default-avatar.png',
        tag: message.id,
      });

      notification.onclick = () => {
        window.focus();
        const conversation = conversations.value.find(
          (c) =>
            (c.type === 'direct' && c.otherUserId === message.senderId) ||
            (c.type === 'group' && c.groupId === message.groupId)
        );
        if (conversation) {
          joinConversation(conversation);
        }
        notification.close();
      };
    }

    showNotification(`${title}: ${body}`, 'info');
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updateChatSettings({ desktopNotifications: true });
      }
    }
  };

  const disconnect = async () => {
    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value);
      typingTimeout.value = null;
    }

    if (hubConnection.value) {
      await hubConnection.value.stop();
      hubConnection.value = null;
      connectionState.value = 'disconnected';
    }

    activeConversation.value = null;
    typingUsers.value.clear();
    onlineUsers.value = [];
    conversationMessages.value = new Map();
    localConversations.value = [];
    localUnreadCount.value = 0;
    initialDataLoaded.value = false;
  };

  // Initialize chat settings from localStorage
  if (import.meta.client) {
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      try {
        chatSettings.value = {
          ...chatSettings.value,
          ...JSON.parse(savedSettings),
        };
      } catch (error) {
        console.error('Failed to load chat settings:', error);
      }
    }
  }

  return {
    // State
    connectionState: readonly(connectionState),
    activeConversation: readonly(activeConversation),
    typingUsers: readonly(typingUsers),
    onlineUsers: readonly(onlineUsers),
    chatSettings: readonly(chatSettings),
    reconnectAttempts: readonly(reconnectAttempts),

    // Computed (now using local state)
    conversations,
    activeConversationMessages,
    unreadCount,
    isConnected,
    activeTypingUsers,
    isUserOnline,

    // Loading states
    isLoadingConversations: computed(() => conversationsQuery.isLoading.value),
    isLoadingMessages: computed(() => {
      if (!activeConversation.value) return false;
      const conversationId = getConversationId(activeConversation.value);
      return messagesLoading.value.has(conversationId);
    }),
    isSendingMessage: computed(
      () =>
        sendDirectMessageMutation.isLoading.value ||
        sendGroupMessageMutation.isLoading.value
    ),
    isEditingMessage: computed(() => editMessageMutation.isLoading.value),
    isDeletingMessage: computed(() => deleteMessageMutation.isLoading.value),

    // Methods
    initializeConnection,
    disconnect,
    joinConversation,
    leaveConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    startTyping,
    stopTyping,
    updateChatSettings,
    requestNotificationPermission,

    // Queries (mostly for initial load only)
    conversationsQuery,
    messagesQuery,
    unreadCountQuery,
    messageSearchQuery,
    messageEditHistoryQuery,
    messageReactionsQuery,
    messageRepliesQuery,
    messageQuery,

    // Mutations
    sendDirectMessageMutation,
    sendGroupMessageMutation,
    markMessagesAsReadMutation,
    editMessageMutation,
    deleteMessageMutation,
    addReactionMutation,
    removeReactionMutation,

    // Local state management (for debugging/advanced use)
    conversationMessages: readonly(conversationMessages),
    getConversationId,
    updateLocalMessages,

    // Debug trigger
    messageUpdateTrigger: readonly(messageUpdateTrigger),
  };
});
