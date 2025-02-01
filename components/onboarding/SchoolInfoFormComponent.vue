<template>
  <div class="min-h-screen bg-[#101014] text-white">
    <div class="py-6">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-6 text-center">
          <h1
            class="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
          >
            {{ t('onboarding.schoolForm.title') }}
          </h1>
        </div>

        <!-- Main Form Content -->
        <div
          class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
        >
          <n-form class="space-y-6" @submit.prevent="onSubmit">
            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Left Column: Basic Info -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-semibold text-white/90 border-l-4 border-emerald-400 pl-3 mb-4"
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
                      class="flex flex-col items-center justify-center text-gray-400"
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
                      :options="institutionTypeOptions"
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
                  class="text-lg font-semibold text-white/90 border-l-4 border-blue-500 pl-3 mb-4"
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
                      class="flex flex-col items-center justify-center text-gray-400"
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
            <div class="flex justify-end pt-4 border-t border-gray-700/50">
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

const { t } = useI18n();
const message = useMessage();
const schoolStore = useSchoolStore();
const onboardingStore = useOnboardingStore();

// File handling
const uploadRef = ref();
const logoUploadRef = ref(null);
const logoFile = ref<UploadFileInfo[]>([]);
const fileList = ref<UploadFileInfo[]>([]);
const uploadedFiles = ref<File[]>([]);
const isSubmitting = ref(false);

// Institution type options
const institutionTypeOptions = [
  {
    label: t('onboarding.schoolForm.fields.type.options.primarySchool'),
    value: InstitutionType.PRIMARY_SCHOOL,
  },
  {
    label: t('onboarding.schoolForm.fields.type.options.secondarySchool'),
    value: InstitutionType.SECONDARY_SCHOOL,
  },
  {
    label: t('onboarding.schoolForm.fields.type.options.highSchool'),
    value: InstitutionType.HIGH_SCHOOL,
  },
  {
    label: t('onboarding.schoolForm.fields.type.options.vocational'),
    value: InstitutionType.VOCATIONAL,
  },
  {
    label: t('onboarding.schoolForm.fields.type.options.specialEducation'),
    value: InstitutionType.SPECIAL_EDUCATION,
  },
  {
    label: t('onboarding.schoolForm.fields.type.options.languageSchool'),
    value: InstitutionType.LANGUAGE_SCHOOL,
  },
  {
    label: t('onboarding.schoolForm.fields.type.options.other'),
    value: InstitutionType.OTHER,
  },
];

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
    type: institution?.type || InstitutionType.HIGH_SCHOOL,
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

    // getting the logo if it exits
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

    await schoolStore.initSchool(schoolData, uploadedFiles.value, logoFileData);
    message.success(t('onboarding.schoolForm.success'));
    onboardingStore.currentStep = 4;
  } catch {
    message.error(schoolStore.error || t('onboarding.schoolForm.error'));
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<style scoped>
:deep(.n-input),
:deep(.n-select) {
  background-color: #1c1c21;
}

:deep(.n-form-item .n-form-item-label) {
  color: rgb(156, 163, 175);
  font-size: 0.875rem;
}

:deep(.n-upload-trigger) {
  background-color: #1c1c21;
  border-color: rgba(55, 65, 81, 0.5);
}
</style>
