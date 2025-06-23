// stores/mark.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import { markFormSchema, type MarkFormSchema } from '~/schemas/mark.schema';
import type { MarkResponseDto } from '~/interfaces/academic/mark-response.dto';
import type { MarkFilterParams } from '~/interfaces/mark/mark-filter-params';
// Re-export types for convenience
export type Mark = MarkResponseDto;
export type MarkForm = MarkFormSchema;

// Type for filter parameters


export const useMarkStore = defineStore('mark', () => {
  if (import.meta.server) {
    return {
      // State
      marks: readonly(ref([])),

      // Computed getters
      marksByStudent: () => () => [],
      marksByTeacher: () => () => [],
      marksBySubject: () => () => [],
      averageMarkForStudent: () => () => 0,
      averageMarkForSubject: () => () => 0,

      // Loading states
      loadingMarks: false,
      searchLoading: false,
      isCreatingMark: false,
      isUpdatingMark: false,
      isDeletingMark: false,
      isLoading: false,

      // Actions
      fetchAllMarks: async () => {},
      getMarkById: async () => null,
      getMarksByStudentId: async () => [],
      getMarksByTeacherId: async () => [],
      getMarksBySubjectId: async () => [],
      getMarksByFilter: async () => [],
      createMark: async () => null,
      updateMark: async () => null,
      deleteMark: async () => {},
      getAverageMarkForStudent: async () => 0,
      getAverageMarkForSubject: async () => 0,

      // Query factories
      studentMarksQuery: () => null,
      teacherMarksQuery: () => null,
      subjectMarksQuery: () => null,
      markQuery: () => null,
      filteredMarksQuery: () => null,
      studentAverageQuery: () => null,
      subjectAverageQuery: () => null,
      marksQuery: null,
    };
  }
  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const marks = ref<Mark[]>([]);

  // All marks query
  const marksQuery = useQuery({
    key: () => ['marks', 'all'],
    query: () => $apiFetch<Mark[]>('/marks'),
    staleTime: 2 * 60 * 1000, // 2 minutes - marks change frequently
  });

  // Student marks query
  const studentMarksQuery = (studentId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['marks', 'student', unref(studentId) || ''],
      query: () => $apiFetch<Mark[]>(`/marks/student/${unref(studentId)}`),
      enabled: () => !!unref(studentId),
      staleTime: 2 * 60 * 1000,
    });
  };

  // Teacher marks query
  const teacherMarksQuery = (teacherId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['marks', 'teacher', unref(teacherId) || ''],
      query: () => $apiFetch<Mark[]>(`/marks/teacher/${unref(teacherId)}`),
      enabled: () => !!unref(teacherId),
      staleTime: 2 * 60 * 1000,
    });
  };

  // Subject marks query
  const subjectMarksQuery = (subjectId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['marks', 'subject', unref(subjectId) || ''],
      query: () => $apiFetch<Mark[]>(`/marks/subject/${unref(subjectId)}`),
      enabled: () => !!unref(subjectId),
      staleTime: 2 * 60 * 1000,
    });
  };

  // Single mark query
  const markQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['marks', 'single', unref(id) || ''],
      query: () => $apiFetch<Mark>(`/marks/${unref(id)}`),
      enabled: () => !!unref(id),
      staleTime: 5 * 60 * 1000, // 5 minutes for single records
    });
  };

  // Filtered marks query
  const filteredMarksQuery = (
    filterParams: MaybeRef<MarkFilterParams | null>
  ) => {
    return useQuery({
      key: () => {
        const params = unref(filterParams);
        if (!params) return ['marks', 'filtered', ''];

        const stableParams = {
          studentId: params.studentId,
          teacherId: params.teacherId,
          subjectId: params.subjectId,
          type: params.type,
          fromDate: params.fromDate?.toISOString(),
          toDate: params.toDate?.toISOString(),
        };

        return ['marks', 'filtered', stableParams];
      },
      query: () => {
        const params = unref(filterParams);
        if (!params) return Promise.resolve([]);

        // Build URL with query parameters
        const searchParams = new URLSearchParams();

        if (params.studentId) {
          searchParams.append('studentId', params.studentId);
        }
        if (params.teacherId) {
          searchParams.append('teacherId', params.teacherId);
        }
        if (params.subjectId) {
          searchParams.append('subjectId', params.subjectId);
        }
        if (params.type !== null && params.type !== undefined) {
          searchParams.append('type', params.type.toString());
        }
        if (params.fromDate) {
          searchParams.append('fromDate', params.fromDate.toISOString());
        }
        if (params.toDate) {
          searchParams.append('toDate', params.toDate.toISOString());
        }

        const url = `/marks/filter?${searchParams.toString()}`;
        return $apiFetch<Mark[]>(url);
      },
      enabled: () => !!unref(filterParams),
      staleTime: 1 * 60 * 1000, // 1 minute for filtered results
    });
  };

  // Statistics queries
  const studentAverageQuery = (
    studentId: MaybeRef<string | null>,
    subjectId: MaybeRef<string | null> = ref(null)
  ) => {
    return useQuery({
      key: () => [
        'marks',
        'statistics',
        'student-average',
        unref(studentId) || '',
        unref(subjectId) || '',
      ],
      query: () => {
        const sId = unref(studentId);
        if (!sId) throw new Error('Student ID is required');

        let url = `/marks/statistics/student/${sId}/average`;
        const subjId = unref(subjectId);
        if (subjId) {
          url += `?subjectId=${subjId}`;
        }

        return $apiFetch<number>(url);
      },
      enabled: () => !!unref(studentId),
      staleTime: 5 * 60 * 1000, // 5 minutes for statistics
    });
  };

  const subjectAverageQuery = (subjectId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => [
        'marks',
        'statistics',
        'subject-average',
        unref(subjectId) || '',
      ],
      query: () => {
        const subjId = unref(subjectId);
        if (!subjId) throw new Error('Subject ID is required');
        return $apiFetch<number>(`/marks/statistics/subject/${subjId}/average`);
      },
      enabled: () => !!unref(subjectId),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Create mark mutation
  const createMarkMutation = useMutation({
    mutation: (markData: MarkForm) => {
      // Validate form data with Zod schema
      const parsedData = markFormSchema.parse(markData);

      return $apiFetch<Mark>('/marks', {
        method: 'POST',
        body: parsedData,
      });
    },
    onSuccess: (newMark) => {
      // Add to local state for immediate UI update
      marks.value.push(newMark);

      // Refetch relevant queries
      marksQuery.refetch();
    },
    onError: (error) => {
      console.error('Error creating mark:', error);
    },
  });

  // Update mark mutation
  const updateMarkMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: Partial<MarkForm> }) =>
      $apiFetch<Mark>(`/marks/${id}`, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: (updatedMark, { id }) => {
      // Update in local state
      const index = marks.value.findIndex((m) => m.id === id);
      if (index !== -1) {
        marks.value[index] = updatedMark;
      }

      // Refetch relevant queries
      marksQuery.refetch();
    },
    onError: (error) => {
      console.error('Error updating mark:', error);
    },
  });

  // Delete mark mutation
  const deleteMarkMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/marks/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      // Remove from local state
      marks.value = marks.value.filter((mark) => mark.id !== id);

      // Refetch relevant queries
      marksQuery.refetch();
    },
    onError: (error) => {
      console.error('Error deleting mark:', error);
    },
  });

  // Watch for query data changes to update local state
  watch(
    () => marksQuery.data.value,
    (newMarks) => {
      if (newMarks) {
        marks.value = newMarks;
      }
    },
    { immediate: true }
  );

  // Computed getters for local calculations (fallback when API stats not available)
  const marksByStudent = computed(() => (studentId: string) => {
    return marks.value.filter((mark) => mark.studentId === studentId);
  });

  const marksByTeacher = computed(() => (teacherId: string) => {
    return marks.value.filter((mark) => mark.teacherId === teacherId);
  });

  const marksBySubject = computed(() => (subjectId: string) => {
    return marks.value.filter((mark) => mark.subjectId === subjectId);
  });

  const averageMarkForStudent = computed(
    () => (studentId: string, subjectId?: string) => {
      let filteredMarks = marks.value.filter(
        (mark) => mark.studentId === studentId
      );

      if (subjectId) {
        filteredMarks = filteredMarks.filter(
          (mark) => mark.subjectId === subjectId
        );
      }

      if (filteredMarks.length === 0) return 0;

      const sum = filteredMarks.reduce((acc, mark) => acc + mark.value, 0);
      return sum / filteredMarks.length;
    }
  );

  const averageMarkForSubject = computed(() => (subjectId: string) => {
    const filteredMarks = marks.value.filter(
      (mark) => mark.subjectId === subjectId
    );

    if (filteredMarks.length === 0) return 0;

    const sum = filteredMarks.reduce((acc, mark) => acc + mark.value, 0);
    return sum / filteredMarks.length;
  });

  // Action-like functions maintaining your existing API
  const fetchAllMarks = async () => {
    await marksQuery.refetch();
  };

  const getMarkById = async (id: string) => {
    const query = markQuery(ref(id));
    await query.refetch();
    return query.data.value;
  };

  const getMarksByStudentId = async (studentId: string) => {
    const query = studentMarksQuery(ref(studentId));
    await query.refetch();
    const data = query.data.value || [];
    marks.value = data;
    return data;
  };

  const getMarksByTeacherId = async (teacherId: string) => {
    const query = teacherMarksQuery(ref(teacherId));
    await query.refetch();
    const data = query.data.value || [];
    marks.value = data;
    return data;
  };

  const getMarksBySubjectId = async (subjectId: string) => {
    const query = subjectMarksQuery(ref(subjectId));
    await query.refetch();
    const data = query.data.value || [];
    marks.value = data;
    return data;
  };

  const getMarksByFilter = async (filterParams: MarkFilterParams) => {
    const query = filteredMarksQuery(ref(filterParams));
    await query.refetch();
    const data = query.data.value || [];
    marks.value = data;
    return data;
  };

  const createMark = async (markData: MarkForm) => {
    return await createMarkMutation.mutateAsync(markData);
  };

  const updateMark = async (id: string, data: Partial<MarkForm>) => {
    return await updateMarkMutation.mutateAsync({ id, data });
  };

  const deleteMark = async (id: string) => {
    await deleteMarkMutation.mutateAsync(id);
  };

  // Statistics actions (prefer API but fallback to local calculations)
  const getAverageMarkForStudent = async (
    studentId: string,
    subjectId?: string
  ) => {
    const query = studentAverageQuery(ref(studentId), ref(subjectId || null));
    await query.refetch();
    const apiResult = query.data.value;

    // Fallback to local calculation if API fails
    return apiResult !== undefined
      ? apiResult
      : averageMarkForStudent.value(studentId, subjectId);
  };

  const getAverageMarkForSubject = async (subjectId: string) => {
    const query = subjectAverageQuery(ref(subjectId));
    await query.refetch();
    const apiResult = query.data.value;

    // Fallback to local calculation if API fails
    return apiResult !== undefined
      ? apiResult
      : averageMarkForSubject.value(subjectId);
  };

  return {
    // State
    marks: readonly(marks),

    // Computed getters
    marksByStudent,
    marksByTeacher,
    marksBySubject,
    averageMarkForStudent,
    averageMarkForSubject,

    // Loading states
    loadingMarks: computed(() => marksQuery.isLoading.value),
    searchLoading: computed(() => false), // Could track specific filtered queries if needed
    isCreatingMark: computed(() => createMarkMutation.isLoading.value),
    isUpdatingMark: computed(() => updateMarkMutation.isLoading.value),
    isDeletingMark: computed(() => deleteMarkMutation.isLoading.value),

    // Combined loading state
    isLoading: computed(
      () =>
        marksQuery.isLoading.value ||
        createMarkMutation.isLoading.value ||
        updateMarkMutation.isLoading.value ||
        deleteMarkMutation.isLoading.value
    ),

    // Actions (maintaining existing API)
    fetchAllMarks,
    getMarkById,
    getMarksByStudentId,
    getMarksByTeacherId,
    getMarksBySubjectId,
    getMarksByFilter,
    createMark,
    updateMark,
    deleteMark,
    getAverageMarkForStudent,
    getAverageMarkForSubject,

    // Query factories for dynamic usage
    studentMarksQuery,
    teacherMarksQuery,
    subjectMarksQuery,
    markQuery,
    filteredMarksQuery,
    studentAverageQuery,
    subjectAverageQuery,

    // Direct access to main queries
    marksQuery,
  };
});
