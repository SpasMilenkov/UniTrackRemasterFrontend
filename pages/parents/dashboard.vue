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
            Setting up your parent portal...
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
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <template v-else-if="parentStore.parent">
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
                        name="ph:users"
                        class="text-2xl lg:text-3xl text-primary"
                      />
                    </div>
                    <div
                      v-if="parentStore.hasChildren"
                      class="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background-card"
                    >
                      <span class="text-xs text-white font-bold">{{
                        parentStore.activeChildren.length
                      }}</span>
                    </div>
                  </div>

                  <!-- Welcome Text -->
                  <div>
                    <h1
                      class="text-2xl lg:text-3xl font-bold text-text-primary mb-2"
                    >
                      Welcome back, {{ parentStore.displayName }}
                    </h1>
                    <div
                      class="flex flex-col sm:flex-row sm:items-center gap-3 text-sm"
                    >
                      <div class="flex items-center gap-2 text-text-secondary">
                        <Icon name="ph:calendar" class="text-sm" />
                        <span>{{ currentDate }}</span>
                      </div>
                      <div
                        v-if="parentStore.hasChildren"
                        class="flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full text-secondary"
                      >
                        <Icon name="ph:graduation-cap" class="text-sm" />
                        <span class="font-medium">{{
                          parentStore.activeChildren.length === 1
                            ? '1 child'
                            : `${parentStore.activeChildren.length} children`
                        }}</span>
                      </div>
                      <div class="flex items-center gap-2 text-text-secondary">
                        <Icon name="ph:buildings" class="text-sm" />
                        <span>{{ institutionStore.activeInstitution?.name }}</span>
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

                  <n-dropdown
                    :options="headerMenuOptions"
                    @select="handleHeaderMenuSelect"
                    placement="bottom-end"
                  >
                    <n-button
                      circle
                      size="large"
                      class="border border-border hover:border-primary/50 hover:bg-primary/5"
                    >
                      <template #icon>
                        <Icon
                          name="ph:dots-three-vertical"
                          class="text-text-primary"
                        />
                      </template>
                    </n-button>
                  </n-dropdown>
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
                    <span class="text-text-secondary">Parent Portal</span>
                  </div>
                  <div class="flex items-center gap-2 text-text-muted">
                    <Icon name="ph:clock" class="text-sm" />
                    <span>Last updated: Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Child Selector (if multiple children) -->
        <div v-if="parentStore.activeChildren.length > 1" class="mb-8">
          <div
            class="bg-background-card rounded-2xl shadow-sm border border-border p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <Icon name="ph:graduation-cap" class="text-lg text-secondary" />
              <h3 class="text-lg font-semibold text-primary">Select Child</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="child in parentStore.activeChildren"
                :key="child.id"
                class="relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover-elevate"
                :class="[
                  parentStore.selectedChild?.id === child.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border-hover',
                ]"
                @click="selectChild(child)"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
                  >
                    <Icon name="ph:student" class="text-xl text-primary" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-primary truncate">
                      {{ child.firstName }} {{ child.lastName }}
                    </h4>
                    <p class="text-sm text-secondary truncate">
                      {{ child.email }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <span
                        v-if="child.gradeName"
                        class="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full"
                      >
                        {{ child.gradeName }}
                      </span>
                      <span
                        v-if="child.majorName"
                        class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                      >
                        {{ child.majorName }}
                      </span>
                    </div>
                  </div>
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
              <n-tab name="profile" tab="Parent Profile">
                <template #icon>
                  <Icon name="ph:user-circle" />
                </template>
              </n-tab>
              <n-tab
                v-if="parentStore.selectedChild"
                name="child-dashboard"
                :tab="`${parentStore.selectedChild.firstName}'s Dashboard`"
              >
                <template #icon>
                  <Icon name="ph:graduation-cap" />
                </template>
              </n-tab>
            </n-tabs>
          </div>

          <div class="p-6">
            <!-- Parent Profile Tab -->
            <div v-if="activeTab === 'profile'" class="space-y-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Profile Information -->
                <div>
                  <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                      <Icon
                        name="ph:user-circle"
                        class="text-xl text-secondary"
                      />
                      <h3 class="text-xl font-semibold text-primary">
                        Profile Information
                      </h3>
                    </div>
                    <n-button type="primary" @click="showEditProfile = true">
                      <template #icon>
                        <Icon name="ph:pencil" />
                      </template>
                      Edit Profile
                    </n-button>
                  </div>
                  <div
                    class="space-y-4 p-6 bg-background-secondary rounded-xl border border-border"
                  >
                    <div class="flex justify-between items-center">
                      <span class="text-secondary font-medium">Name:</span>
                      <span class="text-primary font-semibold">{{
                        parentStore.displayName
                      }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-secondary font-medium">Email:</span>
                      <span class="text-primary">{{
                        parentStore.parent?.email
                      }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-secondary font-medium"
                        >Occupation:</span
                      >
                      <span class="text-primary">{{
                        parentStore.parent?.occupation || 'Not specified'
                      }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-secondary font-medium"
                        >Emergency Contact:</span
                      >
                      <span class="text-primary">{{
                        parentStore.parent?.emergencyContact || 'Not specified'
                      }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-secondary font-medium">Status:</span>
                      <n-tag
                        :type="getStatusType(parentStore.parent?.status)"
                        size="medium"
                      >
                        {{ parentStore.parent?.status }}
                      </n-tag>
                    </div>
                    <div
                      v-if="parentStore.parent?.notes"
                      class="border-t border-border pt-4"
                    >
                      <span class="text-secondary font-medium block mb-2"
                        >Notes:</span
                      >
                      <p class="text-primary text-sm leading-relaxed">
                        {{ parentStore.parent.notes }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Children Summary -->
                <div>
                  <div class="flex items-center gap-3 mb-6">
                    <Icon name="ph:users" class="text-xl text-primary" />
                    <h3 class="text-xl font-semibold text-primary">
                      My Children
                    </h3>
                  </div>
                  <div class="space-y-4 max-h-96 overflow-y-auto">
                    <div
                      v-for="child in parentStore.activeChildren"
                      :key="child.id"
                      class="group p-4 rounded-xl bg-background-secondary border border-border hover:shadow-md hover-elevate transition-all duration-200 cursor-pointer"
                      @click="selectChild(child)"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <div
                            class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
                          >
                            <Icon name="ph:student" class="text-primary" />
                          </div>
                          <div>
                            <h4 class="font-semibold text-primary">
                              {{ child.firstName }} {{ child.lastName }}
                            </h4>
                            <p class="text-sm text-secondary">
                              {{ child.email }}
                            </p>
                            <div class="flex items-center gap-2 mt-1">
                              <span
                                v-if="child.gradeName"
                                class="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full"
                              >
                                {{ child.gradeName }}
                              </span>
                              <span
                                v-if="child.majorName"
                                class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                              >
                                {{ child.majorName }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="text-right">
                          <n-tag
                            :type="getStatusType(child.status)"
                            size="small"
                          >
                            {{ child.status }}
                          </n-tag>
                          <div class="mt-2">
                            <Icon
                              name="ph:arrow-right"
                              class="text-secondary group-hover:text-primary transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="parentStore.activeChildren.length === 0"
                      class="text-center py-12 text-muted"
                    >
                      <Icon name="ph:users" class="text-3xl mb-3" />
                      <p>No active children found</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Child Dashboard Tab -->
            <div v-if="activeTab === 'child-dashboard' && parentStore.selectedChild">
              <!-- Navigation message -->
              <div
                class="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20"
              >
                <div class="flex items-center gap-3">
                  <Icon name="ph:info" class="text-primary" />
                  <p class="text-primary">
                    Viewing academic dashboard for
                    <strong
                      >{{ parentStore.selectedChild?.firstName }}
                      {{ parentStore.selectedChild?.lastName }}</strong
                    >
                  </p>
                </div>
              </div>

              <!-- Enhanced Dashboard Links -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Academic Dashboard Card -->
                <div
                  class="bg-background-secondary rounded-xl p-6 border border-border hover-elevate transition-all duration-200"
                >
                  <div class="text-center space-y-4">
                    <div
                      class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                    >
                      <Icon
                        name="ph:graduation-cap"
                        class="text-2xl text-primary"
                      />
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-primary mb-2">
                        Academic Dashboard
                      </h4>
                      <p class="text-secondary text-sm mb-4">
                        View grades, assignments, and academic performance
                        insights
                      </p>
                    </div>
                    <NuxtLink
                      :to="`/students/dashboard?studentId=${parentStore.selectedChild.id}`"
                      target="_blank"
                      class="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors w-full justify-center"
                      @click="trackDashboardAccess('academic')"
                    >
                      <Icon name="ph:graduation-cap" />
                      Open Dashboard
                      <Icon name="ph:arrow-square-out" />
                    </NuxtLink>
                  </div>
                </div>

                <!-- Attendance Insights Card -->
                <div
                  class="bg-background-secondary rounded-xl p-6 border border-border hover-elevate transition-all duration-200"
                >
                  <div class="text-center space-y-4">
                    <div
                      class="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto"
                    >
                      <Icon
                        name="ph:chart-line-up"
                        class="text-2xl text-secondary"
                      />
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-primary mb-2">
                        Attendance Insights
                      </h4>
                      <p class="text-secondary text-sm mb-4">
                        Monitor attendance patterns and performance correlations
                      </p>
                    </div>
                    <NuxtLink
                      :to="`/students/${parentStore.selectedChild.id}/attendance-insights`"
                      target="_blank"
                      class="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-dark text-white rounded-xl transition-colors w-full justify-center"
                      @click="trackDashboardAccess('attendance')"
                    >
                      <Icon name="ph:chart-line-up" />
                      View Insights
                      <Icon name="ph:arrow-square-out" />
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <!-- Communication Section -->
              <div class="mb-8">
                <h4
                  class="text-lg font-semibold text-primary mb-4 flex items-center gap-2"
                >
                  <Icon name="ph:chat-circle" />
                  Communication
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="p-6 bg-background-secondary rounded-xl border border-border">
                    <div class="flex items-center gap-3 mb-4">
                      <Icon name="ph:envelope" class="text-primary text-xl" />
                      <h5 class="font-semibold text-primary">Message Teachers</h5>
                    </div>
                    <p class="text-secondary text-sm mb-4">
                      Send direct messages to your child's teachers
                    </p>
                    <n-button type="primary" size="medium" ghost disabled>
                      <template #icon>
                        <Icon name="ph:paper-plane-tilt" />
                      </template>
                      Coming Soon
                    </n-button>
                  </div>
                  <div class="p-6 bg-background-secondary rounded-xl border border-border">
                    <div class="flex items-center gap-3 mb-4">
                      <Icon name="ph:calendar-plus" class="text-primary text-xl" />
                      <h5 class="font-semibold text-primary">Schedule Meeting</h5>
                    </div>
                    <p class="text-secondary text-sm mb-4">
                      Request a meeting with teachers or counselors
                    </p>
                    <n-button type="primary" size="medium" ghost disabled>
                      <template #icon>
                        <Icon name="ph:calendar" />
                      </template>
                      Coming Soon
                    </n-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- No Parent Found State -->
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
          No Parent Profile Found
        </h3>
        <p class="text-secondary mb-6">
          We couldn't find a parent profile associated with your account. Please
          contact support if you believe this is an error.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <n-button type="primary" size="large" @click="initializeDashboard">
            <template #icon>
              <Icon name="ph:arrow-clockwise" />
            </template>
            Retry
          </n-button>
          <n-button size="large" @click="changeInstitution">
            <template #icon>
              <Icon name="ph:buildings" />
            </template>
            Change Institution
          </n-button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <n-modal
      v-model:show="showEditProfile"
      preset="card"
      style="width: 40rem"
      title="Edit Profile"
      :closable="!parentStore.isUpdatingParent"
      :mask-closable="!parentStore.isUpdatingParent"
    >
      <ParentProfileForm
        :loading="parentStore.isUpdatingParent"
        :initial-values="profileFormData"
        @submit="handleUpdateProfile"
        @cancel="showEditProfile = false"
      />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useParentStore, type UpdateParentSchema } from '~/stores/parent';
import { useAuthStore } from '~/stores/auth';
import { useInstitutionStore } from '~/stores/institution';
import {
  NButton,
  NTabs,
  NTab,
  NTag,
  NModal,
  NDropdown,
  useMessage,
} from 'naive-ui';
import { Icon } from '#components';
import ParentProfileForm from '~/components/parent/ParentProfileForm.vue';

definePageMeta({
  title: 'Parent Dashboard',
  layout: 'dashboard-layout',
});

// Stores and utilities
const parentStore = useParentStore();
const authStore = useAuthStore();
const institutionStore = useInstitutionStore();
const message = useMessage();
const router = useRouter();

// State
const isInitialLoading = ref(true);
const mainError = ref<string | null>(null);
const activeTab = ref('profile');
const isRefreshing = ref(false);
const showEditProfile = ref(false);

// Store navigation history for the router
onMounted(() => {
  if (import.meta.client) {
    sessionStorage.setItem(
      'dashboard_navigation_history',
      JSON.stringify({
        role: 'Parent',
        institutionId: institutionStore.activeInstitution?.id,
        timestamp: Date.now(),
      })
    );
  }
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

// Profile form data
const profileFormData = computed(() => {
  if (!parentStore.parent) return {};
  return {
    occupation: parentStore.parent.occupation || '',
    emergencyContact: parentStore.parent.emergencyContact || '',
    notes: parentStore.parent.notes || '',
  };
});

// Header menu options
const headerMenuOptions = computed(() => [
  {
    label: 'Switch Role',
    key: 'switch-role',
    icon: () => h(Icon, { name: 'ph:user-switch' }),
  },
  {
    label: 'Change Institution',
    key: 'change-institution',
    icon: () => h(Icon, { name: 'ph:buildings' }),
  },
  {
    type: 'divider',
    key: 'divider1',
  },
  {
    label: 'Account Settings',
    key: 'account-settings',
    icon: () => h(Icon, { name: 'ph:gear' }),
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: () => h(Icon, { name: 'ph:sign-out' }),
  },
]);

// Utility functions
const getStatusType = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'inactive':
      return 'default';
    case 'suspended':
      return 'error';
    default:
      return 'info';
  }
};

// Event handlers
const selectChild = (child: any) => {
  parentStore.selectChild(child);
  // Switch to child dashboard tab
  activeTab.value = 'child-dashboard';
};

const refreshAllData = async () => {
  if (!authStore.user?.id) return;

  isRefreshing.value = true;
  try {
    await parentStore.fetchParentByUserId(authStore.user.id);
    message.success('Data refreshed successfully');
  } catch (error: any) {
    message.error('Failed to refresh data: ' + error.message);
  } finally {
    isRefreshing.value = false;
  }
};

const handleUpdateProfile = async (formData: UpdateParentSchema) => {
  if (!parentStore.parent?.id) return;

  try {
    await parentStore.updateParent(parentStore.parent.id, formData);
    message.success('Profile updated successfully');
    showEditProfile.value = false;
  } catch (error: any) {
    message.error('Failed to update profile: ' + error.message);
  }
};

const handleHeaderMenuSelect = (key: string) => {
  switch (key) {
    case 'switch-role':
      if (institutionStore.activeInstitution) {
        router.push(`/dashboard/${institutionStore.activeInstitution.id}`);
      }
      break;
    case 'change-institution':
      changeInstitution();
      break;
    case 'account-settings':
      // Navigate to account settings (to be implemented)
      message.info('Account settings coming soon');
      break;
    case 'logout':
      authStore.logout();
      break;
  }
};

const changeInstitution = () => {
  // Clear navigation history
  if (import.meta.client) {
    sessionStorage.removeItem('dashboard_navigation_history');
  }
  router.push('/institutions');
};

const trackDashboardAccess = (type: string) => {
  // Track analytics for dashboard access
  console.log(
    `Parent accessed ${type} dashboard for child:`,
    parentStore.selectedChild?.id
  );
};

// Main initialization
const initializeDashboard = async () => {
  try {
    isInitialLoading.value = true;
    mainError.value = null;

    if (!authStore.user?.id) {
      throw new Error('No user ID available. Please log in again.');
    }

    console.log('Fetching parent data for user ID:', authStore.user.id);
    await parentStore.fetchParentByUserId(authStore.user.id);

    console.log('Parent dashboard initialized successfully');
  } catch (error: any) {
    console.error('Error initializing parent dashboard:', error);
    mainError.value = error.message || 'Failed to initialize dashboard';
  } finally {
    isInitialLoading.value = false;
  }
};

// Initialize on mount
onMounted(async () => {
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

/* Animation and hover effects */
.hover-elevate {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-elevate:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Tab styling */
:deep(.n-tabs .n-tabs-nav) {
  padding: 0;
}

:deep(.n-tabs .n-tabs-tab) {
  padding: 1rem 1.5rem;
  font-weight: 500;
}

:deep(.n-tabs .n-tabs-tab--active) {
  color: var(--color-primary);
}

/* Button styling */
:deep(.n-button) {
  border-radius: 0.75rem;
  font-weight: 500;
}

:deep(.n-button--primary-type) {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

:deep(.n-button--primary-type:hover) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

/* Card hover effects */
.transition-all {
  transition: all 0.2s ease;
}

/* Custom border colors */
/* .border-border {
  border-color: var(--border-color);
} */

.border-border-hover {
  border-color: var(--border-color-hover);
}

/* Custom text colors matching student dashboard */
.text-text-primary {
  color: var(--text-color-1);
}

.text-text-secondary {
  color: var(--text-color-2);
}

.text-text-muted {
  color: var(--text-color-3);
}

.text-primary {
  color: var(--color-primary);
}

.text-secondary {
  color: var(--color-secondary);
}

.text-muted {
  color: var(--text-color-3);
}

/* Custom background colors */
.bg-background {
  background-color: var(--body-color);
}

.bg-background-card {
  background-color: var(--card-color);
}

.bg-background-secondary {
  background-color: var(--popover-color);
}

/* Loading spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Pulse animation */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Custom dropdown styling */
:deep(.n-dropdown-menu) {
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

:deep(.n-dropdown-option) {
  border-radius: 0.5rem;
  margin: 0.25rem;
  padding: 0.75rem 1rem;
}

/* Custom modal styling */
:deep(.n-modal) {
  border-radius: 1rem;
}

:deep(.n-card) {
  border-radius: 1rem;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .gap-6 {
    gap: 1rem;
  }
  
  .p-8 {
    padding: 1.5rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .text-3xl {
    font-size: 1.875rem;
  }
}

/* Link styling */
a {
  text-decoration: none;
  transition: all 0.2s ease;
}

a:hover {
  transform: translateY(-1px);
}

/* Tag styling consistency */
:deep(.n-tag) {
  border-radius: 0.5rem;
  font-weight: 500;
}

/* Input and form styling consistency */
:deep(.n-input) {
  border-radius: 0.75rem;
}

:deep(.n-input--focus) {
  box-shadow: 0 0 0 2px var(--color-primary-opacity);
}

/* Print styles */
@media print {
  .hover-elevate:hover {
    transform: none;
    box-shadow: none;
  }
  
  .no-print {
    display: none !important;
  }
}

/* Focus styles for accessibility */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-border {
    border-width: 2px;
  }
  
  .text-secondary {
    color: var(--text-color-1);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .hover-elevate {
    transition: none;
  }
  
  .animate-spin,
  .animate-pulse {
    animation: none;
  }
  
  .transition-all {
    transition: none;
  }
}
</style>