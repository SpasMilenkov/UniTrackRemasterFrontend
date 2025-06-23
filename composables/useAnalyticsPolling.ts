// composables/useAnalyticsPolling.ts

import { useAnalyticsStore, type ReportJobDto } from '~/stores/analytics';

/**
 * Composable for polling report job status with exponential backoff
 */
export function useReportPolling() {
  const { $apiFetch } = useNuxtApp();
  const analyticsStore = useAnalyticsStore();

  const pollingIntervals = ref<Map<string, number>>(new Map());
  const maxRetries = 3;
  const baseDelay = 3000; // 3 seconds

  const pollJobStatus = async (jobId: string, retryCount = 0) => {
    try {
      console.log(`🔄 Polling job ${jobId} (attempt ${retryCount + 1})`);

      // Use store method to refresh job status
      const job = await analyticsStore.refreshJobStatus(jobId);
      console.log(`📊 Job ${jobId} status:`, job.status);

      // Stop polling if job is complete or failed
      if (
        job.status === 'Completed' ||
        job.status === 'Failed' ||
        job.status === 'Cancelled'
      ) {
        console.log(`✅ Job ${jobId} finished with status: ${job.status}`);
        stopPolling(jobId);

        // Show notification for completion
        if (job.status === 'Completed') {
          const message = useMessage();
          message.success(
            `Report generated successfully for ${job.institutionName}`
          );
        } else if (job.status === 'Failed') {
          const message = useMessage();
          message.error(
            `Report generation failed for ${job.institutionName}: ${job.errorMessage || 'Unknown error'}`
          );
        }

        return job;
      }

      // Continue polling if still running or pending
      if (job.status === 'Running' || job.status === 'Pending') {
        const delay =
          retryCount > 0 ? baseDelay * Math.pow(2, retryCount) : baseDelay;
        console.log(`🔄 Scheduling next poll for job ${jobId} in ${delay}ms`);

        const timeoutId = window.setTimeout(() => {
          pollJobStatus(jobId, 0); // Reset retry count on successful poll
        }, delay);

        pollingIntervals.value.set(jobId, timeoutId);
      }

      return job;
    } catch (error) {
      console.error(`❌ Failed to poll job ${jobId}:`, error);

      // Implement exponential backoff for retries
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount + 1);
        console.log(
          `🔄 Retrying job ${jobId} poll in ${delay}ms (retry ${retryCount + 1}/${maxRetries})`
        );

        const timeoutId = window.setTimeout(() => {
          pollJobStatus(jobId, retryCount + 1);
        }, delay);

        pollingIntervals.value.set(jobId, timeoutId);
      } else {
        console.error(`❌ Max retries reached for job ${jobId}`);
        stopPolling(jobId);

        // Show error notification
        const message = useMessage();
        message.error(`Failed to get status updates for report job`);
      }
    }
  };

  const startPolling = (jobId: string) => {
    console.log(`🚀 Starting polling for job ${jobId}`);

    // Stop existing polling for this job
    stopPolling(jobId);

    // Start new polling
    pollJobStatus(jobId);
  };

  const stopPolling = (jobId: string) => {
    const intervalId = pollingIntervals.value.get(jobId);
    if (intervalId) {
      console.log(`⏹️ Stopping polling for job ${jobId}`);
      window.clearTimeout(intervalId);
      pollingIntervals.value.delete(jobId);
    }
  };

  const stopAllPolling = () => {
    console.log(
      `⏹️ Stopping all polling (${pollingIntervals.value.size} active polls)`
    );
    pollingIntervals.value.forEach((intervalId, jobId) => {
      window.clearTimeout(intervalId);
      console.log(`⏹️ Stopped polling for job ${jobId}`);
    });
    pollingIntervals.value.clear();
  };

  const isPolling = (jobId: string) => {
    return pollingIntervals.value.has(jobId);
  };

  const getActivePolls = () => {
    return Array.from(pollingIntervals.value.keys());
  };

  // Cleanup on unmount
  onBeforeUnmount(() => {
    console.log('🧹 Cleaning up polling on unmount');
    stopAllPolling();
  });

  return {
    startPolling,
    stopPolling,
    stopAllPolling,
    isPolling,
    getActivePolls,
  };
}

/**
 * Composable for report job management operations
 */
export function useReportJobs() {
  const analyticsStore = useAnalyticsStore();
  const { showSuccessNotification, handleApiError } =
    useAnalyticsNotifications();

  // Download report with proper file handling
  const downloadReport = async (jobId: string, format: string = 'pdf', reportId: string) => {
    try {
      console.log('📥 Initiating download for job:', jobId, 'format:', format);

      const job = analyticsStore.getJobById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      if (!analyticsStore.canDownloadJob(jobId)) {
        throw new Error('Report is not ready for download');
      }

      await analyticsStore.downloadReport(jobId, format, reportId);
      showSuccessNotification(
        'Report Downloaded',
        `${job.reportType} report downloaded successfully`
      );
    } catch (error: any) {
      console.error('❌ Download failed:', error);
      handleApiError(error, 'downloading report');
      throw error;
    }
  };

  // Cancel a running job
  const cancelJob = async (jobId: string) => {
    try {
      console.log('🚫 Cancelling job:', jobId);

      if (!analyticsStore.canCancelJob(jobId)) {
        throw new Error('Job cannot be cancelled');
      }

      const job = await analyticsStore.cancelJob(jobId);
      showSuccessNotification(
        'Job Cancelled',
        'Report generation has been cancelled'
      );
      return job;
    } catch (error: any) {
      console.error('❌ Cancel failed:', error);
      handleApiError(error, 'cancelling job');
      throw error;
    }
  };

  // Retry a failed job
  const retryJob = async (jobId: string) => {
    try {
      console.log('🔄 Retrying job:', jobId);

      if (!analyticsStore.canRetryJob(jobId)) {
        throw new Error('Job cannot be retried');
      }

      const job = await analyticsStore.retryJob(jobId);
      showSuccessNotification(
        'Job Restarted',
        'Report generation has been restarted'
      );
      return job;
    } catch (error: any) {
      console.error('❌ Retry failed:', error);
      handleApiError(error, 'retrying job');
      throw error;
    }
  };

  // Delete a job
  const deleteJob = async (jobId: string) => {
    try {
      console.log('🗑️ Deleting job:', jobId);

      await analyticsStore.deleteJob(jobId);
      showSuccessNotification('Job Deleted', 'Report job has been deleted');
    } catch (error: any) {
      console.error('❌ Delete failed:', error);
      handleApiError(error, 'deleting job');
      throw error;
    }
  };

  // Get report data for preview
  const getReportForPreview = async (jobId: string) => {
    try {
      console.log('👁️ Getting report for preview:', jobId);

      if (!analyticsStore.canDownloadJob(jobId)) {
        throw new Error('Report is not ready for preview');
      }

      const result = await analyticsStore.getReportForPreview(jobId);
      return result;
    } catch (error: any) {
      console.error('❌ Preview failed:', error);
      handleApiError(error, 'loading report preview');
      throw error;
    }
  };

  // Refresh job status
  const refreshJobStatus = async (jobId: string) => {
    try {
      console.log('🔄 Refreshing job status:', jobId);
      const job = await analyticsStore.refreshJobStatus(jobId);
      return job;
    } catch (error: any) {
      console.error('❌ Status refresh failed:', error);
      handleApiError(error, 'refreshing job status');
      throw error;
    }
  };

  // Get all jobs with optional filtering
  const refreshJobs = async () => {
    try {
      console.log('🔄 Refreshing all jobs');
      await analyticsStore.fetchReportJobs();
      showSuccessNotification(
        'Jobs Refreshed',
        'Report jobs list has been updated'
      );
    } catch (error: any) {
      console.error('❌ Jobs refresh failed:', error);
      handleApiError(error, 'refreshing jobs');
      throw error;
    }
  };

  // Generate a new report
  const generateReport = async (request: any) => {
    try {
      console.log('🚀 Generating new report:', request);
      const job = await analyticsStore.generateReport(request);
      showSuccessNotification(
        'Report Generation Started',
        `${job.reportType} report generation has been queued`
      );
      return job;
    } catch (error: any) {
      console.error('❌ Report generation failed:', error);
      handleApiError(error, 'generating report');
      throw error;
    }
  };

  return {
    downloadReport,
    cancelJob,
    retryJob,
    deleteJob,
    getReportForPreview,
    refreshJobStatus,
    refreshJobs,
    generateReport,
  };
}

/**
 * Composable for background data refresh
 */
export function useAnalyticsRefresh() {
  const analyticsStore = useAnalyticsStore();
  const refreshIntervals = ref<Map<string, number>>(new Map());

  const setupBackgroundRefresh = () => {
    console.log('🔄 Setting up background refresh');

    // Dashboard data: Refresh every 30 minutes if user active
    const dashboardInterval = setInterval(
      () => {
        if (document.visibilityState === 'visible') {
          console.log('🔄 Background refresh: dashboard');
          analyticsStore.refreshDashboard();
        }
      },
      30 * 60 * 1000
    ); // 30 minutes

    // Market data: Refresh every hour
    const marketInterval = setInterval(
      () => {
        console.log('🔄 Background refresh: market data');
        analyticsStore.fetchMarketData();
      },
      60 * 60 * 1000
    ); // 1 hour

    // Report jobs: Refresh every 5 minutes
    const jobsInterval = setInterval(
      () => {
        if (document.visibilityState === 'visible') {
          console.log('🔄 Background refresh: report jobs');
          analyticsStore.fetchReportJobs();
        }
      },
      5 * 60 * 1000
    ); // 5 minutes

    refreshIntervals.value.set('dashboard', dashboardInterval);
    refreshIntervals.value.set('market', marketInterval);
    refreshIntervals.value.set('jobs', jobsInterval);
  };

  const stopBackgroundRefresh = () => {
    console.log('⏹️ Stopping background refresh');
    refreshIntervals.value.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    refreshIntervals.value.clear();
  };

  // Handle visibility change
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      console.log('👁️ Page became visible, refreshing data');
      // Refresh data when user comes back
      analyticsStore.refreshDashboard();
      analyticsStore.fetchReportJobs();
    }
  };

  onMounted(() => {
    setupBackgroundRefresh();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  onBeforeUnmount(() => {
    stopBackgroundRefresh();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  return {
    setupBackgroundRefresh,
    stopBackgroundRefresh,
  };
}

/**
 * Composable for handling analytics errors and notifications
 */
export function useAnalyticsNotifications() {
  const message = useMessage();

  const showSuccessNotification = (title: string, description?: string) => {
    console.log('✅', title, description || '');
    message.success(description || title);
  };

  const showErrorNotification = (title: string, description?: string) => {
    console.log('❌', title, description || '');
    message.error(description || title);
  };

  const showWarningNotification = (title: string, description?: string) => {
    console.log('⚠️', title, description || '');
    message.warning(description || title);
  };

  const showInfoNotification = (title: string, description?: string) => {
    console.log('ℹ️', title, description || '');
    message.info(description || title);
  };

  const handleReportJobComplete = (job: ReportJobDto) => {
    if (job.status === 'Completed') {
      showSuccessNotification(
        'Report Generated',
        `${job.reportType} report for ${job.institutionName} has been completed successfully.`
      );
    } else if (job.status === 'Failed') {
      showErrorNotification(
        'Report Failed',
        `Failed to generate ${job.reportType} report for ${job.institutionName}. ${job.errorMessage || ''}`
      );
    }
  };

  const handleApiError = (error: any, context?: string) => {
    console.error(
      `Analytics API Error${context ? ` (${context})` : ''}:`,
      error
    );

    const errorMessage =
      error?.message || error?.data?.message || 'An unexpected error occurred';

    if (error?.status === 404 || error?.statusCode === 404) {
      showWarningNotification(
        'Data Not Found',
        'The requested analytics data could not be found.'
      );
    } else if (error?.status === 403 || error?.statusCode === 403) {
      showErrorNotification(
        'Access Denied',
        'You do not have permission to access this analytics data.'
      );
    } else if (error?.status >= 500 || error?.statusCode >= 500) {
      showErrorNotification(
        'Server Error',
        'Analytics service is temporarily unavailable. Please try again later.'
      );
    } else {
      showErrorNotification('Error', errorMessage);
    }
  };

  return {
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    handleReportJobComplete,
    handleApiError,
  };
}

/**
 * Composable for managing chart colors and themes
 */
export function useChartTheme() {
  const themeStore = useThemeStore();

  const chartColors = computed(() => {
    const isDark = themeStore.actualTheme === 'dark';

    return {
      primary: themeStore.themeColors.primary,
      secondary: themeStore.themeColors.secondary,
      success: isDark ? '#10b981' : '#059669',
      warning: isDark ? '#f59e0b' : '#d97706',
      error: isDark ? '#ef4444' : '#dc2626',
      info: isDark ? '#3b82f6' : '#2563eb',
      text: isDark ? '#f9fafb' : '#111827',
      background: isDark ? '#1f2937' : '#ffffff',
      grid: isDark ? '#374151' : '#e5e7eb',
    };
  });

  const getChartOptions = (customOptions: any = {}) => {
    const isDark = themeStore.actualTheme === 'dark';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: chartColors.value.text,
            font: {
              family: 'Inter, system-ui, sans-serif',
            },
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#374151' : '#ffffff',
          titleColor: chartColors.value.text,
          bodyColor: chartColors.value.text,
          borderColor: chartColors.value.grid,
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: {
            color: chartColors.value.text,
          },
          grid: {
            color: chartColors.value.grid,
          },
        },
        y: {
          ticks: {
            color: chartColors.value.text,
          },
          grid: {
            color: chartColors.value.grid,
          },
        },
      },
      ...customOptions,
    };
  };

  const getTrendColor = (direction: 'Up' | 'Down' | 'Stable') => {
    switch (direction) {
      case 'Up':
        return chartColors.value.success;
      case 'Down':
        return chartColors.value.error;
      case 'Stable':
        return chartColors.value.info;
      default:
        return chartColors.value.text;
    }
  };

  const getPriorityColor = (
    priority: 'Low' | 'Medium' | 'High' | 'Critical'
  ) => {
    switch (priority) {
      case 'Low':
        return chartColors.value.info;
      case 'Medium':
        return chartColors.value.warning;
      case 'High':
        return chartColors.value.error;
      case 'Critical':
        return '#dc2626'; // Always red for critical
      default:
        return chartColors.value.text;
    }
  };

  return {
    chartColors,
    getChartOptions,
    getTrendColor,
    getPriorityColor,
  };
}

/**
 * Composable for formatting analytics data
 */
export function useAnalyticsFormatters() {
  const formatScore = (score: number): string => {
    return score.toFixed(1);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatTrend = (changePercent: number): string => {
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(1)}%`;
  };

  const formatRank = (rank?: number, total?: number): string => {
    if (!rank) return 'N/A';

    const suffix = getRankSuffix(rank);
    const totalText = total ? ` of ${total}` : '';

    return `${rank}${suffix}${totalText}`;
  };

  const getRankSuffix = (rank: number): string => {
    if (rank >= 11 && rank <= 13) return 'th';

    const lastDigit = rank % 10;
    switch (lastDigit) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (startDate: string, endDate?: string): string => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
    if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`;
    return `${diffMins}m`;
  };

  const formatProgress = (progress?: number): string => {
    if (progress === undefined) return '0%';
    return `${Math.round(progress)}%`;
  };

  return {
    formatScore,
    formatPercentage,
    formatTrend,
    formatRank,
    formatDate,
    formatDateTime,
    formatDuration,
    formatProgress,
  };
}
