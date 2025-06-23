<!-- components/analytics/TopPerformersTable.vue -->
<template>
  <div class="space-y-4">
    <!-- Search and Filters -->
    <div class="flex items-center justify-between">
      <n-input-group style="width: 250px">
        <n-input
          v-model:value="searchQuery"
          placeholder="Search institutions..."
          clearable
        >
          <template #prefix>
            <Icon name="ph:magnifying-glass" />
          </template>
        </n-input>
      </n-input-group>

      <n-select
        v-model:value="selectedType"
        :options="typeOptions"
        placeholder="All Types"
        style="width: 120px"
        clearable
      />
    </div>

    <!-- Performers List -->
    <div class="max-h-64 overflow-y-auto space-y-2">
      <div
        v-for="performer in filteredPerformers"
        :key="performer.id"
        class="flex items-center justify-between p-3 bg-background-secondary rounded-lg hover:bg-background-tertiary transition-colors cursor-pointer"
        @click="$emit('institutionSelected', performer)"
      >
        <div class="flex items-center space-x-3">
          <!-- Rank Badge -->
          <div
            class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm"
          >
            {{ performer.rank }}
          </div>

          <!-- Institution Info -->
          <div>
            <h4 class="font-medium text-text-primary">{{ performer.name }}</h4>
            <div
              class="flex items-center space-x-2 text-sm text-text-secondary"
            >
              <n-tag size="small" :type="getTypeTagType(performer.type)">
                {{ performer.type }}
              </n-tag>
              <span v-if="performer.category">• {{ performer.category }}</span>
            </div>
          </div>
        </div>

        <div class="text-right">
          <!-- Score -->
          <p class="font-semibold text-text-primary">
            {{ formatScore(performer.score) }}
          </p>

          <!-- Change Indicator -->
          <div class="flex items-center justify-end space-x-1 text-sm">
            <Icon
              :name="
                performer.changeFromPrevious >= 0
                  ? 'ph:arrow-up'
                  : 'ph:arrow-down'
              "
              :class="
                performer.changeFromPrevious >= 0
                  ? 'text-success'
                  : 'text-error'
              "
              class="text-xs"
            />
            <span
              :class="
                performer.changeFromPrevious >= 0
                  ? 'text-success'
                  : 'text-error'
              "
            >
              {{ formatChange(performer.changeFromPrevious) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Show More Button -->
    <div v-if="hasMore" class="text-center pt-2">
      <n-button text type="primary" size="small" @click="showAll = !showAll">
        {{
          showAll
            ? 'Show Less'
            : `Show ${performers.length - displayLimit} More`
        }}
        <template #icon>
          <Icon :name="showAll ? 'ph:caret-up' : 'ph:caret-down'" />
        </template>
      </n-button>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPerformers.length === 0" class="text-center py-8">
      <Icon
        name="ph:buildings"
        class="text-4xl text-text-secondary mb-2 mx-auto"
      />
      <p class="text-text-secondary">No institutions found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NInput, NInputGroup, NSelect, NTag, NButton } from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsFormatters } from '~/composables/useAnalyticsPolling';
import type { InstitutionRankingDto } from '~/stores/analytics';

// Props & Emits
interface Props {
  performers: InstitutionRankingDto[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  institutionSelected: [institution: InstitutionRankingDto];
}>();

// Composables
const { formatScore } = useAnalyticsFormatters();

// State
const searchQuery = ref('');
const selectedType = ref<string | null>(null);
const showAll = ref(false);
const displayLimit = 10;

// Computed
const typeOptions = computed(() => {
  const types = [...new Set(props.performers.map((p) => p.type))];
  return types.map((type) => ({ label: type, value: type }));
});

const filteredPerformers = computed(() => {
  let filtered = [...props.performers];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
  }

  // Apply type filter
  if (selectedType.value) {
    filtered = filtered.filter((p) => p.type === selectedType.value);
  }

  // Apply display limit
  if (!showAll.value && filtered.length > displayLimit) {
    filtered = filtered.slice(0, displayLimit);
  }

  return filtered;
});

const hasMore = computed(() => {
  let baseCount = [...props.performers];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    baseCount = baseCount.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
  }

  if (selectedType.value) {
    baseCount = baseCount.filter((p) => p.type === selectedType.value);
  }

  return baseCount.length > displayLimit && !showAll.value;
});

// Helper methods
const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    University: 'info',
    School: 'success',
    College: 'warning',
    Institute: 'default',
  };
  return typeMap[type] || 'default';
};

const formatChange = (change: number) => {
  if (change === 0) return '—';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change}`;
};
</script>
