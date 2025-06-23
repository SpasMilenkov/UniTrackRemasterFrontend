<template>
  <div class="min-h-screen bg-background">
    <!-- Header Section -->
    <div class="bg-background-card border-b border-border p-6 mb-6">
      <div class="container mx-auto">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
        >
          <h1 class="text-2xl md:text-3xl font-bold text-gradient">
            {{ t('institutions.header.title') }}
          </h1>
        </div>

        <!-- Filter and Search -->
        <div
          class="flex flex-col md:flex-row gap-4 items-stretch md:items-center"
        >
          <div class="relative flex-1">
            <n-input
              v-model:value="searchQuery"
              :placeholder="t('institutions.search.placeholder')"
              class="bg-glass"
            >
              <template #prefix>
                <Icon name="ph:magnifying-glass" />
              </template>
            </n-input>
          </div>
          <n-button-group class="view-toggle">
            <n-button
              v-for="view in viewOptions"
              :key="view.value"
              :type="currentView === view.value ? 'primary' : 'default'"
              class="px-4 py-2 bg-glass"
              @click="currentView = view.value"
            >
              <template #icon>
                <Icon :name="view.icon" class="text-lg" />
              </template>
              <span class="ml-2 hidden md:inline">{{
                t(`institutions.views.${view.value}`)
              }}</span>
            </n-button>
          </n-button-group>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 pb-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex-1 flex items-center justify-center h-64">
        <n-spin size="large" />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="rounded-xl bg-red-500/10 border border-red-500/20 p-6 flex items-center gap-3"
      >
        <Icon
          name="ph:warning-circle"
          class="text-red-500 text-2xl flex-shrink-0"
        />
        <p class="text-red-500">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!institutions.length"
        class="flex items-center justify-center h-64"
      >
        <div class="bg-glass max-w-lg mx-auto text-center p-8 rounded-xl">
          <Icon name="ph:buildings" class="text-6xl text-primary mb-6" />
          <h3 class="text-2xl font-bold text-text-primary mb-3">
            {{ t('institutions.states.empty.title') }}
          </h3>
          <p class="text-text-secondary mb-6">
            {{ t('institutions.states.empty.description') }}
          </p>
        </div>
      </div>

      <!-- Grid View -->
      <TransitionGroup
        v-else-if="currentView === 'grid'"
        name="institutions-grid"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="(institution, index) in filteredInstitutions"
          :key="institution.id"
          class="animate-fade-in"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <n-card
            class="bg-glass bg-glass-hover hover-elevate h-full flex flex-col"
          >
            <!-- Card Header -->
            <div class="flex items-center mb-4">
              <div
                class="w-14 h-14 rounded-xl bg-emerald-glow mr-4 flex-shrink-0 border border-primary/20 flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="institution.logoUrl"
                  :src="institution.logoUrl"
                  class="w-10 h-10 object-contain"
                  :alt="institution.name"
                />
                <div
                  v-else
                  class="flex items-center justify-center w-full h-full bg-primary/10"
                >
                  <span class="text-xs font-medium text-primary uppercase">
                    {{ institution.name.substring(0, 2) }}
                  </span>
                </div>
              </div>
              <div>
                <h3 class="font-bold text-text-primary text-xl">
                  {{ institution.name }}
                </h3>
                <div class="flex items-center text-text-secondary text-sm">
                  <Icon
                    :name="getInstitutionIcon(institution.type)"
                    class="mr-1 w-4 h-4"
                  />
                  {{ formatInstitutionType(institution.type) }}
                </div>
              </div>
            </div>

            <!-- Card Content -->
            <div class="text-sm text-text-secondary mb-6 flex-grow">
              <div class="flex items-start mb-2 gap-2">
                <Icon
                  name="ph:map-pin"
                  class="w-4 h-4 flex-shrink-0 text-primary mt-0.5"
                />
                <div>
                  {{ institution.address?.settlement }},
                  {{ institution.address?.country }}
                </div>
              </div>
              <div class="flex items-start gap-2">
                <Icon
                  name="ph:envelope"
                  class="w-4 h-4 flex-shrink-0 text-primary mt-0.5"
                />
                <div>{{ institution.email }}</div>
              </div>
            </div>

            <!-- Card Footer -->
            <n-button
              type="primary"
              class="w-full"
              @click="navigateToDashboard(institution)"
            >
              <div class="flex items-center justify-center gap-2">
                <span>{{ t('institutions.actions.dashboard') }}</span>
                <Icon name="ph:arrow-right-bold" />
              </div>
            </n-button>
          </n-card>
        </div>
      </TransitionGroup>

      <!-- List View -->
      <div v-else-if="currentView === 'list'" class="space-y-4">
        <n-collapse
          v-model:expanded-names="expandedNames"
          accordion
          :theme-overrides="collapseThemeOverrides"
        >
          <TransitionGroup name="institutions-list">
            <div
              v-for="(institution, index) in filteredInstitutions"
              :key="institution.id"
              class="animate-fade-in"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <n-collapse-item
                :name="institution.id"
                class="bg-glass bg-glass-hover rounded-xl overflow-hidden mb-4"
              >
                <template #header>
                  <div class="flex items-center w-full py-3 px-1">
                    <div
                      class="w-12 h-12 rounded-xl bg-emerald-glow mr-4 flex-shrink-0 border border-primary/20 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        v-if="institution.logoUrl"
                        :src="institution.logoUrl"
                        class="w-8 h-8 object-contain"
                        :alt="institution.name"
                      />
                      <div
                        v-else
                        class="flex items-center justify-center w-full h-full bg-primary/10"
                      >
                        <span
                          class="text-xs font-medium text-primary uppercase"
                        >
                          {{ institution.name.substring(0, 2) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="font-bold text-text-primary">
                        {{ institution.name }}
                      </div>
                      <div
                        class="text-sm text-text-secondary flex items-center"
                      >
                        <Icon
                          :name="getInstitutionIcon(institution.type)"
                          class="mr-1 w-4 h-4"
                        />
                        {{ formatInstitutionType(institution.type) }}
                      </div>
                    </div>
                    <div
                      class="hidden md:flex items-center text-text-secondary text-sm mr-4 gap-2"
                    >
                      <Icon name="ph:map-pin" class="w-4 h-4 text-primary" />
                      {{ institution.address?.settlement }},
                      {{ institution.address?.country }}
                    </div>
                    <div class="flex gap-2 ml-2">
                      <n-button
                        size="small"
                        secondary
                        @click.stop="navigateToDashboard(institution)"
                      >
                        <div class="flex items-center gap-1">
                          <Icon name="ph:layout-bold" class="w-4 h-4" />
                          <span class="hidden sm:inline">{{
                            t('institutions.actions.dashboard')
                          }}</span>
                        </div>
                      </n-button>
                      <n-button
                        size="small"
                        type="primary"
                        @click.stop="expandItem(institution.id)"
                      >
                        <Icon name="ph:info" class="w-4 h-4" />
                      </n-button>
                    </div>
                  </div>
                </template>

                <div class="p-5">
                  <n-tabs type="line" animated>
                    <n-tab-pane
                      name="details"
                      :tab="t('institutions.tabs.details')"
                    >
                      <div class="grid md:grid-cols-2 gap-6 mt-4">
                        <!-- Description -->
                        <div
                          v-if="institution.description"
                          class="md:col-span-2"
                        >
                          <label
                            class="text-sm text-text-secondary block mb-2 font-medium"
                            >{{ t('institutions.details.description') }}</label
                          >
                          <p class="text-text-primary">
                            {{ institution.description }}
                          </p>
                        </div>

                        <!-- Details Grid Section -->
                        <div class="bg-background-secondary/30 rounded-xl p-4">
                          <label
                            class="text-sm text-text-secondary block mb-2 font-medium"
                            >{{ t('institutions.details.type') }}</label
                          >
                          <div class="flex items-center text-text-primary">
                            <Icon
                              :name="getInstitutionIcon(institution.type)"
                              class="mr-2 text-primary"
                            />
                            {{ formatInstitutionType(institution.type) }}
                          </div>
                        </div>

                        <!-- Motto -->
                        <div
                          v-if="institution.motto"
                          class="bg-background-secondary/30 rounded-xl p-4"
                        >
                          <label
                            class="text-sm text-text-secondary block mb-2 font-medium"
                            >{{ t('institutions.details.motto') }}</label
                          >
                          <p class="text-text-primary italic">
                            "{{ institution.motto }}"
                          </p>
                        </div>

                        <!-- Established Date -->
                        <div class="bg-background-secondary/30 rounded-xl p-4">
                          <label
                            class="text-sm text-text-secondary block mb-2 font-medium"
                            >{{ t('institutions.details.established') }}</label
                          >
                          <p class="text-text-primary">
                            {{ formatDate(institution.establishedDate) }}
                          </p>
                        </div>

                        <!-- Contact Information -->
                        <div class="bg-background-secondary/30 rounded-xl p-4">
                          <label
                            class="text-sm text-text-secondary block mb-2 font-medium"
                            >{{ t('institutions.details.contact') }}</label
                          >
                          <div class="space-y-3">
                            <div class="flex items-center text-text-primary">
                              <Icon
                                name="ph:envelope"
                                class="mr-2 text-primary"
                              />
                              {{ institution.email }}
                            </div>
                            <div class="flex items-center text-text-primary">
                              <Icon name="ph:phone" class="mr-2 text-primary" />
                              {{ institution.phone }}
                            </div>
                            <a
                              v-if="institution.website"
                              :href="institution.website"
                              target="_blank"
                              class="flex items-center text-primary hover:underline"
                            >
                              <Icon name="ph:globe" class="mr-2" />{{
                                t('institutions.details.visitWebsite')
                              }}
                            </a>
                          </div>
                        </div>

                        <!-- Address -->
                        <div class="bg-background-secondary/30 rounded-xl p-4">
                          <label
                            class="text-sm text-text-secondary block mb-2 font-medium"
                            >{{ t('institutions.details.location') }}</label
                          >
                          <div class="flex items-start">
                            <Icon
                              name="ph:map-pin"
                              class="mr-2 mt-1 text-primary"
                            />
                            <div class="text-text-primary">
                              <p>{{ institution.address.street }}</p>
                              <p>{{ institution.address.settlement }}</p>
                              <p>
                                {{ institution.address.country }}
                                {{ institution.address.postalCode }}
                              </p>
                            </div>
                          </div>
                        </div>

                        <!-- Accreditations -->
                        <div
                          v-if="institution.accreditationTypes?.length"
                          class="md:col-span-2 bg-background-secondary/30 rounded-xl p-4"
                        >
                          <label
                            class="text-sm text-text-secondary block mb-2 font-medium"
                            >{{
                              t('institutions.details.accreditations')
                            }}</label
                          >
                          <div class="flex flex-wrap gap-2">
                            <n-tag
                              v-for="accreditation in institution.accreditationTypes"
                              :key="accreditation"
                              type="success"
                              size="small"
                              class="px-3 py-1"
                            >
                              {{ formatAccreditationType(accreditation) }}
                            </n-tag>
                          </div>
                        </div>
                      </div>

                      <!-- Action Buttons -->
                      <div class="flex justify-end gap-2 mt-6">
                        <n-button
                          type="primary"
                          @click="navigateToDashboard(toRaw(institution))"
                        >
                          <div class="flex items-center gap-2">
                            <span>{{
                              t('institutions.actions.goToDashboard')
                            }}</span>
                            <Icon name="ph:arrow-right-bold" />
                          </div>
                        </n-button>
                      </div>
                    </n-tab-pane>

                    <n-tab-pane
                      v-if="institution.images?.length"
                      name="gallery"
                      :tab="t('institutions.tabs.gallery')"
                    >
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div
                          v-for="(image, i) in institution.images"
                          :key="i"
                          class="aspect-video rounded-xl overflow-hidden cursor-pointer hover-elevate border border-primary/10"
                          @click="openCarousel(institution, i)"
                        >
                          <img
                            :src="image"
                            :alt="institution.name"
                            class="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </n-tab-pane>
                  </n-tabs>
                </div>
              </n-collapse-item>
            </div>
          </TransitionGroup>
        </n-collapse>
      </div>
    </div>

    <!-- Image Carousel Modal -->
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
          v-for="(image, i) in carouselImages"
          :key="i"
          class="flex items-center justify-center"
        >
          <img
            :src="image"
            :alt="carouselTitle"
            class="max-h-[80vh] max-w-full object-contain"
          />
        </n-carousel-item>
      </n-carousel>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-text-primary">
            {{ carouselTitle }}
          </h3>
          <n-button circle tertiary @click="isCarouselOpen = false">
            <template #icon><Icon name="ph:x-bold" /></template>
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { AccreditationType } from '~/enums/accreditation-type.enum';
import { InstitutionType } from '~/enums/institution-type.enum';
import { UserRoleType } from '~/enums/user-role.enum';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';

definePageMeta({
  layout: 'dashboard-layout',
});

const router = useRouter();
const { t } = useI18n();
const institutionStore = useInstitutionStore();
const authStore = useAuthStore();

// State
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const currentView = ref('grid'); // 'list' or 'grid'
const expandedNames = ref<string[]>([]);
const isCarouselOpen = ref(false);
const currentImageIndex = ref(0);
const carouselImages = ref<string[]>([]);
const carouselTitle = ref('');

// View options
const viewOptions = [
  { value: 'list', icon: 'ph:list-bullets' },
  { value: 'grid', icon: 'ph:grid-four' },
];

// Collapse theme overrides
const collapseThemeOverrides = {
  borderRadius: '12px',
  headerPadding: '16px',
  arrowColor: 'var(--color-primary)',
};

// Computed
const institutions = computed(() => institutionStore.institutions || []);

const filteredInstitutions = computed(() => {
  let result = [...institutions.value];

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (inst) =>
        inst.name.toLowerCase().includes(query) ||
        inst.description?.toLowerCase().includes(query) ||
        inst.address?.settlement.toLowerCase().includes(query) ||
        inst.address?.country.toLowerCase().includes(query)
    );
  }

  return result;
});

// Check if user is SuperAdmin
const isSuperAdmin = computed(() => {
  return authStore.user?.role === UserRoleType.SuperAdmin;
});

// Methods
const expandItem = (id: string) => {
  // Toggle the expanded state
  if (expandedNames.value.includes(id)) {
    expandedNames.value = expandedNames.value.filter((name) => name !== id);
  } else {
    expandedNames.value = [id]; // Since using accordion mode
  }
};

const navigateToDashboard = (institution: any) => {
  // Convert readonly to raw object
  const rawInstitution = toRaw(institution) as InstitutionResponseDto;
  institutionStore.setActiveInstitution(rawInstitution);
  router.push({
    path: `/institutions/${institutionStore.activeInstitution?.id}/dashboard`,
    query: { institutionId: rawInstitution.id },
  });
};

const openCarousel = (institution: any, index: number) => {
  const rawInstitution = toRaw(institution) as InstitutionResponseDto;
  if (rawInstitution.images && rawInstitution.images.length > 0) {
    carouselImages.value = rawInstitution.images;
    carouselTitle.value = rawInstitution.name;
    currentImageIndex.value = index;
    isCarouselOpen.value = true;
  }
};

const getInstitutionIcon = (type: InstitutionType): string => {
  switch (type) {
    case InstitutionType.PublicSchool:
    case InstitutionType.PrivateSchool:
    case InstitutionType.CharterSchool:
    case InstitutionType.InternationalSchool:
    case InstitutionType.PrimarySchool:
    case InstitutionType.SecondarySchool:
    case InstitutionType.HighSchool:
      return 'ph:buildings';
    case InstitutionType.PublicUniversity:
    case InstitutionType.PrivateUniversity:
      return 'ph:graduation-cap';
    case InstitutionType.CommunityCollege:
    case InstitutionType.TechnicalCollege:
    case InstitutionType.LiberalArtsCollege:
      return 'ph:books';
    case InstitutionType.VocationalSchool:
    case InstitutionType.SpecialEducationSchool:
      return 'ph:monitor';
    case InstitutionType.LanguageSchool:
      return 'ph:translate';
    default:
      return 'ph:building';
  }
};

const formatInstitutionType = (type: InstitutionType): string => {
  return t(`institutions.types.${InstitutionType[type]}`);
};

const formatAccreditationType = (type: AccreditationType): string => {
  return t(`institutions.accreditations.${AccreditationType[type]}`);
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Fetch data
onMounted(async () => {
  try {
    loading.value = true;

    // Check if user is SuperAdmin first
    if (isSuperAdmin.value) {
      console.log(
        'User is SuperAdmin, redirecting to super admin dashboard...'
      );
      await navigateTo('/super-admins/dashboard');
      return;
    }

    // For regular users, fetch their institutions
    if (authStore.user?.id) {
      console.log('Fetching institutions for regular user:', authStore.user.id);
      await institutionStore.fetchUserInstitutions(authStore.user.id);
    } else {
      throw new Error(t('institutions.errors.noUserId'));
    }
  } catch (err) {
    console.error('Error in institutions page:', err);
    error.value =
      err instanceof Error ? err.message : t('institutions.errors.fetchFailed');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Custom scrollbar */
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

/* Text gradient */
.text-gradient {
  background-image: linear-gradient(
    to right,
    var(--color-primary, #4ade80),
    var(--color-secondary, #3b82f6)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* List and Grid Transitions */
.institutions-list-enter-active,
.institutions-list-leave-active,
.institutions-grid-enter-active,
.institutions-grid-leave-active {
  transition: all 0.3s ease;
}

.institutions-list-enter-from,
.institutions-list-leave-to,
.institutions-grid-enter-from,
.institutions-grid-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
