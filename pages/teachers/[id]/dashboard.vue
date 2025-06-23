<!-- pages/teachers/dashboard.vue -->
<template>
  <div class="w-full min-h-screen p-4 md:p-6 bg-background">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <n-spin size="large" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-lg bg-red-500/10 border border-red-500/20 p-4 mb-6"
    >
      <div class="flex items-center gap-2">
        <Icon name="ph:warning-circle" class="text-red-500" />
        <p class="text-red-500">{{ error }}</p>
      </div>
      <div class="mt-4">
        <n-button type="primary" @click="refreshDashboard">
          Try Again
        </n-button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Welcome Header with Semester Selector -->
      <div class="mb-6">
        <div class="bg-gradient-primary rounded-xl p-6 text-white">
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div class="flex items-center gap-4">
              <div class="rounded-lg p-3 bg-white/20 backdrop-blur-sm">
                <Icon name="ph:chalkboard-teacher" class="text-2xl" />
              </div>
              <div>
                <h1 class="text-xl md:text-2xl font-semibold m-0">
                  Welcome, {{ teacherFullName }}
                </h1>
                <p class="text-white/80 mt-1">
                  {{ currentDate }} • Teaching Dashboard
                </p>
                <!-- Semester Context Display -->
                <div
                  v-if="selectedSemesterName"
                  class="flex items-center gap-2 mt-2"
                >
                  <Icon name="ph:calendar" class="text-white/80" />
                  <span class="text-sm text-white/80">{{
                    selectedSemesterName
                  }}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <n-button quaternary circle @click="refreshDashboard">
                <Icon name="ph:arrows-clockwise" />
              </n-button>
              <n-dropdown
                :options="quickActionOptions"
                @select="handleQuickAction"
              >
                <n-button quaternary circle>
                  <Icon name="ph:plus" />
                </n-button>
              </n-dropdown>
            </div>
          </div>
        </div>
      </div>

      <!-- Semester Selector -->
      <div class="mb-6">
        <n-card class="bg-background-card border-border">
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div class="flex items-center gap-2">
              <Icon name="ph:calendar" class="text-xl text-primary" />
              <span class="text-text-primary font-medium"
                >Academic Semester</span
              >
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <n-select
                v-model:value="selectedSemesterId"
                :options="semesterOptions"
                placeholder="Select semester"
                class="min-w-48"
                :loading="loadingSemesters"
                @update:value="handleSemesterChange"
              />
              <n-button
                :disabled="!selectedSemesterId"
                type="primary"
                ghost
                @click="refreshDashboard"
              >
                <template #icon>
                  <Icon name="ph:arrows-clockwise" />
                </template>
                Refresh
              </n-button>
            </div>
          </div>
        </n-card>
      </div>

      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <n-card
          class="bg-background-card border-border hover:border-primary/30 transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-text-secondary mb-1">Total Students</p>
              <p class="text-2xl font-bold text-primary">
                {{ dashboardStats.totalStudents }}
              </p>
            </div>
            <div class="rounded-lg p-3 bg-primary/10">
              <Icon name="ph:student" class="text-xl text-primary" />
            </div>
          </div>
        </n-card>

        <n-card
          class="bg-background-card border-border hover:border-secondary/30 transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-text-secondary mb-1">Subjects</p>
              <p class="text-2xl font-bold text-secondary">
                {{ dashboardStats.totalSubjects }}
              </p>
            </div>
            <div class="rounded-lg p-3 bg-secondary/10">
              <Icon name="ph:book-open" class="text-xl text-secondary" />
            </div>
          </div>
        </n-card>

        <n-card
          class="bg-background-card border-border hover:border-primary/30 transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-text-secondary mb-1">Marks Given</p>
              <p class="text-2xl font-bold text-primary">
                {{ dashboardStats.totalMarksGiven }}
              </p>
            </div>
            <div class="rounded-lg p-3 bg-primary/10">
              <Icon name="ph:check-square" class="text-xl text-primary" />
            </div>
          </div>
        </n-card>

        <n-card
          class="bg-background-card border-border hover:border-orange-500/30 transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-text-secondary mb-1">Absences Recorded</p>
              <p class="text-2xl font-bold text-orange-500">
                {{ dashboardStats.totalAbsencesRecorded }}
              </p>
            </div>
            <div class="rounded-lg p-3 bg-orange-500/10">
              <Icon name="ph:calendar-x" class="text-xl text-orange-500" />
            </div>
          </div>
        </n-card>
      </div>

      <!-- Navigation Tabs -->
      <div class="mb-6">
        <n-tabs v-model:value="activeTab" type="line" class="dashboard-tabs">
          <n-tab name="overview" tab="Overview">
            <template #icon>
              <Icon name="ph:house" />
            </template>
          </n-tab>
          <n-tab name="analytics" tab="Analytics">
            <template #icon>
              <Icon name="ph:chart-line" />
            </template>
          </n-tab>
          <n-tab name="attendance" tab="Attendance">
            <template #icon>
              <Icon name="ph:calendar-check" />
            </template>
          </n-tab>
          <n-tab name="students" tab="Students">
            <template #icon>
              <Icon name="ph:users" />
            </template>
          </n-tab>
        </n-tabs>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Quick Actions -->
            <n-card class="bg-background-card border-border">
              <template #header>
                <div class="flex items-center gap-2">
                  <Icon name="ph:lightning" class="text-xl text-secondary" />
                  <span class="text-text-primary">Quick Actions</span>
                </div>
              </template>
              <div class="space-y-3">
                <n-button
                  block
                  type="primary"
                  ghost
                  class="border-primary/30 text-primary hover:bg-primary/10"
                  @click="showAddMarkModal = true"
                >
                  <template #icon>
                    <Icon name="ph:plus" />
                  </template>
                  Add New Mark
                </n-button>
                <n-button
                  block
                  type="info"
                  ghost
                  class="border-secondary/30 text-secondary hover:bg-secondary/10"
                  @click="showAddAbsenceModal = true"
                >
                  <template #icon>
                    <Icon name="ph:calendar-x" />
                  </template>
                  Record Absence
                </n-button>
                <n-button
                  block
                  ghost
                  class="border-text-secondary/30 text-text-secondary hover:bg-text-secondary/10"
                  @click="navigateToStudents"
                >
                  <template #icon>
                    <Icon name="ph:student" />
                  </template>
                  Manage Students
                </n-button>
                <n-button
                  block
                  ghost
                  class="border-text-secondary/30 text-text-secondary hover:bg-text-secondary/10"
                  @click="activeTab = 'analytics'"
                >
                  <template #icon>
                    <Icon name="ph:chart-line" />
                  </template>
                  View Analytics
                </n-button>
              </div>
            </n-card>

            <!-- Subject Breakdown -->
            <n-card class="bg-background-card border-border">
              <template #header>
                <div class="flex items-center gap-2">
                  <Icon name="ph:books" class="text-xl text-primary" />
                  <span class="text-text-primary">My Subjects</span>
                </div>
              </template>
              <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                <div
                  v-for="subject in teacherSubjects"
                  :key="subject.id"
                  class="flex items-center justify-between p-3 rounded-lg bg-background-secondary hover:bg-background-secondary/80 border border-border hover:border-primary/30 transition-all cursor-pointer"
                  @click="selectSubject(subject)"
                >
                  <div>
                    <p class="font-medium text-text-primary">
                      {{ subject.name }}
                    </p>
                    <p class="text-sm text-text-secondary">
                      {{ subject.code }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-text-primary">
                      {{ getStudentCountForSubject(subject.id) }} students
                    </p>
                    <p class="text-xs text-text-muted">
                      {{ subject.creditHours || 0 }} credits
                    </p>
                  </div>
                </div>
                <div
                  v-if="teacherSubjects.length === 0"
                  class="text-center py-8 text-text-secondary"
                >
                  <Icon name="ph:books" class="text-2xl mb-2" />
                  <p>No subjects assigned</p>
                </div>
              </div>
            </n-card>

            <!-- Recent Activity -->
            <n-card class="bg-background-card border-border">
              <template #header>
                <div class="flex items-center gap-2">
                  <Icon name="ph:clock" class="text-xl text-orange-500" />
                  <span class="text-text-primary">Recent Activity</span>
                </div>
              </template>
              <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                <div
                  v-for="mark in recentMarks.slice(0, 3)"
                  :key="`mark-${mark.id}`"
                  class="flex items-center justify-between p-2 rounded-lg bg-background-secondary"
                >
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-text-primary truncate">
                      {{ mark.studentName }}
                    </p>
                    <p class="text-xs text-text-secondary truncate">
                      <!-- ENHANCED: Show grade if available, fallback to value -->
                      {{ mark.grade || mark.value }} - {{ mark.subjectName }}
                    </p>
                  </div>
                  <div class="text-xs text-text-muted">
                    {{ formatDate(mark.createdAt) }}
                  </div>
                </div>
                <div
                  v-for="absence in recentAbsences.slice(0, 2)"
                  :key="`absence-${absence.id}`"
                  class="flex items-center justify-between p-2 rounded-lg bg-background-secondary"
                >
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-text-primary truncate">
                      {{ absence.studentName }}
                    </p>
                    <p class="text-xs text-text-secondary truncate">
                      Absence - {{ absence.subjectName }}
                    </p>
                  </div>
                  <div class="text-xs text-text-muted">
                    {{ formatDate(absence.date) }}
                  </div>
                </div>
                <div
                  v-if="recentMarks.length === 0 && recentAbsences.length === 0"
                  class="text-center py-8 text-text-secondary"
                >
                  <Icon name="ph:clock" class="text-2xl mb-2" />
                  <p>No recent activity</p>
                </div>
              </div>
            </n-card>
          </div>

          <!-- At-Risk Students Alert -->
          <n-card
            v-if="hasAtRiskStudents"
            class="bg-background-card border-orange-500/30"
          >
            <template #header>
              <div class="flex items-center gap-2">
                <Icon name="ph:warning" class="text-xl text-orange-500" />
                <span class="text-orange-500">Students at Risk</span>
                <n-badge
                  :value="atRiskStudentsCount"
                  type="warning"
                  show-zero
                />
                <!-- Semester context for at-risk students -->
                <span
                  v-if="selectedSemesterName"
                  class="text-sm text-text-muted ml-2"
                >
                  ({{ selectedSemesterName }})
                </span>
              </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="student in safeAtRiskStudents.slice(0, 6)"
                :key="student.id"
                class="p-4 rounded-lg border border-orange-500/30 bg-orange-500/5"
              >
                <div class="flex items-center justify-between mb-2">
                  <p class="font-medium text-text-primary">
                    {{ student.firstName }} {{ student.lastName }}
                  </p>
                  <n-tag
                    :type="student.riskLevel === 'high' ? 'error' : 'warning'"
                    size="small"
                  >
                    {{ student.riskLevel }} risk
                  </n-tag>
                </div>
                <p class="text-sm text-text-secondary">
                  {{ student.gradeName }}
                </p>
                <p class="text-sm text-text-primary">
                  <span class="font-medium">{{ student.totalAbsences }}</span>
                  absences
                  <span class="text-text-muted ml-2"
                    >({{ Math.round(student.absenceRate) }}% rate)</span
                  >
                </p>
              </div>
            </div>
            <div v-if="atRiskStudentsCount > 6" class="mt-4 text-center">
              <n-button
                type="warning"
                ghost
                class="border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
                @click="activeTab = 'students'"
              >
                View All {{ atRiskStudentsCount }} At-Risk Students
              </n-button>
            </div>
          </n-card>
        </div>

        <!-- Analytics Tab -->
        <div v-if="activeTab === 'analytics'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Average Marks Chart -->
            <n-card class="bg-background-card border-border">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:chart-bar" class="text-xl text-primary" />
                    <span class="text-text-primary"
                      >Average Marks by Subject</span
                    >
                    <span
                      v-if="selectedSemesterName"
                      class="text-sm text-text-muted"
                    >
                      ({{ selectedSemesterName }})
                    </span>
                  </div>
                  <n-button text @click="refreshDashboard">
                    <Icon
                      name="ph:arrows-clockwise"
                      class="text-text-secondary hover:text-primary"
                    />
                  </n-button>
                </div>
              </template>
              <ClientOnly>
                <MarksChart :marks-data="averageMarksBySubject" />
              </ClientOnly>
            </n-card>

            <!-- Students Distribution Chart -->
            <n-card class="bg-background-card border-border">
              <template #header>
                <div class="flex items-center gap-2">
                  <Icon name="ph:users" class="text-xl text-secondary" />
                  <span class="text-text-primary">Students by Grade</span>
                </div>
              </template>
              <ClientOnly>
                <StudentsChart :students-data="studentsByGrade" />
              </ClientOnly>
            </n-card>

            <!-- Attendance Trends -->
            <n-card
              v-if="currentTeacher?.data?.value?.id"
              class="lg:col-span-2 bg-background-card border-border"
            >
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon
                      name="ph:chart-line-up"
                      class="text-xl text-secondary"
                    />
                    <span class="text-text-primary">Attendance Trends</span>
                    <span
                      v-if="selectedSemesterName"
                      class="text-sm text-text-muted"
                    >
                      ({{ selectedSemesterName }})
                    </span>
                  </div>
                  <div class="flex gap-2">
                    <n-select
                      v-model:value="selectedTimeFrame"
                      :options="timeFrameOptions"
                      size="small"
                      style="width: 120px"
                      @update:value="updateAttendanceData"
                    />
                  </div>
                </div>
              </template>
              <ClientOnly>
                <AttendanceOverview
                  :teacher-id="currentTeacher.data.value.id"
                  :semester-id="selectedSemesterId"
                  :days-to-show="
                    parseInt(selectedTimeFrame.replace('days', '')) || 7
                  "
                />
              </ClientOnly>
            </n-card>
          </div>
        </div>

        <!-- Attendance Tab -->
        <div v-if="activeTab === 'attendance'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Attendance Overview -->
            <ClientOnly v-if="currentTeacher?.data?.value?.id">
              <AttendanceOverview
                :teacher-id="currentTeacher.data.value.id"
                :semester-id="selectedSemesterId"
                :days-to-show="14"
              />
            </ClientOnly>

            <!-- Excused vs Unexcused Breakdown -->
            <ClientOnly v-if="currentTeacher?.data?.value?.id">
              <ExcusedUnexcusedBreakdown
                :teacher-id="currentTeacher.data.value.id"
                :semester-id="selectedSemesterId"
                time-frame="month"
              />
            </ClientOnly>
          </div>

          <!-- Recent Absences -->
          <n-card class="bg-background-card border-border">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Icon name="ph:calendar-x" class="text-xl text-red-500" />
                  <span class="text-text-primary">Recent Absences</span>
                  <span
                    v-if="selectedSemesterName"
                    class="text-sm text-text-muted"
                  >
                    ({{ selectedSemesterName }})
                  </span>
                </div>
                <n-button
                  text
                  size="small"
                  class="text-text-secondary hover:text-primary"
                  @click="navigateToAbsences"
                >
                  View All
                </n-button>
              </div>
            </template>
            <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              <div
                v-for="absence in recentAbsences"
                :key="absence.id"
                class="flex items-center justify-between p-3 rounded-lg bg-background-secondary border border-border"
              >
                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate text-text-primary">
                    {{ absence.studentName }}
                  </p>
                  <p class="text-sm text-text-secondary truncate">
                    {{ absence.subjectName }}
                  </p>
                  <p class="text-xs text-text-muted">
                    {{ formatDate(absence.date) }}
                  </p>
                </div>
                <div class="text-right ml-3">
                  <n-tag
                    :type="absence.isExcused ? 'warning' : 'error'"
                    size="small"
                  >
                    {{ absence.isExcused ? 'Excused' : 'Unexcused' }}
                  </n-tag>
                </div>
              </div>
              <div
                v-if="recentAbsences.length === 0"
                class="text-center py-8 text-text-secondary"
              >
                <Icon name="ph:calendar-check" class="text-2xl mb-2" />
                <p>No recent absences</p>
              </div>
            </div>
          </n-card>
        </div>

        <!-- Students Tab -->
        <div v-if="activeTab === 'students'" class="space-y-6">
          <!-- At-Risk Students Component -->
          <ClientOnly v-if="currentTeacher?.data?.value?.id">
            <AtRiskStudents
              :teacher-id="currentTeacher.data.value.id"
              :semester-id="selectedSemesterId"
            />
          </ClientOnly>

          <!-- Recent Marks -->
          <n-card class="bg-background-card border-border">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Icon name="ph:check-circle" class="text-xl text-primary" />
                  <span class="text-text-primary">Recent Marks</span>
                  <span
                    v-if="selectedSemesterName"
                    class="text-sm text-text-muted"
                  >
                    ({{ selectedSemesterName }})
                  </span>
                </div>
                <n-button
                  text
                  size="small"
                  class="text-text-secondary hover:text-primary"
                  @click="navigateToMarks"
                >
                  View All
                </n-button>
              </div>
            </template>
            <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              <div
                v-for="mark in recentMarks"
                :key="mark.id"
                class="flex items-center justify-between p-3 rounded-lg bg-background-secondary border border-border"
              >
                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate text-text-primary">
                    {{ mark.studentName }}
                  </p>
                  <p class="text-sm text-text-secondary truncate">
                    {{ mark.subjectName }}
                  </p>
                  <p class="text-xs text-text-muted">
                    {{ formatDate(mark.createdAt) }}
                  </p>
                </div>
                <div class="text-right ml-3">
                  <div class="flex flex-col items-end gap-1">
                    <!-- ENHANCED: Show grade and GPA if available -->
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium"
                      :class="getMarkColorClass(mark.value)"
                    >
                      {{ mark.grade || mark.value }}
                    </span>
                    <div v-if="mark.gpaPoints" class="text-xs text-text-muted">
                      {{ mark.gpaPoints }} GPA
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="recentMarks.length === 0"
                class="text-center py-8 text-text-secondary"
              >
                <Icon name="ph:clipboard" class="text-2xl mb-2" />
                <p>No recent marks</p>
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </template>

    <n-modal v-model:show="showAddMarkModal" :mask-closable="false">
      <n-card
        style="width: 95vw; max-width: 900px"
        :bordered="false"
        size="huge"
        class="bg-background-card border-border"
      >
        <MarkForm
          :loading="isCreatingMark"
          :teacher-id="currentTeacher?.data?.value?.id"
          :teacher-name="teacherFullName"
          :subject-options="subjectOptions"
          :student-options="studentOptions"
          :semester-options="enhancedSemesterOptions"
          :grading-system="institutionGradingSystem"
          :semester-id="selectedSemesterId"
          :institution-id="institutionId"
          :loading-subjects="false"
          :loading-students="false"
          :loading-semesters="loadingSemesters"
          @submit="handleMarkSubmit"
          @cancel="showAddMarkModal = false"
        />
      </n-card>
    </n-modal>

    <!-- ENHANCED: Add Absence Modal with Semester Support -->
    <n-modal v-model:show="showAddAbsenceModal" :mask-closable="false">
      <n-card
        style="width: 95vw; max-width: 900px"
        :bordered="false"
        size="huge"
        class="bg-background-card border-border"
      >
        <AbsenceForm
          :loading="isCreatingAbsence"
          :student-options="studentOptions"
          :subject-options="subjectOptions"
          :semester-id="selectedSemesterId"
          :current-semester="selectedSemesterData"
          :semester-options="enhancedSemesterOptions"
          :institution-id="institutionId"
          :loading-students="false"
          :loading-subjects="false"
          :teacher-id="currentTeacher?.data?.value?.id"
          :teacher-name="teacherFullName"
          @submit="handleAbsenceSubmit"
          @cancel="showAddAbsenceModal = false"
        />
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  NSpin,
  NCard,
  NButton,
  NDropdown,
  NTag,
  NBadge,
  NModal,
  NSelect,
  NTabs,
  NTab,
  useNotification, // CHANGED: from useMessage to useNotification
} from 'naive-ui';
import { useTeacherStore } from '@/stores/teacher';
import { useAuthStore } from '@/stores/auth';
import MarkForm from '~/components/teacher/forms/MarkForm.vue';
import AbsenceForm from '~/components/teacher/forms/AbsenceForm.vue';
import AttendanceOverview from '@/components/teacher/attendance/AttendanceOverview.vue';
import ExcusedUnexcusedBreakdown from '~/components/teacher/attendance/ExcusedUnexcusedBreakdown.vue';
import AtRiskStudents from '@/components/teacher/attendance/AtRiskStudents.vue';
import MarksChart from '@/components/teacher/charts/MarksChart.vue';
import StudentsChart from '@/components/teacher/charts/StudentsByGradeChart.vue';
import type {
  AtRiskStudentsFilterParams,
  CreateMarkDto,
  CreateAbsenceDto,
} from '@/stores/teacher';

definePageMeta({
  layout: 'dashboard-layout',
});

// Stores and utilities
const teacherStore = useTeacherStore();
const authStore = useAuthStore();
const router = useRouter();
const notification = useNotification();

// State
const loading = ref(false);
const error = ref<string | null>(null);
const showAddMarkModal = ref(false);
const showAddAbsenceModal = ref(false);
const selectedTimeFrame = ref('7days');
const activeTab = ref('overview');

// Semester state
const selectedSemesterId = ref<string | null>(null);
const loadingSemesters = ref(false);

// Computed properties with proper null safety
const currentTeacher = computed(() => {
  if (!authStore.user?.id) return null;
  return teacherStore.teacherByUserIdQuery(ref(authStore.user.id));
});

const selectedSemesterData = computed(() => {
  if (!selectedSemesterId.value) return null;
  return (
    availableSemesters.value.find((s) => s.id === selectedSemesterId.value) ||
    null
  );
});

const teacherFullName = computed(() => {
  const teacher = currentTeacher.value?.data?.value;
  if (!teacher) return 'Teacher';
  return (
    `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || 'Teacher'
  );
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Institution-based queries for semesters and grading system
const institutionId = computed(
  () => currentTeacher.value?.data?.value?.institutionId
);

const semestersQuery = computed(() => {
  const instId = institutionId.value;
  if (!instId) return null;
  return teacherStore.semestersQuery(ref(instId));
});

const currentSemesterQuery = computed(() => {
  const instId = institutionId.value;
  if (!instId) return null;
  return teacherStore.currentSemesterQuery(ref(instId));
});

const gradingSystemQuery = computed(() => {
  const instId = institutionId.value;
  if (!instId) return null;
  return teacherStore.institutionGradingSystemQuery(ref(instId));
});

// ENHANCED: Dashboard query with semester support
const dashboardQuery = computed(() => {
  const teacherId = currentTeacher.value?.data?.value?.id;
  if (!teacherId) return null;
  return teacherStore.teacherDashboardQuery(
    ref(teacherId),
    ref(selectedSemesterId.value)
  );
});

const dashboardData = computed(() => dashboardQuery.value?.data?.value || null);

const dashboardStats = computed(() => {
  const data = dashboardData.value;
  return {
    totalStudents: data?.totalStudents || 0,
    totalSubjects: data?.subjectsCount || 0,
    totalMarksGiven: data?.totalMarks || 0,
    totalAbsencesRecorded: data?.totalAbsences || 0,
  };
});

const teacherSubjects = computed(() => dashboardData.value?.subjects || []);
const recentMarks = computed(() => dashboardData.value?.recentMarks || []);
const recentAbsences = computed(
  () => dashboardData.value?.recentAbsences || []
);
const averageMarksBySubject = computed(
  () => dashboardData.value?.averageMarksBySubject || {}
);
const studentsByGrade = computed(
  () => dashboardData.value?.studentsByGrade || []
);

// Semester-related computed properties
const availableSemesters = computed(
  () => semestersQuery.value?.data?.value || []
);
const currentSemester = computed(
  () => currentSemesterQuery.value?.data?.value || null
);
const institutionGradingSystem = computed(
  () => gradingSystemQuery.value?.data?.value || null
);

// Basic semester options for dashboard selector
const semesterOptions = computed(() => {
  return availableSemesters.value.map((semester) => ({
    label: semester.name,
    value: semester.id,
  }));
});

// ENHANCED: Semester options for MarkForm with better labels
const enhancedSemesterOptions = computed(() => {
  return availableSemesters.value.map((semester) => ({
    label: `${semester.name} (${semester.academicYearName})${semester.isCurrent ? ' - Current' : ''}`,
    value: semester.id,
  }));
});

const selectedSemesterName = computed(() => {
  if (!selectedSemesterId.value) return null;
  const semester = availableSemesters.value.find(
    (s) => s.id === selectedSemesterId.value
  );
  return semester?.name || null;
});

// At-risk students with complete null safety and semester support
const atRiskStudentsQuery = computed(() => {
  const teacherId = currentTeacher.value?.data?.value?.id;
  if (!teacherId) return null;

  const params: AtRiskStudentsFilterParams = {
    semesterId: selectedSemesterId.value || undefined,
    highRiskThreshold: 20,
    mediumRiskThreshold: 10,
    totalClassDays: 30,
  };

  return teacherStore.atRiskStudentsQuery(ref(teacherId), ref(params));
});

const atRiskStudents = computed(
  () => atRiskStudentsQuery.value?.data?.value || null
);
const safeAtRiskStudents = computed(() => atRiskStudents.value?.students || []);
const atRiskStudentsCount = computed(() => safeAtRiskStudents.value.length);
const hasAtRiskStudents = computed(() => atRiskStudentsCount.value > 0);

// Loading states - direct access without .value
const isLoading = computed(() => loading.value || teacherStore.isLoading);
const isCreatingMark = computed(
  () => teacherStore.createMarkMutation?.isLoading || false
);
const isCreatingAbsence = computed(
  () => teacherStore.createAbsenceMutation?.isLoading || false
);

// Form options
const subjectOptions = computed(() => {
  return teacherSubjects.value.map((subject) => ({
    label: subject.name,
    value: subject.id,
  }));
});

const studentOptions = computed(() => {
  const allStudents: Array<{ label: string; value: string }> = [];

  studentsByGrade.value.forEach((grade) => {
    grade.students?.forEach((student) => {
      allStudents.push({
        label: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
        value: student.id,
      });
    });
  });

  return allStudents;
});

const timeFrameOptions = [
  { label: '7 Days', value: '7days' },
  { label: '14 Days', value: '14days' },
  { label: '30 Days', value: '30days' },
];

const quickActionOptions = [
  { label: 'Add Mark', key: 'add-mark' },
  { label: 'Record Absence', key: 'add-absence' },
  { label: 'View Analytics', key: 'analytics' },
];

// Semester change handler
const handleSemesterChange = async (semesterId: string | null) => {
  selectedSemesterId.value = semesterId;
  await refreshDashboard();
};

// ENHANCED: Form submission handlers with semester support
const handleMarkSubmit = async (markData: CreateMarkDto) => {
  const teacherId = currentTeacher.value?.data?.value?.id;
  if (!teacherId) return;

  try {
    // Ensure semester context is included
    const submissionData = {
      ...markData,
      semesterId: markData.semesterId || selectedSemesterId.value,
    };

    await teacherStore.createMark(teacherId, submissionData);
    notification.success({
      title: 'Success',
      content: 'Mark added successfully',
      duration: 3000,
    });
    showAddMarkModal.value = false;
    await refreshDashboard();
  } catch (error: any) {
    notification.error({
      title: 'Error',
      content: error.message || 'Failed to add mark',
      duration: 5000,
    });
  }
};

const handleAbsenceSubmit = async (absenceData: CreateAbsenceDto) => {
  const teacherId = currentTeacher.value?.data?.value?.id;
  if (!teacherId) return;

  try {
    // Convert date to ISO string format and ensure semester context
    const submissionData = {
      ...absenceData,
      date:
        typeof absenceData.date === 'string'
          ? absenceData.date
          : absenceData.date.toISOString().split('T')[0],
      semesterId: absenceData.semesterId || selectedSemesterId.value,
    };

    await teacherStore.createAbsence(teacherId, submissionData);
    notification.success({
      title: 'Success',
      content: 'Absence recorded successfully',
      duration: 3000,
    });
    showAddAbsenceModal.value = false;
    await refreshDashboard();
  } catch (error: any) {
    notification.error({
      title: 'Error',
      content: error.message || 'Failed to record absence',
      duration: 5000,
    });
  }
};

// Methods
const refreshDashboard = async () => {
  const teacherId = currentTeacher.value?.data?.value?.id;
  if (!teacherId) return;

  loading.value = true;
  error.value = null;

  try {
    await Promise.all([
      dashboardQuery.value?.refetch(),
      atRiskStudentsQuery.value?.refetch(),
    ]);
  } catch (err: any) {
    error.value = err.message || 'Failed to refresh dashboard';
    notification.error({
      title: 'Error',
      content: error.value,
      duration: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const handleQuickAction = (key: string) => {
  switch (key) {
    case 'add-mark':
      showAddMarkModal.value = true;
      break;
    case 'add-absence':
      showAddAbsenceModal.value = true;
      break;
    case 'analytics':
      activeTab.value = 'analytics';
      break;
  }
};

const selectSubject = (subject: any) => {
  router.push(
    `/teachers/subjects/${subject.id}?semester=${selectedSemesterId.value || ''}`
  );
};

const getStudentCountForSubject = (subjectId: string): number => {
  return studentsByGrade.value.reduce((total, grade) => {
    return total + (grade.students?.length || 0);
  }, 0);
};

const getMarkColorClass = (value: number): string => {
  if (value >= 5.5)
    return 'bg-primary/20 text-primary border border-primary/30';
  if (value >= 4.5)
    return 'bg-secondary/20 text-secondary border border-secondary/30';
  if (value >= 3.5)
    return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30';
  if (value >= 2.5)
    return 'bg-orange-500/20 text-orange-500 border border-orange-500/30';
  return 'bg-red-500/20 text-red-500 border border-red-500/30';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const updateAttendanceData = async () => {
  // Trigger refresh for attendance components
  await refreshDashboard();
};

const navigateToStudents = () => {
  router.push(`/teachers/students?semester=${selectedSemesterId.value || ''}`);
};

const navigateToMarks = () => {
  router.push(`/teachers/marks?semester=${selectedSemesterId.value || ''}`);
};

const navigateToAbsences = () => {
  router.push(`/teachers/absences?semester=${selectedSemesterId.value || ''}`);
};

// Initialize dashboard with semester support
onMounted(async () => {
  if (!authStore.user) {
    router.push('/login');
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Wait for teacher data to load
    await currentTeacher.value?.refetch();

    if (!currentTeacher.value?.data?.value) {
      error.value = 'Teacher profile not found';
      return;
    }

    const instId = institutionId.value;
    if (instId) {
      // Load semesters and grading system
      loadingSemesters.value = true;
      await Promise.all([
        semestersQuery.value?.refetch(),
        currentSemesterQuery.value?.refetch(),
        gradingSystemQuery.value?.refetch(),
      ]);
      loadingSemesters.value = false;

      // Set default semester to current semester
      if (currentSemester.value && !selectedSemesterId.value) {
        selectedSemesterId.value = currentSemester.value.id;
      }
    }

    // Load dashboard data
    await Promise.all([
      dashboardQuery.value?.refetch(),
      atRiskStudentsQuery.value?.refetch(),
    ]);
  } catch (err: any) {
    error.value = err.message || 'Failed to load dashboard';
    notification.error({
      title: 'Error',
      content: error.value,
      duration: 5000,
    });
  } finally {
    loading.value = false;
    loadingSemesters.value = false;
  }
});

// Watch for semester changes and refetch data
watch(selectedSemesterId, async (newSemesterId, oldSemesterId) => {
  if (newSemesterId !== oldSemesterId && newSemesterId) {
    await refreshDashboard();
  }
});
</script>

<style scoped>
/* Custom scrollbar for overflow areas */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(var(--color-background-secondary-rgb, 38, 38, 41), 0.5);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(var(--color-primary-rgb, 74, 222, 128), 0.5);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--color-primary-rgb, 74, 222, 128), 0.7);
}

/* Tab styles */
.dashboard-tabs :deep(.n-tabs-nav) {
  background: var(--color-background-card, #18181c);
  border-radius: 8px;
  padding: 4px;
}

.dashboard-tabs :deep(.n-tabs-tab) {
  border-radius: 6px;
  transition: all 0.2s ease;
}

.dashboard-tabs :deep(.n-tabs-tab:hover) {
  background: var(--color-background-secondary, #262629);
}

.dashboard-tabs :deep(.n-tabs-tab--active) {
  color: white;
}

.tab-content {
  min-height: 500px;
}

/* Responsive design improvements */
@media (max-width: 768px) {
  .dashboard-tabs :deep(.n-tabs-tab) {
    padding: 8px 12px;
    font-size: 12px;
  }

  .tab-content {
    min-height: 400px;
  }
}
</style>
