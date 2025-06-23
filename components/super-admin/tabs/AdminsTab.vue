<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <div>
        <h3 class="text-lg font-medium">Administrators</h3>
        <p class="text-text-secondary text-sm">
          Manage system and institution administrators
        </p>
      </div>
      <div class="flex gap-2">
        <n-input-group>
          <n-input
            v-model:value="searchQuery"
            placeholder="Search administrators..."
          >
            <template #prefix>
              <Icon name="ph:magnifying-glass" />
            </template>
          </n-input>
          <n-button type="primary" @click="handleSearch"> Search </n-button>
        </n-input-group>
        <n-button type="primary" @click="showCreateModal = true">
          <div class="flex items-center gap-1">
            <Icon name="ph:plus" />
            <span>Add</span>
          </div>
        </n-button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-4 flex flex-wrap gap-2">
      <n-select
        v-model:value="filters.institutionId"
        placeholder="Institution"
        :options="institutionOptions"
        clearable
        style="width: 200px"
      />
      <n-button quaternary @click="resetFilters">
        <div class="flex items-center gap-1">
          <Icon name="ph:x" />
          <span>Clear Filters</span>
        </div>
      </n-button>
    </div>

    <!-- Data Table -->
    <n-data-table
      :columns="columns"
      :data="filteredAdmins"
      :pagination="pagination"
      :loading="loading"
      :row-key="rowKey"
      striped
      @update:sorter="handleSorterChange"
      @update:filters="handleFiltersChange"
    />

    <!-- Create Admin Modal -->
    <n-modal v-model:show="showCreateModal" :mask-closable="false">
      <n-card
        style="width: 90vw; max-width: 600px"
        title="Create Administrator"
        :bordered="false"
        size="huge"
      >
        <CreateAdminForm
          @submit="handleCreateSubmit"
          @cancel="showCreateModal = false"
        />
      </n-card>
    </n-modal>

    <!-- View/Edit Admin Modal -->
    <n-modal v-model:show="showViewModal" :mask-closable="false">
      <n-card
        style="width: 90vw; max-width: 600px"
        :title="editMode ? 'Edit Administrator' : 'Administrator Details'"
        :bordered="false"
        size="huge"
      >
        <!-- View content -->
        <div v-if="!editMode">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col">
              <span class="text-text-secondary text-sm">First Name</span>
              <span class="font-medium">{{ selectedAdmin?.firstName }}</span>
            </div>

            <div class="flex flex-col">
              <span class="text-text-secondary text-sm">Last Name</span>
              <span class="font-medium">{{ selectedAdmin?.lastName }}</span>
            </div>

            <div class="flex flex-col">
              <span class="text-text-secondary text-sm">Email</span>
              <span class="font-medium">{{ selectedAdmin?.email }}</span>
            </div>

            <div class="flex flex-col">
              <span class="text-text-secondary text-sm">Position</span>
              <span class="font-medium">{{
                selectedAdmin?.position || '—'
              }}</span>
            </div>

            <div class="flex flex-col">
              <span class="text-text-secondary text-sm">Department</span>
              <span class="font-medium">{{
                selectedAdmin?.department || '—'
              }}</span>
            </div>

            <div class="flex flex-col">
              <span class="text-text-secondary text-sm">Institution</span>
              <span class="font-medium">{{
                institutionStore.activeInstitution?.name || '—'
              }}</span>
            </div>
          </div>
        </div>

        <!-- Edit form would go here -->
        <div v-else>
          <p class="text-text-secondary p-4 text-center">
            Editing is not yet implemented.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showViewModal = false">Close</n-button>
            <n-button v-if="!editMode" type="primary" @click="editMode = true"
              >Edit</n-button
            >
            <template v-else>
              <n-button @click="cancelEdit">Cancel</n-button>
              <n-button type="primary" @click="handleUpdate"
                >Save Changes</n-button
              >
            </template>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- Delete Confirmation Modal -->
    <n-modal v-model:show="showDeleteModal" :mask-closable="false">
      <n-card
        style="width: 90vw; max-width: 400px"
        title="Confirm Deletion"
        :bordered="false"
      >
        <div class="flex flex-col gap-4">
          <n-alert type="error">
            <div class="flex items-center gap-2">
              <Icon name="ph:warning-circle" />
              <span>This action cannot be undone!</span>
            </div>
          </n-alert>

          <p>
            Are you sure you want to delete administrator
            <strong
              >{{ selectedAdmin?.firstName }}
              {{ selectedAdmin?.lastName }}</strong
            >?
          </p>

          <n-input
            v-model:value="deleteConfirmation"
            placeholder="Type 'DELETE' to confirm"
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showDeleteModal = false">Cancel</n-button>
            <n-button
              type="error"
              :disabled="deleteConfirmation !== 'DELETE'"
              @click="handleDelete"
            >
              Delete Permanently
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, h, onMounted, watch } from 'vue';
import {
  NButton,
  NCard,
  NDataTable,
  NInput,
  NInputGroup,
  NSelect,
  NModal,
  NAlert,
} from 'naive-ui';
import { useSuperAdminStore } from '~/stores/super-admin';
import type { AdminDto } from '~/interfaces/admin.dto';
// import { AdminRole } from '~/enums/admin-role.enum';
// import { AdminStatus } from '~/enums/admin-status.enum';
// import CreateAdminForm from '../forms/CreateAdminForm.vue';

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});

// Store and initial data loading
const superAdminStore = useSuperAdminStore();
const institutionStore = useInstitutionStore();
const loading = ref(false);
const admins = ref<AdminDto[]>([]);

// Search and filters
const searchQuery = ref('');
const filters = reactive({
  role: null,
  status: null,
  institutionId: null,
});

// Form state
const showCreateModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const editMode = ref(false);
const selectedAdmin = ref<AdminDto | null>(null);
const deleteConfirmation = ref('');

// Table pagination
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onPageSizeChange: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
});

// Row key function for data table
const rowKey = (row: { id: any; }) => row.id;

const institutionOptions = computed(() => {
  return superAdminStore.institutions.map(
    (institution: { name: any; id: any }) => ({
      label: institution.name,
      value: institution.id,
    })
  );
});

// Table columns
const columns = [
  {
    title: 'Name',
    key: 'name',
    sorter: 'default',
    render: (row: AdminDto) => {
      return h(
        'div',
        {
          class: 'cursor-pointer text-primary hover:underline',
          onClick: () => viewAdmin(row),
        },
        `${row.firstName} ${row.lastName}`
      );
    },
  },
  {
    title: 'Email',
    key: 'email',
  },
  {
    title: 'Position',
    key: 'position',
  },
  {
    title: 'Institution',
    key: 'institutionName',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (row: AdminDto) => {
      return h('div', { class: 'flex gap-2' }, [
        h(
          NButton,
          {
            size: 'small',
            quaternary: true,
            onClick: () => viewAdmin(row),
          },
          { default: () => 'View' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            quaternary: true,
            onClick: () => editAdmin(row),
          },
          { default: () => 'Edit' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            quaternary: true,
            onClick: () => confirmDeleteAdmin(row),
          },
          { default: () => 'Delete' }
        ),
      ]);
    },
  },
];

// Computed properties
const filteredAdmins = computed(() => {
  let result = [...admins.value];

  // Apply text search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (admin) =>
        admin.firstName?.toLowerCase().includes(query) ||
        admin.lastName?.toLowerCase().includes(query) ||
        admin.email?.toLowerCase().includes(query) ||
        admin.position?.toLowerCase().includes(query) ||
        admin.department?.toLowerCase().includes(query)
    );
  }

  // Apply institution filter
  if (filters.institutionId) {
    result = result.filter(
      (admin) => admin.institutionId === filters.institutionId
    );
  }

  return result;
});

// Methods
const handleSearch = () => {
  // This function can be expanded if needed, currently the filteredAdmins
  // computed property handles the filtering reactively
};

const resetFilters = () => {
  searchQuery.value = '';
  filters.role = null;
  filters.status = null;
  filters.institutionId = null;
};

const handleSorterChange = (_sorter: any) => {
  // Implement sorting logic
};

const handleFiltersChange = (_filters: any) => {
  // Implement additional filtering logic if needed
};

const viewAdmin = (admin: AdminDto) => {
  selectedAdmin.value = admin;
  editMode.value = false;
  showViewModal.value = true;
};

const editAdmin = (admin: AdminDto) => {
  viewAdmin(admin);
  editMode.value = true;
};

const confirmDeleteAdmin = (admin: AdminDto) => {
  selectedAdmin.value = admin;
  showDeleteModal.value = true;
};

const cancelEdit = () => {
  editMode.value = false;
};

const handleCreateSubmit = async (data: any) => {
  try {
    loading.value = true;
    await superAdminStore.createAdmin(data);
    showCreateModal.value = false;

    // Refresh admins list
    await fetchAdmins();

    return true;
  } catch (error) {
    console.error('Error creating administrator:', error);
    return false;
  } finally {
    loading.value = false;
  }
};

const handleUpdate = async () => {
  editMode.value = false;
};

const handleDelete = async () => {
  if (!selectedAdmin.value || deleteConfirmation.value !== 'DELETE') return;

  try {
    loading.value = true;
    await superAdminStore.removeAdmin(selectedAdmin.value.id);

    // Close modals and reset
    showDeleteModal.value = false;
    showViewModal.value = false;
    deleteConfirmation.value = '';

    // Refresh admins list
    await fetchAdmins();
  } catch (error) {
    console.error('Error deleting administrator:', error);
  } finally {
    loading.value = false;
  }
};

const fetchAdmins = async () => {
  loading.value = true;
  try {
    const results = await superAdminStore.fetchAdmins();
    admins.value = results;
  } catch (error) {
    console.error('Error fetching administrators:', error);
  } finally {
    loading.value = false;
  }
};

// Fetch data on component mount or when activated
onMounted(async () => {
  if (props.active) {
    await fetchAdmins();
    // Also ensure we have institutions for the dropdown
    if (superAdminStore.institutions.length === 0) {
      await superAdminStore.fetchInstitutions();
    }
  }
});

// Watch for active state changes
watch(
  () => props.active,
  async (isActive) => {
    if (isActive && admins.value.length === 0) {
      await fetchAdmins();
      // Also ensure we have institutions for the dropdown
      if (superAdminStore.institutions.length === 0) {
        await superAdminStore.fetchInstitutions();
      }
    }
  }
);
</script>
