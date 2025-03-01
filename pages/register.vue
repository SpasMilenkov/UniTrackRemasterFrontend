<template>
  <div class="min-h-96 flex flex-col lg:flex-row">
    <!-- Left Section - Animated Background -->
    <div
      class="w-full lg:w-3/5 min-h-[50vh] lg:min-h-screen relative bg-[length:800px_800px] animate-gradient custom-gradient-bg"
    >
      <!-- Overlay content -->
      <div class="relative z-10 p-6 lg:p-12 h-full flex flex-col">
        <div class="flex-1 mt-[20vh] lg:mt-[40vh]">
          <h1
            class="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 text-text-primary"
          >
            {{ t('registrationPage.welcomeMessage') }}
          </h1>
          <p class="text-base lg:text-lg text-text-primary/80">
            {{ t('registrationPage.welcomeDescription') }}
          </p>
        </div>

        <!-- Footer -->
        <div class="pt-4 lg:pt-8 border-t border-text-primary/20">
          <p class="text-text-primary/60 text-sm">
            {{
              t('footer.bottomBar.copyright', {
                year: new Date().getFullYear(),
              })
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Right Section - Registration Content -->
    <div
      class="w-full lg:w-3/5 flex items-center justify-center bg-background p-4 lg:p-2"
    >
      <div class="w-full flex items-center flex-col px-2">
        <!-- Logo -->
        <div class="text-center mb-8">
          <Icon
            name="ph:graduation-cap-bold"
            class="w-12 h-12 mx-auto text-primary"
          />
        </div>

        <!-- Account Type Selection -->
        <n-card
          v-if="!showRegistrationForm"
          class="bg-background-card border border-border/50 shadow-xl max-w-lg"
          :bordered="false"
        >
          <div class="text-center mb-8">
            <h2 class="text-2xl font-semibold text-gradient">
              {{ t('registrationPage.selectAccountType') }}
            </h2>
            <p class="text-text-secondary mt-2">
              {{ t('registrationPage.selectAccountTypeDesc') }}
            </p>
          </div>

          <n-space vertical size="large">
            <!-- Community Account Option -->
            <div
              class="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
              @click="selectAccountType('community')"
            >
              <div class="flex items-center gap-3 mb-2">
                <Icon name="ph:users-bold" class="text-primary text-xl" />
                <h3 class="text-text-primary font-semibold">
                  {{ t('registrationPage.communityAccount') }}
                </h3>
              </div>
              <p class="text-text-secondary text-sm">
                {{ t('registrationPage.communityAccountDesc') }}
              </p>
            </div>

            <!-- Organization Account Option -->
            <div
              class="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
              @click="selectAccountType('organization')"
            >
              <div class="flex items-center gap-3 mb-2">
                <Icon name="ph:buildings-bold" class="text-primary text-xl" />
                <h3 class="text-text-primary font-semibold">
                  {{ t('registrationPage.organizationAccount') }}
                </h3>
              </div>
              <p class="text-text-secondary text-sm">
                {{ t('registrationPage.organizationAccountDesc') }}
              </p>
            </div>
          </n-space>
        </n-card>

        <!-- Registration Forms -->
        <template v-else>
          <n-card
            class="bg-background-card border border-border/50 shadow-xl"
            :bordered="false"
          >
            <!-- Title -->
            <div class="text-center mb-8">
              <h2 class="text-2xl font-semibold text-gradient">
                {{ t('registrationPage.title') }}
              </h2>
            </div>

            <!-- Organization Registration Form -->
            <OrganizationRegistrationForm
              v-if="accountType === 'organization'"
              @back="showRegistrationForm = false"
              @submit="handleSubmit"
            />

            <!-- Community Registration Form -->
            <CommunityRegistrationForm
              v-else
              @back="showRegistrationForm = false"
              @submit="handleCommunitySubmit"
            />

            <!-- Login Link -->
            <div
              class="flex gap-2 justify-center mt-6 text-center text-text-secondary"
            >
              {{ t('registrationPage.haveAccount') }}
              <NuxtLink
                to="/login"
                class="text-primary hover:text-primary-hover transition-colors"
              >
                {{ t('registrationPage.loginLink') }}
              </NuxtLink>
            </div>
          </n-card>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { NCard, NSpace } from 'naive-ui';
import { useAuthStore } from '@/stores/auth';
import OrganizationRegistrationForm from '../components/auth/OrgLinkedRegistrationForm.vue';
import CommunityRegistrationForm from '../components/auth/CommunityRegistrationForm.vue';

// State
const showRegistrationForm = ref(false);
const accountType = ref<'community' | 'organization' | null>(null);

// Localization
const { t } = useI18n();

// Stores
const authStore = useAuthStore();

// Methods
const selectAccountType = (type: 'community' | 'organization') => {
  accountType.value = type;
  showRegistrationForm.value = true;
};

const handleSubmit = (formData: any) => {
  authStore.register(formData);
};

const handleCommunitySubmit = (formData: any) => {
  authStore.registerGuest(formData);
};
</script>

<style scoped>
.text-gradient {
  background-image: linear-gradient(
    to right,
    var(--color-primary, #4ade80),
    var(--color-secondary, #3b82f6)
  );
  -webkit-background-clip: text;
  background-clip: text;
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
}
</style>
