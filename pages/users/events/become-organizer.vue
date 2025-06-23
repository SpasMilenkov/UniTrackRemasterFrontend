<template>
  <div class="min-h-screen bg-background">
    <!-- Header Section -->
    <div class="border-b border-border bg-background-card">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg"
              >
                <Icon name="ph:crown" class="text-2xl" />
              </div>
              <div>
                <h1 class="text-3xl font-bold text-text-primary m-0">
                  Event Organizer
                </h1>
                <p class="text-lg text-text-secondary mt-1">
                  Request permission to create and manage events at your
                  institution
                </p>
              </div>
            </div>
            <!-- Back Button -->
            <n-button quaternary size="large" @click="$router.push('/users/events')">
              <template #icon>
                <Icon name="ph:arrow-left" />
              </template>
              Back to Events
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isCheckingStatus" class="flex justify-center py-16">
        <n-spin size="large">
          <div class="text-center">
            <p class="text-text-secondary mt-4">
              Checking your organizer status...
            </p>
          </div>
        </n-spin>
      </div>

      <!-- Already an Organizer - Success State -->
      <div v-else-if="currentOrganizerProfile" class="space-y-8">
        <!-- Status Banner -->
        <n-alert type="success" class="!bg-green-500/10 !border-green-500/20">
          <template #icon>
            <Icon name="ph:crown" class="text-green-500" />
          </template>
          <div class="flex flex-col gap-2">
            <div
              class="text-lg font-semibold text-green-600 dark:text-green-400"
            >
              Congratulations! You're an Event Organizer
            </div>
            <div class="text-green-600/80 dark:text-green-400/80">
              You have full access to create and manage events at your
              institution
            </div>
          </div>
        </n-alert>

        <!-- Organizer Profile Card -->
        <n-card title="Your Organizer Profile" class="shadow-sm">
          <template #header-extra>
            <n-button quaternary circle @click="showEditProfile = true">
              <template #icon>
                <Icon name="ph:pencil" />
              </template>
            </n-button>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Profile Info -->
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-text-secondary"
                  >Name</label
                >
                <p class="font-semibold text-text-primary">
                  {{ currentOrganizerProfile.userName }}
                </p>
              </div>

              <div>
                <label class="text-sm font-medium text-text-secondary"
                  >Institution</label
                >
                <p class="text-text-primary">
                  {{
                    currentOrganizerProfile.institutionName || 'Not specified'
                  }}
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-text-secondary"
                  >Department</label
                >
                <p class="text-text-primary">
                  {{ currentOrganizerProfile.department || 'Not specified' }}
                </p>
              </div>

              <div>
                <label class="text-sm font-medium text-text-secondary"
                  >Role</label
                >
                <p class="text-text-primary">
                  {{ currentOrganizerProfile.role || 'Not specified' }}
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-text-secondary"
                  >Events Created</label
                >
                <p class="text-2xl font-bold text-primary">
                  {{ currentOrganizerProfile.organizedEventsCount || 0 }}
                </p>
              </div>

              <div>
                <label class="text-sm font-medium text-text-secondary"
                  >Public Events</label
                >
                <n-tag
                  :type="
                    currentOrganizerProfile.canCreatePublicEvents
                      ? 'success'
                      : 'warning'
                  "
                  size="small"
                >
                  {{
                    currentOrganizerProfile.canCreatePublicEvents
                      ? 'Allowed'
                      : 'Not Allowed'
                  }}
                </n-tag>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-text-secondary"
                  >Member Since</label
                >
                <p class="text-text-primary">
                  {{ formatDate(currentOrganizerProfile.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </n-card>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <n-card
            class="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1"
            @click="$router.push('/users/events/create')"
          >
            <div class="text-center space-y-4">
              <div
                class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto"
              >
                <Icon name="ph:plus" class="text-xl text-primary" />
              </div>
              <div>
                <h3 class="font-semibold text-text-primary">
                  Create New Event
                </h3>
                <p class="text-sm text-text-secondary">
                  Start organizing your next event
                </p>
              </div>
            </div>
          </n-card>

          <n-card
            class="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1"
            @click="$router.push('/users/events/my-organized')"
          >
            <div class="text-center space-y-4">
              <div
                class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto"
              >
                <Icon name="ph:calendar" class="text-xl text-secondary" />
              </div>
              <div>
                <h3 class="font-semibold text-text-primary">Manage Events</h3>
                <p class="text-sm text-text-secondary">
                  View and edit your existing events
                </p>
              </div>
            </div>
          </n-card>

          <n-card
            class="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1"
            @click="$router.push('/users/events')"
          >
            <div class="text-center space-y-4">
              <div
                class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto"
              >
                <Icon
                  name="ph:magnifying-glass"
                  class="text-xl text-green-500"
                />
              </div>
              <div>
                <h3 class="font-semibold text-text-primary">Browse Events</h3>
                <p class="text-sm text-text-secondary">
                  Explore all available events
                </p>
              </div>
            </div>
          </n-card>
        </div>
      </div>

      <!-- Request Organizer Access -->
      <div v-else class="space-y-8">
        <!-- Benefits Section -->
        <n-card title="Why Become an Event Organizer?">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center space-y-4">
              <div
                class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"
              >
                <Icon name="ph:calendar-plus" class="text-2xl text-primary" />
              </div>
              <div>
                <h3 class="font-semibold text-text-primary mb-2">
                  Create Events
                </h3>
                <p class="text-text-secondary text-sm">
                  Host workshops, seminars, conferences, meetings and social
                  gatherings for your community
                </p>
              </div>
            </div>

            <div class="text-center space-y-4">
              <div
                class="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"
              >
                <Icon name="ph:users-three" class="text-2xl text-secondary" />
              </div>
              <div>
                <h3 class="font-semibold text-text-primary mb-2">
                  Manage Participants
                </h3>
                <p class="text-text-secondary text-sm">
                  Track RSVPs, manage attendance, and engage with your event
                  participants effectively
                </p>
              </div>
            </div>

            <div class="text-center space-y-4">
              <div
                class="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto"
              >
                <Icon name="ph:chart-line" class="text-2xl text-green-500" />
              </div>
              <div>
                <h3 class="font-semibold text-text-primary mb-2">
                  Event Analytics
                </h3>
                <p class="text-text-secondary text-sm">
                  Get detailed insights on attendance, engagement, and event
                  performance metrics
                </p>
              </div>
            </div>
          </div>
        </n-card>

        <!-- Application Form -->
        <n-card title="Request Organizer Access">
          <template #header-extra>
            <n-tag type="info" size="small">
              <Icon name="ph:info" class="mr-1" />
              All fields are optional except role
            </n-tag>
          </template>

          <n-form
            ref="formRef"
            :model="requestForm"
            :rules="formRules"
            label-placement="top"
            size="large"
            @submit.prevent="submitRequest"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-6">
                <!-- Role Selection -->
                <n-form-item label="Your Role/Position" path="role">
                  <n-select
                    v-model:value="requestForm.role"
                    placeholder="Select your role at the institution"
                    :options="roleOptions"
                    clearable
                  >
                    <template #prefix>
                      <Icon name="ph:identification-card" />
                    </template>
                  </n-select>
                </n-form-item>

                <!-- Department (Optional) -->
                <n-form-item label="Department (Optional)" path="department">
                  <n-input
                    v-model:value="requestForm.department"
                    placeholder="e.g., Computer Science, Mathematics, Engineering"
                    clearable
                  >
                    <template #prefix>
                      <Icon name="ph:buildings" />
                    </template>
                  </n-input>
                </n-form-item>

                <!-- Institution Display -->
                <n-form-item label="Institution">
                  <n-input
                    :value="
                      user?.activeInstitution?.name || 'No institution selected'
                    "
                    readonly
                    :status="user?.activeInstitution ? 'success' : 'warning'"
                  >
                    <template #prefix>
                      <Icon name="ph:university" />
                    </template>
                  </n-input>
                </n-form-item>
              </div>

              <!-- Right Column -->
              <div class="space-y-6">
                <!-- Public Events Permission -->
                <n-form-item>
                  <n-checkbox
                    v-model:checked="requestForm.canCreatePublicEvents"
                    size="large"
                  >
                    <div class="ml-2">
                      <div class="font-medium">
                        Request Public Event Permission
                      </div>
                      <div class="text-sm text-text-secondary">
                        Allow creating events visible to all institutions
                      </div>
                    </div>
                  </n-checkbox>
                </n-form-item>

                <!-- Justification -->
                <n-form-item
                  label="Reason for Request (Optional)"
                  path="justification"
                >
                  <n-input
                    v-model:value="requestForm.justification"
                    type="textarea"
                    placeholder="Briefly explain why you need organizer access and how you plan to use it..."
                    :rows="6"
                    show-count
                    maxlength="500"
                  />
                </n-form-item>
              </div>
            </div>

            <!-- Error Display -->
            <n-alert
              v-if="errorMessage"
              type="error"
              :title="errorMessage"
              class="mt-6"
            />

            <!-- Submit Section -->
            <div class="flex justify-end mt-8 pt-6 border-t border-border">
              <n-space>
                <n-button size="large" @click="$router.push('/users/events')">
                  Cancel
                </n-button>
                <n-button
                  type="primary"
                  size="large"
                  :loading="isSubmitting"
                  :disabled="!requestForm.role"
                  attr-type="submit"
                >
                  <template #icon>
                    <Icon name="ph:paper-plane-tilt" />
                  </template>
                  Submit Request
                </n-button>
              </n-space>
            </div>
          </n-form>
        </n-card>

        <!-- Process Information -->
        <n-card title="What Happens Next?">
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              >
                <span class="text-primary text-sm font-bold">1</span>
              </div>
              <div>
                <h4 class="font-medium text-text-primary mb-1">
                  Application Review
                </h4>
                <p class="text-text-secondary text-sm">
                  Your request will be reviewed by institution administrators
                  within 1-3 business days
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              >
                <span class="text-primary text-sm font-bold">2</span>
              </div>
              <div>
                <h4 class="font-medium text-text-primary mb-1">
                  Email Notification
                </h4>
                <p class="text-text-secondary text-sm">
                  You'll receive an email notification with the decision and any
                  additional instructions
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              >
                <span class="text-primary text-sm font-bold">3</span>
              </div>
              <div>
                <h4 class="font-medium text-text-primary mb-1">
                  Start Organizing
                </h4>
                <p class="text-text-secondary text-sm">
                  If approved, you can immediately start creating and managing
                  events for your institution
                </p>
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <n-modal
      v-model:show="showEditProfile"
      preset="card"
      style="width: 500px"
      title="Edit Organizer Profile"
      :closable="!isUpdating"
      :mask-closable="!isUpdating"
    >
      <n-form
        ref="editFormRef"
        :model="editForm"
        label-placement="top"
        size="medium"
        @submit.prevent="updateProfile"
      >
        <n-form-item label="Department">
          <n-input
            v-model:value="editForm.department"
            placeholder="Your department"
            clearable
          />
        </n-form-item>

        <n-form-item label="Role">
          <n-input
            v-model:value="editForm.role"
            placeholder="Your role/position"
            clearable
          />
        </n-form-item>

        <div class="flex justify-end gap-3 mt-6">
          <n-button :disabled="isUpdating" @click="showEditProfile = false">
            Cancel
          </n-button>
          <n-button type="primary" :loading="isUpdating" attr-type="submit">
            Update Profile
          </n-button>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  NCard,
  NButton,
  NAlert,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NCheckbox,
  NModal,
  NSpace,
  NTag,
  NSpin,
  useMessage,
  type FormRules,
} from 'naive-ui';
import { Icon } from '#components';
import type {
  OrganizerResponseDto,
  CreateOrganizerDto,
} from '~/interfaces/event';
import { useUserStore } from '~/stores/user';

const eventsStore = useEventsStore();
const userStore = useUserStore();
const router = useRouter();
const message = useMessage();

// State
const isCheckingStatus = ref(true);
const currentOrganizerProfile = ref<OrganizerResponseDto | null>(null);
const showEditProfile = ref(false);
const isSubmitting = ref(false);
const isUpdating = ref(false);
const errorMessage = ref('');

// Form refs
const formRef = ref();
const editFormRef = ref();

// Form data
const requestForm = ref({
  department: '',
  role: '',
  canCreatePublicEvents: false,
  justification: '',
});

const editForm = ref({
  department: '',
  role: '',
});

// Computed
const user = computed(() => userStore.userDetails);

// Form options
const roleOptions = [
  { label: 'Professor', value: 'Professor' },
  { label: 'Associate Professor', value: 'Associate Professor' },
  { label: 'Assistant Professor', value: 'Assistant Professor' },
  { label: 'Lecturer', value: 'Lecturer' },
  { label: 'Teaching Assistant', value: 'Teaching Assistant' },
  { label: 'Administrator', value: 'Administrator' },
  { label: 'Staff Member', value: 'Staff' },
  { label: 'Coordinator', value: 'Coordinator' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Other', value: 'Other' },
];

// Form validation rules
const formRules: FormRules = {
  role: [
    {
      required: true,
      message: 'Please select your role',
      trigger: ['blur', 'change'],
    },
  ],
};

// Methods
const checkOrganizerStatus = async () => {
  isCheckingStatus.value = true;
  try {
    const profile = await eventsStore.fetchMyOrganizerProfile();
    currentOrganizerProfile.value = profile;
  } catch (error: any) {
    // Not an organizer yet - this is expected for most users
    if (error.status !== 404) {
      console.error('Error checking organizer status:', error);
    }
  } finally {
    isCheckingStatus.value = false;
  }
};

const submitRequest = async () => {
  if (!user.value?.id) {
    errorMessage.value = 'User information not available';
    return;
  }

  // Validate form
  try {
    await formRef.value?.validate();
  } catch (error) {
    return;
  }

  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    const organizerData: CreateOrganizerDto = {
      userId: user.value.id,
      department: requestForm.value.department || undefined,
      role: requestForm.value.role,
      canCreatePublicEvents: requestForm.value.canCreatePublicEvents,
      institutionId: user.value.institutionId || undefined,
    };

    const profile = await eventsStore.createOrganizerProfile(organizerData);
    currentOrganizerProfile.value = profile;

    message.success('Organizer request submitted successfully!');

    // Redirect after a brief delay
    setTimeout(() => {
      router.push('/users/events');
    }, 2000);
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to submit organizer request';
  } finally {
    isSubmitting.value = false;
  }
};

const updateProfile = async () => {
  if (!currentOrganizerProfile.value) return;

  isUpdating.value = true;
  try {
    // Note: This would need an API endpoint to update organizer profile
    // For now, we'll update the local state
    currentOrganizerProfile.value = {
      ...currentOrganizerProfile.value,
      department: editForm.value.department,
      role: editForm.value.role,
    };

    message.success('Profile updated successfully');
    showEditProfile.value = false;
  } catch (error: any) {
    message.error('Failed to update profile: ' + error.message);
  } finally {
    isUpdating.value = false;
  }
};

const initializeEditForm = () => {
  if (currentOrganizerProfile.value) {
    editForm.value = {
      department: currentOrganizerProfile.value.department || '',
      role: currentOrganizerProfile.value.role || '',
    };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Lifecycle
onMounted(async () => {
  await checkOrganizerStatus();
  initializeEditForm();
});

// Watchers
watch(
  () => showEditProfile.value,
  (show) => {
    if (show) {
      initializeEditForm();
    }
  }
);

// Meta
definePageMeta({
  layout: 'dashboard-layout',
  middleware: 'auth',
});

useHead({
  title: 'Become an Organizer - UniTrack',
});
</script>

<style scoped>
/* Custom hover effects */
.hover\:-translate-y-1:hover {
  transform: translateY(-4px);
}

/* Ensure consistent card heights */
.n-card {
  height: 100%;
}
</style>
