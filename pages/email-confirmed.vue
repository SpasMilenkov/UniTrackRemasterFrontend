<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md px-4">
      <!-- Logo -->
      <div class="text-center mb-8">
        <Icon
          name="ph:graduation-cap-bold"
          class="w-16 h-16 mx-auto text-primary"
        />
      </div>
      <n-card class="confirmation-card" :bordered="false">
        <!-- Success Icon -->
        <div class="text-center mb-6">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary opacity-10 mb-4"
          >
            <Icon name="ph:check-circle-bold" class="w-12 h-12 text-primary" />
          </div>
          <h2 class="text-2xl font-semibold bg-gradient-primary">
            {{ t('emailConfirmed.title') }}
          </h2>
        </div>
        <div class="text-center mb-8">
          <p class="text-text-secondary">
            {{ t('emailConfirmed.description') }}
          </p>
        </div>
        <!-- Login Button -->
        <n-button
          type="primary"
          size="large"
          class="w-full mb-4 transform hover:scale-105 transition-all duration-300"
          @click="navigateToLogin"
        >
          {{ t('emailConfirmed.loginButton') }}
        </n-button>
        <!-- Support Link -->
        <div class="text-center text-sm text-text-muted">
          {{ t('emailConfirmed.needHelp') }}
          <NuxtLink
            to="/support"
            class="text-primary hover:text-primary-hover transition-colors"
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

<style scoped>
.confirmation-card {
  background-color: var(--color-background-card) !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

:deep(.n-card__content) {
  background-color: var(--color-background-card) !important;
}

.bg-gradient-primary {
  background-image: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
}

:deep(.n-button--primary-type) {
  background-color: var(--color-primary) !important;
}

:deep(.n-button--primary-type:hover) {
  background-color: var(--color-primary-hover) !important;
}
</style>
