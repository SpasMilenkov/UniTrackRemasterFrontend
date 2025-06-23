<template>
  <div class="w-full min-h-screen p-4 md:p-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <n-spin size="large" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-lg bg-red-500/10 border border-red-500/20 p-4"
    >
      <div class="flex items-center gap-2">
        <Icon name="ph:warning-circle" class="text-red-500" />
        <p class="text-red-500">{{ error }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Main Header -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <div>
          <h1 class="text-xl md:text-2xl font-semibold m-0">
            {{ pageTitle }}
          </h1>
          <p class="text-text-secondary mt-1">{{ pageSubtitle }}</p>
        </div>
        <div class="flex gap-2 w-full md:w-auto">
          <!-- Institution Selector (only show when not in institution mode) -->
          <n-select
            v-if="!isInInstitutionMode"
            v-model:value="selectedInstitutionId"
            :options="institutionOptions"
            placeholder="Select Institution to Manage"
            class="min-w-[200px]"
            @update:value="handleInstitutionSelection"
          />

          <!-- Back to SuperAdmin button (only show when in institution mode) -->
          <n-button
            v-if="isInInstitutionMode"
            quaternary
            @click="exitInstitutionMode"
          >
            <template #icon>
              <Icon name="ph:arrow-left" />
            </template>
            Back to SuperAdmin
          </n-button>

          <n-input-group v-if="showSearch">
            <n-input v-model:value="searchQuery" placeholder="Search...">
              <template #prefix>
                <Icon name="ph:magnifying-glass" />
              </template>
            </n-input>
            <n-button @click="showSearch = false">
              <Icon name="ph:x" />
            </n-button>
          </n-input-group>
          <n-button v-else quaternary circle @click="showSearch = true">
            <Icon name="ph:magnifying-glass" />
          </n-button>
          <n-dropdown
            :options="userMenuOptions"
            trigger="click"
            @select="handleUserMenuSelect"
          >
            <n-button quaternary circle>
              <Icon name="ph:user-circle" />
            </n-button>
          </n-dropdown>
        </div>
      </div>

      <!-- SuperAdmin Mode Content -->
      <template v-if="!isInInstitutionMode">
        <!-- SuperAdmin Category Navigation -->
        <div class="mb-6">
          <n-tabs
            v-model:value="activeCategory"
            type="segment"
            :justify-content="isMobile ? 'space-between' : 'start'"
            class="mb-4"
          >
            <n-tab
              v-for="category in superAdminCategories"
              :key="category.key"
              :name="category.key"
            >
              <div class="flex items-center gap-1">
                <Icon :name="category.icon" />
                <span class="hidden md:inline">{{ category.label }}</span>
              </div>
            </n-tab>
          </n-tabs>
        </div>

        <!-- SuperAdmin Section Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <n-card
            v-for="section in activeCategorySections"
            :key="section.key"
            class="hover-elevate cursor-pointer transition-all"
            :class="{
              'border-primary border-2': section.key === activeSection,
            }"
            @click="setActiveSection(section.key)"
          >
            <div class="flex items-center gap-3">
              <div class="rounded-full p-3 bg-primary/10">
                <Icon :name="section.icon" class="text-xl text-primary" />
              </div>
              <div>
                <h3 class="text-base font-medium">{{ section.label }}</h3>
                <p class="text-sm text-text-secondary">
                  {{ section.description }}
                </p>
              </div>
            </div>
          </n-card>
        </div>

        <!-- SuperAdmin Active Section Content -->
        <n-card class="mt-6" :title="activeSectionTitle">
          <template #header-extra>
            <div class="flex gap-2">
              <n-button quaternary circle @click="refreshActiveSection">
                <Icon name="ph:arrows-clockwise" />
              </n-button>
            </div>
          </template>

          <component
            :is="activeSectionComponent"
            v-if="activeSectionComponent"
            :key="activeSection"
            :active="true"
          />

          <div v-else class="p-4 text-center text-text-secondary">
            <Icon name="ph:info" class="text-2xl mb-2" />
            <p>Select a section to view its content</p>
          </div>
        </n-card>
      </template>

      <!-- Institution Management Mode Content (Reuse Admin Dashboard Logic) -->
      <template v-else>
        <!-- Institution Header -->
        <div class="mb-6">
          <div
            class="bg-background-secondary rounded-xl p-6 text-color-primary"
          >
            <div
              class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div class="flex items-center gap-4">
                <div class="rounded-lg p-3 bg-white/20 backdrop-blur-sm">
                  <Icon :name="institutionIcon" class="text-2xl" />
                </div>
                <div>
                  <h2 class="text-xl md:text-2xl font-semibold m-0">
                    {{ activeInstitution.name }}
                  </h2>
                  <p class="text-color-secondary/80 mt-1">
                    {{ institutionTypeLabel }} • SuperAdmin Management
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Institution Category Navigation (Reuse Admin Dashboard Categories) -->
        <div class="mb-6">
          <n-tabs
            v-model:value="activeInstitutionCategory"
            type="segment"
            :justify-content="isMobile ? 'space-between' : 'start'"
            class="mb-4"
          >
            <n-tab
              v-for="category in availableInstitutionCategories"
              :key="category.key"
              :name="category.key"
            >
              <div class="flex items-center gap-2">
                <Icon :name="category.icon" />
                <span class="hidden md:inline">{{ category.label }}</span>
              </div>
            </n-tab>
          </n-tabs>
        </div>

        <!-- Institution Section Cards (Reuse Admin Dashboard Sections) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <n-card
            v-for="section in activeInstitutionCategorySections"
            :key="section.key"
            class="hover-elevate cursor-pointer transition-all duration-200"
            :class="{
              'border-primary border-2 bg-primary/5':
                section.key === activeInstitutionSection,
              'hover:border-primary/50':
                section.key !== activeInstitutionSection,
            }"
            @click="setActiveInstitutionSection(section.key)"
          >
            <div class="flex items-start gap-4">
              <div class="rounded-lg p-3 bg-primary/10 flex-shrink-0">
                <Icon :name="section.icon" class="text-xl text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-medium mb-1">{{ section.label }}</h3>
                <p class="text-sm text-text-secondary leading-relaxed">
                  {{ section.description }}
                </p>
                <div v-if="section.badge" class="mt-2">
                  <n-tag size="small" :type="section.badge.type">
                    {{ section.badge.text }}
                  </n-tag>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <!-- Institution Active Section Content (Reuse Admin Dashboard Components) -->
        <n-card v-if="activeInstitutionSection" class="min-h-[400px]">
          <template #header>
            <div class="flex items-center gap-2">
              <Icon
                :name="activeInstitutionSectionIcon"
                class="text-xl text-primary"
              />
              <span>{{ activeInstitutionSectionTitle }}</span>
            </div>
          </template>

          <component
            :is="activeInstitutionSectionComponent"
            v-if="activeInstitutionSectionComponent"
            :key="activeInstitutionSection"
          />

          <div v-else class="p-8 text-center text-text-secondary">
            <Icon name="ph:info" class="text-3xl mb-3" />
            <p class="text-lg">Select a section to view its content</p>
          </div>
        </n-card>

        <!-- Getting Started Card (when no section selected) -->
        <n-card
          v-else
          class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
        >
          <div class="text-center py-8">
            <Icon name="ph:rocket-launch" class="text-4xl text-primary mb-4" />
            <h3 class="text-lg font-medium mb-2">Institution Management</h3>
            <p class="text-text-secondary mb-6 max-w-2xl mx-auto">
              Manage {{ activeInstitution.name }}'s academic structure,
              students, faculty, and administrative settings.
            </p>
            <div class="flex flex-wrap justify-center gap-2">
              <n-button
                v-for="quickAction in quickActions"
                :key="quickAction.key"
                type="primary"
                ghost
                @click="setActiveInstitutionSection(quickAction.key)"
              >
                <template #icon>
                  <Icon :name="quickAction.icon" />
                </template>
                {{ quickAction.label }}
              </n-button>
            </div>
          </div>
        </n-card>
      </template>
    </template>

    <!-- Global Actions Modal -->
    <n-modal v-model:show="showGlobalActionsModal" :mask-closable="true">
      <n-card
        style="width: 90vw; max-width: 500px"
        title="Global System Actions"
        :bordered="false"
      >
        <div class="flex flex-col gap-4">
          <n-alert type="warning">
            These actions affect the entire system. Proceed with caution.
          </n-alert>

          <n-button type="error" block @click="showConfirmationModal = true">
            <div class="flex items-center justify-center gap-2">
              <Icon name="ph:database" />
              Maintenance Mode
            </div>
          </n-button>

          <n-button type="info" block>
            <div class="flex items-center justify-center gap-2">
              <Icon name="ph:database-backup" />
              Backup Database
            </div>
          </n-button>

          <n-button type="warning" block>
            <div class="flex items-center justify-center gap-2">
              <Icon name="ph:hard-drives" />
              Clear Cache
            </div>
          </n-button>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <n-button @click="showGlobalActionsModal = false">Close</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- Confirmation Modal -->
    <n-modal v-model:show="showConfirmationModal" :mask-closable="false">
      <n-card
        style="width: 90vw; max-width: 400px"
        title="Confirm Action"
        :bordered="false"
      >
        <div class="flex flex-col gap-4">
          <p>
            Are you sure you want to put the system in maintenance mode? All
            users will be logged out.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showConfirmationModal = false">Cancel</n-button>
            <n-button type="error">Confirm</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import {
  NSpin,
  NCard,
  NTabs,
  NTab,
  NModal,
  NButton,
  NInputGroup,
  NInput,
  NDropdown,
  NAlert,
  NSelect,
  NTag,
} from 'naive-ui';
import { useRouter } from 'vue-router';

// Import SuperAdmin-specific components
import InstitutionsTab from '@/components/super-admin/tabs/InstitutionsTab.vue';
import UsersTab from '@/components/super-admin/tabs/UsersTab.vue';
import ApplicationsTab from '@/components/super-admin/tabs/ApplicationsTab.vue';
import AnalyticsTab from '@/components/super-admin/tabs/AnalyticsTab.vue';

// Import reused Admin Dashboard components
import DepartmentsTab from '@/components/academic/DepartmentsTab.vue';
import FacultiesTab from '@/components/academic/FacultiesTab.vue';
import MajorsTab from '@/components/academic/MajorsTab.vue';
import GradesTab from '@/components/academic/GradesTab.vue';
import SubjectsTab from '@/components/academic/SubjectsTab.vue';
import StudentsTab from '@/components/academic/StudentsTab.vue';
import TeachersTab from '@/components/academic/TeachersTab.vue';
import AcademicYearTab from '@/components/academic/AcademicYearTab.vue';
import MarksTab from '@/components/academic/MarksTab.vue';
import SemesterTab from '@/components/academic/SemesterTab.vue';
import AbsenceTab from '@/components/academic/AbsenceTab.vue';
import GradingSystemTab from '@/components/academic/GradingSystemTab.vue';
import TeacherGradeAssignmentsTab from '~/components/academic/TeacherGradeAssignmentsTab.vue';

// Import stores
import { useSuperAdminStore } from '~/stores/super-admin';
import { useAuthStore } from '~/stores/auth';
import { useAcademicStore } from '@/stores/academic';
import { useInstitutionStore } from '@/stores/institution';
import { useUniversityStore } from '@/stores/university';
import { isHigherEducation, isSchool } from '@/utils/institution-helper';
import type { InstitutionType } from '@/enums/institution-type.enum';

definePageMeta({
  layout: 'dashboard-layout',
});

// Types
type SuperAdminCategoryKey =
  | 'institutions'
  | 'users'
  | 'applications'
  | 'analytics';
type InstitutionCategoryKey =
  | 'structure'
  | 'people'
  | 'academics'
  | 'management'
  | 'settings';

interface SectionItem {
  key: string;
  label: string;
  icon: string;
  description: string;
  component: any;
  institutionTypes?: ('higher-ed' | 'school')[];
  badge?: {
    text: string;
    type: 'success' | 'warning' | 'error' | 'info';
  };
}

// Router
const router = useRouter();

// Stores
const superAdminStore = useSuperAdminStore();
const authStore = useAuthStore();
const academicStore = useAcademicStore();
const institutionStore = useInstitutionStore();
const universityStore = useUniversityStore();

// State variables
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const showSearch = ref(false);
const activeCategory = ref<SuperAdminCategoryKey>('institutions');
const activeSection = ref('');
const showGlobalActionsModal = ref(false);
const showConfirmationModal = ref(false);

// Institution management state
const selectedInstitutionId = ref<string | null>(null);
const isInInstitutionMode = ref(false);
const activeInstitutionCategory = ref<InstitutionCategoryKey>('structure');
const activeInstitutionSection = ref('');

// Stats data
const statsData = ref({
  institutionsCount: 0,
  studentsCount: 0,
  teachersCount: 0,
  adminsCount: 0,
});

// Mobile detection
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = computed(() => !breakpoints.greater('md').value);

// Page title and subtitle
const pageTitle = computed(() => {
  if (isInInstitutionMode.value && activeInstitution.value) {
    return `Managing: ${activeInstitution.value.name}`;
  }
  return 'SuperAdmin Dashboard';
});

const pageSubtitle = computed(() => {
  if (isInInstitutionMode.value) {
    return 'Institution Management';
  }
  return 'Global System Management';
});

// Institution-related computed properties
const activeInstitution = computed(() => institutionStore.activeInstitution);

const isHigherEducationInstitution = computed(() => {
  if (!activeInstitution.value?.type) return false;
  return isHigherEducation(activeInstitution.value.type as InstitutionType);
});

const isSchoolInstitution = computed(() => {
  if (!activeInstitution.value?.type) return false;
  return isSchool(activeInstitution.value.type as InstitutionType);
});

const institutionTypeLabel = computed(() => {
  if (isHigherEducationInstitution.value) return 'Higher Education Institution';
  if (isSchoolInstitution.value) return 'School';
  return 'Institution';
});

const institutionIcon = computed(() => {
  if (isHigherEducationInstitution.value) return 'ph:graduation-cap';
  if (isSchoolInstitution.value) return 'ph:building-library';
  return 'ph:buildings';
});

// Institution options for selector
const institutionOptions = computed(() => {
  return superAdminStore.institutions.map((inst) => ({
    label: inst.name,
    value: inst.id,
  }));
});

// User menu options
const userMenuOptions = [
  {
    label: 'Profile',
    key: 'profile',
    icon: () => h(Icon, { name: 'ph:user' }),
  },
  {
    label: 'System Actions',
    key: 'system-actions',
    icon: () => h(Icon, { name: 'ph:gear' }),
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: () => h(Icon, { name: 'ph:sign-out' }),
  },
];

// SuperAdmin categories and sections
const superAdminCategories = [
  { key: 'institutions', label: 'Institutions', icon: 'ph:buildings' },
  { key: 'users', label: 'Users', icon: 'ph:users' },
  { key: 'applications', label: 'Applications', icon: 'ph:clipboard-text' },
  { key: 'analytics', label: 'Analytics', icon: 'ph:chart-line' },
];

const superAdminSections = {
  institutions: [
    {
      key: 'all-institutions',
      label: 'All Institutions',
      icon: 'ph:buildings',
      description: 'Manage all institutions in the system',
      component: InstitutionsTab,
    },
  ],
  users: [
    {
      key: 'all-users',
      label: 'All Users',
      icon: 'ph:users',
      description: 'Manage all users across institutions',
      component: UsersTab,
    },
  ],
  applications: [
    {
      key: 'pending-applications',
      label: 'Pending Applications',
      icon: 'ph:file-plus',
      description: 'Review and manage institution applications',
      component: ApplicationsTab,
    },
  ],
  analytics: [
    {
      key: 'system-analytics',
      label: 'System Analytics',
      icon: 'ph:chart-pie',
      description: 'System-wide usage and performance metrics',
      component: AnalyticsTab,
    },
  ],
};

// Institution categories and sections (reused from Admin Dashboard)
const institutionCategories = [
  { key: 'structure', label: 'Structure', icon: 'ph:tree-structure' },
  { key: 'people', label: 'People', icon: 'ph:users-three' },
  { key: 'academics', label: 'Academics', icon: 'ph:graduation-cap' },
  { key: 'management', label: 'Management', icon: 'ph:chart-bar' },
  { key: 'settings', label: 'Settings', icon: 'ph:gear' },
];

const allInstitutionSections: Record<InstitutionCategoryKey, SectionItem[]> = {
  structure: [
    {
      key: 'faculties',
      label: 'Faculties',
      icon: 'ph:graduation-cap',
      description: 'Manage faculties and schools within the university',
      component: FacultiesTab,
      institutionTypes: ['higher-ed'],
    },
    {
      key: 'departments',
      label: 'Departments',
      icon: 'ph:buildings',
      description: 'Manage academic departments and divisions',
      component: DepartmentsTab,
      institutionTypes: ['higher-ed'],
    },
    {
      key: 'majors',
      label: 'Majors & Programs',
      icon: 'ph:books',
      description: 'Manage degree programs and academic majors',
      component: MajorsTab,
      institutionTypes: ['higher-ed'],
    },
    {
      key: 'grades',
      label: 'Grade Levels',
      icon: 'ph:exam',
      description: 'Manage class grades and academic levels',
      component: GradesTab,
      institutionTypes: ['school'],
    },
    {
      key: 'teacher-assignments',
      label: 'Assignment Management',
      icon: 'ph:user-gear',
      description: isHigherEducationInstitution.value
        ? 'Manage faculty assignments to courses and classes'
        : 'Manage teacher assignments to grades and homerooms',
      component: TeacherGradeAssignmentsTab,
      badge: {
        text: 'Advanced',
        type: 'warning',
      },
    },
  ],
  people: [
    {
      key: 'students',
      label: 'Students',
      icon: 'ph:student',
      description: 'Manage student records and enrollment',
      component: StudentsTab,
    },
    {
      key: 'teachers',
      label: isHigherEducationInstitution.value
        ? 'Faculty & Staff'
        : 'Teachers',
      icon: 'ph:chalkboard-teacher',
      description: isHigherEducationInstitution.value
        ? 'Manage faculty members and academic staff'
        : 'Manage teaching staff and educators',
      component: TeachersTab,
    },
  ],
  academics: [
    {
      key: 'subjects',
      label: isHigherEducationInstitution.value ? 'Courses' : 'Subjects',
      icon: 'ph:book-open',
      description: isHigherEducationInstitution.value
        ? 'Manage university courses and curricula'
        : 'Manage academic subjects and curricula',
      component: SubjectsTab,
    },
    {
      key: 'academic-years',
      label: 'Academic Calendar',
      icon: 'ph:calendar',
      description: 'Manage academic years and calendar settings',
      component: AcademicYearTab,
    },
    {
      key: 'terms',
      label: isHigherEducationInstitution.value ? 'Semesters' : 'Terms',
      icon: 'ph:calendar-check',
      description: isHigherEducationInstitution.value
        ? 'Manage semester periods and schedules'
        : 'Manage academic terms (quarters/trimesters)',
      component: SemesterTab,
    },
  ],
  management: [
    {
      key: 'marks',
      label: 'Grades & Assessment',
      icon: 'ph:check-square',
      description: 'Manage student grades and academic assessments',
      component: MarksTab,
    },
    {
      key: 'absence',
      label: 'Attendance',
      icon: 'ph:calendar-x',
      description: 'Track and manage student attendance records',
      component: AbsenceTab,
    },
  ],
  settings: [
    {
      key: 'grading-systems',
      label: 'Grading Systems',
      icon: 'ph:exam',
      description: 'Configure grading scales and assessment systems',
      component: GradingSystemTab,
    },
  ],
};

// Filter sections based on institution type
const filterSectionsByInstitutionType = (
  sections: SectionItem[]
): SectionItem[] => {
  if (!activeInstitution.value) return sections;

  const institutionType = isHigherEducationInstitution.value
    ? 'higher-ed'
    : 'school';

  return sections.filter((section) => {
    if (!section.institutionTypes) return true; // Show if no restriction
    return section.institutionTypes.includes(institutionType);
  });
};

// Computed properties for SuperAdmin sections
const activeCategorySections = computed(() => {
  if (searchQuery.value) {
    const allSections = Object.values(superAdminSections).flat();
    return allSections.filter(
      (section) =>
        section.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        section.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    );
  }

  return superAdminSections[activeCategory.value] || [];
});

const activeSectionComponent = computed(() => {
  if (!activeSection.value) return null;

  for (const category in superAdminSections) {
    const section = superAdminSections[category].find(
      (s) => s.key === activeSection.value
    );
    if (section) {
      return section.component;
    }
  }

  return null;
});

const activeSectionTitle = computed(() => {
  if (!activeSection.value) return 'Select a Section';

  for (const category in superAdminSections) {
    const section = superAdminSections[category].find(
      (s) => s.key === activeSection.value
    );
    if (section) {
      return section.label;
    }
  }

  return 'Select a Section';
});

// Computed properties for Institution sections
const availableInstitutionCategories = computed(() => {
  return institutionCategories;
});

const availableInstitutionSections = computed(
  (): Record<InstitutionCategoryKey, SectionItem[]> => {
    const filtered: Record<InstitutionCategoryKey, SectionItem[]> =
      {} as Record<InstitutionCategoryKey, SectionItem[]>;

    for (const [categoryKey, sections] of Object.entries(
      allInstitutionSections
    )) {
      filtered[categoryKey as InstitutionCategoryKey] =
        filterSectionsByInstitutionType(sections);
    }

    return filtered;
  }
);

const activeInstitutionCategorySections = computed(() => {
  if (searchQuery.value) {
    const allFilteredSections = Object.values(
      availableInstitutionSections.value
    ).flat();
    return allFilteredSections.filter(
      (section) =>
        section.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        section.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    );
  }

  return (
    availableInstitutionSections.value[activeInstitutionCategory.value] || []
  );
});

const activeInstitutionSectionData = computed(() => {
  if (!activeInstitutionSection.value) return null;

  for (const sections of Object.values(availableInstitutionSections.value)) {
    const section = sections.find(
      (s) => s.key === activeInstitutionSection.value
    );
    if (section) return section;
  }

  return null;
});

const activeInstitutionSectionComponent = computed(() => {
  return activeInstitutionSectionData.value?.component || null;
});

const activeInstitutionSectionTitle = computed(() => {
  return activeInstitutionSection.value
    ? activeInstitutionSectionData.value?.label || ''
    : 'Select a Section';
});

const activeInstitutionSectionIcon = computed(() => {
  return activeInstitutionSectionData.value?.icon || 'ph:info';
});

// Quick actions for institution mode
const quickActions = computed(() => {
  const actions = [];

  if (isHigherEducationInstitution.value) {
    actions.push(
      { key: 'faculties', label: 'Setup Faculties', icon: 'ph:graduation-cap' },
      { key: 'students', label: 'Add Students', icon: 'ph:student' }
    );
  } else {
    actions.push(
      { key: 'grades', label: 'Setup Grades', icon: 'ph:exam' },
      { key: 'students', label: 'Add Students', icon: 'ph:student' }
    );
  }

  actions.push(
    { key: 'teachers', label: 'Add Teachers', icon: 'ph:chalkboard-teacher' },
    { key: 'subjects', label: 'Setup Subjects', icon: 'ph:book-open' },
    {
      key: 'terms',
      label: isHigherEducationInstitution.value
        ? 'Setup Semesters'
        : 'Setup Terms',
      icon: 'ph:calendar-check',
    }
  );

  return actions;
});

// Methods
const setActiveSection = (sectionKey: string) => {
  activeSection.value = sectionKey;

  for (const category in superAdminSections) {
    if (
      superAdminSections[category].some((section) => section.key === sectionKey)
    ) {
      activeCategory.value = category as SuperAdminCategoryKey;
      break;
    }
  }
};

const setActiveInstitutionSection = (sectionKey: string) => {
  activeInstitutionSection.value = sectionKey;

  for (const [categoryKey, sections] of Object.entries(
    availableInstitutionSections.value
  )) {
    if (sections.some((section) => section.key === sectionKey)) {
      activeInstitutionCategory.value = categoryKey as InstitutionCategoryKey;
      break;
    }
  }
};

const handleInstitutionSelection = async (institutionId: string) => {
  if (!institutionId) return;

  loading.value = true;
  error.value = null;

  try {
    // Fetch and set the active institution
    await institutionStore.fetchInstitutionById(institutionId);

    if (activeInstitution.value) {
      // Initialize academic data for this institution
      if (isHigherEducationInstitution.value) {
        await universityStore.fetchUniversityByInstitutionId(
          activeInstitution.value.id
        );

        if (universityStore.activeUniversity) {
          academicStore.institutionIdentifier =
            universityStore.activeUniversity.id;
          academicStore.isHigherEd = true;
        }
      } else {
        academicStore.institutionIdentifier = activeInstitution.value.id;
        academicStore.isHigherEd = false;
      }

      // Initialize academic stores
      await academicStore.initializeStore();

      // Switch to institution mode
      isInInstitutionMode.value = true;

      // Set a default section
      const firstAvailableSection = activeInstitutionCategorySections.value[0];
      if (firstAvailableSection) {
        activeInstitutionSection.value = firstAvailableSection.key;
      }
    }
  } catch (err: any) {
    console.error('Error selecting institution:', err);
    error.value = err.message || 'Failed to load institution';
  } finally {
    loading.value = false;
  }
};

const exitInstitutionMode = () => {
  isInInstitutionMode.value = false;
  selectedInstitutionId.value = null;
  activeInstitutionSection.value = '';
  institutionStore.clearActiveInstitution();
  academicStore.resetStores();
};

const refreshActiveSection = () => {
  if (isInInstitutionMode.value) {
    // Refresh institution section
    console.log(
      `Refreshing institution section: ${activeInstitutionSection.value}`
    );
  } else {
    // Refresh superadmin section
    console.log(`Refreshing superadmin section: ${activeSection.value}`);
    if (superAdminStore) {
      superAdminStore.refreshData(activeSection.value);
    }
  }
};

const handleUserMenuSelect = (key: string) => {
  switch (key) {
    case 'profile':
      router.push('/profile');
      break;
    case 'system-actions':
      showGlobalActionsModal.value = true;
      break;
    case 'logout':
      authStore.logout();
      break;
  }
};

// Fetch initial data
onMounted(async () => {
  loading.value = true;
  error.value = null;

  try {
    // Load all institutions for the selector
    await superAdminStore.fetchInstitutions();

    // Load SuperAdmin dashboard data
    if (superAdminStore) {
      await superAdminStore.initializeDashboard();
      statsData.value = superAdminStore.stats;
    }

    // Set a default active section for SuperAdmin mode
    if (superAdminSections[activeCategory.value]?.length > 0) {
      activeSection.value = superAdminSections[activeCategory.value][0].key;
    }
  } catch (err: any) {
    console.error('Error initializing dashboard:', err);
    error.value = err.message || 'Failed to initialize data';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.hover-elevate {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.hover-elevate:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Custom styling for the institution header */
.n-input-group .n-input {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.n-input-group .n-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.n-input-group .n-button {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}
</style>
