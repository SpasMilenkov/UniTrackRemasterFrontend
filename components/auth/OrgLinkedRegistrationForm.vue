<template>
  <n-card size="large" class="max-w-5xl mx-auto registration-card">
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
            show-password-on="click"
            path="confirmPassword"
          >
            <n-input
              v-model:value="confirmPassword"
              :placeholder="t('registrationPage.confirmPasswordPlaceholder')"
              type="password"
            />
          </n-form-item>
        </n-space>

        <!-- Organization Information Section -->
        <n-divider>{{ t('registrationPage.orgInfo') }}</n-divider>
        <n-space vertical size="small">
          <n-form-item
            :label="t('registrationPage.orgNameLabel')"
            v-bind="orgIdProps"
            path="orgId"
          >
            <n-select
              v-model:value="orgId"
              :placeholder="t('registrationPage.orgRolePlaceholder')"
              :options="schools"
            />
          </n-form-item>
          <n-form-item
            :label="t('registrationPage.orgRoleLabel')"
            v-bind="orgRoleProps"
            path="orgRole"
          >
            <n-select
              v-model:value="orgRole"
              :placeholder="t('registrationPage.orgRolePlaceholder')"
              :options="orgRoles"
            />
          </n-form-item>
        </n-space>
      </div>

      <!-- Footer Buttons -->
      <div
        class="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-center gap-4 mt-6"
      >
        <n-button quaternary class="back-btn" @click="$emit('back')">
          <template #icon>
            <Icon name="ph:arrow-left-bold" />
          </template>
          {{ t('registrationPage.backButton') }}
        </n-button>
        <n-button
          type="primary"
          attr-type="submit"
          size="large"
          class="transform hover:scale-105 transition-all duration-300"
        >
          {{ t('registrationPage.registerButton') }}
        </n-button>
      </div>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { registerSchema } from '~/schemas/register.schema';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import type { SelectOption } from 'naive-ui';

const emit = defineEmits(['back', 'submit']);

// Localization
const { t } = useI18n();

// Stores
const authStore = useAuthStore();
const schoolStore = useSchoolStore();

// Variables
const orgRoles: Ref<SelectOption[] | undefined> = ref();
const schools: Ref<SelectOption[] | undefined> = ref();

// Form Handling
const schema = registerSchema();
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
const [orgId, orgIdProps] = defineField('orgId', naiveUiFormsConfig);
const [orgRole, orgRoleProps] = defineField('orgRole', naiveUiFormsConfig);

// Methods
const onSubmit = handleSubmit((values) => {
  emit('submit', { ...values, accountType: 'organization' });
});

// Lifecycle
onMounted(async () => {
  await authStore.getRoles();
  orgRoles.value = authStore.roles?.map((r) => ({
    label: r.name,
    value: r.id,
  }));
  schools.value = schoolStore.schools?.map((s) => ({
    label: s.name,
    value: s.id,
  }));
});
</script>

<style scoped>
.registration-card {
  background-color: var(--color-background-card) !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.n-card__content) {
  background-color: var(--color-background-card) !important;
}

:deep(.n-form-item-label) {
  color: var(--color-text-primary) !important;
  font-weight: 600;
}

:deep(.n-input) {
  background-color: var(--color-background-secondary) !important;
}

:deep(.n-input__input) {
  color: var(--color-text-primary) !important;
}

:deep(.n-input__placeholder) {
  color: var(--color-text-muted) !important;
}

:deep(.n-divider__title) {
  color: var(--color-text-primary) !important;
  font-weight: 600;
}

:deep(.n-button--primary-type) {
  background-color: var(--color-primary) !important;
}

:deep(.n-button--primary-type:hover) {
  background-color: var(--color-primary-hover) !important;
}

:deep(.back-btn) {
  color: var(--color-text-secondary) !important;
}

:deep(.back-btn:hover) {
  color: var(--color-primary) !important;
}

:deep(.n-select-menu) {
  background-color: var(--color-background-card) !important;
  border: 1px solid var(--color-border) !important;
}

:deep(.n-base-selection) {
  background-color: var(--color-background-secondary) !important;
  border-color: var(--color-border) !important;
}

:deep(.n-base-selection:hover) {
  border-color: var(--color-primary) !important;
}

:deep(.n-base-selection-input__content) {
  color: var(--color-text-primary) !important;
}

:deep(.n-base-selection-placeholder) {
  color: var(--color-text-muted) !important;
}

:deep(.n-base-selection-tags) {
  background-color: var(--color-background-secondary) !important;
}
</style>
