<template>
  <!-- Draggable Chat Widget -->
  <div>
    <!-- Chat Button Container -->
    <div
      ref="chatContainer"
      class="fixed z-50 select-none transition-all duration-200"
      :class="{
        'cursor-grab': !isDragging && !isChatOpen,
        'cursor-grabbing': isDragging,
        'transition-none': isDragging,
      }"
      :style="containerStyle"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <!-- Chat Button -->
      <Transition name="chat-button">
        <div v-if="!isChatOpen" key="button" class="relative">
          <!-- Drag indicator when hovering -->
          <div
            v-if="showDragHint && !isDragging"
            class="absolute -inset-2 rounded-full border-2 border-primary/30 border-dashed animate-pulse"
          />

          <n-button
            circle
            type="primary"
            size="large"
            class="w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 chat-button relative"
            :class="{ 'scale-110 shadow-2xl': isDragging }"
            @click="toggleChat"
            @mouseenter="showDragHint = true"
            @mouseleave="showDragHint = false"
          >
            <template #icon>
              <n-icon size="24">
                <Icon name="ion:chatbubble-ellipses" />
              </n-icon>
            </template>
          </n-button>

          <!-- Notification Badge -->
          <div
            v-if="hasUnreadMessages"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse"
          >
            <span class="text-xs text-white font-bold">{{ unreadCount }}</span>
          </div>

          <!-- Subtle breathing effect -->
          <div
            class="absolute inset-0 rounded-full bg-primary/30 animate-pulse opacity-40 pointer-events-none"
          />
        </div>
      </Transition>
    </div>

    <!-- Chat Dialog - Positioned Independently -->
    <Transition name="chat-dialog">
      <div
        v-if="isChatMounted"
        key="dialog"
        class="w-80 h-96 bg-background-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
        :style="chatDialogStyle"
        @mousedown.stop
        @touchstart.stop
      >
        <!-- Chat Header -->
        <div
          class="flex items-center justify-between p-4 bg-primary/5 border-b border-border"
        >
          <div class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
            >
              <Icon name="ion:sparkles" class="text-primary text-lg" />
            </div>
            <div>
              <h3 class="font-semibold text-text-primary text-sm">
                {{ t('chat.assistant') }}
              </h3>
              <p class="text-xs text-text-secondary">
                {{
                  assistantStore.isLoading ? t('chat.typing') : t('chat.online')
                }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <!-- Clear Chat Button -->
            <n-button
              v-if="assistantStore.hasMessages"
              quaternary
              circle
              size="small"
              :disabled="assistantStore.isLoading"
              @click="clearChat"
            >
              <template #icon>
                <n-icon>
                  <Icon name="ion:trash-outline" />
                </n-icon>
              </template>
            </n-button>
            <!-- Drag handle for chat dialog -->
            <n-button
              quaternary
              circle
              size="small"
              class="cursor-grab active:cursor-grabbing"
              @mousedown="startDrag"
              @touchstart="startDrag"
            >
              <template #icon>
                <n-icon>
                  <Icon name="ion:move" />
                </n-icon>
              </template>
            </n-button>
            <n-button quaternary circle size="small" @click="toggleChat">
              <template #icon>
                <n-icon>
                  <Icon name="ion:close" />
                </n-icon>
              </template>
            </n-button>
          </div>
        </div>

        <!-- Chat Messages Area -->
        <div
          ref="chatMessagesContainer"
          class="flex-1 p-4 h-64 overflow-y-auto space-y-3 bg-background chat-content"
        >
          <!-- Welcome Message -->
          <div v-if="!assistantStore.hasMessages" class="text-center py-8">
            <div
              class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <Icon name="ion:hand-right" class="text-primary text-2xl" />
            </div>
            <p class="text-text-secondary text-sm">
              {{ t('chat.welcome') }}
            </p>
            <p class="text-text-secondary text-xs mt-2">
              Ask me about UniTrack features!
            </p>
          </div>

          <!-- Chat Messages -->
          <div
            v-for="message in assistantStore.messages"
            :key="message.id"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-xs px-3 py-2 rounded-lg text-sm"
              :class="[
                message.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-background-secondary text-text-primary rounded-bl-sm',
                message.error ? 'bg-red-500/20 border border-red-500/30' : '',
              ]"
            >
              <!-- Message content with better text handling -->
              <p class="whitespace-pre-wrap break-words">
                {{ message.content }}
              </p>
              <span class="text-xs opacity-70 mt-1 block">
                {{ message.timestamp ? formatTime(message.timestamp) : 'Now' }}
              </span>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="assistantStore.isLoading" class="flex justify-start">
            <div
              class="bg-background-secondary text-text-primary px-3 py-2 rounded-lg rounded-bl-sm"
            >
              <div class="flex space-x-1">
                <div
                  class="w-2 h-2 bg-text-secondary rounded-full animate-bounce"
                  style="animation-delay: 0ms"
                />
                <div
                  class="w-2 h-2 bg-text-secondary rounded-full animate-bounce"
                  style="animation-delay: 150ms"
                />
                <div
                  class="w-2 h-2 bg-text-secondary rounded-full animate-bounce"
                  style="animation-delay: 300ms"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div
          v-if="assistantStore.error"
          class="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-xs"
        >
          <div class="flex items-center gap-2">
            <Icon name="ion:warning" />
            <span>{{ assistantStore.error }}</span>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 border-t border-border bg-background-card">
          <div class="flex space-x-2">
            <n-input
              v-model:value="currentMessage"
              :placeholder="t('chat.placeholder')"
              size="small"
              :disabled="assistantStore.isLoading"
              @keypress.enter="sendMessage"
              @input="onInputChange"
            />
            <n-button
              type="primary"
              size="small"
              :disabled="!currentMessage.trim() || assistantStore.isLoading"
              :loading="assistantStore.isLoading"
              @click="sendMessage"
            >
              <template #icon>
                <n-icon>
                  <Icon name="ion:send" />
                </n-icon>
              </template>
            </n-button>
          </div>
          <!-- Message count indicator -->
          <div
            v-if="assistantStore.hasMessages"
            class="text-xs text-text-secondary mt-1 text-center"
          >
            {{ assistantStore.messageCount }} messages
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
  type Ref,
} from 'vue';
import { NIcon, NInput, NButton } from 'naive-ui';
import { useAssistantStore } from '~/stores/assistant';
import type { ChatContextDto } from '~/stores/assistant';

// Position interface - simplified to always use x, y coordinates
interface Position {
  x: number;
  y: number;
}

// Props
interface Props {
  initialPosition?: Position;
  snapToEdges?: boolean;
  snapThreshold?: number;
  boundaryPadding?: number;
}

const props = withDefaults(defineProps<Props>(), {
  snapToEdges: true,
  snapThreshold: 50,
  boundaryPadding: 20,
});

// Stores and composables
const assistantStore = useAssistantStore();
const route = useRoute();
const { t } = useI18n();

// Reactive refs
const chatContainer: Ref<HTMLElement | undefined> = ref();
const chatMessagesContainer: Ref<HTMLElement | undefined> = ref();

// Chat state
const isChatOpen: Ref<boolean> = ref(false);
const isChatMounted: Ref<boolean> = ref(false);
const currentMessage: Ref<string> = ref('');
const hasUnreadMessages: Ref<boolean> = ref(false);
const unreadCount: Ref<number> = ref(0);
const lastViewedMessageCount: Ref<number> = ref(0);

// Drag state
const isDragging: Ref<boolean> = ref(false);
const showDragHint: Ref<boolean> = ref(false);
const position: Ref<Position> = ref({ x: 0, y: 0 });

// Drag tracking
const dragStart: Ref<{ x: number; y: number }> = ref({ x: 0, y: 0 });
const hasMoved: Ref<boolean> = ref(false);
const currentDragPosition: Ref<{ x: number; y: number }> = ref({ x: 0, y: 0 });

// Button dimensions (fixed to match the actual button size)
const BUTTON_SIZE = 56; // 14 * 4 = 56px (w-14 h-14)

// Computed styles - simplified to use only x, y positioning
const containerStyle = computed(() => {
  if (isDragging.value) {
    // During dragging, use the current drag position
    return {
      left: `${currentDragPosition.value.x}px`,
      top: `${currentDragPosition.value.y}px`,
      transition: 'none',
    };
  }

  // Normal positioning
  return {
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
  };
});

// Computed style for chat dialog - always positioned independently
const chatDialogStyle = computed(() => {
  // Calculate dialog position based on button position and available space
  const buttonX = isDragging.value
    ? currentDragPosition.value.x
    : position.value.x;
  const buttonY = isDragging.value
    ? currentDragPosition.value.y
    : position.value.y;

  // Dialog dimensions
  const dialogWidth = 320; // 80 * 4 = 320px (w-80)
  const dialogHeight = 384; // 96 * 4 = 384px (h-96)

  // Determine best position for dialog
  let dialogX = buttonX + BUTTON_SIZE + 10; // Default: right of button
  let dialogY = buttonY;

  // Check if dialog fits on the right side
  if (dialogX + dialogWidth > window.innerWidth - 20) {
    // Position on the left side
    dialogX = buttonX - dialogWidth - 10;
  }

  // Ensure dialog stays within viewport vertically
  const padding = 20;
  dialogY = Math.max(
    padding,
    Math.min(window.innerHeight - dialogHeight - padding, dialogY)
  );

  // Ensure dialog stays within viewport horizontally
  dialogX = Math.max(
    padding,
    Math.min(window.innerWidth - dialogWidth - padding, dialogX)
  );

  return {
    left: `${dialogX}px`,
    top: `${dialogY}px`,
    position: 'fixed' as const,
  };
});

// Utility functions
const getEventCoordinates = (event: MouseEvent | TouchEvent) => {
  if ('touches' in event) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }
  return {
    x: event.clientX,
    y: event.clientY,
  };
};

const getBoundaries = () => {
  const padding = props.boundaryPadding;
  return {
    minX: padding,
    minY: padding,
    maxX: window.innerWidth - padding - BUTTON_SIZE,
    maxY: window.innerHeight - padding - BUTTON_SIZE,
  };
};

const snapToEdge = (x: number, y: number) => {
  if (!props.snapToEdges) return { x, y };

  const { minX, minY, maxX, maxY } = getBoundaries();
  const threshold = props.snapThreshold;

  let newX = x;
  let newY = y;

  // Snap to left/right edges
  if (x - minX < threshold) {
    newX = minX;
  } else if (maxX - x < threshold) {
    newX = maxX;
  }

  // Snap to top/bottom edges
  if (y - minY < threshold) {
    newY = minY;
  } else if (maxY - y < threshold) {
    newY = maxY;
  }

  return { x: newX, y: newY };
};

const constrainToBoundaries = (x: number, y: number) => {
  const { minX, minY, maxX, maxY } = getBoundaries();
  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
};

// Initialize default position
const getDefaultPosition = (): Position => {
  const padding = props.boundaryPadding;
  return {
    x: window.innerWidth - padding - BUTTON_SIZE,
    y: window.innerHeight - padding - BUTTON_SIZE,
  };
};

// Drag functionality
const startDrag = (event: MouseEvent | TouchEvent) => {
  // Prevent drag if clicking chat content
  if (
    isChatMounted.value &&
    (event.target as HTMLElement).closest('.chat-content')
  ) {
    return;
  }

  event.preventDefault();

  const coords = getEventCoordinates(event);

  // Get the current position of the button
  const rect = chatContainer.value?.getBoundingClientRect();
  if (!rect) return;

  // Calculate offset from mouse to button top-left corner
  const offsetX = coords.x - rect.left;
  const offsetY = coords.y - rect.top;

  dragStart.value = { x: offsetX, y: offsetY };
  currentDragPosition.value = { x: position.value.x, y: position.value.y };
  hasMoved.value = false;
  isDragging.value = true;
  showDragHint.value = false;

  document.addEventListener('mousemove', handleDrag, { passive: false });
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', handleDrag, { passive: false });
  document.addEventListener('touchend', endDrag);

  // Add visual feedback
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'grabbing';
};

const handleDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;

  event.preventDefault();

  const coords = getEventCoordinates(event);

  // Calculate new position based on mouse position and initial offset
  const newX = coords.x - dragStart.value.x;
  const newY = coords.y - dragStart.value.y;

  // Check if we've actually moved
  const deltaX = newX - position.value.x;
  const deltaY = newY - position.value.y;

  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
    hasMoved.value = true;
  }

  // Constrain to boundaries during drag
  const constrained = constrainToBoundaries(newX, newY);
  currentDragPosition.value = constrained;
};

const endDrag = () => {
  if (!isDragging.value) return;

  // Clean up event listeners
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('touchend', endDrag);

  // Reset cursor
  document.body.style.userSelect = '';
  document.body.style.cursor = '';

  if (hasMoved.value) {
    // Apply snapping to final position
    const snapped = snapToEdge(
      currentDragPosition.value.x,
      currentDragPosition.value.y
    );

    // Update the final position
    position.value = snapped;

    // Save position for persistence
    savePosition();
  }

  isDragging.value = false;
  hasMoved.value = false;
};

// Position persistence
const savePosition = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chatWidgetPosition', JSON.stringify(position.value));
  }
};

const loadPosition = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chatWidgetPosition');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate position is still within bounds
        const constrained = constrainToBoundaries(parsed.x || 0, parsed.y || 0);
        position.value = constrained;
        return;
      } catch (e) {
        // Fall through to default position
      }
    }
  }

  // Use default position
  position.value = props.initialPosition || getDefaultPosition();
};

// Chat functionality
const toggleChat = () => {
  if (hasMoved.value) {
    // Don't open chat if we just finished dragging
    return;
  }

  if (!isChatOpen.value) {
    // Opening: set state immediately, mount DOM after button disappears
    isChatOpen.value = true;
    setTimeout(() => {
      isChatMounted.value = true;
    }, 120); // Wait for button to disappear (0.1s transition + buffer)
  } else {
    // Closing: unmount DOM immediately, set state after chat disappears
    isChatMounted.value = false;
    setTimeout(() => {
      isChatOpen.value = false;
    }, 120); // Wait for chat to disappear
  }

  if (isChatOpen.value) {
    hasUnreadMessages.value = false;
    unreadCount.value = 0;
    lastViewedMessageCount.value = assistantStore.messageCount;
    nextTick(() => {
      scrollToBottom();
    });
  }
};

const sendMessage = async (): Promise<void> => {
  if (!currentMessage.value.trim() || assistantStore.isLoading) return;

  const message = currentMessage.value.trim();
  currentMessage.value = '';

  // Get current context
  const context: ChatContextDto = {
    currentPage: route.path,
    errorDetails: route.query.error ? { error: route.query.error } : undefined,
  };

  try {
    await assistantStore.sendMessage(message, context);

    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    // Error handling is managed by the store
  }
};

const clearChat = (): void => {
  assistantStore.clearConversation();
  lastViewedMessageCount.value = 0;
  hasUnreadMessages.value = false;
  unreadCount.value = 0;
};

const onInputChange = (): void => {
  // Clear any typing indicators or other input-related state if needed
};

const formatTime = (date: Date | string | undefined): string => {
  // Handle undefined/null cases
  if (!date) {
    return 'Now';
  }

  // Handle both Date objects and date strings
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Now';
  }

  return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = (): void => {
  if (chatMessagesContainer.value) {
    chatMessagesContainer.value.scrollTop =
      chatMessagesContainer.value.scrollHeight;
  }
};

// Update unread count when new messages arrive and chat is closed
const updateUnreadMessages = (): void => {
  if (
    !isChatOpen.value &&
    assistantStore.messageCount > lastViewedMessageCount.value
  ) {
    const newMessageCount =
      assistantStore.messageCount - lastViewedMessageCount.value;
    // Only count assistant messages as unread
    const newAssistantMessages = assistantStore.messages
      .slice(lastViewedMessageCount.value)
      .filter((msg) => msg.role === 'assistant').length;

    if (newAssistantMessages > 0) {
      hasUnreadMessages.value = true;
      unreadCount.value = Math.min(newAssistantMessages, 9); // Cap at 9 for display
    }
  }
};

// Watch for new messages to update unread count
watch(() => assistantStore.messageCount, updateUnreadMessages);

// Auto-scroll when new messages arrive and chat is open
watch(
  () => assistantStore.messages,
  () => {
    if (isChatMounted.value) {
      nextTick(() => {
        scrollToBottom();
      });
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  loadPosition();

  // Initialize last viewed count
  lastViewedMessageCount.value = assistantStore.messageCount;

  // Handle window resize
  const handleResize = () => {
    // Reposition if outside new boundaries
    const constrained = constrainToBoundaries(
      position.value.x,
      position.value.y
    );
    if (
      constrained.x !== position.value.x ||
      constrained.y !== position.value.y
    ) {
      position.value = constrained;
      savePosition();
    }
  };

  window.addEventListener('resize', handleResize);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    // Clean up any ongoing drags
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', endDrag);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  });
});

// Watch for chat state changes to update boundaries
watch(isChatMounted, () => {
  if (isDragging.value) return; // Don't adjust during drag

  // Recheck boundaries when chat opens/closes
  const constrained = constrainToBoundaries(position.value.x, position.value.y);
  if (
    constrained.x !== position.value.x ||
    constrained.y !== position.value.y
  ) {
    position.value = constrained;
  }
});
</script>

<style scoped>
/* Chat animations */
.chat-button-enter-active {
  transition: all 0.15s ease-out;
}
.chat-button-leave-active {
  transition: all 0.1s ease-in;
}
.chat-button-enter-from,
.chat-button-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.chat-dialog-enter-active {
  transition: all 0.19s cubic-bezier(0.33, 1, 0.68, 1);
}
.chat-dialog-leave-active {
  transition: all 0.1s cubic-bezier(0.32, 0, 0.67, 0);
}
.chat-dialog-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
.chat-dialog-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.99);
}

/* Dragging enhancements */
.chat-button {
  background: linear-gradient(
    135deg,
    var(--color-primary, #4ade80),
    var(--color-secondary, #3b82f6)
  );
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.chat-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(var(--color-primary-rgb, 74, 222, 128), 0.25);
}

/* drag feedback */
.cursor-grab {
  cursor: grab;
}

.cursor-grab:hover {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing !important;
}

/* Drag hint animation */
@keyframes drag-hint {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.05) rotate(1deg);
  }
}

.drag-hint {
  animation: drag-hint 2s ease-in-out infinite;
}

/* Custom scrollbar for chat */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: var(--color-background-secondary, rgb(38, 38, 41));
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: var(--color-border, rgb(55, 65, 81));
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary, rgb(74, 222, 128));
}

/* Prevent text selection during drag */
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Touch action for better mobile experience */
.chat-container {
  touch-action: none;
}
</style>
