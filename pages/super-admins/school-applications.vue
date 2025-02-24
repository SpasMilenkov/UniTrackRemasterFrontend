<template>
  <div class="min-h-screen bg-[#101014] text-white relative">
    <div class="relative z-10">
      <!-- Header Section -->
      <div class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <h1
              class="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text mb-3"
            >
              Applications
            </h1>
            <p class="text-gray-400 text-sm sm:text-base">
              Review and manage student applications
            </p>
          </div>
        </div>
      </div>

      <!-- Filters and Search Section -->
      <div class="py-4">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            class="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center"
          >
            <n-input-group class="w-full sm:w-auto">
              <n-input
                v-model:value="searchQuery"
                placeholder="Search applications..."
                class="w-full sm:min-w-[300px]"
              >
                <template #prefix>
                  <Icon name="ph:magnifying-glass" class="text-gray-400" />
                </template>
              </n-input>
            </n-input-group>

            <n-select
              v-model:value="selectedSchool"
              :options="schoolOptions"
              placeholder="Filter by school"
              class="w-full sm:w-[200px]"
            />
          </div>
        </div>
      </div>

      <!-- Applications List -->
      <div class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="space-y-4">
            <template
              v-for="application in filteredApplications"
              :key="application.id"
            >
              <div
                class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 group hover:border-emerald-400/50 transition-all duration-300"
              >
                <div class="flex flex-col gap-4">
                  <!-- Top Section: Name, Status, and Tags -->
                  <div class="flex flex-col sm:flex-row justify-between gap-4">
                    <div class="space-y-2">
                      <h3 class="text-lg sm:text-xl font-semibold text-white">
                        {{ application.firstName }} {{ application.lastName }}
                      </h3>
                      <div class="flex flex-col gap-1">
                        <p class="text-gray-400 text-sm">
                          {{ application.email }}
                        </p>
                        <p class="text-gray-400 text-sm">
                          {{ application.phone }}
                        </p>
                        <p class="text-gray-400 text-sm">
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
                    <div class="flex items-center gap-2 text-gray-400 text-sm">
                      <Icon name="ph:buildings" />
                      <span>{{ application.institution.name }}</span>
                    </div>

                    <div class="flex items-start gap-2 text-gray-400 text-sm">
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
                        color="#4ade80"
                        class="flex-1"
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
              v-if="filteredApplications?.length === 0"
              class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 sm:p-12 text-center"
            >
              <Icon
                name="ph:folder-simple"
                class="text-gray-400 text-4xl sm:text-5xl mb-4"
              />
              <h3 class="text-lg sm:text-xl font-semibold text-gray-400 mb-2">
                No Applications Found
              </h3>
              <p class="text-gray-500 text-sm sm:text-base">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rejection Dialog -->
    <n-modal
      v-model:show="showRejectModal"
      :mask-closable="false"
      class="w-[90vw] max-w-xl"
    >
      <div
        class="bg-[#18181c] border border-gray-700/50 rounded-xl p-4 sm:p-6 text-white"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="text-lg sm:text-xl font-semibold">Reject Application</div>
          <n-button text type="error" @click="showRejectModal = false">
            <Icon name="ph:x-bold" class="text-xl sm:text-2xl" />
          </n-button>
        </div>

        <div class="mb-6">
          <label for="rejection-reason" class="block text-gray-400 mb-2"
            >Reason for Rejection</label
          >
          <n-input
            id="rejection-reason"
            v-model:value="rejectionReason"
            type="textarea"
            placeholder="Enter rejection reason"
            class="bg-[#18181c]/80 border border-gray-700/50 rounded-md"
          />
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <n-button class="flex-1" @click="showRejectModal = false">
            Cancel
          </n-button>
          <n-button type="error" class="flex-1" @click="confirmReject">
            Confirm Rejection
          </n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ApplicationStatus } from '~/enums/application-status.enum';
import { useOnboardingStore } from '~/stores/onboarding';

// Stores
const onboardingStore = useOnboardingStore();

// Search and filters
const searchQuery = ref('');
const selectedSchool = ref(null);

// Compute unique schools for the filter dropdown
const schoolOptions = computed(() => {
  const uniqueSchools = new Set(
    onboardingStore.applications?.map((app) => app.institution.name)
  );
  return Array.from(uniqueSchools).map((school) => ({
    label: school,
    value: school,
  }));
});

// Filtered applications based on search and school filter
const filteredApplications = computed(() => {
  return onboardingStore.applications?.filter((app) => {
    const searchFields = [
      app.firstName,
      app.lastName,
      app.email,
      app.phone,
      app.code,
      app.institution.name,
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch = searchQuery.value
      ? searchFields.includes(searchQuery.value.toLowerCase())
      : true;

    const matchesSchool = selectedSchool.value
      ? app.institution.name === selectedSchool.value
      : true;

    return matchesSearch && matchesSchool;
  });
});

// Rejection modal
const showRejectModal = ref(false);
const rejectionReason = ref('');
const currentApplicationId = ref<string | null>(null);

// Methods
const confirmReject = async () => {
  try {
    if (!currentApplicationId.value) return;
    onboardingStore.deleteApplication(currentApplicationId.value);
    showRejectModal.value = false;
    onboardingStore.getApplications();
  } catch (error) {
    console.error('Error rejecting application:', error);
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
    const currentApplication = onboardingStore.applications?.find(
      (a) => a.id === applicationId
    );
    if (!currentApplication) return;
    await onboardingStore.approveApplication(applicationId);

    await onboardingStore.getApplications();
  } catch (error) {
    console.error('Error approving application:', error);
  }
};

// Lifecycle
onMounted(async () => {
  await onboardingStore.getApplications();
});
</script>

<style scoped>
:deep(.n-input) {
  background-color: #1f1f23 !important;
  border-color: rgba(75, 85, 99, 0.5) !important;
}

:deep(.n-input:hover),
:deep(.n-input:focus) {
  border-color: #4ade80 !important;
}

:deep(.n-select) {
  background-color: #1f1f23 !important;
  border-color: rgba(75, 85, 99, 0.5) !important;
}

:deep(.n-button) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.n-tag) {
  display: flex;
  align-items: center;
}
</style>
