<!-- components/superadmin/InstitutionSelector.vue -->
<template>
  <div class="bg-background-card rounded-lg shadow p-4 mb-6">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div class="flex items-center gap-2">
        <div class="text-lg font-medium">Selected Institution:</div>
        <div v-if="activeInstitution" class="text-primary font-semibold">
          {{ activeInstitution.name }}
        </div>
        <div v-else class="text-text-secondary italic">None selected</div>
      </div>

      <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <!-- Institution type filter -->
        <n-select
          v-model:value="selectedInstitutionType"
          placeholder="Institution Type"
          clearable
          :options="institutionTypeOptions"
          class="min-w-[200px]"
          @update:value="handleInstitutionTypeChange"
        >
          <template #prefix>
            <Icon name="ph:buildings" />
          </template>
        </n-select>

        <!-- Institution selector -->
        <n-select
          v-model:value="selectedInstitutionId"
          placeholder="Select Institution"
          clearable
          filterable
          :options="filteredInstitutionOptions"
          class="min-w-[250px]"
          @update:value="handleInstitutionChange"
        >
          <template #prefix>
            <Icon name="ph:building" />
          </template>
        </n-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useInstitutionStore } from '~/stores/institution';
import { isHigherEducation, isSchool } from '~/utils/institution-helper';
import { useMessage } from 'naive-ui';

const emit = defineEmits(['institution-change']);
const message = useMessage();

// Stores
const institutionStore = useInstitutionStore();
const userStore = useUserStore();

// State
const selectedInstitutionId = ref(null);
const selectedInstitutionType = ref(null);

// Computed properties
const activeInstitution = computed(() => {
  return institutionStore.activeInstitution;
});

const institutionTypeOptions = computed(() => {
  return [
    { label: 'Schools', value: 'school' },
    { label: 'Universities & Colleges', value: 'university' },
  ];
});

const filteredInstitutionOptions = computed(() => {
  if (!institutionStore.institutions) return [];

  let institutions = institutionStore.institutions;

  // Filter by type if selected
  if (selectedInstitutionType.value === 'school') {
    institutions = institutions.filter((inst) => isSchool(inst.type));
  } else if (selectedInstitutionType.value === 'university') {
    institutions = institutions.filter((inst) => isHigherEducation(inst.type));
  }

  return institutions.map((inst) => ({
    label: inst.name,
    value: inst.id,
    type: inst.type,
  }));
});

// Methods
function handleInstitutionTypeChange(type) {
  selectedInstitutionType.value = type;

  // Reset institution selection if the type changes
  if (selectedInstitutionId.value) {
    const currentInst = institutionStore.institutions.find(
      (i) => i.id === selectedInstitutionId.value
    );

    // Check if current selection doesn't match the new type filter
    if (currentInst) {
      const isCurrentSchool = isSchool(currentInst.type);
      const isCurrentUniversity = isHigherEducation(currentInst.type);

      if (
        (type === 'school' && !isCurrentSchool) ||
        (type === 'university' && !isCurrentUniversity)
      ) {
        selectedInstitutionId.value = null;
        institutionStore.clearActiveInstitution();
      }
    }
  }
}

async function handleInstitutionChange(institutionId: string | null) {
  if (!institutionId) {
    institutionStore.clearActiveInstitution();
    selectedInstitutionId.value = null;
    message.info('No institution selected');
    emit('institution-change', null);
    return;
  }

  try {
    // Find the selected institution
    const selectedInstitution = institutionStore.institutions.find(
      (i) => i.id === institutionId
    );

    if (selectedInstitution) {
      // Set the active institution in the store
      await institutionStore.setActiveInstitution(selectedInstitution);
      selectedInstitutionId.value = institutionId;

      message.success(`Switched to ${selectedInstitution.name}`);
      emit('institution-change', selectedInstitution);
    }
  } catch (error) {
    console.error('Error changing institution:', error);
    message.error('Failed to change institution');
  }
}

// Lifecycle
onMounted(async () => {
  // If there's no institutions loaded, fetch them
  if (
    !institutionStore.institutions ||
    institutionStore.institutions.length === 0
  ) {
    try {
      await institutionStore.fetchUserInstitutions(userStore.userDetails?.id ?? '');
    } catch (error) {
      console.error('Failed to load institutions:', error);
      message.error('Failed to load institutions');
    }
  }

  // If there's an active institution in the store, select it
  if (institutionStore.activeInstitution) {
    selectedInstitutionId.value = institutionStore.activeInstitution.id;

    // Set the institution type based on the active institution
    if (isSchool(institutionStore.activeInstitution.type)) {
      selectedInstitutionType.value = 'school';
    } else if (isHigherEducation(institutionStore.activeInstitution.type)) {
      selectedInstitutionType.value = 'university';
    }
  }
});
</script>
