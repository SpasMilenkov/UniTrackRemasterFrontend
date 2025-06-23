<!-- components/InstitutionCard.vue -->
<template>
  <div class="institution-card group" @click="handleCardClick">
    <div class="p-6">
      <div class="flex gap-4 items-start">
        <!-- Logo section remains the same -->
        <div
          class="w-16 h-16 bg-background-secondary rounded-lg flex-shrink-0 overflow-hidden"
        >
          <NuxtImg
            v-if="institution.logoUrl"
            :src="institution.logoUrl"
            class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            :alt="institution.name"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Icon
              :name="getInstitutionIcon(institution.type)"
              class="text-2xl text-primary opacity-50"
            />
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <!-- Header section remains the same -->
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-medium text-text-primary mb-2 truncate">
              {{ institution.name }}
            </h3>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium status-badge"
              :class="
                getIntegrationStatusClasses(institution.integrationStatus)
              "
            >
              {{ formatIntegrationStatus(institution.integrationStatus) }}
            </span>
          </div>

          <!-- Description section remains the same -->
          <p
            v-if="institution.description"
            class="text-text-secondary text-sm mb-3 line-clamp-2"
          >
            {{ institution.description }}
          </p>

          <!-- Contact info section remains the same -->
          <div class="flex items-center gap-4 text-text-secondary text-sm">
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

          <!-- User Roles Section - New Addition -->
          <div v-if="userRoles.length > 0" class="mt-2 mb-2">
            <div class="flex flex-wrap gap-1">
              <n-tag
                v-for="role in userRoles"
                :key="role"
                size="small"
                :type="getRoleTagType(role)"
              >
                {{ formatUserRole(role) }}
              </n-tag>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="mt-4 flex flex-col justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <!-- Role selector dropdown when multiple roles exist -->
            <div v-if="userRoles.length > 1" class="mb-2">
              <n-select
                v-model:value="selectedRole"
                size="small"
                :options="userRolesOptions"
                placeholder="Select Role"
              />
            </div>

            <div class="flex gap-2">
              <n-button
                size="small"
                type="primary"
                class="transform hover:scale-105 transition-all duration-300"
                @click.stop="navigateToProfile"
              >
                <template #icon>
                  <Icon name="ph:user" class="mr-1" />
                </template>
                View Profile
              </n-button>

              <n-button
                size="small"
                type="default"
                class="transform hover:scale-105 transition-all duration-300"
                @click.stop="accessDashboard"
              >
                <template #icon>
                  <Icon name="ph:layout" class="mr-1" />
                </template>
                Dashboard
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IntegrationStatus } from '~/enums/integration-status.enum';
import { InstitutionType } from '~/enums/institution-type.enum';
import { UserRoleType } from '~/enums/user-role.enum';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';

const props = defineProps<{
  institution: InstitutionResponseDto;
}>();

const emit = defineEmits<{
  (e: 'select', institution: InstitutionResponseDto): void;
}>();

const router = useRouter();
const institutionStore = useInstitutionStore();
const userStore = useUserStore();

// Get user roles for this institution
const userRoles = computed(() => {
  if (!userStore.userDetails?.institutionRoles) return [];

  const roles = userStore.userDetails.institutionRoles.get(
    props.institution.id
  );
  return roles || [];
});

// Format roles for dropdown options
const userRolesOptions = computed(() => {
  return userRoles.value.map((role) => ({
    label: formatUserRole(role),
    value: role,
  }));
});

// Selected role (default to first available or current role)
const selectedRole = ref<UserRoleType | null>(
  userStore.currentInstitutionRole ||
    (userRoles.value.length > 0 ? userRoles.value[0] : null)
);

const handleCardClick = () => {
  emit('select', props.institution);
};

const navigateToProfile = () => {
  // Set the active institution in the store
  institutionStore.setActiveInstitution(props.institution);

  // If we have a selected role, set it as current
  if (selectedRole.value) {
    userStore.setCurrentInstitutionRole(
      props.institution.id,
      selectedRole.value
    );
  }

  // Navigate to the profile page with the institution ID
  router.push(`/institutions/${props.institution.id}/profile`);
};

const accessDashboard = async () => {
  // Set the active institution in the store
  institutionStore.setActiveInstitution(props.institution);

  // If we have a selected role, set it as current
  if (selectedRole.value) {
    userStore.setCurrentInstitutionRole(
      props.institution.id,
      selectedRole.value
    );
  }

  // Navigate to the dashboard router which will determine the appropriate dashboard
  router.push(`/institutions/${props.institution.id}/dashboard`);
};

// Format user role for display
const formatUserRole = (role: UserRoleType): string => {
  switch (role) {
    case UserRoleType.SuperAdmin:
      return 'Super Admin';
    case UserRoleType.Admin:
      return 'Admin';
    case UserRoleType.Teacher:
      return 'Teacher';
    case UserRoleType.Student:
      return 'Student';
    case UserRoleType.Parent:
      return 'Parent';
    default:
      return String(role);
  }
};

// Get tag type for role
const getRoleTagType = (role: UserRoleType) => {
  switch (role) {
    case UserRoleType.SuperAdmin:
      return 'error';
    case UserRoleType.Admin:
      return 'info';
    case UserRoleType.Teacher:
      return 'success';
    case UserRoleType.Student:
      return 'warning';
    case UserRoleType.Parent:
      return 'default';
    default:
      return 'default';
  }
};

const getInstitutionIcon = (type: InstitutionType): string => {
  // Existing function remains the same
  switch (type) {
    case InstitutionType.PublicSchool:
      return 'ph:buildings';
    // ... rest of the cases remain the same
    default:
      return 'ph:book-open';
  }
};

const formatIntegrationStatus = (status: IntegrationStatus): string => {
  return IntegrationStatus[status].replace(/([A-Z])/g, ' $1').trim();
};

const getIntegrationStatusClasses = (status: IntegrationStatus): string => {
  // Existing function remains the same
  switch (status) {
    case IntegrationStatus.Active:
      return 'status-active';
    // ... rest of the cases remain the same
    default:
      return 'status-default';
  }
};
</script>

<style scoped>
/* Existing styles remain the same */
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
}

.institution-card:hover {
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
  transform: translateY(-2px);
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
</style>
