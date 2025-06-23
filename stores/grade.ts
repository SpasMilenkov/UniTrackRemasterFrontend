// stores/grade.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import { gradeFormSchema, type GradeFormSchema } from '~/schemas/grade.schema';
import type { GradeResponseDto } from '~/interfaces/academic/grade-response.dto';
import type { PagedResult } from '~/interfaces/common/paged-result';

// Re-export types for convenience
export type Grade = GradeResponseDto;
export type GradeForm = GradeFormSchema;
export type GradePagedResult = PagedResult<Grade>;

// Pagination parameters interface

export const useGradeStore = defineStore('grade', () => {
  if (import.meta.server) {
    return {
      // State
      grades: readonly(ref([])),
      pagedGrades: readonly(ref(null)),
      searchQuery: readonly(ref('')),
      pagination: readonly(ref({ page: 1, pageSize: 15 })),

      // Computed getters
      gradeOptions: [],
      filteredGrades: [],

      // Loading states
      loadingGrades: false,
      loadingPagedGrades: false,
      searchLoading: false,
      isCreatingGrade: false,
      isUpdatingGrade: false,
      isDeletingGrade: false,
      isLoading: false,

      // Actions
      fetchGrades: async () => {},
      fetchGradesByInstitution: async () => [],
      fetchGradesByAcademicYear: async () => [],
      fetchPagedGrades: async () => null,
      fetchPagedGradesByInstitution: async () => null,
      searchGrades: async () => {},
      createGrade: async () => null,
      updateGrade: async () => null,
      deleteGrade: async () => {},
      clearSearch: () => {},
      updatePagination: () => {},

      // Query factories
      institutionGradesQuery: () => null,
      academicYearGradesQuery: () => null,
      pagedGradesQuery: () => null,
      pagedInstitutionGradesQuery: () => null,
      gradesQuery: null,
    };
  }

  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const grades = ref<Grade[]>([]);
  const pagedGrades = ref<GradePagedResult | null>(null);
  const searchQuery = ref('');
  const pagination = ref({
    page: 1,
    pageSize: 15,
  });

  // All grades query (non-paginated for dropdowns)
  const gradesQuery = useQuery({
    key: () => ['grades', 'all'],
    query: () => $apiFetch<Grade[]>('/Grades/all'),
    staleTime: 10 * 60 * 1000, // 10 minutes - grades don't change often
  });

  // Paginated grades query (for data tables) - SuperAdmin only
  const pagedGradesQuery = (params: MaybeRef<GradePaginationParams>) => {
    return useQuery({
      key: () => ['grades', 'paged', unref(params)],
      query: () => {
        const queryParams = unref(params);
        const searchParams = new URLSearchParams();

        if (queryParams.query) searchParams.append('query', queryParams.query);
        if (queryParams.institutionId)
          searchParams.append('institutionId', queryParams.institutionId);
        if (queryParams.academicYearId)
          searchParams.append('academicYearId', queryParams.academicYearId);
        if (queryParams.hasHomeRoomTeacher !== undefined) {
          searchParams.append(
            'hasHomeRoomTeacher',
            queryParams.hasHomeRoomTeacher.toString()
          );
        }
        if (queryParams.page)
          searchParams.append('page', queryParams.page.toString());
        if (queryParams.pageSize)
          searchParams.append('pageSize', queryParams.pageSize.toString());

        const queryString = searchParams.toString();
        return $apiFetch<GradePagedResult>(
          `/Grades${queryString ? `?${queryString}` : ''}`
        );
      },
      staleTime: 5 * 60 * 1000, // 5 minutes for paginated data
    });
  };

  // Institution grades query (non-paginated)
  const institutionGradesQuery = (institutionId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['grades', 'institution', unref(institutionId) || '', 'all'],
      query: () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');
        return $apiFetch<Grade[]>(`/Grades/institution/${instId}/all`);
      },
      enabled: () => !!unref(institutionId),
      staleTime: 10 * 60 * 1000,
    });
  };

  // Paginated institution grades query
  const pagedInstitutionGradesQuery = (
    institutionId: MaybeRef<string | null>,
    params: MaybeRef<Omit<GradePaginationParams, 'institutionId'>>
  ) => {
    return useQuery({
      key: () => [
        'grades',
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
        if (queryParams.academicYearId)
          searchParams.append('academicYearId', queryParams.academicYearId);
        if (queryParams.hasHomeRoomTeacher !== undefined) {
          searchParams.append(
            'hasHomeRoomTeacher',
            queryParams.hasHomeRoomTeacher.toString()
          );
        }
        if (queryParams.page)
          searchParams.append('page', queryParams.page.toString());
        if (queryParams.pageSize)
          searchParams.append('pageSize', queryParams.pageSize.toString());

        const queryString = searchParams.toString();
        return $apiFetch<GradePagedResult>(
          `/Grades/institution/${instId}${queryString ? `?${queryString}` : ''}`
        );
      },
      enabled: () => !!unref(institutionId),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Academic year grades query (non-paginated)
  const academicYearGradesQuery = (academicYearId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => [
        'grades',
        'academic-year',
        unref(academicYearId) || '',
        'all',
      ],
      query: () => {
        const yearId = unref(academicYearId);
        if (!yearId) throw new Error('Academic year ID is required');
        return $apiFetch<Grade[]>(`/Grades/academic-year/${yearId}/all`);
      },
      enabled: () => !!unref(academicYearId),
      staleTime: 10 * 60 * 1000,
    });
  };

  // Create grade mutation
  const createGradeMutation = useMutation({
    mutation: (gradeData: GradeForm) => {
      // Validate form data with Zod schema
      const parsedData = gradeFormSchema.parse(gradeData);

      return $apiFetch<Grade>('/Grades', {
        method: 'POST',
        body: parsedData,
      });
    },
    onSuccess: (newGrade) => {
      // Add to local state for immediate UI update
      grades.value.push(newGrade);

      // Refetch relevant queries
      gradesQuery.refetch();
    },
    onError: (error) => {
      console.error('Error creating grade:', error);
    },
  });

  // Update grade mutation
  const updateGradeMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: Partial<GradeForm> }) =>
      $apiFetch<Grade>(`/Grades/${id}`, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: (updatedGrade, { id }) => {
      // Update in local state
      const index = grades.value.findIndex((g) => g.id === id);
      if (index !== -1) {
        grades.value[index] = updatedGrade;
      }

      // Update paged results if available
      if (pagedGrades.value) {
        const pagedIndex = pagedGrades.value.items.findIndex(
          (g) => g.id === id
        );
        if (pagedIndex !== -1) {
          pagedGrades.value.items[pagedIndex] = updatedGrade;
        }
      }

      // Refetch relevant queries
      gradesQuery.refetch();
    },
    onError: (error) => {
      console.error('Error updating grade:', error);
    },
  });

  // Delete grade mutation
  const deleteGradeMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/Grades/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      // Remove from local state
      grades.value = grades.value.filter((g) => g.id !== id);

      // Remove from paged results if available
      if (pagedGrades.value) {
        pagedGrades.value.items = pagedGrades.value.items.filter(
          (g) => g.id !== id
        );
        pagedGrades.value.totalCount -= 1;
      }

      // Refetch relevant queries
      gradesQuery.refetch();
    },
    onError: (error) => {
      console.error('Error deleting grade:', error);
    },
  });

  // Watch for query data changes to update local state
  watch(
    () => gradesQuery.data.value,
    (newGrades) => {
      if (newGrades) {
        grades.value = newGrades;
      }
    },
    { immediate: true }
  );

  // Computed getters
  const gradeOptions = computed(() => {
    return grades.value.map((grade) => ({
      label: grade.name || '',
      value: grade.id,
    }));
  });

  const filteredGrades = computed(() => {
    if (!searchQuery.value) return grades.value;

    const query = searchQuery.value.toLowerCase();
    return grades.value.filter(
      (grade) => grade.name && grade.name.toLowerCase().includes(query)
    );
  });

  // Action-like functions maintaining your existing API
  const fetchGrades = async () => {
    await gradesQuery.refetch();
  };

  const fetchGradesByInstitution = async (institutionId: string) => {
    if (!institutionId) return [];

    const query = institutionGradesQuery(ref(institutionId));
    await query.refetch();

    const data = query.data.value || [];
    grades.value = data;

    return data;
  };

  const fetchGradesByAcademicYear = async (academicYearId: string) => {
    if (!academicYearId) return [];

    const query = academicYearGradesQuery(ref(academicYearId));
    await query.refetch();

    const data = query.data.value || [];
    grades.value = data;

    return data;
  };

  const fetchPagedGrades = async (params: GradePaginationParams = {}) => {
    const query = pagedGradesQuery(
      ref({
        ...params,
        page: params.page || pagination.value.page,
        pageSize: params.pageSize || pagination.value.pageSize,
      })
    );
    await query.refetch();

    const data = query.data.value;
    if (data) {
      pagedGrades.value = data;
    }

    return data;
  };

  const fetchPagedGradesByInstitution = async (
    institutionId: string,
    params: Omit<GradePaginationParams, 'institutionId'> = {}
  ) => {
    if (!institutionId) return null;

    const query = pagedInstitutionGradesQuery(
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
      pagedGrades.value = data;
    }

    return data;
  };

  const searchGrades = async (query: string) => {
    searchQuery.value = query;

    if (!query.trim()) {
      return await fetchGrades();
    }

    // Since there's no search endpoint, use local filtering for non-paginated
    if (grades.value.length === 0) {
      // If no data loaded yet, fetch all first
      await fetchGrades();
    }

    console.log('Using local filtering for grades');
  };

  const createGrade = async (gradeData: GradeForm) => {
    return await createGradeMutation.mutateAsync(gradeData);
  };

  const updateGrade = async (id: string, data: Partial<GradeForm>) => {
    return await updateGradeMutation.mutateAsync({ id, data });
  };

  const deleteGrade = async (id: string) => {
    await deleteGradeMutation.mutateAsync(id);
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

  return {
    // State
    grades: readonly(grades),
    pagedGrades: readonly(pagedGrades),
    searchQuery: readonly(searchQuery),
    pagination: readonly(pagination),

    // Computed getters
    gradeOptions,
    filteredGrades,

    // Loading states
    loadingGrades: computed(() => gradesQuery.isLoading.value),
    loadingPagedGrades: computed(() => false),
    searchLoading: computed(() => false),
    isCreatingGrade: computed(() => createGradeMutation.isLoading.value),
    isUpdatingGrade: computed(() => updateGradeMutation.isLoading.value),
    isDeletingGrade: computed(() => deleteGradeMutation.isLoading.value),

    // Combined loading state
    isLoading: computed(
      () =>
        gradesQuery.isLoading.value ||
        createGradeMutation.isLoading.value ||
        updateGradeMutation.isLoading.value ||
        deleteGradeMutation.isLoading.value
    ),

    // Actions (maintaining existing API)
    fetchGrades,
    fetchGradesByInstitution,
    fetchGradesByAcademicYear,
    fetchPagedGrades,
    fetchPagedGradesByInstitution,
    searchGrades,
    createGrade,
    updateGrade,
    deleteGrade,
    clearSearch,
    updatePagination,

    // Query factories for dynamic usage
    institutionGradesQuery,
    academicYearGradesQuery,
    pagedGradesQuery,
    pagedInstitutionGradesQuery,

    // Direct access to main queries
    gradesQuery,
  };
});
