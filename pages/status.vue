<template>
  <div class="flex flex-col min-h-screen bg-background">
    <!-- Header -->
    <header
      class="bg-primary py-12 text-white flex items-center justify-center"
    >
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold mb-2">UniTrack</h1>
        <h2 class="text-xl font-light">System Status</h2>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8 flex-grow">
      <!-- Overall Status Banner -->
      <n-card :bordered="false" class="mb-8">
        <div class="flex items-center justify-between w-full">
          <!-- Status Icon -->
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center mr-4',
              statusIconBg,
            ]"
          >
            <Icon :name="statusIcon" size="24px" color="white" />
          </div>

          <!-- Status Text -->
          <div>
            <h2 class="text-xl font-medium">{{ statusText }}</h2>
            <p class="text-text-secondary text-sm mt-1">
              Last updated:
              {{
                lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'
              }}
            </p>
          </div>

          <!-- Refresh Button -->
          <div class="ml-auto">
            <n-button secondary :loading="isLoading" @click="refreshMetrics">
              <div class="flex items-center gap-2">
                <Icon name="ph:arrows-clockwise" size="16px" />
                <span>Refresh</span>
              </div>
            </n-button>
          </div>
        </div>
      </n-card>

      <!-- System Health Circle -->
      <div class="flex justify-center mb-8">
        <n-card :bordered="false" class="w-full max-w-xs">
          <div class="flex flex-col items-center justify-center">
            <div class="relative">
              <n-progress
                type="circle"
                :percentage="systemHealth"
                :color="healthColor"
                :rail-color="healthRailColor"
                :show-indicator="false"
                :stroke-width="3"
                :status="healthStatus"
                :size="150"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-3xl font-bold mb-1">
                    {{
                      connectionStatus === 'disconnected'
                        ? 'OFFLINE'
                        : `${systemHealth}%`
                    }}
                  </div>
                  <div class="text-sm text-text-secondary">
                    {{ statusLabel }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-card>
      </div>

      <!-- Services Status -->
      <n-card title="Core Services" class="mb-8">
        <div
          v-if="
            isLoading && !healthMetrics && !databaseMetrics && !requestMetrics
          "
          class="py-8 flex justify-center"
        >
          <n-spin size="large" />
        </div>
        <div
          v-else-if="connectionStatus === 'disconnected'"
          class="py-8 text-center"
        >
          <Icon name="ph:cloud-slash" size="64px" class="text-red-500 mb-4" />
          <p class="text-lg font-medium">Connection to server lost</p>
          <p class="text-text-secondary">
            Unable to retrieve services status information
          </p>
          <n-button class="mt-4" type="primary" @click="refreshMetrics"
            >Retry Connection</n-button
          >
        </div>
        <n-collapse v-else>
          <!-- API Service -->
          <n-collapse-item title="API" name="api">
            <template #header-extra>
              <n-tag :type="apiStatus.type" size="small">{{
                apiStatus.label
              }}</n-tag>
            </template>
            <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-background-secondary p-4 rounded-md">
                <div class="flex items-center">
                  <Icon
                    name="ph:activity"
                    class="text-primary mr-2"
                    size="16px"
                  />
                  <span class="text-sm">Uptime:</span>
                  <span class="ml-auto font-medium"
                    >{{ apiStatus.uptime.toFixed(2) }}%</span
                  >
                </div>
              </div>
              <div class="bg-background-secondary p-4 rounded-md">
                <div class="flex items-center">
                  <Icon name="ph:clock" class="text-primary mr-2" size="16px" />
                  <span class="text-sm">Avg Response Time:</span>
                  <span class="ml-auto font-medium"
                    >{{ averageResponseTime.toFixed(2) }} ms</span
                  >
                </div>
              </div>
            </div>
          </n-collapse-item>

          <!-- Database Service -->
          <n-collapse-item title="Database" name="database">
            <template #header-extra>
              <n-tag :type="databaseStatus.type" size="small">{{
                databaseStatus.label
              }}</n-tag>
            </template>
            <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-background-secondary p-4 rounded-md">
                <div class="flex items-center">
                  <Icon name="ph:users" class="text-primary mr-2" size="16px" />
                  <span class="text-sm">Active Connections:</span>
                  <span class="ml-auto font-medium"
                    >{{ databaseMetrics?.activeConnections || 0 }} /
                    {{ databaseMetrics?.maxConnections || 0 }}</span
                  >
                </div>
              </div>
              <div class="bg-background-secondary p-4 rounded-md">
                <div class="flex items-center">
                  <Icon
                    name="ph:warning-circle"
                    class="text-primary mr-2"
                    size="16px"
                  />
                  <span class="text-sm">Error Count:</span>
                  <span class="ml-auto font-medium">{{
                    databaseMetrics?.errorCount || 0
                  }}</span>
                </div>
              </div>
            </div>
          </n-collapse-item>

          <!-- Application Service -->
          <n-collapse-item title="Application Server" name="app">
            <template #header-extra>
              <n-tag :type="applicationStatus.type" size="small">{{
                applicationStatus.label
              }}</n-tag>
            </template>
            <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-background-secondary p-4 rounded-md">
                <div class="flex items-center">
                  <Icon name="ph:cpu" class="text-primary mr-2" size="16px" />
                  <span class="text-sm">CPU Usage:</span>
                  <span class="ml-auto font-medium"
                    >{{ cpuUsage.toFixed(1) }}%</span
                  >
                </div>
              </div>
              <div class="bg-background-secondary p-4 rounded-md">
                <div class="flex items-center">
                  <Icon
                    name="ph:hard-drives"
                    class="text-primary mr-2"
                    size="16px"
                  />
                  <span class="text-sm">Memory Usage:</span>
                  <span class="ml-auto font-medium"
                    >{{ memoryUsagePercentage.toFixed(1) }}%</span
                  >
                </div>
              </div>
            </div>
          </n-collapse-item>
        </n-collapse>
      </n-card>

      <n-card title="System Metrics" class="mb-8">
        <div
          v-if="isLoading && !healthMetrics"
          class="py-8 flex justify-center"
        >
          <n-spin size="large" />
        </div>
        <div
          v-else-if="connectionStatus === 'disconnected'"
          class="py-8 text-center"
        >
          <Icon
            name="ph:chart-line-down"
            size="64px"
            class="text-red-500 mb-4"
          />
          <p class="text-lg font-medium">Metrics Unavailable</p>
          <p class="text-text-secondary">
            Cannot display system metrics due to connection issues
          </p>
        </div>
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <!-- CPU Usage -->
          <n-card class="bg-background-secondary">
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon name="ph:cpu" class="text-primary mr-2" size="20px" />
                <h3 class="text-lg font-medium">CPU Usage</h3>
              </div>
              <n-progress
                type="line"
                :percentage="cpuUsage"
                :color="getCpuColor(cpuUsage)"
                :rail-color="getCpuRailColor(cpuUsage)"
                :show-indicator="false"
                :height="12"
                :border-radius="6"
              />
              <div class="mt-2">
                <span class="text-2xl font-bold"
                  >{{ cpuUsage.toFixed(1) }}%</span
                >
              </div>
            </div>
          </n-card>

          <!-- Memory Usage -->
          <n-card class="bg-background-secondary">
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon
                  name="ph:hard-drives"
                  class="text-primary mr-2"
                  size="20px"
                />
                <h3 class="text-lg font-medium">Memory Usage</h3>
              </div>
              <n-progress
                type="line"
                :percentage="memoryUsagePercentage"
                :color="getMemoryColor(memoryUsagePercentage)"
                :rail-color="getMemoryRailColor(memoryUsagePercentage)"
                :show-indicator="false"
                :height="12"
                :border-radius="6"
              />
              <div class="mt-2">
                <span class="text-2xl font-bold">{{
                  formattedMemoryUsage
                }}</span>
                <span class="text-sm text-text-secondary"> / 8 GB</span>
              </div>
            </div>
          </n-card>

          <!-- Active Requests -->
          <n-card class="bg-background-secondary">
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon
                  name="ph:broadcast"
                  class="text-primary mr-2"
                  size="20px"
                />
                <h3 class="text-lg font-medium">Active Requests</h3>
              </div>
              <div class="text-3xl font-bold text-primary mt-4">
                {{ activeRequests }}
              </div>
              <div class="text-xs text-text-secondary mt-2">
                Current active API requests
              </div>
            </div>
          </n-card>

          <!-- Response Time -->
          <n-card class="bg-background-secondary">
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon name="ph:clock" class="text-primary mr-2" size="20px" />
                <h3 class="text-lg font-medium">Response Time</h3>
              </div>
              <div class="text-3xl font-bold text-primary mt-4">
                {{ averageResponseTime.toFixed(1) }}
                <span class="text-base">ms</span>
              </div>
              <div class="text-xs text-text-secondary mt-2">
                Average API response time
              </div>
            </div>
          </n-card>
        </div>
      </n-card>

      <!-- Request Metrics -->
      <n-card
        v-if="requestMetrics || connectionStatus === 'disconnected'"
        title="Request Metrics"
      >
        <div
          v-if="isLoading && !requestMetrics"
          class="py-8 flex justify-center"
        >
          <n-spin size="large" />
        </div>
        <div
          v-else-if="connectionStatus === 'disconnected'"
          class="py-8 text-center"
        >
          <Icon name="ph:activity-x" size="64px" class="text-red-500 mb-4" />
          <p class="text-lg font-medium">No Request Data</p>
          <p class="text-text-secondary">
            Request metrics cannot be retrieved at this time
          </p>
        </div>
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <!-- Total Requests -->
          <n-card class="bg-background-secondary">
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon
                  name="ph:activity"
                  class="text-primary mr-2"
                  size="20px"
                />
                <h3 class="text-lg font-medium">Total Requests</h3>
              </div>
              <div class="text-3xl font-bold text-primary mt-4">
                {{ requestMetrics.totalRequests.toLocaleString() }}
              </div>
            </div>
          </n-card>

          <!-- Success Rate -->
          <n-card class="bg-background-secondary">
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon name="ph:check" class="text-primary mr-2" size="20px" />
                <h3 class="text-lg font-medium">Success Rate</h3>
              </div>
              <n-progress
                type="circle"
                :percentage="calculateSuccessRate"
                :color="getSuccessRateColor(calculateSuccessRate)"
                :rail-color="getSuccessRateRailColor(calculateSuccessRate)"
                :show-indicator="false"
                :stroke-width="6"
                size="small"
              />
              <div class="mt-2">
                <span class="text-2xl font-bold"
                  >{{ calculateSuccessRate.toFixed(1) }}%</span
                >
              </div>
            </div>
          </n-card>

          <!-- Failed Requests -->
          <n-card class="bg-background-secondary">
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon
                  name="ph:x-circle"
                  class="text-primary mr-2"
                  size="20px"
                />
                <h3 class="text-lg font-medium">Failed Requests</h3>
              </div>
              <div
                class="text-3xl font-bold mt-4"
                :class="
                  requestMetrics.failedRequests > 100
                    ? 'text-red-500'
                    : 'text-text-primary'
                "
              >
                {{ requestMetrics.failedRequests.toLocaleString() }}
              </div>
            </div>
          </n-card>

          <!-- Requests/sec -->
          <n-card class="bg-background-secondary">
            <div class="text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon
                  name="ph:lightning"
                  class="text-primary mr-2"
                  size="20px"
                />
                <h3 class="text-lg font-medium">Requests/sec</h3>
              </div>
              <div class="text-3xl font-bold text-primary mt-4">
                {{ requestsPerSecond.toFixed(1) }}
              </div>
            </div>
          </n-card>
        </div>
      </n-card>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useMetricsStore } from '~/stores/metrics';

const metricsStore = useMetricsStore();
let pollingInterval = null;
const connectionStatus = ref('connecting');
const lastUpdated = ref(null);
const connectionTimeoutId = ref(null);
const connectionTimeout = 15000;
const totalMemoryMB = 8 * 1024;

const healthMetrics = computed(() => metricsStore.healthMetrics);
const databaseMetrics = computed(() => metricsStore.databaseMetrics);
const requestMetrics = computed(() => metricsStore.requestMetrics);
const cpuUsage = computed(() => metricsStore.cpuUsage);
const rawMemoryUsage = computed(() => metricsStore.memoryUsage || 0);
const memoryUsagePercentage = computed(
  () => (rawMemoryUsage.value / totalMemoryMB) * 100
);
const formattedMemoryUsage = computed(() => {
  const usageMB = rawMemoryUsage.value;
  if (usageMB >= 1024) return `${(usageMB / 1024).toFixed(1)} GB`;
  return `${Math.round(usageMB)} MB`;
});
const activeRequests = computed(() => metricsStore.activeRequests);
const requestsPerSecond = computed(() => metricsStore.requestsPerSecond);
const averageResponseTime = computed(() => metricsStore.averageResponseTime);

const systemHealth = computed(() => {
  if (connectionStatus.value === 'disconnected') return 0;
  if (!healthMetrics.value && !databaseMetrics.value && !requestMetrics.value)
    return connectionStatus.value === 'connecting' ? 50 : 0;
  if (typeof metricsStore.systemHealthScore === 'function')
    return metricsStore.systemHealthScore;
  const cpu = cpuUsage.value || 0;
  const memory = memoryUsagePercentage.value || 0;
  const response = averageResponseTime.value || 0;
  const cpuScore = Math.max(0, 100 - cpu);
  const memoryScore = Math.max(0, 100 - memory);
  const responseScore = Math.max(0, 100 - response / 5);
  return Math.round(cpuScore * 0.4 + memoryScore * 0.4 + responseScore * 0.2);
});

const isLoading = computed(
  () =>
    connectionStatus.value === 'connecting' ||
    metricsStore.loadingHealthMetrics ||
    metricsStore.loadingDatabaseMetrics ||
    metricsStore.loadingRequestMetrics
);
const calculateSuccessRate = computed(() => {
  if (connectionStatus.value === 'disconnected') return 0;
  if (!requestMetrics.value || !requestMetrics.value.totalRequests)
    return connectionStatus.value === 'connecting' ? 50 : 0;
  const { totalRequests, successfulRequests } = requestMetrics.value;
  return totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;
});

const apiStatus = computed(() => {
  if (connectionStatus.value === 'disconnected')
    return { type: 'error', label: 'Outage', uptime: 0 };
  if (
    !healthMetrics.value &&
    !requestMetrics.value &&
    connectionStatus.value !== 'connecting'
  )
    return { type: 'error', label: 'Outage', uptime: 0 };
  const success = calculateSuccessRate.value;
  const responseTime = averageResponseTime.value || 0;
  if (connectionStatus.value === 'connecting')
    return { type: 'warning', label: 'Connecting', uptime: 0 };
  if (success > 99 && responseTime < 500)
    return { type: 'success', label: 'Operational', uptime: 99.98 };
  if (success > 95 && responseTime < 1000)
    return { type: 'warning', label: 'Degraded Performance', uptime: 99.5 };
  return { type: 'error', label: 'Outage', uptime: 98.7 };
});

const databaseStatus = computed(() => {
  if (connectionStatus.value === 'disconnected')
    return { type: 'error', label: 'Outage', uptime: 0 };
  if (connectionStatus.value === 'connecting')
    return { type: 'warning', label: 'Connecting', uptime: 0 };
  if (!databaseMetrics.value)
    return { type: 'error', label: 'Outage', uptime: 0 };
  const { activeConnections, maxConnections, errorCount } =
    databaseMetrics.value;
  const usagePercent =
    maxConnections > 0 ? (activeConnections / maxConnections) * 100 : 0;
  if (usagePercent < 80 && errorCount < 10)
    return { type: 'success', label: 'Operational', uptime: 99.99 };
  if (usagePercent < 95 && errorCount < 50)
    return { type: 'warning', label: 'High Load', uptime: 99.95 };
  return { type: 'error', label: 'Critical', uptime: 99.9 };
});

const applicationStatus = computed(() => {
  if (connectionStatus.value === 'disconnected')
    return { type: 'error', label: 'Outage', uptime: 0 };
  if (connectionStatus.value === 'connecting')
    return { type: 'warning', label: 'Connecting', uptime: 0 };

  // Check if we have valid metrics data - this is the key fix
  const hasValidData =
    healthMetrics.value &&
    typeof metricsStore.cpuUsage === 'number' &&
    metricsStore.cpuUsage > 0 &&
    typeof metricsStore.memoryUsage === 'number' &&
    metricsStore.memoryUsage > 0;

  if (!hasValidData) return { type: 'error', label: 'Outage', uptime: 0 };

  const cpu = cpuUsage.value || 0;
  const memory = memoryUsagePercentage.value || 0;

  if (cpu < 70 && memory < 70)
    return { type: 'success', label: 'Operational', uptime: 99.97 };
  if (cpu < 90 && memory < 90)
    return { type: 'warning', label: 'High Load', uptime: 99.8 };
  return { type: 'error', label: 'Resource Exhaustion', uptime: 99.5 };
});

const statusIcon = computed(() => {
  if (connectionStatus.value === 'disconnected') return 'ph:x-circle';
  if (connectionStatus.value === 'connecting') return 'ph:warning-circle';
  if (systemHealth.value > 90) return 'ph:check-circle';
  if (systemHealth.value > 70) return 'ph:warning-circle';
  return 'ph:x-circle';
});

const statusIconBg = computed(() => {
  if (connectionStatus.value === 'disconnected') return 'bg-red-500';
  if (connectionStatus.value === 'connecting') return 'bg-amber-500';
  if (systemHealth.value > 90) return 'bg-emerald-500';
  if (systemHealth.value > 70) return 'bg-amber-500';
  return 'bg-red-500';
});

const statusText = computed(() => {
  if (connectionStatus.value === 'disconnected') return 'Server Unavailable';
  if (connectionStatus.value === 'connecting') return 'Connecting to Server...';
  if (!healthMetrics.value && !databaseMetrics.value && !requestMetrics.value)
    return 'Systems Not Operational - No Data Available';
  if (systemHealth.value > 90) return 'All Systems Operational';
  if (systemHealth.value > 70) return 'Some Systems Experiencing Issues';
  return 'Critical System Issues Detected';
});

const healthColor = computed(() =>
  statusIconBg.value.replace('bg-', '#').replace('-500', '')
);
const healthRailColor = computed(() => 'rgba(0,0,0,0.1)');
const healthStatus = computed(() =>
  connectionStatus.value === 'disconnected'
    ? 'error'
    : connectionStatus.value === 'connecting'
      ? 'warning'
      : systemHealth.value > 90
        ? 'success'
        : systemHealth.value > 70
          ? 'warning'
          : 'error'
);
const statusLabel = computed(() =>
  connectionStatus.value === 'disconnected'
    ? 'Offline'
    : connectionStatus.value === 'connecting'
      ? 'Connecting'
      : 'System Health'
);

const refreshMetrics = async () => {
  startConnectionTimer();
  connectionStatus.value = 'connecting';
  try {
    await metricsStore.fetchAllMetrics();
    connectionStatus.value = 'connected';
    lastUpdated.value = new Date();
    clearConnectionTimer();
  } catch {
    connectionStatus.value = 'disconnected';
  }
};

const startConnectionTimer = () => {
  clearConnectionTimer();
  connectionTimeoutId.value = setTimeout(() => {
    if (connectionStatus.value === 'connecting')
      connectionStatus.value = 'disconnected';
  }, connectionTimeout);
};
const clearConnectionTimer = () => {
  if (connectionTimeoutId.value) {
    clearTimeout(connectionTimeoutId.value);
    connectionTimeoutId.value = null;
  }
};

const checkConnection = () => {
  if (lastUpdated.value && new Date() - lastUpdated.value > 120000)
    connectionStatus.value = 'disconnected';
};

const getCpuColor = (value) => {
  if (connectionStatus.value === 'disconnected') return '#ef4444'; // Red-500
  if (value < 60) return '#10b981'; // Emerald-500
  if (value < 80) return '#f59e0b'; // Amber-500
  return '#ef4444'; // Red-500
};

const getCpuRailColor = (value) => {
  if (connectionStatus.value === 'disconnected')
    return 'rgba(239, 68, 68, 0.2)'; // Red transparent
  if (value < 60) return 'rgba(16, 185, 129, 0.2)'; // Emerald transparent
  if (value < 80) return 'rgba(245, 158, 11, 0.2)'; // Amber transparent
  return 'rgba(239, 68, 68, 0.2)'; // Red transparent
};

const getMemoryColor = (value) => {
  if (connectionStatus.value === 'disconnected') return '#ef4444'; // Red-500
  if (value < 60) return '#10b981'; // Emerald-500
  if (value < 80) return '#f59e0b'; // Amber-500
  return '#ef4444'; // Red-500
};

const getMemoryRailColor = (value) => {
  if (connectionStatus.value === 'disconnected')
    return 'rgba(239, 68, 68, 0.2)'; // Red transparent
  if (value < 60) return 'rgba(16, 185, 129, 0.2)'; // Emerald transparent
  if (value < 80) return 'rgba(245, 158, 11, 0.2)'; // Amber transparent
  return 'rgba(239, 68, 68, 0.2)'; // Red transparent
};

const getSuccessRateColor = (value) => {
  if (connectionStatus.value === 'disconnected') return '#ef4444'; // Red-500
  if (value > 99) return '#10b981'; // Emerald-500
  if (value > 95) return '#f59e0b'; // Amber-500
  return '#ef4444'; // Red-500
};

const getSuccessRateRailColor = (value) => {
  if (connectionStatus.value === 'disconnected')
    return 'rgba(239, 68, 68, 0.2)'; // Red transparent
  if (value > 99) return 'rgba(16, 185, 129, 0.2)'; // Emerald transparent
  if (value > 95) return 'rgba(245, 158, 11, 0.2)'; // Amber transparent
  return 'rgba(239, 68, 68, 0.2)'; // Red transparent
};

onMounted(async () => {
  await refreshMetrics();
  pollingInterval = setInterval(() => {
    if (connectionStatus.value !== 'disconnected') {
      metricsStore
        .refreshCriticalMetrics()
        .then(() => {
          connectionStatus.value = 'connected';
          lastUpdated.value = new Date();
        })
        .catch(checkConnection);
    } else refreshMetrics();
  }, 60000);
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
  clearConnectionTimer();
});
</script>
