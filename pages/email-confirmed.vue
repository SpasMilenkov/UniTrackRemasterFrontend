<template>
  <div class="min-h-screen flex items-center justify-center bg-[#18181c] p-4">
    <div class="w-full max-w-md px-4">
      <!-- Logo -->
      <div class="text-center mb-8">
        <Icon
          name="ph:graduation-cap-bold"
          class="w-16 h-16 mx-auto text-emerald-400"
        />
      </div>

      <n-card
        class="bg-[#262629] border border-gray-700/50 shadow-xl"
        :bordered="false"
      >
        <!-- Success Icon -->
        <div class="text-center mb-6">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-400/10 mb-4"
          >
            <Icon
              name="ph:check-circle-bold"
              class="w-12 h-12 text-emerald-400"
            />
          </div>

          <h2
            class="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
          >
            {{ t('emailConfirmed.title') }}
          </h2>
        </div>

        <div class="text-center mb-8">
          <p class="text-gray-300">
            {{ t('emailConfirmed.description') }}
          </p>
        </div>

        <!-- Login Button -->
        <n-button
          type="primary"
          size="large"
          class="w-full mb-4"
          :color="'#4ade80'"
          @click="navigateToLogin"
        >
          {{ t('emailConfirmed.loginButton') }}
        </n-button>

        <!-- Support Link -->
        <div class="text-center text-sm text-gray-400">
          {{ t('emailConfirmed.needHelp') }}
          <NuxtLink
            to="/support"
            class="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {{ t('emailConfirmed.contactSupport') }}
          </NuxtLink>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
const router = useRouter();

const navigateToLogin = () => {
  router.push('/login');
};
</script>
