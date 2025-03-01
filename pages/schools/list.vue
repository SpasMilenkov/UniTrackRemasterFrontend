<template>
  <n-space vertical class="w-full max-w-6xl mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div
      v-motion
      class="text-center mb-12"
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0 }"
      :delay="200"
    >
      <h1
        v-motion
        class="text-5xl md:text-7xl font-bold mb-6"
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="400"
      >
        <span class="text-gradient"> School Index </span>
      </h1>
      <p
        v-motion
        class="text-lg text-text-secondary max-w-2xl mx-auto"
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="600"
      >
        Discover and compare schools that match your needs
      </p>
    </div>

    <!-- Search Section with improved mobile layout -->
    <n-card class="feature-card backdrop-blur-sm mb-8" :bordered="false">
      <n-space vertical :size="16">
        <!-- Search Bar -->
        <n-space align="center" justify="center" class="w-full">
          <n-input-group class="search-group">
            <n-input
              v-model:value="searchTerm"
              placeholder="Search schools..."
              class="w-full"
              size="large"
              @input="handleSearch"
            >
              <template #prefix>
                <Icon
                  name="material-symbols:search"
                  class="text-text-secondary"
                />
              </template>
            </n-input>
            <n-button
              type="tertiary"
              ghost
              size="large"
              class="flex items-center gap-2"
              @click="showFilters = !showFilters"
            >
              <Icon name="material-symbols:tune" class="text-primary" />
              <n-badge
                v-if="activeFilterCount > 0"
                :value="activeFilterCount"
                type="success"
                :max="99"
              />
            </n-button>
          </n-input-group>
        </n-space>

        <!-- Improved Filter Section -->
        <n-collapse-transition :show="showFilters">
          <n-card
            embedded
            :bordered="false"
            class="filter-card bg-background-secondary"
          >
            <n-space vertical :size="12">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-lg text-text-primary">Filters</h3>
                <n-button
                  v-if="activeFilterCount > 0"
                  text
                  type="primary"
                  @click="clearFilters"
                >
                  Clear all
                </n-button>
              </div>

              <!-- Mobile Filter Tabs -->
              <div class="md:hidden">
                <n-tabs
                  v-model:value="activeTab"
                  type="line"
                  class="mobile-filter-tabs"
                >
                  <n-tab-pane
                    v-for="(options, category) in visibleFilters"
                    :key="category"
                    :name="category"
                    :tab="formatFilterCategory(category as FilterCategory)"
                  >
                    <n-space vertical :size="8" class="pt-4">
                      <n-space wrap>
                        <n-tag
                          v-for="option in options"
                          :key="option"
                          :type="
                            isFilterSelected(category as FilterCategory, option)
                              ? 'primary'
                              : 'default'
                          "
                          :bordered="
                            !isFilterSelected(
                              category as FilterCategory,
                              option
                            )
                          "
                          round
                          clickable
                          class="mb-2"
                          @click="
                            toggleFilter(category as FilterCategory, option)
                          "
                        >
                          {{ option }}
                          <template
                            v-if="
                              isFilterSelected(
                                category as FilterCategory,
                                option
                              )
                            "
                            #icon
                          >
                            <Icon name="material-symbols:close" class="mr-1" />
                          </template>
                        </n-tag>
                      </n-space>
                    </n-space>
                  </n-tab-pane>
                </n-tabs>
              </div>

              <!-- Desktop Filter Grid -->
              <div class="hidden md:block">
                <n-grid :cols="3" :x-gap="12" :y-gap="12" responsive="screen">
                  <n-grid-item
                    v-for="(options, category) in visibleFilters"
                    :key="category"
                  >
                    <n-space vertical :size="8">
                      <h4 class="font-medium capitalize text-text-primary">
                        {{ formatFilterCategory(category as FilterCategory) }}
                      </h4>
                      <n-space wrap>
                        <n-tag
                          v-for="option in options"
                          :key="option"
                          :type="
                            isFilterSelected(category as FilterCategory, option)
                              ? 'primary'
                              : 'default'
                          "
                          :bordered="
                            !isFilterSelected(
                              category as FilterCategory,
                              option
                            )
                          "
                          round
                          clickable
                          class="mb-2"
                          @click="
                            toggleFilter(category as FilterCategory, option)
                          "
                        >
                          {{ option }}
                          <template
                            v-if="
                              isFilterSelected(
                                category as FilterCategory,
                                option
                              )
                            "
                            #icon
                          >
                            <Icon name="material-symbols:close" class="mr-1" />
                          </template>
                        </n-tag>
                      </n-space>
                    </n-space>
                  </n-grid-item>
                </n-grid>
              </div>
            </n-space>
          </n-card>
        </n-collapse-transition>
      </n-space>
    </n-card>

    <!-- Active Filters Display -->
    <n-space v-if="activeFilterCount > 0" wrap class="mb-8">
      <n-tag
        v-for="filter in activeFilters"
        :key="`${filter.category}-${filter.value}`"
        type="primary"
        round
        closable
        @close="toggleFilter(filter.category, filter.value)"
      >
        {{ filter.value }}
      </n-tag>
    </n-space>

    <!-- Results count -->
    <div class="mb-4 text-text-secondary">
      Showing {{ filteredSchools.length }} schools
    </div>

    <!-- Loading State -->
    <div
      v-if="initialLoading"
      class="flex flex-col items-center justify-center py-16 px-4"
    >
      <n-spin size="large" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading && filteredSchools.length === 0"
      class="flex flex-col items-center justify-center py-16 px-4"
    >
      <div class="relative mb-6">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary opacity-10 rounded-full blur-xl"
        />
        <div
          class="relative w-16 h-16 bg-background-card rounded-full flex items-center justify-center"
        >
          <Icon
            name="material-symbols:school-outline"
            class="text-primary w-7 h-7"
          />
        </div>
      </div>
      <h3 class="text-xl font-semibold text-text-primary mb-2">
        No Schools Found
      </h3>
      <p class="text-text-secondary text-center mb-6 max-w-md">
        {{ getEmptyStateMessage() }}
      </p>
      <n-button
        v-if="activeFilterCount > 0"
        type="primary"
        class="transform hover:scale-105 transition-all duration-300"
        @click="clearFilters"
      >
        Clear All Filters
      </n-button>
    </div>

    <!-- Schools Grid with Infinite Scroll -->
    <n-infinite-scroll
      v-else
      :on-reach-bottom="loadMoreSchools"
      :distance="500"
      :loading="loading"
      :trigger="scrollTriggerEl"
    >
      <div class="min-h-[295px]">
        <!-- Adjust min-height as needed based on your card size -->
        <template v-if="loading">
          <div class="flex items-center justify-center py-16 px-4">
            <n-spin size="large" />
          </div>
        </template>
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SchoolCard
              v-for="school in displayedSchools"
              :key="school.id"
              :school="school"
            />
          </div>
        </template>
      </div>

      <!-- Trigger element -->
      <div ref="scrollTriggerRef" class="h-px w-full" />
    </n-infinite-scroll>
    <!-- Back to Top Button -->
    <n-back-top :right="20" :bottom="20">
      <n-button circle type="primary">
        <template #icon>
          <Icon name="material-symbols:arrow-upward" />
        </template>
      </n-button>
    </n-back-top>
  </n-space>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { debounce } from 'lodash';
import type { FilterState } from '~/interfaces/filter-state';

type FilterCategory = keyof FilterState;

// Stores
const schoolStore = useSchoolStore();

// State
const searchTerm = ref('');
const showFilters = ref(false);
const loading = ref(false);
const initialLoading = ref(true);
const page = ref(1);
const hasMore = ref(true);
const scrollTriggerRef = ref<HTMLElement | null>(null);
const activeTab = ref<FilterCategory>('institutionType');

const selectedFilters = ref<FilterState>({
  institutionType: [],
  schoolType: [],
  universityType: [],
  schoolLevel: [],
  universityLevel: [],
  location: [],
  focusArea: [],
});

// Computed
const showUniversityFilters = computed(() => {
  return (
    selectedFilters.value.institutionType.includes('University') ||
    selectedFilters.value.institutionType.length === 0
  );
});

const showSchoolFilters = computed(() => {
  return (
    selectedFilters.value.institutionType.includes('School') ||
    selectedFilters.value.institutionType.length === 0
  );
});

const scrollTriggerEl = computed(() => {
  return scrollTriggerRef.value ? window : undefined;
});

const activeFilterCount = computed(() => {
  return Object.values(selectedFilters.value).reduce(
    (count, filters) => count + filters.length,
    0
  );
});

const activeFilters = computed(() => {
  return (Object.keys(selectedFilters.value) as FilterCategory[]).flatMap(
    (category) =>
      selectedFilters.value[category].map((value) => ({
        category,
        value,
      }))
  );
});

const visibleFilters = computed(() => {
  const filters: Record<string, string[]> = {
    institutionType: ['School', 'University'],
  };

  if (showSchoolFilters.value) {
    filters.schoolType = [
      'Public School',
      'Private School',
      'Charter School',
      'International School',
    ];
    filters.schoolLevel = [
      'Early Childhood',
      'Elementary',
      'Middle School',
      'High School',
      'K-12',
    ];
  }

  if (showUniversityFilters.value) {
    filters.universityType = [
      'Public University',
      'Private University',
      'Community College',
      'Technical College',
      'Liberal Arts College',
    ];
    filters.universityLevel = [
      "Associate's",
      "Bachelor's",
      "Master's",
      'Doctorate',
    ];
    filters.focusArea = [
      'Liberal Arts',
      'STEM',
      'Business',
      'Medical',
      'Law',
      'Arts',
      'Technical',
      'Research',
    ];
  }

  filters.location = ['Urban', 'Suburban', 'Rural'];
  return filters;
});

const filteredSchools = computed(() => {
  return (schoolStore.schools || []).filter((school) => {
    const searchMatch =
      !searchTerm.value ||
      school.name.toLowerCase().includes(searchTerm.value.toLowerCase());

    const typeMatch =
      selectedFilters.value.institutionType.length === 0 ||
      selectedFilters.value.institutionType.includes(school.type);

    return searchMatch && typeMatch;
  });
});

const displayedSchools = computed(() => {
  const itemsPerPage = 9;
  return filteredSchools.value.slice(0, page.value * itemsPerPage);
});

const loadMoreSchools = async () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  try {
    await schoolStore.getSchools({
      searchTerm: searchTerm.value,
      institutionType: selectedFilters.value.institutionType,
      schoolType: selectedFilters.value.schoolType,
      universityType: selectedFilters.value.universityType,
      schoolLevel: selectedFilters.value.schoolLevel,
      universityLevel: selectedFilters.value.universityLevel,
      location: selectedFilters.value.location,
      focusArea: selectedFilters.value.focusArea,
      page: page.value,
      pageSize: 9,
    });

    page.value++;
    if (schoolStore.schools) {
      hasMore.value = schoolStore.schools.length === 9;
    }
  } catch (error) {
    console.error('Error loading schools:', error);
  } finally {
    loading.value = false;
    initialLoading.value = false;
  }
};

const debouncedSearch = debounce(() => {
  page.value = 1;
  hasMore.value = true;
  initialLoading.value = true;
  schoolStore.$reset();
  loadMoreSchools();
}, 300);

const handleSearch = () => {
  debouncedSearch();
};

const handleScroll = () => {
  if (!hasMore.value || loading.value) return;

  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const clientHeight = document.documentElement.clientHeight;
  const bottomOffset = 500; // Trigger loading 500px before reaching bottom

  if (scrollHeight - (scrollTop + clientHeight) < bottomOffset) {
    loadMoreSchools();
  }
};

const isFilterSelected = (category: FilterCategory, value: string): boolean => {
  return selectedFilters.value[category].includes(value);
};

const toggleFilter = (category: FilterCategory, value: string) => {
  const currentFilters = selectedFilters.value[category];
  if (currentFilters.includes(value)) {
    selectedFilters.value[category] = currentFilters.filter((v) => v !== value);
  } else {
    selectedFilters.value[category] = [...currentFilters, value];
  }

  if (category === 'institutionType') {
    if (value === 'School') {
      selectedFilters.value.universityType = [];
      selectedFilters.value.universityLevel = [];
      selectedFilters.value.focusArea = [];
    } else if (value === 'University') {
      selectedFilters.value.schoolType = [];
      selectedFilters.value.schoolLevel = [];
    }
  }

  page.value = 1;
  hasMore.value = true;
  schoolStore.$reset();
  loadMoreSchools();
};

const formatFilterCategory = (category: string) => {
  return category
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase();
};

const clearFilters = () => {
  selectedFilters.value = {
    institutionType: [],
    schoolType: [],
    universityType: [],
    schoolLevel: [],
    universityLevel: [],
    location: [],
    focusArea: [],
  };
  page.value = 1;
  hasMore.value = true;
  schoolStore.$reset();
  loadMoreSchools();
};

const getEmptyStateMessage = (): string => {
  if (searchTerm.value && activeFilterCount.value > 0) {
    return 'No schools found matching your search terms and filters. Try adjusting your search or removing some filters.';
  } else if (searchTerm.value) {
    return 'No schools found matching your search terms. Try using different keywords.';
  } else if (activeFilterCount.value > 0) {
    return 'No schools found matching your selected filters. Try adjusting or removing some filters.';
  }
  return 'No schools found in the database. Please try again later.';
};

// Lifecycle
onMounted(() => {
  initialLoading.value = true;
  loadMoreSchools();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
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

.n-input-group {
  width: 100%;
  max-width: 600px;
}

.n-scrollbar {
  --n-scrollbar-width: 5px;
}

.n-collapse-transition-enter-active,
.n-collapse-transition-leave-active {
  transition: all 0.3s ease;
}

.n-collapse-transition-enter-from,
.n-collapse-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.search-group {
  width: 100%;
  max-width: 600px;
}

.filter-card {
  max-height: 80vh;
  overflow-y: auto;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .mobile-filter-tabs :deep(.n-tabs-nav) {
    width: 100%;
    overflow-x: auto;
  }

  .mobile-filter-tabs :deep(.n-tabs-nav-scroll-content) {
    display: flex;
    flex-wrap: nowrap;
  }

  .mobile-filter-tabs :deep(.n-tabs-tab) {
    padding: 0.5rem 1rem;
    white-space: nowrap;
  }
}

.n-collapse-transition-enter-active,
.n-collapse-transition-leave-active {
  transition: all 0.3s ease;
}

.n-collapse-transition-enter-from,
.n-collapse-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.animate-float {
  animation: float var(--duration, 15s) ease-in-out infinite alternate;
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
</style>
