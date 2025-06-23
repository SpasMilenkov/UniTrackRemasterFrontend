// stores/faculty.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import {
  facultyFormSchema,
  type FacultyFormSchema,
} from '~/schemas/faculty.schema';
import type { FacultyResponseDto } from '~/interfaces/academic/faculty.dto';
import type { DepartmentResponseDto } from '~/interfaces/academic/department.dto';
import type { MajorResponseDto } from '~/interfaces/academic/major.dto';
import type { PagedResult } from '~/interfaces/common/paged-result';

// Re-export types for convenience
export type Faculty = FacultyResponseDto;
export type FacultyForm = FacultyFormSchema;
export type FacultyPagedResult = PagedResult<Faculty>;

// Pagination parameters interface

export const useFacultyStore = defineStore('faculty', () => {
  if (import.meta.server) {
    return {
      // State
      faculties: readonly(ref([])),
      pagedFaculties: readonly(ref(null)),
      searchQuery: readonly(ref('')),
      pagination: readonly(ref({ page: 1, pageSize: 50 })),

      // Computed getters
      facultyOptions: computed(() => []),
      filteredFaculties: computed(() => []),

      // Loading states
      loadingFaculties: computed(() => false),
      loadingPagedFaculties: computed(() => false),
      searchLoading: computed(() => false),
      isCreatingFaculty: computed(() => false),
      isUpdatingFaculty: computed(() => false),
      isDeletingFaculty: computed(() => false),
      isLoading: computed(() => false),

      // Actions
      fetchFacultiesByInstitution: async () => [],
      fetchFacultiesByUniversity: async () => [],
      fetchPagedFaculties: async () => null,
      fetchPagedFacultiesByInstitution: async () => null,
      searchFaculties: async () => [],
      createFaculty: async () => null,
      updateFaculty: async () => null,
      deleteFaculty: async () => false,
      getFacultyById: async () => null,
      getFacultyDepartments: async () => [],
      getFacultyMajors: async () => [],
      clearSearch: () => {},
      updatePagination: () => {},

      // Query factories
      institutionFacultiesQuery: () => null,
      universityFacultiesQuery: () => null,
      pagedFacultiesQuery: () => null,
      pagedInstitutionFacultiesQuery: () => null,
      facultyByIdQuery: () => null,
      facultyDepartmentsQuery: () => null,
      facultyMajorsQuery: () => null,
      allFacultiesQuery: null,
    };
  }

  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const faculties = ref<Faculty[]>([]);
  const pagedFaculties = ref<FacultyPagedResult | null>(null);
  const searchQuery = ref('');
  const pagination = ref({
    page: 1,
    pageSize: 50,
  });

  // All faculties query (non-paginated for dropdowns) - SuperAdmin only
  const allFacultiesQuery = useQuery({
    key: () => ['faculties', 'all'],
    query: () => $apiFetch<Faculty[]>('/Faculties/all'),
    enabled: () => import.meta.client,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Paginated faculties query (SuperAdmin only)
  const pagedFacultiesQuery = (params: MaybeRef<FacultyPaginationParams>) => {
    return useQuery({
      key: () => ['faculties', 'paged', unref(params)],
      query: () => {
        const queryParams = unref(params);
        const searchParams = new URLSearchParams();

        if (queryParams.query) searchParams.append('query', queryParams.query);
        if (queryParams.universityId)
          searchParams.append('universityId', queryParams.universityId);
        if (queryParams.institutionId)
          searchParams.append('institutionId', queryParams.institutionId);
        if (queryParams.status)
          searchParams.append('status', queryParams.status);
        if (queryParams.page)
          searchParams.append('page', queryParams.page.toString());
        if (queryParams.pageSize)
          searchParams.append('pageSize', queryParams.pageSize.toString());

        const queryString = searchParams.toString();
        return $apiFetch<FacultyPagedResult>(
          `/Faculties${queryString ? `?${queryString}` : ''}`
        );
      },
      enabled: () => import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes for paginated data
    });
  };

  // Institution faculties query (non-paginated)
  const institutionFacultiesQuery = (
    institutionId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => [
        'faculties',
        'institution',
        unref(institutionId) || '',
        'all',
      ],
      query: () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');
        return $apiFetch<Faculty[]>(`/Faculties/institution/${instId}/all`);
      },
      enabled: () => !!unref(institutionId) && import.meta.client,
      staleTime: 10 * 60 * 1000,
    });
  };

  // Paginated institution faculties query
  const pagedInstitutionFacultiesQuery = (
    institutionId: MaybeRef<string | null>,
    params: MaybeRef<Omit<FacultyPaginationParams, 'institutionId'>>
  ) => {
    return useQuery({
      key: () => [
        'faculties',
        'institution',
        unref(institutionId) || '',
        'paged',
        unref(params),
      ],
      query: () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');

        const queryParams = unref(params);
        const searchParams = new URLSearchParams();

        if (queryParams.query) searchParams.append('query', queryParams.query);
        if (queryParams.universityId)
          searchParams.append('universityId', queryParams.universityId);
        if (queryParams.status)
          searchParams.append('status', queryParams.status);
        if (queryParams.page)
          searchParams.append('page', queryParams.page.toString());
        if (queryParams.pageSize)
          searchParams.append('pageSize', queryParams.pageSize.toString());

        const queryString = searchParams.toString();
        return $apiFetch<FacultyPagedResult>(
          `/Faculties/institution/${instId}${queryString ? `?${queryString}` : ''}`
        );
      },
      enabled: () => !!unref(institutionId) && import.meta.client,
      staleTime: 5 * 60 * 1000,
    });
  };

  // University faculties query (non-paginated)
  const universityFacultiesQuery = (universityId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['faculties', 'university', unref(universityId) || '', 'all'],
      query: () => {
        const uniId = unref(universityId);
        if (!uniId) throw new Error('University ID is required');
        return $apiFetch<Faculty[]>(`/Faculties/university/${uniId}/all`);
      },
      enabled: () => !!unref(universityId) && import.meta.client,
      staleTime: 10 * 60 * 1000,
    });
  };

  // Single faculty by ID query
  const facultyByIdQuery = (facultyId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['faculties', 'single', unref(facultyId) || ''],
      query: () => {
        const id = unref(facultyId);
        if (!id) throw new Error('Faculty ID is required');
        return $apiFetch<Faculty>(`/Faculties/${id}`);
      },
      enabled: () => !!unref(facultyId) && import.meta.client,
      staleTime: 15 * 60 * 1000,
    });
  };

  // Faculty departments query
  const facultyDepartmentsQuery = (facultyId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['faculties', unref(facultyId) || '', 'departments'],
      query: () => {
        const id = unref(facultyId);
        if (!id) throw new Error('Faculty ID is required');
        return $apiFetch<DepartmentResponseDto[]>(
          `/Faculties/${id}/departments`
        );
      },
      enabled: () => !!unref(facultyId) && import.meta.client,
      staleTime: 10 * 60 * 1000,
    });
  };

  // Faculty majors query
  const facultyMajorsQuery = (facultyId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['faculties', unref(facultyId) || '', 'majors'],
      query: () => {
        const id = unref(facultyId);
        if (!id) throw new Error('Faculty ID is required');
        return $apiFetch<MajorResponseDto[]>(`/Faculties/${id}/majors`);
      },
      enabled: () => !!unref(facultyId) && import.meta.client,
      staleTime: 10 * 60 * 1000,
    });
  };

  // Create faculty mutation
  const createFacultyMutation = useMutation({
    mutation: (facultyData: FacultyForm) => {
      // Validate form data with Zod schema

      console.log('Creating faculty with data:', facultyData);
      const parsedData = facultyFormSchema.parse(facultyData);

      return $apiFetch<Faculty>('/Faculties', {
        method: 'POST',
        body: parsedData,
      });
    },
    onSuccess: (newFaculty) => {
      // Add to local state for immediate UI update
      faculties.value.push(newFaculty);

      // Refetch relevant queries
      allFacultiesQuery.refetch();

      console.log('Faculty created successfully:', newFaculty);
    },
    onError: (error) => {
      console.error('Error creating faculty:', error);
    },
  });

  // Update faculty mutation
  const updateFacultyMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: Partial<FacultyForm> }) =>
      $apiFetch<Faculty>(`/Faculties/${id}`, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: (updatedFaculty, { id }) => {
      // Update in local state
      const index = faculties.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        faculties.value[index] = updatedFaculty;
      }

      // Update paged results if available
      if (pagedFaculties.value) {
        const pagedIndex = pagedFaculties.value.items.findIndex(
          (f) => f.id === id
        );
        if (pagedIndex !== -1) {
          pagedFaculties.value.items[pagedIndex] = updatedFaculty;
        }
      }

      // Refetch relevant queries
      allFacultiesQuery.refetch();
    },
    onError: (error) => {
      console.error('Error updating faculty:', error);
    },
  });

  // Delete faculty mutation
  const deleteFacultyMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/Faculties/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      // Remove from local state
      faculties.value = faculties.value.filter((f) => f.id !== id);

      // Remove from paged results if available
      if (pagedFaculties.value) {
        pagedFaculties.value.items = pagedFaculties.value.items.filter(
          (f) => f.id !== id
        );
        pagedFaculties.value.totalCount -= 1;
      }

      // Refetch relevant queries
      allFacultiesQuery.refetch();
    },
    onError: (error) => {
      console.error('Error deleting faculty:', error);
    },
  });

  // Watch for all faculties query data changes
  watch(
    () => allFacultiesQuery.data.value,
    (newFaculties) => {
      if (newFaculties) {
        faculties.value = newFaculties;
      }
    },
    { immediate: true }
  );

  // Computed getters
  const facultyOptions = computed(() => {
    return faculties.value.map((faculty) => ({
      label: `${faculty.name || ''} ${faculty.code ? `(${faculty.code})` : ''}`,
      value: faculty.id,
    }));
  });

  const filteredFaculties = computed(() => {
    if (!searchQuery.value) return faculties.value;

    const query = searchQuery.value.toLowerCase();
    return faculties.value.filter(
      (faculty) =>
        (faculty.name && faculty.name.toLowerCase().includes(query)) ||
        (faculty.code && faculty.code.toLowerCase().includes(query)) ||
        (faculty.shortDescription &&
          faculty.shortDescription.toLowerCase().includes(query))
    );
  });

  // Action-like functions maintaining your existing API
  const fetchFacultiesByInstitution = async (institutionId: string) => {
    if (!institutionId) return [];

    console.log('Fetching faculties for institution:', institutionId);

    const query = institutionFacultiesQuery(ref(institutionId));
    await query.refetch();

    const data = query.data.value || [];
    faculties.value = data;
    console.log('Institution faculties:', data);

    return data;
  };

  const fetchFacultiesByUniversity = async (universityId: string) => {
    if (!universityId) return [];

    console.log('Fetching faculties for university:', universityId);

    const query = universityFacultiesQuery(ref(universityId));
    await query.refetch();

    const data = query.data.value || [];
    faculties.value = data;
    console.log('University faculties:', data);

    return data;
  };

  const fetchPagedFaculties = async (params: FacultyPaginationParams = {}) => {
    const query = pagedFacultiesQuery(
      ref({
        ...params,
        page: params.page || pagination.value.page,
        pageSize: params.pageSize || pagination.value.pageSize,
      })
    );
    await query.refetch();

    const data = query.data.value;
    if (data) {
      pagedFaculties.value = data;
    }

    return data;
  };

  const fetchPagedFacultiesByInstitution = async (
    institutionId: string,
    params: Omit<FacultyPaginationParams, 'institutionId'> = {}
  ) => {
    if (!institutionId) return null;

    const query = pagedInstitutionFacultiesQuery(
      ref(institutionId),
      ref({
        ...params,
        page: params.page || pagination.value.page,
        pageSize: params.pageSize || pagination.value.pageSize,
      })
    );
    await query.refetch();

    const data = query.data.value;
    if (data) {
      pagedFaculties.value = data;
    }

    return data;
  };

  const searchFaculties = async (query: string) => {
    searchQuery.value = query;

    if (!query.trim()) {
      // If no search term, fetch all faculties for current institution
      const institutionStore = useInstitutionStore();
      const institutionId = institutionStore.activeInstitution?.id;

      if (institutionId) {
        return await fetchFacultiesByInstitution(institutionId);
      } else {
        // Fallback to all faculties if no active institution
        await allFacultiesQuery.refetch();
        return faculties.value;
      }
    }

    // Use local filtering since there's no search endpoint
    console.log('Using local filtering for faculty search');

    // Ensure we have data loaded first
    if (faculties.value.length === 0) {
      const institutionStore = useInstitutionStore();
      const institutionId = institutionStore.activeInstitution?.id;

      if (institutionId) {
        await fetchFacultiesByInstitution(institutionId);
      } else {
        await allFacultiesQuery.refetch();
      }
    }

    return filteredFaculties.value;
  };

  const createFaculty = async (facultyData: FacultyForm) => {
    console.log(
      'Creating faculty with data:',
      facultyFormSchema.parse(facultyData)
    );
    return await createFacultyMutation.mutateAsync(facultyData);
  };

  const updateFaculty = async (id: string, data: Partial<FacultyForm>) => {
    return await updateFacultyMutation.mutateAsync({ id, data });
  };

  const deleteFaculty = async (id: string) => {
    await deleteFacultyMutation.mutateAsync(id);
    return true;
  };

  const getFacultyById = async (id: string) => {
    const query = facultyByIdQuery(ref(id));
    await query.refetch();
    return query.data.value;
  };

  const getFacultyDepartments = async (facultyId: string) => {
    const query = facultyDepartmentsQuery(ref(facultyId));
    await query.refetch();
    return query.data.value || [];
  };

  const getFacultyMajors = async (facultyId: string) => {
    const query = facultyMajorsQuery(ref(facultyId));
    await query.refetch();
    return query.data.value || [];
  };

  const clearSearch = () => {
    searchQuery.value = '';
  };

  const updatePagination = (page: number, pageSize?: number) => {
    pagination.value.page = page;
    if (pageSize) {
      pagination.value.pageSize = pageSize;
    }
  };

  // Auto-sync with institution faculties when active institution changes - only on client
  let currentInstitutionFacultiesQuery: ReturnType<
    typeof institutionFacultiesQuery
  > | null = null;

  if (import.meta.client) {
    const institutionStore = useInstitutionStore();
    const currentInstitutionId = computed(
      () => institutionStore.activeInstitution?.id ?? null
    );

    // Create a query for the current institution
    currentInstitutionFacultiesQuery =
      institutionFacultiesQuery(currentInstitutionId);

    // Watch for current institution faculties data changes
    watch(
      () => currentInstitutionFacultiesQuery?.data.value,
      (newFaculties) => {
        if (newFaculties) {
          faculties.value = newFaculties;
        }
      },
      { immediate: true }
    );
  }

  return {
    // State
    faculties: readonly(faculties),
    pagedFaculties: readonly(pagedFaculties),
    searchQuery: readonly(searchQuery),
    pagination: readonly(pagination),

    // Computed getters
    facultyOptions,
    filteredFaculties,

    // Loading states
    loadingFaculties: computed(() => allFacultiesQuery.isLoading.value),
    loadingPagedFaculties: computed(() => false),
    searchLoading: computed(() => false),
    isCreatingFaculty: computed(() => createFacultyMutation.isLoading.value),
    isUpdatingFaculty: computed(() => updateFacultyMutation.isLoading.value),
    isDeletingFaculty: computed(() => deleteFacultyMutation.isLoading.value),

    // Combined loading state
    isLoading: computed(
      () =>
        allFacultiesQuery.isLoading.value ||
        createFacultyMutation.isLoading.value ||
        updateFacultyMutation.isLoading.value ||
        deleteFacultyMutation.isLoading.value
    ),

    // Actions (maintaining existing API plus new ones)
    fetchFacultiesByInstitution,
    fetchFacultiesByUniversity,
    fetchPagedFaculties,
    fetchPagedFacultiesByInstitution,
    searchFaculties,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    getFacultyById,
    getFacultyDepartments,
    getFacultyMajors,
    clearSearch,
    updatePagination,

    // Query factories for dynamic usage
    institutionFacultiesQuery,
    universityFacultiesQuery,
    pagedFacultiesQuery,
    pagedInstitutionFacultiesQuery,
    facultyByIdQuery,
    facultyDepartmentsQuery,
    facultyMajorsQuery,

    // Direct access to main queries
    allFacultiesQuery,
  };
});
