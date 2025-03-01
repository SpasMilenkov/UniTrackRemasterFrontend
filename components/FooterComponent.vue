<template>
  <n-layout-footer class="bg-background-card border-t border-border">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Company Info -->
        <div class="flex flex-col items-start">
          <Logo />
          <n-text class="text-text-secondary p-2">
            {{ t('footer.companyInfo.description') }}
          </n-text>
        </div>

        <!-- Quick Links -->
        <div>
          <n-text class="text-text-primary font-semibold block mb-4">
            {{ t('footer.quickLinks.title') }}
          </n-text>
          <n-space vertical>
            <n-button
              text
              class="text-text-secondary hover:text-primary"
              @click="navigateTo('/#features')"
            >
              {{ t('footer.quickLinks.features') }}
            </n-button>
            <n-button
              text
              class="text-text-secondary hover:text-primary"
              @click="navigateTo('/#roadmap')"
            >
              {{ t('footer.quickLinks.roadmap') }}
            </n-button>
            <n-button
              text
              class="text-text-secondary hover:text-primary"
              @click="navigateTo('/documentation')"
            >
              {{ t('footer.quickLinks.documentation') }}
            </n-button>
          </n-space>
        </div>

        <!-- Contact -->
        <div>
          <n-text class="text-text-primary font-semibold block mb-4">
            {{ t('footer.contact.title') }}
          </n-text>
          <n-space vertical>
            <n-text class="text-text-secondary">
              <Icon name="ph:envelope-simple" class="mr-2" />
              {{ t('footer.contact.email') }}
            </n-text>
            <n-text class="text-text-secondary">
              <Icon name="ph:phone" class="mr-2" />
              {{ t('footer.contact.phone') }}
            </n-text>
          </n-space>
        </div>

        <!-- Social -->
        <div>
          <n-text class="text-text-primary font-semibold block mb-4">
            {{ t('footer.social.title') }}
          </n-text>
          <n-space>
            <n-button circle secondary class="hover:text-primary">
              <template #icon>
                <Icon name="ph:twitter-logo" />
              </template>
            </n-button>
            <n-button circle secondary class="hover:text-primary">
              <template #icon>
                <Icon name="ph:linkedin-logo" />
              </template>
            </n-button>
            <n-button circle secondary class="hover:text-primary">
              <template #icon>
                <Icon name="ph:github-logo" />
              </template>
            </n-button>
          </n-space>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 mt-8 border-t border-border">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <n-text class="text-text-secondary text-sm">
            {{
              t('footer.bottomBar.copyright', {
                year: new Date().getFullYear(),
              })
            }}
          </n-text>
          <n-space>
            <n-button
              text
              size="small"
              class="text-text-secondary hover:text-primary"
              @click="navigateTo('/privacy-policy')"
            >
              {{ t('footer.bottomBar.privacyPolicy') }}
            </n-button>
            <n-button
              text
              size="small"
              class="text-text-secondary hover:text-primary"
              @click="navigateTo('/terms-of-service')"
            >
              {{ t('footer.bottomBar.termsOfService') }}
            </n-button>
            <n-button
              text
              size="small"
              class="text-text-secondary hover:text-primary"
              @click="navigateTo('/cookie-policy')"
            >
              {{ t('footer.bottomBar.cookiePolicy') }}
            </n-button>
          </n-space>
        </div>
      </div>
    </div>
  </n-layout-footer>
</template>

<script setup lang="ts">
import { NLayoutFooter, NSpace, NText, NButton } from 'naive-ui';
import Logo from './LogoComponent.vue';

const { t } = useI18n();
</script>

<style scoped>
:deep(.n-button:not(.n-button--primary-type):hover) {
  color: var(--color-primary) !important;
}

:deep(.n-text) {
  transition: color 0.3s ease;
}

:deep(.n-button) {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
</style>