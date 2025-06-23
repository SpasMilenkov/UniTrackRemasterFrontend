// composables/useNavigation.ts
import { computed, ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useUserStore } from '~/stores/user';

export const useNavigation = () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const { t } = useI18n();
  const router = useRouter();
  const localePath = useLocalePath();

  // Initialize with default values to prevent hydration mismatch
  const userProfileData = ref({
    name: '',
    avatar: '',
    email: '',
    role: '',
  });

  // Check if user is authenticated
  const isAuthenticated = computed(() => authStore.isAuthenticated);

  // Get user details with proper initialization to avoid undefined errors
  const userProfile = computed(() => {
    if (!isAuthenticated.value) {
      return {
        name: '',
        avatar: '',
        email: '',
        role: '',
      };
    }

    // Set values only if they exist to prevent undefined errors
    const firstName = userStore.userDetails?.firstName || '';
    const lastName = userStore.userDetails?.lastName || '';
    const name = firstName && lastName ? `${firstName} ${lastName}` : 'User';

    // Update the ref value for compatibility
    userProfileData.value = {
      name,
      avatar: authStore.user?.avatarUrl || '/img/default-avatar.png',
      email: userStore.userDetails?.email || '',
      role: authStore.user?.userRole || 'User',
    };

    return userProfileData.value;
  });

  // Menu actions
  const handleLogout = async () => {
    await authStore.logout();
    router.push(localePath('/login'));
  };

  const navigateToProfile = () => {
    router.push(localePath('/users/profile'));
  };

  const navigateToSettings = () => {
    router.push(localePath('/users/settings'));
  };

  const navigateToLogin = () => {
    router.push(localePath('/login'));
  };
  const navigateToDashboard = () => {
    router.push(localePath('/users/dashboard'));
  };
  const navigateToRegister = () => {
    router.push(localePath('/register'));
  };

  // Dropdown menu options for authenticated users
  const userMenuOptions = computed(() => [
    {
      label: t('navigation.profile'),
      key: 'profile',
      icon: 'ion:person',
      onClick: navigateToProfile,
    },
    {
      label: t('navigation.dashboard'),
      key: 'logout',
      icon: 'ion:grid',
      onClick: navigateToDashboard,
    },
    {
      label: t('navigation.logout'),
      key: 'logout',
      icon: 'ion:log-out',
      onClick: handleLogout,
    },
  ]);

  // Main navigation options that appear for all users
  const commonNavOptions = computed(() => [
    // Add your common navigation items here
    // Example:
    // { label: t('navigation.home'), key: '/', icon: 'ion:home' }
  ]);

  // Navigation options specifically for authenticated users
  const authenticatedNavOptions = computed(() => [
    {
      label: t('navigation.dashboard'),
      key: '/users/dashboard',
      icon: 'ion:grid',
    },
    {
      label: t('navigation.timetable'),
      key: '/timetable',
      icon: 'ion:calendar',
    },
    // Add more authenticated-only navigation options here
  ]);

  // Navigation options specifically for unauthenticated users
  const unauthenticatedNavOptions = computed(() => [
    // Add options specific to unauthenticated users if needed
  ]);

  // Combined navigation options based on authentication status
  const navigationOptions = computed(() => {
    return [
      ...commonNavOptions.value,
      ...(isAuthenticated.value
        ? authenticatedNavOptions.value
        : unauthenticatedNavOptions.value),
    ];
  });

  // Render user avatar and dropdown if authenticated, otherwise login/register buttons
  const renderAuthSection = (isMobile = false) => {
    if (isAuthenticated.value) {
      if (isMobile) {
        // Return options for mobile menu when authenticated
        return [
          ...navigationOptions.value,
          ...userMenuOptions.value,
        ];
      } else {
        // Return desktop user dropdown component
        return {
          type: 'user-dropdown',
          profile: userProfile.value,
          options: userMenuOptions.value,
        };
      }
    } else {
      if (isMobile) {
        // Return options for mobile menu when not authenticated
        return [
          ...navigationOptions.value,
          {
            label: t('navigation.login'),
            key: 'login',
            icon: 'ion:log-in',
            onClick: navigateToLogin,
          },
          {
            label: t('navigation.register'),
            key: 'register',
            icon: 'ion:person-add',
            onClick: navigateToRegister,
          },
        ];
      } else {
        // Return login/register buttons for desktop
        return {
          type: 'auth-buttons',
          login: {
            label: t('navigation.login'),
            onClick: navigateToLogin,
          },
          register: {
            label: t('navigation.register'),
            onClick: navigateToRegister,
          },
        };
      }
    }
  };

  return {
    isAuthenticated,
    userProfile,
    navigationOptions,
    userMenuOptions,
    renderAuthSection,
    handleLogout,
    navigateToProfile,
    navigateToSettings,
    navigateToLogin,
    navigateToRegister,
  };
};
