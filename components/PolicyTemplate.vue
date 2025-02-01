<template>
  <div class="min-h-screen bg-[#101014] text-white relative">
    <!-- Full-page background decorations -->
    <div class="fixed inset-0 z-0">
      <div
        class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
      />
      <div
        class="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-500 rounded-full filter blur-3xl opacity-5 transform translate-x-1/2"
      />
      <div
        class="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-emerald-500 rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
      />
    </div>

    <!-- Content wrapper -->
    <div class="relative z-10">
      <!-- Header Section -->
      <div class="py-16">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <h1
              class="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text mb-6"
            >
              {{ pageTitle }}
            </h1>
            <p class="text-gray-400">Last updated: {{ lastUpdated }}</p>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="py-12">
        <div class="mx-auto max-w-3xl px-6 lg:px-8">
          <div
            class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 mb-8"
          >
            <!-- Policy Content -->
            <div class="prose prose-invert max-w-none policy-content">
              <slot />
            </div>
          </div>

          <!-- Contact Section -->
          <div class="text-center">
            <p class="text-gray-400 mb-4">
              If you have any questions about our {{ pageTitle }}, please
              contact us:
            </p>
            <n-button type="primary" color="#4ade80" class="text-lg">
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
  background: linear-gradient(to right, #4ade80, #3b82f6);
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
  color: #4ade80;
}

.policy-content :deep(h3) {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  margin-top: 2rem;
  color: #60a5fa;
}

.policy-content :deep(p) {
  margin-bottom: 1.5rem;
  color: rgb(209, 213, 219);
  line-height: 1.75;
}

.policy-content :deep(ul) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.policy-content :deep(li) {
  margin-bottom: 0.5rem;
  color: rgb(209, 213, 219);
}

.policy-content :deep(strong) {
  color: #ffffff;
}

.policy-content :deep(a) {
  color: #4ade80;
  transition: color 0.2s ease;
}

.policy-content :deep(a:hover) {
  color: #86efac;
}

.policy-content :deep(blockquote) {
  border-left: 4px solid #4ade80;
  padding-left: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  color: rgb(156, 163, 175);
  font-style: italic;
}
</style>
