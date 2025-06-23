<template>
  <div>
    <!-- Error State -->
    <div v-if="hasError" class="error-boundary">
      <div
        class="max-w-md mx-auto bg-background-card rounded-2xl shadow-xl p-8 text-center border border-border"
      >
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          :class="
            errorSeverity === 'critical'
              ? 'bg-red-500/10'
              : errorSeverity === 'warning'
                ? 'bg-yellow-500/10'
                : 'bg-blue-500/10'
          "
        >
          <Icon
            :name="
              errorSeverity === 'critical'
                ? 'ph:warning-circle'
                : errorSeverity === 'warning'
                  ? 'ph:warning'
                  : 'ph:info'
            "
            class="text-2xl"
            :class="
              errorSeverity === 'critical'
                ? 'text-red-500'
                : errorSeverity === 'warning'
                  ? 'text-yellow-500'
                  : 'text-blue-500'
            "
          />
        </div>

        <h3 class="text-lg font-semibold text-primary mb-2">
          {{ errorTitle }}
        </h3>

        <p class="text-secondary mb-6">
          {{ errorMessage }}
        </p>

        <div class="flex gap-3 justify-center">
          <n-button
            type="primary"
            size="large"
            @click="handleRetry"
            :loading="isRetrying"
          >
            <template #icon>
              <Icon name="ph:arrow-clockwise" />
            </template>
            {{ retryText }}
          </n-button>

          <n-button
            v-if="showDetails"
            quaternary
            size="large"
            @click="showErrorDetails = !showErrorDetails"
          >
            <template #icon>
              <Icon name="ph:bug" />
            </template>
            Details
          </n-button>

          <n-button
            v-if="showReport"
            quaternary
            size="large"
            @click="reportError"
          >
            <template #icon>
              <Icon name="ph:bug-beetle" />
            </template>
            Report
          </n-button>
        </div>

        <!-- Error Details -->
        <div
          v-if="showErrorDetails && errorDetails"
          class="mt-6 p-4 bg-background-secondary rounded-lg text-left"
        >
          <h4 class="font-semibold text-primary mb-2">Error Details</h4>
          <div class="text-sm text-secondary space-y-2">
            <div><strong>Type:</strong> {{ errorDetails.type }}</div>
            <div><strong>Code:</strong> {{ errorDetails.code }}</div>
            <div><strong>Timestamp:</strong> {{ errorDetails.timestamp }}</div>
            <div v-if="errorDetails.stack" class="max-h-32 overflow-y-auto">
              <strong>Stack Trace:</strong>
              <pre class="text-xs mt-1 whitespace-pre-wrap">{{
                errorDetails.stack
              }}</pre>
            </div>
          </div>
        </div>

        <!-- Suggestions -->
        <div
          v-if="suggestions.length > 0"
          class="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <h4 class="font-semibold text-primary mb-2">
            <Icon name="ph:lightbulb" class="inline mr-2" />
            Suggestions
          </h4>
          <ul class="text-sm text-secondary space-y-1 text-left">
            <li
              v-for="suggestion in suggestions"
              :key="suggestion"
              class="flex items-start gap-2"
            >
              <Icon name="ph:dot" class="text-xs mt-1 flex-shrink-0" />
              <span>{{ suggestion }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Normal Content -->
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured, onMounted } from 'vue';

interface ErrorDetails {
  type: string;
  code?: string;
  message: string;
  stack?: string;
  timestamp: string;
  context?: Record<string, any>;
}

interface Props {
  fallbackTitle?: string;
  fallbackMessage?: string;
  showDetails?: boolean;
  showReport?: boolean;
  retryText?: string;
  errorSeverity?: 'info' | 'warning' | 'critical';
  suggestions?: string[];
  onRetry?: () => void | Promise<void>;
  onReport?: (error: ErrorDetails) => void | Promise<void>;
}

const props = withDefaults(defineProps<Props>(), {
  fallbackTitle: 'Something went wrong',
  fallbackMessage: 'An unexpected error occurred. Please try again.',
  showDetails: true,
  showReport: true,
  retryText: 'Try Again',
  errorSeverity: 'critical',
  suggestions: () => [],
});

const hasError = ref(false);
const error = ref<Error | null>(null);
const errorDetails = ref<ErrorDetails | null>(null);
const showErrorDetails = ref(false);
const isRetrying = ref(false);

// Computed properties
const errorTitle = computed(() => {
  if (errorDetails.value?.code === 'NETWORK_ERROR') {
    return 'Connection Problem';
  } else if (errorDetails.value?.code === 'PERMISSION_DENIED') {
    return 'Access Denied';
  } else if (errorDetails.value?.code === 'NOT_FOUND') {
    return 'Content Not Found';
  }
  return props.fallbackTitle;
});

const errorMessage = computed(() => {
  if (errorDetails.value?.code === 'NETWORK_ERROR') {
    return 'Unable to connect to the server. Please check your internet connection.';
  } else if (errorDetails.value?.code === 'PERMISSION_DENIED') {
    return 'You do not have permission to access this content.';
  } else if (errorDetails.value?.code === 'NOT_FOUND') {
    return 'The requested content could not be found.';
  }
  return errorDetails.value?.message || props.fallbackMessage;
});

const suggestions = computed(() => {
  if (props.suggestions.length > 0) {
    return props.suggestions;
  }

  const defaultSuggestions: string[] = [];

  if (errorDetails.value?.code === 'NETWORK_ERROR') {
    defaultSuggestions.push(
      'Check your internet connection',
      'Try refreshing the page',
      'Clear your browser cache'
    );
  } else if (errorDetails.value?.code === 'PERMISSION_DENIED') {
    defaultSuggestions.push(
      'Log out and log back in',
      'Contact your administrator',
      'Check if you have the required permissions'
    );
  } else {
    defaultSuggestions.push(
      'Refresh the page',
      'Clear your browser cache',
      'Try again in a few minutes'
    );
  }

  return defaultSuggestions;
});

// Error capture
onErrorCaptured((err: Error) => {
  console.error('Error caught by boundary:', err);
  captureError(err);
  return false; // Prevent the error from propagating
});

// Handle unhandled promise rejections
onMounted(() => {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    captureError(
      new Error(event.reason?.message || 'Unhandled promise rejection')
    );
  });
});

// Capture and process error
const captureError = (err: Error) => {
  hasError.value = true;
  error.value = err;

  // Determine error code based on error type/message
  let code = 'UNKNOWN_ERROR';
  if (err.message.includes('fetch') || err.message.includes('network')) {
    code = 'NETWORK_ERROR';
  } else if (
    err.message.includes('permission') ||
    err.message.includes('unauthorized')
  ) {
    code = 'PERMISSION_DENIED';
  } else if (err.message.includes('not found') || err.message.includes('404')) {
    code = 'NOT_FOUND';
  }

  errorDetails.value = {
    type: err.constructor.name,
    code,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    context: {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
    },
  };

  // Report error to monitoring service
  reportErrorToService(errorDetails.value);
};

// Retry handler
const handleRetry = async () => {
  isRetrying.value = true;
  try {
    if (props.onRetry) {
      await props.onRetry();
    } else {
      // Default retry: reload the page
      window.location.reload();
    }

    // If custom retry doesn't reload, reset error state
    hasError.value = false;
    error.value = null;
    errorDetails.value = null;
    showErrorDetails.value = false;
  } catch (retryError) {
    console.error('Retry failed:', retryError);
    // Keep error state, just stop loading
  } finally {
    isRetrying.value = false;
  }
};

// Report error handler
const reportError = async () => {
  if (props.onReport && errorDetails.value) {
    await props.onReport(errorDetails.value);
  } else {
    // Default reporting: copy to clipboard
    if (errorDetails.value) {
      try {
        await navigator.clipboard.writeText(
          JSON.stringify(errorDetails.value, null, 2)
        );
        // Could show a toast notification here
        console.log('Error details copied to clipboard');
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
      }
    }
  }
};

// Report to monitoring service (implement based on your service)
const reportErrorToService = (errorInfo: ErrorDetails) => {
  // Example: Send to Sentry, LogRocket, or custom error service
  try {
    // if (window.Sentry) {
    //   window.Sentry.captureException(new Error(errorInfo.message), {
    //     extra: errorInfo.context,
    //     tags: {
    //       errorCode: errorInfo.code,
    //       errorType: errorInfo.type,
    //     },
    //   });
    // }

    // Or send to custom endpoint
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorInfo),
    // }).catch(console.error);

    console.log('Error reported:', errorInfo);
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError);
  }
};

// Expose methods for programmatic error handling
const triggerError = (error: Error) => {
  captureError(error);
};

const clearError = () => {
  hasError.value = false;
  error.value = null;
  errorDetails.value = null;
  showErrorDetails.value = false;
};

defineExpose({
  triggerError,
  clearError,
  hasError: computed(() => hasError.value),
  error: computed(() => error.value),
});
</script>

<style scoped>
.error-boundary {
  padding: 2rem;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

pre {
  font-family: 'Courier New', monospace;
  background: rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  border-radius: 0.25rem;
}

@media (max-width: 768px) {
  .error-boundary {
    padding: 1rem;
  }
}
</style>
