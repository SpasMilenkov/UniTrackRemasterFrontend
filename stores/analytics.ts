// stores/analytics.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';

// Types matching the backend DTOs
export interface AnalyticsDashboardDto {
  overview: InstitutionOverviewDto;
  performance: PerformanceMetricsDto;
  achievements: AchievementDto[];
  trends: TrendDto[];
  comparisons: ComparisonDataDto;
  recommendations: RecommendationDto[];
  generatedAt: string;
}

export interface InstitutionOverviewDto {
  institutionId: string;
  name: string;
  type: string;
  studentCount: number;
  overallScore: number;
  performanceCategory: string;
  nationalRank?: number;
  regionalRank?: number;
}

export interface PerformanceMetricsDto {
  academicScore: number;
  yearOverYearGrowth: number;
  attendanceRate: number;
  teacherRetention: number;
  studentTeacherRatio: number;
  subjectScores: Record<string, number>;
}

export interface AchievementDto {
  title: string;
  description: string;
  category: string;
  achievedDate: string;
  icon?: string;
}

export interface TrendDto {
  name: string;
  category: string;
  currentValue: number;
  previousValue: number;
  changePercent: number;
  direction: 'Up' | 'Down' | 'Stable';
  dataPoints: TrendDataPointDto[];
}

export interface TrendDataPointDto {
  date: string;
  value: number;
  label?: string;
}

export interface ComparisonDataDto {
  peerComparisons: PeerComparisonDto[];
  benchmarks: BenchmarkDataDto;
  rankings: RankingDataDto;
}

export interface PeerComparisonDto {
  institutionId: string;
  name: string;
  score: number;
  similarity: number;
  type: string;
  keyMetrics: Record<string, number>;
}

export interface BenchmarkDataDto {
  nationalAverage: number;
  regionalAverage: number;
  institutionTypeAverage: number;
  subjectBenchmarks: Record<string, number>;
}

export interface RankingDataDto {
  nationalRank?: number;
  regionalRank?: number;
  typeRank?: number;
  totalInstitutions: number;
  subjectRankings: Record<string, number>;
}

export interface RecommendationDto {
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  actionItems: string[];
  expectedOutcome?: string;
}

export interface MarketAnalyticsDto {
  reportPeriod: string;
  overview: MarketOverviewDto;
  topPerformers: InstitutionRankingDto[];
  majorTrends: MajorTrendDto[];
  regionalData: RegionalStatsDto[];
  marketInsights: string;
  generatedAt: string;
}

export interface MarketOverviewDto {
  totalInstitutions: number;
  totalStudents: number;
  averageScore: number;
  marketGrowthRate: number;
  institutionsByType: Record<string, number>;
}

export interface InstitutionRankingDto {
  id: string;
  name: string;
  type: string;
  score: number;
  rank: number;
  changeFromPrevious: number;
  category?: string;
}

export interface MajorTrendDto {
  name: string;
  currentEnrollment: number;
  growthRate: number;
  trend: 'Up' | 'Down' | 'Stable';
  institutionsOffering: number;
  averageScore: number;
}

export interface RegionalStatsDto {
  region: string;
  institutionCount: number;
  studentCount: number;
  averageScore: number;
  growthRate: number;
}

export interface InstitutionComparisonDto {
  institution1: InstitutionSummaryDto;
  institution2: InstitutionSummaryDto;
  comparisonAnalysis: string;
  generatedAt: string;
}

export interface InstitutionSummaryDto {
  institutionId: string;
  name: string;
  overallScore: number;
}

export interface ReportJobDto {
  id: string;
  institutionId?: string;
  institutionName: string;
  reportType:
    | 'InstitutionAnalytics'
    | 'MarketAnalytics'
    | 'ComparativeAnalytics';
  periodType: 'Monthly' | 'Quarterly' | 'Semester' | 'Yearly';
  status: 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Cancelled';
  scheduledFor: string;
  startedAt?: string;
  completedAt?: string;
  reportId?: string;
  errorMessage?: string;
  progress?: number;
}

export interface GenerateReportRequestDto {
  institutionId: string;
  periodType: 'Monthly' | 'Quarterly' | 'Semester' | 'Yearly';
  fromDate?: string;
  toDate?: string;
  includeAIInsights?: boolean;
  generateRecommendations?: boolean;
}

export interface ComparisonRequestDto {
  institution1Id: string;
  institution2Id: string;
  focusArea?: string;
}

export const useAnalyticsStore = defineStore('analytics', () => {
  // Get the API fetch function and institution store
  const { $apiFetch } = useNuxtApp();
  const institutionStore = useInstitutionStore();

  // State - Initialize with reactive refs
  const dashboard = ref<AnalyticsDashboardDto | null>(null);
  const marketData = ref<MarketAnalyticsDto | null>(null);
  const comparisons = ref<InstitutionComparisonDto[]>([]);
  const recommendations = ref<RecommendationDto[]>([]);
  const similarInstitutions = ref<PeerComparisonDto[]>([]);
  const reportJobs = ref<ReportJobDto[]>([]);
  const error = ref<string | null>(null);

  // Current institution from store - with proper reactivity
  const currentInstitutionId = computed(() => {
    const activeInstitution = institutionStore.activeInstitution;
    console.log('🏢 Current Institution ID:', activeInstitution?.id);
    return activeInstitution?.id || null;
  });

  // Dashboard query - Fixed enablement logic
  const dashboardQuery = (institutionId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => {
        const instId = unref(institutionId);
        const key = ['analytics', 'dashboard', instId || 'none'];
        console.log('🔑 Dashboard Query Key:', key);
        return key;
      },
      query: async () => {
        const instId = unref(institutionId);
        console.log('📊 Fetching dashboard for institution:', instId);

        if (!instId) throw new Error('Institution ID is required');

        const result = await $apiFetch<AnalyticsDashboardDto>(
          `/analytics/dashboard/${instId}`
        );

        console.log('📊 Dashboard fetched:', result);
        return result;
      },
      enabled: () => {
        const instId = unref(institutionId);
        const enabled = !!instId && import.meta.client;
        console.log('🔄 Dashboard query enabled:', enabled, {
          instId,
          isClient: import.meta.client,
        });
        return enabled;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
  };

  // Market data query
  const marketDataQuery = (periodType: MaybeRef<string>) => {
    return useQuery({
      key: () => ['analytics', 'market', unref(periodType)],
      query: async () => {
        console.log('📈 Fetching market data for period:', unref(periodType));
        const result = await $apiFetch<MarketAnalyticsDto>(
          `/analytics/market?periodType=${unref(periodType)}`
        );
        console.log('📈 Market data fetched:', result);
        return result;
      },
      enabled: () => import.meta.client,
      staleTime: 60 * 60 * 1000, // 1 hour cache
    });
  };

  // Similar institutions query
  const similarInstitutionsQuery = (institutionId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => {
        const instId = unref(institutionId);
        return ['analytics', 'similar', instId || 'none'];
      },
      query: async () => {
        const instId = unref(institutionId);
        console.log('🏫 Fetching similar institutions for:', instId);

        if (!instId) throw new Error('Institution ID is required');

        const result = await $apiFetch<PeerComparisonDto[]>(
          `/analytics/similar/${instId}?limit=5`
        );

        console.log('🏫 Similar institutions fetched:', result);
        return result;
      },
      enabled: () => {
        const instId = unref(institutionId);
        return !!instId && import.meta.client;
      },
      staleTime: 15 * 60 * 1000, // 15 minutes cache
    });
  };

  // Recommendations query
  const recommendationsQuery = (institutionId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => {
        const instId = unref(institutionId);
        return ['analytics', 'recommendations', instId || 'none'];
      },
      query: async () => {
        const instId = unref(institutionId);
        console.log('💡 Fetching recommendations for:', instId);

        if (!instId) throw new Error('Institution ID is required');

        const result = await $apiFetch<RecommendationDto[]>(
          `/analytics/recommendations/${instId}`
        );

        console.log('💡 Recommendations fetched:', result);
        return result;
      },
      enabled: () => {
        const instId = unref(institutionId);
        return !!instId && import.meta.client;
      },
      staleTime: 30 * 60 * 1000, // 30 minutes cache
    });
  };

  // Report jobs query - Fixed to always work when we have an institution
  const reportJobsQuery = () => {
    return useQuery({
      key: () => {
        const instId = currentInstitutionId.value;
        const key = ['analytics', 'report-jobs', instId || 'none'];
        console.log('📋 Report Jobs Query Key:', key);
        return key;
      },
      query: async () => {
        const instId = currentInstitutionId.value;
        console.log('📋 Fetching report jobs for institution:', instId);

        if (!instId) throw new Error('Institution ID is required');

        const result = await $apiFetch<ReportJobDto[]>(
          `/analytics/institutions/${instId}/jobs`
        );

        console.log('📋 Report jobs fetched:', result?.length || 0, 'jobs');
        console.log('📋 Jobs data:', result);
        return result;
      },
      enabled: () => {
        const instId = currentInstitutionId.value;
        const enabled = !!instId && import.meta.client;
        console.log('🔄 Report jobs query enabled:', enabled, {
          instId,
          isClient: import.meta.client,
        });
        return enabled;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes cache
    });
  };

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutation: async (request: GenerateReportRequestDto) => {
      console.log('🚀 Generating report:', request);
      const result = await $apiFetch<ReportJobDto>('/analytics/generate', {
        method: 'POST',
        body: request,
      });
      console.log('🚀 Report generation started:', result);
      return result;
    },
    onSuccess: (newJob) => {
      console.log('✅ Report generation successful, adding job:', newJob);
      reportJobs.value = [newJob, ...reportJobs.value];
      error.value = null;
    },
    onError: (err) => {
      console.error('❌ Error generating report:', err);
      error.value = err.message || 'Failed to generate report';
    },
  });

  // Compare institutions mutation
  const compareInstitutionsMutation = useMutation({
    mutation: async (request: ComparisonRequestDto) => {
      console.log('🔍 Comparing institutions:', request);
      const result = await $apiFetch<InstitutionComparisonDto>(
        '/analytics/compare',
        {
          method: 'POST',
          body: request,
        }
      );
      console.log('🔍 Comparison result:', result);
      return result;
    },
    onSuccess: (newComparison) => {
      console.log('✅ Comparison successful:', newComparison);
      comparisons.value = [newComparison, ...comparisons.value];
      error.value = null;
    },
    onError: (err) => {
      console.error('❌ Error comparing institutions:', err);
      error.value = err.message || 'Failed to compare institutions';
    },
  });
  const cancelJobMutation = useMutation({
    mutation: async (jobId: string) => {
      console.log('🚫 Cancelling job:', jobId);
      const result = await $apiFetch<ReportJobDto>(
        `/analytics/jobs/${jobId}/cancel`,
        {
          method: 'POST',
        }
      );
      console.log('🚫 Job cancelled:', result);
      return result;
    },
    onSuccess: (updatedJob) => {
      console.log('✅ Job cancellation successful:', updatedJob);
      // Update job in local state
      const index = reportJobs.value.findIndex(
        (job) => job.id === updatedJob.id
      );
      if (index !== -1) {
        reportJobs.value[index] = updatedJob;
      }
      error.value = null;
    },
    onError: (err) => {
      console.error('❌ Error cancelling job:', err);
      error.value = err.message || 'Failed to cancel job';
    },
  });

  // Retry job mutation
  const retryJobMutation = useMutation({
    mutation: async (jobId: string) => {
      console.log('🔄 Retrying job:', jobId);
      const result = await $apiFetch<ReportJobDto>(
        `/analytics/jobs/${jobId}/retry`,
        {
          method: 'POST',
        }
      );
      console.log('🔄 Job retry initiated:', result);
      return result;
    },
    onSuccess: (updatedJob) => {
      console.log('✅ Job retry successful:', updatedJob);
      // Update job in local state
      const index = reportJobs.value.findIndex(
        (job) => job.id === updatedJob.id
      );
      if (index !== -1) {
        reportJobs.value[index] = updatedJob;
      }
      error.value = null;
    },
    onError: (err) => {
      console.error('❌ Error retrying job:', err);
      error.value = err.message || 'Failed to retry job';
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutation: async (jobId: string) => {
      console.log('🗑️ Deleting job:', jobId);
      await $apiFetch(`/analytics/jobs/${jobId}`, {
        method: 'DELETE',
      });
      console.log('🗑️ Job deleted successfully');
      return jobId;
    },
    onSuccess: (jobId) => {
      console.log('✅ Job deletion successful:', jobId);
      // Remove job from local state
      reportJobs.value = reportJobs.value.filter((job) => job.id !== jobId);
      error.value = null;
    },
    onError: (err) => {
      console.error('❌ Error deleting job:', err);
      error.value = err.message || 'Failed to delete job';
    },
  });

  // Download report mutation
  const downloadReportMutation = useMutation({
    mutation: async ({
      jobId,
      format = 'pdf',
      reportId
    }: {
      jobId: string;
      format?: string;
      reportId?: string;
    }) => {
      console.log('📥 Downloading report for job:', jobId, 'format:', format, 'report id:', reportId);

      // Get the job to determine report type
      const job = reportJobs.value.find((j) => j.id === jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      if (job.status !== 'Completed') {
        throw new Error('Report is not ready for download');
      }
      console.log('Downloading with report id', reportId)
      // Download the report file
      const response = await $apiFetch(`/analytics/reports/${reportId}/download`, {
        method: 'GET',
        query: { format },
        responseType: 'blob',
      });

      console.log('📥 Report downloaded successfully');
      return { blob: response, job, format };
    },
    onSuccess: ({ blob, job, format }) => {
      console.log('✅ Report download successful');

      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;

      // Generate filename
      const date = new Date().toISOString().split('T')[0];
      const filename = `${job.reportType}-${job.institutionName}-${date}.${format}`;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      error.value = null;
    },
    onError: (err) => {
      console.error('❌ Error downloading report:', err);
      error.value = err.message || 'Failed to download report';
    },
  });

  // Get report data for preview
  const getReportDataMutation = useMutation({
    mutation: async (jobId: string) => {
      console.log('👁️ Getting report data for preview:', jobId);

      const job = reportJobs.value.find((j) => j.id === jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      if (job.status !== 'Completed' || !job.reportId) {
        throw new Error('Report is not available for preview');
      }

      let reportData;
      if (job.reportType === 'InstitutionAnalytics') {
        reportData = await $apiFetch(
          `/analytics/reports/institution/${job.reportId}`
        );
      } else if (job.reportType === 'MarketAnalytics') {
        reportData = await $apiFetch(
          `/analytics/reports/market/${job.reportId}`
        );
      } else {
        throw new Error('Unsupported report type for preview');
      }

      console.log('👁️ Report data retrieved for preview');
      return { reportData, job };
    },
    onError: (err) => {
      console.error('❌ Error getting report data:', err);
      error.value = err.message || 'Failed to load report data';
    },
  });

  // Update job progress (for external updates)
  const updateJobProgress = (jobId: string, progress: number) => {
    const job = reportJobs.value.find((j) => j.id === jobId);
    if (job && job.status === 'Running') {
      job.progress = Math.min(Math.max(progress, 0), 100);
      console.log(`📊 Updated job ${jobId} progress to ${progress}%`);
    }
  };

  // ===== COMPUTED LOADING STATES =====
  const loadingJobOperations = computed(
    () =>
      cancelJobMutation.isLoading.value ||
      retryJobMutation.isLoading.value ||
      deleteJobMutation.isLoading.value ||
      downloadReportMutation.isLoading.value ||
      getReportDataMutation.isLoading.value
  );

  // Create reactive queries
  const currentDashboardQuery = dashboardQuery(currentInstitutionId);
  const currentSimilarQuery = similarInstitutionsQuery(currentInstitutionId);
  const currentRecommendationsQuery =
    recommendationsQuery(currentInstitutionId);
  const currentReportJobsQuery = reportJobsQuery();

  // Watch for data changes and update local state
  watch(
    () => currentDashboardQuery.data.value,
    (newDashboard) => {
      console.log('📊 Dashboard data updated:', newDashboard);
      if (newDashboard) {
        dashboard.value = newDashboard;
      }
    },
    { immediate: true }
  );

  watch(
    () => currentSimilarQuery.data.value,
    (newSimilar) => {
      console.log(
        '🏫 Similar institutions data updated:',
        newSimilar?.length || 0,
        'institutions'
      );
      if (newSimilar) {
        similarInstitutions.value = newSimilar;
      }
    },
    { immediate: true }
  );

  watch(
    () => currentRecommendationsQuery.data.value,
    (newRecommendations) => {
      console.log(
        '💡 Recommendations data updated:',
        newRecommendations?.length || 0,
        'recommendations'
      );
      if (newRecommendations) {
        recommendations.value = newRecommendations;
      }
    },
    { immediate: true }
  );

  watch(
    () => currentReportJobsQuery.data.value,
    (newJobs) => {
      console.log('📋 Report jobs data updated:', newJobs?.length || 0, 'jobs');
      if (newJobs) {
        reportJobs.value = newJobs;
      }
    },
    { immediate: true }
  );

  // Computed loading states
  const loadingDashboard = computed(
    () => currentDashboardQuery.isLoading.value
  );
  const loadingMarket = computed(() => false);
  const loadingComparisons = computed(
    () => compareInstitutionsMutation.isLoading.value
  );
  const loadingRecommendations = computed(
    () => currentRecommendationsQuery.isLoading.value
  );
  const loadingSimilar = computed(() => currentSimilarQuery.isLoading.value);
  const loadingReports = computed(() => generateReportMutation.isLoading.value);
  const loadingReportJobs = computed(
    () => currentReportJobsQuery.isLoading.value
  );

  const isLoading = computed(
    () =>
      loadingDashboard.value ||
      loadingMarket.value ||
      loadingComparisons.value ||
      loadingRecommendations.value ||
      loadingSimilar.value ||
      loadingReports.value ||
      loadingReportJobs.value
  );

  // Computed for job filtering
  const activeJobs = computed(() => {
    const jobs = reportJobs.value.filter(
      (job) => job.status === 'Pending' || job.status === 'Running'
    );
    console.log(
      '🔄 Active jobs:',
      jobs.length,
      'out of',
      reportJobs.value.length,
      'total jobs'
    );
    return jobs;
  });

  const completedJobs = computed(() => {
    const jobs = reportJobs.value.filter((job) => job.status === 'Completed');
    console.log('✅ Completed jobs:', jobs.length);
    return jobs;
  });

  const failedJobs = computed(() => {
    const jobs = reportJobs.value.filter((job) => job.status === 'Failed');
    console.log('❌ Failed jobs:', jobs.length);
    return jobs;
  });

  // Action methods
  const fetchDashboard = async (institutionId?: string) => {
    const instId = institutionId || currentInstitutionId.value;
    if (!instId) {
      console.warn('⚠️ Cannot fetch dashboard: No institution ID');
      return;
    }

    console.log('🔄 Refreshing dashboard for institution:', instId);
    const query = dashboardQuery(ref(instId));
    await query.refetch();
  };

  const fetchMarketData = async (periodType: string = 'Quarterly') => {
    console.log('🔄 Refreshing market data for period:', periodType);
    const query = marketDataQuery(ref(periodType));
    await query.refetch();

    const data = query.data.value;
    if (data) {
      marketData.value = data;
    }
  };

  const fetchSimilarInstitutions = async (institutionId?: string) => {
    const instId = institutionId || currentInstitutionId.value;
    if (!instId) {
      console.warn('⚠️ Cannot fetch similar institutions: No institution ID');
      return;
    }

    console.log('🔄 Refreshing similar institutions for:', instId);
    await currentSimilarQuery.refetch();
  };

  const fetchRecommendations = async (institutionId?: string) => {
    const instId = institutionId || currentInstitutionId.value;
    if (!instId) {
      console.warn('⚠️ Cannot fetch recommendations: No institution ID');
      return;
    }

    console.log('🔄 Refreshing recommendations for:', instId);
    await currentRecommendationsQuery.refetch();
  };

  const generateReport = async (request: GenerateReportRequestDto) => {
    console.log('🚀 Starting report generation:', request);
    return await generateReportMutation.mutateAsync(request);
  };

  const compareInstitutions = async (request: ComparisonRequestDto) => {
    console.log('🔍 Starting institution comparison:', request);
    return await compareInstitutionsMutation.mutateAsync(request);
  };

  const fetchReportJobs = async () => {
    console.log('🔄 Refreshing report jobs');
    await currentReportJobsQuery.refetch();
  };

  const refreshDashboard = async () => {
    console.log('🔄 Refreshing entire analytics dashboard');
    error.value = null;
    await Promise.all([
      fetchDashboard(),
      fetchSimilarInstitutions(),
      fetchRecommendations(),
      fetchReportJobs(),
    ]);
  };

  // Manual job update method for polling
  const updateJob = (updatedJob: ReportJobDto) => {
    console.log(
      '🔄 Manually updating job:',
      updatedJob.id,
      'status:',
      updatedJob.status
    );
    const index = reportJobs.value.findIndex((job) => job.id === updatedJob.id);
    if (index !== -1) {
      reportJobs.value[index] = updatedJob;
      console.log('✅ Job updated in store');
    } else {
      console.log('➕ Adding new job to store');
      reportJobs.value = [updatedJob, ...reportJobs.value];
    }
  };

  const cancelJob = async (jobId: string) => {
    console.log('🚫 Initiating job cancellation:', jobId);
    return await cancelJobMutation.mutateAsync(jobId);
  };

  const retryJob = async (jobId: string) => {
    console.log('🔄 Initiating job retry:', jobId);
    return await retryJobMutation.mutateAsync(jobId);
  };

  const deleteJob = async (jobId: string) => {
    console.log('🗑️ Initiating job deletion:', jobId);
    await deleteJobMutation.mutateAsync(jobId);
  };

  const downloadReport = async (jobId: string, format: string = 'pdf', reportId: string) => {
    console.log('📥 Initiating report download:', jobId, 'format:', format);
    await downloadReportMutation.mutateAsync({ jobId, format, reportId });
  };

  const getReportForPreview = async (jobId: string) => {
    console.log('👁️ Getting report for preview:', jobId);
    return await getReportDataMutation.mutateAsync(jobId);
  };

  // Refresh specific job status
  const refreshJobStatus = async (jobId: string) => {
    try {
      console.log('🔄 Refreshing job status:', jobId);
      const updatedJob = await $apiFetch<ReportJobDto>(
        `/analytics/jobs/${jobId}`
      );
      updateJob(updatedJob);
      return updatedJob;
    } catch (err: any) {
      console.error('❌ Error refreshing job status:', err);
      error.value = err.message || 'Failed to refresh job status';
      throw err;
    }
  };

  // Get job by ID
  const getJobById = (jobId: string) => {
    return reportJobs.value.find((job) => job.id === jobId) || null;
  };

  // Check if job can be cancelled
  const canCancelJob = (jobId: string) => {
    const job = getJobById(jobId);
    return job && (job.status === 'Pending' || job.status === 'Running');
  };

  // Check if job can be retried
  const canRetryJob = (jobId: string) => {
    const job = getJobById(jobId);
    return job && job.status === 'Failed';
  };

  // Check if job can be downloaded
  const canDownloadJob = (jobId: string) => {
    const job = getJobById(jobId);
    return job && job.status === 'Completed';
  };

  // Get job status summary
  const getJobStatusSummary = computed(() => {
    const total = reportJobs.value.length;
    const pending = reportJobs.value.filter(
      (job) => job.status === 'Pending'
    ).length;
    const running = reportJobs.value.filter(
      (job) => job.status === 'Running'
    ).length;
    const completed = reportJobs.value.filter(
      (job) => job.status === 'Completed'
    ).length;
    const failed = reportJobs.value.filter(
      (job) => job.status === 'Failed'
    ).length;
    const cancelled = reportJobs.value.filter(
      (job) => job.status === 'Cancelled'
    ).length;

    return {
      total,
      pending,
      running,
      completed,
      failed,
      cancelled,
      active: pending + running,
    };
  });
  return {
    // State
    dashboard: readonly(dashboard),
    marketData: readonly(marketData),
    comparisons: readonly(comparisons),
    recommendations: readonly(recommendations),
    similarInstitutions: readonly(similarInstitutions),
    reportJobs: readonly(reportJobs),
    error: readonly(error),

    // Computed
    currentInstitutionId,
    activeJobs,
    completedJobs,
    failedJobs,

    // Loading states
    loadingDashboard,
    loadingMarket,
    loadingComparisons,
    loadingRecommendations,
    loadingSimilar,
    loadingReports,
    loadingReportJobs,
    isLoading,
    loadingJobOperations,
    loadingCancel: computed(() => cancelJobMutation.isLoading.value),
    loadingRetry: computed(() => retryJobMutation.isLoading.value),
    loadingDelete: computed(() => deleteJobMutation.isLoading.value),
    loadingDownload: computed(() => downloadReportMutation.isLoading.value),
    loadingPreview: computed(() => getReportDataMutation.isLoading.value),

    // Actions
    fetchDashboard,
    fetchMarketData,
    fetchSimilarInstitutions,
    fetchRecommendations,
    generateReport,
    compareInstitutions,
    fetchReportJobs,
    refreshDashboard,
    updateJob,
    cancelJob,
    retryJob,
    deleteJob,
    downloadReport,
    getReportForPreview,
    refreshJobStatus,
    updateJobProgress,

    // Query factories for direct access
    dashboardQuery,
    marketDataQuery,
    similarInstitutionsQuery,
    recommendationsQuery,
    reportJobsQuery,
    getJobById,
    canCancelJob,
    canRetryJob,
    canDownloadJob,
    getJobStatusSummary,
  };
});
