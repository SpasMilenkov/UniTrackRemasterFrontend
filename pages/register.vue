<template>
  <div class="min-h-96 flex flex-col lg:flex-row">
    <!-- Left Section - Animated Background -->
    <div
      class="w-full lg:w-3/5 min-h-[50vh] lg:min-h-screen relative bg-[length:800px_800px] animate-gradient bg-[linear-gradient(45deg,rgba(0,190,164,0.2)_0%,rgba(128,116,239,0.2)_25%,rgba(0,190,164,0.2)_50%,rgba(128,116,239,0.2)_75%,rgba(0,190,164,0.2)_100%)]"
    >
      <!-- Overlay content -->
      <div class="relative z-10 p-6 lg:p-12 h-full flex flex-col">
        <div class="flex-1 mt-[20vh] lg:mt-[40vh]">
          <h1 class="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 text-white">
            {{ t('registrationPage.welcomeMessage') }}
          </h1>
          <p class="text-base lg:text-lg text-white/80">
            {{ t('registrationPage.welcomeDescription') }}
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

    <!-- Right Section - Registration Content -->
    <div
      class="w-full lg:w-3/5 flex items-center justify-center bg-[#18181c] p-4 lg:p-2"
    >
      <div class="w-full flex items-center flex-col px-2">
        <!-- Logo -->
        <div class="text-center mb-8">
          <Icon
            name="ph:graduation-cap-bold"
            class="w-12 h-12 mx-auto text-emerald-400"
          />
        </div>

        <!-- Account Type Selection -->
        <n-card
          v-if="!showRegistrationForm"
          class="bg-[#262629] border border-gray-700/50 shadow-xl max-w-lg"
          :bordered="false"
        >
          <div class="text-center mb-8 ">
            <h2
              class="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
            >
              {{ t('registrationPage.selectAccountType') }}
            </h2>
            <p class="text-gray-400 mt-2">
              {{ t('registrationPage.selectAccountTypeDesc') }}
            </p>
          </div>

          <n-space vertical size="large">
            <!-- Community Account Option -->
            <div
              class="p-4 rounded-lg border border-gray-700/50 hover:border-emerald-400/50 transition-all cursor-pointer"
              @click="selectAccountType('community')"
            >
              <div class="flex items-center gap-3 mb-2">
                <Icon name="ph:users-bold" class="text-emerald-400 text-xl" />
                <h3 class="text-white font-semibold">
                  {{ t('registrationPage.communityAccount') }}
                </h3>
              </div>
              <p class="text-gray-400 text-sm">
                {{ t('registrationPage.communityAccountDesc') }}
              </p>
            </div>

            <!-- Organization Account Option -->
            <div
              class="p-4 rounded-lg border border-gray-700/50 hover:border-emerald-400/50 transition-all cursor-pointer"
              @click="selectAccountType('organization')"
            >
              <div class="flex items-center gap-3 mb-2">
                <Icon
                  name="ph:buildings-bold"
                  class="text-emerald-400 text-xl"
                />
                <h3 class="text-white font-semibold">
                  {{ t('registrationPage.organizationAccount') }}
                </h3>
              </div>
              <p class="text-gray-400 text-sm">
                {{ t('registrationPage.organizationAccountDesc') }}
              </p>
            </div>
          </n-space>
        </n-card>

        <!-- Registration Forms -->
        <template v-else>
          <n-card
            class="bg-[#262629] border border-gray-700/50 shadow-xl"
            :bordered="false"
          >
            <!-- Title -->
            <div class="text-center mb-8">
              <h2
                class="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
              >
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
              class="flex gap-2 justify-center mt-6 text-center text-gray-400"
            >
              {{ t('registrationPage.haveAccount') }}
              <NuxtLink
                to="/login"
                class="text-emerald-400 hover:text-emerald-300 transition-colors"
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
