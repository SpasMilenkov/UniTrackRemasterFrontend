// stores/major.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import { majorFormSchema, type MajorFormSchema } from '~/schemas/major.schema';
import type { MajorResponseDto } from '~/interfaces/academic/major.dto';
import { useFacultyStore } from '~/stores/faculty';

// Re-export types for convenience
export type Major = MajorResponseDto;
export type MajorForm = MajorFormSchema;

export const useMajorStore = defineStore('major', () => {
  if (import.meta.server) {
    return {
      // State
      majors: readonly(ref([])),
      searchQuery: readonly(ref('')),
      facultyFilter: readonly(ref(null)),

      // Computed getters
      filteredMajors: [],
      majorsByFaculty: () => [],

      // Loading states
      loadingMajors: false,
      searchLoading: false,
      isCreatingMajor: false,
      isUpdatingMajor: false,
      isDeletingMajor: false,
      isLoading: false,

      // Actions
      fetchMajorsByFaculty: async () => [],
      fetchAllMajors: async () => [],
      searchMajors: async () => {},
      setFacultyFilter: () => {},
      setMajorSearch: () => {},
      clearSearch: () => {},
      createMajor: async () => null,
      updateMajor: async () => null,
      deleteMajor: async () => {},
      getMajorById: async () => null,

      // Query factories
      facultyMajorsQuery: () => null,
      majorByIdQuery: () => null,
      allMajorsQuery: null,
    };
  }

  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const majors = ref<Major[]>([]);
  const searchQuery = ref('');
  const facultyFilter = ref<string | null>(null);

  // Faculty-specific majors query
  const facultyMajorsQuery = (facultyId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['majors', 'faculty', unref(facultyId) || ''],
      query: () => {
        const facId = unref(facultyId);
        if (!facId) throw new Error('Faculty ID is required');
        return $apiFetch<Major[]>(`/faculties/${facId}/majors`);
      },
      enabled: () => !!unref(facultyId) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Single major query
  const majorByIdQuery = (
    facultyId: MaybeRef<string | null>,
    majorId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => [
        'majors',
        'single',
        unref(facultyId) || '',
        unref(majorId) || '',
      ],
      query: () => {
        const facId = unref(facultyId);
        const majId = unref(majorId);
        if (!facId || !majId) {
          throw new Error('Faculty ID and Major ID are required');
        }
        return $apiFetch<Major>(`/faculties/${facId}/majors/${majId}`);
      },
      enabled: () =>
        !!unref(facultyId) && !!unref(majorId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes for single records
    });
  };

  // All majors query (aggregated from all faculties)
  const allMajorsQuery = useQuery({
    key: () => ['majors', 'all'],
    query: async () => {
      const facultyStore = useFacultyStore();

      // Ensure we have faculties loaded
      if (!facultyStore.faculties || facultyStore.faculties.length === 0) {
        console.warn('No faculties available to fetch majors');
        return [];
      }

      try {
        // Fetch majors from all faculties in parallel
        const majorPromises = facultyStore.faculties.map(async (faculty) => {
          try {
            return await $apiFetch<Major[]>(`/faculties/${faculty.id}/majors`);
          } catch (error: any) {
            // Handle individual faculty errors gracefully
            if (error.status === 403 || error.status === 401) {
              console.warn(`Access denied for faculty ${faculty.id} majors`);
              return [];
            }
            console.error(
              `Error fetching majors for faculty ${faculty.id}:`,
              error
            );
            return [];
          }
        });

        const majorArrays = await Promise.all(majorPromises);
        return majorArrays.flat();
      } catch (error) {
        console.error('Error aggregating majors from faculties:', error);
        return [];
      }
    },
    enabled: () => import.meta.client,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create major mutation
  const createMajorMutation = useMutation({
    mutation: (majorData: MajorForm) => {
      if (!majorData.facultyId) {
        throw new Error('Faculty ID is required');
      }

      // Validate form data with Zod schema
      const parsedData = majorFormSchema.parse(majorData);

      return $apiFetch<Major>(`/faculties/${parsedData.facultyId}/majors`, {
        method: 'POST',
        body: parsedData,
      });
    },
    onSuccess: (newMajor) => {
      // Add to local state for immediate UI update
      majors.value.push(newMajor);

      // Refetch relevant queries
      allMajorsQuery.refetch();
    },
    onError: (error: any) => {
      console.error('Error creating major:', error);

      // Handle authorization errors specifically
      if (error.status === 403 || error.status === 401) {
        console.error(
          'Access denied: Admin/SuperAdmin role required for major creation'
        );
      }
    },
  });

  // Update major mutation
  const updateMajorMutation = useMutation({
    mutation: ({
      facultyId,
      id,
      data,
    }: {
      facultyId: string;
      id: string;
      data: MajorForm;
    }) => {
      // Validate form data with Zod schema
      const parsedData = majorFormSchema.parse(data);

      return $apiFetch<Major>(`/faculties/${facultyId}/majors/${id}`, {
        method: 'PUT',
        body: parsedData,
      });
    },
    onSuccess: (updatedMajor, { id }) => {
      // Update in local state
      const index = majors.value.findIndex((m) => m.id === id);
      if (index !== -1) {
        majors.value[index] = updatedMajor;
      }

      // Refetch relevant queries
      allMajorsQuery.refetch();
    },
    onError: (error: any) => {
      console.error('Error updating major:', error);

      // Handle authorization errors specifically
      if (error.status === 403 || error.status === 401) {
        console.error(
          'Access denied: Admin/SuperAdmin role required for major updates'
        );
      }
    },
  });

  // Delete major mutation
  const deleteMajorMutation = useMutation({
    mutation: ({ facultyId, id }: { facultyId: string; id: string }) => {
      return $apiFetch(`/faculties/${facultyId}/majors/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, { id }) => {
      // Remove from local state
      majors.value = majors.value.filter((m) => m.id !== id);

      // Refetch relevant queries
      allMajorsQuery.refetch();
    },
    onError: (error: any) => {
      console.error('Error deleting major:', error);

      // Handle authorization errors specifically
      if (error.status === 403 || error.status === 401) {
        console.error(
          'Access denied: Admin/SuperAdmin role required for major deletion'
        );
      }
    },
  });

  // Watch for query data changes to update local state
  watch(
    () => allMajorsQuery.data.value,
    (newMajors) => {
      if (newMajors) {
        majors.value = newMajors;
      }
    },
    { immediate: true }
  );

  // Computed getters
  const filteredMajors = computed(() => {
    let result = majors.value;

    // Apply faculty filter
    if (facultyFilter.value) {
      result = result.filter(
        (major) => major.facultyId === facultyFilter.value
      );
    }

    // Apply search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter((major) => {
        return (
          (major.name && major.name.toLowerCase().includes(query)) ||
          (major.code && major.code.toLowerCase().includes(query)) ||
          (major.shortDescription &&
            major.shortDescription.toLowerCase().includes(query)) ||
          (major.detailedDescription &&
            major.detailedDescription.toLowerCase().includes(query))
        );
      });
    }

    return result;
  });

  const majorsByFaculty = (facultyId: string) => {
    return computed(() => {
      return majors.value.filter((major) => major.facultyId === facultyId);
    });
  };

  // Action-like functions maintaining your existing API
  const fetchMajorsByFaculty = async (facultyId: string) => {
    if (!facultyId) return [];

    const query = facultyMajorsQuery(ref(facultyId));
    await query.refetch();

    const data = query.data.value || [];

    // Update local state with faculty-specific majors
    const filteredExisting = majors.value.filter(
      (m) => m.facultyId !== facultyId
    );
    majors.value = [...filteredExisting, ...data];

    facultyFilter.value = facultyId;
    return data;
  };

  const fetchAllMajors = async () => {
    await allMajorsQuery.refetch();
    const data = allMajorsQuery.data.value || [];
    majors.value = data;
    facultyFilter.value = null;
    return data;
  };

  const searchMajors = async (
    query: string,
    facultyId: string | null = null
  ) => {
    searchQuery.value = query;

    // Set faculty filter if provided
    if (facultyId) {
      facultyFilter.value = facultyId;
    }

    // If we need to fetch data and don't have it
    if (majors.value.length === 0) {
      if (facultyId) {
        await fetchMajorsByFaculty(facultyId);
      } else {
        await fetchAllMajors();
      }
    }

    // Use local filtering since backend doesn't have search endpoints
    return filteredMajors.value;
  };

  const setFacultyFilter = (facultyId: string | null) => {
    facultyFilter.value = facultyId;
  };

  const setMajorSearch = (query: string) => {
    searchQuery.value = query;
  };

  const clearSearch = () => {
    searchQuery.value = '';
    facultyFilter.value = null;
  };

  const createMajor = async (majorData: MajorForm) => {
    if (!majorData.facultyId) {
      throw new Error('Faculty ID is required');
    }
    return await createMajorMutation.mutateAsync(majorData);
  };

  const updateMajor = async (
    facultyId: string,
    id: string,
    data: MajorForm
  ) => {
    return await updateMajorMutation.mutateAsync({ facultyId, id, data });
  };

  const deleteMajor = async (facultyId: string, id: string) => {
    await deleteMajorMutation.mutateAsync({ facultyId, id });
  };

  const getMajorById = async (facultyId: string, majorId: string) => {
    const query = majorByIdQuery(ref(facultyId), ref(majorId));
    await query.refetch();
    return query.data.value;
  };

  return {
    // State
    majors: readonly(majors),
    searchQuery: readonly(searchQuery),
    facultyFilter: readonly(facultyFilter),

    // Computed getters
    filteredMajors,
    majorsByFaculty,

    // Loading states
    loadingMajors: computed(() => allMajorsQuery.isLoading.value),
    searchLoading: computed(() => false), // Local filtering only
    isCreatingMajor: computed(() => createMajorMutation.isLoading.value),
    isUpdatingMajor: computed(() => updateMajorMutation.isLoading.value),
    isDeletingMajor: computed(() => deleteMajorMutation.isLoading.value),

    // Combined loading state
    isLoading: computed(
      () =>
        allMajorsQuery.isLoading.value ||
        createMajorMutation.isLoading.value ||
        updateMajorMutation.isLoading.value ||
        deleteMajorMutation.isLoading.value
    ),

    // Actions (maintaining existing API)
    fetchMajorsByFaculty,
    fetchAllMajors,
    searchMajors,
    setFacultyFilter,
    setMajorSearch,
    clearSearch,
    createMajor,
    updateMajor,
    deleteMajor,
    getMajorById,

    // Query factories for dynamic usage
    facultyMajorsQuery,
    majorByIdQuery,

    // Direct access to main queries
    allMajorsQuery,
  };
});
