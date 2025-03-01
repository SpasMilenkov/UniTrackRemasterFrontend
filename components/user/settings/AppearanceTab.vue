<template>
  <div class="bg-background-card rounded-lg p-8 border border-border">
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">
        {{ t('settings.appearance.title') }}
      </h2>
      <p class="text-text-secondary text-sm">
        {{ t('settings.appearance.subtitle') }}
      </p>
    </div>

    <div class="mb-8">
      <h3 class="text-lg font-medium mb-4">
        {{ t('settings.appearance.themeSection') }}
      </h3>
      <div class="flex flex-wrap gap-4">
        <div
          class="w-40 h-24 rounded-lg bg-background-card border-2 transition-all duration-200"
          :class="{
            'border-primary': currentTheme === 'dark',
            'border-border': currentTheme !== 'dark',
          }"
          @click="setTheme('dark')"
        >
          <div
            class="text-center h-full flex flex-col items-center justify-center cursor-pointer"
          >
            <div class="w-6 h-6 rounded-full bg-gray-800 mx-auto mb-2" />
            <span class="text-sm">{{
              t('settings.appearance.themes.dark')
            }}</span>
          </div>
        </div>

        <div
          class="w-40 h-24 rounded-lg bg-white border-2 transition-all duration-200"
          :class="{
            'border-primary': currentTheme === 'light',
            'border-gray-300': currentTheme !== 'light',
          }"
          @click="setTheme('light')"
        >
          <div
            class="text-center h-full flex flex-col items-center justify-center cursor-pointer"
          >
            <div class="w-6 h-6 rounded-full bg-gray-200 mx-auto mb-2" />
            <span class="text-sm text-gray-800">{{
              t('settings.appearance.themes.light')
            }}</span>
          </div>
        </div>

        <div
          class="w-40 h-24 rounded-lg bg-gradient-to-r from-gray-900 to-gray-600 border-2 transition-all duration-200"
          :class="{
            'border-primary': currentTheme === 'system',
            'border-gray-700': currentTheme !== 'system',
          }"
          @click="setTheme('system')"
        >
          <div
            class="text-center h-full flex flex-col items-center justify-center cursor-pointer"
          >
            <div
              class="w-6 h-6 rounded-full bg-gradient-to-r from-gray-200 to-gray-800 mx-auto mb-2"
            />
            <span class="text-sm text-white">{{
              t('settings.appearance.themes.system')
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-medium mb-4">
        {{ t('settings.appearance.accentColorSection') }}
      </h3>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="color in accentColors"
          :key="color.name"
          class="w-12 h-12 rounded-full cursor-pointer transition-all duration-200 relative"
          :style="{ backgroundColor: color.value }"
          @click="setAccentColor(color.name)"
        >
          <!-- Show checkmark on selected color -->
          <div
            v-if="currentAccentColor === color.name"
            class="absolute inset-0 flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <p class="text-text-secondary text-sm">
          {{ t('settings.appearance.accentColorDescription') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useThemeStore } from '~/stores/theme';
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

defineProps({
  accentColors: {
    type: Array,
    required: true,
  },
});

const { t } = useI18n();
const message = useMessage();
const themeStore = useThemeStore();

// Get current theme and accent color from the store
const currentTheme = computed(() => themeStore.currentTheme);
const currentAccentColor = computed(() => themeStore.accentColor);

// Set theme and notify user
function setTheme(theme) {
  themeStore.setTheme(theme);
  message.success(
    t('settings.appearance.notifications.themeChanged', {
      theme: t(`settings.appearance.themes.${theme}`),
    })
  );
}

// Set accent color and notify user
function setAccentColor(colorName) {
  themeStore.setAccentColor(colorName);
  message.success(
    t('settings.appearance.notifications.accentColorChanged', {
      color: t(`settings.appearance.colors.${colorName}`),
    })
  );
}
</script>
