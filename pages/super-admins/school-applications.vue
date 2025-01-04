<template>
  <div class="min-h-screen bg-[#101014] text-white relative">
    <!-- Content wrapper -->
    <div class="relative z-10">
      <!-- Header Section -->
      <div class="py-8">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <h1
              class="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text mb-4"
            >
              Applications
            </h1>
            <p class="text-gray-400">Review and manage student applications</p>
          </div>
        </div>
      </div>

      <!-- Filters and Search Section -->
      <div class="py-4">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            class="flex flex-col sm:flex-row gap-4 justify-between items-center"
          >
            <!-- Search -->
            <n-input-group>
              <n-input
                v-model:value="searchQuery"
                placeholder="Search applications..."
                class="min-w-[300px]"
              >
                <template #prefix>
                  <Icon name="ph:magnifying-glass" class="text-gray-400" />
                </template>
              </n-input>
            </n-input-group>

            <!-- Filter by School -->
            <n-select
              v-model:value="selectedSchool"
              :options="schoolOptions"
              placeholder="Filter by school"
              class="min-w-[200px]"
            />
          </div>
        </div>
      </div>

      <!-- Applications List -->
      <div class="py-8">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="space-y-4">
            <!-- Application Card -->
            <div
              v-for="application in filteredApplications"
              :key="application.id"
              class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 group hover:border-emerald-400/50 transition-all duration-300"
            >
              <div class="flex flex-col sm:flex-row justify-between gap-6">
                <!-- Application Info -->
                <div class="flex-1 space-y-4">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-xl font-semibold text-white">
                        {{ application.firstName }} {{ application.lastName }}
                      </h3>
                      <div class="space-y-1">
                        <p class="text-gray-400">{{ application.email }}</p>
                        <p class="text-gray-400">{{ application.phone }}</p>
                        <p class="text-gray-400">
                          Code: {{ application.code }}
                        </p>
                      </div>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                      <n-tag :bordered="false" type="info" size="small">
                        ID: {{ application.id.slice(0, 8) }}
                      </n-tag>
                      <n-tag :bordered="false" type="warning" size="small">
                        School ID: {{ application.schoolId.slice(0, 8) }}
                      </n-tag>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 text-gray-400">
                    <Icon name="ph:buildings" />
                    <span>{{ application.schoolName }}</span>
                  </div>

                  <div class="flex items-center gap-2 text-gray-400">
                    <Icon name="ph:map-pin" />
                    <span>
                      {{ application.address.street }},
                      {{ application.address.settlement }},
                      {{ application.address.postalCode }},
                      {{ application.address.country }}
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-3 sm:flex-col lg:flex-row">
                  <n-button
                    v-if="application.status === 0"
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
                    v-if="application.status === 0"
                    type="error"
                    class="flex-1"
                    @click="showRejectDialog(application.id)"
                  >
                    <template #icon>
                      <Icon name="ph:x-bold" />
                    </template>
                    Reject
                  </n-button>
                  <n-tag
                    v-if="application.status === 1"
                    type="success"
                    :bordered="false"
                    >Approved</n-tag
                  >
                  <n-tag
                    v-if="application.status === 2"
                    type="error"
                    :bordered="false"
                    >Rejected</n-tag
                  >
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="filteredApplications?.length === 0"
              class="bg-[#18181c]/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12 text-center"
            >
              <Icon
                name="ph:folder-simple"
                class="text-gray-400 text-5xl mb-4"
              />
              <h3 class="text-xl font-semibold text-gray-400 mb-2">
                No Applications Found
              </h3>
              <p class="text-gray-500">Try adjusting your search or filters</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rejection Dialog -->
    <n-modal
      v-model:show="showRejectModal"
      size="medium"
      :mask-closable="false"
      class="w-[90vw] max-w-xl h-auto max-h-[80vh]"
    >
      <div
        class="bg-[#18181c] border border-gray-700/50 rounded-xl p-6 text-white"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="text-xl font-semibold">Reject Application</div>
          <n-button text type="error" @click="showRejectModal = false">
            <Icon name="ph:x-bold" class="text-2xl" />
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

        <div class="flex justify-end gap-4">
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
import { useSchoolOnboardingStore } from '#imports';
// Stores
const schoolOnboardingStore = useSchoolOnboardingStore();

// Search and filters
const searchQuery = ref('');
const selectedSchool = ref(null);

// Compute unique schools for the filter dropdown
const schoolOptions = computed(() => {
  const uniqueSchools = new Set(
    schoolOnboardingStore.applications?.map((app) => app.schoolName)
  );
  return Array.from(uniqueSchools).map((school) => ({
    label: school,
    value: school,
  }));
});

// Filtered applications based on search and school filter
const filteredApplications = computed(() => {
  return schoolOnboardingStore.applications?.filter((app) => {
    const searchFields = [
      app.firstName,
      app.lastName,
      app.email,
      app.phone,
      app.code,
      app.schoolName,
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch = searchQuery.value
      ? searchFields.includes(searchQuery.value.toLowerCase())
      : true;

    const matchesSchool = selectedSchool.value
      ? app.schoolName === selectedSchool.value
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
    schoolOnboardingStore.deleteApplication(currentApplicationId.value);
    showRejectModal.value = false;
    schoolOnboardingStore.getSchoolApplications();
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
    const currentApplication = schoolOnboardingStore.applications?.find(
      (a) => a.id === applicationId
    );
    if (!currentApplication) return;
    console.log(currentApplication);
    await schoolOnboardingStore.approveApplication(applicationId);

    await schoolOnboardingStore.getSchoolApplications();
  } catch (error) {
    console.error('Error approving application:', error);
  }
};

// Lifecycle
onMounted(() => {
  schoolOnboardingStore.getSchoolApplications();
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
</style>
