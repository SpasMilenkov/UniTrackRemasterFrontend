<template>
  <div class="grow bg-background-card flex flex-col overflow-hidden">
    <!-- Main Chat Area -->
    <div class="flex-1 relative max-w-4xl w-full mx-auto h-full">
      <!-- Welcome Section -->
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        leave-active-class="transition-opacity duration-150 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="!assistantStore.hasMessages"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="text-center py-8 space-y-6">
            <div class="text-6xl mb-4">🤖</div>
            <h2 class="text-2xl font-bold text-text-primary">
              Welcome to UniTrack Support
            </h2>
            <p class="text-text-secondary max-w-md mx-auto">
              I'm your AI assistant for UniTrack. I can help you with
              navigation, troubleshooting, feature explanations, and general
              support questions.
            </p>
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mt-6"
            >
              <button
                v-for="suggestion in quickSuggestions"
                :key="suggestion.text"
                class="p-3 text-left bg-background-secondary hover:bg-background-tertiary border border-border rounded-lg transition-colors duration-200"
                :disabled="assistantStore.isLoading"
                @click="sendSuggestion(suggestion.text)"
              >
                <div class="text-sm font-medium text-text-primary">
                  {{ suggestion.title }}
                </div>
                <div class="text-xs text-text-secondary mt-1">
                  {{ suggestion.description }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Messages Container -->
      <div ref="messageContainer" class="h-full overflow-y-auto px-4 pb-32">
        <TransitionGroup name="message" tag="div" class="space-y-6 py-4">
          <div
            v-for="message in assistantStore.messages"
            :key="message.id"
            class="flex w-full items-start"
            :class="[
              message.role === 'user' ? 'justify-end' : 'justify-start',
              message.role === 'assistant' ? 'bg-background-card/50 py-4' : '',
            ]"
          >
            <div
              class="max-w-[85%] flex items-start gap-3 px-4"
              :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
            >
              <!-- Avatar -->
              <div
                class="min-w-8 min-h-8 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                :class="[
                  message.role === 'user' ? 'bg-primary/20' : 'bg-primary/10',
                  message.error ? 'bg-red-500/20' : '',
                ]"
              >
                <span class="text-base leading-none">
                  {{
                    message.role === 'user' ? '👤' : message.error ? '⚠️' : '🤖'
                  }}
                </span>
              </div>

              <!-- Message Content -->
              <div class="flex flex-col">
                <div
                  class="leading-relaxed break-words"
                  :class="[
                    message.error ? 'text-red-400' : 'text-text-primary',
                  ]"
                >
                  <div class="whitespace-pre-wrap">{{ message.content }}</div>
                </div>

                <!-- Timestamp -->
                <div class="text-xs text-text-secondary mt-2 opacity-70">
                  {{ formatMessageTime(message.timestamp) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div
            v-if="assistantStore.isLoading"
            key="typing"
            class="flex w-full items-start justify-start bg-background-card/50 py-4"
          >
            <div class="max-w-[85%] flex items-start gap-3 px-4">
              <div
                class="min-w-8 min-h-8 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-base leading-none">🤖</span>
              </div>
              <div class="flex gap-1 items-center h-8">
                <span
                  class="w-2 h-2 bg-text-primary/50 rounded-full animate-bounce"
                  style="animation-delay: 0ms"
                />
                <span
                  class="w-2 h-2 bg-text-primary/50 rounded-full animate-bounce"
                  style="animation-delay: 150ms"
                />
                <span
                  class="w-2 h-2 bg-text-primary/50 rounded-full animate-bounce"
                  style="animation-delay: 300ms"
                />
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Input Area - Fixed at bottom -->
      <div
        class="fixed bottom-0 left-0 right-0 py-4 bg-background-card/95 backdrop-blur border-t border-border"
      >
        <div class="px-4 max-w-4xl mx-auto">
          <!-- Error Display -->
          <div
            v-if="assistantStore.error"
            class="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            <div class="flex items-center gap-2">
              <span>⚠️</span>
              <span>{{ assistantStore.error }}</span>
              <button
                class="ml-auto text-red-400 hover:text-red-300"
                @click="clearError"
              >
                ✕
              </button>
            </div>
          </div>

          <form class="flex gap-2" @submit.prevent="sendMessage">
            <div class="flex-1 relative">
              <input
                ref="messageInput"
                v-model="currentInput"
                class="w-full bg-background-card text-text-primary border border-border focus:border-primary/50 rounded-lg px-4 py-3 pr-12 transition-colors duration-200 focus:outline-none"
                placeholder="Message UniTrack support..."
                :disabled="assistantStore.isLoading"
                @keydown.enter.prevent="sendMessage"
              >
              <!-- Clear button -->
              <button
                v-if="currentInput.trim()"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                @click="currentInput = ''"
              >
                ✕
              </button>
            </div>
            <button
              type="submit"
              class="bg-primary text-background px-6 py-3 rounded-lg hover:bg-primary-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              :disabled="assistantStore.isLoading || !currentInput.trim()"
            >
              <span>Send</span>
              <div
                v-if="assistantStore.isLoading"
                class="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent"
              />
              <span v-else class="text-lg">📤</span>
            </button>
          </form>

          <div class="mt-2 flex items-center justify-between">
            <div class="text-center text-text-secondary text-sm">
              Press Enter to send your message
            </div>
            <div class="flex gap-2">
              <button
                v-if="assistantStore.hasMessages"
                class="text-text-secondary hover:text-text-primary text-sm px-2 py-1 rounded transition-colors"
                :disabled="assistantStore.isLoading"
                @click="clearConversation"
              >
                Clear Chat
              </button>
              <div class="text-text-secondary text-sm">
                {{ assistantStore.messageCount }} messages
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssistantStore } from '~/stores/assistant';
import type { ChatContextDto } from '~/stores/assistant';
import type { Ref } from 'vue';

interface QuickSuggestion {
  title: string;
  description: string;
  text: string;
}

const assistantStore = useAssistantStore();
const currentInput: Ref<string> = ref('');
const messageContainer: Ref<HTMLElement | null> = ref(null);
const messageInput: Ref<HTMLInputElement | null> = ref(null);

definePageMeta({
  layout: 'chat-layout',
});

// Quick suggestions for new users
const quickSuggestions: Ref<QuickSuggestion[]> = ref([
  {
    title: 'Getting Started',
    description: 'How do I navigate UniTrack?',
    text: 'How do I get started with UniTrack? Can you show me around the main features?',
  },
  {
    title: 'Account & Privacy',
    description: 'Managing my account settings',
    text: 'How do I update my profile and privacy settings?',
  },
  {
    title: 'Institution Management',
    description: 'Working with institutions',
    text: 'How do I manage my institution and users?',
  },
  {
    title: 'Analytics & Reports',
    description: 'Understanding the analytics features',
    text: 'How do I view and understand the analytics and reports in UniTrack?',
  },
]);

const scrollToBottom = (): void => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTo({
        top: messageContainer.value.scrollHeight,
        behavior: 'smooth',
      });
    }
  });
};

const focusInput = (): void => {
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus();
    }
  });
};

// Watch for new messages and scroll
watch(() => assistantStore.messages, scrollToBottom, { deep: true });
watch(() => assistantStore.isLoading, scrollToBottom);

const sendMessage = async (): Promise<void> => {
  if (!currentInput.value.trim() || assistantStore.isLoading) return;

  const message: string = currentInput.value.trim();
  currentInput.value = '';

  // Get current route for context
  const route = useRoute();
  const context: ChatContextDto = {
    currentPage: route.path,
    errorDetails: route.query.error ? { error: route.query.error } : undefined,
  };

  await assistantStore.sendMessage(message, context);
  focusInput();
};

const sendSuggestion = async (suggestionText: string): Promise<void> => {
  if (assistantStore.isLoading) return;

  currentInput.value = suggestionText;
  await sendMessage();
};

const clearConversation = (): void => {
  assistantStore.clearConversation();
  focusInput();
};

const clearError = (): void => {
  // The error is readonly, so we can't directly clear it
  // It will be cleared on the next successful action
  focusInput();
};

const formatMessageTime = (timestamp: Date): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `${minutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Focus input on mount
onMounted(() => {
  focusInput();
});
</script>

<style scoped>
.message-move {
  transition: all 0.5s ease;
}

.message-enter-active {
  transition: all 0.3s ease-out;
}
.message-leave-active {
  transition: all 0.2s ease-in;
}
.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Custom scrollbar for message container */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
