<template>
  <div class="p-8 bg-[url('/img/blue-blobs.svg')] bg-no-repeat bg-cover">
    <n-card size="large" class="max-w-xl mx-auto p-4 flex">
      <h1 class="md:px-0 text-center text-3xl">
        {{ t('registrationPage.title') }}
      </h1>
      <n-form @submit.prevent="onSubmit">
        <!-- Personal Information Section -->
        <n-divider>{{ t('registrationPage.personalInfo') }}</n-divider>
        <n-space vertical>
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
        <n-space vertical>
          <n-form-item
            :label="t('registrationPage.emailLabel')"
            v-bind="emailProps"
            path="email"
          >
            <n-input
              v-model:value="email"
              :placeholder="t('registrationPage.emailPlaceholder')"
              :label="t('registrationPage.emailPlaceholder')"
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

        <!-- Password Section -->
        <n-divider>{{ t('registrationPage.passwordLabel') }}</n-divider>
        <n-space vertical>
          <n-form-item
            :label="t('registrationPage.passwordLabel')"
            v-bind="passwordProps"
            path="password"
          >
            <n-input
              v-model:value="password"
              type="password"
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
              type="password"
            />
          </n-form-item>
        </n-space>

        <!-- Organization Information Section -->
        <n-divider>{{ t('registrationPage.orgInfo') }}</n-divider>
        <n-space vertical>
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

        <!-- Submit Button -->
        <n-space justify="center">
          <n-button type="primary" attr-type="submit" size="large">{{
            t('registrationPage.registerButton')
          }}</n-button>
        </n-space>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import {
  NButton,
  NForm,
  NInput,
  NSelect,
  NDivider,
  NSpace,
  NCard,
  NFormItem,
  type SelectOption,
} from 'naive-ui';
import { naiveUiFormsConfig } from '~/utils/naive-ui-forms.config';
import { registerSchema } from '~/schemas/register.schema';

// Localization
const { t } = useI18n();
// Store
const authStore = useAuthStore();
const schoolStore = useSchoolStore();
// Variables
const orgRoles: Ref<SelectOption[] | undefined> = ref();
const schools: Ref<SelectOption[] | undefined> = ref();

// Form Handling
const schema = registerSchema();

const { handleSubmit, defineField, setFieldValue } = useForm({
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
//Placeholder because the backend currently accepts schools only
setFieldValue('orgType', 0);
// const [orgType, orgTypeProps] = defineField('orgType', naiveUiFormsConfig);
//Methods
const onSubmit = handleSubmit((values) => {
  console.log(values);
  authStore.register(values);
});

// Lifecycle
onMounted(async () => {
  await authStore.getRoles();
  await schoolStore.getSchools();
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
