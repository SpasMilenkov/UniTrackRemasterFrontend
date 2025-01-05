<template>
  <div class="min-h-screen bg-[#101014] text-white relative">
    <!-- Content wrapper -->
    <div class="relative z-10">
      <div class="py-12">
        <div class="mx-auto max-w-3xl px-6 lg:px-8">
          <!-- Form Card -->
          <div
            class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 transition-all duration-300"
          >
            <!-- Header -->
            <div class="mb-8 text-center">
              <h1
                class="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
              >
                {{ t('onboarding.schoolForm.title') }}
              </h1>
            </div>
            <n-form @submit.prevent="onSubmit">
              <!-- School Name -->
              <n-form-item
                v-bind="nameProps"
                :label="t('onboarding.schoolForm.fields.name.label')"
              >
                <n-input
                  v-model:value="name"
                  class="dark"
                  :placeholder="
                    t('onboarding.schoolForm.fields.name.placeholder')
                  "
                />
              </n-form-item>

              <!-- Pictures -->
              <n-form-item
                :label="t('onboarding.schoolForm.fields.pictures.label')"
              >
                <n-upload
                  action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                  :default-file-list="fileList"
                  list-type="image-card"
                  class="upload-container"
                >
                  <div
                    class="flex flex-col items-center justify-center text-gray-400"
                  >
                    <Icon name="ph:upload-simple-bold" class="text-2xl mb-2" />
                    <span>{{
                      t('onboarding.schoolForm.fields.pictures.uploadText')
                    }}</span>
                  </div>
                </n-upload>
              </n-form-item>

              <!-- Founded Date -->
              <n-form-item
                v-bind="foundedProps"
                :label="t('onboarding.schoolForm.fields.founded.label')"
              >
                <n-date-picker
                  v-model:value="founded"
                  type="date"
                  class="w-full"
                />
              </n-form-item>

              <!-- School Type -->
              <n-form-item
                v-bind="typeProps"
                :label="t('onboarding.schoolForm.fields.type.label')"
              >
                <n-input
                  v-model:value="type"
                  class="dark"
                  :placeholder="
                    t('onboarding.schoolForm.fields.type.placeholder')
                  "
                />
              </n-form-item>

              <!-- Description -->
              <n-form-item
                v-bind="descriptionProps"
                :label="t('onboarding.schoolForm.fields.description.label')"
              >
                <n-input
                  v-model:value="description"
                  type="textarea"
                  class="dark"
                  :placeholder="
                    t('onboarding.schoolForm.fields.description.placeholder')
                  "
                  :rows="4"
                />
              </n-form-item>

              <!-- Programs -->
              <n-form-item
                :label="t('onboarding.schoolForm.fields.programs.label')"
                v-bind="programsProps"
              >
                <n-select
                  v-model:value="programs"
                  multiple
                  filterable
                  tag
                  :consistent-menu-width="false"
                  :placeholder="
                    t('onboarding.schoolForm.fields.programs.placeholder')
                  "
                  class="dark"
                />
              </n-form-item>

              <!-- Submit Button -->
              <div class="flex justify-end mt-8">
                <n-button
                  type="primary"
                  attr-type="submit"
                  color="#4ade80"
                  class="text-lg px-8"
                >
                  {{ t('onboarding.schoolForm.submit') }}
                  <template #icon>
                    <Icon name="ph:arrow-right-bold" />
                  </template>
                </n-button>
              </div>
            </n-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod';
import type { UploadFileInfo } from 'naive-ui';
import { ref } from 'vue';

const { t } = useI18n();

// File list for uploads
const fileList = ref<UploadFileInfo[]>([]);

// Schema
const schema = z.object({
  name: z.string(),
  founded: z.number(),
  type: z.string(),
  description: z.string(),
  programs: z.string().array(),
});

// Form
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

// Fields
const [name, nameProps] = defineField('name', naiveUiFormsConfig);
const [founded, foundedProps] = defineField('founded', naiveUiFormsConfig);
const [type, typeProps] = defineField('type', naiveUiFormsConfig);
const [description, descriptionProps] = defineField(
  'description',
  naiveUiFormsConfig
);
const [programs, programsProps] = defineField('programs', naiveUiFormsConfig);

// Methods
const onSubmit = handleSubmit((values) => {
  console.log(values);
});
</script>

<style scoped>
:deep(.n-form-item-label) {
  color: #9ca3af !important;
  /* text-gray-400 */
}

:deep(.n-input) {
  background-color: #1f1f23 !important;
  border-color: rgba(75, 85, 99, 0.5) !important;
}

:deep(.n-input:hover),
:deep(.n-input:focus) {
  border-color: #4ade80 !important;
}

:deep(.n-date-picker) {
  background-color: #1f1f23 !important;
  border-color: rgba(75, 85, 99, 0.5) !important;
}

:deep(.n-select) {
  background-color: #1f1f23 !important;
  border-color: rgba(75, 85, 99, 0.5) !important;
}

:deep(.upload-container) {
  background-color: #1f1f23 !important;
  border: 2px dashed rgba(75, 85, 99, 0.5) !important;
  border-radius: 0.5rem;
}

:deep(.upload-container:hover) {
  border-color: #4ade80 !important;
}
</style>
