<template>
  <div class="min-h-screen bg-default text-white relative">
    <!-- Content wrapper -->
    <div class="relative z-10">
      <div class="py-16">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <h1
              class="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text mb-6"
            >
              {{
                showRegistrationForm
                  ? t('registrationPage.title')
                  : t('registrationPage.selectAccountType')
              }}
            </h1>
            <p class="text-gray-400 max-w-2xl mx-auto">
              {{
                showRegistrationForm
                  ? t('registrationPage.subtitle')
                  : t('registrationPage.selectAccountTypeDesc')
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Account Type Selection -->
      <div v-if="!showRegistrationForm" class="py-12">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="grid md:grid-cols-2 gap-8">
            <OptionCard
              v-for="(card, index) in accountTypeCards"
              :key="index"
              :card="card"
            />
          </div>
        </div>
      </div>

      <!-- Registration Forms -->
      <div v-else class="py-6">
        <OrganizationRegistrationForm
          v-if="accountType === 'organization'"
          @back="showRegistrationForm = false"
          @submit="handleSubmit"
        />
        <CommunityRegistrationForm
          v-else
          @back="showRegistrationForm = false"
          @submit="handleCommunitySubmit"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import OrganizationRegistrationForm from '../components/auth/OrgLinkedRegistrationForm.vue';
import CommunityRegistrationForm from '../components/auth/CommunityRegistrationForm.vue';
import OptionCard from '~/components/onboarding/OptionCardComponent.vue';

// State
const showRegistrationForm = ref(false);
const accountType = ref<'community' | 'organization' | null>(null);

// Localization
const { t } = useI18n();

// Stores
const authStore = useAuthStore();

// Account type selection cards
const accountTypeCards = [
  {
    icon: 'ph:users-bold',
    title: t('registrationPage.communityAccount'),
    description: t('registrationPage.communityAccountDesc'),
    features: [
      t('registrationPage.communityFeature1'),
      t('registrationPage.communityFeature2'),
      t('registrationPage.communityFeature3'),
    ],
    buttonText: t('registrationPage.selectButton'),
    buttonAction: () => {
      accountType.value = 'community';
      showRegistrationForm.value = true;
    },
  },
  {
    icon: 'ph:buildings-bold',
    title: t('registrationPage.organizationAccount'),
    description: t('registrationPage.organizationAccountDesc'),
    features: [
      t('registrationPage.orgFeature1'),
      t('registrationPage.orgFeature2'),
      t('registrationPage.orgFeature3'),
    ],
    buttonText: t('registrationPage.selectButton'),
    buttonAction: () => {
      accountType.value = 'organization';
      showRegistrationForm.value = true;
    },
  },
];

// Form submission handler
const handleSubmit = (formData: any) => {
  authStore.register(formData);
};
const handleCommunitySubmit = (formData: any) => {
  authStore.registerGuest(formData);
};
</script>
