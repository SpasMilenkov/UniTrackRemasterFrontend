// stores/department.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import {
  departmentFormSchema,
  type DepartmentFormSchema,
} from '~/schemas/department.schema';
import type { DepartmentResponseDto } from '~/interfaces/academic/department.dto';
import type { TeacherResponseDto } from '~/interfaces/academic/teacher.dto';
import type { PagedResult } from '~/interfaces/common/paged-result';

// Re-export types for convenience
export type Department = DepartmentResponseDto;
export type DepartmentForm = DepartmentFormSchema;
export type DepartmentPagedResult = PagedResult<Department>;

// Pagination parameters interface
export interface DepartmentPaginationParams {
  query?: string;
  facultyId?: string;
  institutionId?: string;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const useDepartmentStore = defineStore('department', () => {
  if (import.meta.server) {
    return {
      // State
      departments: readonly(ref([])),
      pagedDepartments: readonly(ref(null)),
      searchQuery: readonly(ref('')),
      facultyFilter: readonly(ref(null)),
      pagination: readonly(ref({ page: 1, pageSize: 50 })),

      // Computed getters
      departmentOptions: computed(() => []),
      filteredDepartments: computed(() => []),

      // Loading states
      loadingDepartments: computed(() => false),
      loadingPagedDepartments: computed(() => false),
      searchLoading: computed(() => false),
      isCreatingDepartment: computed(() => false),
      isUpdatingDepartment: computed(() => false),
      isDeletingDepartment: computed(() => false),
      isLoading: computed(() => false),

      // Actions
      fetchDepartments: async () => [],
      fetchDepartmentsByFaculty: async () => [],
      fetchDepartmentsByInstitution: async () => [],
      fetchPagedDepartments: async () => null,
      fetchPagedDepartmentsByInstitution: async () => null,
      searchDepartments: async () => {},
      setFacultyFilter: () => {},
      setDepartmentSearch: () => {},
      clearSearch: () => {},
      createDepartment: async () => null,
      updateDepartment: async () => null,
      deleteDepartment: async () => {},
      getDepartmentById: async () => null,
      getDepartmentTeachers: async () => [],
      assignTeacherToDepartment: async () => {},
      removeTeacherFromDepartment: async () => {},
      updatePagination: () => {},

      // Query factories
      allDepartmentsQuery: null,
      facultyDepartmentsQuery: () => null,
      institutionDepartmentsQuery: () => null,
      pagedDepartmentsQuery: () => null,
      pagedInstitutionDepartmentsQuery: () => null,
      departmentByIdQuery: () => null,
      departmentTeachersQuery: () => null,
    };
  }

  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const departments = ref<Department[]>([]);
  const pagedDepartments = ref<DepartmentPagedResult | null>(null);
  const searchQuery = ref('');
  const facultyFilter = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    pageSize: 50,
  });

  // All departments query (non-paginated for dropdowns)
  const allDepartmentsQuery = useQuery({
    key: () => ['departments', 'all'],
    query: () => $apiFetch<Department[]>('/Departments/all'),
    enabled: () => import.meta.client,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Paginated departments query (SuperAdmin only)
  const pagedDepartmentsQuery = (
    params: MaybeRef<DepartmentPaginationParams>
  ) => {
    return useQuery({
      key: () => ['departments', 'paged', JSON.stringify(unref(params))],
      query: () => {
        const queryParams = unref(params);
        const searchParams = new URLSearchParams();

        if (queryParams.query) searchParams.append('query', queryParams.query);
        if (queryParams.facultyId)
          searchParams.append('facultyId', queryParams.facultyId);
        if (queryParams.institutionId)
          searchParams.append('institutionId', queryParams.institutionId);
        if (queryParams.type) searchParams.append('type', queryParams.type);
        if (queryParams.status)
          searchParams.append('status', queryParams.status);
        if (queryParams.page)
          searchParams.append('page', queryParams.page.toString());
        if (queryParams.pageSize)
          searchParams.append('pageSize', queryParams.pageSize.toString());

        const queryString = searchParams.toString();
        return $apiFetch<DepartmentPagedResult>(
          `/Departments${queryString ? `?${queryString}` : ''}`
        );
      },
      enabled: () => import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes for paginated data
    });
  };

  // Faculty departments query (non-paginated)
  const facultyDepartmentsQuery = (facultyId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['departments', 'faculty', unref(facultyId) || '', 'all'],
      query: () => {
        const facId = unref(facultyId);
        if (!facId) throw new Error('Faculty ID is required');
        return $apiFetch<Department[]>(`/Departments/faculty/${facId}/all`);
      },
      enabled: () => !!unref(facultyId) && import.meta.client,
      staleTime: 10 * 60 * 1000,
    });
  };

  // Institution departments query (non-paginated)
  const institutionDepartmentsQuery = (
    institutionId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => [
        'departments',
        'institution',
        unref(institutionId) || '',
        'all',
      ],
      query: () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');
        return $apiFetch<Department[]>(
          `/Departments/institution/${instId}/all`
        );
      },
      enabled: () => !!unref(institutionId) && import.meta.client,
      staleTime: 10 * 60 * 1000,
    });
  };

  // Paginated institution departments query
  const pagedInstitutionDepartmentsQuery = (
    institutionId: MaybeRef<string | null>,
    params: MaybeRef<Omit<DepartmentPaginationParams, 'institutionId'>>
  ) => {
    return useQuery({
      key: () => [
        'departments',
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
        if (queryParams.facultyId)
          searchParams.append('facultyId', queryParams.facultyId);
        if (queryParams.type) searchParams.append('type', queryParams.type);
        if (queryParams.status)
          searchParams.append('status', queryParams.status);
        if (queryParams.page)
          searchParams.append('page', queryParams.page.toString());
        if (queryParams.pageSize)
          searchParams.append('pageSize', queryParams.pageSize.toString());

        const queryString = searchParams.toString();
        return $apiFetch<DepartmentPagedResult>(
          `/Departments/institution/${instId}${queryString ? `?${queryString}` : ''}`
        );
      },
      enabled: () => !!unref(institutionId) && import.meta.client,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Single department by ID query
  const departmentByIdQuery = (departmentId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['departments', 'single', unref(departmentId) || ''],
      query: () => {
        const id = unref(departmentId);
        if (!id) throw new Error('Department ID is required');
        return $apiFetch<Department>(`/Departments/${id}`);
      },
      enabled: () => !!unref(departmentId) && import.meta.client,
      staleTime: 15 * 60 * 1000,
    });
  };

  // Department teachers query
  const departmentTeachersQuery = (departmentId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['departments', unref(departmentId) || '', 'teachers'],
      query: () => {
        const id = unref(departmentId);
        if (!id) throw new Error('Department ID is required');
        return $apiFetch<TeacherResponseDto[]>(
          `/Departments/${id}/teachers`
        );
      },
      enabled: () => !!unref(departmentId) && import.meta.client,
      staleTime: 10 * 60 * 1000,
    });
  };

  // Create department mutation
  const createDepartmentMutation = useMutation({
    mutation: (departmentData: DepartmentForm) => {
      // Validate form data with Zod schema
      const parsedData = departmentFormSchema.parse(departmentData);

      return $apiFetch<Department>('/Departments', {
        method: 'POST',
        body: parsedData,
      });
    },
    onSuccess: (newDepartment) => {
      // Add to local state for immediate UI update
      departments.value.push(newDepartment);

      // Refetch relevant queries
      allDepartmentsQuery.refetch();

      console.log('Department created successfully:', newDepartment);
    },
    onError: (error) => {
      console.error('Error creating department:', error);
    },
  });

  // Update department mutation
  const updateDepartmentMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: Partial<DepartmentForm> }) =>
      $apiFetch<Department>(`/Departments/${id}`, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: (updatedDepartment, { id }) => {
      // Update in local state
      const index = departments.value.findIndex((d) => d.id === id);
      if (index !== -1) {
        departments.value[index] = updatedDepartment;
      }

      // Update paged results if available
      if (pagedDepartments.value) {
        const pagedIndex = pagedDepartments.value.items.findIndex(
          (d: { id: string; }) => d.id === id
        );
        if (pagedIndex !== -1) {
          pagedDepartments.value.items[pagedIndex] = updatedDepartment;
        }
      }

      // Refetch relevant queries
      allDepartmentsQuery.refetch();
    },
    onError: (error) => {
      console.error('Error updating department:', error);
    },
  });

  // Delete department mutation
  const deleteDepartmentMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/Departments/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      // Remove from local state
      departments.value = departments.value.filter((d) => d.id !== id);

      // Remove from paged results if available
      if (pagedDepartments.value) {
        pagedDepartments.value.items = pagedDepartments.value.items.filter(
          (d) => d.id !== id
        );
        pagedDepartments.value.totalCount -= 1;
      }

      // Refetch relevant queries
      allDepartmentsQuery.refetch();
    },
    onError: (error) => {
      console.error('Error deleting department:', error);
    },
  });

  // Assign teacher to department mutation
  const assignTeacherMutation = useMutation({
    mutation: ({
      departmentId,
      teacherId,
    }: {
      departmentId: string;
      teacherId: string;
    }) =>
      $apiFetch(`/Departments/${departmentId}/teachers/${teacherId}`, {
        method: 'POST',
      }),
    onSuccess: (_, { departmentId }) => {
      // Refetch department teachers
      const teachersQuery = departmentTeachersQuery(ref(departmentId));
      teachersQuery.refetch();
    },
    onError: (error) => {
      console.error('Error assigning teacher to department:', error);
    },
  });

  // Remove teacher from department mutation
  const removeTeacherMutation = useMutation({
    mutation: ({
      departmentId,
      teacherId,
    }: {
      departmentId: string;
      teacherId: string;
    }) =>
      $apiFetch(`/Departments/${departmentId}/teachers/${teacherId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, { departmentId }) => {
      // Refetch department teachers
      const teachersQuery = departmentTeachersQuery(ref(departmentId));
      teachersQuery.refetch();
    },
    onError: (error) => {
      console.error('Error removing teacher from department:', error);
    },
  });

  // Watch for all departments query data changes
  watch(
    () => allDepartmentsQuery.data.value,
    (newDepartments) => {
      if (newDepartments) {
        departments.value = newDepartments;
      }
    },
    { immediate: true }
  );

  // Computed getters
  const departmentOptions = computed(() => {
    return departments.value.map((department) => ({
      label: `${department.name || ''} ${department.code ? `(${department.code})` : ''}`,
      value: department.id,
    }));
  });

  const filteredDepartments = computed(() => {
    if (!searchQuery.value && !facultyFilter.value) {
      return departments.value;
    }

    return departments.value.filter((department) => {
      // Apply faculty filter
      if (facultyFilter.value && department.facultyId !== facultyFilter.value) {
        return false;
      }

      // Apply search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        return (
          (department.name && department.name.toLowerCase().includes(query)) ||
          (department.code && department.code.toLowerCase().includes(query)) ||
          (department.description &&
            department.description.toLowerCase().includes(query)) ||
          (department.location &&
            department.location.toLowerCase().includes(query)) ||
          (department.contactEmail &&
            department.contactEmail.toLowerCase().includes(query))
        );
      }

      return true;
    });
  });

  // Action-like functions maintaining your existing API
  const fetchDepartments = async () => {
    await allDepartmentsQuery.refetch();
    return departments.value;
  };

  const fetchDepartmentsByFaculty = async (facultyId: string) => {
    if (!facultyId) return [];

    console.log('Fetching departments for faculty:', facultyId);

    const query = facultyDepartmentsQuery(ref(facultyId));
    await query.refetch();

    const data = query.data.value || [];
    departments.value = data;
    facultyFilter.value = facultyId;
    console.log('Faculty departments:', data);

    return data;
  };

  const fetchDepartmentsByInstitution = async (institutionId: string) => {
    if (!institutionId) return [];

    console.log('Fetching departments for institution:', institutionId);

    const query = institutionDepartmentsQuery(ref(institutionId));
    await query.refetch();

    const data = query.data.value || [];
    departments.value = data;
    console.log('Institution departments:', data);

    return data;
  };

  const fetchPagedDepartments = async (
    params: DepartmentPaginationParams = {}
  ) => {
    const query = pagedDepartmentsQuery(
      ref({
        ...params,
        page: params.page || pagination.value.page,
        pageSize: params.pageSize || pagination.value.pageSize,
      })
    );
    await query.refetch();

    const data = query.data.value;
    if (data) {
      pagedDepartments.value = data;
    }

    return data;
  };

  const fetchPagedDepartmentsByInstitution = async (
    institutionId: string,
    params: Omit<DepartmentPaginationParams, 'institutionId'> = {}
  ) => {
    if (!institutionId) return null;

    const query = pagedInstitutionDepartmentsQuery(
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
      pagedDepartments.value = data;
    }

    return data;
  };

  const searchDepartments = async (
    query: string,
    facultyId: string | null = null
  ) => {
    searchQuery.value = query;

    if (!query.trim()) {
      // If no search term, fetch departments appropriately
      if (facultyId) {
        return await fetchDepartmentsByFaculty(facultyId);
      } else {
        // Get current institution from institution store
        const institutionStore = useInstitutionStore();
        const institutionId = institutionStore.activeInstitution?.id;

        if (institutionId) {
          return await fetchDepartmentsByInstitution(institutionId);
        } else {
          // Fallback to all departments
          await fetchDepartments();
          return departments.value;
        }
      }
    }

    // Use local filtering since there's no search endpoint
    console.log('Using local filtering for department search');

    // Ensure we have data loaded first
    if (departments.value.length === 0) {
      if (facultyId) {
        await fetchDepartmentsByFaculty(facultyId);
      } else {
        const institutionStore = useInstitutionStore();
        const institutionId = institutionStore.activeInstitution?.id;

        if (institutionId) {
          await fetchDepartmentsByInstitution(institutionId);
        } else {
          await fetchDepartments();
        }
      }
    }

    return filteredDepartments.value;
  };

  const setFacultyFilter = (facultyId: string | null) => {
    facultyFilter.value = facultyId;
  };

  const setDepartmentSearch = (query: string) => {
    searchQuery.value = query;
  };

  const clearSearch = () => {
    searchQuery.value = '';
  };

  const createDepartment = async (departmentData: DepartmentForm) => {
    console.log(
      'Creating department with data:',
      departmentFormSchema.parse(departmentData)
    );
    return await createDepartmentMutation.mutateAsync(departmentData);
  };

  const updateDepartment = async (
    id: string,
    data: Partial<DepartmentForm>
  ) => {
    return await updateDepartmentMutation.mutateAsync({ id, data });
  };

  const deleteDepartment = async (id: string) => {
    await deleteDepartmentMutation.mutateAsync(id);
  };

  const getDepartmentById = async (id: string) => {
    const query = departmentByIdQuery(ref(id));
    await query.refetch();
    return query.data.value;
  };

  const getDepartmentTeachers = async (departmentId: string) => {
    const query = departmentTeachersQuery(ref(departmentId));
    await query.refetch();
    return query.data.value || [];
  };

  const assignTeacherToDepartment = async (
    departmentId: string,
    teacherId: string
  ) => {
    await assignTeacherMutation.mutateAsync({ departmentId, teacherId });
  };

  const removeTeacherFromDepartment = async (
    departmentId: string,
    teacherId: string
  ) => {
    await removeTeacherMutation.mutateAsync({ departmentId, teacherId });
  };

  const updatePagination = (page: number, pageSize?: number) => {
    pagination.value.page = page;
    if (pageSize) {
      pagination.value.pageSize = pageSize;
    }
  };

  // Auto-sync with institution departments when active institution changes - only on client
  let currentInstitutionDepartmentsQuery: ReturnType<
    typeof institutionDepartmentsQuery
  > | null = null;

  if (import.meta.client) {
    const institutionStore = useInstitutionStore();
    const currentInstitutionId = computed(
      () => institutionStore.activeInstitution?.id ?? null
    );

    // Create a query for the current institution
    currentInstitutionDepartmentsQuery =
      institutionDepartmentsQuery(currentInstitutionId);

    // Watch for current institution departments data changes
    watch(
      () => currentInstitutionDepartmentsQuery?.data.value,
      (newDepartments) => {
        if (newDepartments) {
          departments.value = newDepartments;
        }
      },
      { immediate: true }
    );
  }

  return {
    // State
    departments: readonly(departments),
    pagedDepartments: readonly(pagedDepartments),
    searchQuery: readonly(searchQuery),
    facultyFilter: readonly(facultyFilter),
    pagination: readonly(pagination),

    // Computed getters
    departmentOptions,
    filteredDepartments,

    // Loading states
    loadingDepartments: computed(() => allDepartmentsQuery.isLoading.value),
    loadingPagedDepartments: computed(() => false),
    searchLoading: computed(() => false),
    isCreatingDepartment: computed(
      () => createDepartmentMutation.isLoading.value
    ),
    isUpdatingDepartment: computed(
      () => updateDepartmentMutation.isLoading.value
    ),
    isDeletingDepartment: computed(
      () => deleteDepartmentMutation.isLoading.value
    ),

    // Combined loading state
    isLoading: computed(
      () =>
        allDepartmentsQuery.isLoading.value ||
        createDepartmentMutation.isLoading.value ||
        updateDepartmentMutation.isLoading.value ||
        deleteDepartmentMutation.isLoading.value
    ),

    // Actions (maintaining existing API plus new ones)
    fetchDepartments,
    fetchDepartmentsByFaculty,
    fetchDepartmentsByInstitution,
    fetchPagedDepartments,
    fetchPagedDepartmentsByInstitution,
    searchDepartments,
    setFacultyFilter,
    setDepartmentSearch,
    clearSearch,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById,
    getDepartmentTeachers,
    assignTeacherToDepartment,
    removeTeacherFromDepartment,
    updatePagination,

    // Query factories for dynamic usage
    allDepartmentsQuery,
    facultyDepartmentsQuery,
    institutionDepartmentsQuery,
    pagedDepartmentsQuery,
    pagedInstitutionDepartmentsQuery,
    departmentByIdQuery,
    departmentTeachersQuery,
  };
});
