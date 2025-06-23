<template>
  <div class="min-h-screen bg-background">
    <!-- Loading State -->
    <div
      v-if="isInitialLoading"
      class="flex items-center justify-center min-h-screen"
    >
      <div class="text-center space-y-4">
        <div class="relative">
          <div
            class="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin mx-auto"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-primary">Loading Dashboard</h3>
          <p class="text-sm text-secondary mt-1">
            Setting up your academic overview...
          </p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="mainError"
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
          Something went wrong
        </h3>
        <p class="text-secondary mb-6">{{ mainError }}</p>
        <div class="flex gap-3 justify-center">
          <n-button type="primary" size="large" @click="initializeDashboard">
            <template #icon>
              <Icon name="ph:arrow-clockwise" />
            </template>
            Try Again
          </n-button>
          <n-button quaternary size="large" @click="showDebug = !showDebug">
            <template #icon>
              <Icon name="ph:bug" />
            </template>
            Debug
          </n-button>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <template v-else-if="currentStudentId">
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
                      Welcome back, {{ displayName }}
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
                    :to="`/students/${currentStudentId}/attendance-insights`"
                    class="inline-flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200 hover-elevate font-medium text-sm lg:text-base"
                  >
                    <Icon name="ph:chart-line-up" class="text-lg" />
                    <span class="hidden sm:inline">Attendance Insights</span>
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
                  <div class="flex items-center gap-2 text-text-muted">
                    <Icon name="ph:clock" class="text-sm" />
                    <span>Last updated: {{ lastUpdated || 'Just now' }}</span>
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
              :loading="isRefreshing"
              @change="onSemesterChange"
              @refresh="refreshAllData"
            />
          </div>
        </div>

        <!-- Current Semester Overview -->
        <div v-if="currentSemesterData" class="mb-8">
          <div class="bg-gradient-primary rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
                >
                  <Icon name="ph:trending-up" class="text-xl" />
                </div>
                <div>
                  <h3 class="text-xl font-bold">
                    {{ currentSemesterData.semesterName }}
                  </h3>
                  <p class="text-white/80">
                    {{ currentSemesterData.semesterType }}
                    {{ currentSemesterData.academicYear }}
                  </p>
                </div>
              </div>
              <div
                v-if="isCurrentSemesterActive"
                class="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full"
              >
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span class="text-sm font-medium">Active</span>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold">
                  {{ formatGPA(currentSemesterData.gpa) }}
                </div>
                <div class="text-sm text-white/80">GPA</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold">
                  {{ currentSemesterData.credits }}
                </div>
                <div class="text-sm text-white/80">Credits</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold">
                  {{ currentSemesterData.courses?.length || 0 }}
                </div>
                <div class="text-sm text-white/80">Courses</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Semester Navigation Tabs -->
        <div v-if="availableSemesters.length > 0" class="mb-8">
          <div
            class="bg-background-card rounded-2xl shadow-sm border border-border p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <Icon name="ph:calendar-dots" class="text-lg text-secondary" />
              <h3 class="text-lg font-semibold text-primary">
                Semester Breakdown
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="semester in availableSemesters"
                :key="semester.semesterId"
                class="relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover-elevate"
                :class="[
                  semester.semesterId === semesterParams.semesterId
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border-hover',
                ]"
                @click="selectSemester(semester)"
              >
                <div
                  v-if="semester.semesterId === currentSemester?.semesterId"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Icon name="ph:check" class="text-xs text-white" />
                </div>
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-semibold text-primary">
                    {{ semester.semesterName }}
                  </h4>
                  <span
                    class="text-xs px-2 py-1 bg-background-secondary rounded-full text-secondary"
                  >
                    {{ semester.semesterType }}
                  </span>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div class="text-secondary">GPA</div>
                    <div class="font-semibold text-primary">
                      {{ formatGPA(semester.gpa) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-secondary">Credits</div>
                    <div class="font-semibold text-primary">
                      {{ semester.credits }}
                    </div>
                  </div>
                </div>
                <div class="mt-2 text-xs text-muted">
                  {{ semester.courses?.length || 0 }} courses
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Tabs -->
        <div
          class="bg-background-card rounded-2xl shadow-sm border border-border overflow-hidden"
        >
          <div class="border-b border-border">
            <n-tabs v-model:value="activeTab" type="line" class="px-6">
              <n-tab name="overview" tab="Overview">
                <template #icon>
                  <Icon name="ph:house" />
                </template>
              </n-tab>
              <n-tab name="grades" tab="Grades">
                <template #icon>
                  <Icon name="ph:chart-bar" />
                </template>
              </n-tab>
              <n-tab name="attendance" tab="Attendance">
                <template #icon>
                  <Icon name="ph:calendar-check" />
                </template>
              </n-tab>
              <n-tab name="transcript" tab="Transcript">
                <template #icon>
                  <Icon name="ph:file-text" />
                </template>
              </n-tab>
            </n-tabs>
          </div>

          <div class="p-6">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="space-y-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Current Courses -->
                <div>
                  <div class="flex items-center gap-3 mb-6">
                    <Icon name="ph:books" class="text-xl text-secondary" />
                    <h3 class="text-xl font-semibold text-primary">
                      Current Courses
                    </h3>
                  </div>
                  <div class="space-y-3 max-h-96 overflow-y-auto">
                    <div
                      v-for="course in currentCourses.slice(0, 6)"
                      :key="course.id"
                      class="group p-4 rounded-xl bg-background-secondary border border-border hover:shadow-md hover-elevate transition-all duration-200"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex-1 min-w-0">
                          <h4 class="font-semibold text-primary truncate">
                            {{ course.code }} - {{ course.name }}
                          </h4>
                          <p class="text-sm text-secondary truncate mt-1">
                            {{ course.instructor }}
                          </p>
                          <div
                            v-if="course.semesterName"
                            class="flex items-center gap-2 mt-2"
                          >
                            <span
                              class="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full"
                            >
                              {{ course.semesterName }}
                            </span>
                            <span
                              v-if="course.credits"
                              class="text-xs text-muted"
                            >
                              {{ course.credits }} credits
                            </span>
                          </div>
                        </div>
                        <div class="text-right ml-4">
                          <div
                            v-if="course.grade"
                            class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                            :style="{
                              backgroundColor: getGradeColor(course.grade),
                            }"
                          >
                            {{ course.grade }}
                          </div>
                          <div v-else class="text-sm text-muted text-center">
                            In Progress
                          </div>
                          <div
                            v-if="course.score !== undefined"
                            class="text-xs text-muted mt-1"
                          >
                            {{ course.score.toFixed(1) }}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="currentCourses.length === 0"
                      class="text-center py-12 text-muted"
                    >
                      <Icon name="ph:books" class="text-3xl mb-3" />
                      <p>No courses found for this semester</p>
                    </div>
                  </div>
                </div>

                <!-- Grade Distribution Chart -->
                <div>
                  <div class="flex items-center gap-3 mb-6">
                    <Icon name="ph:chart-pie" class="text-xl text-primary" />
                    <h3 class="text-xl font-semibold text-primary">
                      Grade Distribution
                    </h3>
                  </div>
                  <div class="h-64 bg-background-secondary rounded-xl p-4">
                    <ClientOnly>
                      <GradeDistributionChart
                        :courses="currentCourses"
                        :height="240"
                        empty-message="No grade data available for this semester"
                      />
                    </ClientOnly>
                  </div>
                </div>
              </div>

              <!-- Performance Trends -->
              <div v-if="hasPerformanceTrend">
                <div class="flex items-center gap-3 mb-6">
                  <Icon name="ph:chart-line" class="text-xl text-primary" />
                  <h3 class="text-xl font-semibold text-primary">
                    Performance Trend
                  </h3>
                </div>
                <div class="h-64 bg-background-secondary rounded-xl p-4">
                  <ClientOnly>
                    <PerformanceTrendChart
                      :performance-trend="dashboardData?.performanceTrend"
                      :height="240"
                      empty-message="Insufficient data for trend analysis"
                    />
                  </ClientOnly>
                </div>
              </div>

              <!-- Teacher Comments -->
              <div v-if="hasComments">
                <div class="flex items-center gap-3 mb-6">
                  <Icon name="ph:chat-circle" class="text-xl text-secondary" />
                  <h3 class="text-xl font-semibold text-primary">
                    Recent Comments
                  </h3>
                </div>
                <div class="space-y-4 max-h-64 overflow-y-auto">
                  <div
                    v-for="comment in dashboardData?.comments"
                    :key="comment.id"
                    class="p-4 bg-background-secondary rounded-xl border border-border"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <span class="font-semibold text-primary">{{
                        comment.subject
                      }}</span>
                      <n-tag size="small" round>{{
                        formatDate(comment.date)
                      }}</n-tag>
                    </div>
                    <p class="text-sm text-secondary mb-2">
                      {{ comment.teacher }}
                    </p>
                    <p class="text-sm text-primary">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Grades Tab -->
            <div v-if="activeTab === 'grades'" class="space-y-6">
              <!-- Export Actions -->
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <Icon name="ph:chart-bar" class="text-xl text-secondary" />
                  <h3 class="text-xl font-semibold text-primary">
                    Term Grades
                  </h3>
                </div>
                <div class="flex gap-3">
                  <n-button
                    :loading="isExportingGrades"
                    type="primary"
                    @click="exportGrades('pdf')"
                  >
                    <template #icon>
                      <Icon name="ph:file-pdf" />
                    </template>
                    Export PDF
                  </n-button>
                  <n-button
                    :loading="isExportingGrades"
                    @click="exportGrades('excel')"
                  >
                    <template #icon>
                      <Icon name="ph:microsoft-excel-logo" />
                    </template>
                    Export Excel
                  </n-button>
                </div>
              </div>

              <!-- Term Grades Loading -->
              <div v-if="termGradesLoading" class="text-center py-12">
                <n-spin size="large" />
                <p class="text-secondary mt-4">Loading grades...</p>
              </div>

              <!-- Term Grades Error -->
              <div v-else-if="termGradesError" class="text-center py-12">
                <div
                  class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Icon
                    name="ph:warning-circle"
                    class="text-2xl text-red-500"
                  />
                </div>
                <p class="text-red-500">{{ termGradesError }}</p>
              </div>

              <!-- Term Grades Table -->
              <div v-else>
                <n-data-table
                  :columns="courseColumns"
                  :data="termGrades"
                  :bordered="false"
                  :striped="true"
                  :pagination="{ pageSize: 10 }"
                  class="rounded-lg overflow-hidden"
                />

                <!-- Term Summary -->
                <div
                  v-if="termGrades && termGrades.length > 0"
                  class="mt-6 p-6 bg-background-secondary rounded-xl"
                >
                  <h4 class="text-lg font-semibold text-primary mb-4">
                    Term Summary
                  </h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-secondary">
                        {{ termCredits }}
                      </div>
                      <div class="text-sm text-secondary">Credits</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-primary">
                        {{ formatGPA(termGPA) }}
                      </div>
                      <div class="text-sm text-secondary">Term GPA</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-secondary">
                        {{ termGrades.length }}
                      </div>
                      <div class="text-sm text-secondary">Courses</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-primary">
                        {{ formatScore(averageTermScore) }}
                      </div>
                      <div class="text-sm text-secondary">Avg Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Attendance Tab -->
            <div v-if="activeTab === 'attendance'" class="space-y-6">
              <div v-if="attendanceInsightLoading" class="text-center py-12">
                <n-spin size="large" />
                <p class="text-secondary mt-4">
                  Loading attendance insights...
                </p>
              </div>

              <div v-else-if="attendanceInsightError" class="text-center py-12">
                <div
                  class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Icon
                    name="ph:warning-circle"
                    class="text-2xl text-red-500"
                  />
                </div>
                <p class="text-red-500">{{ attendanceInsightError }}</p>
              </div>

              <template v-else-if="attendanceInsight">
                <!-- Quick Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="text-center p-6 bg-secondary/10 rounded-xl">
                    <div class="text-3xl font-bold text-secondary mb-2">
                      {{
                        formatPercentage(
                          attendanceInsight.overallStudentAttendanceRate
                        )
                      }}
                    </div>
                    <div class="text-sm text-secondary">Your Attendance</div>
                  </div>
                  <div class="text-center p-6 bg-primary/10 rounded-xl">
                    <div class="text-3xl font-bold text-primary mb-2">
                      {{
                        formatScore(
                          attendanceInsight.overallStudentAverageScore
                        )
                      }}
                    </div>
                    <div class="text-sm text-secondary">Average Score</div>
                  </div>
                  <div class="text-center p-6 bg-secondary/10 rounded-xl">
                    <div class="text-3xl font-bold text-secondary mb-2">
                      {{ attendanceInsight.attendancePerformanceClassRank }}
                    </div>
                    <div class="text-sm text-secondary">Class Rank</div>
                  </div>
                </div>

                <!-- Recommendations -->
                <div
                  class="p-6 bg-primary/5 rounded-xl border border-primary/20"
                >
                  <h4 class="text-lg font-semibold text-primary mb-3">
                    Primary Improvement Area
                  </h4>
                  <p class="text-secondary mb-3">
                    {{ attendanceInsight.primaryAreaForImprovement }}
                  </p>
                  <div class="flex items-center gap-2">
                    <n-tag type="success" size="medium">
                      Potential GPA Impact: +{{
                        formatGPA(attendanceInsight.estimatedGpaImpact)
                      }}
                    </n-tag>
                  </div>
                </div>

                <!-- View Full Insights Link -->
                <div class="text-center">
                  <NuxtLink
                    :to="`/students/${currentStudentId}/attendance-insights`"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors hover-elevate"
                  >
                    <Icon name="ph:chart-line-up" />
                    View Detailed Insights
                  </NuxtLink>
                </div>
              </template>
            </div>

            <!-- Transcript Tab -->
            <div v-if="activeTab === 'transcript'" class="space-y-6">
              <div v-if="transcriptLoading" class="text-center py-12">
                <n-spin size="large" />
                <p class="text-secondary mt-4">Loading transcript...</p>
              </div>

              <div v-else-if="transcriptError" class="text-center py-12">
                <div
                  class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Icon
                    name="ph:warning-circle"
                    class="text-2xl text-red-500"
                  />
                </div>
                <p class="text-red-500">{{ transcriptError }}</p>
              </div>

              <template v-else-if="transcript">
                <!-- Transcript Summary -->
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  <div class="text-center p-6 bg-secondary/10 rounded-xl">
                    <div class="text-3xl font-bold text-secondary mb-2">
                      {{ transcript.totalCreditsAttempted }}
                    </div>
                    <div class="text-sm text-secondary">Credits Attempted</div>
                  </div>
                  <div class="text-center p-6 bg-primary/10 rounded-xl">
                    <div class="text-3xl font-bold text-primary mb-2">
                      {{ transcript.totalCreditsEarned }}
                    </div>
                    <div class="text-sm text-secondary">Credits Earned</div>
                  </div>
                  <div class="text-center p-6 bg-secondary/10 rounded-xl">
                    <div class="text-3xl font-bold text-secondary mb-2">
                      {{ transcript.majorCreditsCompleted }}/{{
                        transcript.majorCreditsRequired
                      }}
                    </div>
                    <div class="text-sm text-secondary">Major Credits</div>
                  </div>
                  <div class="text-center p-6 bg-primary/10 rounded-xl">
                    <div class="text-3xl font-bold text-primary mb-2">
                      {{ transcript.genEdCreditsCompleted }}/{{
                        transcript.genEdCreditsRequired
                      }}
                    </div>
                    <div class="text-sm text-secondary">Gen Ed Credits</div>
                  </div>
                </div>

                <!-- Semester Summaries -->
                <div v-if="transcriptSemesterArray.length">
                  <h4 class="text-lg font-semibold text-primary mb-4">
                    Semester Performance
                  </h4>
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    <div
                      v-for="semester in transcriptSemesterArray"
                      :key="semester.semesterId"
                      class="p-4 bg-background-secondary rounded-xl border border-border"
                    >
                      <h5 class="font-semibold text-primary mb-2">
                        {{ semester.semesterName }}
                      </h5>
                      <div class="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span class="text-secondary">GPA:</span>
                          <span class="font-medium ml-1 text-primary">{{
                            formatGPA(semester.gpa)
                          }}</span>
                        </div>
                        <div>
                          <span class="text-secondary">Credits:</span>
                          <span class="font-medium ml-1 text-primary">{{
                            semester.credits
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Complete Transcript Table -->
                <div>
                  <div class="flex justify-between items-center mb-4">
                    <h4 class="text-lg font-semibold text-primary">
                      Complete Transcript
                    </h4>
                    <n-button @click="exportTranscript">
                      <template #icon>
                        <Icon name="ph:download" />
                      </template>
                      Download Transcript
                    </n-button>
                  </div>
                  <n-data-table
                    :columns="transcriptColumns"
                    :data="transcript.courses"
                    :bordered="false"
                    :striped="true"
                    :pagination="{ pageSize: 15 }"
                  />
                </div>

                <!-- GPA by Term Chart -->
                <div
                  v-if="
                    transcript.gpaByTerm &&
                    Object.keys(transcript.gpaByTerm).length > 0
                  "
                >
                  <h4 class="text-lg font-semibold text-primary mb-4">
                    GPA Progression
                  </h4>
                  <div class="h-64 bg-background-secondary rounded-xl p-4">
                    <ClientOnly>
                      <GpaByTermChart
                        :gpa-by-term="transcript.gpaByTerm"
                        :height="240"
                        empty-message="No GPA progression data available"
                      />
                    </ClientOnly>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- No Student ID State -->
    <div
      v-else-if="!isInitialLoading"
      class="min-h-screen flex items-center justify-center p-4"
    >
      <div
        class="max-w-md w-full bg-background-card rounded-2xl shadow-xl p-8 text-center border border-border"
      >
        <div
          class="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Icon name="ph:user-circle" class="text-2xl text-secondary" />
        </div>
        <h3 class="text-lg font-semibold text-primary mb-2">
          No Student Found
        </h3>
        <p class="text-secondary mb-6">
          We couldn't find a student ID. Please check the URL or your
          permissions.
        </p>
        <n-button type="primary" size="large" @click="initializeDashboard">
          <template #icon>
            <Icon name="ph:arrow-clockwise" />
          </template>
          Retry
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, h } from 'vue';
import { useRoute } from 'vue-router';
import { useStudentStore } from '~/stores/student';
import { useAuthStore } from '~/stores/auth';
import { NTag, NButton, useMessage } from 'naive-ui';
import SemesterSelector from '~/components/student/SemesterSelector.vue';
import GradeDistributionChart from '~/components/student/charts/GradeDistributionChart.vue';
import PerformanceTrendChart from '~/components/student/charts/PerformanceTrendChart.vue';
import GpaByTermChart from '~/components/student/charts/GpaByTermChart.vue';

import type { SemesterType } from '~/interfaces/student/analytics/semester-type';
import type { AttendancePerformanceInsightDto } from '~/interfaces/student/analytics/attendance-performance-insight.dto';
import type { CourseGradeDto } from '~/interfaces/student/analytics/course-grade.dto';
import type { SemesterSummaryDto } from '~/interfaces/student/analytics/semester-summary.dto';
import type { StudentGradeDashboardDto } from '~/interfaces/student/analytics/student-grade-dashboard.dto';
import type { TranscriptDto } from '~/interfaces/student/analytics/transcript.dto';

definePageMeta({
  title: 'Student Dashboard',
  layout: 'dashboard-layout',
});

// Composables
const route = useRoute();
const studentStore = useStudentStore();
const authStore = useAuthStore();
const message = useMessage();

// Core state
const isClient = ref(false);
const isInitialLoading = ref(true);
const mainError = ref<string | null>(null);
const showDebug = ref(false);
const activeTab = ref('overview');
const isRefreshing = ref(false);
const lastUpdated = ref<string | null>(null);

// Semester parameters
const semesterParams = ref<{
  academicYear?: string | null;
  term?: SemesterType | null;
  semesterId?: string | null;
}>({});

// Data state
const dashboardData = ref<StudentGradeDashboardDto | null>(null);
const termGrades = ref<CourseGradeDto[]>([]);
const transcript = ref<TranscriptDto | null>(null);
const attendanceInsight = ref<AttendancePerformanceInsightDto | null>(null);
const studentData = ref<any>(null);

// Loading states
const dashboardLoading = ref(false);
const termGradesLoading = ref(false);
const transcriptLoading = ref(false);
const attendanceInsightLoading = ref(false);

// Error states
const dashboardError = ref<string | null>(null);
const termGradesError = ref<string | null>(null);
const transcriptError = ref<string | null>(null);
const attendanceInsightError = ref<string | null>(null);

// Student ID resolution
const routeStudentId = computed(() => {
  if (!isClient.value) return null;
  const paramId = route.params.id;
  if (paramId) {
    return Array.isArray(paramId) ? paramId[0] : paramId;
  }
  const queryId = route.query.studentId;
  if (queryId) {
    return Array.isArray(queryId) ? queryId[0] : queryId;
  }
  return null;
});

const authUserId = computed(() => authStore.user?.id || null);

const currentStudentId = computed(() => {
  if (routeStudentId.value) {
    return routeStudentId.value;
  }
  if (studentStore.selectedStudent?.id) {
    return studentStore.selectedStudent.id;
  }
  if (authStore.user?.roles?.includes('Student') && authUserId.value) {
    return authUserId.value;
  }
  return null;
});

// Display name
const displayName = computed(() => {
  if (studentData.value) {
    const firstName = studentData.value.firstName || '';
    const lastName = studentData.value.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Student';
  }
  return 'Student';
});

// Current date
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Available semesters with safe access
const availableSemesters = computed(() => {
  return Array.isArray(studentStore.availableSemesters)
    ? studentStore.availableSemesters
    : [];
});

const currentSemester = computed(() => studentStore.currentSemester);

// Current semester display
const currentSemesterDisplay = computed(() => {
  if (currentSemester.value) {
    return `${currentSemester.value.semesterName} ${currentSemester.value.academicYear}`;
  }
  return null;
});

// Check if current semester is active
const isCurrentSemesterActive = computed(() => {
  return currentSemester.value?.semesterId === semesterParams.value.semesterId;
});

// Current semester data from dashboard
const currentSemesterData = computed(() => {
  if (
    !dashboardData.value?.semesterBreakdown ||
    !semesterParams.value.semesterId
  )
    return null;
  return dashboardData.value.semesterBreakdown.find(
    (s: SemesterSummaryDto) => s.semesterId === semesterParams.value.semesterId
  );
});

// Computed data properties
const currentCourses = computed(() => {
  if (semesterParams.value.semesterId && dashboardData.value?.courses) {
    return dashboardData.value.courses.filter(
      (course: CourseGradeDto) =>
        course.semesterId === semesterParams.value.semesterId
    );
  }
  return dashboardData.value?.courses || [];
});

// Transcript semester summaries as array
const transcriptSemesterArray = computed(() => {
  if (!transcript.value?.semesterSummaries) return [];
  return Object.values(transcript.value.semesterSummaries);
});

const termCredits = computed(() => {
  return termGrades.value.reduce(
    (total, course) => total + (course.credits || 0),
    0
  );
});

const termGPA = computed(() => {
  if (!termGrades.value.length) return null;
  const gradePoints = {
    'A+': 4.0,
    A: 4.0,
    'A-': 3.7,
    'B+': 3.3,
    B: 3.0,
    'B-': 2.7,
    'C+': 2.3,
    C: 2.0,
    'C-': 1.7,
    'D+': 1.3,
    D: 1.0,
    'D-': 0.7,
    F: 0.0,
  };

  let totalPoints = 0;
  let totalCredits = 0;

  termGrades.value.forEach((course) => {
    const credits = course.credits || 1;
    const points = gradePoints[course.grade as keyof typeof gradePoints] || 0;
    totalPoints += points * credits;
    totalCredits += credits;
  });

  return totalCredits > 0 ? totalPoints / totalCredits : null;
});

const averageTermScore = computed(() => {
  if (!termGrades.value.length) return null;
  const validScores = termGrades.value.filter(
    (course) => course.score !== undefined
  );
  if (!validScores.length) return null;
  const total = validScores.reduce((sum, course) => sum + course.score, 0);
  return total / validScores.length;
});

const hasPerformanceTrend = computed(() => {
  return (
    dashboardData.value?.performanceTrend &&
    dashboardData.value.performanceTrend.terms &&
    dashboardData.value.performanceTrend.terms.length > 1
  );
});

const hasComments = computed(() => {
  return (
    dashboardData.value?.comments && dashboardData.value.comments.length > 0
  );
});

const isExportingGrades = computed(() => studentStore.isExportingGrades);

// Data fetching functions
const fetchStudentByUserId = async (userId: string) => {
  try {
    console.log('Fetching student by user ID:', userId);
    const student = await studentStore.fetchByUserId(userId);
    if (student) {
      studentData.value = student;
      console.log('Found student record:', student.id);
      return student.id;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching student by user ID:', error);
    return null;
  }
};

const fetchStudentById = async (studentId: string) => {
  try {
    console.log('Fetching student by ID:', studentId);
    const student = await studentStore.getStudent(studentId);
    if (student) {
      studentData.value = student;
      return student;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching student by ID:', error);
    return null;
  }
};

const fetchDashboardData = async (studentId: string) => {
  if (!studentId) return;
  try {
    dashboardLoading.value = true;
    dashboardError.value = null;
    const data = await studentStore.fetchStudentGradeDashboard(
      studentId,
      semesterParams.value
    );
    if (data) {
      dashboardData.value = data;
    }
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    dashboardError.value = error.message || 'Failed to load dashboard data';
  } finally {
    dashboardLoading.value = false;
  }
};

const fetchTermGrades = async (studentId: string) => {
  if (!studentId || !semesterParams.value.term) return;
  try {
    termGradesLoading.value = true;
    termGradesError.value = null;
    const data = await studentStore.fetchStudentTermGrades(
      studentId,
      semesterParams.value
    );
    if (data) {
      termGrades.value = data;
    }
  } catch (error: any) {
    console.error('Error fetching term grades:', error);
    termGradesError.value = error.message || 'Failed to load term grades';
  } finally {
    termGradesLoading.value = false;
  }
};

const fetchTranscript = async (studentId: string) => {
  if (!studentId) return;
  try {
    transcriptLoading.value = true;
    transcriptError.value = null;
    const data = await studentStore.fetchStudentTranscript(studentId);
    if (data) {
      transcript.value = data;
    }
  } catch (error: any) {
    console.error('Error fetching transcript:', error);
    transcriptError.value = error.message || 'Failed to load transcript';
  } finally {
    transcriptLoading.value = false;
  }
};

const fetchAttendanceInsight = async (studentId: string) => {
  if (!studentId) return;
  try {
    attendanceInsightLoading.value = true;
    attendanceInsightError.value = null;
    const data = await studentStore.fetchStudentAttendanceInsight(
      studentId,
      semesterParams.value
    );
    if (data) {
      attendanceInsight.value = data;
    }
  } catch (error: any) {
    console.error('Error fetching attendance insight:', error);
    attendanceInsightError.value =
      error.message || 'Failed to load attendance insight';
  } finally {
    attendanceInsightLoading.value = false;
  }
};

// Main initialization
const initializeDashboard = async () => {
  try {
    isInitialLoading.value = true;
    mainError.value = null;

    console.log('Initializing dashboard...');
    console.log('Current student ID from computed:', currentStudentId.value);

    let resolvedStudentId = currentStudentId.value;

    if (
      !resolvedStudentId &&
      authUserId.value &&
      authStore.user?.roles?.includes('Student')
    ) {
      console.log('Trying to resolve student ID from user ID...');
      resolvedStudentId = await fetchStudentByUserId(authUserId.value);
    }

    if (!resolvedStudentId) {
      throw new Error(
        'No student ID could be resolved. Please check the URL or your permissions.'
      );
    }

    console.log('Resolved student ID:', resolvedStudentId);

    if (!studentData.value) {
      await fetchStudentById(resolvedStudentId);
    }

    // Set default semester if none selected and current semester exists
    if (!semesterParams.value.term && currentSemester.value) {
      semesterParams.value = {
        academicYear: currentSemester.value.academicYear,
        term: currentSemester.value.semesterType as SemesterType,
        semesterId: currentSemester.value.semesterId,
      };
    }

    // Fetch all dashboard data
    await Promise.all([
      fetchDashboardData(resolvedStudentId),
      fetchAttendanceInsight(resolvedStudentId),
    ]);

    // Fetch term grades if we have a term selected
    if (semesterParams.value.term) {
      await fetchTermGrades(resolvedStudentId);
    }

    lastUpdated.value = new Date().toLocaleTimeString();
  } catch (error: any) {
    console.error('Error initializing dashboard:', error);
    mainError.value = error.message || 'Failed to initialize dashboard';
  } finally {
    isInitialLoading.value = false;
  }
};

// Event handlers
const onSemesterChange = async () => {
  if (currentStudentId.value) {
    await refreshAllData();
  }
};

const refreshAllData = async () => {
  if (!currentStudentId.value) return;
  isRefreshing.value = true;
  try {
    await Promise.all([
      fetchDashboardData(currentStudentId.value),
      fetchAttendanceInsight(currentStudentId.value),
    ]);
    if (semesterParams.value.term) {
      await fetchTermGrades(currentStudentId.value);
    }
    lastUpdated.value = new Date().toLocaleTimeString();
  } finally {
    isRefreshing.value = false;
  }
};

const selectSemester = (semester: SemesterSummaryDto) => {
  semesterParams.value = {
    academicYear: semester.academicYear,
    term: semester.semesterType as SemesterType,
    semesterId: semester.semesterId,
  };
};

const exportGrades = async (format: string) => {
  if (!currentStudentId.value) return;
  try {
    await studentStore.exportStudentGrades(
      currentStudentId.value,
      format,
      semesterParams.value
    );
    message.success(`Grades exported as ${format.toUpperCase()}`);
  } catch (err: any) {
    message.error(err.message || 'Failed to export grades');
  }
};

const exportTranscript = async () => {
  await exportGrades('pdf');
};

// Utility functions
const formatGPA = (gpa: number | null | undefined): string => {
  if (gpa === null || gpa === undefined) return 'N/A';
  return gpa.toFixed(2);
};

const formatScore = (score: number | null | undefined): string => {
  if (score === null || score === undefined) return 'N/A';
  return score.toFixed(1);
};

const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  return `${(value * 100).toFixed(1)}%`;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
};

const getGradeColor = (grade: string): string => {
  const colors = {
    'A+': '#22c55e',
    A: '#22c55e',
    'A-': '#22c55e',
    'B+': '#3b82f6',
    B: '#3b82f6',
    'B-': '#3b82f6',
    'C+': '#f59e0b',
    C: '#f59e0b',
    'C-': '#f59e0b',
    'D+': '#f97316',
    D: '#f97316',
    'D-': '#f97316',
    F: '#ef4444',
  };
  return colors[grade as keyof typeof colors] || '#6b7280';
};

// Table columns
const courseColumns = [
  {
    title: 'Course',
    key: 'course',
    render(row: CourseGradeDto) {
      return h('div', [
        h('div', { class: 'font-medium text-primary' }, row.code || ''),
        h('div', { class: 'text-xs text-secondary' }, row.name || ''),
        row.semesterName
          ? h('div', { class: 'text-xs text-secondary mt-1' }, row.semesterName)
          : null,
      ]);
    },
  },
  {
    title: 'Instructor',
    key: 'instructor',
    render(row: CourseGradeDto) {
      return h('div', { class: 'text-sm text-primary' }, row.instructor || '');
    },
  },
  {
    title: 'Score',
    key: 'score',
    render(row: CourseGradeDto) {
      return h(
        'div',
        { class: 'text-center font-medium text-primary' },
        row.score !== undefined ? Number(row.score).toFixed(1) : 'N/A'
      );
    },
  },
  {
    title: 'Grade',
    key: 'grade',
    render(row: CourseGradeDto) {
      if (!row.grade)
        return h('div', { class: 'text-center text-muted' }, 'N/A');

      return h('div', { class: 'flex justify-center' }, [
        h(
          'div',
          {
            class:
              'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg',
            style: { backgroundColor: getGradeColor(row.grade) },
          },
          row.grade
        ),
      ]);
    },
  },
  {
    title: 'Credits',
    key: 'credits',
    render(row: CourseGradeDto) {
      return h(
        'div',
        { class: 'text-center font-medium text-primary' },
        row.credits || '-'
      );
    },
  },
];

const transcriptColumns = [
  ...courseColumns,
  {
    title: 'Term',
    key: 'term',
    render(row: CourseGradeDto) {
      return h('div', { class: 'text-center text-sm' }, row.term || '-');
    },
  },
];

// Watchers
watch(activeTab, (newTab) => {
  if (newTab === 'transcript' && !transcript.value && currentStudentId.value) {
    fetchTranscript(currentStudentId.value);
  }
});

// Initialize
onMounted(async () => {
  isClient.value = true;
  await nextTick();
  await initializeDashboard();
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
