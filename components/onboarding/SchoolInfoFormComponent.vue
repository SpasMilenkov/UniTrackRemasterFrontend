<template>
  <div class="min-h-screen bg-background text-text-primary">
    <!-- Floating Particles Background -->
    <div class="fixed inset-0 overflow-hidden z-0">
      <div
        v-for="n in 20"
        :key="n"
        class="absolute w-1 h-1 bg-primary opacity-20 rounded-full animate-float"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          '--tx': Math.random() * 200 - 100 + 'px',
          '--ty': Math.random() * 200 - 100 + 'px',
          '--scale': 0.5 + Math.random() * 1,
          animationDelay: Math.random() * 10 + 's',
          animationDuration: 10 + Math.random() * 20 + 's',
        }"
      />
    </div>

    <div class="py-6 relative z-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div
          v-motion
          class="mb-6 text-center"
          :initial="{ opacity: 0, y: -20 }"
          :enter="{ opacity: 1, y: 0 }"
          :delay="200"
        >
          <h1 class="text-3xl font-bold tracking-tight text-gradient">
            {{ t('onboarding.schoolForm.title') }}
          </h1>
        </div>

        <!-- Main Form Content -->
        <div
          v-motion
          class="feature-card backdrop-blur-sm rounded-xl p-6"
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0 }"
          :delay="400"
        >
          <n-form class="space-y-6" @submit.prevent="onSubmit">
            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Left Column: Basic Info -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-semibold section-heading border-primary"
                >
                  {{ t('onboarding.schoolForm.sections.basicInfo') }}
                </h3>

                <!-- Logo Upload -->
                <n-form-item
                  :label="t('onboarding.schoolForm.fields.logo.label')"
                >
                  <n-upload
                    ref="logoUploadRef"
                    :default-file-list="logoFile"
                    list-type="image-card"
                    accept="image/*"
                    :max="1"
                    @update:file-list="handleLogoUpdate"
                  >
                    <div
                      class="flex flex-col items-center justify-center upload-text"
                    >
                      <Icon name="ph:image-square-bold" class="text-2xl mb-2" />
                      <span>{{
                        t('onboarding.schoolForm.fields.logo.uploadText')
                      }}</span>
                    </div>
                  </n-upload>
                </n-form-item>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <n-form-item
                    v-bind="nameProps"
                    :label="t('onboarding.schoolForm.fields.name.label')"
                  >
                    <n-input v-model:value="name" />
                  </n-form-item>

                  <n-form-item
                    v-bind="typeProps"
                    :label="t('onboarding.schoolForm.fields.type.label')"
                  >
                    <n-select
                      v-model:value="type"
                      :options="schoolTypeOptions"
                      :placeholder="
                        t('onboarding.schoolForm.fields.type.placeholder')
                      "
                    />
                  </n-form-item>
                </div>

                <n-form-item
                  v-bind="mottoProps"
                  :label="t('onboarding.schoolForm.fields.motto.label')"
                >
                  <n-input v-model:value="motto" />
                </n-form-item>

                <n-form-item
                  v-bind="websiteProps"
                  :label="t('onboarding.schoolForm.fields.website.label')"
                >
                  <n-input v-model:value="website" />
                </n-form-item>

                <n-form-item
                  v-bind="programsProps"
                  :label="t('onboarding.schoolForm.fields.programs.label')"
                >
                  <n-select v-model:value="programs" multiple filterable tag />
                </n-form-item>
              </div>

              <!-- Right Column: Description and Files -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-semibold section-heading border-secondary"
                >
                  {{ t('onboarding.schoolForm.sections.details') }}
                </h3>

                <n-form-item
                  v-bind="descriptionProps"
                  :label="t('onboarding.schoolForm.fields.description.label')"
                >
                  <n-input
                    v-model:value="description"
                    type="textarea"
                    :rows="4"
                  />
                </n-form-item>

                <n-form-item
                  :label="t('onboarding.schoolForm.fields.pictures.label')"
                >
                  <n-upload
                    ref="uploadRef"
                    :default-file-list="fileList"
                    list-type="image-card"
                    accept="image/*"
                    multiple
                    @update:file-list="handleFileListUpdate"
                  >
                    <div
                      class="flex flex-col items-center justify-center upload-text"
                    >
                      <Icon
                        name="ph:upload-simple-bold"
                        class="text-2xl mb-2"
                      />
                      <span>{{
                        t('onboarding.schoolForm.fields.pictures.uploadText')
                      }}</span>
                    </div>
                  </n-upload>
                </n-form-item>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-4 border-t border-border/50">
              <n-button
                type="primary"
                attr-type="submit"
                :loading="isSubmitting"
                class="min-w-[120px]"
              >
                {{ t('onboarding.schoolForm.submit') }}
              </n-button>
            </div>
          </n-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import * as z from 'zod';
import { InstitutionType } from '~/enums/institution-type.enum';
import { camelCase } from 'lodash';

const { t } = useI18n();
const message = useMessage();
const onboardingStore = useOnboardingStore();

// File handling
const uploadRef = ref();
const logoUploadRef = ref(null);
const logoFile = ref<UploadFileInfo[]>([]);
const fileList = ref<UploadFileInfo[]>([]);
const uploadedFiles = ref<File[]>([]);
const isSubmitting = ref(false);

// Institution type options
const schoolTypeOptions = computed(() => {
  const schoolTypes = [
    InstitutionType.PublicSchool,
    InstitutionType.PrivateSchool,
    InstitutionType.CharterSchool,
    InstitutionType.InternationalSchool,
    InstitutionType.PrimarySchool,
    InstitutionType.SecondarySchool,
    InstitutionType.HighSchool,
    InstitutionType.VocationalSchool,
    InstitutionType.SpecialEducationSchool,
    InstitutionType.LanguageSchool,
  ];

  return schoolTypes.map((type) => ({
    label: t(
      `onboarding.initialForm.fields.institutionType.options.${camelCase(InstitutionType[type])}`
    ),
    value: type,
  }));
});
// Schema
const schema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(500),
  motto: z.string().max(200),
  website: z.string().url(),
  type: z.nativeEnum(InstitutionType),
  programs: z.array(z.string()).min(1),
});

const getInitialValues = () => {
  const institution = onboardingStore.applicationData?.institution;
  return {
    name: institution?.name || '',
    type: institution?.type || InstitutionType.HighSchool,
  };
};

const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: getInitialValues(),
  validateOnMount: false,
});

// Fields setup
const [name, nameProps] = defineField('name', naiveUiFormsConfig);
const [description, descriptionProps] = defineField(
  'description',
  naiveUiFormsConfig
);
const [motto, mottoProps] = defineField('motto', naiveUiFormsConfig);
const [website, websiteProps] = defineField('website', naiveUiFormsConfig);
const [type, typeProps] = defineField('type', naiveUiFormsConfig);
const [programs, programsProps] = defineField('programs', naiveUiFormsConfig);

const handleFileListUpdate = (newFileList: UploadFileInfo[]) => {
  fileList.value = newFileList;
  uploadedFiles.value = newFileList
    .filter((file) => file.file instanceof File)
    .map((file) => file.file as File);
};

const handleLogoUpdate = (files: UploadFileInfo[]) => {
  logoFile.value = files;
};

const onSubmit = handleSubmit(async (values) => {
  try {
    isSubmitting.value = true;

    // getting the logo if it exists
    const logoFileData = logoFile.value
      .filter((file) => file.file instanceof File)
      .map((file) => file.file as File)[0];

    const schoolData = {
      id: onboardingStore.applicationData?.institution.id ?? '',
      name: values.name,
      description: values.description,
      motto: values.motto,
      website: values.website,
      type: values.type,
      programs: values.programs,
    };

    await onboardingStore.initInstitution(
      schoolData,
      uploadedFiles.value,
      logoFileData
    );

    message.success(t('onboarding.schoolForm.success'));
  } catch {
    message.error(
      onboardingStore.error?.toString() || t('onboarding.schoolForm.error')
    );
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<style scoped>
:deep(.n-input),
:deep(.n-select) {
  background-color: var(--color-background-input, #1c1c21);
}

:deep(.n-form-item .n-form-item-label) {
  color: var(--color-text-secondary, rgb(156, 163, 175));
  font-size: 0.875rem;
}

:deep(.n-upload-trigger) {
  background-color: var(--color-background-input, #1c1c21);
  border-color: rgba(var(--color-border-rgb, 55, 65, 81), 0.5);
}

.feature-card {
  position: relative;
  overflow: hidden;
  background-color: var(--color-background-card, rgba(24, 24, 28, 0.8));
  border: 1px solid rgba(var(--color-border-rgb, 74, 85, 104), 0.5);
  transition: all 0.3s ease;
}

.section-heading {
  padding-left: 0.75rem;
  border-left-width: 4px;
  border-left-style: solid;
  color: var(--color-text-primary, rgba(255, 255, 255, 0.9));
}

.border-primary {
  border-left-color: var(--color-primary, #4ade80);
}

.border-secondary {
  border-left-color: var(--color-secondary, #3b82f6);
}

.upload-text {
  color: var(--color-text-secondary, rgb(156, 163, 175));
}

.text-gradient {
  background-image: linear-gradient(
    to right,
    var(--color-primary, #4ade80),
    var(--color-secondary, #3b82f6)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

@keyframes float {
  0% {
    transform: translate(0, 0) scale(var(--scale));
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(var(--scale));
    opacity: 0;
  }
}

.animate-float {
  animation: float var(--duration, 15s) ease-in-out infinite alternate;
}
</style>
