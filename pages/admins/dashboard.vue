<!-- pages/admins/dashboard.vue -->
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
      <div class="mt-4">
        <n-button type="primary" @click="navigateToInstitutions">
          Go to Institutions
        </n-button>
      </div>
    </div>

    <!-- No Institution Selected State -->
    <div
      v-else-if="!activeInstitution"
      class="flex flex-col items-center justify-center h-64 space-y-4"
    >
      <div class="rounded-full p-6 bg-primary/10">
        <Icon name="ph:buildings" class="text-4xl text-primary" />
      </div>
      <div class="text-center">
        <h3 class="text-lg font-medium text-text-primary mb-2">
          No Institution Selected
        </h3>
        <p class="text-text-secondary mb-4 max-w-md">
          Please select an institution to manage its academic structure and
          settings
        </p>
      </div>
      <n-button type="primary" size="large" @click="navigateToInstitutions">
        <template #icon>
          <Icon name="ph:buildings" />
        </template>
        Select Institution
      </n-button>
    </div>

    <!-- Content with Institution Selected -->
    <template v-else>
      <!-- Institution Header -->
      <div class="mb-6">
        <div class="bg-background-secondary rounded-xl p-6 text-color-primary">
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div class="flex items-center gap-4">
              <div class="rounded-lg p-3 bg-white/20 backdrop-blur-sm">
                <Icon :name="institutionIcon" class="text-2xl" />
              </div>
              <div>
                <h1 class="text-xl md:text-2xl font-semibold m-0">
                  {{ activeInstitution.name }}
                </h1>
                <p class="text-color-secondary/80 mt-1">
                  {{ institutionTypeLabel }} • Academic Dashboard
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <n-input-group v-if="showSearch">
                <n-input
                  v-model:value="searchQuery"
                  placeholder="Search sections..."
                  class="min-w-[200px]"
                >
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
              <n-button quaternary circle @click="navigateToInstitutions">
                <Icon name="ph:buildings" />
              </n-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Navigation -->
      <div class="mb-6">
        <n-tabs
          v-model:value="activeCategory"
          type="segment"
          :justify-content="isMobile ? 'space-between' : 'start'"
          class="mb-4"
        >
          <n-tab
            v-for="category in availableCategories"
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

      <!-- Section Cards for the active category -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <n-card
          v-for="section in activeCategorySections"
          :key="section.key"
          class="hover-elevate cursor-pointer transition-all duration-200"
          :class="{
            'border-primary border-2 bg-primary/5':
              section.key === activeSection,
            'hover:border-primary/50': section.key !== activeSection,
          }"
          @click="setActiveSection(section.key)"
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

      <!-- Active Section Content -->
      <n-card v-if="activeSection" class="min-h-[400px]">
        <template #header>
          <div class="flex items-center gap-2">
            <Icon :name="activeSectionIcon" class="text-xl text-primary" />
            <span>{{ activeSectionTitle }}</span>
          </div>
        </template>

        <component
          :is="activeSectionComponent"
          v-if="activeSectionComponent"
          :key="activeSection"
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
          <h3 class="text-lg font-medium mb-2">
            Welcome to Academic Management
          </h3>
          <p class="text-text-secondary mb-6 max-w-2xl mx-auto">
            Manage your {{ institutionTypeLabel.toLowerCase() }}'s academic
            structure, students, faculty, and administrative settings all in one
            place.
          </p>
          <div class="flex flex-wrap justify-center gap-2">
            <n-button
              v-for="quickAction in quickActions"
              :key="quickAction.key"
              type="primary"
              ghost
              @click="setActiveSection(quickAction.key)"
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

    <!-- Create Modal -->
    <n-modal v-model:show="showCreateModal" :mask-closable="false">
      <n-card
        style="width: 90vw; max-width: 600px"
        :title="`Create ${activeSectionLabel}`"
        :bordered="false"
        size="huge"
      >
        <p class="text-text-secondary mb-4">
          Create a new {{ activeSectionLabel.toLowerCase() }} for
          {{ activeInstitution?.name }}.
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showCreateModal = false">Cancel</n-button>
            <n-button type="primary">Create {{ activeSectionLabel }}</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
  NTag,
} from 'naive-ui';
import { useRouter } from 'vue-router';

// Import components
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
// Import the stores and helpers
import { useAcademicStore } from '@/stores/academic';
import { useInstitutionStore } from '@/stores/institution';
import { useUniversityStore } from '@/stores/university';
import { isHigherEducation, isSchool } from '@/utils/institution-helper';
import type { InstitutionType } from '@/enums/institution-type.enum';

definePageMeta({
  layout: 'dashboard-layout',
});

// Define types for better TypeScript support
type CategoryKey =
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

interface CategoryItem {
  key: CategoryKey;
  label: string;
  icon: string;
}

// Router and route
const router = useRouter();
const route = useRoute();

// Get the stores
const academicStore = useAcademicStore();
const academicYearStore = useAcademicYearStore();
const institutionStore = useInstitutionStore();
const universityStore = useUniversityStore();

// State variables
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const showSearch = ref(false);
const activeCategory = ref<CategoryKey>('structure');
const activeSection = ref('');
const showCreateModal = ref(false);

// Mobile detection
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = computed(() => !breakpoints.greater('md').value);

// Get the active institution from the store
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

// Define categories and sections with proper typing
const allCategories: CategoryItem[] = [
  { key: 'structure', label: 'Structure', icon: 'ph:tree-structure' },
  { key: 'people', label: 'People', icon: 'ph:users-three' },
  { key: 'academics', label: 'Academics', icon: 'ph:graduation-cap' },
  { key: 'management', label: 'Management', icon: 'ph:chart-bar' },
  { key: 'settings', label: 'Settings', icon: 'ph:gear' },
];

const allSections: Record<CategoryKey, SectionItem[]> = {
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
      // Removed institutionTypes restriction - now available for both
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

// Computed properties for filtered content
const availableCategories = computed(() => {
  // All categories are available for both types, but their sections may differ
  return allCategories;
});

const availableSections = computed((): Record<CategoryKey, SectionItem[]> => {
  const filtered: Record<CategoryKey, SectionItem[]> = {} as Record<
    CategoryKey,
    SectionItem[]
  >;

  for (const [categoryKey, sections] of Object.entries(allSections)) {
    filtered[categoryKey as CategoryKey] =
      filterSectionsByInstitutionType(sections);
  }

  return filtered;
});

const activeCategorySections = computed(() => {
  // If search query exists, filter across all sections
  if (searchQuery.value) {
    const allFilteredSections = Object.values(availableSections.value).flat();
    return allFilteredSections.filter(
      (section) =>
        section.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        section.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    );
  }

  return availableSections.value[activeCategory.value] || [];
});

const activeSectionData = computed(() => {
  if (!activeSection.value) return null;

  // Find the section across all categories
  for (const sections of Object.values(availableSections.value)) {
    const section = sections.find((s) => s.key === activeSection.value);
    if (section) return section;
  }

  return null;
});

const activeSectionComponent = computed(() => {
  return activeSectionData.value?.component || null;
});

const activeSectionLabel = computed(() => {
  return activeSectionData.value?.label || '';
});

const activeSectionTitle = computed(() => {
  return activeSection.value ? activeSectionLabel.value : 'Select a Section';
});

const activeSectionIcon = computed(() => {
  return activeSectionData.value?.icon || 'ph:info';
});

// Quick actions for getting started
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
const navigateToInstitutions = () => {
  router.push('/institutions');
};

const setActiveSection = (sectionKey: string) => {
  activeSection.value = sectionKey;

  // Determine which category this section belongs to
  for (const [categoryKey, sections] of Object.entries(
    availableSections.value
  )) {
    if (sections.some((section) => section.key === sectionKey)) {
      activeCategory.value = categoryKey as CategoryKey;
      break;
    }
  }
};

// Check if user has active institution, and initialize data if so
onMounted(async () => {
  // If there's no active institution, try to get one from the query parameter
  if (!activeInstitution.value) {
    const institutionId = route.query.institutionId as string;

    if (institutionId) {
      loading.value = true;
      error.value = null;

      try {
        // Try to fetch and set the institution
        await institutionStore.fetchInstitutionById(institutionId);
      } catch (err: any) {
        console.error('Error loading institution:', err);
        error.value = err.message || 'Failed to load institution';
      } finally {
        loading.value = false;
      }
    }
  }

  if (!academicStore.initialized) {
    // Let the academic store coordinate initialization
    await academicStore.initializeStore();
  }

  // Load academic years for the active institution
  if (institutionStore.activeInstitution?.id) {
    await academicYearStore.fetchAcademicYearsByInstitution(
      institutionStore.activeInstitution.id
    );
  } else {
    // Fallback to loading all academic years
    await academicYearStore.fetchAcademicYears();
  }

  // Initialize data if we have an active institution
  if (activeInstitution.value) {
    loading.value = true;
    error.value = null;

    try {
      // If the institution is a university, get university data
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
        // For schools, set up school-specific data
        academicStore.institutionIdentifier = activeInstitution.value.id;
        academicStore.isHigherEd = false;
      }

      // Initialize academic structure
      await academicStore.initializeStore();

      // Add institutionId to URL if it's not already there
      if (!route.query.institutionId) {
        router.replace({
          query: {
            ...route.query,
            institutionId: activeInstitution.value.id,
          },
        });
      }
    } catch (err: any) {
      console.error('Error initializing data:', err);
      error.value = err.message || 'Failed to initialize data';
    } finally {
      loading.value = false;
    }
  }

  // Set a default active section based on institution type
  const firstAvailableSection = activeCategorySections.value[0];
  if (firstAvailableSection) {
    activeSection.value = firstAvailableSection.key;
  }
});
</script>

<style scoped>
.hover-elevate {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-elevate:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
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
