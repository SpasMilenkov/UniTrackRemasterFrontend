<!-- components/superadmin/ApplicationsTab.vue -->
<template>
  <div>
    <!-- Filters and Search Section -->
    <div class="mb-4">
      <div
        class="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center"
      >
        <n-input-group class="w-full sm:w-auto">
          <n-input
            v-model:value="searchQuery"
            placeholder="Search applications..."
            class="w-full sm:min-w-[300px]"
            :loading="onboardingStore.isLoadingApplications"
          >
            <template #prefix>
              <Icon name="ph:magnifying-glass" class="text-gray-400" />
            </template>
          </n-input>
        </n-input-group>

        <div class="flex gap-2">
          <n-select
            v-model:value="selectedSchool"
            :options="schoolOptions"
            placeholder="Filter by school"
            class="w-full sm:w-[200px]"
            clearable
          />

          <n-select
            v-model:value="selectedStatus"
            :options="statusOptions"
            placeholder="Filter by status"
            class="w-full sm:w-[150px]"
            clearable
          />
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-background-card rounded-lg p-4 border border-gray-700/50">
        <div class="text-2xl font-bold text-primary">
          {{ onboardingStore.applicationsTotalCount }}
        </div>
        <div class="text-sm text-text-secondary">Total Applications</div>
      </div>
      <div class="bg-background-card rounded-lg p-4 border border-gray-700/50">
        <div class="text-2xl font-bold text-warning">{{ pendingCount }}</div>
        <div class="text-sm text-text-secondary">Pending</div>
      </div>
      <div class="bg-background-card rounded-lg p-4 border border-gray-700/50">
        <div class="text-2xl font-bold text-success">{{ approvedCount }}</div>
        <div class="text-sm text-text-secondary">Approved</div>
      </div>
      <div class="bg-background-card rounded-lg p-4 border border-gray-700/50">
        <div class="text-2xl font-bold text-error">{{ rejectedCount }}</div>
        <div class="text-sm text-text-secondary">Rejected</div>
      </div>
    </div>

    <!-- Applications List -->
    <div>
      <div class="space-y-4">
        <!-- Loading state -->
        <div v-if="onboardingStore.isLoadingApplications" class="space-y-4">
          <div
            v-for="n in 3"
            :key="n"
            class="bg-background-card rounded-xl border border-gray-700/50 p-4 sm:p-6"
          >
            <n-skeleton text :repeat="3" />
            <n-skeleton text style="width: 60%" />
          </div>
        </div>

        <!-- Applications list -->
        <template
          v-else-if="filteredApplications && filteredApplications.length > 0"
        >
          <div
            v-for="application in filteredApplications"
            :key="application.id"
            class="bg-background-card rounded-xl border border-gray-700/50 p-4 sm:p-6 group hover:border-primary/50 transition-all duration-300"
          >
            <div class="flex flex-col gap-4">
              <!-- Top Section: Name, Status, and Tags -->
              <div class="flex flex-col sm:flex-row justify-between gap-4">
                <div class="space-y-2">
                  <h3
                    class="text-lg sm:text-xl font-semibold text-text-primary"
                  >
                    {{ application.firstName }} {{ application.lastName }}
                  </h3>
                  <div class="flex flex-col gap-1">
                    <p class="text-text-secondary text-sm">
                      {{ application.email }}
                    </p>
                    <p class="text-text-secondary text-sm">
                      {{ application.phone }}
                    </p>
                    <p class="text-text-secondary text-sm">
                      Code: {{ application.code }}
                    </p>
                  </div>
                </div>

                <!-- Status and Tags -->
                <div class="flex flex-row sm:flex-col items-start gap-2">
                  <n-tag
                    :bordered="false"
                    type="info"
                    size="small"
                    class="whitespace-nowrap"
                  >
                    ID: {{ application.id.slice(0, 8) }}
                  </n-tag>
                  <n-tag
                    :bordered="false"
                    type="warning"
                    size="small"
                    class="whitespace-nowrap"
                  >
                    School ID: {{ application.institution.id.slice(0, 8) }}
                  </n-tag>
                </div>
              </div>

              <!-- Middle Section: Institution and Address -->
              <div class="space-y-2">
                <div
                  class="flex items-center gap-2 text-text-secondary text-sm"
                >
                  <Icon name="ph:buildings" />
                  <span>{{ application.institution.name }}</span>
                </div>

                <div class="flex items-start gap-2 text-text-secondary text-sm">
                  <Icon name="ph:map-pin" class="mt-1 flex-shrink-0" />
                  <span class="break-words">
                    {{ application.institution.address.street }},
                    {{ application.institution.address.settlement }},
                    {{ application.institution.address.postalCode }},
                    {{ application.institution.address.country }}
                  </span>
                </div>
              </div>

              <!-- Bottom Section: Actions -->
              <div class="flex flex-col sm:flex-row gap-3 mt-2">
                <div
                  v-if="application.status === ApplicationStatus.Pending"
                  class="flex gap-3 flex-1"
                >
                  <n-button
                    type="primary"
                    class="flex-1"
                    :loading="isApprovingApplication === application.id"
                    :disabled="
                      isApprovingApplication === application.id ||
                      isDeletingApplication === application.id
                    "
                    @click="approveApplication(application.id)"
                  >
                    <template #icon>
                      <Icon name="ph:check-bold" />
                    </template>
                    Approve
                  </n-button>
                  <n-button
                    type="error"
                    class="flex-1"
                    :loading="isDeletingApplication === application.id"
                    :disabled="
                      isApprovingApplication === application.id ||
                      isDeletingApplication === application.id
                    "
                    @click="showRejectDialog(application.id)"
                  >
                    <template #icon>
                      <Icon name="ph:x-bold" />
                    </template>
                    Reject
                  </n-button>
                </div>
                <div v-else class="flex justify-end">
                  <n-tag
                    v-if="application.status === ApplicationStatus.Approved"
                    type="success"
                    :bordered="false"
                    >Approved</n-tag
                  >
                  <n-tag
                    v-if="application.status === ApplicationStatus.Denied"
                    type="error"
                    :bordered="false"
                    >Rejected</n-tag
                  >
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <div
          v-else
          class="bg-background-card rounded-xl border border-gray-700/50 p-8 sm:p-12 text-center"
        >
          <Icon
            name="ph:folder-simple"
            class="text-text-secondary text-4xl sm:text-5xl mb-4"
          />
          <h3 class="text-lg sm:text-xl font-semibold text-text-secondary mb-2">
            No Applications Found
          </h3>
          <p class="text-text-muted text-sm sm:text-base">
            {{
              searchQuery || selectedSchool || selectedStatus
                ? 'Try adjusting your search or filters'
                : 'No applications have been submitted yet'
            }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="onboardingStore.applicationsTotalPages > 1"
        class="mt-6 flex justify-center"
      >
        <n-pagination
          :current="onboardingStore.applicationsPage"
          :total="onboardingStore.applicationsTotalCount"
          :page-size="onboardingStore.applicationsPageSize"
          :page-count="onboardingStore.applicationsTotalPages"
          show-size-picker
          :page-sizes="[10, 25, 50, 100]"
          show-quick-jumper
          @update:current="handlePageChange"
          @update:page-size="handlePageSizeChange"
        />
      </div>
    </div>

    <!-- Rejection Dialog -->
    <n-modal v-model:show="showRejectModal" :mask-closable="false">
      <n-card
        title="Reject Application"
        :bordered="false"
        style="width: 500px; max-width: 90vw"
      >
        <div class="mb-6">
          <n-form-item label="Reason for Rejection">
            <n-input
              v-model:value="rejectionReason"
              type="textarea"
              placeholder="Enter rejection reason (optional)"
              :autosize="{ minRows: 3, maxRows: 6 }"
            />
          </n-form-item>
        </div>

        <template #footer>
          <div class="flex flex-col sm:flex-row gap-3 justify-end">
            <n-button
              :disabled="isDeletingApplication === currentApplicationId"
              @click="showRejectModal = false"
            >
              Cancel
            </n-button>
            <n-button
              type="error"
              :loading="isDeletingApplication === currentApplicationId"
              :disabled="isDeletingApplication === currentApplicationId"
              @click="confirmReject"
            >
              Confirm Rejection
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ApplicationStatus } from '~/enums/application-status.enum';
import { useOnboardingStore } from '~/stores/onboarding';
import { useSuperAdminStore } from '~/stores/super-admin';
import { useNotification } from 'naive-ui';

// Stores
const onboardingStore = useOnboardingStore();
const superAdminStore = useSuperAdminStore();
const notification = useNotification();

// Search and filters
const searchQuery = ref('');
const selectedSchool = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);

// Loading states for individual operations
const isApprovingApplication = ref<string | null>(null);
const isDeletingApplication = ref<string | null>(null);

// Status options for filter
const statusOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Denied', value: 'Denied' },
];

// Compute unique schools for the filter dropdown - IMPROVED with robust safety checks
const schoolOptions = computed(() => {
  try {
    const applications = onboardingStore.applications;

    // Ensure applications is an array and not empty
    if (!Array.isArray(applications) || applications.length === 0) {
      return [];
    }

    // Extract school names with proper validation
    const schoolNames = applications
      .filter((app) => app && app.institution && app.institution.name)
      .map((app) => app.institution.name);

    // Create unique set and convert to options
    const uniqueSchools = [...new Set(schoolNames)];

    return uniqueSchools.map((school) => ({
      label: school,
      value: school,
    }));
  } catch (error) {
    console.warn('Error computing school options:', error);
    return [];
  }
});

// Status counts - IMPROVED with robust safety checks and null coalescing
const pendingCount = computed(() => {
  try {
    const applications = onboardingStore.applications;
    if (!Array.isArray(applications)) return 0;

    return applications.filter(
      (app) => app && app.status === ApplicationStatus.Pending
    ).length;
  } catch (error) {
    console.warn('Error computing pending count:', error);
    return 0;
  }
});

const approvedCount = computed(() => {
  try {
    const applications = onboardingStore.applications;
    if (!Array.isArray(applications)) return 0;

    return applications.filter(
      (app) => app && app.status === ApplicationStatus.Approved
    ).length;
  } catch (error) {
    console.warn('Error computing approved count:', error);
    return 0;
  }
});

const rejectedCount = computed(() => {
  try {
    const applications = onboardingStore.applications;
    if (!Array.isArray(applications)) return 0;

    return applications.filter(
      (app) => app && app.status === ApplicationStatus.Denied
    ).length;
  } catch (error) {
    console.warn('Error computing rejected count:', error);
    return 0;
  }
});

// Filtered applications based on search and filters - IMPROVED with robust safety checks
const filteredApplications = computed(() => {
  try {
    const applications = onboardingStore.applications;
    if (!Array.isArray(applications)) return [];

    return applications.filter((app) => {
      // Ensure app exists and has required properties
      if (!app || !app.institution) return false;

      // Build search fields array with null checks
      const searchFields = [
        app.firstName || '',
        app.lastName || '',
        app.email || '',
        app.phone || '',
        app.code || '',
        app.institution.name || '',
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch = searchQuery.value
        ? searchFields.includes(searchQuery.value.toLowerCase())
        : true;

      const matchesSchool = selectedSchool.value
        ? app.institution.name === selectedSchool.value
        : true;

      const matchesStatus = selectedStatus.value
        ? app.status === selectedStatus.value
        : true;

      return matchesSearch && matchesSchool && matchesStatus;
    });
  } catch (error) {
    console.warn('Error filtering applications:', error);
    return [];
  }
});

// Rejection modal
const showRejectModal = ref(false);
const rejectionReason = ref('');
const currentApplicationId = ref<string | null>(null);

// Pagination methods
const handlePageChange = (page: number) => {
  onboardingStore.setApplicationsPage(page);
};

const handlePageSizeChange = (pageSize: number) => {
  onboardingStore.setApplicationsPageSize(pageSize);
  onboardingStore.setApplicationsPage(1); // Reset to first page
};

// Methods
const confirmReject = async () => {
  if (!currentApplicationId.value) return;

  try {
    isDeletingApplication.value = currentApplicationId.value;
    await onboardingStore.deleteApplication(currentApplicationId.value);

    showRejectModal.value = false;
    rejectionReason.value = '';

    notification.success({
      title: 'Application Rejected',
      description:
        'The application has been successfully rejected and the applicant has been notified.',
      duration: 4000,
    });

    // Refresh data
    superAdminStore.refreshData('pending-applications');
    await onboardingStore.getApplications();
  } catch (error: any) {
    console.error('Error rejecting application:', error);

    const errorMessage = onboardingStore.extractErrorMessage(error);

    if (error?.status === 404) {
      notification.error({
        title: 'Application Not Found',
        description:
          'The application you are trying to reject no longer exists.',
        duration: 5000,
      });
    } else if (error?.status === 409) {
      notification.error({
        title: 'Cannot Reject Application',
        description:
          'This application cannot be rejected in its current state.',
        duration: 5000,
      });
    } else {
      notification.error({
        title: 'Rejection Failed',
        description:
          errorMessage || 'Failed to reject the application. Please try again.',
        duration: 5000,
      });
    }
  } finally {
    isDeletingApplication.value = null;
  }
};

const showRejectDialog = (id: string) => {
  currentApplicationId.value = id;
  rejectionReason.value = '';
  showRejectModal.value = true;
};

const approveApplication = async (applicationId: string) => {
  if (!applicationId) return;

  try {
    const applications = onboardingStore.applications;
    const currentApplication = Array.isArray(applications)
      ? applications.find((a) => a && a.id === applicationId)
      : null;

    if (!currentApplication) return;

    isApprovingApplication.value = applicationId;
    await onboardingStore.approveApplication(applicationId);

    notification.success({
      title: 'Application Approved',
      description: `${currentApplication.firstName} ${currentApplication.lastName}'s application has been approved successfully.`,
      duration: 4000,
    });

    // Refresh data
    superAdminStore.refreshData('pending-applications');
    await onboardingStore.getApplications();
  } catch (error: any) {
    console.error('Error approving application:', error);

    const errorMessage = onboardingStore.extractErrorMessage(error);

    if (error?.status === 404) {
      notification.error({
        title: 'Application Not Found',
        description:
          'The application you are trying to approve no longer exists.',
        duration: 5000,
      });
    } else if (error?.status === 409) {
      notification.error({
        title: 'Cannot Approve Application',
        description:
          'This application cannot be approved in its current state.',
        duration: 5000,
      });
    } else {
      notification.error({
        title: 'Approval Failed',
        description:
          errorMessage ||
          'Failed to approve the application. Please try again.',
        duration: 5000,
      });
    }
  } finally {
    isApprovingApplication.value = null;
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await onboardingStore.getApplications();
  } catch (error) {
    console.error('Error loading applications on mount:', error);
  }
});

// Watch for changes to force refresh data when tab is activated
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => props.active,
  (isActive) => {
    if (isActive) {
      try {
        onboardingStore.getApplications();
      } catch (error) {
        console.error(
          'Error refreshing applications when tab activated:',
          error
        );
      }
    }
  }
);

// Watch for pagination changes to refetch data
watch(
  [
    () => onboardingStore.applicationsPage,
    () => onboardingStore.applicationsPageSize,
  ],
  () => {
    try {
      onboardingStore.getApplications();
    } catch (error) {
      console.error(
        'Error refreshing applications on pagination change:',
        error
      );
    }
  }
);
</script>
