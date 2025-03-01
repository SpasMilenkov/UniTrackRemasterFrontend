<template>
  <div class="grid gap-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gradient">
        {{ $t('institutions.linkedInstitutions') }}
      </h2>
      <n-button
        type="primary"
        class="h-9 text-sm font-medium px-4"
        @click="navigateTo('/institutions/link')"
      >
        {{ $t('institutions.linkNew') }}
        <template #icon>
          <Icon name="ph:plus-bold" />
        </template>
      </n-button>
    </div>

    <!-- Institutions Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="institution in institutions"
        :key="institution.id"
        class="group relative bg-background-secondary rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
      >
        <!-- Card Background Effects -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <div
          class="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-300"
        />

        <div class="relative p-5">
          <!-- Institution Info -->
          <div class="mb-4">
            <div class="bg-primary/10 p-3 rounded-xl w-fit mb-4">
              <Icon
                :name="getInstitutionIcon(institution.type)"
                class="text-2xl text-primary"
              />
            </div>
            <h3 class="text-lg font-semibold text-text-primary mb-2">
              {{ institution.name }}
            </h3>
            <p class="text-text-secondary text-sm">
              {{ institution.location }}
            </p>
          </div>

          <!-- Status Badge -->
          <div class="mb-4">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium border',
                institution.integrationStatus === IntegrationStatus.Active
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
              ]"
            >
              {{ $t(`institutions.status.${institution.integrationStatus}`) }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 mt-auto">
            <n-button
              secondary
              type="default"
              size="small"
              class="h-8 text-xs"
              @click="handleViewDetails(institution.id)"
            >
              {{ $t('institutions.viewDetails') }}
            </n-button>
            <n-button
              type="error"
              size="small"
              class="h-8 text-xs"
              @click="handleUnlink(institution.id)"
            >
              {{ $t('institutions.unlink') }}
            </n-button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!institutions.length"
        class="col-span-full flex flex-col items-center justify-center p-8 bg-background-secondary rounded-xl"
      >
        <Icon name="ph:buildings" class="text-5xl text-text-muted mb-4" />
        <p class="text-text-secondary text-center mb-4">
          {{ $t('institutions.noInstitutions') }}
        </p>
        <n-button
          type="primary"
          class="h-9 text-sm font-medium px-4"
          @click="navigateTo('/institutions/link')"
        >
          {{ $t('institutions.linkFirst') }}
          <template #icon>
            <Icon name="ph:plus-bold" />
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InstitutionType } from '~/enums/institution-type.enum';
import { IntegrationStatus } from '~/enums/integration-status.enum';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';

// Props
defineProps<{
  institutions: InstitutionResponseDto[];
}>();

// Emits
const emit = defineEmits<{
  unlink: [id: string];
  viewDetails: [id: string];
}>();

// Methods
const getInstitutionIcon = (type: InstitutionResponseDto['type']) => {
  return type === InstitutionType.PublicUniversity
    ? 'ph:buildings-bold'
    : 'ph:school-bold';
};

const handleUnlink = (id: string) => {
  emit('unlink', id);
};

const handleViewDetails = (id: string) => {
  emit('viewDetails', id);
};
</script>

<style scoped></style>
