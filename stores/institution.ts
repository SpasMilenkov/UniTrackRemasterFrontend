// stores/institution.ts
import { defineStore } from 'pinia';
import { useQuery } from '@pinia/colada';
import { IntegrationStatus } from '~/enums/integration-status.enum';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';

// Types for filtering and pagination




export const useInstitutionStore = defineStore('institution', () => {
  if (import.meta.server) {
    return {
      // State
      institutions: readonly(ref([])),
      allInstitutions: readonly(ref([])),
      activeInstitution: readonly(ref(null)),
      error: readonly(ref(null)),
      currentUserRoles: readonly(ref([])),
      filters: readonly(ref({})),
      pagination: readonly(ref({ page: 1, pageSize: 50 })),
      pagedResult: readonly(ref(null)),

      // Computed getters
      hasInstitutions: false,
      activeInstitutions: [],
      pendingInstitutions: [],
      inactiveInstitutions: [],
      getUserRoleInInstitution: () => () => null,
      hasFilters: false,
      totalInstitutions: 0,
      hasNextPage: false,
      hasPreviousPage: false,

      // Loading states
      loading: false,
      isLoading: false,

      // Actions
      fetchUserInstitutions: async () => [],
      fetchInstitutionById: async () => null,
      fetchAllInstitutions: async () => [],
      fetchFilteredInstitutions: async () => null,
      setActiveInstitution: () => {},
      clearActiveInstitution: () => {},
      fetchUserRolesInInstitution: async () => [],
      initializeStore: async () => {},
      setFilters: () => {},
      clearFilters: () => {},
      setPagination: () => {},
      goToNextPage: async () => {},
      goToPreviousPage: async () => {},
      goToPage: async () => {},

      // Query factories
      userInstitutionsQuery: () => null,
      institutionQuery: () => null,
      userRolesQuery: () => null,
      institutionsQuery: () => null,
      allInstitutionsQuery: () => null,
    };
  }

  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const institutions = ref<InstitutionResponseDto[]>([]);
  const allInstitutions = ref<InstitutionResponseDto[]>([]);
  const activeInstitution = ref<InstitutionResponseDto | null>(null);
  const error = ref<string | null>(null);
  const currentUserRoles = ref<string[]>([]);

  const filters = ref<InstitutionFilters>({});
  const pagination = ref<PaginationParams>({ page: 1, pageSize: 50 });
  const pagedResult = ref<PagedResult<InstitutionResponseDto> | null>(null);

  // User institutions query (unchanged)
  const userInstitutionsQuery = (userId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['institutions', 'user', unref(userId) || ''],
      query: () => {
        const uId = unref(userId);
        if (!uId) throw new Error('User ID is required');
        return $apiFetch<InstitutionResponseDto[]>(`/Institutions/user/${uId}`);
      },
      enabled: () => !!unref(userId),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Single institution query (unchanged)
  const institutionQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['institutions', 'single', unref(id) || ''],
      query: () => {
        const instId = unref(id);
        if (!instId) throw new Error('Institution ID is required');
        return $apiFetch<InstitutionResponseDto>(`/Institutions/${instId}`);
      },
      enabled: () => !!unref(id),
      staleTime: 15 * 60 * 1000, // 15 minutes - institutions change rarely
    });
  };

  // User roles in institution query (unchanged)
  const userRolesQuery = (
    userId: MaybeRef<string | null>,
    institutionId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => [
        'institutions',
        'roles',
        unref(userId) || '',
        unref(institutionId) || '',
      ],
      query: () => {
        const uId = unref(userId);
        const instId = unref(institutionId);
        if (!uId || !instId)
          throw new Error('User ID and Institution ID are required');
        return $apiFetch<any>(`/users/${uId}/institutions/${instId}/roles`);
      },
      enabled: () => !!unref(userId) && !!unref(institutionId),
      staleTime: 20 * 60 * 1000, // 20 minutes - roles change rarely
    });
  };

  // Paginated and filtered institutions query
  const institutionsQuery = (
    queryFilters: MaybeRef<InstitutionFilters>,
    queryPagination: MaybeRef<PaginationParams>
  ) => {
    return useQuery({
      key: () => [
        'institutions',
        'paginated',
        JSON.stringify(unref(queryFilters)),
        JSON.stringify(unref(queryPagination)),
      ],
      query: () => {
        const filters = unref(queryFilters);
        const pag = unref(queryPagination);

        const params = new URLSearchParams();

        // Add pagination
        params.append('page', pag.page.toString());
        params.append('pageSize', pag.pageSize.toString());

        // Add filters if they exist
        if (filters.name?.trim()) params.append('name', filters.name.trim());
        if (filters.type?.trim()) params.append('type', filters.type.trim());
        if (filters.location?.trim())
          params.append('location', filters.location.trim());
        if (filters.integrationStatus?.trim())
          params.append('integrationStatus', filters.integrationStatus.trim());
        if (filters.accreditations?.trim())
          params.append('accreditations', filters.accreditations.trim());

        return $apiFetch<PagedResult<InstitutionResponseDto>>(
          `/Institutions?${params.toString()}`
        );
      },
      staleTime: 5 * 60 * 1000, // 5 minutes - search results can be more dynamic
    });
  };

  // All institutions query (legacy endpoint)
  const allInstitutionsQuery = () => {
    return useQuery({
      key: () => ['institutions', 'all'],
      query: () => $apiFetch<InstitutionResponseDto[]>('/Institutions/all'),
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // Computed getters (existing ones)
  const hasInstitutions = computed(() => institutions.value.length > 0);

  const activeInstitutions = computed(() =>
    institutions.value.filter(
      (inst) => inst.integrationStatus === IntegrationStatus.Active
    )
  );

  const pendingInstitutions = computed(() =>
    institutions.value.filter(
      (inst) =>
        inst.integrationStatus === IntegrationStatus.RequiresVerification ||
        inst.integrationStatus === IntegrationStatus.AdditionalDataSubmitted ||
        inst.integrationStatus === IntegrationStatus.Verified
    )
  );

  const inactiveInstitutions = computed(() =>
    institutions.value.filter(
      (inst) =>
        inst.integrationStatus === IntegrationStatus.Inactive ||
        inst.integrationStatus === IntegrationStatus.Denied
    )
  );

  const getUserRoleInInstitution = computed(() => (institutionId: string) => {
    if (activeInstitution.value?.id === institutionId) {
      return currentUserRoles.value[0] || null;
    }
    return null;
  });

  // Computed getters for filtering and pagination
  const hasFilters = computed(() => {
    return Object.values(filters.value).some(
      (value) => value && value.trim() !== ''
    );
  });

  const totalInstitutions = computed(() => pagedResult.value?.totalCount || 0);

  const hasNextPage = computed(() => {
    if (!pagedResult.value) return false;
    return pagedResult.value.currentPage < pagedResult.value.totalPages;
  });

  const hasPreviousPage = computed(() => {
    if (!pagedResult.value) return false;
    return pagedResult.value.currentPage > 1;
  });

  // Existing action-like functions (unchanged)
  const fetchUserInstitutions = async (userId: string) => {
    error.value = null;

    const query = userInstitutionsQuery(ref(userId));
    await query.refetch();

    const data = query.data.value || [];
    institutions.value = data;

    return data;
  };

  const fetchInstitutionById = async (id: string) => {
    error.value = null;

    // Check if we already have this institution in our list
    const existingInstitution = institutions.value.find(
      (inst) => inst.id === id
    );

    if (existingInstitution) {
      activeInstitution.value = existingInstitution;
      return existingInstitution;
    }

    // Otherwise fetch it from the API
    const query = institutionQuery(ref(id));
    await query.refetch();

    const data = query.data.value;
    if (data) {
      activeInstitution.value = data;

      // Add it to our institutions list if not already there
      if (!institutions.value.some((inst) => inst.id === data.id)) {
        institutions.value.push(data);
      }
    }

    return data;
  };

  // Fetch all institutions using the legacy endpoint
  const fetchAllInstitutions = async () => {
    error.value = null;

    const query = allInstitutionsQuery();
    await query.refetch();

    const data = query.data.value || [];
    allInstitutions.value = data;

    return data;
  };

  // Fetch filtered institutions with pagination
  const fetchFilteredInstitutions = async (
    newFilters?: Partial<InstitutionFilters>,
    newPagination?: Partial<PaginationParams>
  ) => {
    error.value = null;

    // Update filters and pagination if provided
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters };
    }
    if (newPagination) {
      pagination.value = { ...pagination.value, ...newPagination };
    }

    const query = institutionsQuery(filters, pagination);
    await query.refetch();

    const data = query.data.value;
    if (data) {
      pagedResult.value = data;
      institutions.value = data.items;
    }

    return data;
  };

  const setActiveInstitution = (institution: InstitutionResponseDto) => {
    activeInstitution.value = institution;

    // Ensure this institution is in our list
    if (!institutions.value.some((inst) => inst.id === institution.id)) {
      institutions.value.push(institution);
    }

    // Store the active institution ID in local storage for persistence
    if (import.meta.client) {
      localStorage.setItem('activeInstitutionId', institution.id);
    }
  };

  const clearActiveInstitution = () => {
    activeInstitution.value = null;
    if (import.meta.client) {
      localStorage.removeItem('activeInstitutionId');
    }
  };

  const fetchUserRolesInInstitution = async (
    userId: string,
    institutionId: string
  ) => {
    const query = userRolesQuery(ref(userId), ref(institutionId));
    await query.refetch();

    const data = query.data.value;
    if (data) {
      currentUserRoles.value = data.roles;
      return currentUserRoles.value;
    }

    return [];
  };

  const initializeStore = async () => {
    // Check for an active institution ID in local storage
    if (import.meta.client) {
      const activeInstitutionId = localStorage.getItem('activeInstitutionId');

      if (activeInstitutionId) {
        try {
          await fetchInstitutionById(activeInstitutionId);
        } catch (error) {
          console.error('Failed to restore active institution:', error);
          // Clear the invalid ID
          localStorage.removeItem('activeInstitutionId');
        }
      }
    }
  };

  // Filter and pagination management actions
  const setFilters = (newFilters: Partial<InstitutionFilters>) => {
    filters.value = { ...filters.value, ...newFilters };
    // Reset to first page when filters change
    pagination.value.page = 1;
  };

  const clearFilters = () => {
    filters.value = {};
    pagination.value.page = 1;
  };

  const setPagination = (newPagination: Partial<PaginationParams>) => {
    pagination.value = { ...pagination.value, ...newPagination };
  };

  const goToNextPage = async () => {
    if (hasNextPage.value) {
      pagination.value.page += 1;
      await fetchFilteredInstitutions();
    }
  };

  const goToPreviousPage = async () => {
    if (hasPreviousPage.value) {
      pagination.value.page -= 1;
      await fetchFilteredInstitutions();
    }
  };

  const goToPage = async (page: number) => {
    if (
      page >= 1 &&
      (!pagedResult.value || page <= pagedResult.value.totalPages)
    ) {
      pagination.value.page = page;
      await fetchFilteredInstitutions();
    }
  };

  // Auto-initialize on store creation
  if (import.meta.client) {
    initializeStore();
  }

  // Watch for active institution changes to persist to localStorage
  watch(
    () => activeInstitution.value,
    (newInstitution) => {
      if (import.meta.client) {
        if (newInstitution) {
          localStorage.setItem('activeInstitutionId', newInstitution.id);
        } else {
          localStorage.removeItem('activeInstitutionId');
        }
      }
    }
  );

  return {
    // State
    institutions: readonly(institutions),
    allInstitutions: readonly(allInstitutions),
    activeInstitution: readonly(activeInstitution),
    error: readonly(error),
    currentUserRoles: readonly(currentUserRoles),
    filters: readonly(filters),
    pagination: readonly(pagination),
    pagedResult: readonly(pagedResult),

    // Computed getters
    hasInstitutions,
    activeInstitutions,
    pendingInstitutions,
    inactiveInstitutions,
    getUserRoleInInstitution,
    hasFilters,
    totalInstitutions,
    hasNextPage,
    hasPreviousPage,

    // Loading states
    loading: computed(() => false), // Could track specific queries if needed
    isLoading: computed(() => false), // Combined loading state

    // Actions (maintaining existing API + new ones)
    fetchUserInstitutions,
    fetchInstitutionById,
    fetchAllInstitutions,
    fetchFilteredInstitutions,
    setActiveInstitution,
    clearActiveInstitution,
    fetchUserRolesInInstitution,
    initializeStore,
    setFilters,
    clearFilters,
    setPagination,
    goToNextPage,
    goToPreviousPage,
    goToPage,

    // Query factories for dynamic usage
    userInstitutionsQuery,
    institutionQuery,
    userRolesQuery,
    institutionsQuery,
    allInstitutionsQuery,
  };
});
