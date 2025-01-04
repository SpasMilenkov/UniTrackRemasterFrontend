<template>
  <n-layout-footer class="bg-[#18181c] border-t border-[#262629]">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Company Info -->
        <div>
          <img
            src="/img/logo.png"
            alt="UniTrack Logo"
            class="h-12 w-auto mb-4"
          />
          <n-text class="text-gray-400">
            Empowering educational institutions with next-generation analytics
            and management tools.
          </n-text>
        </div>

        <!-- Quick Links -->
        <div>
          <n-text class="text-white font-semibold block mb-4"
            >Quick Links</n-text
          >
          <n-space vertical>
            <n-button
              text
              class="text-gray-400 hover:text-emerald-400"
              @click="navigateTo('/#features')"
            >
              Features
            </n-button>
            <n-button
              text
              class="text-gray-400 hover:text-emerald-400"
              @click="navigateTo('/#roadmap')"
            >
              Roadmap
            </n-button>
            <n-button
              text
              class="text-gray-400 hover:text-emerald-400"
              @click="navigateTo('/documentation')"
            >
              Documentation
            </n-button>
          </n-space>
        </div>

        <!-- Contact -->
        <div>
          <n-text class="text-white font-semibold block mb-4">Contact</n-text>
          <n-space vertical>
            <n-text class="text-gray-400">
              <Icon name="ph:envelope-simple" class="mr-2" />
              contact@unitrack.edu
            </n-text>
            <n-text class="text-gray-400">
              <Icon name="ph:phone" class="mr-2" />
              +1 (555) 123-4567
            </n-text>
          </n-space>
        </div>

        <!-- Social -->
        <div>
          <n-text class="text-white font-semibold block mb-4">Follow Us</n-text>
          <n-space>
            <n-button circle secondary class="hover:text-emerald-400">
              <template #icon>
                <Icon name="ph:twitter-logo" />
              </template>
            </n-button>
            <n-button circle secondary class="hover:text-emerald-400">
              <template #icon>
                <Icon name="ph:linkedin-logo" />
              </template>
            </n-button>
            <n-button circle secondary class="hover:text-emerald-400">
              <template #icon>
                <Icon name="ph:github-logo" />
              </template>
            </n-button>
          </n-space>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 mt-8 border-t border-[#262629]">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <n-text class="text-gray-400 text-sm">
            &copy; {{ new Date().getFullYear() }} UniTrack. All rights reserved.
          </n-text>
          <n-space>
            <n-button
              text
              size="small"
              class="text-gray-400 hover:text-emerald-400"
              @click="navigateTo('/privacy-policy')"
            >
              Privacy Policy
            </n-button>
            <n-button
              text
              size="small"
              class="text-gray-400 hover:text-emerald-400"
              @click="navigateTo('/terms-of-service')"
            >
              Terms of Service
            </n-button>
            <n-button
              text
              size="small"
              class="text-gray-400 hover:text-emerald-400"
              @click="navigateTo('/cookie-policy')"
            >
              Cookie Policy
            </n-button>
          </n-space>
        </div>
      </div>
    </div>
  </n-layout-footer>
</template>

<script setup>
import { NLayoutFooter, NSpace, NText, NButton } from 'naive-ui';
</script>

<style scoped>
:deep(.n-button.n-button--secondary-type) {
  background-color: #262629 !important;
  border-color: #374151 !important;
}

:deep(.n-button.n-button--secondary-type:hover) {
  border-color: #4ade80 !important;
}

:deep(.n-layout-footer) {
  padding: 0 !important;
}
</style>
