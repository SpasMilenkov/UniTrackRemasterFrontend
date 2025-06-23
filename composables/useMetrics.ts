import { ref, computed } from 'vue';
import { useMetricsStore } from '~/stores/metrics';

export function useMetrics() {
  const metricsStore = useMetricsStore();

  // State
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const refreshTimer = ref<number | null>(null);

  // Computed values for quick access in components
  const systemHealth = computed(() => metricsStore.systemHealthScore);
  const totalUsers = computed(() => metricsStore.totalUsers);
  const activeUsers = computed(() => metricsStore.activeUsers);
  const totalInstitutions = computed(() => metricsStore.totalInstitutions);
  const dataFreshness = computed(() => metricsStore.dataFreshness);
  const userDistribution = computed(() => metricsStore.userRoleDistribution);
  const institutionDistribution = computed(
    () => metricsStore.institutionTypeDistribution
  );

  // Dashboard metrics summary for quick display
  const dashboardSummary = computed(() => {
    return {
      systemHealth: {
        score: systemHealth.value,
        status: getHealthStatus(systemHealth.value),
        color: getHealthColor(systemHealth.value),
      },
      users: {
        total: totalUsers.value,
        active: activeUsers.value,
        activePercentage:
          totalUsers.value > 0
            ? (activeUsers.value / totalUsers.value) * 100
            : 0,
      },
      institutions: {
        total: totalInstitutions.value,
        schools: metricsStore.academicStatistics?.schoolCount || 0,
        universities: metricsStore.academicStatistics?.universityCount || 0,
      },
      activity: {
        attendances: metricsStore.activityStatistics?.totalAttendances || 0,
        marks: metricsStore.activityStatistics?.totalMarks || 0,
        applications: metricsStore.activityStatistics?.totalApplications || 0,
      },
      database: {
        connectionUtilization: metricsStore.databaseConnectionUtilization,
        errorRate: metricsStore.databaseMetrics
          ? (metricsStore.databaseMetrics.errorCount /
              metricsStore.databaseMetrics.queryCount) *
            100
          : 0,
        averageQueryTime: metricsStore.databaseMetrics?.averageQueryTime || 0,
      },
      performance: {
        cpuUsage: metricsStore.healthMetrics?.cpuUsage || 0,
        memoryUsage: metricsStore.healthMetrics?.memoryUsage || 0,
        requestRate: metricsStore.healthMetrics?.requestsPerSecond || 0,
      },
      lastUpdated: dataFreshness.value,
    };
  });

  // Get critical metrics for system status
  const criticalStatus = computed(() => {
    // Simple check for system health
    const healthScore = systemHealth.value;
    if (!healthScore) return 'unknown';
    if (healthScore < 60) return 'critical';
    if (healthScore < 70) return 'warning';
    return 'healthy';
  });

  // Helper methods
  const getHealthStatus = (score: number | null): string => {
    if (!score) return 'Unknown';
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Needs Attention';
    return 'Critical';
  };

  const getHealthColor = (score: number | null): string => {
    if (!score) return 'var(--color-text-secondary)';
    if (score >= 90) return '#22c55e'; // Green
    if (score >= 80) return '#3b82f6'; // Blue
    if (score >= 70) return '#f59e0b'; // Amber
    if (score >= 60) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  // Actions
  const loadMetrics = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await metricsStore.fetchAllMetrics();
    } catch (err: any) {
      console.error('Error loading metrics:', err);
      error.value = err.message || 'Failed to load metrics data';
    } finally {
      isLoading.value = false;
    }
  };

  const refreshCritical = async () => {
    try {
      await metricsStore.refreshCriticalMetrics();
    } catch (err: any) {
      console.error('Error refreshing critical metrics:', err);
    }
  };

  const startRefreshTimer = (interval = 60000) => {
    stopRefreshTimer();
    refreshTimer.value = window.setInterval(() => {
      refreshCritical();
    }, interval);
    return refreshTimer.value;
  };

  const stopRefreshTimer = () => {
    if (refreshTimer.value) {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
    }
  };

  return {
    // State
    isLoading,
    error,

    // Computed values
    systemHealth,
    totalUsers,
    activeUsers,
    totalInstitutions,
    dataFreshness,
    userDistribution,
    institutionDistribution,
    dashboardSummary,
    criticalStatus,

    // Direct store access
    metricsStore,

    // Methods
    loadMetrics,
    refreshCritical,
    startRefreshTimer,
    stopRefreshTimer,
    getHealthStatus,
    getHealthColor,
  };
}
