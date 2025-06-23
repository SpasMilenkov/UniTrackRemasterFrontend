<!-- components/admin/UserManagementTab.vue -->
<template>
  <div class="py-6 px-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white"
        >
          <Icon name="ph:users" class="text-xl" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0">
            User Management
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage all system users and their permissions
          </p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="flex items-center gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">
            {{ totalUsersCount }}
          </div>
          <div class="text-xs text-gray-500">Total Users</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ activeUsersCount }}
          </div>
          <div class="text-xs text-gray-500">Active</div>
        </div>
      </div>
    </div>

    <!-- User Table Component -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <UserTable :active="true" @user-created="handleUserCreated" />
    </div>

    <!-- Create User Modal -->
    <n-modal
      v-model:show="showCreateUserModal"
      preset="card"
      style="width: 60rem; max-height: 90vh"
      title="Create New User"
      :closable="!submittingUser"
      :mask-closable="!submittingUser"
    >
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <UserForm
          :loading="submittingUser"
          :initial-values="userFormData"
          :is-editing="false"
          @submit="handleSubmitUser"
          @cancel="handleCancelUser"
        />
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { NButton, NModal, useMessage } from 'naive-ui';
import { Icon } from '#components';
import { useUserStore } from '~/stores/user';
import { useSuperAdminStore } from '~/stores/super-admin';
import UserTable from '../tables/UserTable.vue';

// Stores and utilities
const userStore = useUserStore();
const superAdminStore = useSuperAdminStore();
const message = useMessage();

// Modal and form state
const showCreateUserModal = ref(false);
const submittingUser = ref(false);
const userFormData = ref({});

// Computed properties for stats
const totalUsersCount = computed(() => {
  const paginationMeta = userStore.getPaginationMetadata;
  return paginationMeta?.totalCount || 0;
});

const activeUsersCount = computed(() => {
  const users = userStore.getPaginatedUsers?.users || [];
  return users.filter((user) => user.isLinked).length;
});


function handleCancelUser() {
  showCreateUserModal.value = false;
  userFormData.value = {};
}

async function handleSubmitUser(validatedData: any) {
  try {
    submittingUser.value = true;

    // Use the appropriate creation method based on role
    switch (validatedData.role) {
      case 'Admin':
      case 'SuperAdmin':
        await superAdminStore.createAdmin(validatedData);
        break;
      case 'Teacher':
        // You could add teacher creation logic here if available
        message.warning('Teacher creation via SuperAdmin not implemented yet');
        return;
      case 'Student':
        // You could add student creation logic here if available
        message.warning('Student creation via SuperAdmin not implemented yet');
        return;
      default:
        message.warning(
          `User creation for role "${validatedData.role}" not implemented`
        );
        return;
    }

    message.success('User created successfully');
    showCreateUserModal.value = false;

    // Trigger refresh of user table
    window.dispatchEvent(new Event('refresh-user-table'));
  } catch (error: any) {
    message.error(`Failed to create user: ${error.message}`);
  } finally {
    submittingUser.value = false;
  }
}

function handleUserCreated() {
  // This can be used for any additional logic after user creation
  message.success('User management updated');
}

// Initialize on mount
onMounted(async () => {
  // Initialize superadmin store if needed
  if (!superAdminStore.institutions.length) {
    await superAdminStore.initializeDashboard();
  }
});
</script>
