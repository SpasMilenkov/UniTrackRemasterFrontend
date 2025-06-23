<template>
  <div class="flex h-screen bg-background">
    <!-- Conversations Sidebar -->
    <div class="w-80 bg-background-card flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b border">
        <div class="flex items-center justify-between mb-4">
          <h2
            class="text-xl font-semibold text-text-primary flex items-center gap-2"
          >
            <Icon name="mdi:message-text" class="text-primary" />
            Messages
            <span
              v-if="unreadCount > 0"
              class="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </h2>
          <div class="flex items-center gap-2">
            <button
              class="p-2 rounded-md bg-primary hover:bg-primary-dark transition-colors"
              title="New Message"
              @click="showNewMessageModal = true"
            >
              <Icon name="mdi:plus" class="text-white" />
            </button>
            <button
              class="p-2 rounded-md bg-background-secondary hover:bg-background transition-colors"
              title="Search"
              @click="showSearch = !showSearch"
            >
              <Icon name="mdi:magnify" class="text-text-secondary" />
            </button>
          </div>
        </div>

        <!-- Search -->
        <div v-if="showSearch" class="mb-3">
          <div class="relative">
            <Icon
              name="mdi:magnify"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
            />
            <input
              v-model="searchInput"
              placeholder="Search conversations..."
              class="w-full pl-10 pr-4 py-2 bg-background-secondary border rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <!-- Connection Status -->
        <div class="flex items-center gap-2 text-sm text-text-secondary">
          <span
            class="w-2 h-2 rounded-full"
            :class="{
              'bg-green-500': connectionState === 'connected',
              'bg-yellow-500': connectionState === 'connecting',
              'bg-orange-500': connectionState === 'reconnecting',
              'bg-red-500': connectionState === 'disconnected',
            }"
          />
          <span class="capitalize">{{ connectionState }}</span>
          <!-- DEBUG: Show message count -->
          <span v-if="activeConversation" class="text-xs text-text-muted">
            ({{ displayMessages.length }} msgs)
          </span>
        </div>
      </div>

      <!-- Conversations List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="isLoadingConversations" class="p-4">
          <div class="animate-pulse space-y-3">
            <div v-for="i in 5" :key="i" class="flex items-center gap-3">
              <div class="w-10 h-10 bg-background-secondary rounded-full" />
              <div class="flex-1">
                <div class="h-4 bg-background-secondary rounded w-3/4 mb-2" />
                <div class="h-3 bg-background-secondary rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div
            v-for="conversation in conversations"
            :key="`conv-${conversation.id}-${conversationUpdateTrigger}`"
            class="flex items-center gap-3 px-4 py-3 hover:bg-background-secondary cursor-pointer transition-all duration-200 border-l-4 border-transparent group"
            :class="{
              'bg-background-secondary border-primary':
                conversation.id === activeConversation?.id,
            }"
            @click="handleJoinConversation(conversation)"
          >
            <div class="relative flex-shrink-0">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-background ring-opacity-50"
                :class="getAvatarGradient(conversation.id || conversation.name)"
              >
                <span v-if="!conversation.avatar" class="text-sm">
                  {{ getInitials(conversation.name) }}
                </span>
                <img
                  v-if="conversation.avatar"
                  :src="conversation.avatar"
                  :alt="conversation.name"
                  class="w-full h-full rounded-full object-cover"
                  @error="handleAvatarError"
                />
              </div>
              <span
                v-if="
                  conversation.type === 'direct' &&
                  isUserOnline(conversation.otherUserId ?? '')
                "
                class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background-card shadow-sm"
              />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h4
                  class="font-medium text-text-primary truncate group-hover:text-primary transition-colors"
                >
                  {{ conversation.name }}
                </h4>
                <time
                  v-if="conversation.lastActivity"
                  class="text-xs text-text-muted"
                >
                  {{ formatMessageTime(conversation.lastActivity) }}
                </time>
              </div>
              <p
                v-if="conversation.lastMessage"
                class="text-sm text-text-secondary truncate"
              >
                {{ conversation.lastMessage.content }}
              </p>
            </div>

            <div
              v-if="conversation.unreadCount > 0"
              class="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center flex-shrink-0"
            >
              {{
                conversation.unreadCount > 99 ? '99+' : conversation.unreadCount
              }}
            </div>
          </div>
        </div>

        <!-- Empty state for conversations -->
        <div
          v-if="!isLoadingConversations && conversations.length === 0"
          class="p-8 text-center text-text-secondary"
        >
          <Icon
            name="mdi:message-outline"
            class="mx-auto mb-4 text-4xl text-text-muted"
          />
          <p class="mb-4">No conversations yet</p>
          <button
            class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
            @click="showNewMessageModal = true"
          >
            Start a conversation
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div v-if="activeConversation" class="flex-1 flex flex-col bg-background">
      <!-- Chat Header -->
      <div
        class="px-6 py-4 bg-background-card border-b border flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div class="relative">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-background ring-opacity-50"
              :class="
                getAvatarGradient(
                  activeConversation.id || activeConversation.name
                )
              "
            >
              <span v-if="!activeConversation.avatar" class="text-xs">
                {{ getInitials(activeConversation.name) }}
              </span>
              <img
                v-if="activeConversation.avatar"
                :src="activeConversation.avatar"
                :alt="activeConversation.name"
                class="w-full h-full rounded-full object-cover"
                @error="handleAvatarError"
              />
            </div>
            <span
              v-if="
                activeConversation.type === 'direct' &&
                isUserOnline(activeConversation.otherUserId ?? '')
              "
              class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background-card shadow-sm"
            />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-text-primary">
              {{ activeConversation.name }}
            </h3>
            <div
              v-if="typingUsers && typingUsers.length > 0"
              class="text-sm text-text-secondary italic flex items-center gap-1"
            >
              <Icon name="mdi:dots-horizontal" class="animate-pulse" />
              <span v-for="user in typingUsers" :key="user.userId">
                {{ user.userName || 'Someone' }} is typing...
              </span>
            </div>
            <div
              v-else-if="activeConversation.type === 'direct'"
              class="flex items-center gap-1 text-sm text-text-secondary"
            >
              <Icon
                name="mdi:circle"
                :class="
                  isUserOnline(activeConversation.otherUserId ?? '')
                    ? 'text-green-500'
                    : 'text-text-muted'
                "
                size="12"
              />
              {{
                isUserOnline(activeConversation.otherUserId ?? '')
                  ? 'Online'
                  : 'Offline'
              }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 relative">
          <button
            class="p-2 rounded-md bg-background-secondary hover:bg-background transition-colors"
            title="Chat Options"
            @click="showChatOptions = !showChatOptions"
          >
            <Icon name="mdi:dots-vertical" class="text-text-secondary" />
          </button>

          <!-- Chat Options Dropdown -->
          <div
            v-if="showChatOptions"
            v-click-outside="() => (showChatOptions = false)"
            class="absolute top-full right-0 mt-1 w-48 bg-background-card border rounded-md shadow-lg z-50"
          >
            <div class="py-1">
              <button
                class="w-full px-4 py-2 text-left text-text-secondary hover:bg-background-secondary flex items-center gap-2"
                @click="
                  () => {
                    exportConversation('json');
                    showChatOptions = false;
                  }
                "
              >
                <Icon name="mdi:download" />
                Export as JSON
              </button>
              <button
                class="w-full px-4 py-2 text-left text-text-secondary hover:bg-background-secondary flex items-center gap-2"
                @click="
                  () => {
                    exportConversation('txt');
                    showChatOptions = false;
                  }
                "
              >
                <Icon name="mdi:file-document-outline" />
                Export as Text
              </button>
              <hr class="border my-1" />
              <button
                class="w-full px-4 py-2 text-left text-red-400 hover:bg-background-secondary flex items-center gap-2"
                @click="
                  () => {
                    clearConversation();
                    showChatOptions = false;
                  }
                "
              >
                <Icon name="mdi:delete-outline" />
                Clear History
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages Container -->
      <div class="flex-1 relative">
        <div
          ref="messagesScrollbar"
          class="absolute inset-0 overflow-y-auto px-4 py-4"
          style="
            scrollbar-width: thin;
            scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
          "
          @scroll="handleScroll"
        >
          <!-- Load More Button -->
          <div v-if="hasMoreMessages" class="text-center mb-4">
            <button
              :disabled="isLoadingMoreMessages"
              class="px-4 py-2 bg-background-secondary hover:bg-background disabled:bg-background-secondary text-text-primary rounded-md transition-colors flex items-center gap-2 mx-auto"
              @click="loadMoreMessages"
            >
              <Icon
                v-if="isLoadingMoreMessages"
                name="mdi:loading"
                class="animate-spin"
              />
              <Icon v-else name="mdi:chevron-up" />
              {{
                isLoadingMoreMessages ? 'Loading...' : 'Load Earlier Messages'
              }}
            </button>
          </div>

          <!-- Search Results -->
          <div
            v-if="searchResults && searchResults.length > 0"
            class="bg-primary bg-opacity-20 border border-primary rounded-lg p-4 mb-4"
          >
            <h4
              class="font-semibold mb-2 text-text-primary flex items-center gap-2"
            >
              <Icon name="mdi:magnify" />
              Search Results
            </h4>
            <div
              v-for="result in searchResults"
              :key="result.id"
              class="p-2 hover:bg-primary hover:bg-opacity-10 cursor-pointer rounded transition-colors"
              @click="scrollToMessage(result.id)"
            >
              <strong class="text-text-primary">{{ result.senderName }}</strong>
              <p class="text-sm text-text-secondary">{{ result.content }}</p>
              <time class="text-xs text-text-muted">{{
                formatMessageTime(result.sentAt)
              }}</time>
            </div>
          </div>

          <!-- FIXED Messages with proper reactivity key -->
          <div ref="messagesContainer" class="space-y-1">
            <div
              v-for="message in displayMessages"
              :id="`message-${message.id}`"
              :key="`msg-${message.id}-${message.status}-${message.content.length}-${message.sentAt}-${messageReactivityKey}`"
              class="group transition-all duration-200 hover:bg-background-secondary hover:bg-opacity-50 -mx-4 px-4 py-2 rounded"
              :class="{
                'bg-primary bg-opacity-20': selectedMessage?.id === message.id,
              }"
              @mouseenter="handleMessageHover(message.id)"
              @mouseleave="handleMessageLeave()"
            >
              <div class="flex gap-3">
                <!-- Avatar (for others' messages) -->
                <div v-if="!message.isOwnMessage" class="flex-shrink-0 mt-1">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-background ring-opacity-50"
                    :class="
                      getAvatarGradient(message.senderId || message.senderName)
                    "
                  >
                    <span v-if="!message.senderAvatar" class="text-xs">
                      {{ getInitials(message.senderName) }}
                    </span>
                    <img
                      v-if="message.senderAvatar"
                      :src="message.senderAvatar"
                      :alt="message.senderName"
                      class="w-full h-full rounded-full object-cover"
                      @error="handleAvatarError"
                    />
                  </div>
                </div>

                <!-- Spacer for own messages -->
                <div v-else class="w-8 flex-shrink-0" />

                <div class="flex-1 min-w-0">
                  <!-- Sender name and timestamp -->
                  <div
                    v-if="
                      !message.isOwnMessage ||
                      activeConversation.type === 'group'
                    "
                    class="flex items-center gap-2 mb-1"
                  >
                    <span class="font-semibold text-text-primary">{{
                      message.senderName
                    }}</span>
                    <time class="text-xs text-text-muted">
                      {{ formatMessageTime(message.sentAt) }}
                    </time>
                    <span
                      v-if="message.isOwnMessage"
                      class="text-xs text-primary"
                    >
                      (You)
                    </span>
                  </div>

                  <!-- Reply reference -->
                  <div
                    v-if="message.parentMessageId"
                    class="flex items-center gap-1 text-xs text-text-muted mb-2 pl-4 border-l-2 border"
                  >
                    <Icon name="mdi:reply" size="14" />
                    Replying to
                    {{ message.replyToMessage?.senderName || 'a message' }}
                  </div>

                  <!-- Message content -->
                  <div class="message-content">
                    <div
                      v-if="editingMessageId === message.id"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="editContent"
                        class="flex-1 bg-background-secondary border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        @keyup.enter="handleEditSubmit(message.id)"
                        @keyup.esc="cancelEdit"
                      />
                      <button
                        class="p-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                        @click="handleEditSubmit(message.id)"
                      >
                        <Icon name="mdi:check" class="text-white" />
                      </button>
                      <button
                        class="p-2 bg-background-secondary hover:bg-background rounded-md transition-colors"
                        @click="cancelEdit"
                      >
                        <Icon name="mdi:close" class="text-text-primary" />
                      </button>
                    </div>
                    <div v-else class="text-text-primary">
                      <p
                        class="m-0"
                        :class="{
                          'italic text-text-muted': message.isDeleted,
                          'opacity-70':
                            message.status === 'Sending' ||
                            message.id.startsWith('temp-'),
                        }"
                      >
                        {{
                          message.isDeleted
                            ? 'This message was deleted'
                            : message.content
                        }}
                      </p>
                      <div
                        v-if="
                          message.editedAt ||
                          message.status === 'Sending' ||
                          message.id.startsWith('temp-')
                        "
                        class="flex items-center gap-2 mt-1"
                      >
                        <span
                          v-if="message.editedAt"
                          class="text-xs text-text-muted"
                          >(edited)</span
                        >
                        <span
                          v-if="
                            message.status === 'Sending' ||
                            message.id.startsWith('temp-')
                          "
                          class="text-xs text-text-muted flex items-center gap-1"
                        >
                          <Icon name="mdi:clock-outline" size="12" />
                          sending...
                        </span>
                      </div>
                    </div>

                    <!-- Attachments -->
                    <div
                      v-if="
                        message.attachments && message.attachments.length > 0
                      "
                      class="mt-2 space-y-1"
                    >
                      <div
                        v-for="attachment in message.attachments"
                        :key="attachment.id"
                        class="flex items-center gap-2 p-2 bg-background-secondary rounded-md"
                      >
                        <Icon name="mdi:paperclip" class="text-text-muted" />
                        <a
                          :href="attachment.url"
                          target="_blank"
                          class="text-primary hover:text-primary-light text-sm underline"
                        >
                          {{ attachment.fileName }}
                        </a>
                      </div>
                    </div>
                  </div>

                  <!-- Message metadata for own messages -->
                  <div
                    v-if="message.isOwnMessage"
                    class="flex items-center justify-end gap-2 mt-1 text-xs text-text-muted"
                  >
                    <time>{{ formatMessageTime(message.sentAt) }}</time>
                    <Icon
                      v-if="
                        message.status === 'Sending' ||
                        message.id.startsWith('temp-')
                      "
                      name="mdi:clock-outline"
                      size="14"
                      class="text-yellow-500"
                    />
                    <Icon
                      v-else-if="message.status === 'Sent'"
                      name="mdi:check"
                      size="14"
                      class="text-text-muted"
                    />
                    <Icon
                      v-else-if="message.status === 'Delivered'"
                      name="mdi:check-all"
                      size="14"
                      class="text-text-muted"
                    />
                    <Icon
                      v-else-if="message.status === 'Read'"
                      name="mdi:check-all"
                      size="14"
                      class="text-primary"
                    />
                  </div>

                  <!-- Reactions -->
                  <div
                    v-if="
                      message.reactions &&
                      Object.keys(message.reactions.reactionCounts || {})
                        .length > 0
                    "
                    class="flex flex-wrap gap-1 mt-2"
                  >
                    <button
                      v-for="(count, reactionType) in message.reactions
                        .reactionCounts"
                      :key="reactionType"
                      class="flex items-center gap-1 px-2 py-1 bg-background-secondary hover:bg-background rounded-full text-xs transition-colors"
                      :class="{
                        'ring-1 ring-primary bg-primary bg-opacity-20':
                          message.reactions.userReactions?.includes(
                            reactionType as ReactionType
                          ),
                      }"
                      @click="
                        toggleReaction(message.id, reactionType as ReactionType)
                      "
                    >
                      <span>{{
                        getReactionEmoji(reactionType as ReactionType)
                      }}</span>
                      <span class="text-text-secondary">{{ count }}</span>
                    </button>
                  </div>

                  <!-- Message actions (on hover) -->
                  <div
                    v-if="
                      !message.isDeleted &&
                      (hoveredMessageId === message.id ||
                        showReactionPicker === message.id ||
                        showDeleteConfirm === message.id) &&
                      !message.id.startsWith('temp-')
                    "
                    class="transition-opacity duration-200 flex items-center gap-1 mt-2 relative z-10"
                    :class="{
                      'opacity-100':
                        hoveredMessageId === message.id ||
                        showReactionPicker === message.id ||
                        showDeleteConfirm === message.id,
                      'opacity-0 group-hover:opacity-100':
                        hoveredMessageId !== message.id &&
                        showReactionPicker !== message.id &&
                        showDeleteConfirm !== message.id,
                    }"
                  >
                    <button
                      class="p-1 rounded bg-background-card hover:bg-background-secondary transition-colors border border-transparent hover:border-gray-300"
                      title="Reply"
                      @click.stop="replyToMessage(message)"
                    >
                      <Icon
                        name="mdi:reply"
                        size="16"
                        class="text-text-secondary"
                      />
                    </button>

                    <!-- Reaction button with improved positioning -->
                    <div class="relative">
                      <button
                        class="p-1 rounded bg-background-card hover:bg-background-secondary transition-colors border border-transparent hover:border-gray-300"
                        title="Add Reaction"
                        @click.stop="toggleReactionPicker(message.id)"
                      >
                        <Icon
                          name="mdi:emoticon-outline"
                          size="16"
                          class="text-text-secondary"
                        />
                      </button>

                      <!-- Reaction Picker with improved positioning and z-index -->
                      <div
                        v-if="showReactionPicker === message.id"
                        v-click-outside="() => (showReactionPicker = null)"
                        class="absolute bottom-full left-0 mb-2 p-2 bg-background-card border rounded-lg shadow-2xl z-50 flex gap-1 backdrop-blur-sm"
                        style="min-width: max-content"
                        @click.stop
                      >
                        <button
                          v-for="option in reactionOptions"
                          :key="option.key"
                          class="p-2 rounded hover:bg-background-secondary transition-colors text-lg min-w-[36px] min-h-[36px] flex items-center justify-center border border-transparent hover:border-primary"
                          :title="option.label"
                          @click="
                            () => {
                              addReaction(message.id, option.key);
                              showReactionPicker = null;
                            }
                          "
                        >
                          {{ option.label }}
                        </button>
                      </div>
                    </div>

                    <button
                      v-if="message.isOwnMessage"
                      class="p-1 rounded bg-background-card hover:bg-background-secondary transition-colors border border-transparent hover:border-gray-300"
                      title="Edit"
                      @click.stop="startEdit(message)"
                    >
                      <Icon
                        name="mdi:pencil"
                        size="16"
                        class="text-text-secondary"
                      />
                    </button>

                    <!-- Delete button with improved event handling -->
                    <div v-if="message.isOwnMessage" class="relative">
                      <button
                        class="p-1 rounded bg-background-card hover:bg-red-600 transition-colors border border-transparent hover:border-red-500"
                        title="Delete"
                        @click.stop="showDeleteConfirm = message.id"
                      >
                        <Icon
                          name="mdi:delete-outline"
                          size="16"
                          class="text-text-secondary hover:text-white"
                        />
                      </button>

                      <!-- Delete Confirmation with improved positioning and z-index -->
                      <div
                        v-if="showDeleteConfirm === message.id"
                        v-click-outside="() => (showDeleteConfirm = null)"
                        class="absolute bottom-full right-0 mb-2 p-3 bg-background-card border rounded-lg shadow-2xl z-50 min-w-[200px] backdrop-blur-sm"
                        @click.stop
                      >
                        <p class="text-sm text-text-secondary mb-3">
                          Delete this message?
                        </p>
                        <div class="flex gap-2">
                          <button
                            class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                            @click="
                              () => {
                                handleDeleteMessage(message.id);
                                showDeleteConfirm = null;
                              }
                            "
                          >
                            Delete
                          </button>
                          <button
                            class="px-3 py-1 bg-background-secondary hover:bg-background text-text-primary rounded text-sm transition-colors"
                            @click="showDeleteConfirm = null"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state for messages -->
            <div
              v-if="displayMessages.length === 0 && !isLoadingMessages"
              class="flex flex-col items-center justify-center py-16 text-text-secondary"
            >
              <Icon
                name="mdi:message-outline"
                class="text-6xl mb-4 text-text-muted"
              />
              <p class="text-lg mb-2">No messages yet</p>
              <p class="text-sm">Start the conversation!</p>
            </div>

            <!-- Loading state -->
            <div v-if="isLoadingMessages" class="flex justify-center py-8">
              <div class="flex items-center gap-2 text-text-secondary">
                <Icon name="mdi:loading" class="animate-spin" />
                <span>Loading messages...</span>
              </div>
            </div>

            <div ref="messagesEndRef" />
          </div>
        </div>
      </div>

      <!-- Reply Preview -->
      <div
        v-if="replyingTo"
        class="px-6 py-3 bg-background-secondary border-t border flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <Icon name="mdi:reply" class="text-primary" />
          <div>
            <strong class="text-sm text-text-primary"
              >Replying to {{ replyingTo.senderName }}</strong
            >
            <p class="text-sm text-text-secondary truncate max-w-md m-0">
              {{ replyingTo.content }}
            </p>
          </div>
        </div>
        <button
          class="p-1 rounded hover:bg-background transition-colors"
          @click="cancelReply"
        >
          <Icon name="mdi:close" class="text-text-secondary" />
        </button>
      </div>

      <!-- Message Input -->
      <div class="bg-background-card border-t border p-4">
        <div class="flex items-end gap-3">
          <div class="flex-1 relative">
            <textarea
              v-model="messageInput"
              placeholder="Type a message..."
              rows="1"
              class="w-full bg-background-secondary border rounded-md px-4 py-3 text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent max-h-32"
              style="min-height: 44px"
              @input="handleTypingInput"
              @keydown.enter.exact.prevent="handleSendMessage"
            />
          </div>

          <button
            :disabled="!canSendMessage"
            :class="{
              'bg-primary hover:bg-primary-dark': canSendMessage,
              'bg-background-secondary cursor-not-allowed': !canSendMessage,
            }"
            class="p-3 rounded-md transition-colors flex items-center justify-center"
            @click="handleSendMessage"
          >
            <Icon
              v-if="isSendingMessage"
              name="mdi:loading"
              class="text-white animate-spin"
            />
            <Icon v-else name="mdi:send" class="text-white" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex-1 flex flex-col items-center justify-center text-text-secondary bg-background"
    >
      <Icon
        name="mdi:message-text-outline"
        class="text-8xl mb-6 text-text-muted"
      />
      <h3 class="text-2xl font-semibold mb-2 text-text-primary">
        Select a conversation to start messaging
      </h3>
      <p class="text-text-secondary mb-6">
        Choose from your existing conversations or start a new one
      </p>
      <button
        class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors flex items-center gap-2"
        @click="showNewMessageModal = true"
      >
        <Icon name="mdi:plus" />
        New Message
      </button>
    </div>

    <!-- New Message Modal -->
    <div
      v-if="showNewMessageModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showNewMessageModal = false"
    >
      <div
        class="bg-background-card rounded-lg shadow-xl border w-full max-w-md mx-4"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-text-primary">New Message</h3>
            <button
              class="p-1 rounded hover:bg-background-secondary transition-colors"
              @click="showNewMessageModal = false"
            >
              <Icon name="mdi:close" class="text-text-secondary" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-2">
                Search for a user
              </label>
              <div class="relative">
                <Icon
                  name="mdi:magnify"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                />
                <input
                  v-model="newMessageSearch"
                  placeholder="Enter name or email..."
                  class="w-full pl-10 pr-4 py-2 bg-background-secondary border rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  @input="searchUsers"
                />
              </div>
            </div>

            <!-- Loading state -->
            <div v-if="isSearchingUsers" class="flex justify-center py-4">
              <Icon name="mdi:loading" class="animate-spin text-primary" />
            </div>

            <!-- User Search Results -->
            <div
              v-else-if="userSearchResults.length > 0"
              class="max-h-40 overflow-y-auto border rounded-md"
            >
              <button
                v-for="user in userSearchResults"
                :key="user.id"
                class="w-full p-3 text-left hover:bg-background-secondary transition-colors flex items-center gap-3 border-b border last:border-b-0"
                @click="selectUserForNewMessage(user)"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-md ring-2 ring-background ring-opacity-50"
                  :class="getAvatarGradient(user.id || user.firstName)"
                >
                  <span v-if="!user.profileImageUrl" class="text-xs">
                    {{ getInitials(user.firstName + ' ' + user.lastName) }}
                  </span>
                  <img
                    v-if="user.profileImageUrl"
                    :src="user.profileImageUrl"
                    :alt="user.firstName + ' ' + user.lastName"
                    class="w-full h-full rounded-full object-cover"
                    @error="handleAvatarError"
                  />
                </div>
                <div>
                  <p class="text-text-primary font-medium">
                    {{ user.firstName + ' ' + user.lastName }}
                  </p>
                  <p class="text-text-secondary text-sm">{{ user.email }}</p>
                </div>
              </button>
            </div>

            <div
              v-else-if="newMessageSearch && newMessageSearch.length >= 2"
              class="text-center py-4 text-text-secondary"
            >
              No users found
            </div>

            <div v-else class="text-center py-4 text-text-muted text-sm">
              Type at least 2 characters to search for users
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageDto, ConversationDto } from '~/interfaces/chat';
import { useChat } from '~/composables/useChat.client';
import { watchDebounced } from '@vueuse/core';
import type { ReactionType } from '~/enums/reaction-type.enum';
import type { UserDetailsResponse } from '~/interfaces/user/user-response.dto';

definePageMeta({
  layout: 'chat-layout',
  ssr: false,
});

// Import and use the chat composable with all its utilities
const {
  conversations,
  activeConversation,
  messages,
  typingUsers,
  unreadCount,
  connectionState,
  messageInput,
  isLoadingConversations,
  isLoadingMessages,
  isSendingMessage,
  isLoadingMoreMessages,
  hasMoreMessages,
  searchResults,
  replyingTo,
  canSendMessage,
  reactionOptions,
  joinConversation,
  sendMessage,
  handleTyping,
  loadMoreMessages,
  editMessage,
  deleteMessage,
  reactToMessage,
  replyToMessage,
  cancelReply,
  searchMessages,
  isUserOnline,
  formatMessageTime,
  exportConversation,
  clearConversation,
  getReactionEmoji,
  scrollToBottom,
  isAtBottom,
} = useChat();

// Get chat store for debugging
const chatStore = useChatStore();

// Local reactive state for UI-only concerns
const showSearch = ref(false);
const searchInput = ref('');
const editingMessageId = ref<string | null>(null);
const editContent = ref('');
const hoveredMessageId = ref<string | null>(null);
const selectedMessage = ref<ChatMessageDto | null>(null);
const messagesScrollbar = ref<HTMLElement | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);
const messagesEndRef = ref<HTMLElement | null>(null);
const showChatOptions = ref(false);
const showReactionPicker = ref<string | null>(null);
const showDeleteConfirm = ref<string | null>(null);
const showNewMessageModal = ref(false);
const newMessageSearch = ref('');
const userSearchResults = ref<Array<UserDetailsResponse>>([]);
const isSearchingUsers = ref(false);

// FIXED: Reactivity triggers for forcing updates
const messageReactivityKey = ref(0);
const conversationUpdateTrigger = ref(0);

// CRITICAL FIX: Enhanced reactive display messages with proper dependency tracking
const displayMessages = computed(() => {
  // Force dependency on store trigger
  chatStore.messageUpdateTrigger;
  messageReactivityKey.value; // Force dependency on local trigger

  const msgs = messages.value || [];

  console.log('🔄 DisplayMessages computed triggered:', {
    messageCount: msgs.length,
    storeUpdateTrigger: chatStore.messageUpdateTrigger,
    localReactivityKey: messageReactivityKey.value,
    activeConversation: activeConversation.value?.id,
  });

  return msgs;
});

// ENHANCED: Multi-level reactivity watchers with comprehensive logging
watch(
  () => messages.value,
  (newMessages, oldMessages) => {
    const newCount = newMessages?.length || 0;
    const oldCount = oldMessages?.length || 0;

    console.log('📨 Messages watcher triggered:', {
      newCount,
      oldCount,
      difference: newCount - oldCount,
      activeConversation: activeConversation.value?.id,
      lastMessage: newMessages?.[newMessages.length - 1]?.content?.substring(
        0,
        30
      ),
    });

    // Force local reactivity update
    messageReactivityKey.value++;

    // Auto-scroll if at bottom and new messages arrived
    if (newMessages && oldMessages && newCount > oldCount) {
      console.log('🔄 New messages detected, checking scroll position...');
      nextTick(() => {
        if (isAtBottom()) {
          console.log('📍 At bottom, auto-scrolling...');
          scrollToBottom(true);
        } else {
          console.log('📍 Not at bottom, skipping auto-scroll');
        }
      });
    }
  },
  { immediate: true, deep: true }
);

// Watch store's message update trigger
watch(
  () => chatStore.messageUpdateTrigger,
  (newTrigger, oldTrigger) => {
    console.log('🔔 Store message trigger changed:', {
      from: oldTrigger,
      to: newTrigger,
    });
    messageReactivityKey.value++;
  },
  { immediate: true }
);

// Watch active conversation changes
watch(
  () => activeConversation.value?.id,
  (newId, oldId) => {
    console.log('🔄 Active conversation changed:', { from: oldId, to: newId });
    if (newId !== oldId) {
      // Force conversation and message refresh
      conversationUpdateTrigger.value++;
      messageReactivityKey.value++;

      // Close any open dropdowns when switching conversations
      showReactionPicker.value = null;
      showDeleteConfirm.value = null;
      hoveredMessageId.value = null;

      nextTick(() => {
        console.log('📍 Scrolling to bottom after conversation change');
        scrollToBottom(false);
      });
    }
  },
  { immediate: true }
);

// Watch connection state changes
watch(
  () => connectionState.value,
  (state) => {
    console.log('🔗 Connection state changed to:', state);
    if (state === 'connected') {
      // Force refresh when reconnected
      messageReactivityKey.value++;
      conversationUpdateTrigger.value++;
    }
  },
  { immediate: true }
);

// ENHANCED: Development debugging
if (import.meta.dev) {
  watch(
    [
      () => connectionState.value,
      () => activeConversation.value?.id,
      messageReactivityKey,
      () => chatStore.messageUpdateTrigger,
    ],
    ([connState, convId, localTrigger, storeTrigger]) => {
      console.log('🐛 Chat Debug State:', {
        connectionState: connState,
        activeConversationId: convId,
        messageCount: displayMessages.value?.length || 0,
        localReactivityTrigger: localTrigger,
        storeUpdateTrigger: storeTrigger,
        lastMessage: displayMessages.value?.[
          displayMessages.value.length - 1
        ]?.content?.substring(0, 50),
        isConnected: connState === 'connected',
      });
    },
    { immediate: true }
  );

  // Debug SignalR events
  onMounted(() => {
    console.log('🔍 Setting up debug listeners...');

    // Add test listeners to verify SignalR is working
    if (chatStore.hubConnection) {
      chatStore.hubConnection.on('ReceiveDirectMessage', (msg) => {
        console.log('🔥 DEBUG: Direct message received:', msg);
      });

      chatStore.hubConnection.on('ReceiveGroupMessage', (msg) => {
        console.log('🔥 DEBUG: Group message received:', msg);
      });
    }
  });
}

const getInitials = (name: string) => {
  if (!name) return '?';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const getAvatarGradient = (identifier: string) => {
  if (!identifier) return 'bg-gradient-to-br from-blue-500 to-purple-600';

  // Create a hash from the identifier to ensure consistent colors
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Define gradient combinations
  const gradients = [
    'bg-gradient-to-br from-blue-500 to-purple-600',
    'bg-gradient-to-br from-green-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-pink-600',
    'bg-gradient-to-br from-orange-500 to-red-600',
    'bg-gradient-to-br from-cyan-500 to-blue-600',
    'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-gradient-to-br from-violet-500 to-purple-600',
    'bg-gradient-to-br from-amber-500 to-orange-600',
    'bg-gradient-to-br from-rose-500 to-pink-600',
    'bg-gradient-to-br from-indigo-500 to-blue-600',
    'bg-gradient-to-br from-lime-500 to-green-600',
    'bg-gradient-to-br from-teal-500 to-cyan-600',
  ];

  // Use hash to pick a consistent gradient
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const handleAvatarError = (event: Event) => {
  const target = event.target as HTMLElement | null;
  if (target && 'style' in target) {
    (target as HTMLElement).style.display = 'none';
  }
};

// ENHANCED: Methods that use the composable functions with additional logging
const handleJoinConversation = async (conversation: ConversationDto) => {
  console.log('🔄 Joining conversation:', conversation.id, conversation.name);
  await joinConversation(conversation);

  // Force reactivity updates
  messageReactivityKey.value++;
  conversationUpdateTrigger.value++;

  // Small delay to ensure store is updated
  setTimeout(() => {
    messageReactivityKey.value++;
  }, 100);
};

const handleSendMessage = async () => {
  console.log('🚀 Sending message:', messageInput.value?.substring(0, 50));
  await sendMessage();

  // Force reactivity update
  messageReactivityKey.value++;
};

const handleTypingInput = () => {
  handleTyping();
};

const startEdit = (message: ChatMessageDto) => {
  editingMessageId.value = message.id;
  editContent.value = message.content;
};

const cancelEdit = () => {
  editingMessageId.value = null;
  editContent.value = '';
};

const handleEditSubmit = async (messageId: string) => {
  if (editContent.value.trim()) {
    console.log('✏️ Editing message:', messageId);
    await editMessage(messageId, editContent.value);
    cancelEdit();

    // Force reactivity update
    messageReactivityKey.value++;
  }
};

const handleDeleteMessage = async (messageId: string) => {
  console.log('🗑️ Deleting message:', messageId);
  await deleteMessage(messageId);
  showDeleteConfirm.value = null;

  // Force reactivity update
  messageReactivityKey.value++;
};

const addReaction = async (messageId: string, reactionType: ReactionType) => {
  console.log(
    '🎭 Component: Adding reaction:',
    reactionType,
    'to message:',
    messageId
  );
  await reactToMessage(messageId, reactionType);
  showReactionPicker.value = null;

  // Force reactivity update
  messageReactivityKey.value++;
};

const toggleReaction = async (
  messageId: string,
  reactionType: ReactionType
) => {
  console.log(
    '🎭 Component: Toggling reaction:',
    reactionType,
    'on message:',
    messageId
  );
  await reactToMessage(messageId, reactionType);

  // Force reactivity update
  messageReactivityKey.value++;
};

const toggleReactionPicker = (messageId: string) => {
  console.log('🎭 Toggling reaction picker for message:', messageId);
  // Close any other open pickers first
  if (showReactionPicker.value === messageId) {
    showReactionPicker.value = null;
  } else {
    showReactionPicker.value = messageId;
    // Also close delete confirm if open
    showDeleteConfirm.value = null;
  }
};

const scrollToMessage = (messageId: string) => {
  const element = document.getElementById(`message-${messageId}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    selectedMessage.value =
      displayMessages.value.find((m) => m.id === messageId) || null;
    setTimeout(() => {
      selectedMessage.value = null;
    }, 3000);
  }
};

const handleMessageHover = (messageId: string) => {
  hoveredMessageId.value = messageId;
};

const handleMessageLeave = () => {
  // Don't hide if a dropdown is open for this message
  if (!showReactionPicker.value && !showDeleteConfirm.value) {
    hoveredMessageId.value = null;
  }
};

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;

  // Close any open dropdowns when scrolling
  showReactionPicker.value = null;
  showDeleteConfirm.value = null;

  if (
    target.scrollTop === 0 &&
    hasMoreMessages.value &&
    !isLoadingMoreMessages.value
  ) {
    loadMoreMessages();
  }
};

// ENHANCED: New Message functionality with proper search
const searchUsers = watchDebounced(
  () => newMessageSearch.value,
  async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      userSearchResults.value = [];
      return;
    }

    isSearchingUsers.value = true;

    try {
      const userStore = useUserStore();

      // Use the existing paginated user search
      const results = await userStore.fetchPaginatedUsers({
        pageNumber: 1,
        pageSize: 10,
        ascending: true,
        searchTerm: searchTerm,
      });

      if (results?.users) {
        // Filter out current user and users we already have conversations with
        const authStore = useAuthStore();
        const existingConversationUserIds = conversations.value
          .filter((c) => c.type === 'direct')
          .map((c) => c.otherUserId);

        userSearchResults.value = results.users.filter(
          (user) =>
            user.id !== authStore.user?.id &&
            !existingConversationUserIds.includes(user.id)
        );
      } else {
        userSearchResults.value = [];
      }
    } catch (error) {
      console.error('Failed to search users:', error);
      userSearchResults.value = [];
    } finally {
      isSearchingUsers.value = false;
    }
  },
  { debounce: 300 }
);

const selectUserForNewMessage = async (user: UserDetailsResponse) => {
  try {
    console.log(
      '🔄 Starting conversation with user:',
      user.firstName,
      user.lastName
    );

    // Check if conversation already exists
    const existingConversation = conversations.value.find(
      (conv) => conv.type === 'direct' && conv.otherUserId === user.id
    );

    if (existingConversation) {
      // Join existing conversation
      console.log('📂 Found existing conversation:', existingConversation.id);
      await joinConversation(existingConversation);
    } else {
      // Create new conversation object
      console.log('🆕 Creating new conversation for user:', user.id);
      const newConversation: ConversationDto = {
        id: user.id,
        type: 'direct',
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.profileImageUrl,
        otherUserId: user.id,
        groupId: null,
        lastMessage: null,
        unreadCount: 0,
        lastActivity: null,
        onlineUserIds: [],
      };

      await joinConversation(newConversation);
    }

    // Close modal and reset
    showNewMessageModal.value = false;
    newMessageSearch.value = '';
    userSearchResults.value = [];

    // Force reactivity updates
    messageReactivityKey.value++;
    conversationUpdateTrigger.value++;
  } catch (error) {
    console.error('❌ Failed to start conversation:', error);
  }
};

// Watch for search input changes with debounce
watchDebounced(
  searchInput,
  (value: string) => {
    searchMessages(value);
  },
  { debounce: 300 }
);

// Click outside directive for dropdowns
type ClickOutsideElement = HTMLElement & {
  clickOutsideEvent?: (event: Event) => void;
};

const vClickOutside = {
  beforeMount(el: HTMLElement, binding: any) {
    const element = el as ClickOutsideElement;
    element.clickOutsideEvent = (event: Event) => {
      const target = event.target as Node;
      if (!(element === target || element.contains(target))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', element.clickOutsideEvent);
  },
  unmounted(el: HTMLElement) {
    const element = el as ClickOutsideElement;
    if (element.clickOutsideEvent) {
      document.removeEventListener('click', element.clickOutsideEvent);
    }
  },
};

// ENHANCED: Lifecycle hooks with better debugging
onMounted(() => {
  console.log('📱 Chat component mounted');

  // Force initial reactivity
  messageReactivityKey.value++;
  conversationUpdateTrigger.value++;

  // Setup interval to force reactivity updates (temporary debugging)
  if (import.meta.dev) {
    const interval = setInterval(() => {
      const messageCount = messages.value?.length || 0;
      const storeCount = chatStore.activeConversationMessages?.length || 0;

      if (messageCount !== storeCount) {
        console.log('🔄 Message count mismatch detected, forcing update:', {
          componentMessages: messageCount,
          storeMessages: storeCount,
        });
        messageReactivityKey.value++;
      }
    }, 1000);

    onUnmounted(() => {
      clearInterval(interval);
    });
  }
});

onUnmounted(() => {
  console.log('📱 Chat component unmounted');
});
</script>

<style scoped>
/* Custom scrollbar for messages container */
.absolute.inset-0.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.absolute.inset-0.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.absolute.inset-0.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(99, 102, 241, 0.3);
  border-radius: 3px;
}

.absolute.inset-0.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(99, 102, 241, 0.5);
}

/* Ensure proper hover states */
.group:hover .opacity-0 {
  opacity: 1 !important;
}

/* Custom textarea auto-resize */
textarea {
  field-sizing: content;
}

/* Ensure dropdowns are above other content */
.z-50 {
  z-index: 50;
}

/* Backdrop blur fallback */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Ensure button interactions work */
button {
  user-select: none;
}

/* Smooth transitions for message actions */
.transition-opacity {
  transition: opacity 0.2s ease-in-out;
}
</style>
