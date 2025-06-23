<template>
  <div class="mx-auto py-6">
    <!-- Header card with user info -->
    <div
      class="bg-background-card rounded-xl border border-border mb-6 shadow-sm overflow-hidden"
    >
      <div class="relative bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <!-- Profile image -->
          <div class="relative group">
            <div
              class="h-24 w-24 rounded-full overflow-hidden bg-background-secondary border-4 border-white dark:border-background-card shadow-md"
            >
              <img
                v-if="profileImageUrl"
                :src="profileImageUrl"
                alt="Profile"
                class="h-full w-full object-cover"
              >
              <span
                v-else
                class="h-full w-full flex items-center justify-center text-3xl font-bold text-primary"
              >
                {{ userInitials }}
              </span>
            </div>

            <!-- Edit button -->
            <button
              class="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary-hover transition-all duration-300"
              aria-label="Change profile picture"
              @click="openImageUpload"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              </svg>
            </button>
          </div>

          <!-- User details -->
          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-xl font-bold text-text-primary">
              {{ userData.firstName }} {{ userData.lastName }}
            </h1>
            <p class="text-text-secondary text-sm">{{ userData.email }}</p>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-2">
            <n-button
              v-if="!isEditing.profile"
              type="primary"
              class="transform hover:scale-105 transition-all duration-300"
              @click="toggleEditing('profile')"
            >
              {{ t('settings.profile.buttons.editProfile') }}
            </n-button>
            <template v-else>
              <n-button
                type="primary"
                :loading="isSaving.profile"
                class="transform hover:scale-105 transition-all duration-300"
                @click="saveProfile"
              >
                {{ t('settings.profile.buttons.saveChanges') }}
              </n-button>
              <n-button
                secondary
                class="ml-2 text-text-primary"
                @click="cancelEditing('profile')"
              >
                {{ t('settings.profile.buttons.cancel') }}
              </n-button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Main profile form card -->
    <div
      class="bg-background-card rounded-xl border border-border shadow-sm p-6"
    >
      <!-- Section header -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-text-primary flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2 text-primary"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          {{ t('settings.profile.title') }}
        </h2>
        <p class="text-text-secondary text-sm">
          {{ t('settings.profile.subtitle') }}
        </p>
      </div>

      <!-- Personal information form -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <!-- First Name -->
        <div>
          <label class="block text-text-primary text-sm font-medium mb-2">
            {{ t('settings.profile.personalInfo.firstName') }}
          </label>
          <n-input
            v-model:value="userData.firstName"
            :placeholder="
              t('settings.profile.personalInfo.firstNamePlaceholder')
            "
            :disabled="!isEditing.profile"
            class="w-full"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-text-primary text-sm font-medium mb-2">
            {{ t('settings.profile.personalInfo.lastName') }}
          </label>
          <n-input
            v-model:value="userData.lastName"
            :placeholder="
              t('settings.profile.personalInfo.lastNamePlaceholder')
            "
            :disabled="!isEditing.profile"
            class="w-full"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-text-primary text-sm font-medium mb-2">
            {{ t('settings.profile.personalInfo.email') }}
          </label>
          <n-input
            v-model:value="userData.email"
            :placeholder="t('settings.profile.personalInfo.emailPlaceholder')"
            :disabled="!isEditing.profile"
            class="w-full"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-text-primary text-sm font-medium mb-2">
            {{ t('settings.profile.personalInfo.phone') }}
          </label>
          <n-input
            v-model:value="userData.phone"
            :placeholder="t('settings.profile.personalInfo.phonePlaceholder')"
            :disabled="!isEditing.profile"
            class="w-full"
          />
        </div>
      </div>

      <!-- Language preference section -->
      <div class="pt-6 border-t border-border">
        <h3 class="text-base font-medium text-text-primary mb-4">
          {{ t('settings.profile.preferences.title') }}
        </h3>

        <div class="max-w-md">
          <label class="block text-text-primary text-sm font-medium mb-2">
            {{ t('settings.profile.preferences.language') }}
          </label>
          <n-select
            v-model:value="userData.languagePreference"
            :options="languageOptions"
            :disabled="!isEditing.profile"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Hidden file input for image upload -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleImageUpload"
    >
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useI18n } from 'vue-i18n';
import { useNotification } from 'naive-ui';

const { t } = useI18n();
const userStore = useUserStore();
const notification = useNotification();
const fileInput = ref(null);

// Reactive data
const userData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
});

const availableLocales = computed(() => {
  return rawLocales.map((localeCode) => {
    const label = getLanguageName(localeCode);
    return { label, value: localeCode };
  });
});

const adminData = ref(null);
const studentData = ref(null);
const institutionData = ref(null);
const profileImageUrl = ref(null);

const isEditing = reactive({
  profile: false,
  organization: false,
});

const isSaving = reactive({
  profile: false,
  organization: false,
});

// Load user data on component mount
onMounted(async () => {
  if (userStore.userDetails) {
    userData.firstName = userStore.userDetails.firstName || '';
    userData.lastName = userStore.userDetails.lastName || '';
    userData.email = userStore.userDetails.email || '';
    userData.phone = userStore.userDetails.phone || '';
    userData.department = userStore.userDetails.department || '';
    profileImageUrl.value = userStore.userDetails.profileImageUrl || null;

    // Set admin or student data if available
    if (userStore.userDetails.role === 'admin') {
      adminData.value = {
        position: 'Administrator', // This should come from the API
        permissions: ['ManageUsers', 'ManageSettings'], // This should come from the API
      };
    } else if (userStore.userDetails.role === 'student') {
      studentData.value = {
        gradeName: 'Grade 10', // This should come from the API
      };
    }

    // Fetch institution data if linked
    if (userStore.isInstitutionLinked && userStore.userDetails.institutionId) {
      try {
        const response = await useNuxtApp().$api.get(
          `/Institutions/${userStore.userDetails.institutionId}`
        );
        institutionData.value = response;
      } catch (error) {
        console.error('Failed to fetch institution data:', error);
      }
    }
  }
});

// Computed properties
const userInitials = computed(() => {
  const firstName = userData.firstName || '';
  const lastName = userData.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
});

// Methods
function toggleEditing(section) {
  isEditing[section] = !isEditing[section];
}

function cancelEditing(section) {
  isEditing[section] = false;

  // Reset data from store
  if (section === 'profile') {
    userData.firstName = userStore.userDetails?.firstName || '';
    userData.lastName = userStore.userDetails?.lastName || '';
    userData.email = userStore.userDetails?.email || '';
    userData.phone = userStore.userDetails?.phone || '';
  } else if (section === 'organization') {
    userData.department = userStore.userDetails?.department || '';
  }
}

async function saveProfile() {
  if (!userStore.userDetails) return;

  isSaving.profile = true;

  try {
    await userStore.updateUserProfile({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
    });

    notification.success({
      title: t('settings.notifications.profileUpdated.title'),
      content: t('settings.notifications.profileUpdated.message'),
    });

    isEditing.profile = false;
  } catch (error) {
    notification.error({
      title: t('settings.notifications.error.title'),
      content: error.message || t('settings.notifications.error.message'),
    });
  } finally {
    isSaving.profile = false;
  }
}

function openImageUpload() {
  fileInput.value.click();
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Check file type and size
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    notification.error({
      title: t('settings.notifications.invalidFileType.title'),
      content: t('settings.notifications.invalidFileType.message'),
    });
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB limit
    notification.error({
      title: t('settings.notifications.fileTooLarge.title'),
      content: t('settings.notifications.fileTooLarge.message'),
    });
    return;
  }

  try {
    notification.info({
      title: t('settings.notifications.uploadingImage.title'),
      content: t('settings.notifications.uploadingImage.message'),
    });

    const imageUrl = await userStore.uploadProfileImage(file);

    if (imageUrl) {
      profileImageUrl.value = imageUrl;

      notification.success({
        title: t('settings.notifications.imageUploaded.title'),
        content: t('settings.notifications.imageUploaded.message'),
      });
    }
  } catch (error) {
    notification.error({
      title: t('settings.notifications.error.title'),
      content: error.message || t('settings.notifications.error.message'),
    });
  } finally {
    // Reset file input so the same file can be selected again
    fileInput.value.value = null;
  }
}
</script>
