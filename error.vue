<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-lg mx-auto text-center">
      <!-- 404 Number -->
      <div class="mb-8">
        <h1 class="text-8xl md:text-9xl font-bold text-primary mb-4">404</h1>
        <div class="h-0.5 w-16 bg-primary mx-auto rounded-full"></div>
      </div>

      <!-- Main error card -->
      <div class="bg-background-card border border-border rounded-2xl p-8 mb-6">
        <div class="mb-6">
          <div
            class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-7.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17z"
              />
            </svg>
          </div>

          <h2 class="text-2xl md:text-3xl font-semibold text-text-primary mb-3">
            Page Not Found
          </h2>

          <p class="text-text-secondary leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Don't
            worry, it happens to the best of us.
          </p>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink
            to="/"
            class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </NuxtLink>

          <button
            @click="$router.go(-1)"
            class="bg-background-secondary hover:bg-border text-text-primary px-6 py-3 rounded-lg font-medium border border-border hover:border-hover transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>
      </div>

      <!-- Help section -->
      <div class="bg-background-secondary border border-border rounded-xl p-5">
        <p class="text-text-secondary text-sm mb-3">
          Need help finding what you're looking for?
        </p>

        <div class="flex flex-wrap justify-center gap-4 text-sm">
          <NuxtLink
            to="/contact"
            class="text-primary hover:text-primary-dark transition-colors duration-200 flex items-center gap-1.5"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Contact Support
          </NuxtLink>

          <button
            @click="reportIssue"
            class="text-primary hover:text-primary-dark transition-colors duration-200 flex items-center gap-1.5"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            Report Issue
          </button>

          <button
            @click="reload"
            class="text-primary hover:text-primary-dark transition-colors duration-200 flex items-center gap-1.5"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reload Page
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta tags for SEO
useSeoMeta({
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: 'noindex, nofollow',
});

// Set status code for proper HTTP response
setResponseStatus(404);

// Methods for interactive elements
const reportIssue = () => {
  // You can implement your own reporting logic here
  console.log('Report issue clicked');
  // Example: navigateTo('/report-issue')
};

const reload = () => {
  if (import.meta.client) {
    window.location.reload();
  }
};

// Add keyboard navigation
onMounted(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      navigateTo('/');
    } else if (event.key === 'r' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      reload();
    }
  };

  document.addEventListener('keydown', handleKeyPress);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress);
  });
});
</script>
