// stores/user.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import { ProfileVisibility } from '~/enums/profile-visibility.enum';
import type { UserRoleType } from '~/enums/user-role.enum';
import type { Institution } from '~/interfaces/organizations/institution';
import type { PrivacySettingsDto } from '~/interfaces/user/privacy-settings.dto';
import type { UpdatePrivacySettingsDto } from '~/interfaces/user/profile-visibility.dto';
import type { UpdateUserProfileDto } from '~/interfaces/user/update-user.dto';
import type { UserDetailsResponse } from '~/interfaces/user/user-response.dto';
import type { ExtendedUserDetails } from '~/interfaces/user/extended-user-details';
import type { PaginatedUserListDto } from '~/interfaces/user/paginated-user-list.dto';
import type { PrivacySettings } from '~/interfaces/user/privacy-settings';
import type { SerializableUserDetails } from '~/interfaces/user/serializable-user-details';
import type { UserPaginationParams } from '~/interfaces/user/user-pagination-params';



export const useUserStore = defineStore('user', () => {
  // NEVER run on server-side to prevent hydration issues
  if (import.meta.server) {
    return {
      userDetails: readonly(ref(null)),
      loading: readonly(ref(false)),
      error: readonly(ref(null)),
      activeInstitution: readonly(ref(null)),
      privacySettings: readonly(ref(null)),
      paginatedUsers: readonly(ref(null)),

      displayName: '',
      isInstitutionLinked: false,
      currentInstitutionRole: null,
      hasRole: () => false,
      hasAnyRole: () => false,
      getRolesForInstitution: () => [],
      getPrimaryRoleForInstitution: () => null,
      isSavingPrivacy: false,
      visibilityOptions: [],
      isPaginatedUsersLoading: false,
      getPaginatedUsers: null,
      getPaginationMetadata: null,
      savingPrivacy: false,
      loadingUsers: false,
      isLoading: false,
      isUpdatingPrivacy: false,
      isUploadingImage: false,
      isUpdatingProfile: false,

      // Stub methods for SSR
      fetchUserDetails: async () => {},
      fetchPaginatedUsers: async () => null,
      fetchPrivacySettings: async () => {},
      updatePrivacySetting: async () => {},
      savePrivacySettings: async () => {},
      fetchUserRolesForInstitution: async () => [],
      uploadProfileImage: async () => {},
      updateUserProfile: async () => {},
      setCurrentInstitutionRole: async () => {},
      setActiveInstitution: () => {},
      clearActiveInstitution: () => {},
      validateUserSession: async () => false,
      clearUserData: () => {},
      userDetailsQuery: () => null,
      paginatedUsersQuery: () => null,
      userRolesQuery: () => null,
      privacySettingsQuery: null,
    };
  }

  // CLIENT-ONLY implementation
  const { $apiFetch } = useNuxtApp();

  // Internal state - not readonly
  const _userDetails = ref<ExtendedUserDetails | null>(null);
  const _loading = ref(false);
  const _error = ref<string | null>(null);
  const _activeInstitution = ref<Institution | null>(null);
  const _privacySettings = ref<PrivacySettings | null>(null);
  const _paginatedUsers = ref<PaginatedUserListDto | null>(null);

  // ===== LOCALSTORAGE HELPERS =====

  const STORAGE_KEYS = {
    USER_DETAILS: 'userDetails',
    PRIVACY_SETTINGS: 'privacySettings',
    ACTIVE_INSTITUTION: 'activeInstitution',
  };

  // Convert Map to plain object for JSON serialization
  const serializeUserDetails = (
    userDetails: ExtendedUserDetails
  ): SerializableUserDetails => {
    const institutionRoles: Record<string, UserRoleType[]> = {};
    if (userDetails.institutionRoles) {
      for (const [key, value] of userDetails.institutionRoles) {
        institutionRoles[key] = Array.isArray(value) ? value : [value];
      }
    }

    return {
      id: userDetails.id,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      phone: userDetails.phone,
      profileImageUrl: userDetails.profileImageUrl,
      isLinked: userDetails.isLinked,
      role: userDetails.role,
      institutionId: userDetails.institutionId,
      institutionRoles,
      currentRole: userDetails.currentRole,
    };
  };

  // Convert plain object back to ExtendedUserDetails with Map
  const deserializeUserDetails = (
    data: SerializableUserDetails
  ): ExtendedUserDetails => {
    const institutionRoles = new Map<string, UserRoleType[]>();
    if (data.institutionRoles) {
      for (const [key, value] of Object.entries(data.institutionRoles)) {
        institutionRoles.set(key, Array.isArray(value) ? value : [value]);
      }
    }

    return {
      ...data,
      institutionRoles,
    };
  };

  const saveUserDetailsToStorage = (userDetails: ExtendedUserDetails) => {
    if (import.meta.client) {
      try {
        const serializable = serializeUserDetails(userDetails);
        localStorage.setItem(
          STORAGE_KEYS.USER_DETAILS,
          JSON.stringify(serializable)
        );
        console.log('✅ User details saved to localStorage:', userDetails);
      } catch (error) {
        console.error('Failed to save user details to localStorage:', error);
      }
    }
  };

  const loadUserDetailsFromStorage = (): ExtendedUserDetails | null => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER_DETAILS);
        if (stored) {
          const parsed = JSON.parse(stored) as SerializableUserDetails;
          const userDetails = deserializeUserDetails(parsed);
          console.log('📂 User details loaded from localStorage:', userDetails);
          return userDetails;
        }
      } catch (error) {
        console.error('Failed to load user details from localStorage:', error);
        localStorage.removeItem(STORAGE_KEYS.USER_DETAILS);
      }
    }
    return null;
  };

  const savePrivacySettingsToStorage = (privacySettings: PrivacySettings) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(
          STORAGE_KEYS.PRIVACY_SETTINGS,
          JSON.stringify(privacySettings)
        );
        console.log(
          '✅ Privacy settings saved to localStorage:',
          privacySettings
        );
      } catch (error) {
        console.error(
          'Failed to save privacy settings to localStorage:',
          error
        );
      }
    }
  };

  const loadPrivacySettingsFromStorage = (): PrivacySettings | null => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.PRIVACY_SETTINGS);
        if (stored) {
          const privacySettings = JSON.parse(stored) as PrivacySettings;
          console.log(
            '📂 Privacy settings loaded from localStorage:',
            privacySettings
          );
          return privacySettings;
        }
      } catch (error) {
        console.error(
          'Failed to load privacy settings from localStorage:',
          error
        );
        localStorage.removeItem(STORAGE_KEYS.PRIVACY_SETTINGS);
      }
    }
    return null;
  };

  const saveActiveInstitutionToStorage = (institution: Institution) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(
          STORAGE_KEYS.ACTIVE_INSTITUTION,
          JSON.stringify(institution)
        );
        console.log(
          '✅ Active institution saved to localStorage:',
          institution
        );
      } catch (error) {
        console.error(
          'Failed to save active institution to localStorage:',
          error
        );
      }
    }
  };

  const loadActiveInstitutionFromStorage = (): Institution | null => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_INSTITUTION);
        if (stored) {
          const institution = JSON.parse(stored) as Institution;
          console.log(
            '📂 Active institution loaded from localStorage:',
            institution
          );
          return institution;
        }
      } catch (error) {
        console.error(
          'Failed to load active institution from localStorage:',
          error
        );
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_INSTITUTION);
      }
    }
    return null;
  };

  const clearUserDataFromStorage = () => {
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEYS.USER_DETAILS);
      localStorage.removeItem(STORAGE_KEYS.PRIVACY_SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_INSTITUTION);
      console.log('🗑️ User data cleared from localStorage');
    }
  };

  // Initialize from localStorage on store creation
  const initializeFromStorage = () => {
    if (import.meta.client) {
      const savedUserDetails = loadUserDetailsFromStorage();
      const savedPrivacySettings = loadPrivacySettingsFromStorage();
      const savedActiveInstitution = loadActiveInstitutionFromStorage();

      if (savedUserDetails) {
        _userDetails.value = savedUserDetails;
      }
      if (savedPrivacySettings) {
        _privacySettings.value = savedPrivacySettings;
      }
      if (savedActiveInstitution) {
        _activeInstitution.value = savedActiveInstitution;
      }

      console.log('📂 User store state restored from localStorage');
    }
  };

  // ===== LIGHTWEIGHT VALIDATION QUERIES =====

  // Lightweight user validation - just checks if user exists and returns basic info
  const userValidationQuery = (userId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['user', 'validate', unref(userId) || ''],
      query: async () => {
        const id = unref(userId);
        if (!id) throw new Error('User ID is required');
        // This could be a lightweight endpoint that just returns { exists: true, id: string }
        const response = await $apiFetch<{ exists: boolean; id: string }>(
          `/User/validate/${id}`
        );
        return response;
      },
      enabled: false, // Manually controlled
      staleTime: 10 * 60 * 1000,
    });
  };

  // ===== FULL DATA QUERIES - ONLY FOR FRESH FETCHES =====

  // User details query - for when we need fresh data
  const userDetailsQuery = (userId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['user', 'details', unref(userId) || ''],
      query: () =>
        $apiFetch<UserDetailsResponse>(`/User/details/${unref(userId)}`),
      enabled: false, // Manually controlled
      staleTime: 10 * 60 * 1000,
    });
  };

  // Privacy settings query
  const privacySettingsQuery = useQuery({
    key: () => ['user', 'privacy-settings'],
    query: () => $apiFetch<PrivacySettingsDto>('/User/privacy'),
    enabled: false, // Manually controlled
    staleTime: 15 * 60 * 1000,
  });

  // Paginated users query
  const paginatedUsersQuery = (params: MaybeRef<UserPaginationParams>) => {
    return useQuery({
      key: () => ['user', 'paginated', JSON.stringify(unref(params))],
      query: () => {
        const searchParams = unref(params);
        const queryParams = new URLSearchParams();

        queryParams.append('pageNumber', searchParams.pageNumber.toString());
        queryParams.append('pageSize', searchParams.pageSize.toString());
        queryParams.append('ascending', searchParams.ascending.toString());

        if (searchParams.searchTerm) {
          queryParams.append('searchTerm', searchParams.searchTerm);
        }
        if (searchParams.sortBy) {
          queryParams.append('sortBy', searchParams.sortBy);
        }
        if (searchParams.role) {
          queryParams.append('role', searchParams.role);
        }

        return $apiFetch<PaginatedUserListDto>(
          `/User/all?${queryParams.toString()}`
        );
      },
      enabled: false,
      staleTime: 5 * 60 * 1000,
    });
  };

  // User roles for institution query
  const userRolesQuery = (institutionId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['user', 'roles', unref(institutionId) || ''],
      query: () =>
        $apiFetch<{ institutionId: string; roles: UserRoleType[] }>(
          `/User/roles/institution/${unref(institutionId)}`
        ),
      enabled: false,
      staleTime: 15 * 60 * 1000,
    });
  };

  // ===== MUTATIONS =====

  // Update privacy settings mutation
  const updatePrivacySettingsMutation = useMutation({
    mutation: (settings: UpdatePrivacySettingsDto) =>
      $apiFetch<PrivacySettingsDto>('/User/privacy', {
        method: 'PUT',
        body: settings,
      }),
    onSuccess: (response) => {
      // Update local state with response
      const newPrivacySettings = {
        dataAnalytics: response.dataAnalytics,
        emailUpdates: response.emailUpdates,
        marketingEmails: response.marketingEmails,
        profileVisibility: response.profileVisibility,
      };
      _privacySettings.value = newPrivacySettings;
      savePrivacySettingsToStorage(newPrivacySettings);
    },
    onError: (error) => {
      console.error('Error updating privacy settings:', error);
    },
  });

  // Upload profile image mutation
  const uploadProfileImageMutation = useMutation({
    mutation: (imageFile: File) => {
      const formData = new FormData();
      formData.append('image', imageFile);

      return $apiFetch<{ imageUrl: string }>('/User/profile-image', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: async (response) => {
      // Update user details with new image URL
      if (_userDetails.value) {
        const updatedUserDetails = {
          ..._userDetails.value,
          profileImageUrl: response.imageUrl,
        };
        _userDetails.value = updatedUserDetails;
        saveUserDetailsToStorage(updatedUserDetails);
      }
    },
    onError: (error) => {
      console.error('Error uploading profile image:', error);
    },
  });

  // Update user profile mutation
  const updateUserProfileMutation = useMutation({
    mutation: (profileData: UpdateUserProfileDto) =>
      $apiFetch<UserDetailsResponse>('/User/profile', {
        method: 'PUT',
        body: profileData,
      }),
    onSuccess: (response) => {
      // Update local state with new details (safe mutation)
      if (_userDetails.value) {
        const updatedUserDetails = {
          ..._userDetails.value,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          phone: response.phone,
        };
        _userDetails.value = updatedUserDetails;
        saveUserDetailsToStorage(updatedUserDetails);
      }
    },
    onError: (error) => {
      console.error('Error updating user profile:', error);
    },
  });

  // ===== COMPUTED =====

  const displayName = computed(() => {
    if (!_userDetails.value) return '';
    return `${_userDetails.value.firstName} ${_userDetails.value.lastName}`;
  });

  const isInstitutionLinked = computed(() => {
    return !!_userDetails.value?.isLinked;
  });

  const currentInstitutionRole = computed(() => {
    return _userDetails.value?.currentRole || null;
  });

  const hasRole = computed(
    () => (institutionId: string, role: UserRoleType) => {
      if (!_userDetails.value || !_userDetails.value.institutionRoles)
        return false;

      const userRoles =
        _userDetails.value.institutionRoles.get(institutionId) || [];
      return userRoles.includes(role);
    }
  );

  const hasAnyRole = computed(
    () => (institutionId: string, roles: UserRoleType[]) => {
      if (!_userDetails.value || !_userDetails.value.institutionRoles)
        return false;

      const userRoles =
        _userDetails.value.institutionRoles.get(institutionId) || [];
      return roles.some((role) => userRoles.includes(role));
    }
  );

  const getRolesForInstitution = computed(() => (institutionId: string) => {
    if (!_userDetails.value || !_userDetails.value.institutionRoles) return [];
    return _userDetails.value.institutionRoles.get(institutionId) || [];
  });

  const getPrimaryRoleForInstitution = computed(
    () => (institutionId: string) => {
      if (!_userDetails.value || !_userDetails.value.institutionRoles)
        return null;

      const roles =
        _userDetails.value.institutionRoles.get(institutionId) || [];
      return roles.length > 0 ? roles[0] : null;
    }
  );

  const isSavingPrivacy = computed(() => {
    return updatePrivacySettingsMutation.isLoading.value;
  });

  const visibilityOptions = computed(() => {
    return [
      { label: 'Everyone', value: ProfileVisibility.Everyone },
      { label: 'Institution Only', value: ProfileVisibility.Institution },
      { label: 'None', value: ProfileVisibility.None },
    ];
  });

  const isPaginatedUsersLoading = computed(() => {
    return false;
  });

  const getPaginatedUsers = computed(() => {
    return _paginatedUsers.value;
  });

  const getPaginationMetadata = computed(() => {
    if (!_paginatedUsers.value) return null;

    return {
      totalCount: _paginatedUsers.value.totalCount,
      pageNumber: _paginatedUsers.value.pageNumber,
      pageSize: _paginatedUsers.value.pageSize,
      totalPages: _paginatedUsers.value.totalPages,
      hasPreviousPage: _paginatedUsers.value.hasPreviousPage,
      hasNextPage: _paginatedUsers.value.hasNextPage,
    };
  });

  // Loading states
  const savingPrivacy = computed(
    () => updatePrivacySettingsMutation.isLoading.value
  );
  const loadingUsers = computed(() => false);

  // Combined loading state
  const isLoading = computed(
    () =>
      _loading.value ||
      updatePrivacySettingsMutation.isLoading.value ||
      uploadProfileImageMutation.isLoading.value ||
      updateUserProfileMutation.isLoading.value
  );

  // ===== ACTION METHODS =====

  // Lightweight user session validation
  const validateUserSession = async (userId: string): Promise<boolean> => {
    if (!userId) {
      console.log('No userId provided for validation');
      return false;
    }

    try {
      const query = userValidationQuery(ref(userId));
      const result = await query.refetch();

      if (result?.data?.exists) {
        console.log('✅ User session is valid');
        return true;
      } else {
        console.log('❌ User session is invalid');
        return false;
      }
    } catch (error) {
      console.error('User session validation failed:', error);
      return false;
    }
  };

  // Fetch fresh user details
  const fetchUserDetails = async (userId: string, useCache = true) => {
    if (!userId) {
      console.error('No userId provided to fetchUserDetails');
      return;
    }

    // If we have cached data and useCache is true, validate session instead of full fetch
    if (useCache && _userDetails.value?.id === userId) {
      console.log('📂 Using cached user details, validating session...');
      const isValid = await validateUserSession(userId);
      if (isValid) {
        console.log('✅ Cached user data is valid');
        return;
      } else {
        console.log(
          '❌ Session invalid, clearing cache and fetching fresh data...'
        );
        clearUserData();
      }
    }

    _loading.value = true;
    _error.value = null;

    try {
      console.log('🔄 Fetching fresh user details for userId:', userId);
      const query = userDetailsQuery(ref(userId));
      await query.refetch();
      const userData = query.data.value;

      if (userData) {
        console.log('✅ Fresh user data received:', userData);
        // Create a new roles map
        const institutionRoles = new Map<string, UserRoleType[]>();

        // Safe assignment to internal ref
        const newUserDetails: ExtendedUserDetails = {
          id: userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          profileImageUrl: userData.profileImageUrl,
          isLinked: userData.isLinked,
          role: userData.role,
          institutionId: userData.institutionId,
          institutionRoles,
          currentRole: userData.role,
        };

        _userDetails.value = newUserDetails;
        saveUserDetailsToStorage(newUserDetails);

        console.log('✅ User details set and saved successfully');
      } else {
        throw new Error('No user data returned from API');
      }
    } catch (err: any) {
      _error.value = err.message;
      console.error('Error fetching user details:', err);
      throw err;
    } finally {
      _loading.value = false;
    }
  };

  const fetchPaginatedUsers = async (
    params: UserPaginationParams = {
      pageNumber: 1,
      pageSize: 20,
      ascending: true,
    }
  ) => {
    _error.value = null;

    try {
      const query = paginatedUsersQuery(ref(params));
      await query.refetch();
      const response = query.data.value;

      if (response) {
        _paginatedUsers.value = response;
        return response;
      }
    } catch (err: any) {
      console.error('Failed to fetch paginated users:', err);
      _error.value = err.message;
      throw err;
    }
  };

  const fetchPrivacySettings = async (useCache = true) => {
    if (!_userDetails.value?.id) return;

    // If we have cached privacy settings and useCache is true, use them
    if (useCache && _privacySettings.value) {
      console.log('📂 Using cached privacy settings');
      return;
    }

    try {
      console.log('🔄 Fetching fresh privacy settings...');
      await privacySettingsQuery.refetch();
      const response = privacySettingsQuery.data.value;

      if (response) {
        const newPrivacySettings = {
          dataAnalytics: response.dataAnalytics,
          emailUpdates: response.emailUpdates,
          marketingEmails: response.marketingEmails,
          profileVisibility: response.profileVisibility,
        };
        _privacySettings.value = newPrivacySettings;
        savePrivacySettingsToStorage(newPrivacySettings);
        console.log('✅ Privacy settings fetched and saved successfully');
      }
    } catch (err: any) {
      console.error('Failed to fetch privacy settings:', err);
      _error.value = err.message;
    }
  };

  const updatePrivacySetting = async (
    field: keyof PrivacySettings,
    value: boolean | ProfileVisibility
  ) => {
    if (!_privacySettings.value) return;

    // Create update object with only the field being changed
    const updateData = {
      [field]: value,
    } as UpdatePrivacySettingsDto;

    return await savePrivacySettings(updateData);
  };

  const savePrivacySettings = async (settings?: UpdatePrivacySettingsDto) => {
    if (!_userDetails.value?.id) return;

    try {
      // If no settings provided, save current state
      const dataToSave = settings || _privacySettings.value;

      return await updatePrivacySettingsMutation.mutateAsync(dataToSave);
    } catch (err: any) {
      console.error('Failed to save privacy settings:', err);
      _error.value = err.message;
      throw err;
    }
  };

  const fetchUserRolesForInstitution = async (
    institutionId: string
  ): Promise<UserRoleType[]> => {
    if (!_userDetails.value) return [];

    try {
      const query = userRolesQuery(ref(institutionId));
      await query.refetch();
      const response = query.data.value;

      if (response) {
        console.log('Response from the roles endpoint', response);
        const roles = response.roles || [];

        // Safe mutation of user details
        if (_userDetails.value) {
          const updatedDetails = { ..._userDetails.value };
          if (!updatedDetails.institutionRoles) {
            updatedDetails.institutionRoles = new Map<string, UserRoleType[]>();
          }
          updatedDetails.institutionRoles.set(institutionId, roles);
          _userDetails.value = updatedDetails;
          saveUserDetailsToStorage(updatedDetails);
        }

        return roles;
      }

      return [];
    } catch (err) {
      console.error('Failed to fetch roles:', err);
      return [];
    }
  };

  const uploadProfileImage = async (imageFile: File) => {
    if (!_userDetails.value) return;

    try {
      _loading.value = true;
      await uploadProfileImageMutation.mutateAsync(imageFile);
      return null;
    } catch (err: any) {
      _error.value = err.message;
      throw err;
    } finally {
      _loading.value = false;
    }
  };

  const updateUserProfile = async (profileData: UpdateUserProfileDto) => {
    if (!_userDetails.value) return;

    try {
      _loading.value = true;
      return await updateUserProfileMutation.mutateAsync(profileData);
    } catch (err: any) {
      _error.value = err.message;
      throw err;
    } finally {
      _loading.value = false;
    }
  };

  const setCurrentInstitutionRole = async (
    institutionId: string,
    role: UserRoleType
  ) => {
    if (!_userDetails.value) return;

    // Safe mutation
    const updatedDetails = { ..._userDetails.value };

    // Create new roles map
    const updatedRoles = new Map<string, UserRoleType[]>();

    // Copy existing roles
    if (updatedDetails.institutionRoles) {
      for (const [key, value] of updatedDetails.institutionRoles) {
        const roleArray = Array.isArray(value) ? value : [value];
        updatedRoles.set(key, roleArray);
      }
    }

    // Get current roles for this institution or create new array
    const currentRoles = updatedRoles.get(institutionId) || [];

    // If role doesn't already exist in array, add it
    if (!currentRoles.includes(role)) {
      updatedRoles.set(institutionId, [...currentRoles, role]);
    }

    // Update the details
    updatedDetails.institutionRoles = updatedRoles;
    updatedDetails.currentRole = role;
    updatedDetails.institutionId = institutionId;

    _userDetails.value = updatedDetails;
    saveUserDetailsToStorage(updatedDetails);
  };

  const setActiveInstitution = (institution: Institution) => {
    _activeInstitution.value = institution;
    saveActiveInstitutionToStorage(institution);

    // Safe mutation of user details
    if (_userDetails.value?.institutionRoles) {
      const roles = _userDetails.value.institutionRoles.get(institution.id);

      if (roles && roles.length > 0) {
        const updatedDetails = { ..._userDetails.value };
        updatedDetails.currentRole = roles[0];
        updatedDetails.institutionId = institution.id;
        _userDetails.value = updatedDetails;
        saveUserDetailsToStorage(updatedDetails);
      }
    }
  };

  const clearActiveInstitution = () => {
    _activeInstitution.value = null;
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_INSTITUTION);
    }

    // Safe mutation
    if (_userDetails.value) {
      const updatedDetails = { ..._userDetails.value };
      updatedDetails.currentRole = undefined;
      _userDetails.value = updatedDetails;
      saveUserDetailsToStorage(updatedDetails);
    }
  };

  const clearUserData = () => {
    _userDetails.value = null;
    _privacySettings.value = null;
    _activeInstitution.value = null;
    _error.value = null;
    clearUserDataFromStorage();
    console.log('🗑️ User data cleared from store and localStorage');
  };

  // CLIENT-ONLY initialization
  if (import.meta.client) {
    // Initialize from localStorage immediately
    initializeFromStorage();
  }

  return {
    // State - readonly for external consumers
    userDetails: readonly(_userDetails),
    loading: readonly(_loading),
    error: readonly(_error),
    activeInstitution: readonly(_activeInstitution),
    privacySettings: readonly(_privacySettings),
    paginatedUsers: readonly(_paginatedUsers),

    // Computed getters
    displayName,
    isInstitutionLinked,
    currentInstitutionRole,
    hasRole,
    hasAnyRole,
    getRolesForInstitution,
    getPrimaryRoleForInstitution,
    isSavingPrivacy,
    visibilityOptions,
    isPaginatedUsersLoading,
    getPaginatedUsers,
    getPaginationMetadata,

    // Loading states
    savingPrivacy,
    loadingUsers,
    isLoading,

    // Individual mutation loading states
    isUpdatingPrivacy: computed(
      () => updatePrivacySettingsMutation.isLoading.value
    ),
    isUploadingImage: computed(
      () => uploadProfileImageMutation.isLoading.value
    ),
    isUpdatingProfile: computed(
      () => updateUserProfileMutation.isLoading.value
    ),

    // Actions
    fetchUserDetails,
    fetchPaginatedUsers,
    fetchPrivacySettings,
    updatePrivacySetting,
    savePrivacySettings,
    fetchUserRolesForInstitution,
    uploadProfileImage,
    updateUserProfile,
    setCurrentInstitutionRole,
    setActiveInstitution,
    clearActiveInstitution,
    validateUserSession,
    clearUserData,

    // Query factories
    userDetailsQuery,
    paginatedUsersQuery,
    userRolesQuery,
    userValidationQuery,

    // Direct access to queries
    privacySettingsQuery,
  };
});
