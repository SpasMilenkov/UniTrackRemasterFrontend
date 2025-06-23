<template>
  <div
    class="min-h-screen flex flex-col items-center justify-between bg-background relative overflow-hidden"
  >
    <!-- Background overlay -->
    <div class="absolute inset-0 bg-black opacity-50" />
    <div class="absolute inset-0">
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"
      />

      <div
        class="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"
      />
      <div
        class="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl"
      />

      <div class="particles-container">
        <div
          v-for="n in 20"
          :key="n"
          class="particle"
          :style="{
            '--size': 0.25 + Math.random() * 0.5 + 'rem',
            '--x': Math.random() * 100 + 'vw',
            '--y': Math.random() * 100 + 'vh',
            '--duration': 15 + Math.random() * 15 + 's',
            '--delay': Math.random() * 5 + 's',
            '--opacity': 0.1 + Math.random() * 0.1,
          }"
        />
      </div>
    </div>

    <!-- Main content container using flex -->
    <div
      class="flex flex-col items-center justify-center w-full min-h-screen z-10"
    >
      <!-- Logo section - now using flex -->
      <div
        v-motion
        class="flex flex-col items-center mb-8"
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="100"
      >
        <div class="flex items-center justify-center space-x-3">
          <div
            class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center"
          >
            <Icon name="ph:graduation-cap-fill" class="text-primary text-2xl" />
          </div>
          <h1 class="text-2xl font-bold text-text-primary">UniTrack</h1>
        </div>
      </div>

      <!-- Card Container -->
      <n-card
        v-motion
        size="huge"
        class="max-w-xl w-full mx-4 p-8 bg-background-card/90 border border-border/30 shadow-card relative rounded-xl backdrop-blur-md feature-card"
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="300"
      >
        <n-divider>
          <h2 class="text-2xl font-semibold text-gradient">Login with Code</h2>
        </n-divider>

        <p class="text-text-secondary text-center mb-6">
          Enter the verification code sent to your email to access your
          institution's portal
        </p>

        <n-form class="sm:min-w-72 mt-6" @submit.prevent="onSubmit">
          <n-space vertical>
            <n-form-item
              label="Email"
              v-bind="emailProps"
              path="email"
              label-style="color: var(--color-text-primary); font-weight: 600;"
            >
              <n-input
                v-model:value="email"
                placeholder="your.email@institution.edu"
                :disabled="onboardingStore.isAuthenticating"
              />
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
                  :disabled="onboardingStore.isAuthenticating"
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

          <n-space justify="center" class="mt-8">
            <n-button
              type="primary"
              native-type="submit"
              attr-type="submit"
              size="large"
              class="px-10 py-3 w-full"
              :loading="onboardingStore.isAuthenticating"
              :disabled="onboardingStore.isAuthenticating"
            >
              <Icon name="ph:sign-in" class="mr-2" />
              Submit Code
            </n-button>
          </n-space>
        </n-form>

        <!-- Additional options -->
        <div class="mt-6 text-center">
          <n-space vertical size="small">
            <a href="#" class="text-primary hover:text-primary-hover text-sm"
              >Didn't receive a code?</a
            >
            <a href="#" class="text-primary hover:text-primary-hover text-sm"
              >Need help?</a
            >
          </n-space>
        </div>
      </n-card>
    </div>
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
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: rgba(var(--color-primary-rgb, 74, 222, 128), 0.2);
}

.shadow-card {
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.1),
    0 0 20px rgba(var(--color-primary-rgb, 74, 222, 128), 0.05);
}

/* Improved particles animation */
.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size);
  height: var(--size);
  background-color: var(--color-primary, #4ade80);
  border-radius: 50%;
  opacity: var(--opacity);
  transform: translate(var(--x), var(--y));
  animation: float-up var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes float-up {
  0% {
    transform: translate(var(--x), calc(var(--y) + 10vh));
    opacity: 0;
  }
  10% {
    opacity: var(--opacity);
  }
  90% {
    opacity: var(--opacity);
  }
  100% {
    transform: translate(calc(var(--x) + 5vw), calc(var(--y) - 10vh));
    opacity: 0;
  }
}
</style>
