<!-- components/superadmin/forms/EditInstitutionForm.vue -->
<template>
  <ZodForm
    :schema="institutionSchema"
    :initial-values="initialValues"
    :loading="submitting"
    submit-text="Save Changes"
    @submit="handleSubmit"
    @cancel="$emit('cancel')"
  >
    <template #default="{ errors }">
      <!-- Basic Information Section -->
      <div class="mb-4">
        <h4 class="text-base font-medium mb-2">Basic Information</h4>

        <FormField name="name" label="Institution Name" required>
          <template #default="{ field }">
            <n-input v-bind="field" placeholder="Institution Name" />
          </template>
        </FormField>

        <FormField name="type" label="Institution Type" required>
          <template #default="{ field }">
            <n-select
              v-model:value="field.value"
              :options="typeOptions"
              placeholder="Select Institution Type"
              @update:value="field.handleChange"
              @blur="field.handleBlur"
            />
          </template>
        </FormField>
      </div>

      <!-- Contact Information Section -->
      <div class="mb-4">
        <h4 class="text-base font-medium mb-2">Contact Information</h4>

        <FormField name="email" label="Email" required>
          <template #default="{ field }">
            <n-input v-bind="field" placeholder="Contact Email" />
          </template>
        </FormField>

        <FormField name="phone" label="Phone" required>
          <template #default="{ field }">
            <n-input v-bind="field" placeholder="Contact Phone" />
          </template>
        </FormField>

        <FormField name="website" label="Website">
          <template #default="{ field }">
            <n-input v-bind="field" placeholder="Website URL" />
          </template>
        </FormField>
      </div>

      <!-- Address Section -->
      <div class="mb-4">
        <h4 class="text-base font-medium mb-2">Address</h4>

        <FormField name="address.country" label="Country" required>
          <template #default="{ field }">
            <n-input v-bind="field" placeholder="Country" />
          </template>
        </FormField>

        <FormField name="address.settlement" label="City/Town" required>
          <template #default="{ field }">
            <n-input v-bind="field" placeholder="City/Town" />
          </template>
        </FormField>

        <FormField name="address.street" label="Street Address" required>
          <template #default="{ field }">
            <n-input v-bind="field" placeholder="Street Address" />
          </template>
        </FormField>

        <FormField name="address.postalCode" label="Postal Code" required>
          <template #default="{ field }">
            <n-input v-bind="field" placeholder="Postal Code" />
          </template>
        </FormField>
      </div>

      <!-- Additional Information Section -->
      <div class="mb-4">
        <h4 class="text-base font-medium mb-2">Additional Information</h4>

        <FormField name="description" label="Description">
          <template #default="{ field }">
            <n-input
              v-bind="field"
              type="textarea"
              placeholder="Institution Description"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </template>
        </FormField>

        <FormField name="motto" label="Motto">
          <template #default="{ field }">
            <n-input v-bind="field" placeholder="Institution Motto" />
          </template>
        </FormField>

        <FormField name="establishedDate" label="Established Date" required>
          <template #default="{ field }">
            <n-date-picker
              v-model:value="field.value"
              type="date"
              clearable
              :is-date-disabled="disableFutureDates"
              @update:value="field.handleChange"
            />
          </template>
        </FormField>

        <FormField name="location" label="Location Type">
          <template #default="{ field }">
            <n-select
              v-model:value="field.value"
              :options="locationOptions"
              placeholder="Select Location Type"
              @update:value="field.handleChange"
              @blur="field.handleBlur"
            />
          </template>
        </FormField>
      </div>
    </template>
  </ZodForm>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { NInput, NSelect, NDatePicker } from 'naive-ui';
import ZodForm from '~/components/generic/ZodForm.vue';
import FormField from '~/components/generic/FormField.vue';
import { useInstitutionFormSchema } from '~/schemas/institution.schema';
import { InstitutionType } from '~/enums/institution-type.enum';
import { LocationType } from '~/enums/location-type.enum';
import { useSuperAdminStore } from '~/stores/super-admin';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';

const props = defineProps<{
  institution: InstitutionResponseDto | null;
}>();

const emit = defineEmits(['submit', 'cancel']);
const { t } = useI18n();
const superAdminStore = useSuperAdminStore();
const submitting = ref(false);

// Generate the schema
const institutionSchema = useInstitutionFormSchema();

// Form initial values based on the provided institution
const initialValues = computed(() => {
  if (!props.institution) {
    return {
      name: '',
      type: null,
      email: '',
      phone: '',
      website: '',
      description: '',
      motto: '',
      establishedDate: new Date(),
      location: LocationType.Urban,
      address: {
        country: '',
        settlement: '',
        street: '',
        postalCode: '',
      },
    };
  }

  // Parse the date - if it's a string, convert to Date
  let establishedDate = props.institution.establishedDate;
  if (typeof establishedDate === 'string') {
    establishedDate = new Date(establishedDate);
  }

  return {
    name: props.institution.name || '',
    type: props.institution.type,
    email: props.institution.email || '',
    phone: props.institution.phone || '',
    website: props.institution.website || '',
    description: props.institution.description || '',
    motto: props.institution.motto || '',
    establishedDate,
    location: props.institution.location || LocationType.Urban,
    address: {
      country: props.institution.address?.country || '',
      settlement: props.institution.address?.settlement || '',
      street: props.institution.address?.street || '',
      postalCode: props.institution.address?.postalCode || '',
    },
  };
});

// Options for select fields
const typeOptions = Object.values(InstitutionType).map((value) => ({
  label: value.replace(/([A-Z])/g, ' $1').trim(), // Add spaces between camelCase
  value,
}));

const locationOptions = Object.values(LocationType).map((value) => ({
  label: value,
  value,
}));

// Date picker utility function
const disableFutureDates = (timestamp: number) => {
  return timestamp > Date.now();
};

const handleSubmit = async (values) => {
  if (!props.institution?.id) return false;

  try {
    submitting.value = true;
    await superAdminStore.updateInstitution(props.institution.id, values);
    emit('submit', values);
    return true;
  } catch (error) {
    console.error('Error updating institution:', error);
    return false;
  } finally {
    submitting.value = false;
  }
};
</script>
