// stores/absence.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import {
  absenceFormSchema,
  type AbsenceFormSchema,
} from '~/schemas/absence.schema';
import type { AbsenceResponseDto } from '~/interfaces/academic/absence.dto';

// Re-export types for convenience
export type Absence = AbsenceResponseDto;
export type AbsenceForm = AbsenceFormSchema;

// Type for filter parameters


export const useAbsenceStore = defineStore('absence', () => {
  if (import.meta.server) {
    return {
      // State
      absences: readonly(ref([])),

      // Computed getters
      absencesByStudent: () => () => [],
      absencesByCourse: () => () => [],
      absencesBySubject: () => () => [],
      excusedAbsences: [],
      unexcusedAbsences: [],
      totalAbsencesByStudent: () => () => 0,

      // Loading states
      loadingAbsences: false,
      searchLoading: false,
      isCreatingAbsence: false,
      isUpdatingAbsence: false,
      isDeletingAbsence: false,
      isLoading: false,

      // Actions
      fetchAllAbsences: async () => {},
      getAbsenceById: async () => null,
      getAbsencesByStudentId: async () => [],
      getAbsencesByCourseId: async () => [],
      getAbsencesBySubjectId: async () => [],
      getAbsencesByFilter: async () => [],
      createAbsence: async () => null,
      updateAbsence: async () => null,
      deleteAbsence: async () => {},

      // Query factories
      studentAbsencesQuery: () => null,
      courseAbsencesQuery: () => null,
      subjectAbsencesQuery: () => null,
      absenceQuery: () => null,
      filteredAbsencesQuery: () => null,
      absencesQuery: null,
    };
  }
  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const absences = ref<Absence[]>([]);

  // All absences query
  const absencesQuery = useQuery({
    key: () => ['absences', 'all'],
    query: () => $apiFetch<Absence[]>('/absences'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Student absences query
  const studentAbsencesQuery = (studentId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['absences', 'student', unref(studentId) || ''],
      query: () =>
        $apiFetch<Absence[]>(`/absences/student/${unref(studentId)}`),
      enabled: () => !!unref(studentId),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Course absences query
  const courseAbsencesQuery = (courseId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['absences', 'course', unref(courseId) || ''],
      query: () => $apiFetch<Absence[]>(`/absences/course/${unref(courseId)}`),
      enabled: () => !!unref(courseId),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Subject absences query
  const subjectAbsencesQuery = (subjectId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['absences', 'subject', unref(subjectId) || ''],
      query: () =>
        $apiFetch<Absence[]>(`/absences/subject/${unref(subjectId)}`),
      enabled: () => !!unref(subjectId),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Single absence query
  const absenceQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['absences', 'single', unref(id) || ''],
      query: () => $apiFetch<Absence>(`/absences/${unref(id)}`),
      enabled: () => !!unref(id),
      staleTime: 10 * 60 * 1000, // 10 minutes for single records
    });
  };

  // Filtered absences query
  const filteredAbsencesQuery = (
    filterParams: MaybeRef<AbsenceFilterParams | null>
  ) => {
    return useQuery({
      key: () => [
        'absences',
        'filtered',
        JSON.stringify(unref(filterParams) || {}),
      ],
      query: () => {
        const params = unref(filterParams);
        if (!params) return Promise.resolve([]);

        // Build URL with query parameters
        let url = '/absences/filter?';
        const searchParams = new URLSearchParams();

        if (params.studentId) {
          searchParams.append('studentId', params.studentId);
        }
        if (params.courseId) {
          searchParams.append('courseId', params.courseId);
        }
        if (params.subjectId) {
          searchParams.append('subjectId', params.subjectId);
        }
        if (params.status !== null) {
          searchParams.append('status', params.status.toString());
        }
        if (params.isExcused !== null) {
          searchParams.append('isExcused', params.isExcused.toString());
        }
        if (params.fromDate) {
          searchParams.append('fromDate', params.fromDate.toISOString());
        }
        if (params.toDate) {
          searchParams.append('toDate', params.toDate.toISOString());
        }

        url += searchParams.toString();
        return $apiFetch<Absence[]>(url);
      },
      enabled: () => !!unref(filterParams),
      staleTime: 3 * 60 * 1000, // 3 minutes for filtered results
    });
  };

  // Create absence mutation
  const createAbsenceMutation = useMutation({
    mutation: (absenceData: AbsenceForm) => {
      // Validate form data with Zod schema before submitting
      const parsedData = absenceFormSchema.parse(absenceData);
      return $apiFetch<Absence>('/absences', {
        method: 'POST',
        body: parsedData,
      });
    },
    onSuccess: (newAbsence) => {
      // Add to local state for immediate UI update
      absences.value.push(newAbsence);

      // Invalidate relevant queries to refetch fresh data
      absencesQuery.refetch();
    },
    onError: (error) => {
      console.error('Error creating absence:', error);
    },
  });

  // Update absence mutation
  const updateAbsenceMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: Partial<AbsenceForm> }) =>
      $apiFetch<Absence>(`/absences/${id}`, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: (updatedAbsence, { id }) => {
      // Update in local state
      const index = absences.value.findIndex((a) => a.id === id);
      if (index !== -1) {
        absences.value[index] = updatedAbsence;
      }

      // Invalidate related queries
      absencesQuery.refetch();
    },
    onError: (error) => {
      console.error('Error updating absence:', error);
    },
  });

  // Delete absence mutation
  const deleteAbsenceMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/absences/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      // Remove from local state
      absences.value = absences.value.filter((absence) => absence.id !== id);

      // Invalidate queries
      absencesQuery.refetch();
    },
    onError: (error) => {
      console.error('Error deleting absence:', error);
    },
  });

  // Watch for query data changes to update local state
  watch(
    () => absencesQuery.data.value,
    (newAbsences) => {
      if (newAbsences) {
        absences.value = newAbsences;
      }
    },
    { immediate: true }
  );

  // Computed getters (maintaining your existing API)
  const absencesByStudent = computed(() => (studentId: string) => {
    return absences.value.filter((absence) => absence.studentId === studentId);
  });

  const absencesByCourse = computed(() => (courseId: string) => {
    return absences.value.filter((absence) => absence.courseId === courseId);
  });

  const absencesBySubject = computed(() => (subjectId: string) => {
    return absences.value.filter((absence) => absence.subjectId === subjectId);
  });

  const excusedAbsences = computed(() => {
    return absences.value.filter((absence) => absence.isExcused);
  });

  const unexcusedAbsences = computed(() => {
    return absences.value.filter((absence) => !absence.isExcused);
  });

  const totalAbsencesByStudent = computed(() => (studentId: string) => {
    return absences.value.filter((absence) => absence.studentId === studentId)
      .length;
  });

  // Action-like functions maintaining your existing API
  const fetchAllAbsences = async () => {
    await absencesQuery.refetch();
  };

  const getAbsenceById = async (id: string) => {
    const query = absenceQuery(ref(id));
    await query.refetch();
    return query.data.value;
  };

  const getAbsencesByStudentId = async (studentId: string) => {
    const query = studentAbsencesQuery(ref(studentId));
    await query.refetch();
    const data = query.data.value || [];
    absences.value = data;
    return data;
  };

  const getAbsencesByCourseId = async (courseId: string) => {
    const query = courseAbsencesQuery(ref(courseId));
    await query.refetch();
    const data = query.data.value || [];
    absences.value = data;
    return data;
  };

  const getAbsencesBySubjectId = async (subjectId: string) => {
    const query = subjectAbsencesQuery(ref(subjectId));
    await query.refetch();
    const data = query.data.value || [];
    absences.value = data;
    return data;
  };

  const getAbsencesByFilter = async (filterParams: AbsenceFilterParams) => {
    const query = filteredAbsencesQuery(ref(filterParams));
    await query.refetch();
    const data = query.data.value || [];
    absences.value = data;
    return data;
  };

  const createAbsence = async (absenceData: AbsenceForm) => {
    return await createAbsenceMutation.mutateAsync(absenceData);
  };

  const updateAbsence = async (id: string, data: Partial<AbsenceForm>) => {
    return await updateAbsenceMutation.mutateAsync({ id, data });
  };

  const deleteAbsence = async (id: string) => {
    await deleteAbsenceMutation.mutateAsync(id);
  };

  return {
    // State
    absences: readonly(absences),

    // Computed getters (maintaining existing API)
    absencesByStudent,
    absencesByCourse,
    absencesBySubject,
    excusedAbsences,
    unexcusedAbsences,
    totalAbsencesByStudent,

    // Loading states
    loadingAbsences: computed(() => absencesQuery.isLoading.value),
    searchLoading: computed(() => {
      return false; 
    }),
    isCreatingAbsence: computed(() => createAbsenceMutation.isLoading.value),
    isUpdatingAbsence: computed(() => updateAbsenceMutation.isLoading.value),
    isDeletingAbsence: computed(() => deleteAbsenceMutation.isLoading.value),

    // Combined loading state
    isLoading: computed(
      () =>
        absencesQuery.isLoading.value ||
        createAbsenceMutation.isLoading.value ||
        updateAbsenceMutation.isLoading.value ||
        deleteAbsenceMutation.isLoading.value
    ),

    // Actions (maintaining existing API)
    fetchAllAbsences,
    getAbsenceById,
    getAbsencesByStudentId,
    getAbsencesByCourseId,
    getAbsencesBySubjectId,
    getAbsencesByFilter,
    createAbsence,
    updateAbsence,
    deleteAbsence,

    // Query factories for dynamic usage
    studentAbsencesQuery,
    courseAbsencesQuery,
    subjectAbsencesQuery,
    absenceQuery,
    filteredAbsencesQuery,

    // Direct access to main queries
    absencesQuery,
  };
});
