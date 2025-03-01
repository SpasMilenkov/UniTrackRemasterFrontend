<template>
  <div class="h-screen flex flex-col p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-text-primary">My Institutions</h1>
      <n-button
        type="primary"
        class="transform hover:scale-105 transition-all duration-300"
        @click="navigateTo('/institutions/new')"
      >
        Add Institution
        <template #icon><Icon name="ph:plus-bold" class="ml-2" /></template>
      </n-button>
    </div>

    <div class="flex-1 flex gap-6 min-h-0">
      <div class="flex-1 overflow-hidden flex flex-col">
        <div v-if="loading" class="flex-1 flex items-center justify-center">
          <Icon name="ph:spinner" class="w-8 h-8 animate-spin text-primary" />
        </div>

        <div
          v-else-if="error"
          class="rounded-lg bg-red-500/10 border border-red-500/20 p-4"
        >
          <div class="flex items-center gap-2">
            <Icon name="ph:warning-circle" class="text-red-500" />
            <p class="text-red-500">{{ error }}</p>
          </div>
        </div>

        <div v-else class="flex-1 overflow-y-auto overflow-x-hidden pr-2">
          <div class="mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="institution in institutions"
                :key="institution.id"
                class="institution-card"
                @click="selectedInstitution = institution"
              >
                <div class="p-6">
                  <div class="flex gap-4 items-start">
                    <div
                      class="w-16 h-16 bg-background-secondary rounded-lg flex-shrink-0 overflow-hidden"
                    >
                      <NuxtImg
                        v-if="institution.logoUrl"
                        :src="institution.logoUrl"
                        class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        :alt="institution.name"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center"
                      >
                        <Icon
                          :name="getInstitutionIcon(institution.type)"
                          class="text-2xl text-primary opacity-50"
                        />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start">
                        <h3
                          class="text-xl font-medium text-text-primary mb-2 truncate"
                        >
                          {{ institution.name }}
                        </h3>
                        <span
                          class="px-2 py-1 rounded-full text-xs font-medium status-badge"
                          :class="
                            getIntegrationStatusClasses(
                              institution.integrationStatus
                            )
                          "
                        >
                          {{
                            formatIntegrationStatus(
                              institution.integrationStatus
                            )
                          }}
                        </span>
                      </div>
                      <p
                        v-if="institution.description"
                        class="text-text-secondary text-sm mb-3 line-clamp-2"
                      >
                        {{ institution.description }}
                      </p>
                      <div
                        class="flex items-center gap-4 text-text-secondary text-sm"
                      >
                        <div class="flex items-center">
                          <Icon name="ph:map-pin" class="mr-1" />
                          {{ institution.address.settlement }},
                          {{ institution.address.country }}
                        </div>
                        <div class="flex items-center">
                          <Icon name="ph:envelope" class="mr-1" />
                          {{ institution.email }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!institutions.length" class="empty-state">
              <Icon
                name="ph:buildings"
                class="text-4xl text-text-secondary mb-4"
              />
              <h3 class="text-lg font-medium text-text-primary mb-2">
                No Institutions Found
              </h3>
              <p class="text-text-secondary mb-4">
                Get started by adding your first institution
              </p>
              <n-button
                type="primary"
                class="transform hover:scale-105 transition-all duration-300"
                @click="navigateTo('/institutions/new')"
              >
                Add Institution
              </n-button>
            </div>
          </div>
        </div>
      </div>

      <Transition name="slide">
        <div v-if="selectedInstitution" class="details-panel">
          <div class="p-6 border-b border-border">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-text-primary">
                Institution Details
              </h2>
              <n-button circle tertiary @click="selectedInstitution = null">
                <template #icon><Icon name="ph:x" /></template>
              </n-button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div class="mb-6">
              <NuxtImg
                v-if="selectedInstitution.logoUrl"
                :src="selectedInstitution.logoUrl"
                class="w-full h-48 object-contain rounded-lg bg-background-secondary"
                :alt="selectedInstitution.name"
              />
            </div>

            <div class="space-y-6">
              <div>
                <label class="text-sm text-text-secondary block mb-1"
                  >Institution Type</label
                >
                <div class="flex items-center text-text-primary">
                  <Icon
                    :name="getInstitutionIcon(selectedInstitution.type)"
                    class="mr-2"
                  />
                  {{ formatInstitutionType(selectedInstitution.type) }}
                </div>
              </div>

              <div v-if="selectedInstitution.description">
                <label class="text-sm text-text-secondary block mb-1"
                  >Description</label
                >
                <p class="text-text-primary text-sm">
                  {{ selectedInstitution.description }}
                </p>
              </div>

              <div>
                <label class="text-sm text-text-secondary block mb-2"
                  >Contact Information</label
                >
                <div class="space-y-2">
                  <div class="flex items-center text-text-primary text-sm">
                    <Icon name="ph:envelope" class="mr-2" />{{
                      selectedInstitution.email
                    }}
                  </div>
                  <div class="flex items-center text-text-primary text-sm">
                    <Icon name="ph:phone" class="mr-2" />{{
                      selectedInstitution.phone
                    }}
                  </div>
                  <a
                    v-if="selectedInstitution.website"
                    :href="selectedInstitution.website"
                    target="_blank"
                    class="flex items-center text-primary text-sm hover:underline"
                  >
                    <Icon name="ph:globe" class="mr-2" />Visit Website
                  </a>
                </div>
              </div>

              <div>
                <label class="text-sm text-text-secondary block mb-2"
                  >Location</label
                >
                <div class="space-y-1">
                  <div class="flex items-start">
                    <Icon
                      name="ph:map-pin"
                      class="mr-2 mt-1 text-text-secondary"
                    />
                    <div class="text-text-primary text-sm">
                      <p>{{ selectedInstitution.address.street }}</p>
                      <p>{{ selectedInstitution.address.settlement }}</p>
                      <p>
                        {{ selectedInstitution.address.country }}
                        {{ selectedInstitution.address.postalCode }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selectedInstitution.accreditationTypes.length">
                <label class="text-sm text-text-secondary block mb-2"
                  >Accreditations</label
                >
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="accreditation in selectedInstitution.accreditationTypes"
                    :key="accreditation"
                    class="accreditation-tag"
                  >
                    {{ formatAccreditationType(accreditation) }}
                  </span>
                </div>
              </div>

              <div v-if="selectedInstitution.motto">
                <label class="text-sm text-text-secondary block mb-1"
                  >Motto</label
                >
                <p class="text-text-primary text-sm italic">
                  {{ selectedInstitution.motto }}
                </p>
              </div>

              <div>
                <label class="text-sm text-text-secondary block mb-1"
                  >Established</label
                >
                <p class="text-text-primary text-sm">
                  {{ formatDate(selectedInstitution.establishedDate) }}
                </p>
              </div>

              <div v-if="selectedInstitution.images?.length" class="pt-4">
                <label class="text-sm text-text-secondary block mb-2"
                  >Gallery</label
                >
                <div class="grid grid-cols-3 gap-2">
                  <NuxtImg
                    v-for="(image, i) in selectedInstitution.images"
                    :key="i"
                    :src="image"
                    :alt="selectedInstitution.name"
                    class="gallery-image"
                    @click="openCarousel(i)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <n-modal
      v-model:show="isCarouselOpen"
      preset="card"
      :style="{ maxWidth: '90vw' }"
      class="carousel-modal"
    >
      <n-carousel
        show-arrow
        dot-placement="bottom"
        :current-index="currentImageIndex"
        @update:current-index="currentImageIndex = $event"
      >
        <n-carousel-item
          v-for="(image, i) in selectedInstitution?.images"
          :key="i"
          class="flex items-center justify-center"
        >
          <NuxtImg
            :src="image"
            :alt="selectedInstitution?.name"
            class="max-h-[80vh] w-auto object-contain"
          />
        </n-carousel-item>
      </n-carousel>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-text-primary">Gallery</h3>
          <n-button circle tertiary @click="isCarouselOpen = false">
            <template #icon><Icon name="ph:x-bold" /></template>
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { AccreditationType } from '~/enums/accreditation-type.enum';
import { InstitutionType } from '~/enums/institution-type.enum';
import { IntegrationStatus } from '~/enums/integration-status.enum';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';

definePageMeta({
  layout: 'dashboard-layout',
});

const institutionStore = useInstitutionStore();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref<string | null>(null);
const selectedInstitution = ref<InstitutionResponseDto | null>(null);
const isCarouselOpen = ref(false);
const currentImageIndex = ref(0);

const institutions = computed(() => institutionStore.institutions);

const getInstitutionIcon = (type: InstitutionType): string => {
  switch (type) {
    case InstitutionType.PublicSchool:
      return 'ph:buildings';
    case InstitutionType.PrivateSchool:
      return 'ph:buildings';
    case InstitutionType.CharterSchool:
      return 'ph:buildings';
    case InstitutionType.InternationalSchool:
      return 'ph:buildings';
    case InstitutionType.PublicUniversity:
      return 'ph:buildings';
    case InstitutionType.PrivateUniversity:
      return 'ph:buildings';
    case InstitutionType.CommunityCollege:
      return 'ph:graduation-cap';
    case InstitutionType.TechnicalCollege:
      return 'ph:graduation-cap';
    case InstitutionType.LiberalArtsCollege:
      return 'ph:graduation-cap';
    case InstitutionType.PrimarySchool:
      return 'ph:buildings';
    case InstitutionType.SecondarySchool:
      return 'ph:buildings';
    case InstitutionType.HighSchool:
      return 'ph:buildings';
    case InstitutionType.VocationalSchool:
      return 'ph:monitor';
    case InstitutionType.SpecialEducationSchool:
      return 'ph:monitor';
    case InstitutionType.LanguageSchool:
      return 'ph:book-open';
    case InstitutionType.Other:
      return 'ph:book-open';
  }
};

const formatInstitutionType = (type: InstitutionType): string => {
  switch (type) {
    case InstitutionType.PublicSchool:
      return 'Public School';
    case InstitutionType.PrivateSchool:
      return 'Private School';
    case InstitutionType.CharterSchool:
      return 'Charter School';
    case InstitutionType.InternationalSchool:
      return 'International School';
    case InstitutionType.PublicUniversity:
    case InstitutionType.PrivateUniversity:
      return 'University';
    case InstitutionType.CommunityCollege:
      return 'Community College';
    case InstitutionType.TechnicalCollege:
      return 'Technical College';
    case InstitutionType.LiberalArtsCollege:
      return 'Liberal Arts College';
    case InstitutionType.PrimarySchool:
      return 'Primary School';
    case InstitutionType.SecondarySchool:
      return 'Secondary School';
    case InstitutionType.HighSchool:
      return 'High School';
    case InstitutionType.VocationalSchool:
      return 'Vocational School';
    case InstitutionType.SpecialEducationSchool:
      return 'Special Education Institution';
    case InstitutionType.LanguageSchool:
      return 'Language School';
    case InstitutionType.Other:
      return 'Other';
  }
};

const formatIntegrationStatus = (status: IntegrationStatus): string => {
  return IntegrationStatus[status].replace(/([A-Z])/g, ' $1').trim();
};

const formatAccreditationType = (type: AccreditationType): string => {
  return AccreditationType[type].replace(/([A-Z])/g, ' $1').trim();
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getIntegrationStatusClasses = (status: IntegrationStatus): string => {
  switch (status) {
    case IntegrationStatus.Active:
      return 'status-active';
    case IntegrationStatus.AdditionalDataSubmitted:
    case IntegrationStatus.RequiresVerification:
      return 'status-pending';
    case IntegrationStatus.Inactive:
    case IntegrationStatus.Denied:
      return 'status-inactive';
    default:
      return 'status-default';
  }
};

const openCarousel = (index: number) => {
  currentImageIndex.value = index;
  isCarouselOpen.value = true;
};

onMounted(async () => {
  try {
    loading.value = true;
    if (authStore.user?.id) {
      await institutionStore.fetchUserInstitutions(authStore.user.id);
    }
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Failed to fetch institutions';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(var(--color-text-secondary-rgb, 156, 163, 175), 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(var(--color-text-secondary-rgb, 156, 163, 175), 0.5);
}

.institution-card {
  background: linear-gradient(
    to bottom right,
    var(--color-background-card),
    var(--color-background-secondary)
  );
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
  margin-bottom: 1rem;
  min-width: 30.625rem;
}

.institution-card:hover {
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(
    to bottom right,
    var(--color-background-card),
    var(--color-background-secondary)
  );
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
}

.details-panel {
  width: 24rem;
  background-color: var(--color-background-card);
  max-height: 48rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
}

.accreditation-tag {
  padding: 0.25rem 0.75rem;
  background-color: rgba(var(--color-primary-rgb, 74, 222, 128), 0.1);
  color: var(--color-primary);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.gallery-image {
  border-radius: 0.5rem;
  width: 100%;
  height: 6rem;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.gallery-image:hover {
  opacity: 0.9;
}

/* Status badge styles */
.status-badge {
  font-weight: 500;
}

.status-active {
  background-color: rgba(var(--color-primary-rgb, 74, 222, 128), 0.1);
  color: var(--color-primary);
}

.status-pending {
  background-color: rgba(234, 179, 8, 0.1);
  color: #eab308; /* yellow-400 */
}

.status-inactive {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444; /* red-400 */
}

.status-default {
  background-color: rgba(156, 163, 175, 0.1);
  color: #9ca3af; /* gray-400 */
}

:deep(.n-modal) {
  background-color: var(--color-background-card) !important;
}

:deep(.n-button--primary-type) {
  background-color: var(--color-primary) !important;
}

:deep(.n-button--primary-type:hover) {
  background-color: var(--color-primary-hover) !important;
}
</style>
