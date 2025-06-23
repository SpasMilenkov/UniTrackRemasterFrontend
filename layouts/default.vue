<template>
  <n-layout>
    <!-- Main Navbar -->
    <n-layout-header
      class="fixed top-0 w-full bg-background-card border-b border-border z-40 transition-all duration-300"
      :class="{ '!z-20': isMobileMenuOpen }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <NuxtLink class="flex items-center space-x-2" to="/">
            <LogoComponent />
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-6">
            <!-- Institutions Link -->
            <NuxtLink
              :to="localePath('/list')"
              class="flex items-center space-x-2 text-text-secondary hover:text-primary relative p-2 rounded-lg hover:bg-primary/5 nav-link transition-all duration-300"
            >
              <Icon name="ion:school" class="text-lg" />
              <span class="font-medium">{{
                t('navigation.institutions')
              }}</span>
            </NuxtLink>

            <!-- Render auth section based on authentication status -->
            <template v-if="!isAuthenticated">
              <n-button
                class="text-text-secondary hover:text-primary relative p-1 rounded hover:bg-primary/5 nav-link"
                text
                @click="navigation.navigateToLogin"
              >
                <template #icon>
                  <n-icon class="text-lg">
                    <log-in-outline />
                  </n-icon>
                </template>
                <span class="ml-1">{{ t('navigation.login') }}</span>
              </n-button>
              <n-button
                class="register-button rounded-lg font-medium shadow-sm hover:shadow-primary/20 transition-all duration-300"
                type="primary"
                @click="navigation.navigateToRegister"
              >
                <template #icon>
                  <n-icon class="text-lg">
                    <person-add-outline />
                  </n-icon>
                </template>
                <span class="ml-1">{{ t('navigation.register') }}</span>
              </n-button>
            </template>

            <!-- User profile dropdown when authenticated -->
            <ClientOnly>
              <UserDropdown
                v-if="isAuthenticated"
                :user-name="userProfile?.name || 'User'"
                :avatar-url="userProfile?.avatar || ''"
                :options="userMenuOptions || []"
              />
              <template #fallback>
                <!-- Placeholder for SSR -->
                <div class="h-10 w-10" />
              </template>
            </ClientOnly>
          </div>

          <!-- Mobile Menu Button -->
          <n-button class="md:hidden" secondary @click="toggleMobileMenu">
            <template #icon>
              <n-icon>
                <menu-outline v-if="!isMobileMenuOpen" />
                <close-outline v-else />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </n-layout-header>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
      @click="closeMobileMenu"
    />

    <!-- Mobile Sidebar -->
    <Transition name="slide" @after-leave="handleTransitionEnd">
      <div
        v-if="isMobileMenuOpen"
        class="fixed top-0 left-0 w-72 h-full bg-background-card border-r border-border overflow-y-auto z-40"
        @click.stop
      >
        <div class="p-6 pt-4">
          <NuxtLink class="flex items-center" to="/" @click="closeMobileMenu">
            <LogoComponent />
          </NuxtLink>

          <!-- Mobile user info when authenticated -->
          <div
            v-if="isAuthenticated"
            class="mt-6 mb-4 px-4 py-3 bg-background-secondary rounded-lg"
          >
            <div class="flex items-center">
              <div
                v-if="userProfile?.avatar"
                class="relative w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-primary/10"
              >
                <img
                  :src="userProfile.avatar"
                  :alt="userProfile.name"
                  class="w-full h-full object-cover"
                  @error="onAvatarError"
                >
              </div>
              <div
                v-else
                class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3"
              >
                <Icon name="ion:person" class="text-primary text-xl" />
              </div>
              <div>
                <div class="font-medium text-text-primary">
                  {{ userProfile?.name || 'User' }}
                </div>
                <div class="text-xs text-text-secondary">
                  {{ userProfile?.email || '' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Navigation Links -->
          <div class="space-y-6">
            <div class="space-y-2">
              <!-- Common navigation links -->
              <NuxtLink
                v-for="item in mobileNavigationOptions"
                :key="item.key"
                :to="localePath(item.key)"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors duration-200"
                @click="closeMobileMenu"
              >
                <Icon :name="item.icon || 'ion:menu'" class="text-lg mr-2" />
                <span>{{ item.label }}</span>
              </NuxtLink>
            </div>

            <!-- Mobile Action Buttons for unauthenticated users -->
            <div
              v-if="!isAuthenticated"
              class="space-y-2 pt-4 border-t border-border"
            >
              <n-button
                block
                secondary
                class="mobile-nav-button border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                @click="navigateAndClose('/login')"
              >
                <template #icon>
                  <n-icon><log-in-outline /></n-icon>
                </template>
                {{ t('navigation.login') }}
              </n-button>
              <n-button
                block
                type="primary"
                @click="navigateAndClose('/register')"
              >
                <template #icon>
                  <n-icon><person-add-outline /></n-icon>
                </template>
                {{ t('navigation.register') }}
              </n-button>
            </div>

            <!-- Logout button for authenticated users -->
            <div v-else class="space-y-2 pt-4 border-t border-border">
              <n-button
                block
                secondary
                class="mobile-nav-button text-red-500 hover:text-red-600 border-border hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                @click="handleLogoutAndClose"
              >
                <template #icon>
                  <n-icon><log-out-outline /></n-icon>
                </template>
                {{ t('navigation.logout') }}
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <n-layout-content>
      <div class="pt-16 bg-background">
        <slot />
      </div>

      <!-- Assistant PopUp Component -->
      <AssistantPopUp
        :snap-to-edges="false"
        :snap-threshold="50"
        :boundary-padding="20"
        :initial-position="{ x: 24, y: 24 }"
      />
    </n-layout-content>

    <!-- Footer -->
    <n-layout-footer bordered>
      <FooterComponent />
    </n-layout-footer>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'nuxt/app';
import {
  LogInOutline,
  PersonAddOutline,
  MenuOutline,
  CloseOutline,
  LogOutOutline,
} from '@vicons/ionicons5';
import {
  NIcon,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NButton,
} from 'naive-ui';
import LogoComponent from '~/components/LogoComponent.vue';
import UserDropdown from '~/components/user/DropdownComponent.vue';
import AssistantPopUp from '~/components/generic/AssistantPopUp.vue';
import { useNavigation } from '~/composables/useNavigation';

// Layout state
const isMobileMenuOpen = ref(false);

// Navigation utilities
const router = useRouter();
const { t } = useI18n();
const localePath = useLocalePath();
const authStore = useAuthStore();

// Get navigation utilities and user state
const navigation = useNavigation();
const isAuthenticated = computed(() => navigation.isAuthenticated.value);
const userProfile = computed(() => navigation.userProfile.value);
const userMenuOptions = computed(() => navigation.userMenuOptions.value);

// Handle avatar error
const onAvatarError = () => {
  if (userProfile.value) {
    userProfile.value.avatar = '';
  }
};

// Mobile navigation options
const mobileNavigationOptions = computed(() => {
  // Base options available to everyone
  const baseOptions = [
    {
      label: t('navigation.institutions'),
      key: '/institutions',
      icon: 'ion:school',
    },
  ];

  // Dynamic options based on auth status
  if (isAuthenticated.value) {
    return [
      ...baseOptions,
      {
        label: t('navigation.dashboard'),
        key: '/users/dashboard',
        icon: 'ion:grid',
      },
      {
        label: t('navigation.profile'),
        key: '/users/profile',
        icon: 'ion:person',
      },
    ];
  } else {
    return [
      { label: t('navigation.home'), key: '/', icon: 'ion:home' },
      ...baseOptions,
      { label: t('navigation.features'), key: '/#features', icon: 'ion:star' },
      {
        label: t('navigation.pricing'),
        key: '/#pricing',
        icon: 'ion:pricetag',
      },
    ];
  }
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const navigateAndClose = (path: string) => {
  navigateTo(localePath(path));
  closeMobileMenu();
};

const handleLogoutAndClose = () => {
  navigation.handleLogout();
  closeMobileMenu();
};

// Improved mobile detection with better breakpoint
const checkMobile = () => {
  const width = window.innerWidth;
  // Close mobile menu if switching to desktop
  if (width >= 768 && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

// Debounced resize handler for better performance
let resizeTimeout: NodeJS.Timeout;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(checkMobile, 100);
};

const handleTransitionEnd = () => {
  if (!isMobileMenuOpen.value) {
    document.body.style.overflow = '';
  }
};

// Close mobile menu after navigation
if (import.meta.client) {
  router.afterEach(() => {
    closeMobileMenu();
  });
}

onMounted(() => {
  authStore.validateSession();

  if (import.meta.client) {
    window.addEventListener('resize', handleResize);

    watch(isMobileMenuOpen, (isOpen) => {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', handleResize);
    if (resizeTimeout) clearTimeout(resizeTimeout);
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
/* Slide transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Navigation links */
.nav-link {
  position: relative;
  padding: 0.25rem;
  border-radius: 0.25rem;
  font-weight: 500;
  white-space: nowrap;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0.125rem;
  background-color: var(--color-primary);
  transition: all 0.3s;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

/* Mobile nav items */
.mobile-nav-button {
  color: var(--color-text-secondary) !important;
  padding: 0.75rem 1rem !important;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-bottom: 0.25rem;
  text-align: left !important;
  display: flex !important;
  justify-content: flex-start !important;
}

.mobile-nav-button:hover {
  color: var(--color-primary) !important;
  background-color: rgba(
    var(--color-primary-rgb, 74, 222, 128),
    0.05
  ) !important;
}

.register-button:hover {
  transform: translateY(-1px);
}

/* Responsive styles */
@media (max-width: 768px) {
  :deep(.n-layout-header) {
    padding: 0;
  }

  :deep(.n-layout-header .max-w-none) {
    padding: 0 1rem;
  }
}

/* Dropdown styles */
:deep(.n-dropdown-menu) {
  background-color: var(--color-background-card) !important;
  border: 1px solid var(--color-border) !important;
}

:deep(.n-dropdown-option) {
  color: var(--color-text-primary) !important;
}

:deep(.n-dropdown-option:hover) {
  color: var(--color-primary) !important;
  background-color: rgba(
    var(--color-primary-rgb, 74, 222, 128),
    0.05
  ) !important;
}
</style>
