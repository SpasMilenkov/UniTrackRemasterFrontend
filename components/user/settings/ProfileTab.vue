<template>
  <div>
    <!-- Profile Information Section -->
    <div class="bg-background-card rounded-lg p-8 border border-border mb-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">
          {{ t('settings.profile.title') }}
        </h2>
        <p class="text-text-secondary text-sm">
          {{ t('settings.profile.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div class="mb-6">
            <p class="text-text-secondary text-sm mb-1">
              {{ t('settings.profile.profilePicture') }}
            </p>
            <div class="flex items-end">
              <div
                class="h-20 w-20 rounded-full overflow-hidden bg-background-secondary border-2 border-border flex items-center justify-center"
              >
                <img
                  v-if="profileImageUrl"
                  :src="profileImageUrl"
                  alt="Profile"
                  class="h-full w-full object-cover"
                />
                <span v-else class="text-2xl font-bold text-primary">{{
                  userInitials
                }}</span>
              </div>
              <n-button
                text
                type="primary"
                class="ml-4"
                @click="$emit('openImageUpload')"
              >
                {{ t('settings.profile.changeImage') }}
              </n-button>
            </div>
          </div>

          <div class="space-y-4">
            <n-form-item :label="t('settings.profile.personalInfo.firstName')">
              <n-input
                :value="userData.firstName"
                :placeholder="
                  t('settings.profile.personalInfo.firstNamePlaceholder')
                "
                :disabled="!isEditing.profile"
                @update:value="updateUserData('firstName', $event)"
              />
            </n-form-item>

            <n-form-item :label="t('settings.profile.personalInfo.lastName')">
              <n-input
                :value="userData.lastName"
                :placeholder="
                  t('settings.profile.personalInfo.lastNamePlaceholder')
                "
                :disabled="!isEditing.profile"
                @update:value="updateUserData('lastName', $event)"
              />
            </n-form-item>
          </div>
        </div>

        <div class="space-y-4">
          <n-form-item :label="t('settings.profile.personalInfo.displayName')">
            <n-input
              :value="userData.displayName"
              :placeholder="
                t('settings.profile.personalInfo.displayNamePlaceholder')
              "
              :disabled="!isEditing.profile"
              @update:value="updateUserData('displayName', $event)"
            />
            <template #help>
              <span class="text-text-secondary text-xs">
                {{ t('settings.profile.personalInfo.displayNameHelp') }}
              </span>
            </template>
          </n-form-item>

          <n-form-item :label="t('settings.profile.personalInfo.email')">
            <n-input
              :value="userData.email"
              :placeholder="t('settings.profile.personalInfo.emailPlaceholder')"
              :disabled="!isEditing.profile"
              @update:value="updateUserData('email', $event)"
            />
          </n-form-item>

          <n-form-item :label="t('settings.profile.personalInfo.phone')">
            <n-input
              :value="userData.phone"
              :placeholder="t('settings.profile.personalInfo.phonePlaceholder')"
              :disabled="!isEditing.profile"
              @update:value="updateUserData('phone', $event)"
            />
          </n-form-item>
        </div>
      </div>

      <div class="flex justify-end mt-6">
        <n-button
          v-if="!isEditing.profile"
          type="primary"
          class="transform hover:scale-105 transition-all duration-300"
          @click="$emit('toggleEditing', 'profile')"
        >
          {{ t('settings.profile.buttons.editProfile') }}
        </n-button>
        <template v-else>
          <n-button
            type="primary"
            :loading="isSaving.profile"
            class="transform hover:scale-105 transition-all duration-300 mr-2"
            @click="$emit('saveProfile')"
          >
            {{ t('settings.profile.buttons.saveChanges') }}
          </n-button>
          <n-button @click="$emit('cancelEditing', 'profile')">
            {{ t('settings.profile.buttons.cancel') }}
          </n-button>
        </template>
      </div>
    </div>

    <!-- Organization Information -->
    <div
      v-if="isInstitutionLinked && institutionData"
      class="bg-background-card rounded-lg p-8 border border-border mb-6"
    >
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">
          {{ t('settings.organization.title') }}
        </h2>
        <p class="text-text-secondary text-sm">
          {{ t('settings.organization.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-4">
          <n-form-item :label="t('settings.organization.institutionLabel')">
            <n-input :value="institutionData.name" disabled />
          </n-form-item>

          <n-form-item :label="t('settings.organization.roleLabel')">
            <n-input :value="formatRoleName(userRole)" disabled />
          </n-form-item>
        </div>

        <div class="space-y-4">
          <n-form-item
            v-if="isAdminUser && adminData"
            :label="t('settings.organization.positionLabel')"
          >
            <n-input :value="adminData.position" disabled />
          </n-form-item>

          <n-form-item
            v-if="isAdminUser && adminData"
            :label="t('settings.organization.departmentLabel')"
          >
            <n-input
              :value="userData.department"
              :placeholder="t('settings.organization.departmentPlaceholder')"
              :disabled="!isEditing.organization"
              @update:value="updateUserData('department', $event)"
            />
          </n-form-item>

          <n-form-item
            v-if="isStudentUser && studentData"
            :label="t('settings.organization.gradeLabel')"
          >
            <n-input :value="studentData.gradeName" disabled />
          </n-form-item>
        </div>
      </div>

      <div
        v-if="
          isAdminUser &&
          adminData &&
          adminData.permissions &&
          adminData.permissions.length
        "
        class="mt-6"
      >
        <n-form-item :label="t('settings.organization.permissionsLabel')">
          <div class="flex flex-wrap gap-2">
            <n-tag
              v-for="permission in adminData.permissions"
              :key="permission"
              type="success"
              size="small"
            >
              {{ formatPermissionName(permission) }}
            </n-tag>
          </div>
        </n-form-item>
      </div>

      <div v-if="isAdminUser" class="flex justify-end mt-6">
        <n-button
          v-if="!isEditing.organization"
          type="primary"
          class="transform hover:scale-105 transition-all duration-300"
          @click="$emit('toggleEditing', 'organization')"
        >
          {{ t('settings.organization.buttons.editInfo') }}
        </n-button>
        <template v-else>
          <n-button
            type="primary"
            :loading="isSaving.organization"
            class="transform hover:scale-105 transition-all duration-300 mr-2"
            @click="$emit('saveOrganization')"
          >
            {{ t('settings.organization.buttons.saveChanges') }}
          </n-button>
          <n-button @click="$emit('cancelEditing', 'organization')">
            {{ t('settings.organization.buttons.cancel') }}
          </n-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '~/stores/user';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const userStore = useUserStore();

defineProps({
  adminData: {
    type: Object,
    default: () => null,
  },
  studentData: {
    type: Object,
    default: () => null,
  },
  institutionData: {
    type: Object,
    default: () => null,
  },
  userData: {
    type: Object,
    required: true,
  },
  isEditing: {
    type: Object,
    required: true,
  },
  isSaving: {
    type: Object,
    required: true,
  },
  profileImageUrl: {
    type: String,
    default: null,
  },
});

const emit = defineEmits([
  'toggleEditing',
  'cancelEditing',
  'saveProfile',
  'saveOrganization',
  'openImageUpload',
  'updateUserData',
]);

// Methods to handle input changes without mutating props
function updateUserData(field, value) {
  emit('updateUserData', { field, value });
}

// Computed properties
const userInitials = computed(() => {
  const firstName = userStore.userDetails?.firstName || '';
  const lastName = userStore.userDetails?.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
});

const isInstitutionLinked = computed(() => {
  return userStore.isInstitutionLinked;
});

const userRole = computed(() => {
  return userStore.userDetails?.role;
});

const isAdminUser = computed(() => {
  return userStore.userDetails?.role === 'admin';
});

const isStudentUser = computed(() => {
  return userStore.userDetails?.role === 'student';
});

// Methods
function formatRoleName(role) {
  if (!role) return t('settings.organization.roles.user');
  // If the role has a direct translation, use it
  const translationKey = `settings.organization.roles.${role.toLowerCase()}`;
  return t(translationKey);
}

function formatPermissionName(permission) {
  if (typeof permission !== 'string') return permission;

  // Check if there's a translation for this permission
  const translationKey = `settings.organization.permissions.${permission.toLowerCase()}`;
  const translation = t(translationKey);

  // If the translation key is the same as the output, it means no translation was found
  // In that case, format the permission string
  if (translation === translationKey) {
    return permission
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  return translation;
}
</script>