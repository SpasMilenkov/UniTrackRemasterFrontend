<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-2xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div
          class="bg-background-card border border-border rounded-2xl p-12 mb-6"
        >
          <div class="mb-8">
            <div class="relative mx-auto w-20 h-20 mb-6">
              <div
                class="absolute inset-0 border-4 border-border rounded-full"
              />
              <div
                class="absolute inset-0 border-4 border-t-primary border-r-primary rounded-full animate-spin"
              />
              <div
                class="absolute inset-2 bg-primary/10 rounded-full flex items-center justify-center"
              >
                <Icon name="ph:compass" class="text-2xl text-primary" />
              </div>
            </div>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">
              Finding Your Dashboard
            </h2>
            <p class="text-text-secondary leading-relaxed">
              Determining your access level and preparing your personalized
              experience...
            </p>
          </div>

          <div
            class="flex items-center justify-center gap-2 text-sm text-text-secondary"
          >
            <div class="w-2 h-2 bg-primary rounded-full animate-pulse"/>
            <div
              class="w-2 h-2 bg-primary rounded-full animate-pulse"
              style="animation-delay: 0.2s"
            />
            <div
              class="w-2 h-2 bg-primary rounded-full animate-pulse"
              style="animation-delay: 0.4s"
            />
          </div>
        </div>
      </div>

      <!-- Role Selection State -->
      <div v-else-if="availableRoles.length > 1" class="text-center">
        <div
          class="bg-background-card border border-border rounded-2xl p-8 mb-6"
        >
          <div class="mb-8">
            <div
              class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="ph:user-switch" class="text-3xl text-primary" />
            </div>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">
              Multiple Roles Available
            </h2>
            <p class="text-text-secondary leading-relaxed mb-6">
              You have multiple roles at this institution. Please select which
              role you'd like to use for this session:
            </p>
          </div>

          <div class="space-y-3 mb-8">
            <n-radio-group v-model:value="selectedRole">
              <n-space vertical>
                <div
                  v-for="role in availableRoles"
                  :key="role"
                  class="group relative"
                >
                  <n-radio
                    :value="role"
                    class="w-full p-4 bg-background-secondary hover:bg-border-hover border border-border hover:border-primary/30 rounded-xl transition-all duration-200 cursor-pointer group-hover:shadow-md"
                  >
                    <div class="flex items-center">
                      <div
                        class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4"
                      >
                        <Icon
                          :name="getRoleIcon(role)"
                          class="text-xl text-primary"
                        />
                      </div>
                      <div class="text-left">
                        <div class="font-semibold text-text-primary">
                          {{ formatRole(role) }}
                        </div>
                        <div class="text-sm text-text-secondary">
                          {{ getRoleDescription(role) }}
                        </div>
                      </div>
                    </div>
                  </n-radio>
                </div>
              </n-space>
            </n-radio-group>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <n-button
              type="primary"
              size="large"
              :disabled="!selectedRole"
              class="px-8"
              @click="confirmRoleSelection"
            >
              <template #icon>
                <Icon name="ph:arrow-right" />
              </template>
              Continue to Dashboard
            </n-button>

            <n-button size="large" class="px-6" @click="goToInstitutions">
              <template #icon>
                <Icon name="ph:arrow-left" />
              </template>
              Go Back
            </n-button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center">
        <div
          class="bg-background-card border border-border rounded-2xl p-8 mb-6"
        >
          <div class="mb-8">
            <div
              class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="ph:warning-circle" class="text-3xl text-red-500" />
            </div>
            <h2 class="text-2xl font-semibold text-text-primary mb-3">
              Access Issue
            </h2>
            <div
              class="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-6"
            >
              <p class="text-red-700 dark:text-red-400 font-medium">
                {{ error }}
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <n-button
              type="primary"
              size="large"
              class="px-6"
              @click="tryAgain"
            >
              <template #icon>
                <Icon name="ph:arrow-clockwise" />
              </template>
              Try Again
            </n-button>

            <n-button size="large" class="px-6" @click="goToInstitutions">
              <template #icon>
                <Icon name="ph:buildings" />
              </template>
              Choose Different Institution
            </n-button>
          </div>
        </div>

        <!-- Help section -->
        <div
          class="bg-background-secondary border border-border rounded-xl p-6"
        >
          <p class="text-text-secondary text-sm mb-4">
            Need help with access issues?
          </p>
          <div class="flex flex-wrap justify-center gap-4 text-sm">
            <button
              class="text-primary hover:text-primary-dark transition-colors duration-200 flex items-center gap-2"
              @click="contactSupport"
            >
              <Icon name="ph:chat-circle" class="text-base" />
              Contact Support
            </button>
            <button
              class="text-primary hover:text-primary-dark transition-colors duration-200 flex items-center gap-2"
              @click="reportIssue"
            >
              <Icon name="ph:bug" class="text-base" />
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserRoleType } from '~/enums/user-role.enum';
import { NButton, NRadioGroup, NRadio, NSpace } from 'naive-ui';

definePageMeta({
  layout: 'dashboard-layout',
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const institutionStore = useInstitutionStore();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref<string | null>(null);
const availableRoles = ref<UserRoleType[]>([]);
const selectedRole = ref<UserRoleType | null>(null);
const cameFromDashboard = ref(false);
const lastDashboardRole = ref<UserRoleType | null>(null);

// Check if user came from a dashboard page
onMounted(async () => {
  // Check session storage for navigation history
  if (import.meta.client) {
    const navigationHistory = sessionStorage.getItem(
      'dashboard_navigation_history'
    );
    const referrer = document.referrer;

    // Check if they came from a dashboard URL
    const dashboardPaths = [
      '/students/',
      '/teachers/',
      '/parents/',
      '/admins/',
      '/super-admins/',
    ];
    const cameFromDashboardPath = dashboardPaths.some((path) =>
      referrer.includes(path)
    );

    if (cameFromDashboardPath || navigationHistory) {
      cameFromDashboard.value = true;
      if (navigationHistory) {
        lastDashboardRole.value = JSON.parse(navigationHistory).role;
      }
    }
  }

  try {
    // Get institution ID from the route
    const institutionId = route.params.id as string;

    // If no institution ID is provided, go to institutions list
    if (!institutionId) {
      router.push('/institutions');
      return;
    }

    // Make sure the institution exists
    if (
      !institutionStore.activeInstitution ||
      institutionStore.activeInstitution.id !== institutionId
    ) {
      await institutionStore.fetchInstitutionById(institutionId);
    }

    // Fetch user roles in this institution
    const userId = userStore.userDetails?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Fetch roles from API
    const roles = await userStore.fetchUserRolesForInstitution(institutionId);
    console.log('Roles from the api', roles);

    if (roles && roles.length > 0) {
      availableRoles.value = roles;

      // If only one role, set it and proceed
      if (roles.length === 1) {
        console.log('user has 1 role here', roles[0]);
        userStore.setCurrentInstitutionRole(institutionId, roles[0]);
        await routeToRoleDashboard(roles[0], institutionId);
      } else {
        console.log('user has multiple roles', roles);
        // If multiple roles, let the user choose
        selectedRole.value = roles[0]; // Default to first role
        loading.value = false; // Show role selection UI
      }
    } else {
      console.log('Roles in the else', roles);
      console.log('Roles length', roles?.length);
      // No role found
      error.value = 'You do not have access to this institution.';
      loading.value = false;
    }
  } catch (err) {
    console.error('Error routing to dashboard:', err);
    error.value =
      err instanceof Error
        ? err.message
        : 'Failed to determine your role in this institution';
    loading.value = false;
  }
});

async function confirmRoleSelection() {
  if (!selectedRole.value) return;

  const institutionId = route.params.id as string;
  userStore.setCurrentInstitutionRole(institutionId, selectedRole.value);
  await routeToRoleDashboard(selectedRole.value, institutionId);
}

function getRoleIcon(role: UserRoleType): string {
  switch (role) {
    case UserRoleType.SuperAdmin:
      return 'ph:shield-star';
    case UserRoleType.Admin:
      return 'ph:user-gear';
    case UserRoleType.Teacher:
      return 'ph:chalkboard-teacher';
    case UserRoleType.Student:
      return 'ph:student';
    case UserRoleType.Parent:
      return 'ph:users';
    default:
      return 'ph:user';
  }
}

function formatRole(role: UserRoleType): string {
  switch (role) {
    case UserRoleType.SuperAdmin:
      return 'Super Administrator';
    case UserRoleType.Admin:
      return 'Administrator';
    case UserRoleType.Teacher:
      return 'Teacher';
    case UserRoleType.Student:
      return 'Student';
    case UserRoleType.Parent:
      return 'Parent';
    default:
      return role;
  }
}

function getRoleDescription(role: UserRoleType): string {
  switch (role) {
    case UserRoleType.SuperAdmin:
      return 'Full system administration access';
    case UserRoleType.Admin:
      return 'Institution administration access';
    case UserRoleType.Teacher:
      return 'Teaching and grading access';
    case UserRoleType.Student:
      return 'Student portal and academic records';
    case UserRoleType.Parent:
      return 'Parent portal and child monitoring';
    default:
      return 'Standard user access';
  }
}

async function routeToRoleDashboard(role: UserRoleType, institutionId: string) {
  try {
    // Simple routing - no session storage required
    switch (role) {
      case UserRoleType.SuperAdmin:
        router.push(`/super-admins/dashboard`);
        break;
      case UserRoleType.Admin:
        router.push(`/admins/dashboard`);
        break;
      case UserRoleType.Teacher:
        await fetchTeacherRecordAndRoute();
        break;
      case UserRoleType.Student:
        await fetchStudentRecordAndRoute();
        break;
      case UserRoleType.Parent:
        router.push(`/parents/dashboard`);
        break;
      default:
        router.push(`/institutions/${institutionId}`);
    }
  } catch (err) {
    console.error('Error in routeToRoleDashboard:', err);
    error.value =
      err instanceof Error ? err.message : 'Failed to route to your dashboard';
    loading.value = false;
  }
}

async function fetchStudentRecordAndRoute() {
  try {
    loading.value = true;

    const userId = userStore.userDetails?.id;
    if (!userId) {
      throw new Error('User ID not available');
    }

    const studentStore = useStudentStore();
    await studentStore.fetchByUserId(userId);

    if (studentStore.selectedStudent && studentStore.selectedStudent.id) {
      console.log('Found student record:', studentStore.selectedStudent.id);
      router.push({
        path: `/students/dashboard`,
        query: { studentId: studentStore.selectedStudent.id },
      });
    } else {
      error.value =
        'Could not find your student record. Please contact support.';
      loading.value = false;
    }
  } catch (err) {
    console.error('Error fetching student record:', err);
    error.value =
      err instanceof Error
        ? err.message
        : 'Failed to load your student profile';
    loading.value = false;
  }
}

async function fetchTeacherRecordAndRoute() {
  try {
    loading.value = true;

    const userId = userStore.userDetails?.id;
    if (!userId) {
      throw new Error('User ID not available');
    }

    console.log('Fetching teacher record for user ID:', userId);

    const teacherStore = useTeacherStore();
    const teacherQuery = teacherStore.teacherByUserIdQuery(ref(userId));
    await teacherQuery.refetch();
    const teacherData = teacherQuery.data.value;

    console.log('Teacher query result:', teacherData);

    if (teacherData && teacherData.id) {
      console.log('Found teacher record:', teacherData.id);
      teacherStore.selectTeacher(teacherData);
      router.push(`/teachers/${teacherData.id}/dashboard`);
    } else {
      console.warn('No teacher record found for user:', userId);
      error.value =
        'Could not find your teacher record. Please contact support.';
      loading.value = false;
    }
  } catch (err) {
    console.error('Error fetching teacher record:', err);
    error.value =
      err instanceof Error
        ? err.message
        : 'Failed to load your teacher profile';
    loading.value = false;
  }
}

function goToInstitutions() {
  router.push('/institutions');
}

function logout() {
  authStore.logout();
}

function contactSupport() {
  // Implement contact support logic
  console.log('Contact support clicked');
}

function reportIssue() {
  // Implement report issue logic
  console.log('Report issue clicked');
}

async function tryAgain() {
  loading.value = true;
  error.value = null;
  availableRoles.value = [];
  selectedRole.value = null;

  // Re-run the mounted logic
  try {
    const institutionId = route.params.id as string;

    if (!institutionId) {
      router.push('/institutions');
      return;
    }

    const userId = userStore.userDetails?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const roles = await userStore.fetchUserRolesForInstitution(institutionId);
    if (roles && roles.length > 0) {
      availableRoles.value = roles;

      if (roles.length === 1) {
        userStore.setCurrentInstitutionRole(institutionId, roles[0]);
        await routeToRoleDashboard(roles[0], institutionId);
      } else {
        selectedRole.value = roles[0];
        loading.value = false;
      }
    } else {
      error.value = 'You do not have access to this institution.';
      loading.value = false;
    }
  } catch (err) {
    console.error('Error in tryAgain:', err);
    error.value =
      err instanceof Error
        ? err.message
        : 'Failed to determine your role in this institution';
    loading.value = false;
  }
}
</script>
