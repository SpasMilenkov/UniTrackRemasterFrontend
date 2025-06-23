// stores/gradingSystem.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import type { GradingSystemType } from '~/enums/grading-system-type.enum';
import type { CreateGradingSystemData } from '~/interfaces/grading/create-grading-system-data';
import type { GradingSystemFilter } from '~/interfaces/grading/grading-system-filter';
import type { UpdateGradingSystemData } from '~/interfaces/grading/update-grading-system-data';
import type { GradingSystem } from '~/interfaces/super-admin/grading-system';
export const useGradingSystemStore = defineStore('gradingSystem', () => {
  if (import.meta.server) {
    return {
      // State
      gradingSystems: readonly(ref([])),
      selectedGradingSystem: readonly(ref(null)),
      initialized: readonly(ref(false)),
      error: readonly(ref(null)),

      // Computed getters
      availableGradingSystems: [],
      defaultGradingSystem: undefined,
      gradingSystemsByInstitution: () => () => [],
      gradingSystemsByType: () => () => [],
      gradingSystemOptions: [],
      selectedSystemScaleOptions: [],

      // Loading states
      loadingGradingSystems: false,
      loadingGradingSystem: false,
      submitting: false,
      isLoading: false,

      // Actions
      fetchGradingSystems: async () => [],
      fetchGradingSystem: async () => null,
      fetchDefaultGradingSystem: async () => null,
      createGradingSystem: async () => null,
      updateGradingSystem: async () => null,
      deleteGradingSystem: async () => true,
      setDefaultGradingSystem: async () => true,
      initializeDefaultGradingSystems: async () => true,
      convertScoreToGrade: async () => null,
      convertScoreToGpaPoints: async () => null,
      resetState: () => {},

      // Query factories
      institutionGradingSystemsQuery: () => null,
      gradingSystemQuery: () => null,
      defaultGradingSystemQuery: () => null,
      scoreToGradeQuery: () => null,
      scoreToGpaQuery: () => null,
      gradingSystemsQuery: null,
    };
  }
  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const gradingSystems = ref<GradingSystem[]>([]);
  const selectedGradingSystem = ref<GradingSystem | null>(null);
  const initialized = ref(false);
  const error = ref<string | null>(null);

  // All grading systems query
  const gradingSystemsQuery = useQuery({
    key: () => ['grading-systems', 'all'],
    query: () => $apiFetch<GradingSystem[]>('/GradingSystems'),
    staleTime: 15 * 60 * 1000, // 15 minutes - grading systems change rarely
  });

  // Institution grading systems query
  const institutionGradingSystemsQuery = (
    institutionId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => ['grading-systems', 'institution', unref(institutionId) || ''],
      query: () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');
        return $apiFetch<GradingSystem[]>(
          `/GradingSystems/institution/${instId}`
        );
      },
      enabled: () => !!unref(institutionId),
      staleTime: 15 * 60 * 1000,
    });
  };

  // Single grading system query
  const gradingSystemQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['grading-systems', 'single', unref(id) || ''],
      query: () => {
        const gsId = unref(id);
        if (!gsId) throw new Error('Grading system ID is required');
        return $apiFetch<GradingSystem>(`/GradingSystems/${gsId}`);
      },
      enabled: () => !!unref(id),
      staleTime: 20 * 60 * 1000, // 20 minutes for single records
    });
  };

  // Default grading system query for institution
  const defaultGradingSystemQuery = (
    institutionId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => ['grading-systems', 'default', unref(institutionId) || ''],
      query: () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');
        return $apiFetch<GradingSystem>(
          `/GradingSystems/institution/${instId}/default`
        );
      },
      enabled: () => !!unref(institutionId),
      staleTime: 20 * 60 * 1000,
    });
  };

  // Score to grade conversion query
  const scoreToGradeQuery = (
    score: MaybeRef<number | null>,
    gradingSystemId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => [
        'grading-systems',
        'convert',
        'grade',
        unref(score) ?? '',
        unref(gradingSystemId) || '',
      ],
      query: () => {
        const scoreValue = unref(score);
        const gsId = unref(gradingSystemId);
        if (scoreValue === null || !gsId)
          throw new Error('Score and grading system ID are required');
        return $apiFetch<string>(
          `/GradingSystems/convert/score-to-grade?score=${scoreValue}&gradingSystemId=${gsId}`
        );
      },
      enabled: () => unref(score) !== null && !!unref(gradingSystemId),
      staleTime: 30 * 60 * 1000, // 30 minutes - conversion results are stable
    });
  };

  // Score to GPA conversion query
  const scoreToGpaQuery = (
    score: MaybeRef<number | null>,
    gradingSystemId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => [
        'grading-systems',
        'convert',
        'gpa',
        unref(score) || '',
        unref(gradingSystemId) || '',
      ],
      query: () => {
        const scoreValue = unref(score);
        const gsId = unref(gradingSystemId);
        if (scoreValue === null || !gsId)
          throw new Error('Score and grading system ID are required');
        return $apiFetch<number>(
          `/GradingSystems/convert/score-to-gpa?score=${scoreValue}&gradingSystemId=${gsId}`
        );
      },
      enabled: () => unref(score) !== null && !!unref(gradingSystemId),
      staleTime: 30 * 60 * 1000,
    });
  };

  // Create grading system mutation
  const createGradingSystemMutation = useMutation({
    mutation: (gradingSystemData: CreateGradingSystemData) =>
      $apiFetch<GradingSystem>('/GradingSystems', {
        method: 'POST',
        body: gradingSystemData,
      }),
    onSuccess: (newGradingSystem) => {
      // Add to local state
      gradingSystems.value.push(newGradingSystem);

      // If setting as default, update other systems
      if (newGradingSystem.isDefault) {
        gradingSystems.value = gradingSystems.value.map((gs) => {
          if (
            gs.id !== newGradingSystem.id &&
            gs.institutionId === newGradingSystem.institutionId
          ) {
            return { ...gs, isDefault: false };
          }
          return gs;
        });
      }

      // Refetch relevant queries
      gradingSystemsQuery.refetch();
      error.value = null;
    },
    onError: (errorMsg) => {
      console.error('Error creating grading system:', errorMsg);
      error.value = errorMsg.message || 'Failed to create grading system';
    },
  });

  // Update grading system mutation
  const updateGradingSystemMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: UpdateGradingSystemData }) =>
      $apiFetch<GradingSystem>(`/GradingSystems/${id}`, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: (updatedGradingSystem, { id, data }) => {
      // Update in local state
      const index = gradingSystems.value.findIndex((gs) => gs.id === id);
      if (index !== -1) {
        gradingSystems.value[index] = updatedGradingSystem;
      }

      // Update selected if it's the same
      if (selectedGradingSystem.value?.id === id) {
        selectedGradingSystem.value = updatedGradingSystem;
      }

      // Handle default status changes
      if (data.isDefault && updatedGradingSystem.isDefault) {
        gradingSystems.value = gradingSystems.value.map((gs) => {
          if (
            gs.id !== id &&
            gs.institutionId === updatedGradingSystem.institutionId
          ) {
            return { ...gs, isDefault: false };
          }
          return gs;
        });
      }

      // Refetch relevant queries
      gradingSystemsQuery.refetch();
      error.value = null;
    },
    onError: (errorMsg) => {
      console.error('Error updating grading system:', errorMsg);
      error.value = errorMsg.message || 'Failed to update grading system';
    },
  });

  // Delete grading system mutation
  const deleteGradingSystemMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/GradingSystems/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      // Remove from local state
      gradingSystems.value = gradingSystems.value.filter((gs) => gs.id !== id);

      // Clear selected if it was deleted
      if (selectedGradingSystem.value?.id === id) {
        selectedGradingSystem.value = null;
      }

      // Refetch relevant queries
      gradingSystemsQuery.refetch();
      error.value = null;
    },
    onError: (errorMsg) => {
      console.error('Error deleting grading system:', errorMsg);
      error.value = errorMsg.message || 'Failed to delete grading system';
    },
  });

  // Set default grading system mutation
  const setDefaultGradingSystemMutation = useMutation({
    mutation: ({ id, institutionId }: { id: string; institutionId: string }) =>
      $apiFetch(
        `/GradingSystems/${id}/set-default/institution/${institutionId}`,
        {
          method: 'PUT',
        }
      ),
    onSuccess: (_, { id, institutionId }) => {
      // Update state - make this one default and others non-default
      gradingSystems.value = gradingSystems.value.map((gs) => {
        if (gs.institutionId === institutionId) {
          return { ...gs, isDefault: gs.id === id };
        }
        return gs;
      });

      // Refetch relevant queries
      gradingSystemsQuery.refetch();
      error.value = null;
    },
    onError: (errorMsg) => {
      console.error('Error setting default grading system:', errorMsg);
      error.value = errorMsg.message || 'Failed to set default grading system';
    },
  });

  // Initialize default grading systems mutation
  const initializeDefaultGradingSystemsMutation = useMutation({
    mutation: (institutionId: string) =>
      $apiFetch(`/GradingSystems/institution/${institutionId}/initialize`, {
        method: 'POST',
      }),
    onSuccess: async (_, institutionId) => {
      // Refresh the list after initialization
      await fetchGradingSystems({ institutionId });
      error.value = null;
    },
    onError: (errorMsg) => {
      console.error('Error initializing default grading systems:', errorMsg);
      error.value =
        errorMsg.message || 'Failed to initialize default grading systems';
    },
  });

  // Watch for query data changes to update local state
  watch(
    () => gradingSystemsQuery.data.value,
    (newGradingSystems) => {
      if (newGradingSystems) {
        gradingSystems.value = newGradingSystems;
        initialized.value = true;
      }
    },
    { immediate: true }
  );

  // Computed getters
  const availableGradingSystems = computed(() => gradingSystems.value);

  const defaultGradingSystem = computed(() =>
    gradingSystems.value.find((gs) => gs.isDefault)
  );

  const gradingSystemsByInstitution = computed(
    () => (institutionId: string) =>
      gradingSystems.value.filter((gs) => gs.institutionId === institutionId)
  );

  const gradingSystemsByType = computed(
    () => (type: GradingSystemType) =>
      gradingSystems.value.filter((gs) => gs.type === type)
  );

  const gradingSystemOptions = computed(() =>
    gradingSystems.value.map((gs) => ({
      label: gs.name,
      value: gs.id,
    }))
  );

  const selectedSystemScaleOptions = computed(
    () =>
      selectedGradingSystem.value?.gradeScales.map((scale) => ({
        label: `${scale.grade} (${scale.minimumScore} - ${scale.maximumScore})`,
        value: scale.id,
      })) || []
  );

  // Action-like functions maintaining your existing API
  const fetchGradingSystems = async (filters?: GradingSystemFilter) => {
    error.value = null;

    if (filters?.institutionId) {
      const query = institutionGradingSystemsQuery(ref(filters.institutionId));
      await query.refetch();
      const data = query.data.value || [];
      gradingSystems.value = data;
      initialized.value = true;
      return data;
    } else {
      await gradingSystemsQuery.refetch();
      const data = gradingSystemsQuery.data.value || [];
      gradingSystems.value = data;
      initialized.value = true;
      return data;
    }
  };

  const fetchGradingSystem = async (id: string) => {
    error.value = null;
    const query = gradingSystemQuery(ref(id));
    await query.refetch();
    const data = query.data.value;
    if (data) {
      selectedGradingSystem.value = data;
    }
    return data;
  };

  const fetchDefaultGradingSystem = async (institutionId: string) => {
    error.value = null;
    const query = defaultGradingSystemQuery(ref(institutionId));
    await query.refetch();
    const data = query.data.value;
    if (data) {
      selectedGradingSystem.value = data;
    }
    return data;
  };

  const createGradingSystem = async (
    gradingSystemData: CreateGradingSystemData
  ) => {
    return await createGradingSystemMutation.mutateAsync(gradingSystemData);
  };

  const updateGradingSystem = async (
    id: string,
    data: UpdateGradingSystemData
  ) => {
    return await updateGradingSystemMutation.mutateAsync({ id, data });
  };

  const deleteGradingSystem = async (id: string) => {
    await deleteGradingSystemMutation.mutateAsync(id);
    return true;
  };

  const setDefaultGradingSystem = async (id: string, institutionId: string) => {
    await setDefaultGradingSystemMutation.mutateAsync({ id, institutionId });
    return true;
  };

  const initializeDefaultGradingSystems = async (institutionId: string) => {
    await initializeDefaultGradingSystemsMutation.mutateAsync(institutionId);
    return true;
  };

  const convertScoreToGrade = async (
    score: number,
    gradingSystemId: string
  ) => {
    const query = scoreToGradeQuery(ref(score), ref(gradingSystemId));
    await query.refetch();
    return query.data.value;
  };

  const convertScoreToGpaPoints = async (
    score: number,
    gradingSystemId: string
  ) => {
    const query = scoreToGpaQuery(ref(score), ref(gradingSystemId));
    await query.refetch();
    return query.data.value;
  };

  const resetState = () => {
    gradingSystems.value = [];
    selectedGradingSystem.value = null;
    error.value = null;
    initialized.value = false;
  };

  return {
    // State
    gradingSystems: readonly(gradingSystems),
    selectedGradingSystem: readonly(selectedGradingSystem),
    initialized: readonly(initialized),
    error: readonly(error),

    // Computed getters
    availableGradingSystems,
    defaultGradingSystem,
    gradingSystemsByInstitution,
    gradingSystemsByType,
    gradingSystemOptions,
    selectedSystemScaleOptions,

    // Loading states
    loadingGradingSystems: computed(() => gradingSystemsQuery.isLoading.value),
    loadingGradingSystem: computed(() => false), // Could track specific single queries if needed
    submitting: computed(
      () =>
        createGradingSystemMutation.isLoading.value ||
        updateGradingSystemMutation.isLoading.value ||
        deleteGradingSystemMutation.isLoading.value ||
        setDefaultGradingSystemMutation.isLoading.value ||
        initializeDefaultGradingSystemsMutation.isLoading.value
    ),

    // Combined loading state
    isLoading: computed(
      () =>
        gradingSystemsQuery.isLoading.value ||
        createGradingSystemMutation.isLoading.value ||
        updateGradingSystemMutation.isLoading.value ||
        deleteGradingSystemMutation.isLoading.value ||
        setDefaultGradingSystemMutation.isLoading.value ||
        initializeDefaultGradingSystemsMutation.isLoading.value
    ),

    // Actions (maintaining existing API)
    fetchGradingSystems,
    fetchGradingSystem,
    fetchDefaultGradingSystem,
    createGradingSystem,
    updateGradingSystem,
    deleteGradingSystem,
    setDefaultGradingSystem,
    initializeDefaultGradingSystems,
    convertScoreToGrade,
    convertScoreToGpaPoints,
    resetState,

    // Query factories for dynamic usage
    institutionGradingSystemsQuery,
    gradingSystemQuery,
    defaultGradingSystemQuery,
    scoreToGradeQuery,
    scoreToGpaQuery,

    // Direct access to main queries
    gradingSystemsQuery,
  };
});
