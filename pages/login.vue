<template>
  <div class="min-h-96 flex flex-col lg:flex-row">
    <!-- Left Section - 3D Globe -->
    <div
      class="w-full lg:w-3/5 min-h-[50vh] lg:min-h-screen relative bg-[length:800px_800px] animate-gradient custom-gradient-bg"
    >
      <!-- Overlay content -->
      <div class="relative z-10 p-6 lg:p-12 h-full flex flex-col">
        <div class="flex-1 mt-[20vh] lg:mt-[40vh]">
          <h1
            class="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 theme-aware-text"
          >
            {{ t('loginPage.welcomeMessage') }}
          </h1>
          <p class="text-base lg:text-lg theme-aware-text-secondary">
            {{ t('loginPage.welcomeDescription') }}
          </p>
        </div>
 
        <!-- Footer -->
        <div class="pt-4 lg:pt-8 border-t theme-aware-border">
          <p class="theme-aware-text-muted text-sm">
            {{
              t('footer.bottomBar.copyright', {
                year: new Date().getFullYear(),
              })
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Right Section - Login Form -->
    <div
      class="w-full lg:w-2/5 flex items-center justify-center bg-background p-4 lg:p-6"
    >
      <div class="w-full max-w-md px-4">
        <div class="text-center mb-8">
          <Icon
            name="ph:graduation-cap-bold"
            class="w-12 h-12 mx-auto text-primary"
          />
        </div>

        <n-card class="themed-card feature-card" :bordered="false">
          <!-- Title -->
          <div class="text-center mb-8">
            <h2 class="text-2xl font-semibold text-gradient">
              {{ t('loginPage.title') }}
            </h2>
          </div>

          <!-- Form -->
          <n-form @submit.prevent="onSubmit">
            <n-space vertical size="large">
              <!-- Email Field -->
              <n-form-item
                :label="t('loginPage.emailLabel')"
                v-bind="emailProps"
                path="email"
                class="themed-form-item"
              >
                <n-input
                  v-model:value="email"
                  :placeholder="t('loginPage.emailPlaceholder')"
                  class="themed-input"
                >
                  <template #prefix>
                    <Icon name="ph:envelope" />
                  </template>
                </n-input>
              </n-form-item>

              <!-- Password Field -->
              <n-form-item
                :label="t('loginPage.passwordLabel')"
                v-bind="passwordProps"
                path="password"
                class="themed-form-item"
              >
                <n-input
                  v-model:value="password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="t('loginPage.passwordPlaceholder')"
                  class="themed-input"
                >
                  <template #prefix>
                    <Icon name="ph:lock-simple" />
                  </template>
                  <template #suffix>
                    <Icon
                      :name="showPassword ? 'ph:eye' : 'ph:eye-slash'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </n-input>
              </n-form-item>

              <!-- Remember & Forgot Password -->
              <div class="flex items-center justify-between text-sm">
                <NuxtLink
                  to="/forgot-password"
                  class="text-primary hover:text-primary-hover transition-colors"
                >
                  {{ t('loginPage.forgotPassword') }}
                </NuxtLink>
              </div>

              <!-- Login Button -->
              <n-button
                type="primary"
                attr-type="submit"
                size="large"
                class="w-full transform hover:scale-105 transition-all duration-300"
                :loading="isLoading"
              >
                {{ t('loginPage.loginButton') }}
              </n-button>
            </n-space>
          </n-form>

          <!-- Sign up link -->
          <div
            class="flex gap-2 justify-center mt-6 text-center text-text-secondary"
          >
            {{ t('loginPage.noAccount') }}
            <NuxtLink
              to="/register"
              class="text-primary hover:text-primary-hover transition-colors"
            >
              {{ t('loginPage.signUpLink') }}
            </NuxtLink>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import {
  NButton,
  NForm,
  NInput,
  NSpace,
  NCard,
  NFormItem,
  useNotification,
} from 'naive-ui';
import { loginSchema } from '~/schemas/login.schema';
import { useAuthStore } from '@/stores/auth';

// Localization
const { t } = useI18n();

// Stores
const authStore = useAuthStore();

// Loading state
const isLoading = ref(false);
const notification = useNotification();
const showPassword = ref(false);
// Form Handling
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [password, passwordProps] = defineField('password', naiveUiFormsConfig);

// Submit Handler
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;

  // Clear any previous errors
  authStore.clearError();
  try {
    // Attempt login
    await authStore.login(values);

    // Check if there's an error in the store after the operation
    if (authStore.error) {
      console.log(
        '❌ Found error in store, showing error notification:',
        authStore.error
      );

      notification.create({
        title: t('loginPage.errorTitle') || 'Login Failed',
        content: authStore.error,
        type: 'error',
        duration: 5000,
      });
    } else {
      console.log('✅ No errors found, showing success notification');

      notification.create({
        title: t('loginPage.successTitle') || 'Success',
        content:
          t('loginPage.successMessage') || 'You have logged in successfully.',
        type: 'success',
        duration: 4000,
      });
    }
  } catch (err: any) {
    console.log('🚨 Caught error in submit handler:', err);
    console.log('🚨 Error type:', typeof err);
    console.log('🚨 Error message:', err?.message);
    console.log('🚨 Error data:', err?.data);
    console.log('🚨 Store error at catch time:', authStore.error);

    // Fallback error handling
    const errorMessage =
      authStore.error ||
      err?.data?.message ||
      err?.message ||
      t('loginPage.errorMessage') ||
      'Something went wrong during login.';

    console.log('🚨 Final error message to show:', errorMessage);

    notification.create({
      title: t('loginPage.errorTitle') || 'Login Failed',
      content: errorMessage,
      type: 'error',
      duration: 5000,
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.text-gradient {
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

.custom-gradient-bg {
  background-image: linear-gradient(
    45deg,
    rgba(var(--color-primary-rgb, 0, 190, 164), 0.2) 0%,
    rgba(var(--color-secondary-rgb, 128, 116, 239), 0.2) 25%,
    rgba(var(--color-primary-rgb, 0, 190, 164), 0.2) 50%,
    rgba(var(--color-secondary-rgb, 128, 116, 239), 0.2) 75%,
    rgba(var(--color-primary-rgb, 0, 190, 164), 0.2) 100%
  );
  position: relative;
}

.custom-gradient-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

:root.light .custom-gradient-bg::after {
  background-color: rgba(255, 255, 255, 0.4);
}

:root.dark .custom-gradient-bg::after {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Theme-aware text styling */
.theme-aware-text {
  color: var(--theme-login-text, var(--color-text-primary));
}

.theme-aware-text-secondary {
  color: var(--theme-login-text-secondary, var(--color-text-secondary));
}

.theme-aware-text-muted {
  color: var(--theme-login-text-muted, var(--color-text-muted));
}

.theme-aware-border {
  border-color: var(--theme-login-border, rgba(255, 255, 255, 0.2));
}

:root.light .theme-aware-text {
  --theme-login-text: rgb(31, 41, 55); /* dark gray for light mode */
}

:root.light .theme-aware-text-secondary {
  --theme-login-text-secondary: rgb(
    55,
    65,
    81
  ); /* medium gray for light mode */
}

:root.light .theme-aware-text-muted {
  --theme-login-text-muted: rgb(107, 114, 128); /* light gray for light mode */
}

:root.light .theme-aware-border {
  --theme-login-border: rgba(
    209,
    213,
    219,
    0.8
  ); /* light gray border for light mode */
}

:root.dark .theme-aware-text {
  --theme-login-text: rgb(255, 255, 255); /* white for dark mode */
}

:root.dark .theme-aware-text-secondary {
  --theme-login-text-secondary: rgba(
    255,
    255,
    255,
    0.8
  ); /* slightly transparent white for dark mode */
}

:root.dark .theme-aware-text-muted {
  --theme-login-text-muted: rgba(
    255,
    255,
    255,
    0.6
  ); /* more transparent white for dark mode */
}

:root.dark .theme-aware-border {
  --theme-login-border: rgba(
    255,
    255,
    255,
    0.2
  ); /* transparent white border for dark mode */
}

.feature-card {
  border-radius: 12px;
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.15);
}

:deep(.themed-card) {
  background-color: var(--color-background-card) !important;
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.2);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

:deep(.themed-card:hover) {
  transform: translateY(-4px);
  border-color: rgba(var(--color-primary-rgb), 0.3);
  box-shadow:
    0 0 30px rgba(var(--color-primary-rgb), 0.1),
    0 0 2px rgba(var(--color-primary-rgb), 0.3);
}

:deep(.themed-form-item .n-form-item-label) {
  color: var(--color-text-primary) !important;
  font-weight: 600;
}

:deep(.themed-input .n-input__input) {
  background-color: var(--color-background-secondary) !important;
  color: var(--color-text-primary) !important;
}

:deep(.themed-input .n-input__placeholder) {
  color: var(--color-text-muted) !important;
}

@keyframes gradientBackground {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.animate-gradient {
  animation: gradientBackground 15s ease infinite;
  background-size: 400% 400%;
}
</style>
