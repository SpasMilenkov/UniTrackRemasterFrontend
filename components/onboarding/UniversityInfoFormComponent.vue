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
        <div>
          <h2
            class="text-xl font-semibold text-gradient-heading mb-6 pb-2 border-b border-border/50"
          >
            {{ t('onboarding.universityForm.sections.basicInfo') }}
          </h2>

          <!-- Logo Upload -->
          <div class="mb-6">
            <n-form-item
              :label="t('onboarding.universityForm.fields.logo.label')"
            >
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
                  <span>{{
                    t('onboarding.universityForm.fields.logo.uploadText')
                  }}</span>
                </div>
              </n-upload>
            </n-form-item>
          </div>

          <!-- Basic Info Fields -->
          <div class="space-y-6">
            <n-form-item
              :label="t('onboarding.universityForm.fields.name.label')"
              v-bind="nameProps"
            >
              <n-input
                v-model:value="name"
                :placeholder="
                  t('onboarding.universityForm.fields.name.placeholder')
                "
              />
            </n-form-item>

            <n-form-item
              :label="t('onboarding.universityForm.fields.motto.label')"
              v-bind="mottoProps"
            >
              <n-input
                v-model:value="motto"
                :placeholder="
                  t('onboarding.universityForm.fields.motto.placeholder')
                "
              />
            </n-form-item>

            <n-form-item
              :label="t('onboarding.universityForm.fields.description.label')"
              v-bind="descriptionProps"
            >
              <n-input
                v-model:value="description"
                type="textarea"
                :rows="4"
                :placeholder="
                  t('onboarding.universityForm.fields.description.placeholder')
                "
              />
            </n-form-item>
          </div>
        </div>

        <!-- Academic Information Section -->
        <div>
          <h2
            class="text-xl font-semibold text-gradient-heading mb-6 pb-2 border-b border-border/50"
          >
            {{ t('onboarding.universityForm.sections.academic') }}
          </h2>

          <div class="space-y-6">
            <n-form-item
              :label="
                t('onboarding.universityForm.fields.undergraduateCount.label')
              "
              v-bind="undergraduateCountProps"
            >
              <n-input-number
                v-model:value="undergraduateCount"
                :min="0"
                :max="100000"
                :placeholder="
                  t(
                    'onboarding.universityForm.fields.undergraduateCount.placeholder'
                  )
                "
              />
            </n-form-item>

            <n-form-item
              :label="t('onboarding.universityForm.fields.graduateCount.label')"
              v-bind="graduateCountProps"
            >
              <n-input-number
                v-model:value="graduateCount"
                :min="0"
                :max="50000"
                :placeholder="
                  t(
                    'onboarding.universityForm.fields.graduateCount.placeholder'
                  )
                "
              />
            </n-form-item>

            <n-form-item
              :label="
                t('onboarding.universityForm.fields.acceptanceRate.label')
              "
              v-bind="acceptanceRateProps"
            >
              <n-input-number
                v-model:value="acceptanceRate"
                :min="0"
                :max="100"
                :precision="2"
                :placeholder="
                  t(
                    'onboarding.universityForm.fields.acceptanceRate.placeholder'
                  )
                "
              />
            </n-form-item>

            <n-form-item
              :label="
                t('onboarding.universityForm.fields.researchFunding.label')
              "
              v-bind="researchFundingProps"
            >
              <n-input-number
                v-model:value="researchFunding"
                :min="0"
                :placeholder="
                  t(
                    'onboarding.universityForm.fields.researchFunding.placeholder'
                  )
                "
              />
            </n-form-item>

            <div class="switch-container">
              <n-form-item
                :label="
                  t('onboarding.universityForm.fields.hasStudentHousing.label')
                "
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
        <div>
          <h2
            class="text-xl font-semibold text-gradient-heading mb-6 pb-2 border-b border-border/50"
          >
            {{ t('onboarding.universityForm.sections.contact') }}
          </h2>

          <div class="space-y-6">
            <n-form-item
              :label="t('onboarding.universityForm.fields.email.label')"
              v-bind="emailProps"
            >
              <n-input
                v-model:value="email"
                :placeholder="
                  t('onboarding.universityForm.fields.email.placeholder')
                "
              />
            </n-form-item>

            <n-form-item
              :label="t('onboarding.universityForm.fields.phone.label')"
              v-bind="phoneProps"
            >
              <n-input
                v-model:value="phone"
                :placeholder="
                  t('onboarding.universityForm.fields.phone.placeholder')
                "
              />
            </n-form-item>

            <n-form-item
              :label="t('onboarding.universityForm.fields.website.label')"
              v-bind="websiteProps"
            >
              <n-input
                v-model:value="website"
                :placeholder="
                  t('onboarding.universityForm.fields.website.placeholder')
                "
              />
            </n-form-item>

            <n-form-item
              :label="t('onboarding.universityForm.fields.established.label')"
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
        <div>
          <h2
            class="text-xl font-semibold text-gradient-heading mb-6 pb-2 border-b border-border/50"
          >
            {{ t('onboarding.universityForm.sections.specialization') }}
          </h2>

          <div class="space-y-6">
            <n-form-item
              :label="t('onboarding.universityForm.fields.focusAreas.label')"
              v-bind="focusAreasProps"
            >
              <n-select
                v-model:value="focusAreas"
                multiple
                :options="focusAreaOptions"
                :placeholder="
                  t('onboarding.universityForm.fields.focusAreas.placeholder')
                "
              />
            </n-form-item>
            <n-form-item
              :label="
                t('onboarding.universityForm.fields.institutionType.label')
              "
              v-bind="typeProps"
            >
              <n-select
                v-model:value="type"
                :options="universityTypeOptions"
                :placeholder="
                  t(
                    'onboarding.universityForm.fields.institutionType.placeholder'
                  )
                "
              />
            </n-form-item>
            <n-form-item
              :label="t('onboarding.universityForm.fields.departments.label')"
              v-bind="departmentsProps"
            >
              <n-select
                v-model:value="departments"
                multiple
                filterable
                tag
                :placeholder="
                  t('onboarding.universityForm.fields.departments.placeholder')
                "
              />
            </n-form-item>

            <n-form-item
              :label="
                t('onboarding.universityForm.fields.accreditations.label')
              "
              v-bind="accreditationsProps"
            >
              <n-select
                v-model:value="accreditations"
                multiple
                :options="accreditationOptions"
                :placeholder="
                  t(
                    'onboarding.universityForm.fields.accreditations.placeholder'
                  )
                "
              />
            </n-form-item>
          </div>
        </div>

        <!-- Media Section -->
        <div>
          <h2
            class="text-xl font-semibold text-gradient-heading mb-6 pb-2 border-b border-border/50"
          >
            {{ t('onboarding.universityForm.sections.media') }}
          </h2>

          <n-form-item
            :label="t('onboarding.universityForm.fields.images.label')"
          >
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
                <span>{{
                  t('onboarding.universityForm.fields.images.uploadText')
                }}</span>
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
        {{ t('onboarding.universityForm.submit') }}
        <template #icon>
          <Icon name="ph:arrow-right-bold" />
        </template>
      </n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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

// File handling
const uploadRef = ref();
const logoUploadRef = ref(null);
const logoFile = ref<UploadFileInfo[]>([]);
const fileList = ref<UploadFileInfo[]>([]);
const uploadedFiles = ref<File[]>([]);
// Form setup
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

// For the university form
const universityTypeOptions = computed(() => {
  const universityTypes = [
    InstitutionType.PublicSchool,
    InstitutionType.PrivateUniversity,
    InstitutionType.CommunityCollege,
    InstitutionType.TechnicalCollege,
    InstitutionType.LiberalArtsCollege,
  ];

  return universityTypes.map((type) => ({
    label: t(
      `onboarding.initialForm.fields.institutionType.options.${camelCase(InstitutionType[type])}`
    ),
    value: type,
  }));
});

// Focus Area options
const focusAreaOptions = [
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
];

// Accreditation options
const accreditationOptions = [
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
];

// File handling method
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
    message.success(t('onboarding.universityForm.success'));
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
