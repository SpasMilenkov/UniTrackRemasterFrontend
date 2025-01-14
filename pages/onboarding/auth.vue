<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[url('/img/green-blobs.svg')] bg-no-repeat bg-cover relative"
  >
    <!-- Dark overlay for background image -->
    <div class="absolute inset-0 bg-black opacity-50" />

    <!-- Login Card -->
    <n-card
      size="huge"
      class="max-w-xl mx-auto p-6 bg-[#18181c] border border-gray-700 shadow-2xl relative z-10 rounded-xl"
    >
      <!-- Gradient Divider -->
      <n-divider>
        <h2
          class="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
        >
          Login with Code
        </h2>
      </n-divider>

      <!-- Form -->
      <n-form class="sm:min-w-72 mt-6" @submit.prevent="onSubmit">
        <n-space vertical>
          <!-- Email Field -->
          <n-form-item
            label="Email"
            v-bind="emailProps"
            path="email"
            label-style="text-gray-300 font-semibold"
          >
            <n-input
              v-model:value="email"
              class="bg-[#262629] text-white placeholder-gray-500"
            />
          </n-form-item>

          <!-- Code Field with Tooltip -->
          <n-form-item
            label="Code"
            v-bind="codeProps"
            path="code"
            label-style="text-gray-300 font-semibold"
          >
            <div class="flex items-center gap-2 w-full">
              <n-input
                v-model:value="code"
                type="text"
                placeholder="Enter your code"
                class="bg-[#262629] text-white placeholder-gray-500 w-full grow-1 flex"
              />
              <!-- Tooltip with "?" Icon -->
              <n-tooltip trigger="hover" placement="top">
                <template #trigger>
                  <Icon name="ph:question" size="40" class="text-emerald-400" />
                </template>
                <span>The code should have been sent via email</span>
              </n-tooltip>
            </div>
          </n-form-item>
        </n-space>

        <!-- Login Button -->
        <n-space justify="center" class="mt-6">
          <n-button
            type="primary"
            native-type="submit"
            attr-type="submit"
            size="large"
            color="#4ade80"
            class="emerald-400 px-8 py-3"
          >
            Submit Code
          </n-button>
        </n-space>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { codeAuthSchema } from '~/schemas/code-auth.schema';
import { useSchoolOnboardingStore } from '#imports';

//Stores
const schoolOnboardingStore = useSchoolOnboardingStore();

// Form
const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(codeAuthSchema),
});

// Fields
const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [code, codeProps] = defineField('code', naiveUiFormsConfig);

const onSubmit = handleSubmit(async (values) => {
  console.log('submitting');
  await schoolOnboardingStore.authenticateViaCode(values);
});
</script>

<style scoped>
.bg-cover {
  position: relative;
  z-index: 0;
}

.bg-cover::after {
  content: '';
  background: rgba(0, 0, 0, 0.4);
}
</style>
