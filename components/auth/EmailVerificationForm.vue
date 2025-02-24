<template>
  <n-form @submit.prevent="handleSubmit">
    <n-space vertical size="large">
      <n-form-item
        :label="t('forgotPassword.emailLabel')"
        path="email"
        label-style="text-gray-300 font-semibold"
        v-bind="emailProps"
      >
        <n-input
          v-model:value="email"
          :placeholder="t('forgotPassword.emailPlaceholder')"
          class="bg-[#303035] text-white placeholder-gray-500"
        >
          <template #prefix>
            <Icon name="ph:envelope" />
          </template>
        </n-input>
      </n-form-item>

      <n-button
        type="primary"
        attr-type="submit"
        size="large"
        class="w-full"
        :color="isLoading ? undefined : '#4ade80'"
        :loading="isLoading"
      >
        {{ t('forgotPassword.continueButton') }}
      </n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { useNotification } from 'naive-ui';

const emit = defineEmits(['success']);
const { t } = useI18n();
const notification = useNotification();
const authStore = useAuthStore();
const isLoading = ref(false);

const schema = z.object({
  email: z.string().email(),
});

const { handleSubmit: formSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

const [email, emailProps] = defineField('email', naiveUiFormsConfig);

const handleSubmit = formSubmit(async (values) => {
  isLoading.value = true;
  try {
    await authStore.forgotPassword(values.email);
    emit('success');
  } catch (error: any) {
    notification.error({
      title: t('errors.emailVerificationFailed'),
      content: error.message || t('errors.defaultError'),
      duration: 5000,
      closable: true,
    });
  } finally {
    isLoading.value = false;
  }
});
</script>
