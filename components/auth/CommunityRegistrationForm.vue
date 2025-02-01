<template>
  <n-card size="large" class="max-w-5xl mx-auto">
    <n-form
      class="grid grid-cols-1 md:grid-cols-2 gap-x-8"
      @submit.prevent="onSubmit"
    >
      <!-- Left Column -->
      <div>
        <!-- Personal Information Section -->
        <n-divider class="!mt-0">{{
          t('registrationPage.personalInfo')
        }}</n-divider>
        <n-space vertical size="small">
          <n-form-item
            :label="t('registrationPage.firstNameLabel')"
            v-bind="firstNameProps"
            path="firstName"
          >
            <n-input
              v-model:value="firstName"
              :placeholder="t('registrationPage.firstNamePlaceholder')"
            />
          </n-form-item>
          <n-form-item
            :label="t('registrationPage.lastNameLabel')"
            v-bind="lastNameProps"
            path="lastName"
          >
            <n-input
              v-model:value="lastName"
              :placeholder="t('registrationPage.lastNamePlaceholder')"
            />
          </n-form-item>
        </n-space>

        <!-- Contact Information Section -->
        <n-divider>{{ t('registrationPage.contactInfo') }}</n-divider>
        <n-space vertical size="small">
          <n-form-item
            :label="t('registrationPage.emailLabel')"
            v-bind="emailProps"
            path="email"
          >
            <n-input
              v-model:value="email"
              :placeholder="t('registrationPage.emailPlaceholder')"
            />
          </n-form-item>
          <n-form-item
            :label="t('registrationPage.phoneNumberLabel')"
            v-bind="phoneNumberProps"
            path="phoneNumber"
          >
            <n-input
              v-model:value="phoneNumber"
              :placeholder="t('registrationPage.phoneNumberPlaceholder')"
            />
          </n-form-item>
        </n-space>
      </div>

      <!-- Right Column -->
      <div>
        <!-- Password Section -->
        <n-divider class="!mt-0 md:!mt-0">{{
          t('registrationPage.passwordLabel')
        }}</n-divider>
        <n-space vertical size="small">
          <n-form-item
            :label="t('registrationPage.passwordLabel')"
            v-bind="passwordProps"
            path="password"
          >
            <n-input
              v-model:value="password"
              type="password"
              show-password-on="click"
              :placeholder="t('registrationPage.passwordPlaceholder')"
            />
          </n-form-item>
          <n-form-item
            :label="t('registrationPage.confirmPasswordLabel')"
            v-bind="confirmPasswordProps"
            path="confirmPassword"
          >
            <n-input
              v-model:value="confirmPassword"
              :placeholder="t('registrationPage.confirmPasswordPlaceholder')"
              show-password-on="click"
              type="password"
            />
          </n-form-item>
        </n-space>
      </div>

      <!-- Footer Buttons -->
      <div
        class="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-center gap-4 mt-6"
      >
        <n-button quaternary @click="$emit('back')">
          <template #icon>
            <Icon name="ph:arrow-left-bold" />
          </template>
          {{ t('registrationPage.backButton') }}
        </n-button>
        <n-button type="primary" attr-type="submit" size="large">
          {{ t('registrationPage.registerButton') }}
        </n-button>
      </div>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { registerGuestSchema } from '~/schemas/register-guest.schema';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';

const emit = defineEmits(['back', 'submit']);

// Localization
const { t } = useI18n();

// Form Handling
const schema = registerGuestSchema();
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

// Form fields
const [firstName, firstNameProps] = defineField(
  'firstName',
  naiveUiFormsConfig
);
const [lastName, lastNameProps] = defineField('lastName', naiveUiFormsConfig);
const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [phoneNumber, phoneNumberProps] = defineField(
  'phoneNumber',
  naiveUiFormsConfig
);
const [password, passwordProps] = defineField('password', naiveUiFormsConfig);
const [confirmPassword, confirmPasswordProps] = defineField(
  'confirmPassword',
  naiveUiFormsConfig
);

// Methods
const onSubmit = handleSubmit((values) => {
  emit('submit', { ...values, accountType: 'community' });
});
</script>
