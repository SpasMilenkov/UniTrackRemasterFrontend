<template>
  <footer class="bg-background-card border-t border-border">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <!-- Company Info -->
        <div class="lg:col-span-1">
          <div class="mb-6 flex items-start">
            <Logo />
          </div>
          <p class="text-text-secondary mb-6 leading-relaxed p-2">
            {{ t('footer.companyInfo.description') }}
          </p>
        </div>

        <!-- Platform -->
        <div>
          <h3 class="text-text-primary font-semibold mb-4">
            {{ t('footer.platform.title') }}
          </h3>
          <nav class="space-y-3">
            <NuxtLink
              to="/#features"
              class="block text-text-secondary hover:text-primary transition-colors duration-200 text-sm"
            >
              {{ t('footer.platform.features') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/get-started')"
              class="block text-text-secondary hover:text-primary transition-colors duration-200 text-sm"
            >
              {{ t('footer.platform.getStarted') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/demo')"
              class="block text-text-secondary hover:text-primary transition-colors duration-200 text-sm"
            >
              {{ t('footer.platform.demo') }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="text-text-primary font-semibold mb-4">
            {{ t('footer.resources.title') }}
          </h3>
          <nav class="space-y-3">
            <a
              href="https://spasmilenkov.github.io/UniTrackDocs/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-200 text-sm group"
            >
              {{ t('footer.resources.documentation') }}
              <Icon 
                name="ph:arrow-square-out-bold" 
                class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" 
              />
            </a>
            <NuxtLink
              :to="localePath('/api')"
              class="block text-text-secondary hover:text-primary transition-colors duration-200 text-sm"
            >
              {{ t('footer.resources.api') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/status')"
              class="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-200 text-sm"
            >
              <div class="w-2 h-2 bg-green-500 rounded-full"/>
              {{ t('footer.resources.status') }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Support -->
        <div>
          <!-- Social Links -->
          <div>
            <h4 class="text-text-primary font-semibold mb-3 text-sm">
              {{ t('footer.support.followUs') }}
            </h4>
            <div class="flex gap-3">
              <a
                href="#"
                class="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all duration-200"
                :aria-label="t('footer.support.linkedin')"
              >
                <Icon name="ph:linkedin-logo-bold" class="w-4 h-4" />
              </a>
              <a
                href="#"
                class="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all duration-200"
                :aria-label="t('footer.support.github')"
              >
                <Icon name="ph:github-logo-bold" class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 mt-8 border-t border-border">
        <div class="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div class="flex flex-col sm:flex-row items-center gap-4 text-sm text-text-secondary">
            <span>
              {{ t('footer.bottomBar.copyright', { year: new Date().getFullYear() }) }}
            </span>
            <div class="flex items-center gap-4">
              <NuxtLink
                :to="localePath('/privacy-policy')"
                class="hover:text-primary transition-colors duration-200"
              >
                {{ t('footer.bottomBar.privacy') }}
              </NuxtLink>
            </div>
          </div>

          <!-- Theme and Language -->
          <div class="flex items-center gap-4">
            <!-- Language Switcher -->
            <div class="flex items-center gap-2">
              <Icon name="ph:globe-bold" class="w-4 h-4 text-text-secondary" />
              <select
                :value="$i18n.locale"
                class="bg-background border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                :aria-label="t('footer.bottomBar.selectLanguage')"
                @change="switchLanguage"
              >
                <option value="en">English</option>
                <option value="bg">Български</option>
              </select>
            </div>

            <!-- Theme Toggle -->
            <button
              class="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all duration-200"
              :aria-label="t('footer.bottomBar.toggleTheme')"
              @click="toggleTheme"
            >
              <Icon 
                :name="isDark ? 'ph:sun-bold' : 'ph:moon-bold'" 
                class="w-4 h-4" 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Logo from './LogoComponent.vue';

const { t } = useI18n();
const localePath = useLocalePath();
const { $i18n } = useNuxtApp();

// Newsletter functionality
const newsletterEmail = ref('');
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(newsletterEmail.value);
});

const subscribeNewsletter = async () => {
  if (!isValidEmail.value) return;
  
  try {
    // Here you would typically call your newsletter API
    console.log('Subscribing email:', newsletterEmail.value);
    
    // Show success message
    const message = useMessage();
    message.success(t('footer.companyInfo.subscribeSuccess'));
    
    // Clear input
    newsletterEmail.value = '';
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    const message = useMessage();
    message.error(t('footer.companyInfo.subscribeError'));
  }
};

// Language switching
const switchLanguage = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  const newLocale = select.value;
  
  // Switch locale using Nuxt i18n
  $i18n.setLocale(newLocale);
};

// Theme functionality
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.actualTheme === 'dark');

const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark';
  themeStore.setTheme(newTheme);
};

// Accessibility: Handle keyboard navigation
onMounted(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Quick actions with Alt key combinations
    if (event.altKey) {
      switch (event.key) {
        case 'd':
          event.preventDefault();
          window.open('https://spasmilenkov.github.io/UniTrackDocs/', '_blank');
          break;
        case 't':
          event.preventDefault();
          toggleTheme();
          break;
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
});
</script>

<style scoped>
/* Smooth transitions for all interactive elements */
a, button, select {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Newsletter input styling */
input:focus {
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

/* Social link hover effects */
a:hover {
  transform: translateY(-1px);
}

/* Select styling */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Status indicator pulse */
.bg-green-500 {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  a, button {
    border: 1px solid currentColor;
  }
}

/* Print styles */
@media print {
  footer {
    break-inside: avoid;
  }
  
  button, select {
    display: none;
  }
}
</style>