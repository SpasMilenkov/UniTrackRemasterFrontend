<template>
  <n-layout>
    <n-layout-header
      class="bg-[#18181c] border-b border-[#262629] sticky top-0 z-50"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo Section -->
          <RouterLink class="flex items-center" to="/">
            <img
              src="/img/logo.png"
              alt="UniTrack Logo"
              class="h-10 w-auto mr-4"
            />
            <span
              class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
            >
              UniTrack
            </span>
          </RouterLink>

          <!-- Desktop Menu -->
          <div class="hidden md:flex md:items-center md:ml-auto">
            <n-menu
              mode="horizontal"
              :options="menuOptions"
              class="desktop-menu !bg-transparent"
            />
          </div>

          <!-- Mobile Menu Button -->
          <n-button
            class="mobile-menu-toggle md:hidden"
            secondary
            size="large"
            @click="toggleMobileMenu"
          >
            <template #icon>
              <n-icon>
                <menu-outline v-if="!isMobileMenuOpen" />
                <close-outline v-else />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>

      <!-- Mobile Menu Drawer -->
      <n-drawer
        v-model:show="isMobileMenuOpen"
        :width="280"
        placement="left"
        class="!bg-[#18181c]"
      >
        <n-drawer-content class="!bg-[#18181c] pt-6">
          <div class="flex items-center mb-8 px-4">
            <img
              src="/img/UniTrack.png"
              alt="UniTrack Logo"
              class="h-8 w-auto mr-4"
            />
            <span
              class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
            >
              UniTrack
            </span>
          </div>
          <n-menu
            :options="mobileMenuOptions"
            :indent="18"
            class="!bg-transparent"
          />
        </n-drawer-content>
      </n-drawer>
    </n-layout-header>
    <n-layout-content>
      <slot />
    </n-layout-content>
    <n-layout-footer bordered>
      <FooterComponent />
    </n-layout-footer>
  </n-layout>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import {
  NIcon,
  NLayout,
  NLayoutHeader,
  NMenu,
  NDrawer,
  NDrawerContent,
  NButton,
} from 'naive-ui';
import {
  LogInOutline,
  PersonAddOutline,
  MenuOutline,
  CloseOutline,
  AnalyticsOutline,
  HelpCircleOutline,
} from '@vicons/ionicons5';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const { t } = useI18n();
const localePath = useLocalePath();
// Common menu item styling
const createMenuLabel = (icon: any, text: string, href: string) => () =>
  h(
    'a',
    {
      href,
      class:
        'flex items-center transition-colors duration-200 hover:text-emerald-400',
    },
    [
      h(NIcon, { size: 20 }, { default: () => h(icon) }),
      h('span', { class: 'ml-2' }, text),
    ]
  );

// Desktop menu options
const menuOptions = [
  {
    label: createMenuLabel(
      AnalyticsOutline,
      t('navigation.analytics'),
      localePath('/analytics')
    ),
    key: 'analytics',
  },
  {
    label: createMenuLabel(
      HelpCircleOutline,
      t('navigation.support'),
      localePath('/support')
    ),
    key: 'support',
  },
  {
    label: createMenuLabel(
      LogInOutline,
      t('navigation.login'),
      localePath('/login')
    ),
    key: 'login',
  },
  {
    label: createMenuLabel(
      PersonAddOutline,
      t('navigation.register'),
      localePath('/register')
    ),
    key: 'register',
  },
];

// Mobile menu options (can include additional items or different organization)
const mobileMenuOptions = [
  ...menuOptions,
  // Add more mobile-specific menu items here if needed
];
</script>

<style scoped>
@media (min-width: 768px) {
  .mobile-menu-toggle {
    display: none;
  }
}

:deep(.n-menu) {
  background-color: transparent !important;
}

:deep(.n-menu-item) {
  color: #9ca3af !important;
}

:deep(.n-menu-item:hover) {
  color: #4ade80 !important;
}

:deep(.n-menu-item-content__icon) {
  color: inherit !important;
}

:deep(.n-menu-item-content--selected) {
  color: #4ade80 !important;
  background-color: #262629 !important;
}

:deep(.n-drawer) {
  background-color: #18181c !important;
}

:deep(.n-drawer-content) {
  background-color: #18181c !important;
}

:deep(.n-button.n-button--secondary-type) {
  background-color: #262629 !important;
  border-color: #374151 !important;
}

:deep(.n-button.n-button--secondary-type:hover) {
  border-color: #4ade80 !important;
}
</style>
