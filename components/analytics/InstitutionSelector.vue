<!-- components/analytics/InstitutionSelector.vue -->
<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-text-primary">{{ label }}</label>
      <n-button
        v-if="currentInstitution && !selected"
        quaternary
        size="small"
        @click="selectCurrentInstitution"
      >
        Use Current
      </n-button>
    </div>

    <n-select
      :value="selected"
      placeholder="Search and select an institution..."
      filterable
      remote
      :loading="loading"
      :options="institutionOptions"
      :disabled="disabled"
      clearable
      @update:value="handleSelection"
      @search="handleSearch"
    >
      <template #empty>
        <div class="text-center py-4">
          <Icon
            name="ph:magnifying-glass"
            class="text-2xl text-text-secondary mb-2"
          />
          <p class="text-sm text-text-secondary">
            {{
              searchQuery
                ? 'No institutions found'
                : 'Start typing to search institutions'
            }}
          </p>
        </div>
      </template>
    </n-select>

    <!-- Selected Institution Preview -->
    <div v-if="selectedInstitution" class="mt-4">
      <n-card size="small">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
            >
              <Icon
                :name="getInstitutionIcon(selectedInstitution.type)"
                class="text-xl text-primary"
              />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-text-primary truncate">
              {{ selectedInstitution.name }}
            </h4>
            <div class="flex items-center space-x-4 mt-1">
              <span class="text-xs text-text-secondary">
                {{ selectedInstitution.type }}
              </span>
              <span
                v-if="selectedInstitution.studentCount"
                class="text-xs text-text-secondary"
              >
                {{ selectedInstitution.studentCount.toLocaleString() }} students
              </span>
              <span
                v-if="selectedInstitution.overallScore"
                class="text-xs text-text-secondary"
              >
                Score: {{ selectedInstitution.overallScore.toFixed(1) }}
              </span>
            </div>
          </div>

          <div class="flex-shrink-0">
            <n-tag
              :type="
                getPerformanceTagType(selectedInstitution.performanceCategory)
              "
              size="small"
            >
              {{ selectedInstitution.performanceCategory || 'N/A' }}
            </n-tag>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { NSelect, NCard, NTag, NButton } from 'naive-ui';
import { Icon } from '#components';
import { debounce } from 'lodash';
import type { InstitutionOverviewDto } from '~/stores/analytics';

interface Props {
  selected?: string | null;
  label: string;
  disabledOptions?: string[];
  currentInstitution?: string | null;
  disabled?: boolean;
}

interface Emits {
  (e: 'update:selected', value: string | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  selected: null,
  disabledOptions: () => [],
  disabled: false,
});

const emit = defineEmits<Emits>();

// State
const loading = ref(false);
const searchQuery = ref('');
const institutions = ref<InstitutionOverviewDto[]>([]);
const selectedInstitution = ref<InstitutionOverviewDto | null>(null);

// Computed
const institutionOptions = computed(() => {
  return institutions.value
    .filter((inst) => !props.disabledOptions.includes(inst.institutionId))
    .map((inst) => ({
      label: `${inst.name} (${inst.type})`,
      value: inst.institutionId,
      disabled: false,
    }));
});

// Debounced search function
const debouncedSearch = debounce(async (query: string) => {
  if (!query || query.length < 2) {
    institutions.value = [];
    return;
  }

  loading.value = true;
  try {
    // Search institutions - this would be an actual API call
    const response = await $apiFetch<InstitutionOverviewDto[]>(
      '/institutions/search',
      {
        query: { q: query, limit: 20 },
      }
    );
    institutions.value = response;
  } catch (error) {
    console.error('Failed to search institutions:', error);
    institutions.value = [];
  } finally {
    loading.value = false;
  }
}, 300);

// Methods
const handleSearch = (query: string) => {
  searchQuery.value = query;
  debouncedSearch(query);
};

const handleSelection = async (value: string | null) => {
  emit('update:selected', value);

  if (value) {
    // Find the selected institution details
    let institution = institutions.value.find(
      (inst) => inst.institutionId === value
    );

    if (!institution) {
      // Fetch institution details if not in current list
      try {
        const dashboard = await $apiFetch(`/analytics/dashboard/${value}`);
        institution = dashboard.overview;
      } catch (error) {
        console.error('Failed to fetch institution details:', error);
      }
    }

    selectedInstitution.value = institution || null;
  } else {
    selectedInstitution.value = null;
  }
};

const selectCurrentInstitution = () => {
  if (props.currentInstitution) {
    handleSelection(props.currentInstitution);
  }
};

const getInstitutionIcon = (type: string) => {
  if (type?.toLowerCase().includes('university')) {
    return 'ph:university';
  } else if (type?.toLowerCase().includes('school')) {
    return 'ph:chalkboard-teacher';
  }
  return 'ph:buildings';
};

const getPerformanceTagType = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'excellent':
      return 'success';
    case 'good':
      return 'info';
    case 'average':
      return 'warning';
    case 'needs improvement':
      return 'error';
    default:
      return 'default';
  }
};

// Watch for external selection changes
watch(
  () => props.selected,
  (newValue) => {
    if (newValue && newValue !== selectedInstitution.value?.institutionId) {
      handleSelection(newValue);
    } else if (!newValue) {
      selectedInstitution.value = null;
    }
  },
  { immediate: true }
);

// Load current institution details on mount if selected
onMounted(() => {
  if (props.selected) {
    handleSelection(props.selected);
  }
});
</script>
