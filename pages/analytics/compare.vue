<!-- pages/analytics/compare.vue -->
<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-text-primary mb-2">
          Institution Comparison
        </h2>
        <p class="text-text-secondary">
          Compare performance metrics between institutions
        </p>
      </div>

      <n-button
        type="primary"
        @click="generateComparisonReport"
        :loading="loadingComparisons"
      >
        <template #icon>
          <Icon name="ph:file-text" />
        </template>
        Generate Report
      </n-button>
    </div>

    <!-- Institution Selector -->
    <n-card title="Select Institutions to Compare">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InstitutionSelector
          v-model:selected="selectedInstitution1"
          label="Institution 1"
          :disabled-options="selectedInstitution2 ? [selectedInstitution2] : []"
          :current-institution="currentInstitutionId"
        />
        <InstitutionSelector
          v-model:selected="selectedInstitution2"
          label="Institution 2"
          :disabled-options="selectedInstitution1 ? [selectedInstitution1] : []"
        />
      </div>

      <div class="mt-4 flex justify-end">
        <n-button
          type="primary"
          :disabled="!canCompare"
          :loading="loadingComparisons"
          @click="performComparison"
        >
          Compare Institutions
        </n-button>
      </div>
    </n-card>

    <!-- Comparison Results -->
    <div v-if="currentComparison" class="space-y-6">
      <!-- Overview Comparison -->
      <n-card title="Overview Comparison">
        <ComparisonTable
          :institution1="currentComparison.institution1"
          :institution2="currentComparison.institution2"
          :comparison-data="getOverviewComparisonData()"
        />
      </n-card>

      <!-- Performance Radar Chart -->
      <n-card title="Performance Comparison" class="h-96">
        <AnalyticsRadarChart
          :data="getComparisonRadarData()"
          :options="radarChartOptions"
        />
      </n-card>

      <!-- Detailed Metrics Comparison -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <n-card title="Academic Performance">
          <ComparisonMetricsList
            :metrics="getAcademicMetrics()"
            :institution1="currentComparison.institution1"
            :institution2="currentComparison.institution2"
          />
        </n-card>

        <n-card title="Operational Metrics">
          <ComparisonMetricsList
            :metrics="getOperationalMetrics()"
            :institution1="currentComparison.institution1"
            :institution2="currentComparison.institution2"
          />
        </n-card>
      </div>

      <!-- Side-by-Side Recommendations -->
      <n-card title="AI Recommendations">
        <RecommendationsSideBySide
          :institution1-recommendations="institution1Recommendations"
          :institution2-recommendations="institution2Recommendations"
          :institution1="currentComparison.institution1"
          :institution2="currentComparison.institution2"
        />
      </n-card>

      <!-- Comparison Analysis -->
      <n-card title="AI Analysis">
        <div class="prose prose-sm dark:prose-invert max-w-none">
          <div
            v-html="formatAnalysisText(currentComparison.comparisonAnalysis)"
          ></div>
        </div>
        <div class="mt-4 text-xs text-text-secondary">
          Generated: {{ formatDateTime(currentComparison.generatedAt) }}
        </div>
      </n-card>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loadingComparisons" class="text-center py-12">
      <Icon
        name="ph:scales"
        class="text-6xl text-text-secondary mb-4 mx-auto"
      />
      <h3 class="text-lg font-medium text-text-primary mb-2">
        Ready to Compare
      </h3>
      <p class="text-text-secondary">
        Select two institutions above to generate a detailed comparison
      </p>
    </div>

    <!-- Loading State -->
    <div v-else class="space-y-6">
      <n-skeleton height="200px" />
      <n-skeleton height="300px" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <n-skeleton height="250px" />
        <n-skeleton height="250px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { NCard, NButton, NSkeleton, useMessage } from 'naive-ui';
import { Icon } from '#components';
import {
  useAnalyticsStore,
  type InstitutionComparisonDto,
  type RecommendationDto,
} from '~/stores/analytics';
import {
  useAnalyticsFormatters,
  useChartTheme,
} from '~/composables/useAnalyticsPolling';

// Stores and composables
const analyticsStore = useAnalyticsStore();
const institutionStore = useInstitutionStore();
const route = useRoute();
const router = useRouter();
const message = useMessage();

// Composables
const { formatDateTime } = useAnalyticsFormatters();
const { getChartOptions, getTrendColor } = useChartTheme();

// State
const selectedInstitution1 = ref<string | null>(null);
const selectedInstitution2 = ref<string | null>(null);
const currentComparison = ref<InstitutionComparisonDto | null>(null);
const institution1Recommendations = ref<RecommendationDto[]>([]);
const institution2Recommendations = ref<RecommendationDto[]>([]);

// Computed
const currentInstitutionId = computed(
  () => institutionStore.activeInstitution?.id
);
const loadingComparisons = computed(() => analyticsStore.loadingComparisons);

const canCompare = computed(
  () =>
    selectedInstitution1.value &&
    selectedInstitution2.value &&
    selectedInstitution1.value !== selectedInstitution2.value
);

// Initialize from query params
watch(
  () => route.query,
  (query) => {
    if (query.institution1)
      selectedInstitution1.value = query.institution1 as string;
    if (query.institution2)
      selectedInstitution2.value = query.institution2 as string;
    if (query.compare && currentInstitutionId.value) {
      selectedInstitution1.value = currentInstitutionId.value;
      selectedInstitution2.value = query.compare as string;
    }
  },
  { immediate: true }
);

// Methods
const performComparison = async () => {
  if (!canCompare.value) return;

  try {
    const comparison = await analyticsStore.compareInstitutions({
      institution1Id: selectedInstitution1.value!,
      institution2Id: selectedInstitution2.value!,
    });

    currentComparison.value = comparison;

    // Fetch recommendations for both institutions
    await Promise.all([
      fetchInstitutionRecommendations(selectedInstitution1.value!),
      fetchInstitutionRecommendations(selectedInstitution2.value!),
    ]);

    // Update URL
    router.replace({
      query: {
        institution1: selectedInstitution1.value,
        institution2: selectedInstitution2.value,
      },
    });
  } catch (error: any) {
    message.error('Failed to generate comparison: ' + error.message);
  }
};

const fetchInstitutionRecommendations = async (institutionId: string) => {
  try {
    const recommendations = await $apiFetch<RecommendationDto[]>(
      `/analytics/recommendations/${institutionId}`
    );

    if (institutionId === selectedInstitution1.value) {
      institution1Recommendations.value = recommendations;
    } else {
      institution2Recommendations.value = recommendations;
    }
  } catch (error) {
    console.warn(
      `Failed to fetch recommendations for ${institutionId}:`,
      error
    );
  }
};

const getOverviewComparisonData = () => {
  if (!currentComparison.value) return [];

  const inst1 = currentComparison.value.institution1;
  const inst2 = currentComparison.value.institution2;

  return [
    {
      metric: 'Overall Score',
      institution1: inst1.overallScore.toFixed(1),
      institution2: inst2.overallScore.toFixed(1),
      difference: (inst1.overallScore - inst2.overallScore).toFixed(1),
      winner:
        inst1.overallScore > inst2.overallScore
          ? 'institution1'
          : 'institution2',
    },
    // Add more comparison metrics as needed
  ];
};

const getComparisonRadarData = () => {
  if (!currentComparison.value) return null;

  return {
    labels: [
      'Academic Score',
      'Attendance',
      'Retention',
      'Growth',
      'Student Ratio',
    ],
    datasets: [
      {
        label: currentComparison.value.institution1.name,
        data: [85, 90, 75, 80, 85], // Replace with actual data
        borderColor: getTrendColor('Up'),
        backgroundColor: getTrendColor('Up') + '20',
        pointBackgroundColor: getTrendColor('Up'),
      },
      {
        label: currentComparison.value.institution2.name,
        data: [78, 85, 70, 75, 80], // Replace with actual data
        borderColor: getTrendColor('Down'),
        backgroundColor: getTrendColor('Down') + '20',
        pointBackgroundColor: getTrendColor('Down'),
      },
    ],
  };
};

const getAcademicMetrics = () => [
  'Academic Score',
  'Year-over-Year Growth',
  'Subject Performance',
  'Student Achievement Rate',
];

const getOperationalMetrics = () => [
  'Attendance Rate',
  'Teacher Retention',
  'Student-Teacher Ratio',
  'Resource Utilization',
];

const radarChartOptions = computed(() =>
  getChartOptions({
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
  })
);

const formatAnalysisText = (text: string) => {
  // Simple formatting for AI analysis text
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const generateComparisonReport = async () => {
  if (!canCompare.value) {
    message.warning('Please select two institutions to compare first');
    return;
  }

  try {
    const report = await analyticsStore.generateReport({
      institutionId: selectedInstitution1.value!,
      periodType: 'Quarterly',
      includeAIInsights: true,
      generateRecommendations: true,
    });

    message.success('Comparison report generation started');
    router.push('/analytics/reports');
  } catch (error: any) {
    message.error('Failed to generate report: ' + error.message);
  }
};

// Auto-compare if both institutions are selected on mount
onMounted(() => {
  if (canCompare.value) {
    performComparison();
  }
});

// SEO
useHead({
  title: 'Institution Comparison - Analytics',
  meta: [
    {
      name: 'description',
      content:
        'Compare performance metrics and AI insights between educational institutions.',
    },
  ],
});

definePageMeta({
  layout: 'default',
});
</script>
