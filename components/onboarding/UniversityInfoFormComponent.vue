<template>
  <n-form
    class="bg-background-card p-8 rounded-xl feature-card backdrop-blur-sm"
    @submit.prevent="onSubmit"
  >
    <!-- Main grid container with equal columns -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
      <!-- Left Column -->
      <div class="space-y-8">
        <!-- Basic Information Section -->
        <div v-memo="[translations.basicInfo]">
          <h2
            class="text-xl font-semibold text-gradient-heading mb-6 pb-2 border-b border-border/50"
          >
            {{ translations.basicInfo }}
          </h2>

          <!-- Logo Upload -->
          <div class="mb-6">
            <n-form-item :label="translations.logo.label">
              <n-upload
                ref="logoUploadRef"
                :default-file-list="logoFile"
                list-type="image-card"
                accept="image/*"
                :max="1"
                :multiple="false"
                @update:file-list="handleLogoUpdate"
              >
                <div
                  class="flex flex-col items-center justify-center upload-text p-4"
                >
                  <Icon name="ph:image-square-bold" class="text-2xl mb-2" />
                  <span>{{ translations.logo.uploadText }}</span>
                </div>
              </n-upload>
            </n-form-item>
          </div>

          <!-- Basic Info Fields -->
          <div v-memo="[name, motto, description]" class="space-y-6">
            <n-form-item :label="translations.name.label" v-bind="nameProps">
              <n-input
                v-model:value="name"
                :placeholder="translations.name.placeholder"
              />
            </n-form-item>

            <n-form-item :label="translations.motto.label" v-bind="mottoProps">
              <n-input
                v-model:value="motto"
                :placeholder="translations.motto.placeholder"
              />
            </n-form-item>

            <n-form-item
              :label="translations.description.label"
              v-bind="descriptionProps"
            >
              <n-input
                v-model:value="description"
                type="textarea"
                :rows="4"
                :placeholder="translations.description.placeholder"
              />
            </n-form-item>
          </div>
        </div>

        <!-- Academic Information Section -->
        <div v-memo="[translations.academic]">
          <h2
            class="text-xl font-semibold text-gradient-heading mb-6 pb-2 border-b border-border/50"
          >
            {{ translations.academic }}
          </h2>

          <div
            v-memo="[
              undergraduateCount,
              graduateCount,
              acceptanceRate,
              researchFunding,
              hasStudentHousing,
            ]"
            class="space-y-6"
          >
            <n-form-item
              :label="translations.undergraduateCount.label"
              v-bind="undergraduateCountProps"
            >
              <n-input-number
                v-model:value="undergraduateCount"
                :min="0"
                :max="100000"
                :placeholder="translations.undergraduateCount.placeholder"
              />
            </n-form-item>

            <n-form-item
              :label="translations.graduateCount.label"
              v-bind="graduateCountProps"
            >
              <n-input-number
                v-model:value="graduateCount"
                :min="0"
                :max="50000"
                :placeholder="translations.graduateCount.placeholder"
              />
            </n-form-item>

            <n-form-item
              :label="translations.acceptanceRate.label"
              v-bind="acceptanceRateProps"
            >
              <n-input-number
                v-model:value="acceptanceRate"
                :min="0"
                :max="100"
                :precision="2"
                :placeholder="translations.acceptanceRate.placeholder"
              />
            </n-form-item>

            <n-form-item
              :label="translations.researchFunding.label"
              v-bind="researchFundingProps"
            >
              <n-input-number
                v-model:value="researchFunding"
                :min="0"
                :placeholder="translations.researchFunding.placeholder"
              />
            </n-form-item>

            <div class="switch-container">
              <n-form-item
                :label="translations.hasStudentHousing.label"
                v-bind="hasStudentHousingProps"
              >
                <n-switch v-model:value="hasStudentHousing" />
              </n-form-item>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-8">
        <!-- Contact Information Section -->
        <div v-memo="[translations.contact]">
          <h2
            class="text-xl font-semibold text-gradient-heading mb-6 pb-2 border-b border-border/50"
          >
            {{ translations.contact }}
          </h2>

          <div
            v-memo="[email, phone, website, establishedDate]"
            class="space-y-6"
          >
            <n-form-item :label="translations.email.label" v-bind="emailProps">
              <n-input
                v-model:value="email"
                :placeholder="translations.email.placeholder"
              />
            </n-form-item>

            <n-form-item :label="translations.phone.label" v-bind="phoneProps">
              <n-input
                v-model:value="phone"
                :placeholder="translations.phone.placeholder"
              />
            </n-form-item>

            <n-form-item
              :label="translations.website.label"
              v-bind="websiteProps"
            >
              <n-input
                v-model:value="website"
                :placeholder="translations.website.placeholder"
              />
            </n-form-item>

            <n-form-item
              :label="translations.established.label"
              v-bind="establishedDateProps"
            >
              <n-date-picker
                v-model:value="establishedDate"
                type="date"
                class="w-full"
              />
            </n-form-item>
          </div>
        </div>

        <!-- Specialization Section -->
        <div v-memo="[translations.specialization]">
          <h2
            class="text-xl font-semibold text-gradient-heading mb-6 pb-2 border-b border-border/50"
          >
            {{ translations.specialization }}
          </h2>

          <div
            v-memo="[focusAreas, type, departments, accreditations]"
            class="space-y-6"
          >
            <n-form-item
              :label="translations.focusAreas.label"
              v-bind="focusAreasProps"
            >
              <n-select
                v-model:value="focusAreas"
                multiple
                :options="focusAreaOptions"
                :placeholder="translations.focusAreas.placeholder"
              />
            </n-form-item>

            <n-form-item
              :label="translations.institutionType.label"
              v-bind="typeProps"
            >
              <n-select
                v-model:value="type"
                :options="universityTypeOptions"
                :placeholder="translations.institutionType.placeholder"
              />
            </n-form-item>

            <n-form-item
              :label="translations.departments.label"
              v-bind="departmentsProps"
            >
              <n-select
                v-model:value="departments"
                multiple
                filterable
                tag
                :placeholder="translations.departments.placeholder"
              />
            </n-form-item>

            <n-form-item
              :label="translations.accreditations.label"
              v-bind="accreditationsProps"
            >
              <n-select
                v-model:value="accreditations"
                multiple
                :options="accreditationOptions"
                :placeholder="translations.accreditations.placeholder"
              />
            </n-form-item>
          </div>
        </div>

        <!-- Media Section -->
        <div v-memo="[translations.media]">
          <h2
            class="text-xl font-semibold text-gradient-heading mb-6 pb-2 border-b border-border/50"
          >
            {{ translations.media }}
          </h2>

          <n-form-item :label="translations.images.label">
            <n-upload
              ref="uploadRef"
              :max="5"
              :default-file-list="fileList"
              list-type="image-card"
              accept="image/*"
              @update:file-list="handleFileListUpdate"
            >
              <div
                class="flex flex-col items-center justify-center upload-text p-4"
              >
                <Icon name="ph:upload-simple-bold" class="text-2xl mb-2" />
                <span>{{ translations.images.uploadText }}</span>
              </div>
            </n-upload>
          </n-form-item>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end mt-8 pt-6 border-t border-border/50">
      <n-button
        type="primary"
        attr-type="submit"
        class="text-lg px-8"
        :loading="isSubmitting"
      >
        {{ translations.submit }}
        <template #icon>
          <Icon name="ph:arrow-right-bold" />
        </template>
      </n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, readonly } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import { FocusArea } from '~/enums/focus-area.enum';
import { AccreditationType } from '~/enums/accreditation-type.enum';
import { useUniversityFormSchema } from '~/schemas/init-university.schema';
import { InstitutionType } from '~/enums/institution-type.enum';
import { ApplicationStatus } from '~/enums/application-status.enum';
import { camelCase } from 'lodash';

const { t } = useI18n();
const message = useMessage();
const onboardingStore = useOnboardingStore();
const isSubmitting = ref(false);

// Optimize translations by memoizing them
const translations = computed(() => {
  return readonly({
    basicInfo: t('onboarding.universityForm.sections.basicInfo'),
    academic: t('onboarding.universityForm.sections.academic'),
    contact: t('onboarding.universityForm.sections.contact'),
    specialization: t('onboarding.universityForm.sections.specialization'),
    media: t('onboarding.universityForm.sections.media'),
    submit: t('onboarding.universityForm.submit'),
    logo: {
      label: t('onboarding.universityForm.fields.logo.label'),
      uploadText: t('onboarding.universityForm.fields.logo.uploadText'),
    },
    name: {
      label: t('onboarding.universityForm.fields.name.label'),
      placeholder: t('onboarding.universityForm.fields.name.placeholder'),
    },
    motto: {
      label: t('onboarding.universityForm.fields.motto.label'),
      placeholder: t('onboarding.universityForm.fields.motto.placeholder'),
    },
    description: {
      label: t('onboarding.universityForm.fields.description.label'),
      placeholder: t(
        'onboarding.universityForm.fields.description.placeholder'
      ),
    },
    undergraduateCount: {
      label: t('onboarding.universityForm.fields.undergraduateCount.label'),
      placeholder: t(
        'onboarding.universityForm.fields.undergraduateCount.placeholder'
      ),
    },
    graduateCount: {
      label: t('onboarding.universityForm.fields.graduateCount.label'),
      placeholder: t(
        'onboarding.universityForm.fields.graduateCount.placeholder'
      ),
    },
    acceptanceRate: {
      label: t('onboarding.universityForm.fields.acceptanceRate.label'),
      placeholder: t(
        'onboarding.universityForm.fields.acceptanceRate.placeholder'
      ),
    },
    researchFunding: {
      label: t('onboarding.universityForm.fields.researchFunding.label'),
      placeholder: t(
        'onboarding.universityForm.fields.researchFunding.placeholder'
      ),
    },
    hasStudentHousing: {
      label: t('onboarding.universityForm.fields.hasStudentHousing.label'),
    },
    email: {
      label: t('onboarding.universityForm.fields.email.label'),
      placeholder: t('onboarding.universityForm.fields.email.placeholder'),
    },
    phone: {
      label: t('onboarding.universityForm.fields.phone.label'),
      placeholder: t('onboarding.universityForm.fields.phone.placeholder'),
    },
    website: {
      label: t('onboarding.universityForm.fields.website.label'),
      placeholder: t('onboarding.universityForm.fields.website.placeholder'),
    },
    established: {
      label: t('onboarding.universityForm.fields.established.label'),
    },
    focusAreas: {
      label: t('onboarding.universityForm.fields.focusAreas.label'),
      placeholder: t('onboarding.universityForm.fields.focusAreas.placeholder'),
    },
    institutionType: {
      label: t('onboarding.universityForm.fields.institutionType.label'),
      placeholder: t(
        'onboarding.universityForm.fields.institutionType.placeholder'
      ),
    },
    departments: {
      label: t('onboarding.universityForm.fields.departments.label'),
      placeholder: t(
        'onboarding.universityForm.fields.departments.placeholder'
      ),
    },
    accreditations: {
      label: t('onboarding.universityForm.fields.accreditations.label'),
      placeholder: t(
        'onboarding.universityForm.fields.accreditations.placeholder'
      ),
    },
    images: {
      label: t('onboarding.universityForm.fields.images.label'),
      uploadText: t('onboarding.universityForm.fields.images.uploadText'),
    },
  });
});

// File handling - use shallowRef for better performance
const uploadRef = ref();
const logoUploadRef = ref(null);
const logoFile = shallowRef<UploadFileInfo[]>([]);
const fileList = shallowRef<UploadFileInfo[]>([]);
const uploadedFiles = shallowRef<File[]>([]);

// Form setup with debounced validation
const schema = useUniversityFormSchema();
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

// Basic Information Fields
const [name, nameProps] = defineField('name', naiveUiFormsConfig);
const [motto, mottoProps] = defineField('motto', naiveUiFormsConfig);
const [description, descriptionProps] = defineField(
  'description',
  naiveUiFormsConfig
);

// Contact Information Fields
const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [phone, phoneProps] = defineField('phone', naiveUiFormsConfig);
const [website, websiteProps] = defineField('website', naiveUiFormsConfig);
const [establishedDate, establishedDateProps] = defineField(
  'establishedDate',
  naiveUiFormsConfig
);

// Academic Information Fields
const [undergraduateCount, undergraduateCountProps] = defineField(
  'undergraduateCount',
  naiveUiFormsConfig
);
const [graduateCount, graduateCountProps] = defineField(
  'graduateCount',
  naiveUiFormsConfig
);
const [acceptanceRate, acceptanceRateProps] = defineField(
  'acceptanceRate',
  naiveUiFormsConfig
);
const [researchFunding, researchFundingProps] = defineField(
  'researchFunding',
  naiveUiFormsConfig
);
const [hasStudentHousing, hasStudentHousingProps] = defineField(
  'hasStudentHousing',
  naiveUiFormsConfig
);
const [type, typeProps] = defineField('type', naiveUiFormsConfig);

// Specialization Fields
const [focusAreas, focusAreasProps] = defineField(
  'focusAreas',
  naiveUiFormsConfig
);
const [departments, departmentsProps] = defineField(
  'departments',
  naiveUiFormsConfig
);
const [accreditations, accreditationsProps] = defineField(
  'accreditations',
  naiveUiFormsConfig
);

// Memoized options to prevent unnecessary recalculations
const universityTypeOptions = computed(() => {
  const universityTypes = onboardingStore.availableInstitutionTypes;
  if (!universityTypes?.length) return [];

  return universityTypes.map((type) => ({
    label: t(
      `onboarding.initialForm.fields.institutionType.options.${camelCase(InstitutionType[type])}`
    ),
    value: type,
  }));
});

// Static options (these don't change)
const focusAreaOptions = readonly([
  {
    label: t('onboarding.universityForm.focusAreas.liberalArts'),
    value: FocusArea.LiberalArts,
  },
  {
    label: t('onboarding.universityForm.focusAreas.stem'),
    value: FocusArea.STEM,
  },
  {
    label: t('onboarding.universityForm.focusAreas.business'),
    value: FocusArea.Business,
  },
  {
    label: t('onboarding.universityForm.focusAreas.medical'),
    value: FocusArea.Medical,
  },
  {
    label: t('onboarding.universityForm.focusAreas.law'),
    value: FocusArea.Law,
  },
  {
    label: t('onboarding.universityForm.focusAreas.arts'),
    value: FocusArea.Arts,
  },
  {
    label: t('onboarding.universityForm.focusAreas.technical'),
    value: FocusArea.Technical,
  },
  {
    label: t('onboarding.universityForm.focusAreas.research'),
    value: FocusArea.Research,
  },
]);

const accreditationOptions = readonly([
  {
    label: t('onboarding.universityForm.accreditations.international'),
    value: AccreditationType.International,
  },
  {
    label: t('onboarding.universityForm.accreditations.national'),
    value: AccreditationType.National,
  },
  {
    label: t('onboarding.universityForm.accreditations.programmatic'),
    value: AccreditationType.Programmatic,
  },
  {
    label: t('onboarding.universityForm.accreditations.regional'),
    value: AccreditationType.Regional,
  },
]);

// file handling methods
const handleFileListUpdate = (newFileList: UploadFileInfo[]) => {
  fileList.value = newFileList;
  uploadedFiles.value = newFileList
    .filter((file) => file.file instanceof File)
    .map((file) => file.file as File);
};

const handleLogoUpdate = (files: UploadFileInfo[]) => {
  logoFile.value = files;
};

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  try {
    isSubmitting.value = true;

    // Get the logo file if it exists
    const logoFileData = logoFile.value
      .filter((file) => file.file instanceof File)
      .map((file) => file.file as File)[0];

    const universityData = {
      id: onboardingStore.applicationData?.institution.id || '',
      name: values.name,
      motto: values.motto,
      description: values.description,
      email: values.email,
      phone: values.phone,
      website: values.website,
      type: values.type,
      establishedDate: new Date(values.establishedDate),
      undergraduateCount: values.undergraduateCount,
      graduateCount: values.graduateCount,
      acceptanceRate: values.acceptanceRate,
      researchFunding: values.researchFunding,
      hasStudentHousing: values.hasStudentHousing,
      focusAreas: values.focusAreas,
      departments: values.departments,
      accreditations: values.accreditations,
    };

    const allFiles = logoFileData
      ? [logoFileData, ...uploadedFiles.value]
      : uploadedFiles.value;

    await onboardingStore.initInstitution(universityData, allFiles);
    message.success(translations.value.submit);
    onboardingStore.currentStep = ApplicationStatus.Verified;
  } catch {
    message.error(t('onboarding.universityForm.error'));
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<style scoped>
/* Card styling */
.feature-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(var(--color-border-rgb, 75, 85, 99), 0.5);
  transition: all 0.3s ease;
}

/* Section heading gradient */
.text-gradient-heading {
  background-image: linear-gradient(
    to right,
    var(--color-primary, #4ade80),
    var(--color-primary, #4ade80)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

/* Upload area text */
.upload-text {
  color: var(--color-text-secondary, rgb(156, 163, 175));
}

/* Base form styles */
:deep(.n-form-item) {
  width: 100% !important;
  margin-bottom: 0 !important;
}

/* Input styles */
:deep(.n-input),
:deep(.n-input-number),
:deep(.n-input-number-input) {
  background-color: var(--color-background-input, #1f1f23) !important;
  border-color: rgba(var(--color-border-rgb, 75, 85, 99), 0.5) !important;
  width: 100% !important;
  border-radius: 0.5rem !important;
}

/* Input states */
:deep(.n-input:hover),
:deep(.n-input:focus),
:deep(.n-input-number:hover),
:deep(.n-input-number:focus) {
  border-color: var(--color-primary, #4ade80) !important;
}

/* Select and date picker styles */
:deep(.n-base-selection),
:deep(.n-date-picker) {
  width: 100% !important;
  background-color: var(--color-background-input, #1f1f23) !important;
  border-radius: 0.5rem !important;
}

/* Form labels */
:deep(.n-form-item .n-form-item-label) {
  font-size: 0.875rem !important;
  margin-bottom: 0.5rem !important;
  color: var(--color-text-secondary, rgb(156, 163, 175)) !important;
}

/* Switch styles */
:deep(.n-switch) {
  background-color: rgba(var(--color-border-rgb, 75, 85, 99), 0.5) !important;
  border-radius: 9999px !important;
}

:deep(.n-switch--active) {
  background-color: var(--color-primary, #4ade80) !important;
}

:deep(.n-switch__rail) {
  border-radius: 9999px !important;
}

:deep(.n-switch__button) {
  border-radius: 9999px !important;
}

/* Switch container */
.switch-container :deep(.n-form-item-blank) {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}

/* Upload area styles */
:deep(.n-upload) {
  background-color: var(--color-background-input, #1f1f23) !important;
  border: 1px dashed rgba(var(--color-border-rgb, 75, 85, 99), 0.5) !important;
  border-radius: 0.5rem !important;
  transition: border-color 0.3s;
}

:deep(.n-upload:hover) {
  border-color: var(--color-primary, #4ade80) !important;
}

/* Number input suffix */
:deep(.n-input-number .n-input-number-suffix) {
  color: var(--color-text-secondary, rgb(156, 163, 175)) !important;
}
</style>
