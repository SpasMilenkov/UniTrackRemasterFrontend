// stores/university.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import type { UniversityResponseDto } from '~/interfaces/organizations/university-response.dto';
import type { UpdateUniversityDto } from '~/interfaces/organizations/update-university.dto';

// Re-export types for convenience
export type University = UniversityResponseDto;
export type UpdateUniversity = UpdateUniversityDto;

export const useUniversityStore = defineStore('university', () => {
  if (import.meta.server) {
    return {
      // State
      universities: readonly(ref([])),
      activeUniversity: readonly(ref(null)),
      searchQuery: readonly(ref('')),
      error: readonly(ref(null)),

      // Computed getters
      universityOptions: [],
      getUniversityById: () => null,
      getUniversityByInstitutionId: () => null,
      filteredUniversities: [],

      // Loading states
      loadingUniversities: false,
      loadingUniversity: false,
      searchLoading: false,
      submitting: false,
      isLoading: false,
      isUpdatingUniversity: false,
      isDeletingUniversity: false,

      // Actions
      fetchAllUniversities: async () => [],
      fetchUniversityById: async () => null,
      fetchUniversityByInstitutionId: async () => null,
      searchUniversities: async () => [],
      updateUniversity: async () => null,
      deleteUniversity: async () => false,
      setActiveUniversity: () => {},
      clearSearch: () => {},
      clearError: () => {},

      // Query factories
      universityByIdQuery: () => null,
      universityByInstitutionIdQuery: () => null,
      searchUniversitiesQuery: () => null,
      universitiesQuery: null,
    };
  }
  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const universities = ref<University[]>([]);
  const activeUniversity = ref<University | null>(null);
  const searchQuery = ref('');
  const error = ref<string | null>(null);

  // ===== QUERIES =====

  // All universities query
  const universitiesQuery = useQuery({
    key: () => ['universities', 'all'],
    query: () => $apiFetch<University[]>('/universities'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Search universities query
  const searchUniversitiesQuery = (query: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['universities', 'search', unref(query) || ''],
      query: () => {
        const searchTerm = unref(query);
        if (!searchTerm || !searchTerm.trim()) {
          return $apiFetch<University[]>('/universities');
        }
        return $apiFetch<University[]>(
          `/universities/search?query=${encodeURIComponent(searchTerm)}`
        );
      },
      staleTime: 5 * 60 * 1000, // 5 minutes for search results
      enabled: () => import.meta.client, // Only run on client
    });
  };

  // Single university by ID query
  const universityByIdQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['universities', 'single', unref(id) || ''],
      query: () => $apiFetch<University>(`/universities/${unref(id)}`),
      enabled: () => !!unref(id) && import.meta.client,
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // University by institution ID query
  const universityByInstitutionIdQuery = (
    institutionId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => ['universities', 'institution', unref(institutionId) || ''],
      query: () =>
        $apiFetch<University>(
          `/universities/institution/${unref(institutionId)}`
        ),
      enabled: () => !!unref(institutionId) && import.meta.client,
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // ===== MUTATIONS =====

  // Update university mutation
  const updateUniversityMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: UpdateUniversity }) =>
      $apiFetch<University>(`/universities/${id}`, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: (updatedUniversity, { id }) => {
      // Update in local state
      const index = universities.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        universities.value[index] = updatedUniversity;
      }

      // Update active university if it's the same
      if (activeUniversity.value?.id === id) {
        activeUniversity.value = updatedUniversity;
      }

      // Invalidate related queries
      universitiesQuery.refetch();
    },
    onError: (error) => {
      console.error('Error updating university:', error);
    },
  });

  // Delete university mutation
  const deleteUniversityMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/universities/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      // Remove from local state
      universities.value = universities.value.filter((u) => u.id !== id);

      // Clear active university if it was deleted
      if (activeUniversity.value?.id === id) {
        activeUniversity.value = null;
      }

      // Invalidate queries
      universitiesQuery.refetch();
    },
    onError: (error) => {
      console.error('Error deleting university:', error);
    },
  });

  // ===== WATCHERS =====

  // Watch for query data changes to update local state
  watch(
    () => universitiesQuery.data.value,
    (newUniversities) => {
      if (newUniversities) {
        universities.value = newUniversities;
      }
    },
    { immediate: true }
  );

  // ===== COMPUTED =====

  // Computed getters (maintaining your existing API)
  const universityOptions = computed(() => {
    return universities.value.map((university) => ({
      label: university.name,
      value: university.id,
    }));
  });

  // Get university by ID
  const getUniversityById = computed(() => (id: string) => {
    return (
      universities.value.find((university) => university.id === id) || null
    );
  });

  // Get university by institution ID
  const getUniversityByInstitutionId = computed(
    () => (institutionId: string) => {
      return (
        universities.value.find(
          (university) => university.institutionId === institutionId
        ) || null
      );
    }
  );

  // Filtered universities based on search query
  const filteredUniversities = computed(() => {
    if (!searchQuery.value) return universities.value;

    const query = searchQuery.value.toLowerCase();
    return universities.value.filter(
      (university) =>
        (university.name && university.name.toLowerCase().includes(query)) ||
        (university.description &&
          university.description.toLowerCase().includes(query))
    );
  });

  // Loading states
  const loadingUniversities = computed(() => universitiesQuery.isLoading.value);
  const loadingUniversity = computed(() => false);
  const searchLoading = computed(() => false);
  const submitting = computed(
    () =>
      updateUniversityMutation.isLoading.value ||
      deleteUniversityMutation.isLoading.value
  );

  // Combined loading state
  const isLoading = computed(
    () =>
      universitiesQuery.isLoading.value ||
      updateUniversityMutation.isLoading.value ||
      deleteUniversityMutation.isLoading.value
  );

  // ===== ACTION METHODS (maintaining existing API) =====

  const fetchAllUniversities = async (query: string | null = null) => {
    error.value = null;

    try {
      if (query) {
        const searchQuery = searchUniversitiesQuery(ref(query));
        await searchQuery.refetch();
        const result = searchQuery.data.value || [];
        universities.value = result;
        return result;
      } else {
        await universitiesQuery.refetch();
        return universities.value;
      }
    } catch (err: any) {
      console.error('Error loading universities:', err);
      error.value = err.message || 'Failed to load universities';
      universities.value = [];
      throw err;
    }
  };

  // Fetch a university by ID
  const fetchUniversityById = async (id: string) => {
    error.value = null;

    try {
      const query = universityByIdQuery(ref(id));
      await query.refetch();
      const university = query.data.value;

      if (university) {
        // Update in the universities array if it already exists
        const index = universities.value.findIndex((u) => u.id === id);
        if (index !== -1) {
          universities.value[index] = university;
        } else {
          universities.value.push(university);
        }

        activeUniversity.value = university;
      }

      return university;
    } catch (err: any) {
      console.error(`Error loading university with ID ${id}:`, err);
      error.value = err.message || 'Failed to load university';
      throw err;
    }
  };

  // Fetch a university by institution ID
  const fetchUniversityByInstitutionId = async (institutionId: string) => {
    error.value = null;

    try {
      const query = universityByInstitutionIdQuery(ref(institutionId));
      await query.refetch();
      const university = query.data.value;

      if (university) {
        // Update in the universities array if it already exists
        const index = universities.value.findIndex(
          (u) => u.institutionId === institutionId
        );
        if (index !== -1) {
          universities.value[index] = university;
        } else {
          universities.value.push(university);
        }

        activeUniversity.value = university;
      }

      return university;
    } catch (err: any) {
      console.error(
        `Error loading university for institution ID ${institutionId}:`,
        err
      );
      error.value = err.message || 'Failed to load university';
      throw err;
    }
  };

  // Search universities
  const searchUniversities = async (query: string) => {
    searchQuery.value = query;
    error.value = null;

    try {
      // If query is empty, fetch all universities
      if (!query.trim()) {
        return await fetchAllUniversities();
      }

      const searchQueryRef = searchUniversitiesQuery(ref(query));
      await searchQueryRef.refetch();
      const result = searchQueryRef.data.value || [];
      universities.value = result;

      return result;
    } catch (err: any) {
      console.error('Error searching universities:', err);
      error.value = err.message || 'Failed to search universities';
      throw err;
    }
  };

  // Update an existing university
  const updateUniversity = async (
    id: string,
    universityData: UpdateUniversity
  ) => {
    error.value = null;

    try {
      return await updateUniversityMutation.mutateAsync({
        id,
        data: universityData,
      });
    } catch (err: any) {
      console.error(`Error updating university with ID ${id}:`, err);
      error.value = err.message || 'Failed to update university';
      throw err;
    }
  };

  // Delete a university
  const deleteUniversity = async (id: string) => {
    error.value = null;

    try {
      await deleteUniversityMutation.mutateAsync(id);
      return true;
    } catch (err: any) {
      console.error(`Error deleting university with ID ${id}:`, err);
      error.value = err.message || 'Failed to delete university';
      throw err;
    }
  };

  // Set active university
  const setActiveUniversity = (university: University | null) => {
    activeUniversity.value = university;
  };

  // Clear search
  const clearSearch = () => {
    searchQuery.value = '';
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    universities: readonly(universities),
    activeUniversity: readonly(activeUniversity),
    searchQuery: readonly(searchQuery),
    error: readonly(error),

    // Computed getters (maintaining existing API)
    universityOptions,
    getUniversityById,
    getUniversityByInstitutionId,
    filteredUniversities,

    // Loading states (maintaining existing API)
    loadingUniversities,
    loadingUniversity,
    searchLoading,
    submitting,
    isLoading,

    // Individual mutation loading states
    isUpdatingUniversity: computed(
      () => updateUniversityMutation.isLoading.value
    ),
    isDeletingUniversity: computed(
      () => deleteUniversityMutation.isLoading.value
    ),

    // Actions (maintaining existing API)
    fetchAllUniversities,
    fetchUniversityById,
    fetchUniversityByInstitutionId,
    searchUniversities,
    updateUniversity,
    deleteUniversity,
    setActiveUniversity,
    clearSearch,
    clearError,

    // Query factories for dynamic usage
    universityByIdQuery,
    universityByInstitutionIdQuery,
    searchUniversitiesQuery,

    // Direct access to main queries
    universitiesQuery,
  };
});
