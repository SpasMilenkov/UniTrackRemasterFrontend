<!-- components/superadmin/InstitutionsTab.vue -->
<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <div>
        <h3 class="text-lg font-medium">All Institutions</h3>
        <p class="text-text-secondary text-sm">
          Manage institutions across the system
        </p>
      </div>
      <div class="flex gap-2">
        <n-input-group>
          <n-input
            v-model:value="searchQuery"
            placeholder="Search institutions..."
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
        v-model:value="filters.type"
        placeholder="Institution Type"
        :options="typeOptions"
        clearable
        style="width: 200px"
      />
      <n-select
        v-model:value="filters.status"
        placeholder="Status"
        :options="statusOptions"
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
      :data="filteredInstitutions"
      :pagination="pagination"
      :loading="loading"
      :row-key="rowKey"
      striped
      @update:sorter="handleSorterChange"
      @update:filters="handleFiltersChange"
    />

    <!-- Create Institution Modal -->
    <n-modal v-model:show="showCreateModal" :mask-closable="false">
      <n-card
        style="width: 90vw; max-width: 600px"
        title="Create Institution"
        :bordered="false"
        size="huge"
      >
        <n-form
          ref="formRef"
          :model="formModel"
          :rules="formRules"
          label-placement="left"
          label-width="120"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="Name" path="name">
            <n-input
              v-model:value="formModel.name"
              placeholder="Institution Name"
            />
          </n-form-item>

          <n-form-item label="Type" path="type">
            <n-select
              v-model:value="formModel.type"
              :options="typeOptions"
              placeholder="Select Institution Type"
            />
          </n-form-item>

          <n-form-item label="Email" path="email">
            <n-input
              v-model:value="formModel.email"
              placeholder="Contact Email"
            />
          </n-form-item>

          <n-form-item label="Phone" path="phone">
            <n-input
              v-model:value="formModel.phone"
              placeholder="Contact Phone"
            />
          </n-form-item>

          <n-form-item label="Website" path="website">
            <n-input
              v-model:value="formModel.website"
              placeholder="Website URL"
            />
          </n-form-item>

          <n-form-item label="Description" path="description">
            <n-input
              v-model:value="formModel.description"
              type="textarea"
              placeholder="Institution Description"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>

          <n-divider>Address Details</n-divider>

          <n-form-item label="Country" path="address.country">
            <n-input
              v-model:value="formModel.address.country"
              placeholder="Country"
            />
          </n-form-item>

          <n-form-item label="Settlement" path="address.settlement">
            <n-input
              v-model:value="formModel.address.settlement"
              placeholder="City/Town"
            />
          </n-form-item>

          <n-form-item label="Street" path="address.street">
            <n-input
              v-model:value="formModel.address.street"
              placeholder="Street Address"
            />
          </n-form-item>

          <n-form-item label="Postal Code" path="address.postalCode">
            <n-input
              v-model:value="formModel.address.postalCode"
              placeholder="Postal Code"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showCreateModal = false">Cancel</n-button>
            <n-button type="primary" @click="handleSubmit"
              >Create Institution</n-button
            >
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- View/Edit Institution Modal -->
    <n-modal v-model:show="showViewModal" :mask-closable="false">
      <n-card
        style="width: 90vw; max-width: 700px"
        :title="editMode ? 'Edit Institution' : 'Institution Details'"
        :bordered="false"
        size="huge"
      >
        <n-tabs v-model:value="activeTab">
          <n-tab-pane name="details" tab="Details">
            <n-form
              v-if="editMode"
              ref="editFormRef"
              :model="editFormModel"
              :rules="formRules"
              label-placement="left"
              label-width="120"
              require-mark-placement="right-hanging"
            >
              <!-- Same form fields as create, but with editFormModel -->
              <n-form-item label="Name" path="name">
                <n-input
                  v-model:value="editFormModel.name"
                  placeholder="Institution Name"
                />
              </n-form-item>

              <n-form-item label="Type" path="type">
                <n-select
                  v-model:value="editFormModel.type"
                  :options="typeOptions"
                  placeholder="Select Institution Type"
                />
              </n-form-item>

              <!-- More form fields -->
            </n-form>

            <div v-else>
              <!-- Read-only view -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col">
                  <span class="text-text-secondary text-sm">Name</span>
                  <span class="font-medium">{{
                    selectedInstitution?.name
                  }}</span>
                </div>

                <div class="flex flex-col">
                  <span class="text-text-secondary text-sm">Type</span>
                  <span class="font-medium">{{
                    selectedInstitution?.type
                  }}</span>
                </div>

                <div class="flex flex-col">
                  <span class="text-text-secondary text-sm">Email</span>
                  <span class="font-medium">{{
                    selectedInstitution?.email
                  }}</span>
                </div>

                <div class="flex flex-col">
                  <span class="text-text-secondary text-sm">Phone</span>
                  <span class="font-medium">{{
                    selectedInstitution?.phone
                  }}</span>
                </div>

                <div class="flex flex-col">
                  <span class="text-text-secondary text-sm">Website</span>
                  <span class="font-medium">
                    <a
                      v-if="selectedInstitution?.website"
                      :href="selectedInstitution.website"
                      target="_blank"
                      class="text-primary hover:underline"
                    >
                      {{ selectedInstitution.website }}
                    </a>
                    <span v-else>—</span>
                  </span>
                </div>

                <div class="flex flex-col col-span-2">
                  <span class="text-text-secondary text-sm">Address</span>
                  <span class="font-medium">
                    {{ formatAddress(selectedInstitution?.address) }}
                  </span>
                </div>

                <div class="flex flex-col col-span-2">
                  <span class="text-text-secondary text-sm">Description</span>
                  <span>{{
                    selectedInstitution?.description ||
                    'No description provided'
                  }}</span>
                </div>

                <div class="flex flex-col">
                  <span class="text-text-secondary text-sm">Created</span>
                  <span>{{ formatDate(selectedInstitution?.createdAt) }}</span>
                </div>

                <div class="flex flex-col">
                  <span class="text-text-secondary text-sm">Updated</span>
                  <span>{{ formatDate(selectedInstitution?.updatedAt) }}</span>
                </div>
              </div>
            </div>
          </n-tab-pane>

          <n-tab-pane name="stats" tab="Statistics">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <n-card>
                <div class="flex flex-col items-center">
                  <span class="text-2xl font-bold text-primary">{{
                    selectedInstitution?.studentCount || 0
                  }}</span>
                  <span class="text-text-secondary">Students</span>
                </div>
              </n-card>

              <n-card>
                <div class="flex flex-col items-center">
                  <span class="text-2xl font-bold text-primary">{{
                    selectedInstitution?.teacherCount || 0
                  }}</span>
                  <span class="text-text-secondary">Teachers</span>
                </div>
              </n-card>

              <n-card>
                <div class="flex flex-col items-center">
                  <span class="text-2xl font-bold text-primary">{{
                    selectedInstitution?.adminCount || 0
                  }}</span>
                  <span class="text-text-secondary">Administrators</span>
                </div>
              </n-card>
            </div>

            <div class="mt-4">
              <h4 class="text-base font-medium mb-2">Subjects by Department</h4>
              <n-data-table
                :columns="subjectColumns"
                :data="selectedInstitution?.subjectsByDepartment || []"
                :pagination="{ pageSize: 5 }"
              />
            </div>
          </n-tab-pane>

          <n-tab-pane name="admins" tab="Administrators">
            <div class="mb-3 flex justify-between items-center">
              <h4 class="text-base font-medium">Institution Administrators</h4>
              <n-button
                size="small"
                type="primary"
                @click="showAddAdminModal = true"
              >
                <div class="flex items-center gap-1">
                  <Icon name="ph:plus" />
                  <span>Add Admin</span>
                </div>
              </n-button>
            </div>

            <n-data-table
              :columns="adminColumns"
              :data="selectedInstitution?.admins || []"
              :pagination="{ pageSize: 5 }"
            />
          </n-tab-pane>

          <n-tab-pane name="settings" tab="Settings">
            <div class="flex flex-col gap-4">
              <div>
                <h4 class="text-base font-medium mb-2">Integration Status</h4>
                <n-select
                  v-model:value="integrationStatus"
                  :options="integrationStatusOptions"
                  :disabled="!editMode"
                />
              </div>

              <div>
                <h4 class="text-base font-medium mb-2">Accreditations</h4>
                <n-select
                  v-model:value="accreditations"
                  :options="accreditationOptions"
                  multiple
                  :disabled="!editMode"
                />
              </div>

              <n-divider />

              <div>
                <h4 class="text-base font-medium mb-2">Danger Zone</h4>
                <div class="rounded-lg border border-red-500/20 p-4">
                  <div class="flex justify-between items-center">
                    <div>
                      <h5 class="font-medium text-red-500">
                        Suspend Institution
                      </h5>
                      <p class="text-text-secondary text-sm">
                        Temporarily disable access to this institution
                      </p>
                    </div>
                    <n-button
                      type="error"
                      size="small"
                      @click="showSuspendModal = true"
                      >Suspend</n-button
                    >
                  </div>

                  <n-divider />

                  <div class="flex justify-between items-center">
                    <div>
                      <h5 class="font-medium text-red-500">
                        Delete Institution
                      </h5>
                      <p class="text-text-secondary text-sm">
                        Permanently delete this institution and all associated
                        data
                      </p>
                    </div>
                    <n-button
                      type="error"
                      size="small"
                      @click="showDeleteModal = true"
                      >Delete</n-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showViewModal = false">Close</n-button>
            <template v-if="activeTab === 'details'">
              <n-button v-if="!editMode" type="primary" @click="editMode = true"
                >Edit</n-button
              >
              <template v-else>
                <n-button @click="cancelEdit">Cancel</n-button>
                <n-button type="primary" @click="handleUpdate"
                  >Save Changes</n-button
                >
              </template>
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
            Are you sure you want to delete
            <strong>{{ selectedInstitution?.name }}</strong
            >? This will permanently remove the institution and all associated
            data.
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

    <!-- Suspend Confirmation Modal -->
    <n-modal v-model:show="showSuspendModal" :mask-closable="false">
      <n-card
        style="width: 90vw; max-width: 400px"
        title="Confirm Suspension"
        :bordered="false"
      >
        <div class="flex flex-col gap-4">
          <p>
            Are you sure you want to suspend
            <strong>{{ selectedInstitution?.name }}</strong
            >? All users will be unable to access the institution until it is
            reinstated.
          </p>

          <n-input
            v-model:value="suspendReason"
            type="textarea"
            placeholder="Reason for suspension (required)"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showSuspendModal = false">Cancel</n-button>
            <n-button
              type="warning"
              :disabled="!suspendReason"
              @click="handleSuspend"
            >
              Suspend Institution
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- Add Admin Modal -->
    <n-modal v-model:show="showAddAdminModal" :mask-closable="false">
      <n-card
        style="width: 90vw; max-width: 500px"
        title="Add Administrator"
        :bordered="false"
      >
        <n-form
          ref="adminFormRef"
          :model="adminFormModel"
          :rules="adminFormRules"
          label-placement="left"
          label-width="120"
        >
          <n-form-item label="First Name" path="firstName">
            <n-input
              v-model:value="adminFormModel.firstName"
              placeholder="First Name"
            />
          </n-form-item>

          <n-form-item label="Last Name" path="lastName">
            <n-input
              v-model:value="adminFormModel.lastName"
              placeholder="Last Name"
            />
          </n-form-item>

          <n-form-item label="Email" path="email">
            <n-input
              v-model:value="adminFormModel.email"
              placeholder="Email Address"
            />
          </n-form-item>

          <n-form-item label="Position" path="position">
            <n-input
              v-model:value="adminFormModel.position"
              placeholder="Position"
            />
          </n-form-item>

          <n-form-item label="Department" path="department">
            <n-input
              v-model:value="adminFormModel.department"
              placeholder="Department"
            />
          </n-form-item>

          <n-form-item label="Role" path="role">
            <n-select
              v-model:value="adminFormModel.role"
              :options="adminRoleOptions"
              placeholder="Select Role"
            />
          </n-form-item>

          <n-form-item label="Permissions" path="permissions">
            <n-select
              v-model:value="adminFormModel.permissions"
              :options="permissionOptions"
              multiple
              placeholder="Select Permissions"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showAddAdminModal = false">Cancel</n-button>
            <n-button type="primary" @click="handleAddAdmin"
              >Add Administrator</n-button
            >
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, h, onMounted } from 'vue';
import {
  NButton,
  NCard,
  NDataTable,
  NInput,
  NInputGroup,
  NSelect,
  NForm,
  NFormItem,
  NModal,
  NAlert,
  NDivider,
  NTabs,
  NTabPane,
} from 'naive-ui';
import { useSuperAdminStore } from '~/stores/super-admin';
// import type { InstitutionDto, AddressDto } from '~/types';
import type { InstitutionResponseDto as InstitutionDto } from '~/interfaces/organizations/institution-response.dto';
import type { AddressDto } from '~/interfaces/application-response.dto';


// Store and initial data loading
const superAdminStore = useSuperAdminStore();
const loading = ref(false);
const institutions = ref<InstitutionDto[]>([]);

// Search and filters
const searchQuery = ref('');
const filters = reactive({
  type: null,
  status: null,
});

// Form state
const showCreateModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const showSuspendModal = ref(false);
const showAddAdminModal = ref(false);
const editMode = ref(false);
const activeTab = ref('details');
const selectedInstitution = ref<InstitutionDto | null>(null);
const deleteConfirmation = ref('');
const suspendReason = ref('');

// Form references
const formRef = ref(null);
const editFormRef = ref(null);
const adminFormRef = ref(null);

// Form models
const formModel = reactive({
  name: '',
  type: null,
  email: '',
  phone: '',
  website: '',
  description: '',
  address: {
    country: '',
    settlement: '',
    street: '',
    postalCode: '',
  },
});

const editFormModel = reactive({
  name: '',
  type: null,
  email: '',
  phone: '',
  website: '',
  description: '',
  address: {
    country: '',
    settlement: '',
    street: '',
    postalCode: '',
  },
});

const adminFormModel = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: 'TemporaryPassword123!', // Default password (would be changed by the user)
  position: '',
  department: '',
  role: 'InstitutionAdmin',
  permissions: [],
});

// Form validation rules
const formRules = {
  name: {
    required: true,
    message: 'Institution name is required',
    trigger: 'blur',
  },
  type: {
    required: true,
    message: 'Institution type is required',
    trigger: 'change',
  },
  email: {
    required: true,
    type: 'email',
    message: 'Please enter a valid email address',
    trigger: 'blur',
  },
  phone: {
    required: true,
    message: 'Phone number is required',
    trigger: 'blur',
  },
  'address.country': {
    required: true,
    message: 'Country is required',
    trigger: 'blur',
  },
  'address.settlement': {
    required: true,
    message: 'City/Town is required',
    trigger: 'blur',
  },
};

const adminFormRules = {
  firstName: {
    required: true,
    message: 'First name is required',
    trigger: 'blur',
  },
  lastName: {
    required: true,
    message: 'Last name is required',
    trigger: 'blur',
  },
  email: {
    required: true,
    type: 'email',
    message: 'Please enter a valid email address',
    trigger: 'blur',
  },
  role: {
    required: true,
    message: 'Role is required',
    trigger: 'change',
  },
};

// Options for select fields
const typeOptions = [
  { label: 'Public School', value: 'PublicSchool' },
  { label: 'Private School', value: 'PrivateSchool' },
  { label: 'Charter School', value: 'CharterSchool' },
  { label: 'International School', value: 'InternationalSchool' },
  { label: 'Public University', value: 'PublicUniversity' },
  { label: 'Private University', value: 'PrivateUniversity' },
  { label: 'Community College', value: 'CommunityCollege' },
  { label: 'Technical College', value: 'TechnicalCollege' },
  { label: 'Liberal Arts College', value: 'LiberalArtsCollege' },
  { label: 'Primary School', value: 'PrimarySchool' },
  { label: 'Secondary School', value: 'SecondarySchool' },
  { label: 'High School', value: 'HighSchool' },
  { label: 'Vocational School', value: 'VocationalSchool' },
  { label: 'Special Education School', value: 'SpecialEducationSchool' },
  { label: 'Language School', value: 'LanguageSchool' },
  { label: 'Other', value: 'Other' },
];

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Pending Verification', value: 'RequiresVerification' },
  { label: 'Verified', value: 'Verified' },
  { label: 'Additional Data Submitted', value: 'AdditionalDataSubmitted' },
  { label: 'Denied', value: 'Denied' },
];

const integrationStatusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Requires Verification', value: 'RequiresVerification' },
  { label: 'Verified', value: 'Verified' },
  { label: 'Additional Data Submitted', value: 'AdditionalDataSubmitted' },
  { label: 'Denied', value: 'Denied' },
];

const accreditationOptions = [
  { label: 'Regional', value: 'Regional' },
  { label: 'National', value: 'National' },
  { label: 'Programmatic', value: 'Programmatic' },
  { label: 'International', value: 'International' },
];

const adminRoleOptions = [
  { label: 'System Admin', value: 'SystemAdmin' },
  { label: 'Institution Admin', value: 'InstitutionAdmin' },
  { label: 'Department Admin', value: 'DepartmentAdmin' },
  { label: 'Program Coordinator', value: 'ProgramCoordinator' },
];

const permissionOptions = [
  { label: 'Manage Users', value: 'ManageUsers' },
  { label: 'Manage Students', value: 'ManageStudents' },
  { label: 'Manage Teachers', value: 'ManageTeachers' },
  { label: 'Manage Courses', value: 'ManageCourses' },
  { label: 'Manage Grades', value: 'ManageGrades' },
  { label: 'Manage Attendance', value: 'ManageAttendance' },
  { label: 'Manage Reports', value: 'ManageReports' },
  { label: 'Manage Settings', value: 'ManageSettings' },
  { label: 'View Analytics', value: 'ViewAnalytics' },
  { label: 'Full Access', value: 'FullAccess' },
];

// Integration and accreditation state (for settings tab)
const integrationStatus = ref(null);
const accreditations = ref([]);

// Table pagination
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page) => {
    pagination.page = page;
  },
  onPageSizeChange: (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
});

// Row key function for data table
const rowKey = (row) => row.id;

// Table columns
const columns = [
  {
    title: 'Name',
    key: 'name',
    sorter: 'default',
    render: (row) => {
      return h(
        'div',
        {
          class: 'cursor-pointer text-primary hover:underline',
          onClick: () => viewInstitution(row),
        },
        row.name
      );
    },
  },
  {
    title: 'Type',
    key: 'type',
    sorter: 'default',
    filter: true,
    filterOptions: typeOptions,
  },
  {
    title: 'Email',
    key: 'email',
  },
  {
    title: 'Phone',
    key: 'phone',
  },
  {
    title: 'Status',
    key: 'integrationStatus',
    render: (row) => {
      const statusColorMap = {
        Active: 'success',
        Inactive: 'error',
        RequiresVerification: 'warning',
        Verified: 'success',
        AdditionalDataSubmitted: 'info',
        Denied: 'error',
      };

      return h(
        'div',
        {
          class: `text-${statusColorMap[row.integrationStatus] || 'default'}`,
        },
        row.integrationStatus
      );
    },
  },
  {
    title: 'Created',
    key: 'createdAt',
    sorter: 'default',
    render: (row) => formatDate(row.createdAt),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (row) => {
      return h('div', { class: 'flex gap-2' }, [
        h(
          NButton,
          {
            size: 'small',
            quaternary: true,
            onClick: () => viewInstitution(row),
          },
          { default: () => 'View' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            quaternary: true,
            onClick: () => editInstitution(row),
          },
          { default: () => 'Edit' }
        ),
      ]);
    },
  },
];

// Columns for the subjects by department table in stats tab
const subjectColumns = [
  {
    title: 'Department',
    key: 'department',
  },
  {
    title: 'Subject Count',
    key: 'count',
  },
];

// Columns for the administrators table in admins tab
const adminColumns = [
  {
    title: 'Name',
    key: 'name',
    render: (row) => `${row.firstName} ${row.lastName}`,
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
    title: 'Role',
    key: 'role',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (row) => {
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
            type: 'error',
            quaternary: true,
            onClick: () => removeAdmin(row),
          },
          { default: () => 'Remove' }
        ),
      ]);
    },
  },
];

// Computed properties
const filteredInstitutions = computed(() => {
  let result = [...institutions.value];

  // Apply text search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (institution) =>
        institution.name?.toLowerCase().includes(query) ||
        institution.email?.toLowerCase().includes(query) ||
        institution.phone?.toLowerCase().includes(query)
    );
  }

  // Apply type filter
  if (filters.type) {
    result = result.filter((institution) => institution.type === filters.type);
  }

  // Apply status filter
  if (filters.status) {
    result = result.filter(
      (institution) => institution.integrationStatus === filters.status
    );
  }

  return result;
});

// Methods
const handleSearch = () => {
  // This function can be expanded if needed, currently the filteredInstitutions
  // computed property handles the filtering reactively
};

const resetFilters = () => {
  searchQuery.value = '';
  filters.type = null;
  filters.status = null;
};

const handleSorterChange = (sorter) => {
  // Implement sorting logic
};

const handleFiltersChange = (filters) => {
  // Implement additional filtering logic if needed
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatAddress = (address: AddressDto | undefined) => {
  if (!address) return '—';
  const parts = [
    address.street,
    address.settlement,
    address.postalCode,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
};

const viewInstitution = (institution) => {
  selectedInstitution.value = institution;
  editMode.value = false;
  activeTab.value = 'details';

  // Copy values for editing
  Object.assign(editFormModel, {
    ...institution,
    address: { ...institution.address },
  });

  // Set integration status and accreditations for settings tab
  integrationStatus.value = institution.integrationStatus;
  accreditations.value = institution.accreditations || [];

  showViewModal.value = true;
};

const editInstitution = (institution) => {
  viewInstitution(institution);
  editMode.value = true;
};

const cancelEdit = () => {
  editMode.value = false;

  // Reset form to original values
  if (selectedInstitution.value) {
    Object.assign(editFormModel, {
      ...selectedInstitution.value,
      address: { ...selectedInstitution.value.address },
    });
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    loading.value = true;
    await superAdminStore.createInstitution(formModel);

    // Reset form and close modal
    resetForm();
    showCreateModal.value = false;

    // Refresh institutions list
    await fetchInstitutions();
  } catch (error) {
    console.error('Form validation failed:', error);
  } finally {
    loading.value = false;
  }
};

const handleUpdate = async () => {
  if (!editFormRef.value || !selectedInstitution.value) return;

  try {
    await editFormRef.value.validate();

    loading.value = true;
    await superAdminStore.updateInstitution(
      selectedInstitution.value.id,
      editFormModel
    );

    // Update the selected institution and exit edit mode
    selectedInstitution.value = {
      ...selectedInstitution.value,
      ...editFormModel,
      address: { ...editFormModel.address },
    };
    editMode.value = false;

    // Refresh institutions list
    await fetchInstitutions();
  } catch (error) {
    console.error('Form validation failed:', error);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  if (!selectedInstitution.value || deleteConfirmation.value !== 'DELETE')
    return;

  try {
    loading.value = true;
    await superAdminStore.deleteInstitution(selectedInstitution.value.id);

    // Close modals and reset
    showDeleteModal.value = false;
    showViewModal.value = false;
    deleteConfirmation.value = '';

    // Refresh institutions list
    await fetchInstitutions();
  } catch (error) {
    console.error('Error deleting institution:', error);
  } finally {
    loading.value = false;
  }
};

const handleSuspend = async () => {
  if (!selectedInstitution.value || !suspendReason.value) return;

  try {
    loading.value = true;
    await superAdminStore.suspendInstitution(
      selectedInstitution.value.id,
      suspendReason.value
    );

    // Close modals and reset
    showSuspendModal.value = false;
    suspendReason.value = '';

    // Update the selected institution status
    if (selectedInstitution.value) {
      selectedInstitution.value.integrationStatus = 'Inactive';
    }

    // Refresh institutions list
    await fetchInstitutions();
  } catch (error) {
    console.error('Error suspending institution:', error);
  } finally {
    loading.value = false;
  }
};

const handleAddAdmin = async () => {
  if (!adminFormRef.value || !selectedInstitution.value) return;

  try {
    await adminFormRef.value.validate();

    loading.value = true;
    const adminData = {
      ...adminFormModel,
      institutionId: selectedInstitution.value.id,
    };

    await superAdminStore.createAdmin(adminData);

    // Reset form and close modal
    resetAdminForm();
    showAddAdminModal.value = false;

    // Refresh the selected institution to get updated admins list
    if (selectedInstitution.value) {
      const updatedInstitution = await superAdminStore.getInstitutionById(
        selectedInstitution.value.id
      );
      selectedInstitution.value = updatedInstitution;
    }
  } catch (error) {
    console.error('Form validation failed:', error);
  } finally {
    loading.value = false;
  }
};

const viewAdmin = (admin) => {
  // Navigate to admin details page or show modal
  router.push(`/superadmin/admins/${admin.id}`);
};

const removeAdmin = async (admin) => {
  try {
    if (
      !confirm(
        `Are you sure you want to remove ${admin.firstName} ${admin.lastName} as administrator?`
      )
    ) {
      return;
    }

    loading.value = true;
    await superAdminStore.removeAdmin(admin.id);

    // Refresh the selected institution to get updated admins list
    if (selectedInstitution.value) {
      const updatedInstitution = await superAdminStore.getInstitutionById(
        selectedInstitution.value.id
      );
      selectedInstitution.value = updatedInstitution;
    }
  } catch (error) {
    console.error('Error removing admin:', error);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formModel.name = '';
  formModel.type = null;
  formModel.email = '';
  formModel.phone = '';
  formModel.website = '';
  formModel.description = '';
  formModel.address.country = '';
  formModel.address.settlement = '';
  formModel.address.street = '';
  formModel.address.postalCode = '';

  if (formRef.value) {
    formRef.value.restoreValidation();
  }
};

const resetAdminForm = () => {
  adminFormModel.firstName = '';
  adminFormModel.lastName = '';
  adminFormModel.email = '';
  adminFormModel.position = '';
  adminFormModel.department = '';
  adminFormModel.role = 'InstitutionAdmin';
  adminFormModel.permissions = [];

  if (adminFormRef.value) {
    adminFormRef.value.restoreValidation();
  }
};

const fetchInstitutions = async () => {
  loading.value = true;
  try {
    const results = await superAdminStore.fetchInstitutions();
    institutions.value = results;
  } catch (error) {
    console.error('Error fetching institutions:', error);
  } finally {
    loading.value = false;
  }
};

// Fetch data on component mount
onMounted(async () => {
  await fetchInstitutions();
});
</script>
