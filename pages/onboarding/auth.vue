<template>
  <div
    class="min-h-screen flex items-center justify-center bg-background relative"
  >
    <!-- Background overlay -->
    <!-- Background overlay -->
    <div class="absolute inset-0 bg-black opacity-50" />

    <!-- Floating Particles Background -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="n in 30"
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

    <!-- Background blobs (optional - remove if you prefer just particles) -->
    <div
      class="absolute inset-0 bg-no-repeat bg-cover opacity-30"
    />

    <!-- Card Container -->
    <n-card
      v-motion
      size="huge"
      class="max-w-xl mx-auto p-6 bg-background-card border border-border/50 shadow-2xl relative z-10 rounded-xl backdrop-blur-sm feature-card"
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
      :delay="300"
    >
      <n-divider>
        <h2 class="text-2xl font-semibold text-gradient">Login with Code</h2>
      </n-divider>

      <n-form class="sm:min-w-72 mt-6" @submit.prevent="onSubmit">
        <n-space vertical>
          <n-form-item
            label="Email"
            v-bind="emailProps"
            path="email"
            label-style="color: var(--color-text-primary); font-weight: 600;"
          >
            <n-input v-model:value="email" />
          </n-form-item>

          <n-form-item
            label="Code"
            v-bind="codeProps"
            path="code"
            label-style="color: var(--color-text-primary); font-weight: 600;"
          >
            <div class="flex items-center gap-2 w-full">
              <n-input
                v-model:value="code"
                type="text"
                placeholder="Enter your code"
                class="w-full grow-1 flex"
              />
              <n-tooltip trigger="hover" placement="top">
                <template #trigger>
                  <Icon name="ph:question" size="40" class="text-primary" />
                </template>
                <span>The code should have been sent via email</span>
              </n-tooltip>
            </div>
          </n-form-item>
        </n-space>

        <n-space justify="center" class="mt-6">
          <n-button
            type="primary"
            native-type="submit"
            attr-type="submit"
            size="large"
            class="px-8 py-3"
            :loading="onboardingStore.processingSubmission"
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

const onboardingStore = useOnboardingStore();
const notification = useNotification();

const { handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(codeAuthSchema),
});

const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [code, codeProps] = defineField('code', naiveUiFormsConfig);

const onSubmit = handleSubmit(async (values) => {
  try {
    await onboardingStore.authenticateViaCode(values);

    notification.success({
      title: 'Verification Successful',
      description:
        'Code verified successfully! Redirecting to your institution portal...',
      duration: 3000,
    });
  } catch (error: any) {
    console.error('Authentication error:', error);

    // Extract meaningful error message
    const errorMessage = onboardingStore.extractErrorMessage(error);

    // Show specific error notifications based on status codes
    if (error?.status === 404) {
      notification.error({
        title: 'Application Not Found',
        description:
          'No application found for this email address. Please check your email and try again.',
        duration: 5000,
      });
    } else if (error?.status === 401) {
      notification.error({
        title: 'Invalid Verification Code',
        description:
          'The verification code you entered is incorrect. Please check your email and try again.',
        duration: 5000,
      });
    } else if (error?.status === 410) {
      notification.error({
        title: 'Code Expired',
        description:
          'Your verification code has expired. Please request a new code.',
        duration: 5000,
      });
    } else if (error?.status === 422) {
      notification.error({
        title: 'Verification Error',
        description:
          errorMessage ||
          'There was an issue with your application data. Please contact support.',
        duration: 5000,
      });
    } else if (error?.status >= 500) {
      notification.error({
        title: 'Server Error',
        description:
          'Our servers are experiencing issues. Please try again in a few moments.',
        duration: 5000,
      });
    } else {
      notification.error({
        title: 'Verification Failed',
        description:
          errorMessage || 'Failed to verify your code. Please try again.',
        duration: 5000,
      });
    }
  }
});
</script>

<style scoped>
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

.feature-card {
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.15);
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: rgba(var(--color-primary-rgb, 74, 222, 128), 0.3);
  box-shadow: 0 0 30px rgba(var(--color-primary-rgb, 74, 222, 128), 0.1);
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
