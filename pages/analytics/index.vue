<!-- pages/analytics/index.vue -->
<template>
  <div class="p-6 space-y-6">
    <!-- Dashboard Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-text-primary mb-2">
          Institution Overview
        </h2>
        <p class="text-text-secondary">
          Comprehensive analytics and performance insights
        </p>
      </div>

      <div class="flex items-center space-x-3">
        <n-tag
          :type="getPerformanceTagType(dashboard?.overview.performanceCategory)"
        >
          {{ dashboard?.overview.performanceCategory || 'Loading...' }}
        </n-tag>

        <n-button
          type="primary"
          :loading="loadingReports"
          @click="handleGenerateReport"
        >
          <template #icon>
            <Icon name="ph:file-text" />
          </template>
          Generate Report
        </n-button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loadingDashboard" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <n-skeleton v-for="i in 4" :key="i" height="120px" />
      </div>
      <n-skeleton height="300px" />
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboard" class="space-y-6">
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsMetricCard
          title="Overall Score"
          :value="formatScore(dashboard.overview.overallScore)"
          :trend="getScoreTrend()"
          icon="ph:chart-line-up"
          color="primary"
        />

        <AnalyticsMetricCard
          title="Student Count"
          :value="dashboard.overview.studentCount.toLocaleString()"
          :trend="getStudentGrowthTrend()"
          icon="ph:users"
          color="info"
        />

        <AnalyticsMetricCard
          title="National Rank"
          :value="
            formatRank(
              dashboard.overview.nationalRank,
              dashboard.comparisons.rankings.totalInstitutions
            )
          "
          icon="ph:medal"
          color="warning"
        />

        <AnalyticsMetricCard
          title="Attendance Rate"
          :value="formatPercentage(dashboard.performance.attendanceRate)"
          :trend="getAttendanceTrend()"
          icon="ph:calendar-check"
          color="success"
        />
      </div>

      <!-- Performance Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Performance Metrics Chart -->
        <n-card title="Performance Metrics" class="h-96">
          <AnalyticsRadarChart
            :data="getRadarChartData()"
            :options="radarChartOptions"
          />
        </n-card>

        <!-- Trends Chart -->
        <n-card title="Performance Trends" class="h-96">
          <AnalyticsTrendChart
            :data="getTrendChartData()"
            :options="trendChartOptions"
          />
        </n-card>
      </div>

      <!-- Achievements and Recommendations -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Achievements -->
        <n-card title="Recent Achievements">
          <template #header-extra>
            <n-badge :value="dashboard.achievements.length" type="success" />
          </template>

          <div class="space-y-4 max-h-80 overflow-y-auto">
            <AnalyticsAchievementCard
              v-for="achievement in dashboard.achievements.slice(0, 5)"
              :key="achievement.title"
              :achievement="achievement"
            />
          </div>

          <template #footer>
            <n-button text type="primary" @click="viewAllAchievements">
              View All Achievements
              <template #icon>
                <Icon name="ph:arrow-right" />
              </template>
            </n-button>
          </template>
        </n-card>

        <!-- AI Recommendations -->
        <n-card title="AI Recommendations">
          <template #header-extra>
            <n-badge
              :value="dashboard.recommendations.length"
              :type="getRecommendationsBadgeType()"
            />
          </template>

          <div class="space-y-4 max-h-80 overflow-y-auto">
            <AnalyticsRecommendationCard
              v-for="recommendation in prioritizedRecommendations.slice(0, 5)"
              :key="recommendation.title"
              :recommendation="recommendation"
              @action-taken="handleRecommendationAction"
            />
          </div>

          <template #footer>
            <n-button text type="primary" @click="viewAllRecommendations">
              View All Recommendations
              <template #icon>
                <Icon name="ph:arrow-right" />
              </template>
            </n-button>
          </template>
        </n-card>
      </div>

      <!-- Peer Comparisons -->
      <n-card title="Peer Comparison">
        <template #header-extra>
          <n-button
            quaternary
            size="small"
            :loading="loadingSimilar"
            @click="refreshSimilarInstitutions"
          >
            <template #icon>
              <Icon name="ph:arrow-clockwise" />
            </template>
            Refresh
          </n-button>
        </template>

        <AnalyticsPeerComparisonTable
          :institutions="similarInstitutions"
          :current-institution="dashboard.overview"
          @compare="handleCompareInstitution"
        />
      </n-card>

      <!-- Subject Performance -->
      <n-card title="Subject Performance">
        <AnalyticsSubjectChart
          :data="getSubjectChartData()"
          :benchmarks="dashboard.comparisons.benchmarks.subjectBenchmarks"
          :options="subjectChartOptions"
        />
      </n-card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Icon
        name="ph:chart-line"
        class="text-6xl text-text-secondary mb-4 mx-auto"
      />
      <h3 class="text-lg font-medium text-text-primary mb-2">
        No Analytics Data Available
      </h3>
      <p class="text-text-secondary mb-4">
        Unable to load analytics data for this institution.
      </p>
      <n-button type="primary" @click="retryFetch">
        <template #icon>
          <Icon name="ph:arrow-clockwise" />
        </template>
        Retry
      </n-button>
    </div>

    <!-- Generate Report Modal -->
    <AnalyticsReportModal
      v-model:show="showReportModal"
      :institution-id="currentInstitutionId"
      @report-generated="handleReportGenerated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { NCard, NButton, NTag, NBadge, NSkeleton, useMessage } from 'naive-ui';
import { Icon } from '#components';
import { useAnalyticsFormatters, useAnalyticsNotifications, useChartTheme, useReportPolling } from '~/composables/useAnalyticsPolling';
import { useAnalyticsStore } from '~/stores/analytics';

// Stores and composables
const analyticsStore = useAnalyticsStore();
const institutionStore = useInstitutionStore();
const router = useRouter();
const message = useMessage();

// Composables
const { formatScore, formatPercentage, formatRank, formatTrend } =
  useAnalyticsFormatters();
const { getChartOptions, getTrendColor, getPriorityColor } = useChartTheme();
const { startPolling } = useReportPolling();
const { showSuccessNotification } = useAnalyticsNotifications();

// State
const showReportModal = ref(false);

// Computed properties
const dashboard = computed(() => analyticsStore.dashboard);
const similarInstitutions = computed(() => analyticsStore.similarInstitutions);
const currentInstitutionId = computed(
  () => institutionStore.activeInstitution?.id
);

const loadingDashboard = computed(() => analyticsStore.loadingDashboard);
const loadingSimilar = computed(() => analyticsStore.loadingSimilar);
const loadingReports = computed(() => analyticsStore.loadingReports);

const prioritizedRecommendations = computed(() => {
  if (!dashboard.value) return [];

  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  return [...dashboard.value.recommendations].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
});

// Chart data preparation
const getRadarChartData = () => {
  if (!dashboard.value) return null;

  const performance = dashboard.value.performance;
  const benchmarks = dashboard.value.comparisons.benchmarks;

  return {
    labels: [
      'Academic Score',
      'Attendance Rate',
      'Teacher Retention',
      'Student-Teacher Ratio',
      'Growth Rate',
    ],
    datasets: [
      {
        label: 'Current Performance',
        data: [
          performance.academicScore,
          performance.attendanceRate,
          performance.teacherRetention,
          100 - performance.studentTeacherRatio, // Invert for better visualization
          performance.yearOverYearGrowth + 50, // Normalize for radar
        ],
        borderColor: getTrendColor('Up'),
        backgroundColor: getTrendColor('Up') + '20',
        pointBackgroundColor: getTrendColor('Up'),
      },
      {
        label: 'National Average',
        data: [
          benchmarks.nationalAverage,
          75, // Default attendance benchmark
          70, // Default retention benchmark
          85, // Default ratio benchmark (inverted)
          50, // Neutral growth
        ],
        borderColor: '#6b7280',
        backgroundColor: '#6b728020',
        pointBackgroundColor: '#6b7280',
      },
    ],
  };
};

const getTrendChartData = () => {
  if (!dashboard.value) return null;

  // Use the first trend with data points, or create sample data
  const trend = dashboard.value.trends[0];
  if (!trend || !trend.dataPoints.length) return null;

  return {
    labels: trend.dataPoints.map((point) =>
      new Date(point.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: trend.name,
        data: trend.dataPoints.map((point) => point.value),
        borderColor: getTrendColor(trend.direction),
        backgroundColor: getTrendColor(trend.direction) + '20',
        tension: 0.3,
        fill: true,
      },
    ],
  };
};

const getSubjectChartData = () => {
  if (!dashboard.value) return null;

  const subjects = Object.entries(dashboard.value.performance.subjectScores);
  const benchmarks = dashboard.value.comparisons.benchmarks.subjectBenchmarks;

  return {
    labels: subjects.map(([subject]) => subject),
    datasets: [
      {
        label: 'Institution Score',
        data: subjects.map(([, score]) => score),
        backgroundColor: getTrendColor('Up'),
      },
      {
        label: 'National Average',
        data: subjects.map(([subject]) => benchmarks[subject] || 0),
        backgroundColor: '#6b7280',
      },
    ],
  };
};

// Chart options
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

const trendChartOptions = computed(() =>
  getChartOptions({
    plugins: {
      legend: {
        display: true,
      },
    },
  })
);

const subjectChartOptions = computed(() =>
  getChartOptions({
    indexAxis: 'y',
    plugins: {
      legend: {
        display: true,
      },
    },
  })
);

// Helper methods
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

const getRecommendationsBadgeType = () => {
  const criticalCount = prioritizedRecommendations.value.filter(
    (r) => r.priority === 'Critical'
  ).length;
  if (criticalCount > 0) return 'error';

  const highCount = prioritizedRecommendations.value.filter(
    (r) => r.priority === 'High'
  ).length;
  if (highCount > 2) return 'warning';

  return 'info';
};

const getScoreTrend = () => {
  // This would typically come from trend data
  const growth = dashboard.value?.performance.yearOverYearGrowth || 0;
  return {
    direction: growth >= 0 ? 'up' : 'down',
    value: formatTrend(growth),
  };
};

const getStudentGrowthTrend = () => {
  // This would typically come from enrollment trends
  return {
    direction: 'up',
    value: '+5.2%',
  };
};

const getAttendanceTrend = () => {
  return {
    direction: 'up',
    value: '+2.1%',
  };
};

// Action handlers
const handleGenerateReport = () => {
  showReportModal.value = true;
};

const handleReportGenerated = (job: any) => {
  showSuccessNotification(
    'Report Generation Started',
    `Report will be available shortly. Job ID: ${job.id}`
  );
  startPolling(job.id);
  showReportModal.value = false;
};

const handleRecommendationAction = (recommendation: any) => {
  showSuccessNotification(
    'Action Noted',
    `Marked action for: ${recommendation.title}`
  );
};

const handleCompareInstitution = (institution: any) => {
  router.push({
    path: '/analytics/compare',
    query: {
      compare: institution.institutionId,
    },
  });
};

const viewAllAchievements = () => {
  message.info('Detailed achievements view coming soon');
};

const viewAllRecommendations = () => {
  router.push(`/analytics/recommendations/${currentInstitutionId.value}`);
};

const refreshSimilarInstitutions = async () => {
  await analyticsStore.fetchSimilarInstitutions();
  showSuccessNotification('Peer Data Refreshed');
};

const retryFetch = async () => {
  await analyticsStore.refreshDashboard();
};

// Initialize
onMounted(async () => {
  if (!dashboard.value && currentInstitutionId.value) {
    await analyticsStore.fetchDashboard();
  }
});

// SEO
useHead({
  title: 'Analytics Dashboard',
  meta: [
    {
      name: 'description',
      content:
        'Comprehensive analytics dashboard showing institution performance metrics, trends, and AI-powered recommendations.',
    },
  ],
});

definePageMeta({
  layout: 'analytics',
});


</script>
