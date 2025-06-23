<template>
  <div class="py-6 px-4">
    <!-- Header with actions -->
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4"
    >
      <h2 class="text-xl font-semibold m-0">Grading Systems</h2>
      <n-button
        type="primary"
        :disabled="!canCreateGradingSystem"
        @click="handleAddGradingSystemClick"
      >
        <template #icon>
          <Icon name="carbon:add" />
        </template>
        Add Grading System
      </n-button>
    </div>

    <!-- Prerequisites alert -->
    <n-alert v-if="!canCreateGradingSystem" type="warning" class="mb-6">
      <template #icon>
        <Icon name="carbon:warning" />
      </template>
      <div class="flex flex-col gap-2">
        <div class="font-semibold">Before managing grading systems:</div>
        <div class="flex items-center gap-2">
          <Icon name="carbon:checkmark-outline" class="text-red-500" />
          <span>
            You need to select an active institution.
            <n-button text type="info" @click="navigateToInstitutions">
              Select Institution
            </n-button>
          </span>
        </div>
      </div>
    </n-alert>

    <!-- Filter tabs -->
    <div v-if="canCreateGradingSystem" class="mb-6">
      <n-card class="overflow-x-auto">
        <div class="flex gap-2 min-w-max">
          <n-button
            v-for="type in gradingSystemTypes"
            :key="type.value"
            :type="selectedType === type.value ? 'primary' : 'default'"
            size="small"
            @click="selectedType = type.value"
          >
            {{ type.label }}
          </n-button>
        </div>
      </n-card>
    </div>

    <!-- Loading state -->
    <div
      v-if="gradingSystemStore.loadingGradingSystems"
      class="flex justify-center items-center py-16"
    >
      <n-spin size="large" />
    </div>

    <!-- Grading Systems List -->
    <div v-else-if="canCreateGradingSystem" class="grid gap-6">
      <div
        v-for="gradingSystem in filteredGradingSystems"
        :key="gradingSystem.id"
        class="bg-background-card rounded-lg shadow-sm border border-border overflow-hidden"
      >
        <!-- Header -->
        <div class="px-4 py-4 sm:px-6 border-b border-border">
          <div
            class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3"
          >
            <div class="flex-grow">
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <h3 class="text-lg font-semibold m-0">
                  {{ gradingSystem.name }}
                </h3>
                <n-tag
                  v-if="gradingSystem.isDefault"
                  type="success"
                  size="small"
                >
                  Default
                </n-tag>
                <n-tag
                  :type="getGradingSystemTypeColor(gradingSystem.type)"
                  size="small"
                >
                  {{ gradingSystem.type }}
                </n-tag>
              </div>
              <p class="text-text-secondary text-sm m-0">
                {{ gradingSystem.description || 'No description provided' }}
              </p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <n-button
                size="small"
                @click="handleEditGradingSystem(gradingSystem)"
              >
                <template #icon>
                  <Icon name="carbon:edit" />
                </template>
                <span class="hidden sm:inline">Edit</span>
              </n-button>
              <n-button
                v-if="!gradingSystem.isDefault"
                size="small"
                type="info"
                ghost
                @click="handleSetDefault(gradingSystem)"
              >
                <template #icon>
                  <Icon name="carbon:star" />
                </template>
                <span class="hidden sm:inline">Set Default</span>
              </n-button>
              <n-button
                size="small"
                type="error"
                ghost
                :disabled="gradingSystem.isDefault"
                @click="handleDeleteGradingSystem(gradingSystem)"
              >
                <template #icon>
                  <Icon name="carbon:trash-can" />
                </template>
                <span class="hidden sm:inline">Delete</span>
              </n-button>
            </div>
          </div>
        </div>

        <!-- System Info -->
        <div class="px-4 py-4 sm:px-6 bg-background border-b border-border">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm"
          >
            <div>
              <span class="font-medium text-text-secondary"
                >Passing Score:</span
              >
              <div class="font-semibold">
                {{ gradingSystem.minimumPassingScore }}%
              </div>
            </div>
            <div>
              <span class="font-medium text-text-secondary"
                >Maximum Score:</span
              >
              <div class="font-semibold">{{ gradingSystem.maximumScore }}%</div>
            </div>
            <div>
              <span class="font-medium text-text-secondary">Grade Scales:</span>
              <div class="font-semibold">
                {{ gradingSystem.gradeScales?.length || 0 }} scales
              </div>
            </div>
            <div>
              <span class="font-medium text-text-secondary">Created:</span>
              <div class="font-semibold">
                {{ formatDate(gradingSystem.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Grade Scales -->
        <div class="px-4 py-4 sm:px-6">
          <div class="mb-3">
            <h4 class="text-base font-medium text-text-primary mb-2">
              Grade Scales
            </h4>
            <div class="text-sm text-text-secondary">
              Score ranges and corresponding grades for this system
            </div>
          </div>

          <!-- Mobile: Card Layout -->
          <div class="block sm:hidden space-y-3">
            <div
              v-for="scale in sortedGradeScales(gradingSystem.gradeScales)"
              :key="scale.id"
              class="bg-background border border-border rounded-lg p-3"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="font-semibold text-lg">{{ scale.grade }}</div>
                <div class="text-right">
                  <div class="font-medium">
                    {{ scale.minScore }}% - {{ scale.maxScore }}%
                  </div>
                  <div class="text-sm text-text-secondary">
                    {{ scale.gpaValue }} GPA
                  </div>
                </div>
              </div>
              <div class="text-sm text-text-secondary">
                {{ scale.description }}
              </div>
            </div>
          </div>

          <!-- Desktop: Table Layout -->
          <div class="hidden sm:block overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border">
                  <th
                    class="text-left py-2 px-3 font-medium text-text-secondary"
                  >
                    Grade
                  </th>
                  <th
                    class="text-left py-2 px-3 font-medium text-text-secondary"
                  >
                    Description
                  </th>
                  <th
                    class="text-right py-2 px-3 font-medium text-text-secondary"
                  >
                    Min Score
                  </th>
                  <th
                    class="text-right py-2 px-3 font-medium text-text-secondary"
                  >
                    Max Score
                  </th>
                  <th
                    class="text-right py-2 px-3 font-medium text-text-secondary"
                  >
                    GPA Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="scale in sortedGradeScales(gradingSystem.gradeScales)"
                  :key="scale.id"
                  class="border-b border-border last:border-b-0 hover:bg-background transition-colors"
                >
                  <td class="py-2 px-3 font-semibold">{{ scale.grade }}</td>
                  <td class="py-2 px-3">{{ scale.description }}</td>
                  <td class="py-2 px-3 text-right">
                    {{ scale.minimumScore }}%
                  </td>
                  <td class="py-2 px-3 text-right">
                    {{ scale.maximumScore }}%
                  </td>
                  <td class="py-2 px-3 text-right font-medium">
                    {{ scale.gpaValue }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredGradingSystems.length === 0" class="text-center py-12">
        <Icon
          name="carbon:document-unknown"
          class="text-4xl text-text-secondary mb-4"
        />
        <h3 class="text-lg font-medium text-text-primary mb-2">
          No grading systems found
        </h3>
        <p class="text-text-secondary mb-4">
          {{
            selectedType === 'all'
              ? 'No grading systems have been created for this institution yet.'
              : `No ${selectedType} grading systems found.`
          }}
        </p>
        <n-button
          v-if="selectedType !== 'all'"
          type="primary"
          ghost
          @click="selectedType = 'all'"
        >
          View All Systems
        </n-button>
      </div>
    </div>

    <!-- Grading System Modal -->
    <n-modal
      v-model:show="showGradingSystemModal"
      preset="card"
      style="width: 90vw; max-width: 800px"
      :title="
        editingGradingSystem
          ? 'Edit Grading System'
          : 'Create New Grading System'
      "
    >
      <GradingSystemForm
        :loading="submittingGradingSystem"
        :initial-values="gradingSystemForm"
        :is-editing="!!editingGradingSystem"
        @submit="handleSubmitGradingSystem"
        @cancel="showGradingSystemModal = false"
      />
    </n-modal>

    <!-- Delete Confirmation Dialog -->
    <n-modal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      title="Confirm Deletion"
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="confirmDelete"
      @negative-click="cancelDelete"
    >
      <template #icon>
        <n-icon color="warning">
          <Icon name="carbon:warning-filled" />
        </n-icon>
      </template>
      <div class="py-2">
        Are you sure you want to delete the grading system "{{
          itemToDelete?.name
        }}"?
        <n-alert type="warning" class="mt-4">
          This action cannot be undone. All associated grades and academic
          records may be affected.
        </n-alert>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  NButton,
  NCard,
  NModal,
  NIcon,
  NAlert,
  NSpin,
  NTag,
  useMessage,
} from 'naive-ui';
import { Icon } from '#components';
import {
  useGradingSystemStore,
  type GradingSystem,
  type CreateGradingSystemData,
} from '~/stores/grading-system';
import { useInstitutionStore } from '~/stores/institution';
import GradingSystemForm from './forms/GradingSystemForm.vue';
import { format } from 'date-fns';

// Router for navigation
const router = useRouter();

// Stores and utilities
const gradingSystemStore = useGradingSystemStore();
const institutionStore = useInstitutionStore();
const message = useMessage();

// Local state
const selectedType = ref('all');
const showGradingSystemModal = ref(false);
const submittingGradingSystem = ref(false);
const editingGradingSystem = ref<GradingSystem | null>(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref<GradingSystem | null>(null);

// Form initial values
const gradingSystemForm = ref({
  name: '',
  description: '',
  type: '',
  isDefault: false,
  minimumPassingScore: 30,
  maximumScore: 100,
  institutionId: institutionStore.activeInstitution?.id || '',
  gradeScales: [],
});

// Computed properties
const canCreateGradingSystem = computed(() => {
  return !!institutionStore.activeInstitution?.id;
});

const gradingSystemTypes = [
  { label: 'All Systems', value: 'all' },
  { label: 'American', value: 'American' },
  { label: 'European', value: 'European' },
  { label: 'Bulgarian', value: 'Bulgarian' },
];

const filteredGradingSystems = computed(() => {
  if (selectedType.value === 'all') {
    return gradingSystemStore.availableGradingSystems;
  }
  return gradingSystemStore.availableGradingSystems.filter(
    (system) => system.type === selectedType.value
  );
});

// Helper functions
function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
}

function getGradingSystemTypeColor(type: string) {
  const colors: Record<
    string,
    'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  > = {
    American: 'primary',
    European: 'info',
    Bulgarian: 'success',
  };
  return colors[type] || 'default';
}

function sortedGradeScales(gradeScales: any[] | undefined) {
  if (!gradeScales) return [];
  return [...gradeScales].sort((a, b) => b.minimumScore - a.minimumScore);
}

function navigateToInstitutions() {
  router.push('/institutions');
}

function handleAddGradingSystemClick() {
  if (canCreateGradingSystem.value) {
    gradingSystemForm.value = {
      name: '',
      description: '',
      type: '',
      isDefault: false,
      minimumPassingScore: 30,
      maximumScore: 100,
      institutionId: institutionStore.activeInstitution?.id || '',
      gradeScales: [],
    };
    editingGradingSystem.value = null;
    showGradingSystemModal.value = true;
  } else {
    message.warning(
      'You need an active institution before creating grading systems.'
    );
  }
}

function handleEditGradingSystem(gradingSystem: GradingSystem) {
  editingGradingSystem.value = gradingSystem;
  gradingSystemForm.value = {
    name: gradingSystem.name,
    description: gradingSystem.description || '',
    type: gradingSystem.type,
    isDefault: gradingSystem.isDefault,
    minimumPassingScore: gradingSystem.minimumPassingScore,
    maximumScore: gradingSystem.maximumScore,
    institutionId: gradingSystem.institutionId,
    gradeScales: gradingSystem.gradeScales || [],
  };
  showGradingSystemModal.value = true;
}

function handleDeleteGradingSystem(gradingSystem: GradingSystem) {
  if (gradingSystem.isDefault) {
    message.warning('You cannot delete the default grading system.');
    return;
  }

  itemToDelete.value = gradingSystem;
  showDeleteConfirm.value = true;
}

async function handleSetDefault(gradingSystem: GradingSystem) {
  try {
    if (!institutionStore.activeInstitution?.id) {
      message.error('No active institution selected');
      return;
    }

    await gradingSystemStore.setDefaultGradingSystem(
      gradingSystem.id,
      institutionStore.activeInstitution.id
    );
    message.success('Default grading system updated successfully');
  } catch (error: any) {
    message.error('Error setting default grading system: ' + error.message);
  }
}

function cancelDelete() {
  itemToDelete.value = null;
  showDeleteConfirm.value = false;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  try {
    await gradingSystemStore.deleteGradingSystem(itemToDelete.value.id);
    message.success('Grading system deleted successfully');
  } catch (error: any) {
    message.error('Error deleting grading system: ' + error.message);
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
}

async function handleSubmitGradingSystem(
  validatedData: CreateGradingSystemData
) {
  try {
    submittingGradingSystem.value = true;

    if (editingGradingSystem.value) {
      await gradingSystemStore.updateGradingSystem(
        editingGradingSystem.value.id,
        validatedData
      );
      message.success('Grading system updated successfully');
    } else {
      await gradingSystemStore.createGradingSystem(validatedData);
      message.success('Grading system created successfully');
    }

    showGradingSystemModal.value = false;
  } catch (error: any) {
    message.error(
      `Failed to ${editingGradingSystem.value ? 'update' : 'create'} grading system: ${error.message}`
    );
  } finally {
    submittingGradingSystem.value = false;
  }
}

// Fetch grading systems when institution changes
watch(
  () => institutionStore.activeInstitution?.id,
  async (institutionId) => {
    if (institutionId) {
      try {
        // Use your existing store method with institution filter
        await gradingSystemStore.fetchGradingSystems({ institutionId });
      } catch (error) {
        console.error('Error fetching grading systems:', error);
        message.error('Failed to load grading systems for this institution');
      }
    }
  },
  { immediate: true }
);
</script>
