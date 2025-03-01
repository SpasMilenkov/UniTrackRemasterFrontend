<template>
  <div class="min-h-screen bg-background text-text-primary relative">
    <!-- Full-page background decorations -->
    <div class="fixed inset-0 z-0">
      <div
        class="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
        :style="{ backgroundColor: 'var(--color-primary)' }"
      />
      <div
        class="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-5 transform translate-x-1/2"
        :style="{ backgroundColor: 'var(--color-secondary)' }"
      />
      <div
        class="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
        :style="{ backgroundColor: 'var(--color-primary)' }"
      />
    </div>

    <!-- Content wrapper -->
    <div class="relative z-10">
      <!-- Header Section -->
      <div class="py-16">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gradient mb-6">
              {{ pageTitle }}
            </h1>
            <p class="text-text-secondary">Last updated: {{ lastUpdated }}</p>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="py-12">
        <div class="mx-auto max-w-3xl px-6 lg:px-8">
          <div
            class="bg-background-card/80 backdrop-blur-sm rounded-xl border border-border p-8 mb-8"
          >
            <!-- Policy Content -->
            <div class="prose prose-invert max-w-none policy-content">
              <slot />
            </div>
          </div>

          <!-- Contact Section -->
          <div class="text-center">
            <p class="text-text-secondary mb-4">
              If you have any questions about our {{ pageTitle }}, please
              contact us:
            </p>
            <n-button type="primary" class="text-lg">
              Contact Us
              <template #icon>
                <Icon name="ph:envelope-bold" />
              </template>
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pageTitle: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.policy-content :deep(h1) {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  margin-bottom: 2rem;
  margin-top: 3rem;
  background: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.policy-content :deep(h1:first-child) {
  margin-top: 0;
}

.policy-content :deep(h2) {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  margin-top: 2.5rem;
  color: var(--color-primary);
}

.policy-content :deep(h3) {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  margin-top: 2rem;
  color: var(--color-secondary);
}

.policy-content :deep(p) {
  margin-bottom: 1.5rem;
  color: var(--color-text-primary);
  line-height: 1.75;
}

.policy-content :deep(ul) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.policy-content :deep(li) {
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
}

.policy-content :deep(strong) {
  color: var(--color-text-primary);
  font-weight: 700;
}

.policy-content :deep(a) {
  color: var(--color-primary);
  transition: color 0.2s ease;
}

.policy-content :deep(a:hover) {
  color: var(--color-primary-hover);
}

.policy-content :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding-left: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-secondary);
  font-style: italic;
}
</style>
