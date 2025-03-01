<template>
  <div
    class="min-h-screen bg-background text-text-primary relative scroll-smooth"
  >
    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
      <n-spin size="large" />
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="flex justify-center items-center min-h-screen"
    >
      <n-result status="error" title="Error" :description="error.message">
        <template #footer>
          <n-button
            type="primary"
            class="transform hover:scale-105 transition-all duration-300"
            @click="refresh()"
            >Try Again</n-button
          >
        </template>
      </n-result>
    </div>

    <!-- Content -->
    <template v-else-if="school">
      <!-- Hero Section -->
      <div class="relative overflow-hidden py-24">
        <!-- Background decorations with similar styling to home page -->
        <div class="absolute inset-0 z-0">
          <div
            class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary rounded-full filter blur-3xl opacity-5 transform -translate-x-1/2"
          />
          <div
            class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary rounded-full filter blur-3xl opacity-5 transform translate-x-1/2"
          />
        </div>

        <!-- Content wrapper -->
        <div
          v-motion
          class="mx-auto max-w-7xl px-6 lg:px-8 relative z-10"
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0 }"
          :delay="200"
        >
          <div class="mx-auto max-w-3xl text-center">
            <h1
              v-motion
              class="text-6xl font-bold tracking-tight text-gradient mb-6"
              :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0 }"
              :delay="400"
            >
              {{ school.name }}
            </h1>
            <p
              v-motion
              class="text-xl text-text-secondary mb-4 italic"
              :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0 }"
              :delay="600"
            >
              "{{ school.motto }}"
            </p>
            <p
              v-motion
              class="text-lg text-text-muted"
              :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0 }"
              :delay="800"
            >
              {{ school.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="py-24 bg-background-card relative overflow-hidden">
        <div class="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <!-- Image Carousel -->
          <n-carousel
            v-if="school.images?.length"
            autoplay
            draggable
            class="mx-auto rounded-xl overflow-hidden border border-border/50 mb-12 max-w-4xl feature-card"
          >
            <img
              v-for="(image, index) in school.images"
              :key="index"
              :src="image"
              class="w-full max-h-[30rem] object-cover"
            >
          </n-carousel>

          <!-- Info Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <!-- General Info Card -->
            <n-card
              v-motion
              class="feature-card backdrop-blur-sm relative overflow-hidden"
              :bordered="false"
              :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0 }"
              :delay="200"
            >
              <template #header>
                <div class="flex items-center gap-4 mb-4">
                  <div class="relative">
                    <div
                      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"
                    />
                    <div
                      class="relative w-16 h-16 bg-background-card rounded-full flex items-center justify-center"
                    >
                      <Icon name="ph:info-bold" class="text-primary w-7 h-7" />
                    </div>
                  </div>
                  <h3 class="text-2xl font-semibold text-gradient">
                    General Information
                  </h3>
                </div>
              </template>
              <n-descriptions bordered>
                <n-descriptions-item label="Location">{{
                  school.location
                }}</n-descriptions-item>
                <n-descriptions-item label="Founded">{{
                  school.founded
                }}</n-descriptions-item>
                <n-descriptions-item label="Type">{{
                  school.type
                }}</n-descriptions-item>
                <n-descriptions-item label="Student Body">{{
                  school.studentCount
                }}</n-descriptions-item>
              </n-descriptions>
            </n-card>

            <!-- Contact Info Card -->
            <n-card
              v-motion
              class="feature-card backdrop-blur-sm relative overflow-hidden"
              :bordered="false"
              :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0 }"
              :delay="400"
            >
              <template #header>
                <div class="flex items-center gap-4 mb-4">
                  <div class="relative">
                    <div
                      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"
                    />
                    <div
                      class="relative w-16 h-16 bg-background-card rounded-full flex items-center justify-center"
                    >
                      <Icon name="ph:phone-bold" class="text-primary w-7 h-7" />
                    </div>
                  </div>
                  <h3 class="text-2xl font-semibold text-gradient">
                    Contact Information
                  </h3>
                </div>
              </template>
              <n-descriptions bordered>
                <n-descriptions-item label="Email">{{
                  school.email
                }}</n-descriptions-item>
                <n-descriptions-item label="Phone">{{
                  school.phone
                }}</n-descriptions-item>
                <n-descriptions-item label="Address">{{
                  school.address
                }}</n-descriptions-item>
              </n-descriptions>
            </n-card>
          </div>

          <!-- Description Section -->
          <n-card
            v-motion
            class="feature-card backdrop-blur-sm relative overflow-hidden mb-12"
            :bordered="false"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="600"
          >
            <template #header>
              <div class="flex items-center gap-4 mb-4">
                <div class="relative">
                  <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"
                  />
                  <div
                    class="relative w-16 h-16 bg-background-card rounded-full flex items-center justify-center"
                  >
                    <Icon
                      name="ph:book-open-bold"
                      class="text-primary w-7 h-7"
                    />
                  </div>
                </div>
                <h3 class="text-2xl font-semibold text-gradient">
                  About the School
                </h3>
              </div>
            </template>
            <p class="text-text-muted whitespace-pre-line">
              {{ school.description }}
            </p>
          </n-card>

          <!-- Programs Section -->
          <n-card
            v-motion
            class="feature-card backdrop-blur-sm relative overflow-hidden"
            :bordered="false"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="800"
          >
            <template #header>
              <div class="flex items-center gap-4 mb-4">
                <div class="relative">
                  <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"
                  />
                  <div
                    class="relative w-16 h-16 bg-background-card rounded-full flex items-center justify-center"
                  >
                    <Icon
                      name="ph:graduation-cap-bold"
                      class="text-primary w-7 h-7"
                    />
                  </div>
                </div>
                <h3 class="text-2xl font-semibold text-gradient">
                  Available Programs
                </h3>
              </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(program, index) in school.programs"
                :key="program"
                v-motion
                class="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all duration-300"
                :initial="{ opacity: 0, x: -20 }"
                :enter="{ opacity: 1, x: 0 }"
                :delay="800 + index * 100"
              >
                <div class="flex items-center gap-2">
                  <Icon
                    name="ph:check-circle-fill"
                    class="text-primary flex-shrink-0"
                    size="22"
                  />
                  <span class="text-text-secondary">{{ program }}</span>
                </div>
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { School } from '~/interfaces/organizations/school';

const route = useRoute();
const isClient = ref(false);

onMounted(() => {
  isClient.value = true;
});

const {
  data: school,
  pending,
  error,
  refresh,
} = await useAsyncData<School>(
  'school',
  async (): Promise<School> => {
    const schoolId = route.params.id as string;
    return await $fetch(`/api/schools/${schoolId}`);
  },
  {
    server: true,
    lazy: false,
  }
);

useHead(() => ({
  title: school.value?.name ?? 'Loading School...',
  meta: [
    {
      name: 'description',
      content: `Learn about ${school.value?.name} - ${school.value?.description}`,
    },
    {
      property: 'og:image',
      content: school.value?.images?.[0] ?? '',
    },
  ],
}));
</script>

<style scoped>
.feature-card {
  border-radius: 12px;
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.15);
}

.text-gradient {
  background-image: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
}

:deep(.n-card) {
  background-color: var(--color-background-card) !important;
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.15);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

:deep(.n-card:hover) {
  transform: translateY(-4px);
  border-color: rgba(var(--color-primary-rgb), 0.3);
  box-shadow:
    0 0 30px rgba(var(--color-primary-rgb), 0.1),
    0 0 2px rgba(var(--color-primary-rgb), 0.3);
}

:deep(.n-card-header) {
  padding: 1.5rem !important;
}

:deep(.n-card__content) {
  padding: 1.5rem 2rem 2rem !important;
}

:deep(.n-card__content-inner) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-card:hover::before {
  opacity: 1;
}
</style>
