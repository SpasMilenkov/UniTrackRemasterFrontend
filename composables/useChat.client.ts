// composables/useChat.client.ts - Fixed version with real-time updates
import { useChatStore } from '~/stores/chat';
import type { ConversationDto, ChatMessageDto } from '~/interfaces/chat';
import { ReactionType } from '~/enums/reaction-type.enum';
import { debounce } from 'lodash';

export interface ChatComposableOptions {
  autoConnect?: boolean;
  autoJoinConversation?: string;
  enableNotifications?: boolean;
  enableTypingIndicators?: boolean;
  messagePageSize?: number;
}

// Emoji mapping utility
export const getReactionEmoji = (reactionType: ReactionType): string => {
  const emojiMap: Record<ReactionType, string> = {
    [ReactionType.Like]: '👍',
    [ReactionType.Love]: '❤️',
    [ReactionType.Laugh]: '😂',
    [ReactionType.Surprise]: '😮',
    [ReactionType.Sad]: '😢',
    [ReactionType.Angry]: '😠',
    [ReactionType.ThumbsUp]: '👍',
    [ReactionType.ThumbsDown]: '👎',
    [ReactionType.Heart]: '💗',
    [ReactionType.Fire]: '🔥',
    [ReactionType.Celebrate]: '🎉',
    [ReactionType.Thinking]: '🤔',
  };
  return emojiMap[reactionType] || '👍';
};

// Reaction options for dropdowns
export const getReactionOptions = () => [
  { label: getReactionEmoji(ReactionType.Like), key: ReactionType.Like },
  { label: getReactionEmoji(ReactionType.Love), key: ReactionType.Love },
  { label: getReactionEmoji(ReactionType.Laugh), key: ReactionType.Laugh },
  {
    label: getReactionEmoji(ReactionType.Surprise),
    key: ReactionType.Surprise,
  },
  { label: getReactionEmoji(ReactionType.Sad), key: ReactionType.Sad },
  { label: getReactionEmoji(ReactionType.Angry), key: ReactionType.Angry },
  { label: getReactionEmoji(ReactionType.Fire), key: ReactionType.Fire },
  {
    label: getReactionEmoji(ReactionType.Celebrate),
    key: ReactionType.Celebrate,
  },
  {
    label: getReactionEmoji(ReactionType.Thinking),
    key: ReactionType.Thinking,
  },
];

export const useChat = (options: ChatComposableOptions = {}) => {
  // NEVER run on server-side to prevent hydration issues
  if (import.meta.server) {
    return {
      conversations: ref([]),
      activeConversation: ref(null),
      messages: ref([]),
      typingUsers: ref([]),
      onlineUsers: ref([]),
      unreadCount: ref(0),
      connectionState: ref('disconnected'),
      isConnected: ref(false),
      chatSettings: ref({}),
      messageInput: ref(''),
      isLoadingMoreMessages: ref(false),
      currentPage: ref(1),
      selectedMessage: ref(null),
      searchQuery: ref(''),
      searchResults: ref(null),
      showEmojiPicker: ref(false),
      uploadProgress: ref(0),
      isUploading: ref(false),
      replyingTo: ref(null),
      canSendMessage: ref(false),
      unreadMessages: ref([]),
      hasMoreMessages: ref(false),
      totalMessageCount: ref(0),
      isLoadingConversations: ref(false),
      isLoadingMessages: ref(false),
      isSendingMessage: ref(false),
      reactionOptions: ref([]),
      currentGroupContext: ref(null),
      // Stub methods for SSR
      initializeChat: async () => {},
      joinConversation: async () => {},
      leaveConversation: async () => {},
      sendMessage: async () => {},
      handleTyping: () => {},
      loadMoreMessages: async () => {},
      editMessage: async () => {},
      deleteMessage: async () => {},
      reactToMessage: async () => {},
      replyToMessage: () => {},
      cancelReply: () => {},
      searchMessages: () => {},
      navigateToMessage: async () => {},
      uploadFile: async () => {},
      markMessagesAsRead: async () => {},
      scrollToBottom: () => {},
      scrollToTop: () => {},
      isAtBottom: () => true,
      handleKeyboardShortcuts: () => {},
      exportConversation: async () => {},
      clearConversation: async () => {},
      createGroupChat: async () => null,
      getAvailableGroupTypes: () => [],
      switchGroupContext: () => {},
      isUserOnline: () => false,
      formatMessageTime: () => '',
      getReactionEmoji: () => '👍',
    };
  }

  // CLIENT-ONLY implementation
  const {
    autoConnect = true,
    autoJoinConversation,
    enableNotifications = true,
    enableTypingIndicators = true,
    messagePageSize = 50,
  } = options;

  const chatStore = useChatStore();
  const route = useRoute();

  // Local state
  const messageInput = ref('');
  const isLoadingMoreMessages = ref(false);
  const currentPage = ref(1);
  const selectedMessage = ref<ChatMessageDto | null>(null);
  const searchQuery = ref('');
  const showEmojiPicker = ref(false);
  const uploadProgress = ref(0);
  const isUploading = ref(false);
  const replyingTo = ref<ChatMessageDto | null>(null);

  // Get reactive store state - fix the destructuring issue
  const storeRefs = storeToRefs(chatStore);
  const {
    conversations,
    activeConversation,
    connectionState,
    unreadCount,
    activeTypingUsers,
    onlineUsers,
    chatSettings,
    isLoadingConversations,
    isSendingMessage,
  } = storeRefs;

  // Fix: Get isConnected directly from computed
  const isConnected = computed(() => chatStore.isConnected);

  // CRITICAL: Use the store's reactive messages that update in real-time
  const messages = computed(() => {
    const storeMessages = chatStore.activeConversationMessages;
    console.log('Store messages updated:', storeMessages.length);
    // Return the reactive reference directly
    return storeMessages;
  });

  // Current group context from store and route
  const currentGroupContext = computed(() => {
    return chatStore.getCurrentGroupContext?.() || null;
  });

  // Search results using the store's search query
  const searchResults = computed(() => {
    if (!searchQuery.value || searchQuery.value.length < 2) return null;

    const searchParams = {
      searchTerm: searchQuery.value,
      conversationType: activeConversation.value?.type,
      conversationId:
        activeConversation.value?.otherUserId ||
        activeConversation.value?.groupId,
    };

    const query = chatStore.messageSearchQuery(ref(searchParams));
    return query.data.value?.results || [];
  });

  const canSendMessage = computed(() => {
    return (
      isConnected.value &&
      activeConversation.value &&
      messageInput.value.trim().length > 0 &&
      !isSendingMessage.value
    );
  });

  const unreadMessages = computed(() => {
    return messages.value.filter((m) => !m.isOwnMessage && m.status !== 'Read');
  });

  const hasMoreMessages = ref(false);
  const totalMessageCount = computed(() => messages.value.length);
  const isLoadingMessages = computed(() => chatStore.isLoadingMessages);

  // Typing users filtered for current conversation
  const typingUsers = computed(() => {
    if (!activeConversation.value) return [];

    return activeTypingUsers.value.filter((user) => {
      if (activeConversation.value?.type === 'direct') {
        return user.recipientId === activeConversation.value?.otherUserId;
      } else {
        return user.groupId === activeConversation.value?.groupId;
      }
    });
  });

  // Reaction options computed
  const reactionOptions = computed(() => getReactionOptions());

  // Available group types based on current context
  const getAvailableGroupTypes = (): Array<{
    type: 'direct' | 'group';
    label: string;
    id?: string;
    name?: string;
  }> => {
    // Implement based on your store structure
    return [];
  };

  // Initialize connection - CLIENT ONLY
  const initializeChat = async () => {
    if (!import.meta.client) return;

    try {
      if (autoConnect) {
        await chatStore.initializeConnection();
      }

      // Update chat settings
      chatStore.updateChatSettings({
        notifications: enableNotifications,
        typingIndicators: enableTypingIndicators,
      });

      // Auto-join conversation if specified
      if (autoJoinConversation && conversations.value.length > 0) {
        const conversation = conversations.value.find(
          (c) => c.id === autoJoinConversation
        );
        if (conversation) {
          await joinConversation(conversation);
        }
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  };

  // Join a conversation - CLIENT ONLY
  const joinConversation = async (conversation: ConversationDto) => {
    if (!import.meta.client) return;

    try {
      currentPage.value = 1;
      await chatStore.joinConversation(conversation);

      // Scroll to bottom after messages load
      await nextTick();
      scrollToBottom();
    } catch (error) {
      console.error('Failed to join conversation:', error);
    }
  };

  // Leave current conversation - CLIENT ONLY
  const leaveConversation = async () => {
    if (!import.meta.client) return;

    try {
      await chatStore.leaveConversation();
      messageInput.value = '';
      replyingTo.value = null;
      selectedMessage.value = null;
    } catch (error) {
      console.error('Failed to leave conversation:', error);
    }
  };

  // UPDATED: Send message with immediate optimistic update
  const sendMessage = async () => {
    if (!import.meta.client || !canSendMessage.value) return;

    const content = messageInput.value.trim();
    const parentMessageId = replyingTo.value?.id;

    // Clear input and reply state immediately for better UX
    messageInput.value = '';
    replyingTo.value = null;

    try {
      // This will now add the message optimistically to local state
      await chatStore.sendMessage(content, parentMessageId);

      // Scroll to bottom after sending
      await nextTick();
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);

      // Restore input content on error
      messageInput.value = content;
      if (parentMessageId) {
        replyingTo.value =
          messages.value.find((m) => m.id === parentMessageId) || null;
      }

      // Show error message
      const message = useMessage();
      message.error('Failed to send message. Please try again.');
    }
  };

  // Handle typing with debounce
  const debouncedStopTyping = debounce(() => {
    if (chatSettings.value.typingIndicators && activeConversation.value) {
      chatStore.stopTyping();
    }
  }, 1000);

  const handleTyping = () => {
    if (!import.meta.client) return;

    if (chatSettings.value.typingIndicators && activeConversation.value) {
      chatStore.startTyping();
      debouncedStopTyping();
    }
  };

  // Load more messages - CLIENT ONLY
  const loadMoreMessages = async () => {
    if (
      !import.meta.client ||
      !hasMoreMessages.value ||
      isLoadingMoreMessages.value
    )
      return;

    isLoadingMoreMessages.value = true;
    currentPage.value++;

    try {
      // You'll need to implement pagination in your store
      console.log('Loading more messages for page:', currentPage.value);
      // await chatStore.loadMoreMessages(currentPage.value);
    } finally {
      isLoadingMoreMessages.value = false;
    }
  };

  // Edit a message - CLIENT ONLY
  const editMessage = async (
    messageId: string,
    newContent: string,
    editReason?: string
  ) => {
    if (!import.meta.client) return;

    try {
      await chatStore.editMessage(messageId, newContent, editReason);
    } catch (error) {
      console.error('Failed to edit message:', error);

      // Show error message
      const message = useMessage();
      message.error('Failed to edit message. Please try again.');
    }
  };

  // Delete a message - CLIENT ONLY
  const deleteMessage = async (messageId: string, isHardDelete = false) => {
    if (!import.meta.client) return;

    try {
      await chatStore.deleteMessage(messageId, isHardDelete);
    } catch (error) {
      console.error('Failed to delete message:', error);

      // Show error message
      const message = useMessage();
      message.error('Failed to delete message. Please try again.');
    }
  };

  // React to a message - CLIENT ONLY
  const reactToMessage = async (
    messageId: string,
    reactionType: ReactionType
  ) => {
    if (!import.meta.client) return;

    try {
      // Check if user already has this reaction
      const message = messages.value.find((m) => m.id === messageId);
      const hasReaction =
        message?.reactions?.userReactions?.includes(reactionType);
      console.log(
        `User ${hasReaction ? 'removing' : 'adding'} reaction: ${reactionType}`
      );
      if (hasReaction) {
        await chatStore.removeReaction(messageId, reactionType);
      } else {
        await chatStore.addReaction(messageId, reactionType);
      }
    } catch (error) {
      console.error('Failed to react to message:', error);
    }
  };

  // Reply to a message
  const replyToMessage = (message: ChatMessageDto) => {
    replyingTo.value = message;

    // Focus on input - CLIENT ONLY
    if (import.meta.client) {
      const inputElement = document.querySelector(
        '.message-input textarea'
      ) as HTMLTextAreaElement;
      inputElement?.focus();
    }
  };

  // Cancel reply
  const cancelReply = () => {
    replyingTo.value = null;
  };

  // Search messages - CLIENT ONLY with debounce
  const searchMessages = import.meta.client
    ? debounce(async (query: string) => {
        searchQuery.value = query;
      }, 300)
    : () => {};

  // Navigate to message - CLIENT ONLY
  const navigateToMessage = async (
    message: ChatMessageDto,
    conversation: ConversationDto
  ) => {
    if (!import.meta.client) return;

    // Join the conversation if different
    if (activeConversation.value?.id !== conversation.id) {
      await joinConversation(conversation);
    }

    // Scroll to the message
    await nextTick();
    const messageElement = document.getElementById(`message-${message.id}`);
    messageElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Highlight the message
    selectedMessage.value = message;
    setTimeout(() => {
      selectedMessage.value = null;
    }, 3000);
  };

  // Switch group context
  const switchGroupContext = (groupType: GroupType, groupId: string) => {
    console.log(`Switching group context to ${groupType}:${groupId}`);
  };

  // Mark messages as read - CLIENT ONLY
  const markMessagesAsRead = async () => {
    if (!import.meta.client) return;

    const unreadIds = unreadMessages.value.map((m) => m.id);
    if (unreadIds.length > 0) {
      await chatStore.markMessagesAsReadMutation.mutateAsync({
        messageIds: unreadIds,
      });
    }
  };

  // Scroll to bottom - CLIENT ONLY
  const scrollToBottom = (smooth = true) => {
    if (!import.meta.client) return;

    nextTick(() => {
      const container = document.querySelector(
        '.messages-container .n-scrollbar-container'
      );
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    });
  };

  // Scroll to top - CLIENT ONLY
  const scrollToTop = (smooth = true) => {
    if (!import.meta.client) return;

    const container = document.querySelector(
      '.messages-container .n-scrollbar-container'
    );
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  // Check if at bottom - CLIENT ONLY
  const isAtBottom = () => {
    if (!import.meta.client) return true;

    const container = document.querySelector(
      '.messages-container .n-scrollbar-container'
    );
    if (!container) return true;

    const threshold = 100;
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold
    );
  };

  // Handle keyboard shortcuts
  const handleKeyboardShortcuts = (event: KeyboardEvent) => {
    // Send message on Enter (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }

    // Cancel reply on Escape
    if (event.key === 'Escape' && replyingTo.value) {
      cancelReply();
    }
  };

  // Export conversation - CLIENT ONLY
  const exportConversation = async (
    format: 'json' | 'csv' | 'txt' = 'json'
  ) => {
    if (!import.meta.client || !activeConversation.value) return;

    console.log('Exporting conversation as:', format);
  };

  // Clear conversation history - CLIENT ONLY
  const clearConversation = async () => {
    if (!import.meta.client || !activeConversation.value) return;

    const confirmed = confirm(
      'Are you sure you want to clear this conversation? This action cannot be undone.'
    );
    if (!confirmed) return;

    console.log('Clearing conversation');
  };

  // Helper functions
  const isUserOnline = (userId: string) => {
    if (!import.meta.client) return false;
    return chatStore.isUserOnline(userId);
  };

  const formatMessageTime = (date: string) => {
    if (!import.meta.client) return '';

    const messageDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

    return messageDate.toLocaleDateString();
  };

  // CLIENT-ONLY lifecycle hooks
  if (import.meta.client) {
    // Initialize on mount
    onMounted(async () => {
      await initializeChat();

      // Mark messages as read when window gains focus
      window.addEventListener('focus', markMessagesAsRead);

      // Handle visibility change
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          markMessagesAsRead();
        }
      });
    });

    // Cleanup on unmount
    onUnmounted(() => {
      window.removeEventListener('focus', markMessagesAsRead);

      if (activeConversation.value) {
        leaveConversation();
      }
    });

    // Watch for route-based conversation changes
    watch(
      () => route.params.conversationId,
      async (newId) => {
        if (newId && typeof newId === 'string') {
          const conversation = conversations.value.find((c) => c.id === newId);
          if (conversation) {
            await joinConversation(conversation);
          }
        }
      }
    );

    // Auto-mark messages as read
    watch(unreadMessages, (messages) => {
      if (messages.length > 0 && document.hasFocus()) {
        debounce(() => markMessagesAsRead(), 1000)();
      }
    });

    // Watch for new messages and scroll to bottom if at bottom
    watch(
      () => messages.value.length,
      (newLength, oldLength) => {
        if (newLength > oldLength) {
          // New message added
          nextTick(() => {
            if (isAtBottom()) {
              scrollToBottom();
            }
          });
        }
      }
    );
  }

  return {
    // Store state (now properly reactive to real-time updates)
    conversations,
    activeConversation,
    messages, // This will now update in real-time via local state
    typingUsers,
    onlineUsers,
    unreadCount,
    connectionState,
    isConnected,
    chatSettings,
    currentGroupContext,

    // Local state
    messageInput,
    isLoadingMoreMessages,
    currentPage: readonly(currentPage),
    selectedMessage,
    searchQuery,
    searchResults,
    showEmojiPicker,
    uploadProgress: readonly(uploadProgress),
    isUploading: readonly(isUploading),
    replyingTo: readonly(replyingTo),

    // Computed
    canSendMessage,
    unreadMessages,
    hasMoreMessages,
    totalMessageCount,
    reactionOptions,

    // Loading states
    isLoadingConversations,
    isLoadingMessages,
    isSendingMessage,

    // Methods
    initializeChat,
    joinConversation,
    leaveConversation,
    sendMessage,
    handleTyping,
    loadMoreMessages,
    editMessage,
    deleteMessage,
    reactToMessage,
    replyToMessage,
    cancelReply,
    searchMessages,
    navigateToMessage,
    markMessagesAsRead,
    scrollToBottom,
    scrollToTop,
    isAtBottom,
    handleKeyboardShortcuts,
    exportConversation,
    clearConversation,

    // Group-specific methods
    getAvailableGroupTypes,
    switchGroupContext,

    // Helpers
    isUserOnline,
    formatMessageTime,
    getReactionEmoji,
  };
};
