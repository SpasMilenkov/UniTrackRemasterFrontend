<template>
  <ClientOnly>
    <div ref="dropdownRef" class="custom-dropdown relative">
      <!-- Dropdown Trigger -->
      <button
        class="dropdown-trigger flex items-center p-2.5 rounded-lg hover:bg-background-secondary focus:outline-none transition-colors duration-200"
        @click="toggleDropdown"
      >
        <!-- Avatar -->
        <div
          v-if="avatarUrl"
          class="w-8 h-8 rounded-full overflow-hidden mr-2 border border-border/50 flex-shrink-0"
        >
          <NuxtPicture
            :src="avatarUrl"
            :alt="userName"
            class="w-full h-full object-cover"
            width="32"
            height="32"
            format="webp"
            @error="handleImageError"
          />
        </div>
        <div
          v-else
          class="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center mr-2 flex-shrink-0"
        >
          <Icon name="ion:person" class="text-text-secondary" />
        </div>

        <!-- Username -->
        <span
          class="text-text-primary text-sm font-medium overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[120px]"
        >
          {{ userName }}
        </span>

        <!-- Dropdown Icon -->
        <Icon
          name="ion:chevron-down"
          class="ml-2 text-text-secondary transition-transform"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>

      <!-- Dropdown Menu -->
      <Transition name="dropdown">
        <div
          v-if="isOpen"
          class="dropdown-menu absolute right-0 top-[calc(100%+4px)] w-52 bg-background-card border border-border rounded-md shadow-lg py-1.5 z-50"
        >
          <div
            v-for="(option) in options"
            :key="option.key"
            class="dropdown-item px-3 py-2 flex items-center cursor-pointer transition-colors"
            :class="[
              option.danger
                ? 'text-red-500 hover:bg-red-500/5'
                : 'text-text-primary hover:bg-background-secondary',
              { 'mb-1 border-b border-border pb-2.5': option.divider },
            ]"
            @click="handleOptionClick(option)"
          >
            <Icon
              v-if="option.icon"
              :name="option.icon"
              class="mr-2.5 text-lg flex-shrink-0"
              :class="option.danger ? 'text-red-500' : 'text-text-secondary'"
            />
            <span>{{ option.label }}</span>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Backdrop (when dropdown is open) -->
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="closeDropdown"/>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface DropdownOption {
  label: string;
  key: string;
  icon?: string;
  onClick?: () => void;
  divider?: boolean;
  danger?: boolean;
}

interface UserDropdownProps {
  userName: string;
  avatarUrl?: string;
  options: DropdownOption[];
}

const props = withDefaults(defineProps<UserDropdownProps>(), {
  avatarUrl: '',
  options: () => [],
});

const avatarUrl = ref(props.avatarUrl);
const isOpen = ref(false);
const dropdownRef = ref(null);

// Toggle dropdown visibility
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Close dropdown
const closeDropdown = () => {
  isOpen.value = false;
};

// Handle option click
const handleOptionClick = (option: DropdownOption) => {
  if (option.onClick) {
    option.onClick();
  }
  closeDropdown();
};

// Handle avatar image error
const handleImageError = () => {
  avatarUrl.value = '';
};

// Close on escape key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeDropdown();
  }
};

// Setup event listeners
onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeyDown);
  }
});

// Cleanup
onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeyDown);
  }
});
</script>

<style scoped>
.dropdown-trigger {
  border: 1px solid transparent;
}

.dropdown-trigger:hover {
  background-color: rgba(
    var(--color-background-secondary-rgb, 38, 38, 41),
    0.1
  );
}

.dropdown-item {
  border-radius: 4px;
  margin: 0 4px;
}

.dropdown-item:hover {
  background-color: rgba(
    var(--color-background-secondary-rgb, 38, 38, 41),
    0.6
  );
}

.dropdown-item.danger:hover {
  color: rgb(239, 68, 68); /* text-red-500 */
}

/* Transition effects */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
