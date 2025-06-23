// stores/academicYear.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import {
  createAcademicYearSchema,
  updateAcademicYearSchema,
  type AcademicYearFormSchema,
  type CreateAcademicYearSchema,
  type UpdateAcademicYearSchema,
} from '~/schemas/academic-year.schema';
import {
  type SemesterFormSchema,
  type CreateSemesterSchema,
  type UpdateSemesterSchema,
  validateSemesterForInstitutionType,
  getDefaultSemesterValues,
} from '~/schemas/semester.schema';
import type { AcademicYearResponseDto } from '~/interfaces/academic/academic-year.dto';
import {
  SemesterStatus,
  type SemesterResponseDto,
  type SemesterType,
  isHigherEducationTerm,
  isK12Term,
} from '~/interfaces/academic/semester';
import { isHigherEducation } from '~/utils/institution-helper';

// Re-export types for convenience
export type AcademicYear = AcademicYearResponseDto;
export type AcademicYearForm = AcademicYearFormSchema;
export type Semester = SemesterResponseDto;
export type SemesterForm = SemesterFormSchema;

export const useAcademicYearStore = defineStore('academicYear', () => {
  // Get the API fetch function and institution store
  const { $apiFetch } = useNuxtApp();
  const institutionStore = useInstitutionStore();

  // State
  const academicYears = ref<AcademicYear[]>([]);
  const academicYearsPagedResult = ref<PagedResult<AcademicYear> | null>(null);
  const semestersByAcademicYear = ref<Map<string, Semester[]>>(new Map());
  const searchQuery = ref('');

  // Institution type detection for terminology
  const isHigherEducationInstitution = computed(() => {
    return institutionStore.activeInstitution
      ? isHigherEducation(institutionStore.activeInstitution.type)
      : false;
  });

  // SSR-safe query factories that return null on server
  const institutionAcademicYearsQuery = (
    institutionId: MaybeRef<string | null>,
    page: MaybeRef<number> = ref(1),
    pageSize: MaybeRef<number> = ref(10)
  ) => {
    if (import.meta.server) {
      return {
        data: ref(null),
        isLoading: ref(false),
        error: ref(null),
        refetch: async () => null,
      };
    }

    return useQuery({
      key: () => [
        'academic-years',
        'institution',
        unref(institutionId) || '',
        unref(page),
        unref(pageSize),
      ],
      query: () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');

        const queryParams = new URLSearchParams({
          page: unref(page).toString(),
          pageSize: unref(pageSize).toString(),
        });

        return $apiFetch<PagedResult<AcademicYear>>(
          `/institutions/${instId}/academic-years?${queryParams}`
        );
      },
      enabled: () => !!unref(institutionId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Single academic year by ID query
  const academicYearByIdQuery = (
    institutionId: MaybeRef<string | null>,
    academicYearId: MaybeRef<string | null>
  ) => {
    if (import.meta.server) {
      return {
        data: ref(null),
        isLoading: ref(false),
        error: ref(null),
        refetch: async () => null,
      };
    }

    return useQuery({
      key: () => [
        'academic-years',
        'single',
        unref(institutionId) || '',
        unref(academicYearId) || '',
      ],
      query: () => {
        const instId = unref(institutionId);
        const yearId = unref(academicYearId);
        if (!instId || !yearId) {
          throw new Error('Institution ID and Academic Year ID are required');
        }
        return $apiFetch<AcademicYear>(
          `/institutions/${instId}/academic-years/${yearId}`
        );
      },
      enabled: () =>
        !!unref(institutionId) && !!unref(academicYearId) && import.meta.client,
      staleTime: 15 * 60 * 1000,
    });
  };

  // Semesters by academic year query (secure - academic year scoped)
  const academicYearSemestersQuery = (
    academicYearId: MaybeRef<string | null>,
    page: MaybeRef<number> = ref(1),
    pageSize: MaybeRef<number> = ref(10)
  ) => {
    if (import.meta.server) {
      return {
        data: ref(null),
        isLoading: ref(false),
        error: ref(null),
        refetch: async () => null,
      };
    }

    return useQuery({
      key: () => [
        'semesters',
        'academic-year',
        unref(academicYearId) || '',
        unref(page),
        unref(pageSize),
      ],
      query: () => {
        const yearId = unref(academicYearId);
        if (!yearId) throw new Error('Academic Year ID is required');

        const queryParams = new URLSearchParams({
          page: unref(page).toString(),
          pageSize: unref(pageSize).toString(),
        });

        return $apiFetch<PagedResult<Semester>>(
          `/academic-years/${yearId}/semesters?${queryParams}`
        );
      },
      enabled: () => !!unref(academicYearId) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Single semester by ID query (academic year scoped)
  const semesterByIdQuery = (
    academicYearId: MaybeRef<string | null>,
    semesterId: MaybeRef<string | null>
  ) => {
    if (import.meta.server) {
      return {
        data: ref(null),
        isLoading: ref(false),
        error: ref(null),
        refetch: async () => null,
      };
    }

    return useQuery({
      key: () => [
        'semesters',
        'single',
        unref(academicYearId) || '',
        unref(semesterId) || '',
      ],
      query: () => {
        const yearId = unref(academicYearId);
        const semId = unref(semesterId);
        if (!yearId || !semId) {
          throw new Error('Academic Year ID and Semester ID are required');
        }
        return $apiFetch<Semester>(
          `/academic-years/${yearId}/semesters/${semId}`
        );
      },
      enabled: () =>
        !!unref(academicYearId) && !!unref(semesterId) && import.meta.client,
      staleTime: 15 * 60 * 1000,
    });
  };

  // Global semester by ID query (use sparingly for cross-academic year lookups)
  const globalSemesterByIdQuery = (semesterId: MaybeRef<string | null>) => {
    if (import.meta.server) {
      return {
        data: ref(null),
        isLoading: ref(false),
        error: ref(null),
        refetch: async () => null,
      };
    }

    return useQuery({
      key: () => ['semesters', 'global', unref(semesterId) || ''],
      query: () => {
        const semId = unref(semesterId);
        if (!semId) throw new Error('Semester ID is required');
        return $apiFetch<Semester>(`/semesters/${semId}`);
      },
      enabled: () => !!unref(semesterId) && import.meta.client,
      staleTime: 15 * 60 * 1000,
    });
  };

  // Create academic year mutation
  const createAcademicYearMutation = import.meta.server
    ? {
        mutateAsync: async () => null,
        isLoading: ref(false),
      }
    : useMutation({
        mutation: (academicYearData: CreateAcademicYearSchema) => {
          // Validate form data with Zod schema
          const parsedData = createAcademicYearSchema.parse(academicYearData);

          if (!parsedData.institutionId) {
            throw new Error('Institution ID is required');
          }

          return $apiFetch<AcademicYear>(
            `/institutions/${parsedData.institutionId}/academic-years`,
            {
              method: 'POST',
              body: parsedData,
            }
          );
        },
        onSuccess: (newAcademicYear) => {
          // Add to local state for immediate UI update
          academicYears.value.push(newAcademicYear);
          console.log('Academic year created successfully:', newAcademicYear);
        },
        onError: (error) => {
          console.error('Error creating academic year:', error);
        },
      });

  // Update academic year mutation
  const updateAcademicYearMutation = import.meta.server
    ? {
        mutateAsync: async () => null,
        isLoading: ref(false),
      }
    : useMutation({
        mutation: ({
          institutionId,
          id,
          data,
        }: {
          institutionId: string;
          id: string;
          data: UpdateAcademicYearSchema;
        }) => {
          // Validate with update schema
          const parsedData = updateAcademicYearSchema.parse(data);

          return $apiFetch<AcademicYear>(
            `/institutions/${institutionId}/academic-years/${id}`,
            {
              method: 'PUT',
              body: parsedData,
            }
          );
        },
        onSuccess: (updatedAcademicYear, { id }) => {
          // Update in local state
          const index = academicYears.value.findIndex((y) => y.id === id);
          if (index !== -1) {
            academicYears.value[index] = updatedAcademicYear;
          }
        },
        onError: (error) => {
          console.error('Error updating academic year:', error);
        },
      });

  // Delete academic year mutation
  const deleteAcademicYearMutation = import.meta.server
    ? {
        mutateAsync: async () => {},
        isLoading: ref(false),
      }
    : useMutation({
        mutation: ({
          institutionId,
          id,
        }: {
          institutionId: string;
          id: string;
        }) =>
          $apiFetch(`/institutions/${institutionId}/academic-years/${id}`, {
            method: 'DELETE',
          }),
        onSuccess: (_, { id }) => {
          // Remove from local state
          academicYears.value = academicYears.value.filter((y) => y.id !== id);
          // Also remove associated semesters
          semestersByAcademicYear.value.delete(id);
        },
        onError: (error) => {
          console.error('Error deleting academic year:', error);
        },
      });

  // Create semester/term mutation
  const createSemesterMutation = import.meta.server
    ? {
        mutateAsync: async () => null,
        isLoading: ref(false),
      }
    : useMutation({
        mutation: (semesterData: CreateSemesterSchema) => {
          // Validate with institution-specific schema
          const parsedData = validateSemesterForInstitutionType(
            semesterData,
            isHigherEducationInstitution.value
          );

          if (!parsedData.academicYearId) {
            throw new Error('Academic Year ID is required');
          }

          return $apiFetch<Semester>(
            `/academic-years/${parsedData.academicYearId}/semesters`,
            {
              method: 'POST',
              body: parsedData,
            }
          );
        },
        onSuccess: (newSemester) => {
          // Add to local state for immediate UI update
          const academicYearId = newSemester.academicYearId;
          const currentSemesters =
            semestersByAcademicYear.value.get(academicYearId) || [];
          semestersByAcademicYear.value.set(academicYearId, [
            ...currentSemesters,
            newSemester,
          ]);
        },
        onError: (error) => {
          console.error('Error creating semester/term:', error);
        },
      });

  // Update semester/term mutation
  const updateSemesterMutation = import.meta.server
    ? {
        mutateAsync: async () => null,
        isLoading: ref(false),
      }
    : useMutation({
        mutation: ({
          academicYearId,
          id,
          data,
        }: {
          academicYearId: string;
          id: string;
          data: UpdateSemesterSchema;
        }) => {
          // Validate with institution-specific schema
          const parsedData = validateSemesterForInstitutionType(
            data as CreateSemesterSchema,
            isHigherEducationInstitution.value
          );

          return $apiFetch<Semester>(
            `/academic-years/${academicYearId}/semesters/${id}`,
            {
              method: 'PUT',
              body: parsedData,
            }
          );
        },
        onSuccess: (updatedSemester, { academicYearId, id }) => {
          // Update in local state
          const currentSemesters =
            semestersByAcademicYear.value.get(academicYearId) || [];
          const index = currentSemesters.findIndex((s) => s.id === id);
          if (index !== -1) {
            currentSemesters[index] = updatedSemester;
            semestersByAcademicYear.value.set(academicYearId, [
              ...currentSemesters,
            ]);
          }
        },
        onError: (error) => {
          console.error('Error updating semester/term:', error);
        },
      });

  // Delete semester/term mutation
  const deleteSemesterMutation = import.meta.server
    ? {
        mutateAsync: async () => {},
        isLoading: ref(false),
      }
    : useMutation({
        mutation: ({
          academicYearId,
          id,
        }: {
          academicYearId: string;
          id: string;
        }) =>
          $apiFetch(`/academic-years/${academicYearId}/semesters/${id}`, {
            method: 'DELETE',
          }),
        onSuccess: (_, { academicYearId, id }) => {
          // Remove from local state
          const currentSemesters =
            semestersByAcademicYear.value.get(academicYearId) || [];
          const filteredSemesters = currentSemesters.filter((s) => s.id !== id);
          semestersByAcademicYear.value.set(academicYearId, filteredSemesters);
        },
        onError: (error) => {
          console.error('Error deleting semester/term:', error);
        },
      });

  // Auto-sync with institution when it changes - only on client
  let currentInstitutionAcademicYearsQuery: ReturnType<
    typeof institutionAcademicYearsQuery
  > | null = null;

  if (import.meta.client) {
    const currentInstitutionId = computed(
      () => institutionStore.activeInstitution?.id ?? null
    );

    // Create a query for the current institution
    currentInstitutionAcademicYearsQuery =
      institutionAcademicYearsQuery(currentInstitutionId);

    // Watch for current institution academic years data changes
    watch(
      () => currentInstitutionAcademicYearsQuery?.data.value,
      (newPagedResult) => {
        if (newPagedResult) {
          // Extract items from paged result
          academicYears.value = newPagedResult.items || [];
          academicYearsPagedResult.value = newPagedResult;
        }
      },
      { immediate: true }
    );

    // Clear semester data when institution changes
    watch(currentInstitutionId, (newInstitutionId, oldInstitutionId) => {
      if (newInstitutionId !== oldInstitutionId) {
        semestersByAcademicYear.value.clear();
        console.log('Cleared semester data due to institution change');
      }
    });
  }

  // Computed getters
  const academicYearOptions = computed(() => {
    return academicYears.value.map((year) => ({
      label: year.name || '',
      value: year.id,
    }));
  });

  const filteredAcademicYears = computed(() => {
    if (!searchQuery.value) return academicYears.value;

    const query = searchQuery.value.toLowerCase();
    return academicYears.value.filter(
      (year) => year.name && year.name.toLowerCase().includes(query)
    );
  });

  const currentAcademicYear = computed(() => {
    const now = new Date();
    return academicYears.value.find((year) => {
      const startDate = new Date(year.startDate);
      const endDate = new Date(year.endDate);
      return startDate <= now && now <= endDate;
    });
  });

  const activeAcademicYear = computed(() => {
    return academicYears.value.find((year) => year.isActive === true);
  });

  // Get all semesters from all academic years
  const allSemesters = computed(() => {
    const semesters: Semester[] = [];
    for (const semesterList of semestersByAcademicYear.value.values()) {
      semesters.push(...semesterList);
    }
    return semesters;
  });

  const currentSemesters = computed(() => {
    const now = new Date();
    return allSemesters.value.filter((semester) => {
      const startDate = new Date(semester.startDate);
      const endDate = new Date(semester.endDate);
      return startDate <= now && now <= endDate;
    });
  });

  const upcomingSemesters = computed(() => {
    return allSemesters.value.filter(
      (semester) => semester.status === SemesterStatus.Upcoming
    );
  });

  const completedSemesters = computed(() => {
    return allSemesters.value.filter(
      (semester) => semester.status === SemesterStatus.Completed
    );
  });

  // Institution-specific term filtering
  const higherEdSemesters = computed(() => {
    return allSemesters.value.filter((semester) =>
      isHigherEducationTerm(semester.type)
    );
  });

  const k12Terms = computed(() => {
    return allSemesters.value.filter((semester) => isK12Term(semester.type));
  });

  const quarterTerms = computed(() => {
    return allSemesters.value.filter((semester) =>
      [
        'FirstQuarter',
        'SecondQuarter',
        'ThirdQuarter',
        'FourthQuarter',
      ].includes(semester.type)
    );
  });

  const trimesterTerms = computed(() => {
    return allSemesters.value.filter((semester) =>
      ['FirstTrimester', 'SecondTrimester', 'ThirdTrimester'].includes(
        semester.type
      )
    );
  });

  // Functional computed helpers
  const getSemestersByAcademicYear = (academicYearId: string) => {
    return computed(() => {
      return semestersByAcademicYear.value.get(academicYearId) || [];
    });
  };

  const semestersByStatus = (status: SemesterStatus) => {
    return computed(() => {
      return allSemesters.value.filter(
        (semester) => semester.status === status
      );
    });
  };

  const semestersByType = (type: SemesterType) => {
    return computed(() => {
      return allSemesters.value.filter((semester) => semester.type === type);
    });
  };

  // Academic Year Actions
  const fetchAcademicYearsByInstitution = async (
    institutionId: string,
    page: number = 1,
    pageSize: number = 10
  ) => {
    if (!institutionId) return [];

    console.log('Fetching academic years for institution:', institutionId);

    const query = institutionAcademicYearsQuery(
      ref(institutionId),
      ref(page),
      ref(pageSize)
    );
    await query.refetch();

    const pagedData = query.data.value;
    if (pagedData) {
      academicYears.value = pagedData.items || [];
      academicYearsPagedResult.value = pagedData;
      console.log('Institution academic years:', pagedData.items);
      return pagedData.items;
    }

    return [];
  };

  const searchAcademicYears = async (query: string) => {
    searchQuery.value = query;

    if (!query.trim()) {
      // If no search term, fetch academic years for current institution
      const institutionId = institutionStore.activeInstitution?.id;

      if (institutionId) {
        return await fetchAcademicYearsByInstitution(institutionId);
      } else {
        console.warn('No active institution to fetch academic years');
        return [];
      }
    }

    // Use local filtering since there's no search endpoint
    console.log('Using local filtering for academic year search');

    // Ensure we have data loaded first
    if (academicYears.value.length === 0) {
      const institutionId = institutionStore.activeInstitution?.id;

      if (institutionId) {
        await fetchAcademicYearsByInstitution(institutionId);
      }
    }

    return filteredAcademicYears.value;
  };

  const createAcademicYear = async (
    academicYearData: CreateAcademicYearSchema
  ) => {
    console.log(
      'Creating academic year with data:',
      createAcademicYearSchema.parse(academicYearData)
    );
    return await createAcademicYearMutation.mutateAsync(academicYearData);
  };

  const updateAcademicYear = async (
    institutionId: string,
    id: string,
    data: UpdateAcademicYearSchema
  ) => {
    return await updateAcademicYearMutation.mutateAsync({
      institutionId,
      id,
      data,
    });
  };

  const deleteAcademicYear = async (institutionId: string, id: string) => {
    await deleteAcademicYearMutation.mutateAsync({ institutionId, id });
  };

  const getAcademicYearById = async (
    institutionId: string,
    academicYearId: string
  ) => {
    const query = academicYearByIdQuery(
      ref(institutionId),
      ref(academicYearId)
    );
    await query.refetch();
    return query.data.value;
  };

  const clearSearch = () => {
    searchQuery.value = '';
  };

  // Semester/Term Actions (Academic Year Scoped)
  const fetchSemestersByAcademicYear = async (
    academicYearId: string,
    page: number = 1,
    pageSize: number = 10
  ) => {
    if (!academicYearId) return [];

    console.log('Fetching semesters for academic year:', academicYearId);

    const query = academicYearSemestersQuery(
      ref(academicYearId),
      ref(page),
      ref(pageSize)
    );
    await query.refetch();

    const pagedData = query.data.value;
    if (pagedData) {
      const semesters = pagedData.items || [];
      // Update local state
      semestersByAcademicYear.value.set(academicYearId, semesters);
      console.log('Academic year semesters:', semesters);
      return semesters;
    }

    return [];
  };

  const createSemester = async (semesterData: CreateSemesterSchema) => {
    console.log('Creating semester with data:', semesterData);
    return await createSemesterMutation.mutateAsync(semesterData);
  };

  const updateSemester = async (
    academicYearId: string,
    id: string,
    data: UpdateSemesterSchema
  ) => {
    return await updateSemesterMutation.mutateAsync({
      academicYearId,
      id,
      data,
    });
  };

  const deleteSemester = async (academicYearId: string, id: string) => {
    await deleteSemesterMutation.mutateAsync({ academicYearId, id });
  };

  const getSemesterById = async (
    academicYearId: string,
    semesterId: string
  ) => {
    const query = semesterByIdQuery(ref(academicYearId), ref(semesterId));
    await query.refetch();
    return query.data.value;
  };

  // Global Semester Actions (Use Sparingly - Security Risk)
  const fetchAllSemestersGlobal = async () => {
    console.warn(
      'Fetching ALL semesters globally - security risk, use sparingly'
    );

    try {
      const pagedResult =
        await $apiFetch<PagedResult<Semester>>('/semesters/all');
      console.log('Global semesters fetched:', pagedResult.items?.length || 0);
      return pagedResult.items || [];
    } catch (error) {
      console.error('Error fetching global semesters:', error);
      throw error;
    }
  };

  const fetchActiveSemestersGlobal = async () => {
    console.warn(
      'Fetching active semesters globally - security risk, use sparingly'
    );

    try {
      const pagedResult =
        await $apiFetch<PagedResult<Semester>>('/semesters/active');
      console.log(
        'Global active semesters fetched:',
        pagedResult.items?.length || 0
      );
      return pagedResult.items || [];
    } catch (error) {
      console.error('Error fetching global active semesters:', error);
      throw error;
    }
  };

  const fetchSemestersByInstitution = async (institutionId: string) => {
    if (!institutionId) return [];

    console.log(
      'Fetching semesters for institution (cross-academic-year):',
      institutionId
    );

    try {
      const pagedResult = await $apiFetch<PagedResult<Semester>>(
        `/semesters/institution/${institutionId}`
      );
      console.log(
        'Institution semesters fetched:',
        pagedResult.items?.length || 0
      );
      return pagedResult.items || [];
    } catch (error) {
      console.error('Error fetching institution semesters:', error);
      throw error;
    }
  };

  const getSemesterByIdGlobal = async (semesterId: string) => {
    const query = globalSemesterByIdQuery(ref(semesterId));
    await query.refetch();
    return query.data.value;
  };

  // Term-specific helper functions
  const getTermDisplayName = (type: SemesterType): string => {
    return getTermDisplayName(type, isHigherEducationInstitution.value);
  };

  const getDefaultTermValues = (academicYearId?: string) => {
    return getDefaultSemesterValues(
      isHigherEducationInstitution.value,
      academicYearId
    );
  };

  const validateTermForInstitution = (data: CreateSemesterSchema) => {
    return validateSemesterForInstitutionType(
      data,
      isHigherEducationInstitution.value
    );
  };

  return {
    // State
    academicYears: readonly(academicYears),
    academicYearsPagedResult: readonly(academicYearsPagedResult),
    semestersByAcademicYear: readonly(semestersByAcademicYear),
    searchQuery: readonly(searchQuery),

    // Computed getters
    academicYearOptions,
    filteredAcademicYears,
    currentAcademicYear,
    activeAcademicYear,
    allSemesters,
    currentSemesters,
    upcomingSemesters,
    completedSemesters,
    getSemestersByAcademicYear,
    semestersByStatus,
    semestersByType,

    // Institution-specific term filtering
    higherEdSemesters,
    k12Terms,
    quarterTerms,
    trimesterTerms,

    // Loading states - consistent computed refs
    loadingAcademicYears: computed(
      () => currentInstitutionAcademicYearsQuery?.isLoading.value || false
    ),
    loadingSemesters: computed(() => false), // No global semester loading
    searchLoading: computed(() => false), // Local filtering only
    isCreatingAcademicYear: computed(
      () => createAcademicYearMutation.isLoading.value
    ),
    isUpdatingAcademicYear: computed(
      () => updateAcademicYearMutation.isLoading.value
    ),
    isDeletingAcademicYear: computed(
      () => deleteAcademicYearMutation.isLoading.value
    ),
    isCreatingSemester: computed(() => createSemesterMutation.isLoading.value),
    isUpdatingSemester: computed(() => updateSemesterMutation.isLoading.value),
    isDeletingSemester: computed(() => deleteSemesterMutation.isLoading.value),

    // Combined loading state
    isLoading: computed(
      () =>
        currentInstitutionAcademicYearsQuery?.isLoading.value ||
        false ||
        createAcademicYearMutation.isLoading.value ||
        updateAcademicYearMutation.isLoading.value ||
        deleteAcademicYearMutation.isLoading.value ||
        createSemesterMutation.isLoading.value ||
        updateSemesterMutation.isLoading.value ||
        deleteSemesterMutation.isLoading.value
    ),

    // Academic Year Actions
    fetchAcademicYearsByInstitution,
    searchAcademicYears,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
    getAcademicYearById,
    clearSearch,

    // Semester/Term Actions (Academic Year Scoped)
    fetchSemestersByAcademicYear,
    createSemester,
    updateSemester,
    deleteSemester,
    getSemesterById,

    // Global Semester Actions (Use Sparingly - Security Risk)
    fetchAllSemestersGlobal,
    fetchActiveSemestersGlobal,
    fetchSemestersByInstitution,
    getSemesterByIdGlobal,

    // Term-specific helpers
    getTermDisplayName,
    getDefaultTermValues,
    validateTermForInstitution,

    // Query factories for dynamic usage
    institutionAcademicYearsQuery,
    academicYearByIdQuery,
    academicYearSemestersQuery,
    semesterByIdQuery,
    globalSemesterByIdQuery,

    // Direct access to main queries
    currentInstitutionAcademicYearsQuery: computed(
      () => currentInstitutionAcademicYearsQuery
    ),
  };
});
