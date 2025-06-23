// stores/subject.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import {
  subjectFormSchema,
  type SubjectFormSchema,
} from '~/schemas/subject.schema';
import type { SubjectResponseDto } from '~/interfaces/academic/subject.dto';
import type { StudentElectiveResponseDto } from '~/interfaces/academic/student-elective.dto';
import type { PagedResult } from '~/interfaces/common/paged-result';
import type { InstitutionSubjectFilters } from '~/interfaces/subject/filters/institution-subject-filters';
import type { SubjectFilters } from '~/interfaces/subject/filters/subject-filters';

// Re-export types for convenience
export type Subject = SubjectResponseDto;
export type SubjectForm = SubjectFormSchema;
export type StudentElective = StudentElectiveResponseDto;

// Interface for search/filter parameters matching your controller


// Interface for institution-specific queries


export const useSubjectStore = defineStore('subject', () => {
  if (import.meta.server) {
    return {
      // State
      subjects: readonly(ref([])),
      pagedSubjects: readonly(ref(null)),
      selectedSubject: readonly(ref(null)),
      searchQuery: readonly(ref('')),
      electiveEnrollments: readonly(ref([])),
      currentInstitutionId: readonly(ref(null)),

      // Computed getters
      subjectOptions: [],
      mandatorySubjects: [],
      electiveSubjects: [],
      filteredSubjects: [],
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,

      // Loading states
      loadingSubjects: false,
      searchLoading: false,
      loadingEnrollments: false,
      isLoading: false,
      isCreatingSubject: false,
      isUpdatingSubject: false,
      isDeletingSubject: false,
      isEnrollingStudent: false,
      isUnenrollingStudent: false,

      // Actions - SSR safe stubs
      fetchSubjects: async () => {},
      fetchSubjectsByInstitution: async () => {},
      fetchSubjectsNonPaginated: async () => {},
      fetchSubjectsByDepartment: async () => {},
      searchSubjects: async () => {},
      getSubject: async () => null,
      createSubject: async () => null,
      updateSubject: async () => null,
      deleteSubject: async () => {},
      clearSearch: () => {},
      fetchElectiveEnrollments: async () => [],
      enrollStudentInElective: async () => {},
      unenrollStudentFromElective: async () => {},
      getStudentElectives: async () => [],
      getAvailableElectives: async () => [],
      setInstitutionId: () => {},

      // Query factories
      subjectsQuery: () => null,
      institutionSubjectsQuery: () => null,
      nonPaginatedSubjectsQuery: () => null,
      departmentSubjectsQuery: () => null,
      subjectQuery: () => null,
      electiveEnrollmentsQuery: () => null,
      studentElectivesQuery: () => null,
      availableElectivesQuery: () => null,
    };
  }

  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const subjects = ref<Subject[]>([]);
  const pagedSubjects = ref<PagedResult<Subject> | null>(null);
  const selectedSubject = ref<Subject | null>(null);
  const searchQuery = ref('');
  const electiveEnrollments = ref<StudentElective[]>([]);
  const currentInstitutionId = ref<string | null>(null);

  // Helper function to build query string
  const buildQueryString = (filters: SubjectFilters) => {
    const params = new URLSearchParams();

    if (filters.query) params.append('query', filters.query);
    if (filters.departmentId)
      params.append('departmentId', filters.departmentId);
    if (filters.academicLevel)
      params.append('academicLevel', filters.academicLevel);
    if (filters.electiveType)
      params.append('electiveType', filters.electiveType);
    if (filters.hasLab !== null && filters.hasLab !== undefined) {
      params.append('hasLab', filters.hasLab.toString());
    }
    if (filters.isElective !== null && filters.isElective !== undefined) {
      params.append('isElective', filters.isElective.toString());
    }
    if (filters.page && filters.page > 1)
      params.append('page', filters.page.toString());
    if (filters.pageSize)
      params.append('pageSize', filters.pageSize.toString());

    return params.toString();
  };

  // ===== QUERIES =====

  // All subjects query (SuperAdmin only, paginated)
  const subjectsQuery = (
    filters: MaybeRef<SubjectFilters | null> = ref({})
  ) => {
    return useQuery({
      key: () => ['subjects', 'all', JSON.stringify(unref(filters) || {})],
      query: () => {
        const filterParams = unref(filters) || {};
        const queryString = buildQueryString(filterParams);
        const url = `/Subjects${queryString ? `?${queryString}` : ''}`;
        return $apiFetch<PagedResult<Subject>>(url);
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: () => import.meta.client,
    });
  };

  // Institution subjects query (paginated)
  const institutionSubjectsQuery = (
    filters: MaybeRef<InstitutionSubjectFilters | null>
  ) => {
    return useQuery({
      key: () => [
        'subjects',
        'institution',
        JSON.stringify(unref(filters) || {}),
      ],
      query: () => {
        const filterParams = unref(filters);
        if (!filterParams?.institutionId) {
          throw new Error('Institution ID is required');
        }

        const queryString = buildQueryString(filterParams);
        const url = `/Subjects/institution/${filterParams.institutionId}${queryString ? `?${queryString}` : ''}`;
        return $apiFetch<PagedResult<Subject>>(url);
      },
      enabled: () => {
        const filterParams = unref(filters);
        return !!filterParams?.institutionId && import.meta.client;
      },
      staleTime: 3 * 60 * 1000, // 3 minutes
    });
  };

  // Non-paginated subjects query (for dropdowns, calculations)
  const nonPaginatedSubjectsQuery = () => {
    return useQuery({
      key: () => ['subjects', 'non-paginated'],
      query: () => $apiFetch<Subject[]>('/Subjects/all'),
      staleTime: 10 * 60 * 1000, // 10 minutes
      enabled: () => import.meta.client,
    });
  };

  // Department subjects query
  const departmentSubjectsQuery = (departmentId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['subjects', 'department', unref(departmentId) || ''],
      query: () =>
        $apiFetch<Subject[]>(`/Subjects/department/${unref(departmentId)}`),
      enabled: () => !!unref(departmentId) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Single subject query
  const subjectQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['subjects', 'single', unref(id) || ''],
      query: () => $apiFetch<Subject>(`/Subjects/${unref(id)}`),
      enabled: () => !!unref(id) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes for single records
    });
  };

  // Available electives query
  const availableElectivesQuery = (
    activeOnly: MaybeRef<boolean> = ref(true)
  ) => {
    return useQuery({
      key: () => ['subjects', 'electives', String(unref(activeOnly))],
      query: () =>
        $apiFetch<Subject[]>(
          `/Subjects/electives?activeOnly=${unref(activeOnly)}`
        ),
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: () => import.meta.client,
    });
  };

  // Elective enrollments query
  const electiveEnrollmentsQuery = (subjectId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['subjects', 'enrollments', unref(subjectId) || ''],
      query: () =>
        $apiFetch<StudentElective[]>(
          `/Subjects/electives/${unref(subjectId)}/enrollments`
        ),
      enabled: () => !!unref(subjectId) && import.meta.client,
      staleTime: 2 * 60 * 1000, // 2 minutes for enrollments
    });
  };

  // Student electives query
  const studentElectivesQuery = (studentId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['subjects', 'student-electives', unref(studentId) || ''],
      query: () =>
        $apiFetch<Subject[]>(`/Subjects/student/${unref(studentId)}/electives`),
      enabled: () => !!unref(studentId) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // ===== MUTATIONS =====

  // Create subject mutation
  const createSubjectMutation = useMutation({
    mutation: (subjectData: SubjectForm) => {
      const parsedData = subjectFormSchema.parse(subjectData);
      return $apiFetch<Subject>('/Subjects', {
        method: 'POST',
        body: parsedData,
      });
    },
    onSuccess: (newSubject) => {
      // Add to local non-paginated state
      subjects.value.push(newSubject);

      // Invalidate relevant queries
      const allSubjectsQuery = nonPaginatedSubjectsQuery();
      allSubjectsQuery.refetch();
    },
    onError: (error) => {
      console.error('Error creating subject:', error);
    },
  });

  // Update subject mutation
  const updateSubjectMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: SubjectForm }) => {
      const parsedData = subjectFormSchema.parse(data);
      return $apiFetch<Subject>(`/Subjects/${id}`, {
        method: 'PUT',
        body: parsedData,
      });
    },
    onSuccess: (updatedSubject, { id }) => {
      // Update in local state
      const index = subjects.value.findIndex((s) => s.id === id);
      if (index !== -1) {
        subjects.value[index] = updatedSubject;
      }

      // Update selected subject if it's the same
      if (selectedSubject.value?.id === id) {
        selectedSubject.value = updatedSubject;
      }

      // Invalidate relevant queries
      const allSubjectsQuery = nonPaginatedSubjectsQuery();
      allSubjectsQuery.refetch();
    },
    onError: (error) => {
      console.error('Error updating subject:', error);
    },
  });

  // Delete subject mutation
  const deleteSubjectMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/Subjects/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) => {
      // Remove from local state
      subjects.value = subjects.value.filter((subject) => subject.id !== id);

      // Clear selected subject if it was deleted
      if (selectedSubject.value?.id === id) {
        selectedSubject.value = null;
      }

      // Invalidate queries
      const allSubjectsQuery = nonPaginatedSubjectsQuery();
      allSubjectsQuery.refetch();
    },
    onError: (error) => {
      console.error('Error deleting subject:', error);
    },
  });

  // Enroll student mutation
  const enrollStudentMutation = useMutation({
    mutation: ({
      subjectId,
      studentId,
    }: {
      subjectId: string;
      studentId: string;
    }) =>
      $apiFetch(`/Subjects/electives/${subjectId}/enroll/${studentId}`, {
        method: 'POST',
      }),
    onSuccess: (_, { subjectId }) => {
      // Update enrollment count in the subject if it exists in state
      const subjectIndex = subjects.value.findIndex((s) => s.id === subjectId);
      if (
        subjectIndex !== -1 &&
        subjects.value[subjectIndex].enrollmentsCount !== undefined
      ) {
        subjects.value[subjectIndex] = {
          ...subjects.value[subjectIndex],
          enrollmentsCount:
            (subjects.value[subjectIndex].enrollmentsCount || 0) + 1,
        };
      }

      // Refetch enrollments
      const enrollmentsQuery = electiveEnrollmentsQuery(ref(subjectId));
      enrollmentsQuery.refetch();
    },
    onError: (error) => {
      console.error('Error enrolling student:', error);
    },
  });

  // Unenroll student mutation
  const unenrollStudentMutation = useMutation({
    mutation: ({
      subjectId,
      studentId,
    }: {
      subjectId: string;
      studentId: string;
    }) =>
      $apiFetch(`/Subjects/electives/${subjectId}/unenroll/${studentId}`, {
        method: 'POST',
      }),
    onSuccess: (_, { subjectId, studentId }) => {
      // Update enrollment count in the subject if it exists in state
      const subjectIndex = subjects.value.findIndex((s) => s.id === subjectId);
      if (
        subjectIndex !== -1 &&
        subjects.value[subjectIndex].enrollmentsCount
      ) {
        subjects.value[subjectIndex] = {
          ...subjects.value[subjectIndex],
          enrollmentsCount: Math.max(
            0,
            subjects.value[subjectIndex].enrollmentsCount! - 1
          ),
        };
      }

      // Remove enrollment from local state
      electiveEnrollments.value = electiveEnrollments.value.filter(
        (enrollment) => enrollment.studentId !== studentId
      );

      // Refetch enrollments
      const enrollmentsQuery = electiveEnrollmentsQuery(ref(subjectId));
      enrollmentsQuery.refetch();
    },
    onError: (error) => {
      console.error('Error unenrolling student:', error);
    },
  });

  // ===== COMPUTED PROPERTIES =====

  const subjectOptions = computed(() => {
    return subjects.value.map((subject) => ({
      label: `${subject.name || ''} ${subject.code ? `(${subject.code})` : ''}`,
      value: subject.id,
    }));
  });

  const mandatorySubjects = computed(() => {
    return subjects.value.filter((subject) => !subject.isElective);
  });

  const electiveSubjects = computed(() => {
    return subjects.value.filter((subject) => subject.isElective);
  });

  const filteredSubjects = computed(() => {
    if (!searchQuery.value) return subjects.value;

    const query = searchQuery.value.toLowerCase();
    return subjects.value.filter(
      (subject) =>
        (subject.name && subject.name.toLowerCase().includes(query)) ||
        (subject.code && subject.code.toLowerCase().includes(query)) ||
        (subject.shortDescription &&
          subject.shortDescription.toLowerCase().includes(query))
    );
  });

  // Pagination computed properties
  const totalPages = computed(() => pagedSubjects.value?.totalPages || 0);
  const currentPage = computed(() => pagedSubjects.value?.currentPage || 1);
  const hasNextPage = computed(() => pagedSubjects.value?.hasNextPage || false);
  const hasPreviousPage = computed(
    () => pagedSubjects.value?.hasPreviousPage || false
  );

  // ===== LOADING STATES =====

  const loadingSubjects = computed(() => {
    const nonPaginatedQuery = nonPaginatedSubjectsQuery();
    return nonPaginatedQuery.isLoading.value;
  });

  const searchLoading = computed(() => false); // Can be implemented for specific search scenarios

  const loadingEnrollments = computed(() => false); // Can be implemented for specific enrollment scenarios

  const isLoading = computed(
    () =>
      createSubjectMutation.isLoading.value ||
      updateSubjectMutation.isLoading.value ||
      deleteSubjectMutation.isLoading.value ||
      enrollStudentMutation.isLoading.value ||
      unenrollStudentMutation.isLoading.value
  );

  // ===== ACTION FUNCTIONS =====

  const setInstitutionId = (institutionId: string | null) => {
    currentInstitutionId.value = institutionId;
  };

  // Fetch all subjects (SuperAdmin only, paginated)
  const fetchSubjects = async (filters: SubjectFilters = {}) => {
    const query = subjectsQuery(ref(filters));
    await query.refetch();
    const data = query.data.value;
    if (data) {
      pagedSubjects.value = data;
      subjects.value = data.items;
    }
  };

  // Fetch subjects by institution (paginated)
  const fetchSubjectsByInstitution = async (
    institutionId: string,
    filters: SubjectFilters = {}
  ) => {
    const institutionFilters: InstitutionSubjectFilters = {
      ...filters,
      institutionId,
    };
    const query = institutionSubjectsQuery(ref(institutionFilters));
    await query.refetch();
    const data = query.data.value;
    if (data) {
      pagedSubjects.value = data;
      subjects.value = data.items;
    }
  };

  // Fetch all subjects without pagination (for dropdowns, calculations)
  const fetchSubjectsNonPaginated = async () => {
    const query = nonPaginatedSubjectsQuery();
    await query.refetch();
    const data = query.data.value;
    if (data) {
      subjects.value = data;
    }
  };

  // Fetch subjects by department
  const fetchSubjectsByDepartment = async (departmentId: string) => {
    const query = departmentSubjectsQuery(ref(departmentId));
    await query.refetch();
    const data = query.data.value;
    if (data) {
      subjects.value = data;
    }
  };

  const searchSubjects = async (filters: SubjectFilters = {}) => {
    searchQuery.value = filters.query || '';

    if (currentInstitutionId.value) {
      await fetchSubjectsByInstitution(currentInstitutionId.value, filters);
    } else {
      await fetchSubjects(filters);
    }
  };

  const getSubject = async (id: string) => {
    const query = subjectQuery(ref(id));
    await query.refetch();
    const subject = query.data.value;
    if (subject) {
      selectedSubject.value = subject;
    }
    return subject;
  };

  const createSubject = async (subject: SubjectForm) => {
    return await createSubjectMutation.mutateAsync(subject);
  };

  const updateSubject = async (id: string, subject: SubjectForm) => {
    return await updateSubjectMutation.mutateAsync({ id, data: subject });
  };

  const deleteSubject = async (id: string) => {
    await deleteSubjectMutation.mutateAsync(id);
  };

  const clearSearch = () => {
    searchQuery.value = '';
  };

  // ===== ELECTIVE MANAGEMENT =====

  const fetchElectiveEnrollments = async (subjectId: string) => {
    const query = electiveEnrollmentsQuery(ref(subjectId));
    await query.refetch();
    const enrollments = query.data.value || [];
    electiveEnrollments.value = enrollments;
    return enrollments;
  };

  const enrollStudentInElective = async (
    subjectId: string,
    studentId: string
  ) => {
    await enrollStudentMutation.mutateAsync({ subjectId, studentId });
  };

  const unenrollStudentFromElective = async (
    subjectId: string,
    studentId: string
  ) => {
    await unenrollStudentMutation.mutateAsync({ subjectId, studentId });
  };

  const getStudentElectives = async (studentId: string) => {
    const query = studentElectivesQuery(ref(studentId));
    await query.refetch();
    return query.data.value || [];
  };

  const getAvailableElectives = async (activeOnly: boolean = true) => {
    const query = availableElectivesQuery(ref(activeOnly));
    await query.refetch();
    return query.data.value || [];
  };

  // Watch for non-paginated query data changes to update local state
  const nonPaginatedQuery = nonPaginatedSubjectsQuery();
  watch(
    () => nonPaginatedQuery.data.value,
    (newSubjects) => {
      if (newSubjects && !pagedSubjects.value) {
        subjects.value = newSubjects;
      }
    },
    { immediate: true }
  );

  return {
    // State
    subjects: readonly(subjects),
    pagedSubjects: readonly(pagedSubjects),
    selectedSubject: readonly(selectedSubject),
    searchQuery: readonly(searchQuery),
    electiveEnrollments: readonly(electiveEnrollments),
    currentInstitutionId: readonly(currentInstitutionId),

    // Computed getters
    subjectOptions,
    mandatorySubjects,
    electiveSubjects,
    filteredSubjects,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,

    // Loading states
    loadingSubjects,
    searchLoading,
    loadingEnrollments,
    isLoading,

    // Actions
    setInstitutionId,
    fetchSubjects,
    fetchSubjectsByInstitution,
    fetchSubjectsNonPaginated,
    fetchSubjectsByDepartment,
    searchSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject,
    clearSearch,
    fetchElectiveEnrollments,
    enrollStudentInElective,
    unenrollStudentFromElective,
    getStudentElectives,
    getAvailableElectives,

    // Query factories for advanced usage
    subjectsQuery,
    institutionSubjectsQuery,
    nonPaginatedSubjectsQuery,
    departmentSubjectsQuery,
    subjectQuery,
    electiveEnrollmentsQuery,
    studentElectivesQuery,
    availableElectivesQuery,

    // Mutation loading states
    isCreatingSubject: computed(() => createSubjectMutation.isLoading.value),
    isUpdatingSubject: computed(() => updateSubjectMutation.isLoading.value),
    isDeletingSubject: computed(() => deleteSubjectMutation.isLoading.value),
    isEnrollingStudent: computed(() => enrollStudentMutation.isLoading.value),
    isUnenrollingStudent: computed(
      () => unenrollStudentMutation.isLoading.value
    ),
  };
});
