<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Left Section - Gradient Background -->
    <div
      class="w-full lg:w-3/5 min-h-[50vh] lg:min-h-screen relative bg-[length:800px_800px] animate-gradient bg-[linear-gradient(45deg,rgba(0,190,164,0.2)_0%,rgba(128,116,239,0.2)_25%,rgba(0,190,164,0.2)_50%,rgba(128,116,239,0.2)_75%,rgba(0,190,164,0.2)_100%)]"
    >
      <div class="relative z-10 p-6 lg:p-12 h-full flex flex-col">
        <div class="flex-1 mt-[20vh] lg:mt-[40vh]">
          <h1 class="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 text-white">
            {{ t('forgotPassword.title') }}
          </h1>
          <p class="text-base lg:text-lg text-white/80">
            {{ t('forgotPassword.description') }}
          </p>
        </div>
        <div class="pt-4 lg:pt-8 border-t border-white/20">
          <p class="text-white/60 text-sm">
            {{ t('forgotPassword.trademark') }}
          </p>
        </div>
      </div>
    </div>
    <!-- Right Section - Email Form -->
    <div
      class="w-full lg:w-2/5 flex items-center justify-center bg-[#18181c] p-4 lg:p-6"
    >
      <div class="w-full max-w-md px-4">
        <Logo />
        <n-card
          class="bg-[#262629] border border-gray-700/50 shadow-xl"
          :bordered="false"
        >
          <div class="text-center mb-8">
            <h2
              class="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
            >
              {{ t('forgotPassword.step1Title') }}
            </h2>
          </div>
          <EmailVerificationForm @success="handleEmailSuccess" />
          <div class="mt-6 text-center text-gray-400">
            {{ t('forgotPassword.backToLogin') }}
            <NuxtLink
              to="/login"
              class="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {{ t('forgotPassword.loginLink') }}
            </NuxtLink>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from 'naive-ui';
import Logo from '~/components/LogoComponent.vue';
import EmailVerificationForm from '~/components/auth/EmailVerificationForm.vue';

const notification = useNotification();
const { t } = useI18n();

const handleEmailSuccess = () => {
  notification.success({
    title: t('success.emailSent'),
    content: t('success.checkInbox'),
    duration: 5000,
    closable: true,
  });
};
</script>
