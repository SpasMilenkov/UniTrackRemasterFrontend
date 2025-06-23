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
        <span class="text-gradient"> Institution Index </span>
      </h1>
      <p
        v-motion
        class="text-lg text-text-secondary max-w-2xl mx-auto"
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="600"
      >
        Discover educational institutions that match your needs
      </p>
    </div>

    <!-- Search and Filter Section -->
    <n-card class="feature-card backdrop-blur-sm mb-8" :bordered="false">
      <n-space vertical :size="16">
        <!-- Search Bar -->
        <n-space align="center" justify="center" class="w-full">
          <n-input-group class="search-group">
            <n-input
              v-model:value="searchQuery.name"
              placeholder="Search institutions..."
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

        <!-- Filter Section -->
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

              <!-- Institution Type Filter -->
              <div>
                <h4 class="font-medium mb-3 text-text-primary">
                  Institution Type
                </h4>
                <n-space wrap>
                  <n-tag
                    v-for="group in institutionTypeGroups"
                    :key="group.label"
                    :type="
                      isTypeGroupSelected(group.types) ? 'primary' : 'default'
                    "
                    :bordered="!isTypeGroupSelected(group.types)"
                    round
                    clickable
                    class="mb-2"
                    @click="toggleTypeGroup(group.types)"
                  >
                    {{ group.label }}
                    <template v-if="isTypeGroupSelected(group.types)" #icon>
                      <Icon name="material-symbols:close" class="mr-1" />
                    </template>
                  </n-tag>
                </n-space>
              </div>

              <!-- Location Filter -->
              <div>
                <h4 class="font-medium mb-3 text-text-primary">Location</h4>
                <n-space wrap>
                  <n-tag
                    v-for="location in locationTypes"
                    :key="location"
                    :type="
                      searchQuery.location === location ? 'primary' : 'default'
                    "
                    :bordered="searchQuery.location !== location"
                    round
                    clickable
                    class="mb-2"
                    @click="toggleLocation(location)"
                  >
                    {{ location }}
                    <template v-if="searchQuery.location === location" #icon>
                      <Icon name="material-symbols:close" class="mr-1" />
                    </template>
                  </n-tag>
                </n-space>
              </div>

              <!-- Accreditation Filter -->
              <div>
                <h4 class="font-medium mb-3 text-text-primary">
                  Accreditation
                </h4>
                <n-space wrap>
                  <n-tag
                    v-for="accreditation in accreditationTypes"
                    :key="accreditation"
                    :type="
                      selectedAccreditations.includes(accreditation)
                        ? 'primary'
                        : 'default'
                    "
                    :bordered="!selectedAccreditations.includes(accreditation)"
                    round
                    clickable
                    class="mb-2"
                    @click="toggleAccreditation(accreditation)"
                  >
                    {{ accreditation }}
                    <template
                      v-if="selectedAccreditations.includes(accreditation)"
                      #icon
                    >
                      <Icon name="material-symbols:close" class="mr-1" />
                    </template>
                  </n-tag>
                </n-space>
              </div>

              <!-- Integration Status Filter (probably for admin use) -->
              <div>
                <h4 class="font-medium mb-3 text-text-primary">Status</h4>
                <n-space wrap>
                  <n-tag
                    v-for="status in integrationStatuses"
                    :key="status"
                    :type="
                      searchQuery.integrationStatus === status
                        ? 'primary'
                        : 'default'
                    "
                    :bordered="searchQuery.integrationStatus !== status"
                    round
                    clickable
                    class="mb-2"
                    @click="toggleIntegrationStatus(status)"
                  >
                    {{ formatStatusName(status) }}
                    <template
                      v-if="searchQuery.integrationStatus === status"
                      #icon
                    >
                      <Icon name="material-symbols:close" class="mr-1" />
                    </template>
                  </n-tag>
                </n-space>
              </div>
            </n-space>
          </n-card>
        </n-collapse-transition>
      </n-space>
    </n-card>

    <!-- Active Filters Display -->
    <n-space v-if="activeFilterCount > 0" wrap class="mb-8">
      <n-tag
        v-if="searchQuery.type"
        type="primary"
        round
        closable
        @close="searchQuery.type = ''"
      >
        Type: {{ formatTypeName(searchQuery.type) }}
      </n-tag>
      <n-tag
        v-if="searchQuery.location"
        type="primary"
        round
        closable
        @close="searchQuery.location = ''"
      >
        Location: {{ searchQuery.location }}
      </n-tag>
      <n-tag
        v-if="searchQuery.integrationStatus"
        type="primary"
        round
        closable
        @close="searchQuery.integrationStatus = ''"
      >
        Status: {{ formatStatusName(searchQuery.integrationStatus) }}
      </n-tag>
      <n-tag
        v-for="accreditation in selectedAccreditations"
        :key="accreditation"
        type="primary"
        round
        closable
        @close="toggleAccreditation(accreditation)"
      >
        {{ accreditation }}
      </n-tag>
    </n-space>

    <!-- Results count and pagination info -->
    <div class="mb-4 text-text-secondary">
      <span v-if="institutionStore.pagedResult">
        Showing {{ institutionStore.pagedResult.items.length }} of
        {{ institutionStore.pagedResult.totalCount }} institutions (Page
        {{ institutionStore.pagedResult.currentPage }} of
        {{ institutionStore.pagedResult.totalPages }})
      </span>
    </div>

    <!-- Loading State -->
    <div
      v-if="institutionStore.loading"
      class="flex flex-col items-center justify-center py-16 px-4"
    >
      <n-spin size="large" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="
        !institutionStore.loading && !institutionStore.pagedResult?.items.length
      "
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
        No Institutions Found
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

    <!-- Institutions Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      <SchoolCard
        v-for="institution in institutionStore.pagedResult?.items || []"
        :key="institution.id"
        :institution="institution"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="
        institutionStore.pagedResult &&
        institutionStore.pagedResult.totalPages > 1
      "
      class="flex justify-center"
    >
      <n-pagination
        v-model:page="currentPage"
        :page-count="institutionStore.pagedResult.totalPages"
        size="large"
        show-size-picker
        :page-sizes="[10, 20, 50]"
        :page-size="currentPageSize"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>

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
import { ref, computed, onMounted, watch } from 'vue';
import { debounce } from 'lodash';

// Stores
const institutionStore = useInstitutionStore();

// State
const showFilters = ref(false);
const currentPage = ref(1);
const currentPageSize = ref(20);
const selectedAccreditations = ref<string[]>([]);

const searchQuery = ref({
  name: '',
  type: '',
  location: '',
  integrationStatus: '',
  accreditations: '',
});

// Institution type groupings for better UX
const institutionTypeGroups = [
  {
    label: 'Schools',
    types: [
      'PublicSchool',
      'PrivateSchool',
      'CharterSchool',
      'InternationalSchool',
      'PrimarySchool',
      'SecondarySchool',
      'HighSchool',
      'SpecialEducationSchool',
    ],
  },
  {
    label: 'Universities & Colleges',
    types: [
      'PublicUniversity',
      'PrivateUniversity',
      'CommunityCollege',
      'TechnicalCollege',
      'LiberalArtsCollege',
    ],
  },
  {
    label: 'Specialized',
    types: ['VocationalSchool', 'LanguageSchool'],
  },
  {
    label: 'Other',
    types: ['Other'],
  },
];

// Enum values
const locationTypes = ['Urban', 'Suburban', 'Rural'];
const accreditationTypes = [
  'Regional',
  'National',
  'Programmatic',
  'International',
];
const integrationStatuses = [
  'RequiresVerification',
  'Verified',
  'AdditionalDataSubmitted',
  'Denied',
  'Active',
  'Inactive',
];

// Computed
const activeFilterCount = computed(() => {
  let count = 0;
  if (searchQuery.value.type) count++;
  if (searchQuery.value.location) count++;
  if (searchQuery.value.integrationStatus) count++;
  count += selectedAccreditations.value.length;
  return count;
});

// Debounced search function
const debouncedSearch = debounce(() => {
  loadInstitutions();
}, 300);

// Methods
const handleSearch = () => {
  currentPage.value = 1;
  debouncedSearch();
};

const isTypeGroupSelected = (types: string[]): boolean => {
  return types.includes(searchQuery.value.type);
};

const toggleTypeGroup = (types: string[]) => {
  // If any type in this group is selected, clear selection
  if (isTypeGroupSelected(types)) {
    searchQuery.value.type = '';
  } else {
    // Select the first type in the group (you could make this more sophisticated)
    searchQuery.value.type = types[0];
  }
  currentPage.value = 1;
  loadInstitutions();
};

const toggleLocation = (location: string) => {
  searchQuery.value.location =
    searchQuery.value.location === location ? '' : location;
  currentPage.value = 1;
  loadInstitutions();
};

const toggleIntegrationStatus = (status: string) => {
  searchQuery.value.integrationStatus =
    searchQuery.value.integrationStatus === status ? '' : status;
  currentPage.value = 1;
  loadInstitutions();
};

const toggleAccreditation = (accreditation: string) => {
  const index = selectedAccreditations.value.indexOf(accreditation);
  if (index > -1) {
    selectedAccreditations.value.splice(index, 1);
  } else {
    selectedAccreditations.value.push(accreditation);
  }
  searchQuery.value.accreditations = selectedAccreditations.value.join(',');
  currentPage.value = 1;
  loadInstitutions();
};

const clearFilters = () => {
  searchQuery.value = {
    name: '',
    type: '',
    location: '',
    integrationStatus: '',
    accreditations: '',
  };
  selectedAccreditations.value = [];
  currentPage.value = 1;
  loadInstitutions();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadInstitutions();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handlePageSizeChange = (pageSize: number) => {
  currentPageSize.value = pageSize;
  currentPage.value = 1;
  loadInstitutions();
};

const formatTypeName = (type: string): string => {
  return type.replace(/([A-Z])/g, ' $1').trim();
};

const formatStatusName = (status: string): string => {
  return status.replace(/([A-Z])/g, ' $1').trim();
};

const getEmptyStateMessage = (): string => {
  if (searchQuery.value.name && activeFilterCount.value > 0) {
    return 'No institutions found matching your search terms and filters. Try adjusting your search or removing some filters.';
  } else if (searchQuery.value.name) {
    return 'No institutions found matching your search terms. Try using different keywords.';
  } else if (activeFilterCount.value > 0) {
    return 'No institutions found matching your selected filters. Try adjusting or removing some filters.';
  }
  return 'No institutions found in the database. Please try again later.';
};

const loadInstitutions = async () => {
  try {
    await institutionStore.fetchFilteredInstitutions(searchQuery.value, {
      page: currentPage.value,
      pageSize: currentPageSize.value,
    });
  } catch (error) {
    console.error('Error loading institutions:', error);
  }
};

// Lifecycle
onMounted(() => {
  loadInstitutions();
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

.search-group {
  width: 100%;
  max-width: 600px;
}

.filter-card {
  max-height: 80vh;
  overflow-y: auto;
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
</style>
