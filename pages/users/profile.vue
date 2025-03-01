<template>
  <div class="bg-background min-h-screen text-text-primary">
    <div class="container mx-auto py-8 px-4">
      <h1 class="text-2xl font-bold mb-10">
        {{ t('settings.title') }}
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Left sidebar navigation -->
        <div class="lg:col-span-1">
          <div class="space-y-2">
            <n-menu
              v-model:value="activeSection"
              :options="menuOptions"
              :indent="12"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :root-indent="18"
              class="account-menu"
            />
          </div>
        </div>

        <!-- Right content area -->
        <div class="lg:col-span-3 transition-all duration-300">
          <!-- Loading state -->
          <div v-if="loading" class="flex justify-center items-center h-64">
            <n-spin size="large" />
          </div>

          <!-- Error state -->
          <div
            v-else-if="error"
            class="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg"
          >
            <p>{{ error }}</p>
            <n-button text type="primary" class="mt-2" @click="fetchData">
              {{ t('settings.tryAgain') }}
            </n-button>
          </div>

          <!-- Content sections -->
          <client-only>
            <div v-if="authStore.user && userStore.userDetails">
              <!-- Profile Tab -->
              <ProfileTab
                v-if="activeSection === 'profile'"
                v-motion
                :initial="{ opacity: 0, y: 50 }"
                :enter="{ opacity: 1, y: 0, transition: { duration: 300 } }"
                :admin-data="adminData"
                :student-data="studentData"
                :institution-data="institutionData"
                :user-data="formData"
                :is-editing="isEditing"
                :is-saving="isSaving"
                :profile-image-url="profileImageUrl"
                @toggle-editing="toggleEditing"
                @cancel-editing="cancelEditing"
                @save-profile="saveProfile"
                @save-organization="saveOrganization"
                @open-image-upload="openImageUploadModal"
                @update-user-data="updateUserData"
              />

              <!-- Security Tab -->
              <SecurityTab
                v-if="activeSection === 'security'"
                v-motion
                :initial="{ opacity: 0, y: 50 }"
                :enter="{ opacity: 1, y: 0, transition: { duration: 300 } }"
                :password-form="passwordForm"
                :password-form-ref="passwordFormRef"
                :password-rules="passwordRules"
                :is-saving="isSaving"
                @change-password="changePassword"
                @update-password-field="updatePasswordField"
              />

              <!-- Appearance Tab -->
              <AppearanceTab
                v-if="activeSection === 'appearance'"
                v-motion
                :initial="{ opacity: 0, y: 50 }"
                :enter="{ opacity: 1, y: 0, transition: { duration: 300 } }"
                :accent-colors="accentColors"
                @set-theme="setTheme"
                @set-accent-color="setAccentColor"
              />

              <!-- Privacy Tab -->
              <PrivacyTab
                v-if="activeSection === 'privacy'"
                v-motion
                :initial="{ opacity: 0, y: 50 }"
                :enter="{ opacity: 1, y: 0, transition: { duration: 300 } }"
                :privacy-settings="privacySettings"
                :visibility-options="visibilityOptions"
                :is-saving="isSaving"
                @save-privacy-settings="savePrivacySettings"
                @update-privacy-setting="updatePrivacySetting"
              />
            </div>
          </client-only>
        </div>
      </div>
    </div>

    <!-- Profile Image Upload Modal -->
    <client-only>
      <n-modal v-model:show="showImageUpload" preset="card" class="max-w-md">
        <template #header>
          <div class="text-lg font-medium">
            {{ t('settings.profileImage.modalTitle') }}
          </div>
        </template>

        <div class="py-4">
          <div class="flex justify-center mb-6">
            <div
              class="h-32 w-32 rounded-full overflow-hidden bg-background-secondary border-2 border-primary flex items-center justify-center"
            >
              <img
                v-if="profileImagePreview"
                :src="profileImagePreview"
                :alt="t('settings.profileImage.previewAlt')"
                class="h-full w-full object-cover"
              />
              <img
                v-else-if="profileImageUrl"
                :src="profileImageUrl"
                :alt="t('settings.profileImage.currentAlt')"
                class="h-full w-full object-cover"
              />
              <span v-else class="text-4xl font-bold text-primary">{{
                userInitials
              }}</span>
            </div>
          </div>

          <n-upload
            ref="upload"
            :custom-request="handleFileSelect"
            :show-file-list="false"
            accept="image/*"
            :max="1"
          >
            <n-button type="primary" class="w-full">{{
              t('settings.profileImage.selectButton')
            }}</n-button>
          </n-upload>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <n-button
              type="primary"
              :disabled="!newProfileImage || isUploading"
              :loading="isUploading"
              @click="uploadProfileImage"
            >
              {{ t('settings.profileImage.uploadButton') }}
            </n-button>
            <n-button @click="closeImageUpload">{{
              t('settings.profileImage.cancelButton')
            }}</n-button>
          </div>
        </template>
      </n-modal>
    </client-only>
  </div>
</template>

<script setup>
import { ref, computed, reactive, h, onMounted, nextTick } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useUserStore } from '~/stores/user';
import { useThemeStore } from '~/stores/theme';
import { useMessage } from 'naive-ui';
import { Icon } from '#components';
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import ProfileTab from '~/components/user/settings/ProfileTab.vue';
import SecurityTab from '~/components/user/settings/SecurityTab.vue';
import AppearanceTab from '~/components/user/settings/AppearanceTab.vue';
import PrivacyTab from '~/components/user/settings/PrivacyTab.vue';
// Get i18n translations
const { t } = useI18n();

// Create message instance
const message = useMessage();

// Stores
const authStore = useAuthStore();
const userStore = useUserStore();
const themeStore = useThemeStore();

// State
const activeSection = ref('profile');
const error = ref(null);
const isLoading = ref(true);
const showImageUpload = ref(false);
const newProfileImage = ref(null);
const profileImageUrl = ref(null);
const profileImagePreview = ref(null);
const isUploading = ref(false);
const loading = computed(() => isLoading.value || userStore.loading);
const passwordFormRef = ref(null);

// Multiple editing sections
const isEditing = reactive({
  profile: false,
  organization: false,
});

const isSaving = reactive({
  profile: false,
  organization: false,
  password: false,
  privacy: false,
});

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  displayName: '',
  email: '',
  phone: '',
  department: '',
});

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Privacy settings
const privacySettings = reactive({
  dataAnalytics: true,
  emailUpdates: true,
  marketingEmails: false,
  profileVisibility: 'institution',
});

// Additional data stores for role-specific information
const adminData = ref(null);
const studentData = ref(null);
const institutionData = ref(null);

// Validation rules
const passwordRules = {
  currentPassword: {
    required: true,
    message: t('settings.security.validation.currentPasswordRequired'),
    trigger: 'blur',
  },
  newPassword: [
    {
      required: true,
      message: t('settings.security.validation.newPasswordRequired'),
      trigger: 'blur',
    },
    {
      min: 8,
      message: t('settings.security.validation.passwordMinLength'),
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: t('settings.security.validation.confirmPasswordRequired'),
      trigger: 'blur',
    },
    {
      validator: (rule, value) => value === passwordForm.newPassword,
      message: t('settings.security.validation.passwordsDoNotMatch'),
      trigger: 'blur',
    },
  ],
};

function renderIcon(iconName) {
  return () => h(Icon, { name: iconName, size: '18' });
}

// Menu options
const menuOptions = computed(() => [
  {
    label: t('settings.menu.profile'),
    key: 'profile',
    icon: renderIcon('mdi:account-outline'),
  },
  {
    label: t('settings.menu.security'),
    key: 'security',
    icon: renderIcon('mdi:shield-lock-outline'),
  },
  {
    label: t('settings.menu.appearance'),
    key: 'appearance',
    icon: renderIcon('mdi:palette-outline'),
  },
  {
    label: t('settings.menu.privacy'),
    key: 'privacy',
    icon: renderIcon('mdi:eye-off-outline'),
  },
]);

// Visibility options
const visibilityOptions = computed(() => [
  {
    label: t('settings.privacy.visibilityOptions.everyone'),
    value: 'institution',
  },
  {
    label: t('settings.privacy.visibilityOptions.department'),
    value: 'department',
  },
  {
    label: t('settings.privacy.visibilityOptions.admins'),
    value: 'admins',
  },
]);

// Accent colors
const accentColors = [
  { name: 'green', value: '#4ade80' }, // Current primary
  { name: 'blue', value: '#3b82f6' }, // Current secondary
  { name: 'purple', value: '#8b5cf6' },
  { name: 'pink', value: '#ec4899' },
  { name: 'red', value: '#ef4444' },
  { name: 'amber', value: '#f59e0b' },
  { name: 'teal', value: '#14b8a6' },
];

// Computed properties
const userInitials = computed(() => {
  const firstName = userStore.userDetails?.firstName || '';
  const lastName = userStore.userDetails?.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
});

const isAdminUser = computed(() => {
  return userStore.userDetails?.role === 'admin';
});

const isStudentUser = computed(() => {
  return userStore.userDetails?.role === 'student';
});

// Methods
function toggleEditing(section) {
  isEditing[section] = true;

  if (section === 'profile') {
    // Initialize form data
    formData.firstName = userStore.userDetails?.firstName || '';
    formData.lastName = userStore.userDetails?.lastName || '';
    formData.displayName = userStore.displayName || '';
    formData.email = userStore.userDetails?.email || '';
    formData.phone = adminData.value?.phone || '';
  } else if (section === 'organization') {
    formData.department = adminData.value?.department || '';
  }
}

function cancelEditing(section) {
  isEditing[section] = false;
}

function updateUserData({ field, value }) {
  if (formData[field] !== undefined) {
    formData[field] = value;
  }
}

function updatePasswordField({ field, value }) {
  if (passwordForm[field] !== undefined) {
    passwordForm[field] = value;
  }
}

function updatePrivacySetting({ field, value }) {
  if (privacySettings[field] !== undefined) {
    privacySettings[field] = value;
  }
}

function openImageUploadModal() {
  showImageUpload.value = true;
}

function closeImageUpload() {
  showImageUpload.value = false;
  profileImagePreview.value = null;
  newProfileImage.value = null;
}

function handleFileSelect({ file }) {
  // This handles the n-upload custom request
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    profileImagePreview.value = e.target.result;
    newProfileImage.value = file.file;
  };
  reader.readAsDataURL(file.file);

  return {
    status: 'success',
  };
}

async function uploadProfileImage() {
  if (!newProfileImage.value) return;

  try {
    isUploading.value = true;

    const userId = authStore.user.id;
    const formData = new FormData();
    formData.append('avatar', newProfileImage.value);

    // Upload the image
    const result = await useNuxtApp().$api.post(
      `/User/${userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Update UI
    profileImageUrl.value = result.url || profileImagePreview.value;

    // Close modal
    closeImageUpload();

    // Show success message
    message.success(t('settings.profileImage.uploadSuccess'));
  } catch (error) {
    console.error('Failed to upload profile image:', error);
    message.error(t('settings.profileImage.uploadError'));
  } finally {
    isUploading.value = false;
  }
}

async function updateAdminProfile(userId, data) {
  // Update the admin profile using API client
  await useNuxtApp().$api.put(`/Admin/${adminData.value.id}`, {
    ...data,
    id: adminData.value.id,
  });
}

async function updateStudentProfile(userId, data) {
  // Update the student profile using API client
  await useNuxtApp().$api.put(`/Students/${studentData.value.id}`, {
    ...data,
    id: studentData.value.id,
  });
}

async function updateUserProfile(userId, data) {
  // Generic user update
  await useNuxtApp().$api.put(`/User/${userId}`, data);
}

async function saveProfile() {
  try {
    isSaving.profile = true;

    const userId = authStore.user.id;

    if (!userId) {
      throw new Error(t('settings.profile.errors.userIdNotFound'));
    }

    // Prepare updated data
    const updatedData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    };

    // Call the appropriate API endpoint based on user role
    if (isAdminUser.value && adminData.value) {
      await updateAdminProfile(userId, updatedData);
    } else if (isStudentUser.value && studentData.value) {
      await updateStudentProfile(userId, updatedData);
    } else {
      // Generic user update
      await updateUserProfile(userId, updatedData);
    }

    // Refresh user data
    await fetchData();

    // Reset state
    isEditing.profile = false;

    // Show success message
    message.success(t('settings.profile.updateSuccess'));
  } catch (err) {
    console.error(err);
    message.error(err.message || t('settings.profile.updateError'));
  } finally {
    isSaving.profile = false;
  }
}

async function saveOrganization() {
  try {
    isSaving.organization = true;

    if (!isAdminUser.value || !adminData.value) {
      throw new Error(t('settings.organization.errors.adminOnly'));
    }

    // Update admin organization info
    await useNuxtApp().$api.put(`/Admin/${adminData.value.id}`, {
      id: adminData.value.id,
      department: formData.department,
    });

    // Refresh data
    await fetchData();

    // Reset state
    isEditing.organization = false;

    // Show success message
    message.success(t('settings.organization.updateSuccess'));
  } catch (err) {
    console.error(err);
    message.error(err.message || t('settings.organization.updateError'));
  } finally {
    isSaving.organization = false;
  }
}

async function changePassword() {
  try {
    await passwordFormRef.value?.validate();

    isSaving.password = true;

    // Call API to change password
    await useNuxtApp().$api.post('/Auth/reset-password', {
      email: userStore.userDetails?.email,
      token: passwordForm.currentPassword, // This depends on your API requirements
      newPassword: passwordForm.newPassword,
    });

    // Reset form
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';

    // Show success message
    message.success(t('settings.security.passwordChangeSuccess'));
  } catch (err) {
    if (err?.errorFields) {
      // Form validation error, handled by naive-ui
      return;
    }

    console.error(err);
    message.error(err.message || t('settings.security.passwordChangeError'));
  } finally {
    isSaving.password = false;
  }
}

function setTheme(theme) {
  // Use the theme store to set the theme
  themeStore.setTheme(theme);
  message.success(t('settings.appearance.themeChangeSuccess', { theme }));
}

function setAccentColor(colorName) {
  // Use the theme store to set the accent color
  themeStore.setAccentColor(colorName);
  message.success(
    t('settings.appearance.colorChangeSuccess', {
      color: t(`settings.appearance.colors.${colorName}`),
    })
  );
}

async function savePrivacySettings() {
  try {
    isSaving.privacy = true;

    // Call API to update privacy settings
    await useNuxtApp().$api.post('/User/privacy-settings', privacySettings);

    // Show success message
    message.success(t('settings.privacy.updateSuccess'));
  } catch (err) {
    console.error(err);
    message.error(err.message || t('settings.privacy.updateError'));
  } finally {
    isSaving.privacy = false;
  }
}

async function fetchData() {
  try {
    error.value = null;

    // Check if user is authenticated and has a valid ID
    if (!authStore.isAuthenticated || !authStore.user?.id) {
      error.value = t('settings.errors.loginRequired');
      return;
    }

    const userId = authStore.user.id;

    // Fetch user details from user store if not already loaded
    if (!userStore.userDetails) {
      await userStore.fetchUserDetails(userId);
    }

    // Initialize form data
    formData.firstName = userStore.userDetails?.firstName || '';
    formData.lastName = userStore.userDetails?.lastName || '';
    formData.displayName = userStore.displayName || '';
    formData.email = userStore.userDetails?.email || '';

    // Fetch additional user data based on role
    if (userStore.userDetails?.role === 'admin') {
      try {
        adminData.value = await useNuxtApp().$api.get(`/Admin/user/${userId}`);
        formData.department = adminData.value.department || '';
        formData.phone = adminData.value.phone || '';

        if (adminData.value.institutionId) {
          institutionData.value = await useNuxtApp().$api.get(
            `/Institutions/${adminData.value.institutionId}`
          );
        }
      } catch (adminError) {
        console.error('Error fetching admin data:', adminError);
      }
    } else if (userStore.userDetails?.role === 'student') {
      try {
        studentData.value = await useNuxtApp().$api.get(`/Students/${userId}`);

        // Get institution data (school or university)
        const institutionId =
          studentData.value.schoolId || studentData.value.universityId;
        if (institutionId) {
          institutionData.value = await useNuxtApp().$api.get(
            `/Institutions/${institutionId}`
          );
        }
      } catch (studentError) {
        console.error('Error fetching student data:', studentError);
      }
    }

    // Try to get profile image if available
    try {
      const imageResponse = await useNuxtApp().$api.get(
        `/User/${userId}/avatar`
      );
      if (imageResponse && imageResponse.url) {
        profileImageUrl.value = imageResponse.url;
      }
    } catch (imageError) {
      // Just ignore if profile image isn't available
      console.log('No profile image available', imageError);
    }
  } catch (err) {
    error.value = err.message || t('settings.errors.loadError');
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

// Initialize page
onMounted(async () => {
  try {
    isLoading.value = true;

    if (!authStore.isAuthenticated) {
      // Validate session if user doesn't appear to be logged in
      const isValid = await authStore.validateSession();
      if (!isValid) {
        error.value = t('settings.errors.sessionExpired');
        return;
      }
    }

    await fetchData();

    // Wait for DOM to update
    await nextTick();
  } catch (err) {
    error.value = err.message || t('settings.errors.initError');
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Comprehensive menu styling to remove all green */
:deep(.n-menu-item),
:deep(.n-menu-item-content),
:deep(.n-menu-item.n-menu-item--selected),
:deep(.n-menu-item-content.n-menu-item-content--selected) {
  background-color: var(--color-background-secondary) !important;
  border: none !important;
}

:deep(.n-menu-item-content),
:deep(.n-menu-item-content-header) {
  color: var(--color-text-primary) !important;
}

:deep(.n-menu-item-content:hover),
:deep(.n-menu-item-content--selected .n-menu-item-content-header) {
  color: var(--color-primary) !important;
}

:deep(.n-menu-item-content__icon) {
  color: var(--color-text-secondary) !important;
}

:deep(.n-menu-item-content--selected .n-menu-item-content__icon),
:deep(.n-menu-item-content:hover .n-menu-item-content__icon) {
  color: var(--color-primary) !important;
}

/* Remove any potential green borders or outlines */
:deep(.n-menu-item),
:deep(.n-menu-item-content) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

:deep(.n-menu .n-menu-item-content.n-menu-item-content--selected::before) {
  background-color: var(--color-background-primary) !important;
}

/* Theme-aware switch styling */
:deep(.n-switch) {
  --n-button-color-active: var(--color-primary) !important;
  --n-button-color-focus: var(--color-primary) !important;
  --n-button-color-hover: var(--color-primary-hover) !important;
  --n-loading-color: var(--color-primary) !important;
}

:deep(.n-switch.n-switch--active .n-switch__rail) {
  background-color: var(--color-primary) !important;
}

:deep(.n-switch:hover .n-switch__rail) {
  background-color: var(--color-primary-hover) !important;
}

:deep(.n-switch--active:focus .n-switch__rail) {
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.3) !important;
}
</style>
