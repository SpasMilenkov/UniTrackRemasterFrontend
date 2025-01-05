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
  @apply text-3xl font-bold mb-8 mt-12 first:mt-0;
  background: linear-gradient(to right, #4ade80, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.policy-content :deep(h2) {
  @apply text-2xl font-semibold mb-6 mt-10 text-emerald-400;
}

.policy-content :deep(h3) {
  @apply text-xl font-semibold mb-4 mt-8 text-blue-400;
}

.policy-content :deep(p) {
  @apply mb-6 text-gray-300 leading-relaxed;
}

.policy-content :deep(ul) {
  @apply mb-6 pl-6;
}

.policy-content :deep(li) {
  @apply mb-2 text-gray-300;
}

.policy-content :deep(strong) {
  @apply text-white;
}

.policy-content :deep(a) {
  @apply text-emerald-400 hover:text-emerald-300 transition-colors duration-200;
}

.policy-content :deep(blockquote) {
  @apply border-l-4 border-emerald-400 pl-4 my-6 text-gray-400 italic;
}
</style>
