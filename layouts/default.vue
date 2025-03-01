<template>
  <n-layout>
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
              class="register-button rounded-lg font-medium shadow-sm hover:shadow-primary/20 transition-all duration-300"
              type="primary"
              @click="navigateTo(localePath('/register'))"
            >
              <template #icon>
                <n-icon class="text-lg">
                  <person-add-outline />
                </n-icon>
              </template>
              <span class="ml-1">{{ t('navigation.register') }}</span>
            </n-button>
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

    <!-- Mobile Sidebar -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
      @click="closeMobileMenu"
    />

    <!-- Sidebar Content -->
    <transition name="slide">
      <div
        v-if="isMobileMenuOpen"
        class="fixed top-0 left-0 w-72 h-full bg-background-card border-r border-border overflow-y-auto z-40"
        @click.stop
      >
        <div class="p-6 pt-4">
          <RouterLink class="flex items-center" to="/">
            <Logo />
          </RouterLink>
          <!-- Mobile Navigation Links -->
          <div class="space-y-6">
            <div class="space-y-2">
              <NuxtLink
                v-for="item in mobileMenuOptions"
                :key="item.key"
                :to="localePath(item.path)"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors duration-200"
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
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Content -->
    <n-layout-content>
      <div class="pt-16">
        <slot />
      </div>
    </n-layout-content>

    <n-layout-footer bordered>
      <FooterComponent />
    </n-layout-footer>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  LogInOutline,
  PersonAddOutline,
  MenuOutline,
  CloseOutline,
} from '@vicons/ionicons5';
import {
  NIcon,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
} from 'naive-ui';
import Logo from '~/components/LogoComponent.vue';

const isMobileMenuOpen = ref(false);
const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();

router.afterEach(() => {
  closeMobileMenu();
});

const handleResize = () => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  watch(isMobileMenuOpen, (isOpen) => {
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

const mobileMenuOptions = [
  // {
  //   key: 'features',
  //   label: 'navigation.features',
  //   path: '/#features',
  //   icon: LogInOutline,
  // },
  // {
  //   key: 'roadmap',
  //   label: 'navigation.roadmap',
  //   path: '/#roadmap',
  //   icon: PersonAddOutline,
  // },
];
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
  background-color: var(--color-primary, rgb(74, 222, 128));
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
  color: var(--color-text-secondary, rgb(156, 163, 175));
}

:deep(.n-menu-item:hover) {
  color: var(--color-primary, rgb(74, 222, 128));
}

:deep(.n-menu-item-content__icon) {
  color: currentColor;
}

:deep(.n-menu-item-content--selected) {
  color: var(--color-primary, rgb(74, 222, 128));
  background-color: rgba(var(--color-primary-rgb, 74, 222, 128), 0.05);
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

/* Drawer */
:deep(.n-drawer) {
  background-color: var(--color-background-card, rgb(24, 24, 28));
  border-right: 1px solid var(--color-border, rgb(55, 65, 81));
}

/* Prevent interaction during transition */
.slide-enter-active .backdrop,
.slide-leave-active .backdrop {
  pointer-events: none;
}
</style>
