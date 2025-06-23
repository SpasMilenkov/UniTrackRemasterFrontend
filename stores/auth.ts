// Fixed auth store with proper error handling and state clearing
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import type { z } from 'zod';
import type { loginSchema } from '~/schemas/login.schema';
import type { registerSchema } from '~/schemas/register.schema';
import type { LoginResponseDto } from '~/interfaces/login-response.dto';
import type { registerGuestSchema } from '~/schemas/register-guest.schema';
import type { ChangePasswordPayload } from '~/schemas/change-password.schema';
import { UserRoleType } from '~/enums/user-role.enum';

type LoginPayload = z.infer<typeof loginSchema>;
type RegisterPayload = z.infer<ReturnType<typeof registerSchema>>;
type RegisterGuestPayload = z.infer<ReturnType<typeof registerGuestSchema>>;

export const useAuthStore = defineStore('auth', () => {
  if (import.meta.server) {
    return {
      // Stub implementation for SSR
      isAuthenticated: readonly(ref(false)),
      user: readonly(ref({} as LoginResponseDto)),
      emailForReset: readonly(ref(null)),
      error: readonly(ref(null)),
      isRefreshing: readonly(ref(false)),
      roles: null,

      // Loading states
      isValidatingSession: false,
      isLoadingRoles: false,
      isLoggingIn: false,
      isRegistering: false,
      isRegisteringGuest: false,
      isForgettingPassword: false,
      isResettingPassword: false,
      isChangingPassword: false,
      isLoggingOut: false,
      isLoading: false,

      // Stub methods
      login: async () => {},
      register: async () => {},
      registerGuest: async () => {},
      forgotPassword: async () => {},
      resetPassword: async () => true,
      changePassword: async () => true,
      logout: async () => {},
      validateSession: async () => false,
      clearAuth: () => {},
      clearError: () => {},
      getRoles: async () => null,

      // Stub queries
      sessionValidationQuery: null,
      rolesQuery: null,
    };
  }

  // Internal state - not readonly
  const _isAuthenticated = ref(false);
  const _user = ref<LoginResponseDto>({} as LoginResponseDto);
  const _emailForReset = ref<string | null>(null);
  const _error = ref<string | null>(null);
  const _isRefreshing = ref(false);

  // Track refresh attempts to prevent infinite loops
  const _refreshAttempts = ref(0);
  const _lastRefreshTime = ref(0);
  const MAX_REFRESH_ATTEMPTS = 3;
  const REFRESH_COOLDOWN = 5000; // 5 seconds

  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // Helper function to clear error state
  const clearError = () => {
    _error.value = null;
  };

  // Helper function to validate user data structure
  const isValidUserData = (userData: any): userData is LoginResponseDto => {
    // First check if it's a string (which indicates we're getting just an ID)
    if (typeof userData === 'string') {
      console.error(
        'Invalid user data: received string instead of object:',
        userData
      );
      return false;
    }

    if (!userData || typeof userData !== 'object') {
      console.error(
        'Invalid user data: not an object:',
        typeof userData,
        userData
      );
      return false;
    }

    // Check for required properties that your app expects
    const requiredProps = ['id']; // Add other required properties here like 'email', 'role', etc.
    const hasRequiredProps = requiredProps.every((prop) => {
      const hasProperty = prop in userData && userData[prop] != null;
      if (!hasProperty) {
        console.error(`Invalid user data: missing required property '${prop}'`);
      }
      return hasProperty;
    });

    if (!hasRequiredProps) {
      console.error('User data missing required properties:', userData);
      return false;
    }

    console.log('User data validation passed:', userData);
    return true;
  };

  // Helper functions for localStorage persistence
  const saveUserToStorage = (userData: LoginResponseDto) => {
    if (import.meta.client) {
      try {
        console.log('Attempting to save user data:', typeof userData, userData);

        // Validate the data before saving
        if (!isValidUserData(userData)) {
          console.error(
            'BLOCKED: Attempted to save invalid user data to localStorage:',
            userData
          );
          console.trace('Call stack for invalid save attempt:');
          return;
        }

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log(
          '✅ User data successfully saved to localStorage:',
          userData
        );
      } catch (error) {
        console.error('Failed to save user data to localStorage:', error);
      }
    }
  };

  const loadUserFromStorage = (): LoginResponseDto | null => {
    if (import.meta.client) {
      try {
        const isAuth = localStorage.getItem('isAuthenticated');
        const userData = localStorage.getItem('userData');

        if (isAuth === 'true' && userData) {
          const parsedData = JSON.parse(userData);

          // Validate the loaded data
          if (isValidUserData(parsedData)) {
            console.log('User data loaded from localStorage:', parsedData);
            return parsedData as LoginResponseDto;
          } else {
            console.warn('Loaded user data is invalid, clearing storage');
            clearUserFromStorage();
            return null;
          }
        }
      } catch (error) {
        console.error('Failed to load user data from localStorage:', error);
        // Clear corrupted data
        clearUserFromStorage();
      }
    }
    return null;
  };

  const clearUserFromStorage = () => {
    if (import.meta.client) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      console.log('User data cleared from localStorage');
    }
  };

  // Initialize from localStorage on store creation
  const initializeFromStorage = () => {
    if (import.meta.client) {
      const savedUser = loadUserFromStorage();
      if (savedUser) {
        _isAuthenticated.value = true;
        _user.value = savedUser;
        console.log('Auth state restored from localStorage');
      } else {
        // If we couldn't load valid user data, ensure we're logged out
        _isAuthenticated.value = false;
        _user.value = {} as LoginResponseDto;
        console.log('No valid user data found, starting logged out');
      }
    }
  };

  // Session validation query - CLIENT ONLY and manually controlled
  const sessionValidationQuery = useQuery({
    key: () => ['auth', 'session-valid'],
    query: async () => {
      console.log(
        '🔍 Making lightweight session validation request to /User/current...'
      );
      const response = await $apiFetch<string>('/User/current');
      console.log(
        '🔍 Session validation response (just checking validity):',
        typeof response,
        response
      );
      return { isValid: true, userId: response };
    },
    enabled: () => {
      if (import.meta.server) return false;
      return false;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Roles query - CLIENT ONLY and manually controlled
  const rolesQuery = useQuery({
    key: () => ['roles', 'public'],
    query: () => $apiFetch<{ id: string; name: string }[]>('/User/public'),
    enabled: () => {
      if (import.meta.server) return false;
      return false;
    },
    staleTime: 10 * 60 * 1000,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutation: (data: LoginPayload) =>
      $apiFetch<LoginResponseDto>('/Auth/login', {
        method: 'POST',
        body: data,
      }),
    onSuccess: async (userData) => {
      console.log('Login successful, received user data:', userData);

      // Validate the received user data
      if (!isValidUserData(userData)) {
        console.error('Login returned invalid user data:', userData);
        _error.value = 'Invalid user data received from server';
        throw new Error('Invalid user data received from server');
      }

      _isAuthenticated.value = true;
      _user.value = userData;
      _error.value = null; // Clear error on success
      _refreshAttempts.value = 0;

      // Save to localStorage for persistence
      saveUserToStorage(userData);

      // Navigate based on role
      if (userData.role === UserRoleType.SuperAdmin) {
        await navigateTo('/super-admins/dashboard');
      } else {
        await navigateTo('/users/dashboard');
      }
    },
    onError: (loginError) => {
      console.error('Login failed:', loginError);
      _error.value = loginError.message || 'Login failed';
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutation: (data: RegisterPayload) =>
      $apiFetch<LoginResponseDto>('/Auth/register', {
        method: 'POST',
        body: data,
      }),
    onSuccess: async () => {
      _error.value = null; // Clear error on success
      await navigateTo({ path: '/login' });
    },
    onError: (registerError) => {
      console.error('Registration failed:', registerError);
      _error.value = registerError.message || 'Registration failed';
    },
  });

  // Register guest mutation
  const registerGuestMutation = useMutation({
    mutation: (data: RegisterGuestPayload) =>
      $apiFetch<LoginResponseDto>('/Auth/register-guest', {
        method: 'POST',
        body: data,
      }),
    onSuccess: async () => {
      _error.value = null; // Clear error on success
      await navigateTo({ path: '/login' });
    },
    onError: (registerGuestError) => {
      console.error('Registration of guest failed:', registerGuestError);
      _error.value = registerGuestError.message || 'Guest registration failed';
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutation: (email: string) =>
      $apiFetch(`/Auth/forgot-password?email=${email}`, {
        method: 'POST',
        body: null,
      }),
    onSuccess: (_, email) => {
      _emailForReset.value = email;
      _error.value = null; // Clear error on success
    },
    onError: (forgotError) => {
      console.error('Forgot password failed:', forgotError);
      _error.value = forgotError.message || 'Forgot password failed';
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutation: ({
      email,
      token,
      password,
    }: {
      email: string;
      token: string;
      password: string;
    }) =>
      $apiFetch('/auth/reset-password', {
        method: 'POST',
        body: {
          email,
          token,
          newPassword: password,
        },
      }),
    onSuccess: () => {
      _error.value = null; // Clear error on success
    },
    onError: (resetError) => {
      console.error('Reset password failed:', resetError);
      _error.value = resetError.message || 'Password reset failed';
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutation: (data: ChangePasswordPayload) =>
      $apiFetch('/Auth/change-password', {
        method: 'POST',
        body: data,
      }),
    onSuccess: () => {
      _error.value = null; // Clear error on success
    },
    onError: (changeError) => {
      console.error('Password change failed:', changeError);
      _error.value = changeError.message || 'Password change failed';
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutation: () =>
      $apiFetch('/Auth/logout', {
        method: 'POST',
        body: undefined,
      }),
    onSuccess: async () => {
      clearAuth();
      await navigateTo('/login');
    },
    onError: async (logoutError) => {
      console.error('Logout failed:', logoutError);
      clearAuth();
      await navigateTo('/login');
    },
  });

  // Clear auth function - updated to clear storage
  const clearAuth = () => {
    _isAuthenticated.value = false;
    _user.value = {} as LoginResponseDto;
    _error.value = null;
    _isRefreshing.value = false;
    _refreshAttempts.value = 0;

    // Clear localStorage
    clearUserFromStorage();
  };

  // CLIENT-ONLY session validation with loop prevention
  const validateSession = async (force = false) => {
    if (import.meta.server) {
      console.log('Skipping session validation on server side');
      return false;
    }

    const now = Date.now();
    if (!force && _refreshAttempts.value >= MAX_REFRESH_ATTEMPTS) {
      if (now - _lastRefreshTime.value < REFRESH_COOLDOWN) {
        console.log('Skipping validation due to recent failed attempts');
        return _isAuthenticated.value;
      } else {
        _refreshAttempts.value = 0;
      }
    }

    const savedUser = loadUserFromStorage();
    if (!savedUser) {
      console.log('No valid user data in localStorage, user not authenticated');
      clearAuth();
      return false;
    }

    if (_isRefreshing.value) {
      console.log('Already refreshing, waiting...');
      let attempts = 0;
      while (_isRefreshing.value && attempts < 50) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }
      return _isAuthenticated.value;
    }

    try {
      _isRefreshing.value = true;
      _lastRefreshTime.value = now;

      console.log('🔄 Validating session with lightweight endpoint...');

      const result = await sessionValidationQuery.refetch();

      if (result?.data?.isValid) {
        console.log(
          '✅ Session is valid, restoring user data from localStorage...'
        );

        _isAuthenticated.value = true;
        _user.value = savedUser;
        _error.value = null; // Clear error on successful validation
        _refreshAttempts.value = 0;

        console.log(
          '🔄 Session validation successful, user restored from localStorage'
        );
        return true;
      } else {
        throw new Error('Session validation failed');
      }
    } catch (sessionError: any) {
      console.log('❌ Session validation failed:', sessionError?.status);

      _refreshAttempts.value++;

      if (sessionError?.status === 401 || sessionError?.status === 403) {
        console.log(
          `Auth error (attempt ${_refreshAttempts.value}/${MAX_REFRESH_ATTEMPTS})`
        );

        if (_refreshAttempts.value >= MAX_REFRESH_ATTEMPTS) {
          console.log('Max refresh attempts reached, clearing auth');
          clearAuth();
          if (window.location.pathname !== '/login') {
            await navigateTo('/login');
          }
          return false;
        }

        return _isAuthenticated.value;
      } else {
        console.error('Non-auth error during validation:', sessionError);
        if (savedUser) {
          _isAuthenticated.value = true;
          _user.value = savedUser;
          return true;
        }
        return false;
      }
    } finally {
      _isRefreshing.value = false;
    }
  };

  // Action functions - now using mutateAsync for proper error handling
  const login = async (data: LoginPayload) => {
    // Clear any previous errors before attempting login
    clearError();
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterPayload) => {
    clearError();
    await registerMutation.mutateAsync(data);
  };

  const registerGuest = async (data: RegisterGuestPayload) => {
    clearError();
    await registerGuestMutation.mutateAsync(data);
  };

  const forgotPassword = async (email: string) => {
    clearError();
    await forgotPasswordMutation.mutateAsync(email);
  };

  const resetPassword = async (data: {
    email: string;
    token: string;
    password: string;
  }) => {
    clearError();
    await resetPasswordMutation.mutateAsync(data);
    return true;
  };

  const changePassword = async (data: ChangePasswordPayload) => {
    clearError();
    await changePasswordMutation.mutateAsync(data);
    return true;
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const getRoles = async () => {
    if (import.meta.server) return null;

    if (_isAuthenticated.value && !_isRefreshing.value) {
      try {
        console.log('Fetching roles...');
        return await rolesQuery.refetch();
      } catch (error: any) {
        console.error('Failed to fetch roles:', error);

        if (error?.status === 401 || error?.status === 403) {
          await validateSession();
        }

        return null;
      }
    }
    return null;
  };

  // CLIENT-ONLY initialization
  if (import.meta.client) {
    initializeFromStorage();

    nextTick(() => {
      setTimeout(async () => {
        if (localStorage.getItem('isAuthenticated')) {
          console.log('Initializing session validation...');
          await validateSession(true);
        }
      }, 1000);
    });
  }

  return {
    // Read-only state for external consumers
    isAuthenticated: readonly(_isAuthenticated),
    user: readonly(_user),
    emailForReset: readonly(_emailForReset),
    error: readonly(_error),
    isRefreshing: readonly(_isRefreshing),
    roles: computed(() => rolesQuery.data.value || null),

    // Loading states
    isValidatingSession: computed(() => sessionValidationQuery.isLoading.value),
    isLoadingRoles: computed(() => rolesQuery.isLoading.value),
    isLoggingIn: computed(() => loginMutation.isLoading.value),
    isRegistering: computed(() => registerMutation.isLoading.value),
    isRegisteringGuest: computed(() => registerGuestMutation.isLoading.value),
    isForgettingPassword: computed(
      () => forgotPasswordMutation.isLoading.value
    ),
    isResettingPassword: computed(() => resetPasswordMutation.isLoading.value),
    isChangingPassword: computed(() => changePasswordMutation.isLoading.value),
    isLoggingOut: computed(() => logoutMutation.isLoading.value),

    // Combined loading state
    isLoading: computed(
      () =>
        sessionValidationQuery.isLoading.value ||
        rolesQuery.isLoading.value ||
        loginMutation.isLoading.value ||
        registerMutation.isLoading.value ||
        registerGuestMutation.isLoading.value ||
        forgotPasswordMutation.isLoading.value ||
        resetPasswordMutation.isLoading.value ||
        changePasswordMutation.isLoading.value ||
        logoutMutation.isLoading.value ||
        _isRefreshing.value
    ),

    // Actions
    login,
    register,
    registerGuest,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
    validateSession,
    clearAuth,
    clearError,
    getRoles,

    // Direct access to queries for debugging
    sessionValidationQuery,
    rolesQuery,
  };
});
