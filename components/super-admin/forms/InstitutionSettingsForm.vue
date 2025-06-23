<!-- components/superadmin/forms/InstitutionSettingsForm.vue -->
<template>
  <ZodForm
    :schema="settingsSchema"
    :initial-values="initialValues"
    :loading="submitting"
    submit-text="Save Settings"
    @submit="handleSubmit"
    @cancel="$emit('cancel')"
  >
    <template #default="">
      <div class="flex flex-col gap-4">
        <FormField name="integrationStatus" label="Integration Status" required>
          <template #default="{ field }">
            <n-select
              v-model:value="field.value"
              :options="integrationStatusOptions"
              placeholder="Select Status"
            />
          </template>
        </FormField>

        <FormField name="accreditations" label="Accreditations">
          <template #default="{ field }">
            <n-select
              v-model:value="field.value"
              :options="accreditationOptions"
              multiple
              placeholder="Select Accreditations"
            />
          </template>
        </FormField>

        <FormField
          v-if="isStatusChangedToInactive"
          name="suspensionReason"
          label="Suspension Reason"
          required
        >
          <template #default="{ field }">
            <n-input
              v-bind="field"
              type="textarea"
              placeholder="Reason for suspension"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </template>
        </FormField>

        <n-alert v-if="isStatusChangedToInactive" type="warning">
          <template #icon>
            <Icon name="ph:warning-circle" />
          </template>
          Changing status to Inactive will suspend all users' access to this
          institution.
        </n-alert>
      </div>
    </template>
  </ZodForm>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { NInput, NSelect, NAlert } from 'naive-ui';
import ZodForm from '~/components/generic/ZodForm.vue';
import FormField from '~/components/generic/FormField.vue';
import { IntegrationStatus } from '~/enums/integration-status.enum';
import { AccreditationType } from '~/enums/accreditation-type.enum';
import { useSuperAdminStore } from '~/stores/super-admin';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';

const props = defineProps<{
  institution: InstitutionResponseDto | null;
}>();

const emit = defineEmits(['submit', 'cancel']);
const { t } = useI18n();
const superAdminStore = useSuperAdminStore();
const submitting = ref(false);
const selectedStatus = ref(
  props.institution?.integrationStatus || IntegrationStatus.Active
);

// Watch for changes in the selected status
watch(
  () => props.institution?.integrationStatus,
  (newValue) => {
    if (newValue) {
      selectedStatus.value = newValue;
    }
  }
);

// Create settings schema
const useSettingsSchema = () => {
  const { t } = useI18n();

  const baseSchema = z.object({
    integrationStatus: z.nativeEnum(IntegrationStatus, {
      required_error: t('validation.settings.integrationStatus.required'),
    }),
    accreditations: z.array(z.nativeEnum(AccreditationType)).optional(),
  });

  // If status is being changed to Inactive, require a suspension reason
  if (
    props.institution?.integrationStatus !== IntegrationStatus.Inactive &&
    selectedStatus.value === IntegrationStatus.Inactive
  ) {
    return baseSchema.extend({
      suspensionReason: z
        .string({
          required_error: t('validation.settings.suspensionReason.required'),
        })
        .min(10, {
          message: t('validation.settings.suspensionReason.tooShort'),
        }),
    });
  }

  return baseSchema;
};

const settingsSchema = computed(() => useSettingsSchema());

// Check if status is being changed to Inactive
const isStatusChangedToInactive = computed(() => {
  return (
    props.institution?.integrationStatus !== IntegrationStatus.Inactive &&
    selectedStatus.value === IntegrationStatus.Inactive
  );
});

// Form initial values based on the provided institution
const initialValues = computed(() => {
  if (!props.institution) {
    return {
      integrationStatus: IntegrationStatus.Active,
      accreditations: [],
      suspensionReason: '',
    };
  }

  return {
    integrationStatus:
      props.institution.integrationStatus || IntegrationStatus.Active,
    accreditations: props.institution.accreditationTypes || [],
    suspensionReason: '',
  };
});

// Options for select fields
const integrationStatusOptions = Object.values(IntegrationStatus).map(
  (value) => ({
    label: value.replace(/([A-Z])/g, ' $1').trim(), // Add spaces between camelCase
    value,
  })
);

const accreditationOptions = Object.values(AccreditationType).map((value) => ({
  label: value,
  value,
}));

const handleSubmit = async (values: {
  integrationStatus: IntegrationStatus;
  suspensionReason: string;
  accreditations: any;
}) => {
  if (!props.institution?.id) return false;

  try {
    submitting.value = true;

    // If changing to inactive status, use the suspend method with reason
    if (
      values.integrationStatus === IntegrationStatus.Inactive &&
      props.institution.integrationStatus !== IntegrationStatus.Inactive
    ) {
      await superAdminStore.suspendInstitution(
        props.institution.id,
        values.suspensionReason
      );
    } else {
      // Otherwise, update settings normally
      await superAdminStore.updateInstitution(props.institution.id, {
        integrationStatus: values.integrationStatus,
        accreditations: values.accreditations,
      });
    }

    emit('submit', values);
    return true;
  } catch (error) {
    console.error('Error updating institution settings:', error);
    return false;
  } finally {
    submitting.value = false;
  }
};

// Update selectedStatus when it changes in the form
watch(
  () => initialValues.value.integrationStatus,
  (newVal) => {
    if (newVal) {
      selectedStatus.value = newVal;
    }
  }
);
</script>
