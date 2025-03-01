<template>
  <div class="flex">
    <!-- Sidebar section -->
    <div
      v-if="!isMobile"
      class="fixed top-0 left-0 h-screen transition-all duration-300 flex flex-col"
      :class="{ 'w-[240px]': !collapsed, 'w-[64px]': collapsed }"
    >
      <div
        class="h-full bg-background-card border-r border-border flex flex-col"
      >
        <LogoComponent v-if="!collapsed" />

        <!-- Sidebar Menu -->
        <div class="py-4 flex-grow">
          <n-menu
            mode="vertical"
            :options="sidebarOptions"
            :collapsed="collapsed"
            class="sidebar-menu"
          />
        </div>

        <!-- Logout Button -->
        <div class="p-4 border-t border-border">
          <n-button
            block
            text
            class="nav-link flex items-center space-x-2 px-4 py-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors duration-200"
            @click="handleLogout"
          >
            <Icon name="ion:log-out" class="text-lg" />
            <span v-if="!collapsed">Logout</span>
          </n-button>
        </div>
      </div>
    </div>

    <!-- Collapse Trigger -->
    <div
      v-if="!isMobile"
      class="fixed z-50 transition-all duration-300"
      :class="{
        'left-[240px]': !collapsed,
        'left-[64px]': collapsed,
      }"
      style="top: 50%"
    >
      <n-button
        circle
        secondary
        size="small"
        class="collapse-btn transform -translate-x-1/2 -translate-y-1/2 shadow-lg transition-all duration-200"
        @click="collapsed = !collapsed"
      >
        <Icon :name="collapsed ? 'ion:chevron-forward' : 'ion:chevron-back'" />
      </n-button>
    </div>

    <!-- Main Content Wrapper -->
    <div
      class="min-h-screen w-full transition-all duration-300"
      :class="{
        'ml-[240px]': !collapsed && !isMobile,
        'ml-[64px]': collapsed && !isMobile,
      }"
    >
      <!-- Header -->
      <n-layout-header
        class="fixed top-0 w-full bg-background-card border-b border-border z-40 transition-all duration-300"
        :class="{ '!z-20': isMobileMenuOpen }"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Mobile Logo Section -->
            <LogoComponent v-if="isMobile" />

            <!-- Desktop Menu -->
            <div class="hidden lg:flex lg:items-center lg:ml-auto space-x-6">
              <n-button
                v-for="option in menuOptions"
                :key="option.key"
                text
                class="nav-link"
                @click="navigateTo(option.key)"
              >
                <Icon :name="option.iconName" class="text-lg" />
                <span class="ml-1">{{ option.label }}</span>
              </n-button>
            </div>

            <!-- Mobile Menu Button -->
            <n-button
              v-if="isMobile"
              class="md:hidden mobile-menu-btn"
              secondary
              @click="toggleMobileMenu"
            >
              <Icon :name="isMobileMenuOpen ? 'ion:close' : 'ion:menu'" />
            </n-button>
          </div>
        </div>
      </n-layout-header>

      <!-- Mobile Menu Overlay -->
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
        @click="toggleMobileMenu"
      />

      <!-- Mobile Drawer -->
      <transition name="slide" @after-leave="handleTransitionEnd">
        <div
          v-if="isMobileMenuOpen"
          class="fixed top-0 left-0 w-72 h-full bg-background-card border-r border-border overflow-y-auto z-40"
          @click.stop
        >
          <div class="p-6 pt-4">
            <LogoComponent />

            <!-- Mobile Navigation - Left aligned -->
            <div class="space-y-1 mt-6">
              <n-button
                v-for="option in combinedMobileOptions"
                :key="option.key"
                block
                text
                class="mobile-nav-item text-left justify-start"
                @click="() => navigateAndClose(option.key as string)"
              >
                <div class="flex items-center">
                  <Icon :name="option.iconName" class="text-xl mr-3" />
                  <span>{{ option.label }}</span>
                </div>
              </n-button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Main Content -->
      <div class="bg-background pt-16">
        <slot />
      </div>

      <!-- Footer -->
      <n-layout-footer bordered>
        <FooterComponent />
      </n-layout-footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, h } from 'vue';
import { useRouter } from 'nuxt/app';
import {
  NMenu,
  NButton,
  NLayoutHeader,
  NLayoutFooter,
  type MenuOption,
} from 'naive-ui';
import LogoComponent from '~/components/LogoComponent.vue';

interface CustomMenuOption {
  label: string;
  key: string;
  iconName: string;
}

const router = useRouter();
const isMobileMenuOpen = ref(false);
const isMobile = ref(false);
const collapsed = ref(false);

// helper function to render icons
const createMenuItem = (
  label: string,
  key: string,
  iconName: string
): MenuOption => ({
  label,
  key,
  icon: () =>
    h('div', { class: 'flex items-center' }, [
      h(resolveComponent('Icon'), {
        name: iconName,
        class: 'text-lg',
      }),
    ]),
  show: true,
  onClick: () => router.push(key),
});

// menu options with fixed types
const menuOptions: CustomMenuOption[] = [
  { label: 'Home', key: '/', iconName: 'ion:home' },
  { label: 'Login', key: '/login', iconName: 'ion:log-in' },
  { label: 'Register', key: '/register', iconName: 'ion:person-add' },
];

const sidebarMenuOptions: CustomMenuOption[] = [
  { label: 'Timetable', key: '/timetable', iconName: 'ion:book' },
  { label: 'Plan Examination', key: '/exams', iconName: 'ion:document-text' },
  { label: 'Profile', key: '/users/profile', iconName: 'ion:cog' },
  { label: 'Calendar', key: '/calendar', iconName: 'ion:calendar' },
];

// convert menu options to naiveUI format for sidebar
const sidebarOptions = computed<MenuOption[]>(() =>
  sidebarMenuOptions.map((option) => ({
    ...createMenuItem(option.label, option.key, option.iconName),
    label: collapsed.value ? '' : option.label,
    tooltip: collapsed.value ? option.label : undefined,
  }))
);

// combining options for mobile
const combinedMobileOptions = computed<CustomMenuOption[]>(() => [
  ...menuOptions,
  ...sidebarMenuOptions,
  { label: 'Logout', key: '/logout', iconName: 'ion:log-out' },
]);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
  if (!isMobile.value) {
    isMobileMenuOpen.value = false;
  }
};

const navigateTo = (route: string) => {
  router.push(route);
};

const navigateAndClose = (route: string) => {
  router.push(route);
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  router.push('/login');
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  watch(isMobileMenuOpen, (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  document.body.style.overflow = '';
});

const handleTransitionEnd = () => {
  if (!isMobileMenuOpen.value) {
    document.body.style.overflow = '';
  }
};
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
  color: var(--color-text-secondary) !important;
  position: relative;
  padding: 0.25rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.nav-link:hover {
  color: var(--color-primary) !important;
  background-color: rgba(
    var(--color-primary-rgb, 74, 222, 128),
    0.05
  ) !important;
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

/* Mobile nav items - left aligned */
.mobile-nav-item {
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

.mobile-nav-item:hover {
  color: var(--color-primary) !important;
  background-color: rgba(
    var(--color-primary-rgb, 74, 222, 128),
    0.05
  ) !important;
}

/* Menu styles */
.sidebar-menu {
  background-color: transparent !important;
}

:deep(.n-menu-item) {
  color: var(--color-text-secondary) !important;
}

:deep(.n-menu-item:hover) {
  color: var(--color-primary) !important;
  background-color: rgba(
    var(--color-primary-rgb, 74, 222, 128),
    0.05
  ) !important;
}

:deep(.n-menu-item-content__icon) {
  color: currentColor !important;
}

:deep(.n-menu-item-content--selected) {
  color: var(--color-primary) !important;
  background-color: rgba(
    var(--color-primary-rgb, 74, 222, 128),
    0.05
  ) !important;
}

/* Collapse button */
.collapse-btn {
  border-color: var(--color-border) !important;
  background-color: var(--color-background-card) !important;
}

.collapse-btn:hover {
  border-color: var(--color-primary) !important;
}

/* Mobile menu button */
.mobile-menu-btn {
  background-color: transparent !important;
  border-color: var(--color-border) !important;
  color: var(--color-text-primary) !important;
}

.mobile-menu-btn:hover {
  border-color: var(--color-primary) !important;
  color: var(--color-primary) !important;
}

/* Backdrop transitions */
.slide-enter-active .backdrop,
.slide-leave-active .backdrop {
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive styles */
@media (max-width: 1024px) {
  :deep(.n-layout-header) {
    padding: 0;
  }

  :deep(.n-layout-header .max-w-7xl) {
    padding: 0 1rem;
  }
}

/* Comprehensive fix for sidebar menu item hover colors */
:deep(.n-menu .n-menu-item-content) {
  color: var(--color-text-secondary) !important;
}

:deep(.n-menu .n-menu-item-content:hover),
:deep(.n-menu .n-menu-item-content:hover .n-menu-item-content-header),
:deep(.n-menu .n-menu-item-content:hover .n-icon) {
  color: var(--color-primary) !important;
}

:deep(.n-menu .n-menu-item-content--selected),
:deep(.n-menu .n-menu-item-content--selected .n-menu-item-content-header),
:deep(.n-menu .n-menu-item-content--selected .n-icon) {
  color: var(--color-primary) !important;
}

/* Fix for the icon color */
:deep(.n-menu .n-icon) {
  color: var(--color-text-secondary) !important;
}

:deep(.n-menu .n-menu-item-content:hover .n-icon),
:deep(.n-menu .n-menu-item-content--selected .n-icon) {
  color: var(--color-primary) !important;
}

/* Sometimes the text label is in this element */
:deep(.n-menu .n-menu-item-content-header__extra) {
  color: inherit !important;
}

/* Fix for when using the tooltip in collapsed mode */
:deep(.n-menu-item-content--selected-in-tooltip) {
  color: var(--color-primary) !important;
}
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

/* Fix for the tooltip popover itself */
:deep(.n-popover) {
  background-color: var(--color-background-card) !important;
  border: 1px solid var(--color-border) !important;
  color: var(--color-text-primary) !important;
}

/* Tooltip arrow */
:deep(.n-popover-arrow-wrapper .n-popover-arrow) {
  background-color: var(--color-background-card) !important;
  border: 1px solid var(--color-border) !important;
}
</style>
