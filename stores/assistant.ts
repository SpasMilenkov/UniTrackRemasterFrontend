// stores/assistant.ts
import { defineStore } from 'pinia';
import { useMutation } from '@pinia/colada';
import type { Ref } from 'vue';
import type { ChatContextDto } from '~/interfaces/assistant/chat-context.dto';
import type { SendMessageRequest } from '~/interfaces/assistant/send-message-request';
import type { SendMessageResponse } from '~/interfaces/assistant/send-message-response';
import type { ChatMessage } from '~/interfaces/chat';

interface StorageKeys {
  MESSAGES: string;
  CONVERSATION_ID: string;
}

export const useAssistantStore = defineStore('assistant', () => {
  // NEVER run on server-side to prevent hydration issues
  if (import.meta.server) {
    return {
      messages: readonly(ref<ChatMessage[]>([])) as Readonly<
        Ref<ChatMessage[]>
      >,
      currentConversationId: readonly(ref<string | null>(null)) as Readonly<
        Ref<string | null>
      >,
      isLoading: readonly(ref(false)) as Readonly<Ref<boolean>>,
      error: readonly(ref<string | null>(null)) as Readonly<Ref<string | null>>,
      sendMessage: async (
        _message: string,
        _context?: ChatContextDto
      ): Promise<void> => {},
      clearConversation: (): void => {},
      addMessage: (_message: Omit<ChatMessage, 'id' | 'timestamp'>): void => {},
      loadConversationFromStorage: (): void => {},
      saveConversationToStorage: (): void => {},
      clearConversationFromStorage: (): void => {},
      hasMessages: readonly(ref(false)) as Readonly<Ref<boolean>>,
      lastMessage: readonly(ref<ChatMessage | null>(null)) as Readonly<
        Ref<ChatMessage | null>
      >,
      messageCount: readonly(ref(0)) as Readonly<Ref<number>>,
    };
  }

  // CLIENT-ONLY implementation
  const { $apiFetch } = useNuxtApp();
  const authStore = useAuthStore();
  const userStore = useUserStore();

  // Internal state
  const _messages: Ref<ChatMessage[]> = ref([]);
  const _currentConversationId: Ref<string | null> = ref(null);
  const _error: Ref<string | null> = ref(null);

  // Storage helpers
  const STORAGE_KEYS: StorageKeys = {
    MESSAGES: 'assistant_messages',
    CONVERSATION_ID: 'assistant_conversation_id',
  };

  const saveConversationToStorage = (): void => {
    if (import.meta.client) {
      try {
        localStorage.setItem(
          STORAGE_KEYS.MESSAGES,
          JSON.stringify(_messages.value)
        );
        if (_currentConversationId.value) {
          localStorage.setItem(
            STORAGE_KEYS.CONVERSATION_ID,
            _currentConversationId.value
          );
        }
      } catch (error) {
        console.error('Failed to save conversation to localStorage:', error);
      }
    }
  };

  const loadConversationFromStorage = (): void => {
    if (import.meta.client) {
      try {
        const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
        const storedConversationId = localStorage.getItem(
          STORAGE_KEYS.CONVERSATION_ID
        );

        if (storedMessages) {
          const messages: ChatMessage[] = JSON.parse(storedMessages);
          // Convert timestamp strings back to Date objects
          _messages.value = messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        }

        if (storedConversationId) {
          _currentConversationId.value = storedConversationId;
        }

        console.log('📂 Assistant conversation loaded from localStorage');
      } catch (error) {
        console.error('Failed to load conversation from localStorage:', error);
        clearConversationFromStorage();
      }
    }
  };

  const clearConversationFromStorage = (): void => {
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.CONVERSATION_ID);
    }
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutation: async (
      request: SendMessageRequest
    ): Promise<SendMessageResponse> => {
      // Get current context from stores
      const context: ChatContextDto = {
        currentPage: window.location.pathname,
        userRole: userStore.userDetails?.role,
        institutionId: userStore.userDetails?.institutionId,
        userId: authStore.user?.id,
        ...request.context,
      };

      const response = await $apiFetch<SendMessageResponse>('/Assistant/chat', {
        method: 'POST',
        body: {
          message: request.message,
          conversationId:
            request.conversationId || _currentConversationId.value,
          context,
        },
      });

      return response;
    },
    onSuccess: (response: SendMessageResponse) => {
      // Update conversation ID if new
      if (
        response.conversationId &&
        response.conversationId !== _currentConversationId.value
      ) {
        _currentConversationId.value = response.conversationId;
      }

      // Add assistant message to the conversation
      _messages.value.push(response.message);

      // Save to localStorage
      saveConversationToStorage();

      _error.value = null;
    },
    onError: (error: any) => {
      console.error('Failed to send message:', error);
      _error.value = error.message || 'Failed to send message';

      // Add error message to conversation
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content:
          'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
        error: true,
      };

      _messages.value.push(errorMessage);
      saveConversationToStorage();
    },
  });

  // Actions
  const sendMessage = async (
    message: string,
    context?: ChatContextDto
  ): Promise<void> => {
    if (!message.trim()) return;

    _error.value = null;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    _messages.value.push(userMessage);
    saveConversationToStorage();

    // Send to backend
    try {
      await sendMessageMutation.mutateAsync({
        message: message.trim(),
        conversationId: _currentConversationId.value || undefined,
        context,
      });
    } catch (error) {
      // Error handling is done in the mutation onError
      console.error('Send message failed:', error);
    }
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): void => {
    const fullMessage: ChatMessage = {
      ...message,
      id: `${message.role}_${Date.now()}`,
      timestamp: new Date(),
    };

    _messages.value.push(fullMessage);
    saveConversationToStorage();
  };

  const clearConversation = (): void => {
    _messages.value = [];
    _currentConversationId.value = null;
    _error.value = null;
    clearConversationFromStorage();
  };

  // Initialize from localStorage on client
  if (import.meta.client) {
    loadConversationFromStorage();
  }

  return {
    // Readonly state
    messages: readonly(_messages) as Readonly<Ref<ChatMessage[]>>,
    currentConversationId: readonly(_currentConversationId) as Readonly<
      Ref<string | null>
    >,
    isLoading: computed(() => sendMessageMutation.isLoading.value),
    error: readonly(_error) as Readonly<Ref<string | null>>,

    // Actions
    sendMessage,
    clearConversation,
    addMessage,
    loadConversationFromStorage,
    saveConversationToStorage,
    clearConversationFromStorage,

    // Computed helpers
    hasMessages: computed(() => _messages.value.length > 0),
    lastMessage: computed(
      () => _messages.value[_messages.value.length - 1] || null
    ),
    messageCount: computed(() => _messages.value.length),
  };
});
