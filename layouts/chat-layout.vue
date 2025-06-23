<template>
  <n-layout class="h-screen flex flex-col">
    <!-- Main Navbar -->
    <n-layout-header
      class="fixed top-0 w-full bg-background-card border-b border-border z-40 transition-all duration-300"
      :class="{ '!z-20': isMobileMenuOpen }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <RouterLink class="flex items-center space-x-2" to="/">
            <Logo />
          </RouterLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-6">
            <n-button
              v-if="!authStore.isAuthenticated"
              class="text-text-secondary hover:text-primary relative p-1 rounded hover:bg-primary/5 nav-link"
              text
              @click="navigateTo(localePath('/login'))"
            >
              <template #icon>
                <n-icon class="text-lg">
                  <log-in-outline />
                </n-icon>
              </template>
              <span class="ml-1">{{ t('navigation.login') }}</span>
            </n-button>
            <n-button
              v-if="!authStore.isAuthenticated"
              class="register-button rounded-lg font-medium shadow-sm hover:shadow-primary/20 transition-all duration-300"
              type="primary"
              color="#4ade80"
              @click="navigateTo(localePath('/register'))"
            >
              <template #icon>
                <n-icon class="text-lg">
                  <person-add-outline />
                </n-icon>
              </template>
              <span class="ml-1">{{ t('navigation.register') }}</span>
            </n-button>

            <!-- Authenticated User Menu -->
            <div
              v-if="authStore.isAuthenticated"
              class="flex items-center space-x-4"
            >
              <n-button
                class="text-text-secondary hover:text-primary relative p-1 rounded hover:bg-primary/5 nav-link"
                text
                @click="navigateToDashboard"
              >
                <template #icon>
                  <n-icon class="text-lg">
                    <grid-outline />
                  </n-icon>
                </template>
                <span class="ml-1">{{ t('navigation.dashboard') }}</span>
              </n-button>

              <n-button
                class="text-text-secondary hover:text-primary relative p-1 rounded hover:bg-primary/5 nav-link"
                text
                @click="navigateTo(localePath('/users/profile'))"
              >
                <template #icon>
                  <n-icon class="text-lg">
                    <person-outline />
                  </n-icon>
                </template>
                <span class="ml-1">{{ t('navigation.profile') }}</span>
              </n-button>

              <!-- User Dropdown Component -->
              <ClientOnly>
                <UserDropdown
                  :user-name="getUserDisplayName()"
                  :avatar-url="userStore.userDetails?.profileImageUrl || ''"
                  :options="userDropdownOptions"
                  @select="handleUserDropdown"
                />
              </ClientOnly>
            </div>
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

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
      @click="closeMobileMenu"
    />

    <!-- Mobile Sidebar Content -->
    <transition name="slide">
      <div
        v-if="isMobileMenuOpen"
        class="fixed top-0 left-0 w-72 h-full bg-background-card border-r border-border overflow-y-auto z-40"
        @click.stop
      >
        <div class="p-6 pt-4">
          <div class="flex items-center justify-between mb-6">
            <RouterLink class="flex items-center" to="/">
              <Logo />
            </RouterLink>
            <n-button quaternary circle @click="closeMobileMenu">
              <template #icon>
                <n-icon><close-outline /></n-icon>
              </template>
            </n-button>
          </div>

          <!-- User Info Section -->
          <div
            v-if="authStore.isAuthenticated"
            class="mb-6 p-4 bg-background-secondary rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <n-avatar
                :size="40"
                :src="userStore.userDetails?.profileImageUrl"
                :fallback-src="'/default-avatar.png'"
              >
                {{ getUserInitials() }}
              </n-avatar>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-text-primary truncate">
                  {{ userStore.userDetails?.firstName }}
                  {{ userStore.userDetails?.lastName }}
                </p>
                <p class="text-xs text-text-secondary truncate">
                  {{ userStore.userDetails?.email }}
                </p>
              </div>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="space-y-6">
            <div class="space-y-2">
              <NuxtLink
                v-for="item in getCurrentMenuOptions()"
                :key="item.key"
                :to="localePath(item.path)"
                class="flex items-center space-x-3 px-4 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors duration-200"
                :class="{
                  'text-primary bg-primary/10': isCurrentPath(item.path),
                }"
                @click="closeMobileMenu"
              >
                <n-icon size="20">
                  <component :is="item.icon" />
                </n-icon>
                <span>{{ t(item.label) }}</span>
              </NuxtLink>
            </div>

            <!-- Mobile Action Buttons -->
            <div class="space-y-2 pt-4 border-t border-border">
              <template v-if="!authStore.isAuthenticated">
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
                  color="#4ade80"
                  @click="navigateAndClose('/register')"
                >
                  <template #icon>
                    <n-icon><person-add-outline /></n-icon>
                  </template>
                  {{ t('navigation.register') }}
                </n-button>
              </template>

              <template v-else>
                <n-button
                  block
                  secondary
                  class="mobile-nav-button border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                  @click="handleLogout"
                >
                  <template #icon>
                    <n-icon><log-out-outline /></n-icon>
                  </template>
                  {{ t('navigation.logout') }}
                </n-button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Content -->
    <n-layout-content class="flex-1 flex flex-col h-full">
      <!-- pt-16 to account for header -->
      <div
        class="pt-16 flex flex-col items-stretch justify-stretch h-full grow"
      >
        <slot />
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue';
import {
  LogInOutline,
  PersonAddOutline,
  MenuOutline,
  CloseOutline,
  LogOutOutline,
  GridOutline,
  PersonOutline,
  HomeOutline,
  ShieldCheckmarkOutline,
  BarChartOutline,
  HelpCircleOutline,
  SchoolOutline,
} from '@vicons/ionicons5';
import {
  NIcon,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NButton,
  NAvatar,
} from 'naive-ui';
import Logo from '~/components/LogoComponent.vue';
import UserDropdown from '~/components/user/DropdownComponent.vue';

interface MenuOption {
  key: string;
  label: string;
  path: string;
  icon: any;
  roles?: string[];
}

interface DropdownOption {
  key: string;
  label: string;
  icon?: any;
}

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();

// Reactive state
const isMobileMenuOpen: Ref<boolean> = ref(false);

// Composables
const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();

// Navigation options for different user types
const guestMenuOptions: MenuOption[] = [
  {
    key: 'home',
    label: 'navigation.home',
    path: '/',
    icon: HomeOutline,
  },
  {
    key: 'support',
    label: 'navigation.support',
    path: '/support',
    icon: HelpCircleOutline,
  },
];

const authenticatedMenuOptions: MenuOption[] = [
  {
    key: 'dashboard',
    label: 'navigation.dashboard',
    path: '/users/dashboard',
    icon: GridOutline,
  },
  {
    key: 'profile',
    label: 'navigation.profile',
    path: '/users/profile',
    icon: PersonOutline,
  },
  {
    key: 'privacy',
    label: 'navigation.privacy',
    path: '/users/privacy',
    icon: ShieldCheckmarkOutline,
  },
  {
    key: 'support',
    label: 'navigation.support',
    path: '/support',
    icon: HelpCircleOutline,
  },
];

const adminMenuOptions: MenuOption[] = [
  {
    key: 'admin_dashboard',
    label: 'navigation.adminDashboard',
    path: '/super-admins/dashboard',
    icon: GridOutline,
    roles: ['SuperAdmin'],
  },
  {
    key: 'institutions',
    label: 'navigation.institutions',
    path: '/institutions',
    icon: SchoolOutline,
    roles: ['SuperAdmin', 'InstitutionAdmin'],
  },
  {
    key: 'analytics',
    label: 'navigation.analytics',
    path: '/analytics',
    icon: BarChartOutline,
    roles: ['SuperAdmin', 'InstitutionAdmin', 'Teacher'],
  },
  {
    key: 'users',
    label: 'navigation.users',
    path: '/users',
    icon: PersonOutline,
    roles: ['SuperAdmin', 'InstitutionAdmin'],
  },
];

// User dropdown options formatted for the UserDropdown component
const userDropdownOptions = computed((): DropdownOption[] => [
  {
    key: 'profile',
    label: t('navigation.profile'),
    icon: 'ion:person',
  },
  {
    key: 'settings',
    label: t('navigation.settings'),
    icon: 'ion:settings',
  },
  {
    key: 'divider',
    label: '-',
  },
  {
    key: 'logout',
    label: t('navigation.logout'),
    icon: 'ion:log-out',
  },
]);

// Computed menu options based on user state and role
const getCurrentMenuOptions = computed((): MenuOption[] => {
  if (!authStore.isAuthenticated) {
    return guestMenuOptions;
  }

  const userRole = userStore.userDetails?.role;
  let options = [...authenticatedMenuOptions];

  // Add admin options if user has appropriate role
  if (
    userRole &&
    ['SuperAdmin', 'InstitutionAdmin', 'Teacher'].includes(userRole)
  ) {
    const filteredAdminOptions = adminMenuOptions.filter(
      (option) => !option.roles || option.roles.includes(userRole)
    );
    options = [...options, ...filteredAdminOptions];
  }

  return options;
});

// Helper functions
const getUserInitials = (): string => {
  const user = userStore.userDetails;
  if (!user) return 'U';

  const firstName = user.firstName || '';
  const lastName = user.lastName || '';

  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
};

const getUserDisplayName = (): string => {
  const user = userStore.userDetails;
  if (!user) return 'User';

  const firstName = user.firstName || '';
  const lastName = user.lastName || '';

  return `${firstName} ${lastName}`.trim() || 'User';
};

const isCurrentPath = (path: string): boolean => {
  return route.path === localePath(path);
};

const navigateToDashboard = (): void => {
  const userRole = userStore.userDetails?.role;

  if (userRole === 'SuperAdmin') {
    navigateTo(localePath('/super-admins/dashboard'));
  } else {
    navigateTo(localePath('/users/dashboard'));
  }
};

const handleUserDropdown = (key: string): void => {
  switch (key) {
    case 'profile':
      navigateTo(localePath('/users/profile'));
      break;
    case 'settings':
      navigateTo(localePath('/users/settings'));
      break;
    case 'logout':
      handleLogout();
      break;
  }
};

const handleLogout = async (): Promise<void> => {
  try {
    await authStore.logout();
    await navigateTo(localePath('/'));
  } catch (error) {
    console.error('Logout failed:', error);
  }
  closeMobileMenu();
};

// Mobile menu functions
const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false;
};

const navigateAndClose = (path: string): void => {
  navigateTo(localePath(path));
  closeMobileMenu();
};

// Event handlers
const handleResize = (): void => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleResize);

  // Watch for mobile menu state changes to prevent body scroll
  watch(isMobileMenuOpen, (isOpen: boolean) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.body.style.overflow = '';
});

// Auto-close mobile menu on route change
router.afterEach(() => {
  closeMobileMenu();
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: rgb(74 222 128);
  transition: all 0.3s;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

.register-button:hover {
  transform: translateY(-1px);
}

/* Menu styles */
:deep(.n-menu) {
  background-color: transparent;
}

:deep(.n-menu-item) {
  color: rgb(156 163 175);
}

:deep(.n-menu-item:hover) {
  color: rgb(74 222 128);
}

:deep(.n-menu-item-content__icon) {
  color: currentColor;
}

:deep(.n-menu-item-content--selected) {
  color: rgb(74 222 128);
  background-color: rgba(74, 222, 128, 0.05);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dropdown */
:deep(.n-dropdown-menu) {
  background-color: var(--background-card);
  border: 1px solid var(--border-color);
}

/* Prevent interaction during transition */
.slide-enter-active .backdrop,
.slide-leave-active .backdrop {
  pointer-events: none;
}

/* Mobile nav button improvements */
.mobile-nav-button {
  text-align: left;
  justify-content: flex-start;
}
</style>
