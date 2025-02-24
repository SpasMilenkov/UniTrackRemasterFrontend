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
        <!-- Logo Section -->
        <div class="flex items-center px-4 h-16 border-b border-border">
          <img
            src="/images/UniTrack.png"
            alt="UniTrack Logo"
            class="h-8 w-auto mr-4"
            :class="{ 'mr-0': collapsed }"
          >
          <span
            v-if="!collapsed"
            class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
          >
            UniTrack
          </span>
        </div>

        <!-- Sidebar Menu -->
        <div class="py-4 flex-grow">
          <n-menu
            mode="vertical"
            :options="sidebarOptions"
            :collapsed="collapsed"
            class="!bg-transparent"
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
        class="transform -translate-x-1/2 -translate-y-1/2 shadow-lg hover:border-primary transition-all duration-200"
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
            <div class="flex items-center lg:hidden">
              <NuxtImg
                src="/images/UniTrack.png"
                alt="UniTrack Logo"
                class="h-8 w-auto mr-4"
              />
              <span
                class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
              >
                UniTrack
              </span>
            </div>

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
              class="md:hidden"
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
            <div class="flex items-center mb-6">
              <NuxtImg
                src="/images/UniTrack.png"
                alt="UniTrack Logo"
                class="h-8 w-auto mr-4"
              />
              <span
                class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
              >
                UniTrack
              </span>
            </div>

            <!-- Mobile Navigation -->
            <div class="space-y-6">
              <div class="space-y-2">
                <n-button
                  v-for="option in combinedMobileOptions"
                  :key="option.key"
                  block
                  text
                  class="nav-link flex items-center space-x-2 px-4 py-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors duration-200"
                  @click="() => navigateAndClose(option.key as string)"
                >
                  <Icon :name="option.iconName" class="text-xl" />
                  <span>{{ option.label }}</span>
                </n-button>
              </div>
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

interface CustomMenuOption {
  label: string;
  key: string;
  iconName: string;
}

const router = useRouter();
const isMobileMenuOpen = ref(false);
const isMobile = ref(false);
const collapsed = ref(false);

// helper function to render icons (breaks easily)
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
:deep(.nav-link) {
  color: #9ca3af; /* text-secondary */
  position: relative;
  padding: 0.25rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

:deep(.nav-link:hover) {
  color: #4ade80; /* primary color */
  background-color: rgba(74, 222, 128, 0.05); /* primary with 5% opacity */
}

:deep(.nav-link::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0.125rem;
  background-color: #4ade80; /* primary color */
  transition: all 0.3s;
  transform: translateX(-50%);
}

:deep(.nav-link:hover::after) {
  width: 100%;
}

/* Menu styles */
:deep(.n-menu) {
  background-color: transparent !important;
}

:deep(.n-menu-item) {
  color: #9ca3af; /* text-secondary */
}

:deep(.n-menu-item:hover) {
  color: #4ade80; /* primary color */
  background-color: rgba(74, 222, 128, 0.05); /* primary with 5% opacity */
}

:deep(.n-menu-item-content__icon) {
  color: currentColor;
}

:deep(.n-menu-item-content--selected) {
  color: #4ade80; /* primary color */
  background-color: rgba(74, 222, 128, 0.05); /* primary with 5% opacity */
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

  .mobile-menu-button {
    display: block;
  }
}
</style>
