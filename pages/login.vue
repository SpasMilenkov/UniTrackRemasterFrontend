<template>
  <div class="min-h-96 flex flex-col lg:flex-row">
    <!-- Left Section - 3D Globe -->
    <div
      class="w-full lg:w-3/5 min-h-[50vh] lg:min-h-screen relative bg-[length:800px_800px] animate-gradient bg-[linear-gradient(45deg,rgba(0,190,164,0.2)_0%,rgba(128,116,239,0.2)_25%,rgba(0,190,164,0.2)_50%,rgba(128,116,239,0.2)_75%,rgba(0,190,164,0.2)_100%)]"
    >
      <!-- Overlay content -->
      <div class="relative z-10 p-6 lg:p-12 h-full flex flex-col">
        <div class="flex-1 mt-[20vh] lg:mt-[40vh]">
          <h1 class="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 text-white">
            {{ t('loginPage.welcomeMessage') }}
          </h1>
          <p class="text-base lg:text-lg text-white/80">
            {{ t('loginPage.welcomeDescription') }}
          </p>
        </div>

        <!-- Footer -->
        <div class="pt-4 lg:pt-8 border-t border-white/20">
          <p class="text-white/60 text-sm">
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
      class="w-full lg:w-2/5 flex items-center justify-center bg-[#18181c] p-4 lg:p-6"
    >
      <div class="w-full max-w-md px-4">
        <div class="text-center mb-8">
          <Icon
            name="ph:graduation-cap-bold"
            class="w-12 h-12 mx-auto text-emerald-400"
          />
        </div>

        <n-card
          class="bg-[#262629] border border-gray-700/50 shadow-xl"
          :bordered="false"
        >
          <!-- Title -->
          <div class="text-center mb-8">
            <h2
              class="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
            >
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
                label-style="text-gray-300 font-semibold"
              >
                <n-input
                  v-model:value="email"
                  :placeholder="t('loginPage.emailPlaceholder')"
                  class="bg-[#303035] text-white placeholder-gray-500"
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
                label-style="text-gray-300 font-semibold"
              >
                <n-input
                  v-model:value="password"
                  :placeholder="t('loginPage.passwordPlaceholder')"
                  type="password"
                  class="bg-[#303035] text-white placeholder-gray-500"
                >
                  <template #prefix>
                    <Icon name="ph:lock-simple" />
                  </template>
                </n-input>
              </n-form-item>

              <!-- Remember & Forgot Password -->
              <div class="flex items-center justify-between text-sm">
                <NuxtLink
                  to="/forgot-password"
                  class="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {{ t('loginPage.forgotPassword') }}
                </NuxtLink>
              </div>

              <!-- Login Button -->
              <n-button
                type="primary"
                attr-type="submit"
                size="large"
                class="w-full"
                :color="isLoading ? undefined : '#4ade80'"
                :loading="isLoading"
              >
                {{ t('loginPage.loginButton') }}
              </n-button>
            </n-space>
          </n-form>

          <!-- Sign up link -->
          <div class="flex gap-2 justify-center mt-6 text-center text-gray-400">

              {{ t('loginPage.noAccount') }}
              <NuxtLink
              to="/register"
              class="text-emerald-400 hover:text-emerald-300 transition-colors"
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
} from 'naive-ui';
import { loginSchema } from '~/schemas/login.schema';
import { useAuthStore } from '@/stores/auth';


// Localization
const { t } = useI18n();

// Stores
const authStore = useAuthStore();

// Loading state
const isLoading = ref(false);

// Form Handling
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [password, passwordProps] = defineField('password', naiveUiFormsConfig);

// Submit Handler
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await authStore.login(values);
  } finally {
    isLoading.value = false;
  }
});
</script>
