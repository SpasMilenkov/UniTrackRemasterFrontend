<template>
  <div class="min-h-screen bg-background">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center space-y-4">
        <div class="relative">
          <div
            class="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin mx-auto"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-primary">Loading Insights</h3>
          <p class="text-sm text-secondary mt-1">
            Analyzing attendance patterns...
          </p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="min-h-screen flex items-center justify-center p-4"
    >
      <div
        class="max-w-md w-full bg-background-card rounded-2xl shadow-xl p-8 text-center border border-border"
      >
        <div
          class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Icon name="ph:warning-circle" class="text-2xl text-red-500" />
        </div>
        <h3 class="text-lg font-semibold text-primary mb-2">
          Unable to Load Insights
        </h3>
        <p class="text-secondary mb-6">{{ error }}</p>
        <div class="flex gap-3 justify-center">
          <n-button type="primary" size="large" @click="refreshInsights">
            <template #icon>
              <Icon name="ph:arrow-clockwise" />
            </template>
            Try Again
          </n-button>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <template v-else>
      <div class="container mx-auto px-4 py-6 max-w-7xl">
        <!-- Header Section -->
        <div class="mb-8">
          <div
            class="bg-background-card rounded-3xl shadow-lg border border-border overflow-hidden"
          >
            <!-- Main Header Content -->
            <div class="p-8">
              <div
                class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                <!-- User Info Section -->
                <div class="flex items-center gap-6">
                  <!-- Avatar with Status -->
                  <div class="relative">
                    <div
                      class="w-16 h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20"
                    >
                      <Icon
                        name="ph:graduation-cap"
                        class="text-2xl lg:text-3xl text-primary"
                      />
                    </div>
                    <div
                      v-if="isCurrentSemesterActive"
                      class="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background-card"
                    >
                      <Icon name="ph:check" class="text-xs text-white" />
                    </div>
                  </div>

                  <!-- Welcome Text -->
                  <div>
                    <h1
                      class="text-2xl lg:text-3xl font-bold text-text-primary mb-2"
                    >
                      Welcome back
                    </h1>
                    <div
                      class="flex flex-col sm:flex-row sm:items-center gap-3 text-sm"
                    >
                      <div class="flex items-center gap-2 text-text-secondary">
                        <Icon name="ph:calendar" class="text-sm" />
                        <span>{{ currentDate }}</span>
                      </div>
                      <div
                        v-if="currentSemesterDisplay"
                        class="flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full text-secondary"
                      >
                        <Icon name="ph:books" class="text-sm" />
                        <span class="font-medium">{{
                          currentSemesterDisplay
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-3">
                  <n-button
                    circle
                    size="large"
                    :loading="isRefreshing"
                    class="border border-border hover:border-primary/50 hover:bg-primary/5"
                    @click="refreshAllData"
                  >
                    <template #icon>
                      <Icon
                        name="ph:arrows-clockwise"
                        class="text-text-primary"
                      />
                    </template>
                  </n-button>

                  <NuxtLink
                    :to="`/students/dashboard`"
                    class="inline-flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200 hover-elevate font-medium text-sm lg:text-base"
                  >
                    <Icon name="ph:chart-line-up" class="text-lg" />
                    <span class="hidden sm:inline">Dashboard</span>
                    <span class="sm:hidden">Insights</span>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Status Bar -->
            <div
              class="px-8 py-4 bg-background-secondary border-t border-border"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <!-- Status Indicators -->
                <div class="flex items-center gap-4 text-sm">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-2 h-2 bg-primary rounded-full animate-pulse"
                    />
                    <span class="text-text-secondary">Active Semester</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Semester Selector -->
        <div class="mb-8">
          <div
            class="bg-background-card rounded-2xl shadow-sm border border-border p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <Icon name="ph:funnel" class="text-lg text-secondary" />
              <h3 class="text-lg font-semibold text-primary">
                Academic Period
              </h3>
            </div>
            <SemesterSelector
              v-model="semesterParams"
              :available-semesters="availableSemesters"
              :loading="loading"
              @change="onSemesterChange"
              @refresh="refreshInsights"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="
            !attendanceInsight ||
            !attendanceInsight.subjectInsights ||
            attendanceInsight.subjectInsights.length === 0
          "
          class="min-h-[400px] flex items-center justify-center"
        >
          <div class="text-center max-w-md">
            <div
              class="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="ph:calendar-x" class="text-4xl text-secondary" />
            </div>
            <h3 class="text-xl font-semibold text-primary mb-3">
              No Attendance Data
            </h3>
            <p class="text-secondary mb-6">
              No attendance data is available for the selected semester. Try
              selecting a different period or check back later.
            </p>
            <n-button type="primary" size="large" @click="refreshInsights">
              <template #icon>
                <Icon name="ph:arrow-clockwise" />
              </template>
              Refresh Data
            </n-button>
          </div>
        </div>

        <!-- Dashboard Content -->
        <template v-else>
          <!-- Key Metrics Overview -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <!-- Your Attendance Rate -->
            <div
              class="bg-background-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover-elevate transition-all duration-200"
            >
              <div class="flex items-center justify-between mb-4">
                <div
                  class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center"
                >
                  <Icon
                    name="ph:calendar-check"
                    class="text-xl text-secondary"
                  />
                </div>
                <n-tag
                  :type="
                    getAttendanceRateType(
                      attendanceInsight.overallStudentAttendanceRate
                    )
                  "
                  size="small"
                  round
                >
                  {{
                    getAttendanceRateLabel(
                      attendanceInsight.overallStudentAttendanceRate
                    )
                  }}
                </n-tag>
              </div>
              <div>
                <div class="text-2xl font-bold text-primary mb-1">
                  {{
                    formatPercentage(
                      attendanceInsight.overallStudentAttendanceRate
                    )
                  }}
                </div>
                <div class="text-sm text-secondary mb-3">
                  Your Attendance Rate
                </div>
                <div class="w-full bg-background-secondary rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-500"
                    :class="
                      getAttendanceBarColor(
                        attendanceInsight.overallStudentAttendanceRate
                      )
                    "
                    :style="{
                      width: `${attendanceInsight.overallStudentAttendanceRate * 100}%`,
                    }"
                  />
                </div>
              </div>
            </div>

            <!-- Class Average -->
            <div
              class="bg-background-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover-elevate transition-all duration-200"
            >
              <div class="flex items-center justify-between mb-4">
                <div
                  class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"
                >
                  <Icon name="ph:users" class="text-xl text-primary" />
                </div>
                <n-tag type="info" size="small" round>Class Benchmark</n-tag>
              </div>
              <div>
                <div class="text-2xl font-bold text-primary mb-1">
                  {{
                    formatPercentage(
                      attendanceInsight.overallClassAttendanceRate
                    )
                  }}
                </div>
                <div class="text-sm text-secondary mb-3">Class Average</div>
                <div class="flex items-center gap-2 text-sm">
                  <Icon
                    :name="
                      attendanceInsight.overallStudentAttendanceRate >
                      attendanceInsight.overallClassAttendanceRate
                        ? 'ph:trend-up'
                        : 'ph:trend-down'
                    "
                    :class="
                      attendanceInsight.overallStudentAttendanceRate >
                      attendanceInsight.overallClassAttendanceRate
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                  />
                  <span
                    :class="
                      attendanceInsight.overallStudentAttendanceRate >
                      attendanceInsight.overallClassAttendanceRate
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                  >
                    {{
                      attendanceInsight.overallStudentAttendanceRate >
                      attendanceInsight.overallClassAttendanceRate
                        ? 'Above'
                        : 'Below'
                    }}
                    average
                  </span>
                </div>
              </div>
            </div>

            <!-- Performance Score -->
            <div
              class="bg-background-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover-elevate transition-all duration-200"
            >
              <div class="flex items-center justify-between mb-4">
                <div
                  class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"
                >
                  <Icon name="ph:chart-line" class="text-xl text-primary" />
                </div>
                <n-tag type="warning" size="small" round>Performance</n-tag>
              </div>
              <div>
                <div class="text-2xl font-bold text-primary mb-1">
                  {{
                    formatScore(attendanceInsight.overallStudentAverageScore)
                  }}
                </div>
                <div class="text-sm text-secondary mb-3">
                  Your Average Score
                </div>
                <div class="text-xs text-muted">
                  Class avg:
                  {{ formatScore(attendanceInsight.overallClassAverageScore) }}
                </div>
              </div>
            </div>

            <!-- Class Rank -->
            <div
              class="bg-background-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover-elevate transition-all duration-200"
            >
              <div class="flex items-center justify-between mb-4">
                <div
                  class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center"
                >
                  <Icon name="ph:ranking" class="text-xl text-secondary" />
                </div>
                <n-tag type="success" size="small" round>Ranking</n-tag>
              </div>
              <div>
                <div class="text-2xl font-bold text-primary mb-1">
                  #{{ attendanceInsight.attendancePerformanceClassRank }}
                </div>
                <div class="text-sm text-secondary mb-3">Attendance Rank</div>
                <div class="text-xs text-muted">
                  Based on attendance & performance
                </div>
              </div>
            </div>
          </div>

          <!-- Insights and Correlation -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Primary Improvement Area -->
            <div
              class="bg-background-card rounded-2xl shadow-sm border border-border overflow-hidden hover-elevate"
            >
              <div class="bg-gradient-primary p-6 text-white">
                <div class="flex items-center gap-3">
                  <Icon name="ph:lightbulb" class="text-2xl" />
                  <h3 class="text-xl font-semibold">Primary Focus Area</h3>
                </div>
              </div>
              <div class="p-6 space-y-4">
                <div
                  class="p-4 bg-secondary/10 rounded-xl border border-secondary/20"
                >
                  <p class="text-primary font-medium leading-relaxed">
                    {{ attendanceInsight.primaryAreaForImprovement }}
                  </p>
                </div>
                <div
                  class="flex items-center justify-between p-4 bg-background-secondary rounded-xl"
                >
                  <span class="text-secondary font-medium"
                    >Potential GPA Impact:</span
                  >
                  <n-tag
                    :type="
                      attendanceInsight.estimatedGpaImpact > 0
                        ? 'success'
                        : 'default'
                    "
                    size="large"
                  >
                    <template #icon>
                      <Icon name="ph:trend-up" />
                    </template>
                    {{ attendanceInsight.estimatedGpaImpact > 0 ? '+' : ''
                    }}{{ formatGPA(attendanceInsight.estimatedGpaImpact) }}
                    points
                  </n-tag>
                </div>
              </div>
            </div>

            <!-- Correlation Analysis -->
            <div
              class="bg-background-card rounded-2xl shadow-sm border border-border overflow-hidden hover-elevate"
            >
              <div class="bg-gradient-primary p-6 text-white">
                <div class="flex items-center gap-3">
                  <Icon name="ph:chart-scatter" class="text-2xl" />
                  <h3 class="text-xl font-semibold">
                    Attendance-Performance Link
                  </h3>
                </div>
              </div>
              <div class="p-6 space-y-6">
                <div class="text-center">
                  <div class="text-4xl font-bold text-secondary mb-2">
                    {{
                      formatCorrelation(attendanceInsight.overallCorrelation)
                    }}
                  </div>
                  <p class="text-secondary mb-4">
                    {{
                      getCorrelationDescription(
                        attendanceInsight.overallCorrelation
                      )
                    }}
                  </p>
                  <div class="flex justify-center">
                    <div class="relative w-24 h-24">
                      <svg
                        class="w-24 h-24 transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-dasharray="100, 100"
                          class="text-border"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          :stroke="
                            getCorrelationColor(
                              attendanceInsight.overallCorrelation
                            )
                          "
                          stroke-width="3"
                          :stroke-dasharray="`${Math.abs(attendanceInsight.overallCorrelation) * 100}, 100`"
                          stroke-linecap="round"
                        />
                      </svg>
                      <div
                        class="absolute inset-0 flex items-center justify-center"
                      >
                        <span class="text-sm font-semibold text-primary">
                          {{
                            Math.abs(
                              attendanceInsight.overallCorrelation * 100
                            ).toFixed(0)
                          }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Attendance Comparison Chart -->
            <div
              class="bg-background-card rounded-2xl shadow-sm border border-border overflow-hidden hover-elevate"
            >
              <div class="p-6 border-b border-border">
                <div class="flex items-center gap-3">
                  <Icon name="ph:chart-bar" class="text-xl text-secondary" />
                  <h3 class="text-lg font-semibold text-primary">
                    Attendance by Subject
                  </h3>
                </div>
              </div>
              <div class="p-6">
                <div class="h-64">
                  <ClientOnly>
                    <AttendanceComparisonChart
                      :subject-insights="attendanceInsight.subjectInsights"
                    />
                    <template #fallback>
                      <div class="flex items-center justify-center h-full">
                        <n-spin />
                      </div>
                    </template>
                  </ClientOnly>
                </div>
              </div>
            </div>

            <!-- Performance Correlation Chart -->
            <div
              class="bg-background-card rounded-2xl shadow-sm border border-border overflow-hidden hover-elevate"
            >
              <div class="p-6 border-b border-border">
                <div class="flex items-center gap-3">
                  <Icon name="ph:chart-line" class="text-xl text-primary" />
                  <h3 class="text-lg font-semibold text-primary">
                    Performance vs Attendance
                  </h3>
                </div>
              </div>
              <div class="p-6">
                <div class="h-64">
                  <ClientOnly>
                    <PerformanceCorrelationChart
                      :subject-insights="attendanceInsight.subjectInsights"
                    />
                    <template #fallback>
                      <div class="flex items-center justify-center h-full">
                        <n-spin />
                      </div>
                    </template>
                  </ClientOnly>
                </div>
              </div>
            </div>
          </div>

          <!-- Subject Insights Table -->
          <div
            class="bg-background-card rounded-2xl shadow-sm border border-border overflow-hidden mb-8 hover-elevate"
          >
            <div class="p-6 border-b border-border">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <Icon name="ph:table" class="text-xl text-secondary" />
                  <h3 class="text-lg font-semibold text-primary">
                    Detailed Subject Analysis
                  </h3>
                </div>
                <n-button text size="small" @click="exportInsights">
                  <Icon name="ph:download" />
                  Export Data
                </n-button>
              </div>
            </div>
            <div class="p-6">
              <n-data-table
                :columns="subjectColumns"
                :data="attendanceInsight.subjectInsights"
                :bordered="false"
                :striped="true"
                :pagination="{ pageSize: 10 }"
                class="rounded-lg overflow-hidden"
              />
            </div>
          </div>

          <!-- Personalized Recommendations -->
          <div
            class="bg-background-card rounded-2xl shadow-sm border border-border overflow-hidden hover-elevate"
          >
            <div class="bg-gradient-primary p-6 text-white">
              <div class="flex items-center gap-3">
                <Icon name="ph:target" class="text-2xl" />
                <h3 class="text-xl font-semibold">Personalized Action Plan</h3>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-6">
                <div
                  v-for="(insight, index) in topRecommendations"
                  :key="index"
                  class="group p-6 bg-background-secondary rounded-xl border border-border hover:shadow-lg hover-elevate transition-all duration-200"
                >
                  <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 mt-1">
                      <div
                        class="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg"
                      >
                        <span class="text-sm font-bold text-white">{{
                          index + 1
                        }}</span>
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <h4 class="text-lg font-semibold text-primary">
                          {{ insight.subjectName }}
                        </h4>
                        <span
                          v-if="insight.semesterName"
                          class="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full"
                        >
                          {{ insight.semesterName }}
                        </span>
                      </div>
                      <p class="text-secondary mb-4 leading-relaxed">
                        {{ insight.personalizedRecommendation }}
                      </p>
                      <div class="flex flex-wrap gap-3">
                        <n-tag size="medium" type="info" round>
                          <template #icon>
                            <Icon name="ph:target" />
                          </template>
                          Target:
                          {{
                            formatPercentage(insight.optimalAttendanceTarget)
                          }}
                        </n-tag>
                        <n-tag size="medium" type="success" round>
                          <template #icon>
                            <Icon name="ph:trend-up" />
                          </template>
                          +{{ formatScore(insight.improvementPotential) }} pts
                          potential
                        </n-tag>
                        <n-tag
                          size="medium"
                          :type="
                            getPerformanceImpactType(insight.performanceImpact)
                          "
                          round
                        >
                          {{ insight.performanceImpact }} Impact
                        </n-tag>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="topRecommendations.length === 0"
                  class="text-center py-12"
                >
                  <div
                    class="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Icon
                      name="ph:check-circle"
                      class="text-2xl text-green-500"
                    />
                  </div>
                  <h4 class="text-lg font-semibold text-primary mb-2">
                    Excellent Attendance!
                  </h4>
                  <p class="text-secondary">
                    Your attendance is great across all subjects. Keep up the
                    excellent work!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import { useRoute } from 'vue-router';
import { useStudentStore } from '~/stores/student';
import { useAuthStore } from '~/stores/auth';
import { NTag, useMessage } from 'naive-ui';
import AttendanceComparisonChart from '~/components/student/charts/AttendanceComparisonChart.vue';
import PerformanceCorrelationChart from '~/components/student/charts/PerformanceCorrelationChart.vue';
import SemesterSelector from '~/components/student/SemesterSelector.vue';
import type { SemesterType } from '~/interfaces/academic/semester';
import type { SubjectAttendanceInsightDto } from '~/interfaces/student/analytics/subject-attendance-insight.dto';

definePageMeta({
  title: 'Attendance Insights',
  layout: 'dashboard-layout',
});

// Stores and utilities
const route = useRoute();
const studentStore = useStudentStore();
const authStore = useAuthStore();
const message = useMessage();

// State
const loading = ref(false);
const error = ref<string | null>(null);

// Semester parameters
const semesterParams = ref<{
  academicYear?: string | null;
  term?: SemesterType | null;
  semesterId?: string | null;
}>({});

// Get student ID from route or auth
const studentId = computed(() => {
  const paramId = route.params.id;
  if (paramId) {
    return Array.isArray(paramId) ? paramId[0] : paramId;
  }

  const queryId = route.query.studentId;
  if (queryId) {
    return Array.isArray(queryId) ? queryId[0] : queryId;
  }

  if (authStore.user?.roles?.includes('Student')) {
    return studentStore.selectedStudent?.id;
  }

  return null;
});

// Attendance insight query
const attendanceInsightQuery = computed(() => {
  if (!studentId.value) return null;
  return studentStore.attendanceInsightQuery(
    ref(studentId.value),
    ref(semesterParams.value)
  );
});

// Data from query
const attendanceInsight = computed(
  () => attendanceInsightQuery.value?.data?.value || null
);

// Available semesters
const availableSemesters = computed(
  () => studentStore.availableSemesters || []
);
const currentSemester = computed(() => studentStore.currentSemester);

// Loading states
const isLoading = computed(
  () => loading.value || attendanceInsightQuery.value?.isLoading?.value
);

// Current date
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Current semester display
const currentSemesterDisplay = computed(() => {
  if (attendanceInsight.value?.semesterName) {
    return attendanceInsight.value.semesterName;
  }
  if (currentSemester.value) {
    return `${currentSemester.value.semesterName} ${currentSemester.value.academicYear}`;
  }
  return null;
});

// Top recommendations (subjects with improvement potential)
const topRecommendations = computed(() => {
  if (!attendanceInsight.value?.subjectInsights) return [];

  return attendanceInsight.value.subjectInsights
    .filter(
      (insight: SubjectAttendanceInsightDto) => insight.improvementPotential > 0
    )
    .sort(
      (a: SubjectAttendanceInsightDto, b: SubjectAttendanceInsightDto) =>
        b.improvementPotential - a.improvementPotential
    )
    .slice(0, 3);
});

// Table columns
const subjectColumns = [
  {
    title: 'Subject',
    key: 'subjectName',
    render(row: SubjectAttendanceInsightDto) {
      return h('div', [
        h('div', { class: 'font-semibold text-primary' }, row.subjectName),
        row.semesterName
          ? h('div', { class: 'text-xs text-secondary mt-1' }, row.semesterName)
          : null,
      ]);
    },
  },
  {
    title: 'Your Attendance',
    key: 'studentAttendanceRate',
    render(row: SubjectAttendanceInsightDto) {
      const percentage = row.studentAttendanceRate * 100;
      return h('div', { class: 'text-center' }, [
        h(
          'div',
          { class: 'text-lg font-semibold mb-2 text-primary' },
          `${percentage.toFixed(1)}%`
        ),
        h('div', { class: 'w-full bg-background-secondary rounded-full h-2' }, [
          h('div', {
            class: `h-2 rounded-full transition-all duration-300 ${getAttendanceBarColor(row.studentAttendanceRate)}`,
            style: `width: ${percentage}%`,
          }),
        ]),
      ]);
    },
  },
  {
    title: 'Class Average',
    key: 'classAvgAttendanceRate',
    render(row: SubjectAttendanceInsightDto) {
      return h(
        'div',
        { class: 'text-center text-secondary font-medium' },
        `${(row.classAvgAttendanceRate * 100).toFixed(1)}%`
      );
    },
  },
  {
    title: 'Your Score',
    key: 'studentAverageScore',
    render(row: SubjectAttendanceInsightDto) {
      return h(
        'div',
        { class: 'text-center font-semibold text-primary' },
        row.studentAverageScore.toFixed(1)
      );
    },
  },
  {
    title: 'Performance Impact',
    key: 'performanceImpact',
    render(row: SubjectAttendanceInsightDto) {
      return h('div', { class: 'text-center' }, [
        h(
          NTag,
          {
            type: getPerformanceImpactType(row.performanceImpact),
            size: 'small',
            round: true,
          },
          { default: () => row.performanceImpact }
        ),
      ]);
    },
  },
  {
    title: 'Improvement Potential',
    key: 'improvementPotential',
    render(row: SubjectAttendanceInsightDto) {
      if (row.improvementPotential <= 0) {
        return h('div', { class: 'text-center text-muted' }, 'None');
      }

      return h('div', { class: 'text-center' }, [
        h(
          'div',
          { class: 'font-semibold text-primary mb-1' },
          `+${row.improvementPotential.toFixed(1)} pts`
        ),
        h(
          'div',
          { class: 'text-xs text-muted' },
          `Target: ${(row.optimalAttendanceTarget * 100).toFixed(0)}%`
        ),
      ]);
    },
  },
];

// Utility functions
const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

const formatScore = (value: number): string => {
  return value.toFixed(1);
};

const formatGPA = (value: number): string => {
  return value.toFixed(2);
};

const formatCorrelation = (value: number): string => {
  return (value * 100).toFixed(0) + '%';
};

const getAttendanceRateType = (rate: number): string => {
  if (rate >= 0.9) return 'success';
  if (rate >= 0.8) return 'info';
  if (rate >= 0.7) return 'warning';
  return 'error';
};

const getAttendanceRateLabel = (rate: number): string => {
  if (rate >= 0.9) return 'Excellent';
  if (rate >= 0.8) return 'Good';
  if (rate >= 0.7) return 'Fair';
  return 'Needs Improvement';
};

const getAttendanceBarColor = (rate: number): string => {
  if (rate >= 0.9) return 'bg-green-500';
  if (rate >= 0.8) return 'bg-primary';
  if (rate >= 0.7) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getPerformanceImpactType = (impact: string): string => {
  switch (impact?.toLowerCase()) {
    case 'high':
      return 'success';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'default';
  }
};

const getCorrelationColor = (correlation: number): string => {
  const abs = Math.abs(correlation);
  if (abs >= 0.7) return '#4ade80'; // primary green
  if (abs >= 0.5) return '#3b82f6'; // secondary blue
  if (abs >= 0.3) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};

const getCorrelationDescription = (correlation: number): string => {
  const abs = Math.abs(correlation);
  if (abs >= 0.7)
    return 'Strong correlation between attendance and performance';
  if (abs >= 0.5)
    return 'Moderate correlation between attendance and performance';
  if (abs >= 0.3) return 'Weak correlation between attendance and performance';
  return 'Little correlation between attendance and performance';
};

// Event handlers
const onSemesterChange = () => {
  refreshInsights();
};

const refreshInsights = async () => {
  if (!studentId.value) return;

  loading.value = true;
  error.value = null;

  try {
    await attendanceInsightQuery.value?.refetch();
  } catch (err: any) {
    error.value = err.message || 'Failed to refresh insights';
  } finally {
    loading.value = false;
  }
};

const exportInsights = () => {
  if (!attendanceInsight.value) return;

  // Simple CSV export
  const headers = [
    'Subject',
    'Semester',
    'Your Attendance',
    'Class Average',
    'Your Score',
    'Class Score',
    'Performance Impact',
    'Improvement Potential',
  ];

  const rows = attendanceInsight.value.subjectInsights.map(
    (insight: SubjectAttendanceInsightDto) => [
      insight.subjectName,
      insight.semesterName || '',
      (insight.studentAttendanceRate * 100).toFixed(1) + '%',
      (insight.classAvgAttendanceRate * 100).toFixed(1) + '%',
      insight.studentAverageScore.toFixed(1),
      insight.classAvgScore.toFixed(1),
      insight.performanceImpact,
      insight.improvementPotential.toFixed(1),
    ]
  );

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `attendance-insights-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  message.success('Insights exported successfully');
};

// Initialize
onMounted(async () => {
  if (!studentId.value) {
    error.value = 'No student ID available';
    return;
  }

  // Set default semester if none selected and current semester exists
  if (!semesterParams.value.term && currentSemester.value) {
    semesterParams.value = {
      academicYear: currentSemester.value.academicYear,
      term: currentSemester.value.semesterType as SemesterType,
      semesterId: currentSemester.value.semesterId,
    };
  }

  await refreshInsights();
});
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
