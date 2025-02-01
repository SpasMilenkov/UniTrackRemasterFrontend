<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Left Section - Gradient Background -->
    <div
      class="w-full lg:w-3/5 min-h-[50vh] lg:min-h-screen relative bg-[length:800px_800px] animate-gradient bg-[linear-gradient(45deg,rgba(0,190,164,0.2)_0%,rgba(128,116,239,0.2)_25%,rgba(0,190,164,0.2)_50%,rgba(128,116,239,0.2)_75%,rgba(0,190,164,0.2)_100%)]"
    >
      <div class="relative z-10 p-6 lg:p-12 h-full flex flex-col">
        <div class="flex-1 mt-[20vh] lg:mt-[40vh]">
          <h1 class="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 text-white">
            {{ t('resetPassword.title') }}
          </h1>
          <p class="text-base lg:text-lg text-white/80">
            {{ t('resetPassword.description') }}
          </p>
        </div>
        <div class="pt-4 lg:pt-8 border-t border-white/20">
          <p class="text-white/60 text-sm">
            {{ t('resetPassword.trademark') }}
          </p>
        </div>
      </div>
    </div>
    <!-- Right Section - Reset Form -->
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
              {{ t('resetPassword.formTitle') }}
            </h2>
          </div>
          <PasswordResetForm @success="handleResetSuccess" />
          <div class="mt-6 text-center text-gray-400">
            {{ t('resetPassword.backToLogin') }}
            <NuxtLink
              to="/login"
              class="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {{ t('resetPassword.loginLink') }}
            </NuxtLink>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useNotification } from 'naive-ui';
import Logo from '~/components/LogoComponent.vue';
import PasswordResetForm from '~/components/auth/PasswordResetForm.vue';

const route = useRoute();
const router = useRouter();
const notification = useNotification();
const { t } = useI18n();

onMounted(() => {
  const { token, email } = route.query;
  if (!token || !email) {
    notification.error({
      title: t('errors.invalidResetLink'),
      content: t('errors.missingParameters'),
      duration: 5000,
    });
    router.push('/forgot-password');
  }
});

const handleResetSuccess = () => {
  notification.success({
    title: t('success.passwordReset'),
    content: t('success.canNowLogin'),
    duration: 5000,
  });
  router.push('/login');
};
</script>
