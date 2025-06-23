import { defineStore } from 'pinia';
import { useQuery } from '@pinia/colada';
import type { AcademicStatisticsDto } from '~/interfaces/metrics/academic-statistics.dto';
import type { ActivityStatisticsDto } from '~/interfaces/metrics/activity-statistics.dto';
import type { ApplicationMetricsDto } from '~/interfaces/metrics/application-metrics.dto';
import type { DatabaseMetricsDto } from '~/interfaces/metrics/database-metrics.dto';
import type { EntityCountsDto } from '~/interfaces/metrics/entity-counts.dto';
import type { HealthMetricDto } from '~/interfaces/metrics/heal-metric.dto';
import type { RequestMetricsDto } from '~/interfaces/metrics/request-metrics.dto';
import type { SystemStatisticsDto } from '~/interfaces/metrics/system-statistics.dto';
import type { UserStatisticsDto } from '~/interfaces/metrics/user-statistics.dto';

export type SystemStatistics = SystemStatisticsDto;
export type UserStatistics = UserStatisticsDto;
export type AcademicStatistics = AcademicStatisticsDto;
export type ActivityStatistics = ActivityStatisticsDto;
export type ApplicationMetrics = ApplicationMetricsDto;
export type HealthMetric = HealthMetricDto;
export type DatabaseMetrics = DatabaseMetricsDto;
export type RequestMetrics = RequestMetricsDto;
export type EntityCounts = EntityCountsDto;

export const useMetricsStore = defineStore('metrics', () => {
  if (import.meta.server) {
    return {
      // State
      systemStatistics: readonly(ref(null)),
      userStatistics: readonly(ref(null)),
      academicStatistics: readonly(ref(null)),
      activityStatistics: readonly(ref(null)),
      applicationMetrics: readonly(ref(null)),
      healthMetrics: readonly(ref(null)),
      databaseMetrics: readonly(ref(null)),
      requestMetrics: readonly(ref(null)),
      entityCounts: readonly(ref(null)),
      dashboardData: readonly(ref(null)),
      lastUpdated: readonly(
        ref({
          systemStats: null,
          userStats: null,
          academicStats: null,
          activityStats: null,
          appMetrics: null,
          healthMetrics: null,
          databaseMetrics: null,
          requestMetrics: null,
          entityCounts: null,
          dashboard: null,
        })
      ),

      // Computed getters
      totalUsers: 0,
      activeUsers: 0,
      usersByRole: {},
      userRoleDistribution: [],
      totalInstitutions: 0,
      schoolCount: 0,
      universityCount: 0,
      institutionTypeDistribution: [],
      totalAttendances: 0,
      totalMarks: 0,
      totalApplications: 0,
      attendanceStatusDistribution: [],
      applicationStatusDistribution: [],
      cpuUsage: 0,
      memoryUsage: 0,
      activeRequests: 0,
      requestsPerSecond: 0,
      averageResponseTime: 0,
      databaseConnectionUtilization: 0,
      requestSuccessRate: 100,
      applicationMetricsTimestamps: [],
      applicationMetricsData: [],
      entityCountsData: [],
      topEntities: [],
      systemHealthScore: 50,
      isDataStale: false,
      dataFreshness: null,

      // Loading states
      loadingSystemStats: false,
      loadingUserStats: false,
      loadingAcademicStats: false,
      loadingActivityStats: false,
      loadingAppMetrics: false,
      loadingHealthMetrics: false,
      loadingDatabaseMetrics: false,
      loadingRequestMetrics: false,
      loadingEntityCounts: false,
      loadingDashboard: false,
      isLoading: false,

      // Actions
      fetchSystemStatistics: async () => {},
      fetchUserStatistics: async () => {},
      fetchAcademicStatistics: async () => {},
      fetchActivityStatistics: async () => {},
      fetchApplicationMetrics: async () => {},
      fetchHealthMetrics: async () => {},
      fetchDatabaseMetrics: async () => {},
      fetchRequestMetrics: async () => {},
      fetchEntityCounts: async () => {},
      fetchDashboardData: async () => {},
      fetchAllMetrics: async () => {},
      refreshCriticalMetrics: async () => {},
      setupMetricsPolling: () => null,
      clearPolling: () => {},

      // Query factories
      systemStatisticsQuery: null,
      userStatisticsQuery: null,
      academicStatisticsQuery: null,
      activityStatisticsQuery: null,
      applicationMetricsQuery: null,
      healthMetricsQuery: null,
      databaseMetricsQuery: null,
      requestMetricsQuery: null,
      entityCountsQuery: null,
      dashboardDataQuery: null,
    };
  }
  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State for individual metric components
  const systemStatistics = ref<SystemStatistics | null>(null);
  const userStatistics = ref<UserStatistics | null>(null);
  const academicStatistics = ref<AcademicStatistics | null>(null);
  const activityStatistics = ref<ActivityStatistics | null>(null);
  const applicationMetrics = ref<ApplicationMetrics | null>(null);
  const healthMetrics = ref<HealthMetric | null>(null);
  const databaseMetrics = ref<DatabaseMetrics | null>(null);
  const requestMetrics = ref<RequestMetrics | null>(null);
  const entityCounts = ref<EntityCounts | null>(null);
  const dashboardData = ref<any | null>(null);

  // Last update timestamps
  const lastUpdated = ref({
    systemStats: null as Date | null,
    userStats: null as Date | null,
    academicStats: null as Date | null,
    activityStats: null as Date | null,
    appMetrics: null as Date | null,
    healthMetrics: null as Date | null,
    databaseMetrics: null as Date | null,
    requestMetrics: null as Date | null,
    entityCounts: null as Date | null,
    dashboard: null as Date | null,
  });

  // Polling interval ID
  const pollingIntervalId = ref<number | null>(null);

  // System statistics query (includes users, academic, and activity)
  const systemStatisticsQuery = useQuery({
    key: () => ['metrics', 'system-statistics'],
    query: () => $apiFetch<SystemStatistics>('/statistics/system'),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Individual statistics queries
  const userStatisticsQuery = useQuery({
    key: () => ['metrics', 'user-statistics'],
    query: () => $apiFetch<UserStatistics>('/statistics/users'),
    staleTime: 5 * 60 * 1000, // 5 minutes - changes slowly
  });

  const academicStatisticsQuery = useQuery({
    key: () => ['metrics', 'academic-statistics'],
    query: () => $apiFetch<AcademicStatistics>('/statistics/academic'),
    staleTime: 10 * 60 * 1000, // 10 minutes - changes very slowly
  });

  const activityStatisticsQuery = useQuery({
    key: () => ['metrics', 'activity-statistics'],
    query: () => $apiFetch<ActivityStatistics>('/statistics/activity'),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  // Application metrics queries (real-time data)
  const applicationMetricsQuery = useQuery({
    key: () => ['metrics', 'application-metrics'],
    query: () => $apiFetch<ApplicationMetrics>('/metrics/application'),
    staleTime: 30 * 1000, // 30 seconds - real-time
  });

  const healthMetricsQuery = useQuery({
    key: () => ['metrics', 'health-metrics'],
    query: () => $apiFetch<HealthMetric>('/metrics/health'),
    staleTime: 30 * 1000, // 30 seconds - critical real-time data
  });

  const databaseMetricsQuery = useQuery({
    key: () => ['metrics', 'database-metrics'],
    query: () => $apiFetch<DatabaseMetrics>('/metrics/database'),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const requestMetricsQuery = useQuery({
    key: () => ['metrics', 'request-metrics'],
    query: () => $apiFetch<RequestMetrics>('/metrics/requests'),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Entity counts query
  const entityCountsQuery = useQuery({
    key: () => ['metrics', 'entity-counts'],
    query: () => $apiFetch<EntityCounts>('/statistics/entities'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Dashboard data query
  const dashboardDataQuery = useQuery({
    key: () => ['metrics', 'dashboard-data'],
    query: () => $apiFetch('/statistics/dashboard'),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  // Watch for query data changes to update local state and timestamps
  watch(
    () => systemStatisticsQuery.data.value,
    (data) => {
      if (data) {
        systemStatistics.value = data;
        lastUpdated.value.systemStats = new Date();
        // Also update individual components if included
        if (data.users) {
          userStatistics.value = data.users;
          lastUpdated.value.userStats = new Date();
        }
        if (data.academic) {
          academicStatistics.value = data.academic;
          lastUpdated.value.academicStats = new Date();
        }
        if (data.activity) {
          activityStatistics.value = data.activity;
          lastUpdated.value.activityStats = new Date();
        }
      }
    },
    { immediate: true }
  );

  watch(
    () => userStatisticsQuery.data.value,
    (data) => {
      if (data) {
        userStatistics.value = data;
        lastUpdated.value.userStats = new Date();
      }
    },
    { immediate: true }
  );

  watch(
    () => academicStatisticsQuery.data.value,
    (data) => {
      if (data) {
        academicStatistics.value = data;
        lastUpdated.value.academicStats = new Date();
      }
    },
    { immediate: true }
  );

  watch(
    () => activityStatisticsQuery.data.value,
    (data) => {
      if (data) {
        activityStatistics.value = data;
        lastUpdated.value.activityStats = new Date();
      }
    },
    { immediate: true }
  );

  watch(
    () => applicationMetricsQuery.data.value,
    (data) => {
      if (data) {
        applicationMetrics.value = data;
        lastUpdated.value.appMetrics = new Date();
      }
    },
    { immediate: true }
  );

  watch(
    () => healthMetricsQuery.data.value,
    (data) => {
      if (data) {
        healthMetrics.value = data;
        lastUpdated.value.healthMetrics = new Date();
      }
    },
    { immediate: true }
  );

  watch(
    () => databaseMetricsQuery.data.value,
    (data) => {
      if (data) {
        databaseMetrics.value = data;
        lastUpdated.value.databaseMetrics = new Date();
      }
    },
    { immediate: true }
  );

  watch(
    () => requestMetricsQuery.data.value,
    (data) => {
      if (data) {
        requestMetrics.value = data;
        lastUpdated.value.requestMetrics = new Date();
      }
    },
    { immediate: true }
  );

  watch(
    () => entityCountsQuery.data.value,
    (data) => {
      if (data) {
        entityCounts.value = data;
        lastUpdated.value.entityCounts = new Date();
      }
    },
    { immediate: true }
  );

  watch(
    () => dashboardDataQuery.data.value,
    (data) => {
      if (data) {
        dashboardData.value = data;
        lastUpdated.value.dashboard = new Date();
      }
    },
    { immediate: true }
  );

  // Computed getters (maintaining your existing API)
  const totalUsers = computed(() => userStatistics.value?.totalUsers || 0);
  const activeUsers = computed(() => userStatistics.value?.activeUsers || 0);
  const usersByRole = computed(() => userStatistics.value?.usersByRole || {});

  const userRoleDistribution = computed(() => {
    if (!userStatistics.value?.usersByRole) return [];
    return Object.entries(userStatistics.value.usersByRole).map(
      ([role, count]) => ({
        name: role,
        value: count,
      })
    );
  });

  const totalInstitutions = computed(
    () => academicStatistics.value?.totalInstitutions || 0
  );
  const schoolCount = computed(
    () => academicStatistics.value?.schoolCount || 0
  );
  const universityCount = computed(
    () => academicStatistics.value?.universityCount || 0
  );

  const institutionTypeDistribution = computed(() => {
    if (!academicStatistics.value?.institutionsByType) return [];
    return Object.entries(academicStatistics.value.institutionsByType).map(
      ([type, count]) => ({
        name: type,
        value: count,
      })
    );
  });

  const totalAttendances = computed(
    () => activityStatistics.value?.totalAttendances || 0
  );
  const totalMarks = computed(() => activityStatistics.value?.totalMarks || 0);
  const totalApplications = computed(
    () => activityStatistics.value?.totalApplications || 0
  );

  const attendanceStatusDistribution = computed(() => {
    if (!activityStatistics.value?.attendanceByStatus) return [];
    return Object.entries(activityStatistics.value.attendanceByStatus).map(
      ([status, count]) => ({
        name: status,
        value: count,
      })
    );
  });

  const applicationStatusDistribution = computed(() => {
    if (!activityStatistics.value?.applicationsByStatus) return [];
    return Object.entries(activityStatistics.value.applicationsByStatus).map(
      ([status, count]) => ({
        name: status,
        value: count,
      })
    );
  });

  const cpuUsage = computed(() => healthMetrics.value?.cpuUsage || 0);
  const memoryUsage = computed(() => healthMetrics.value?.memoryUsage || 0);
  const activeRequests = computed(
    () => healthMetrics.value?.activeRequests || 0
  );
  const requestsPerSecond = computed(
    () => healthMetrics.value?.requestsPerSecond || 0
  );
  const averageResponseTime = computed(
    () => healthMetrics.value?.averageResponseTime || 0
  );

  const databaseConnectionUtilization = computed(() => {
    if (!databaseMetrics.value) return 0;
    const { activeConnections, maxConnections } = databaseMetrics.value;
    return maxConnections > 0 ? (activeConnections / maxConnections) * 100 : 0;
  });

  const requestSuccessRate = computed(() => {
    if (!requestMetrics.value) return 100;
    const { totalRequests, successfulRequests } = requestMetrics.value;
    return totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;
  });

  const applicationMetricsTimestamps = computed(() => {
    if (!applicationMetrics.value?.metrics?.length) return [];
    return (
      applicationMetrics.value.metrics[0]?.points.map((point) =>
        new Date(point.timestamp).toLocaleTimeString()
      ) || []
    );
  });

  const applicationMetricsData = computed(() => {
    if (!applicationMetrics.value?.metrics?.length) return [];
    return applicationMetrics.value.metrics.map((metric) => ({
      name: metric.name,
      data: metric.points.map((point) => point.value),
      unit: metric.unit,
    }));
  });

  const entityCountsData = computed(() => {
    if (!entityCounts.value?.entities?.length) return [];
    return entityCounts.value.entities.map((entity) => ({
      name: entity.entityName,
      total: entity.totalCount,
      active: entity.activeCount,
      lastUpdated: new Date(entity.lastUpdated).toLocaleString(),
    }));
  });

  const topEntities = computed(() => {
    if (!entityCounts.value?.entities?.length) return [];
    return [...entityCounts.value.entities]
      .sort((a, b) => b.totalCount - a.totalCount)
      .slice(0, 5)
      .map((entity) => ({
        name: entity.entityName,
        count: entity.totalCount,
      }));
  });

  const systemHealthScore = computed(() => {
    if (!healthMetrics.value || !databaseMetrics.value || !requestMetrics.value)
      return 50;

    // CPU Score (0-100)
    const cpuUsage = healthMetrics.value.cpuUsage || 0;
    const cpuScore = Math.max(0, 100 - cpuUsage);

    // Memory Score (0-100)
    const totalMemoryMB = 8192; // Adjust based on your server's actual RAM
    const memoryUsedMB = healthMetrics.value.memoryUsage || 0;
    const memoryUsagePercent = (memoryUsedMB / totalMemoryMB) * 100;
    const memoryScore = Math.max(0, 100 - memoryUsagePercent);

    // Database Score (0-100)
    const dbConnections = databaseMetrics.value.activeConnections || 0;
    const maxConnections = databaseMetrics.value.maxConnections || 100;
    const dbScore = Math.max(0, 100 - (dbConnections / maxConnections) * 100);

    // Request Success Score (0-100)
    const totalRequests = requestMetrics.value.totalRequests || 0;
    const successfulRequests = requestMetrics.value.successfulRequests || 0;
    const requestScore =
      totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;

    // Weighted average
    const weightedScore =
      cpuScore * 0.25 +
      memoryScore * 0.35 +
      dbScore * 0.15 +
      requestScore * 0.25;

    return Math.max(0, Math.min(100, Math.round(weightedScore)));
  });

  const isDataStale = computed(() => {
    const now = new Date();
    const staleThreshold = 5 * 60 * 1000; // 5 minutes
    const systemStatsTime = lastUpdated.value.systemStats;
    if (!systemStatsTime) return true;
    return now.getTime() - systemStatsTime.getTime() > staleThreshold;
  });

  const dataFreshness = computed(() => {
    const times = Object.values(lastUpdated.value).filter(
      (time) => time !== null
    ) as Date[];
    if (times.length === 0) return null;

    const latestTime = new Date(Math.max(...times.map((t) => t.getTime())));
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - latestTime.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  });

  // Action-like functions maintaining your existing API
  const fetchSystemStatistics = async () => {
    await systemStatisticsQuery.refetch();
  };

  const fetchUserStatistics = async () => {
    await userStatisticsQuery.refetch();
  };

  const fetchAcademicStatistics = async () => {
    await academicStatisticsQuery.refetch();
  };

  const fetchActivityStatistics = async () => {
    await activityStatisticsQuery.refetch();
  };

  const fetchApplicationMetrics = async () => {
    await applicationMetricsQuery.refetch();
  };

  const fetchHealthMetrics = async () => {
    await healthMetricsQuery.refetch();
  };

  const fetchDatabaseMetrics = async () => {
    await databaseMetricsQuery.refetch();
  };

  const fetchRequestMetrics = async () => {
    await requestMetricsQuery.refetch();
  };

  const fetchEntityCounts = async () => {
    await entityCountsQuery.refetch();
  };

  const fetchDashboardData = async () => {
    await dashboardDataQuery.refetch();
  };

  const fetchAllMetrics = async () => {
    // Fetch all metrics concurrently
    await Promise.all([
      systemStatisticsQuery.refetch(),
      applicationMetricsQuery.refetch(),
      healthMetricsQuery.refetch(),
      databaseMetricsQuery.refetch(),
      requestMetricsQuery.refetch(),
      entityCountsQuery.refetch(),
    ]);
  };

  const refreshCriticalMetrics = async () => {
    // Only refresh the most critical metrics for system health
    await Promise.all([
      healthMetricsQuery.refetch(),
      databaseMetricsQuery.refetch(),
      requestMetricsQuery.refetch(),
    ]);
  };

  const setupMetricsPolling = (intervalMs = 60000) => {
    // Clear any existing polling
    if (pollingIntervalId.value) {
      clearInterval(pollingIntervalId.value);
    }

    // Set up polling for critical health metrics
    const intervalId = setInterval(() => {
      refreshCriticalMetrics();
    }, intervalMs);

    pollingIntervalId.value = intervalId as unknown as number;
    return intervalId;
  };

  const clearPolling = (intervalId?: number) => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    if (pollingIntervalId.value) {
      clearInterval(pollingIntervalId.value);
      pollingIntervalId.value = null;
    }
  };

  // Setup automatic polling for critical metrics on store creation
  if (import.meta.client) {
    setupMetricsPolling(60000); // Poll every minute
  }

  // Cleanup polling on store teardown
  if (import.meta.client) {
    onBeforeUnmount(() => {
      clearPolling();
    });
  }

  return {
    // State
    systemStatistics: readonly(systemStatistics),
    userStatistics: readonly(userStatistics),
    academicStatistics: readonly(academicStatistics),
    activityStatistics: readonly(activityStatistics),
    applicationMetrics: readonly(applicationMetrics),
    healthMetrics: readonly(healthMetrics),
    databaseMetrics: readonly(databaseMetrics),
    requestMetrics: readonly(requestMetrics),
    entityCounts: readonly(entityCounts),
    dashboardData: readonly(dashboardData),
    lastUpdated: readonly(lastUpdated),

    // Computed getters (maintaining existing API)
    totalUsers,
    activeUsers,
    usersByRole,
    userRoleDistribution,
    totalInstitutions,
    schoolCount,
    universityCount,
    institutionTypeDistribution,
    totalAttendances,
    totalMarks,
    totalApplications,
    attendanceStatusDistribution,
    applicationStatusDistribution,
    cpuUsage,
    memoryUsage,
    activeRequests,
    requestsPerSecond,
    averageResponseTime,
    databaseConnectionUtilization,
    requestSuccessRate,
    applicationMetricsTimestamps,
    applicationMetricsData,
    entityCountsData,
    topEntities,
    systemHealthScore,
    isDataStale,
    dataFreshness,

    // Loading states
    loadingSystemStats: computed(() => systemStatisticsQuery.isLoading.value),
    loadingUserStats: computed(() => userStatisticsQuery.isLoading.value),
    loadingAcademicStats: computed(
      () => academicStatisticsQuery.isLoading.value
    ),
    loadingActivityStats: computed(
      () => activityStatisticsQuery.isLoading.value
    ),
    loadingAppMetrics: computed(() => applicationMetricsQuery.isLoading.value),
    loadingHealthMetrics: computed(() => healthMetricsQuery.isLoading.value),
    loadingDatabaseMetrics: computed(
      () => databaseMetricsQuery.isLoading.value
    ),
    loadingRequestMetrics: computed(() => requestMetricsQuery.isLoading.value),
    loadingEntityCounts: computed(() => entityCountsQuery.isLoading.value),
    loadingDashboard: computed(() => dashboardDataQuery.isLoading.value),

    // Combined loading state
    isLoading: computed(
      () =>
        systemStatisticsQuery.isLoading.value ||
        userStatisticsQuery.isLoading.value ||
        academicStatisticsQuery.isLoading.value ||
        activityStatisticsQuery.isLoading.value ||
        applicationMetricsQuery.isLoading.value ||
        healthMetricsQuery.isLoading.value ||
        databaseMetricsQuery.isLoading.value ||
        requestMetricsQuery.isLoading.value ||
        entityCountsQuery.isLoading.value ||
        dashboardDataQuery.isLoading.value
    ),

    // Actions (maintaining existing API)
    fetchSystemStatistics,
    fetchUserStatistics,
    fetchAcademicStatistics,
    fetchActivityStatistics,
    fetchApplicationMetrics,
    fetchHealthMetrics,
    fetchDatabaseMetrics,
    fetchRequestMetrics,
    fetchEntityCounts,
    fetchDashboardData,
    fetchAllMetrics,
    refreshCriticalMetrics,
    setupMetricsPolling,
    clearPolling,

    // Direct access to queries for advanced usage
    systemStatisticsQuery,
    userStatisticsQuery,
    academicStatisticsQuery,
    activityStatisticsQuery,
    applicationMetricsQuery,
    healthMetricsQuery,
    databaseMetricsQuery,
    requestMetricsQuery,
    entityCountsQuery,
    dashboardDataQuery,
  };
});
