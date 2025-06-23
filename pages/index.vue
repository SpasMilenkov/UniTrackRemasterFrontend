<template>
  <div class="min-h-screen bg-background text-text-primary scroll-smooth">
    <!-- Hero Section -->
    <section class="relative h-screen overflow-hidden">
      <!-- Video Background with Fallback -->
      <div class="absolute inset-0 z-0">
        <video
          class="absolute w-full h-full object-cover opacity-20"
          autoplay
          loop
          muted
          playsinline
          preload="metadata"
          :aria-label="t('indexPage.videoBackground')"
        >
          <source src="/videos/hero.mp4" type="video/mp4" >
          <!-- Fallback background for when video fails to load -->
        </video>
        <!-- Gradient overlay for better text readability -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/80"
        />
      </div>

      <!-- Hero Content -->
      <div
        v-motion
        class="relative z-10 h-full flex items-center justify-center px-4"
        :initial="{ opacity: 0, y: 50 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { duration: 800, ease: 'easeOut' },
        }"
      >
        <div class="max-w-5xl mx-auto text-center">
          <h1
            v-motion
            class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            :initial="{ opacity: 0, y: 30 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: 800, delay: 200 },
            }"
          >
            <span
              class="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
            >
              {{ t('indexPage.title') }}
            </span>
          </h1>

          <p
            v-motion
            class="text-xl md:text-2xl lg:text-3xl text-text-secondary mb-12 leading-relaxed max-w-4xl mx-auto"
            :initial="{ opacity: 0, y: 30 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: 800, delay: 400 },
            }"
          >
            {{ t('indexPage.subtitle') }}
          </p>

          <div
            v-motion
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
            :initial="{ opacity: 0, y: 30 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: 800, delay: 600 },
            }"
          >
            <button
              class="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center gap-3 group"
              :aria-label="t('indexPage.getStarted')"
              @click="navigateTo(localePath('/get-started'))"
            >
              {{ t('indexPage.getStarted') }}
              <Icon
                name="ph:arrow-right-bold"
                class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              class="bg-background-secondary hover:bg-border text-text-primary px-8 py-4 rounded-xl font-semibold text-lg border border-border hover:border-primary/30 transition-all duration-300 flex items-center gap-3 group"
              :aria-label="t('indexPage.learnMore')"
              @click="scrollToFeatures"
            >
              {{ t('indexPage.learnMore') }}
              <Icon
                name="ph:arrow-down-bold"
                class="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div
        v-motion
        class="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 800, delay: 1000 } }"
        @click="scrollToFeatures"
      >
        <div class="animate-bounce">
          <Icon
            name="ph:caret-down-bold"
            class="text-3xl text-primary/70 hover:text-primary transition-colors duration-300"
            :aria-label="t('indexPage.scrollDown')"
          />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-background relative">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <!-- Section Header -->
        <header class="text-center mb-20">
          <h2
            v-motion
            class="text-4xl md:text-5xl font-bold mb-6"
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          >
            <span
              class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              {{ t('indexPage.featuresTitle') }}
            </span>
          </h2>
          <p
            v-motion
            class="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
            :initial="{ opacity: 0, y: 30 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: 600, delay: 200 },
            }"
          >
            {{ t('indexPage.featuresSubtitle') }}
          </p>
        </header>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <article
            v-for="(feature, index) in features"
            :key="feature.title"
            v-motion
            class="feature-card bg-background-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 group hover:shadow-xl hover:shadow-primary/5"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: 600, delay: index * 150 },
            }"
          >
            <!-- Feature Header -->
            <div class="flex items-start gap-6 mb-8">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <div
                  class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300"
                >
                  <Icon
                    :name="feature.icon"
                    class="w-7 h-7 text-primary"
                    :aria-hidden="true"
                  />
                </div>
              </div>

              <!-- Title and Description -->
              <div class="flex-grow">
                <h3
                  class="text-2xl font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300"
                >
                  {{ t(feature.title) }}
                </h3>
                <p class="text-text-secondary leading-relaxed">
                  {{ t(feature.description) }}
                </p>
              </div>
            </div>

            <!-- Feature List -->
            <ul class="space-y-3" role="list">
              <li
                v-for="(subFeature, subIndex) in feature.subFeatures"
                :key="subFeature"
                v-motion
                class="flex items-center gap-3 text-text-secondary group-hover:text-text-primary transition-colors duration-300"
                :initial="{ opacity: 0, x: -20 }"
                :enter="{
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 400,
                    delay: index * 100 + subIndex * 50,
                  },
                }"
              >
                <Icon
                  name="ph:check-circle-fill"
                  class="text-primary flex-shrink-0 w-5 h-5"
                  :aria-hidden="true"
                />
                <span>{{ t(subFeature) }}</span>
              </li>
            </ul>
          </article>
        </div>

        <!-- Call to Action -->
        <div
          v-motion
          class="text-center mt-20"
          :initial="{ opacity: 0, y: 30 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 600, delay: 800 },
          }"
        >
          <div
            class="bg-background-card border border-border rounded-2xl p-12 max-w-4xl mx-auto"
          >
            <h3 class="text-3xl font-bold mb-4">
              <span
                class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                {{ t('indexPage.cta.title') }}
              </span>
            </h3>
            <p class="text-xl text-text-secondary mb-8 leading-relaxed">
              {{ t('indexPage.cta.description') }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                class="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                :aria-label="t('indexPage.getStarted')"
                @click="navigateTo(localePath('/get-started'))"
              >
                {{ t('indexPage.getStarted') }}
                <Icon
                  name="ph:arrow-right-bold"
                  class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                class="bg-background-secondary hover:bg-border text-text-primary px-8 py-4 rounded-xl font-semibold text-lg border border-border hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-3 group"
                :aria-label="t('indexPage.viewDemo')"
                @click="navigateTo(localePath('/demo'))"
              >
                {{ t('indexPage.viewDemo') }}
                <Icon
                  name="ph:play-circle-bold"
                  class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Enhanced SEO and accessibility
definePageMeta({
  layout: 'default',
  title: 'UniTrack | Unified Education Management Platform',
  description:
    'Transform educational management with UniTrack - the comprehensive platform for student tracking, academic analytics, and institutional efficiency.',
});

// Enhanced meta tags for better SEO
useHead({
  title: 'UniTrack | Unified Education Management Platform',
  meta: [
    {
      name: 'description',
      content:
        'UniTrack revolutionizes educational management with advanced student tracking, real-time analytics, automated workflows, and comprehensive institutional tools. Perfect for schools and universities.',
    },
    {
      name: 'keywords',
      content:
        'education management, student tracking, academic analytics, school administration, university platform, education technology, student information system, academic planning, educational workflow',
    },
    { name: 'author', content: 'UniTrack Team' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'theme-color', content: '#4ade80' },

    // Open Graph tags
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'UniTrack' },
    {
      property: 'og:title',
      content: 'UniTrack | Unified Education Management Platform',
    },
    {
      property: 'og:description',
      content:
        'Transform educational management with UniTrack - comprehensive platform for student tracking, analytics, and institutional efficiency.',
    },
    { property: 'og:image', content: '/images/uni-track-og-image.png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    {
      property: 'og:image:alt',
      content: 'UniTrack Education Management Platform',
    },
    { property: 'og:url', content: 'https://yourdomain.com' },
    { property: 'og:locale', content: 'en_US' },

    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@UniTrack' },
    {
      name: 'twitter:title',
      content: 'UniTrack | Education Management Simplified',
    },
    {
      name: 'twitter:description',
      content:
        'Advanced education platform with student tracking, analytics, and workflow automation for modern institutions.',
    },
    { name: 'twitter:image', content: '/images/uni-track-twitter-image.png' },
    {
      name: 'twitter:image:alt',
      content: 'UniTrack Education Platform Interface',
    },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'canonical', href: 'https://yourdomain.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'UniTrack',
        description:
          'Comprehensive education management platform for schools and universities',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Organization',
          name: 'UniTrack Team',
        },
      }),
    },
  ],
});

const { t } = useI18n();
const localePath = useLocalePath();

// Smooth scroll to features with better UX
const scrollToFeatures = () => {
  const element = document.getElementById('features');
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

// Enhanced features data with better structure
const features = [
  {
    title: 'indexPage.features[0].title',
    description: 'indexPage.features[0].description',
    icon: 'ph:trophy-bold',
    subFeatures: [
      'indexPage.features[0].subFeatures[0]',
      'indexPage.features[0].subFeatures[1]',
      'indexPage.features[0].subFeatures[2]',
      'indexPage.features[0].subFeatures[3]',
    ],
  },
  {
    title: 'indexPage.features[1].title',
    description: 'indexPage.features[1].description',
    icon: 'ph:calendar-check-bold',
    subFeatures: [
      'indexPage.features[1].subFeatures[0]',
      'indexPage.features[1].subFeatures[1]',
      'indexPage.features[1].subFeatures[2]',
      'indexPage.features[1].subFeatures[3]',
    ],
  },
  {
    title: 'indexPage.features[2].title',
    description: 'indexPage.features[2].description',
    icon: 'ph:chart-line-up-bold',
    subFeatures: [
      'indexPage.features[2].subFeatures[0]',
      'indexPage.features[2].subFeatures[1]',
      'indexPage.features[2].subFeatures[2]',
      'indexPage.features[2].subFeatures[3]',
    ],
  },
  {
    title: 'indexPage.features[3].title',
    description: 'indexPage.features[3].description',
    icon: 'ph:buildings-bold',
    subFeatures: [
      'indexPage.features[3].subFeatures[0]',
      'indexPage.features[3].subFeatures[1]',
      'indexPage.features[3].subFeatures[2]',
      'indexPage.features[3].subFeatures[3]',
    ],
  },
];

// Enhanced keyboard navigation
onMounted(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Quick navigation shortcuts
    if (event.altKey) {
      switch (event.key) {
        case 'f':
          event.preventDefault();
          scrollToFeatures();
          break;
        case 'g':
          event.preventDefault();
          navigateTo(localePath('/get-started'));
          break;
      }
    }

    // Escape to scroll to top
    if (event.key === 'Escape') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
});

</script>

<style scoped>
/* Enhanced feature card styling inspired by the 404 page */
.feature-card {
  background: var(--color-background-card);
  backdrop-filter: blur(12px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(var(--color-primary-rgb), 0.03) 0%,
    transparent 50%,
    rgba(var(--color-secondary-rgb), 0.03) 100%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(var(--color-primary-rgb), 0.1),
    0 0 20px rgba(var(--color-primary-rgb), 0.05);
}

/* Enhanced gradient text styling */
/* .bg-gradient-to-r {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 50%,
    var(--color-primary) 100%
  );
  background-size: 200% 200%;
  animation: gradientShift 3s ease-in-out infinite;
} */

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Improved button hover effects */
button {
  position: relative;
  overflow: hidden;
}

button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition:
    width 0.6s,
    height 0.6s;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

button:hover::after {
  width: 300px;
  height: 300px;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .feature-card,
  button,
  .bg-gradient-to-r {
    animation: none;
    transition: none;
  }

  .feature-card:hover {
    transform: none;
  }
}

/* Focus styles for keyboard navigation */
button:focus-visible,
.feature-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .feature-card {
    border-width: 2px;
  }

  .bg-gradient-to-r {
    background: var(--color-primary);
  }
}

/* Print styles */
@media print {
  .feature-card {
    break-inside: avoid;
    border: 1px solid #000;
  }

  video,
  .animate-bounce {
    display: none;
  }
}
</style>
