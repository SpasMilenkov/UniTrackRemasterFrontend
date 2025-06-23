// stores/student.ts
import { defineStore, storeToRefs } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import type { StudentResponseDto } from '~/interfaces/academic/student.dto';
import {
  studentFormSchema,
  type StudentFormSchema,
} from '~/schemas/student.schema';
import { useAcademicYearStore } from '~/stores/academic-year';
import type { SemesterType } from '~/interfaces/student/analytics/semester-type';
import type { StudentSearchParams, PaginatedStudentResponseDto, SemesterAnalyticsParams, SearchParams } from '~/interfaces/student';
import type { AcademicYearInsightDto } from '~/interfaces/student/analytics/academic-year-insight.dto';
import type { AttendancePerformanceInsightDto } from '~/interfaces/student/analytics/attendance-performance-insight.dto';
import type { CourseGradeDto } from '~/interfaces/student/analytics/course-grade.dto';
import type { SemesterSummaryDto } from '~/interfaces/student/analytics/semester-summary.dto';
import type { StudentGradeDashboardDto } from '~/interfaces/student/analytics/student-grade-dashboard.dto';
import type { TranscriptDto } from '~/interfaces/student/analytics/transcript.dto';

// Re-export types for convenience
export type Student = StudentResponseDto;
export type StudentForm = StudentFormSchema;

// Helper function to check UUID validity
const isValidUUID = (str: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Valid semester types
const VALID_SEMESTER_TYPES: SemesterType[] = [
  'Fall',
  'Spring',
  'Summer',
  'Winter',
  'Other',
];

// Helper function to safely get active academic year
const getActiveAcademicYearId = (): string | null => {
  try {
    if (!getCurrentInstance()) {
      return null;
    }

    const academicYearStore = useAcademicYearStore();
    const { activeAcademicYear } = storeToRefs(academicYearStore);
    return activeAcademicYear.value?.id || null;
  } catch (error) {
    console.warn('Could not access academic year store:', error);
    return null;
  }
};

export const useStudentStore = defineStore('student', () => {
  if (import.meta.server) {
    return {
      // State
      students: readonly(ref([])),
      selectedStudent: readonly(ref(null)),
      searchQuery: readonly(ref('')),
      gradeDashboard: readonly(ref(null)),
      transcript: readonly(ref(null)),
      attendanceInsight: readonly(ref(null)),
      currentSemester: readonly(ref(null)),
      selectedSemester: readonly(ref(null)),
      availableSemesters: readonly(ref([])),
      error: readonly(ref(null)),
      gradesError: readonly(ref(null)),
      transcriptError: readonly(ref(null)),
      attendanceInsightError: readonly(ref(null)),

      // Computed getters
      studentOptions: [],
      schoolStudents: [],
      universityStudents: [],
      filteredStudents: [],

      // Loading states
      loadingStudents: false,
      searchLoading: false,
      loadingGrades: false,
      loadingTranscript: false,
      loadingAttendanceInsight: false,
      isCreatingStudent: false,
      isUpdatingStudent: false,
      isDeletingStudent: false,
      isExportingGrades: false,
      isLoading: false,

      // Actions
      fetchStudents: async () => [],
      searchStudents: async () => [],
      fetchByUserId: async () => null,
      getStudent: async () => null,
      fetchStudentsByGrade: async () => [],
      fetchStudentsBySchool: async () => [],
      fetchStudentsByUniversity: async () => [],
      fetchStudentsWithPagination: async () => ({
        students: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }),
      createStudent: async () => null,
      updateStudent: async () => null,
      deleteStudent: async () => {},
      clearSearch: () => {},
      fetchStudentGradeDashboard: async () => null,
      fetchStudentTermGrades: async () => null,
      fetchStudentTranscript: async () => null,
      exportStudentGrades: async () => false,
      fetchStudentAttendanceInsight: async () => null,
      setSelectedSemester: () => {},
      getCurrentSemester: () => null,

      // Query factories
      studentsQuery: () => null,
      studentQuery: () => null,
      studentByUserQuery: () => null,
      studentsByGradeQuery: () => null,
      studentsBySchoolQuery: () => null,
      studentsByUniversityQuery: () => null,
      gradeDashboardQuery: () => null,
      termGradesQuery: () => null,
      transcriptQuery: () => null,
      attendanceInsightQuery: () => null,
      academicYearInsightQuery: () => null,

      // Constants
      VALID_SEMESTER_TYPES,
    };
  }

  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const students = ref<Student[]>([]);
  const selectedStudent = ref<Student | null>(null);
  const searchQuery = ref('');
  const gradeDashboard = ref<StudentGradeDashboardDto | null>(null);
  const transcript = ref<TranscriptDto | null>(null);
  const attendanceInsight = ref<AttendancePerformanceInsightDto | null>(null);
  const currentSemester = ref<SemesterSummaryDto | null>(null);
  const selectedSemester = ref<SemesterSummaryDto | null>(null);
  const availableSemesters = ref<SemesterSummaryDto[]>([]);
  const error = ref<string | null>(null);
  const gradesError = ref<string | null>(null);
  const transcriptError = ref<string | null>(null);
  const attendanceInsightError = ref<string | null>(null);

  // Students query with search parameters
  const studentsQuery = (params: MaybeRef<StudentSearchParams | null>) => {
    return useQuery({
      key: () => {
        const searchParams = unref(params);
        if (!searchParams) return ['students', 'all'];

        return [
          'students',
          'search',
          {
            query: searchParams.query || '',
            gradeId: searchParams.gradeId || '',
            schoolId: searchParams.schoolId || '',
            universityId: searchParams.universityId || '',
            isSchoolStudent: searchParams.isSchoolStudent,
            isUniversityStudent: searchParams.isUniversityStudent,
            pageNumber: searchParams.pageNumber || 1,
            pageSize: searchParams.pageSize || 20,
            sortBy: searchParams.sortBy || 'FirstName',
            ascending: searchParams.ascending ?? true,
          },
        ];
      },
      query: () => {
        const searchParams = unref(params) || {};
        const queryParams = new URLSearchParams();

        // Add filters to query params
        if (searchParams.query) queryParams.append('query', searchParams.query);
        if (searchParams.gradeId)
          queryParams.append('gradeId', searchParams.gradeId);
        if (searchParams.schoolId)
          queryParams.append('schoolId', searchParams.schoolId);
        if (searchParams.universityId)
          queryParams.append('universityId', searchParams.universityId);
        if (
          searchParams.isSchoolStudent !== null &&
          searchParams.isSchoolStudent !== undefined
        ) {
          queryParams.append(
            'isSchoolStudent',
            searchParams.isSchoolStudent.toString()
          );
        }
        if (
          searchParams.isUniversityStudent !== null &&
          searchParams.isUniversityStudent !== undefined
        ) {
          queryParams.append(
            'isUniversityStudent',
            searchParams.isUniversityStudent.toString()
          );
        }

        // Add pagination params
        queryParams.append(
          'pageNumber',
          (searchParams.pageNumber || 1).toString()
        );
        queryParams.append(
          'pageSize',
          (searchParams.pageSize || 20).toString()
        );
        queryParams.append('sortBy', searchParams.sortBy || 'FirstName');
        queryParams.append(
          'ascending',
          (searchParams.ascending ?? true).toString()
        );

        const queryString = queryParams.toString();
        const url = `/Students${queryString ? `?${queryString}` : ''}`;
        return $apiFetch<PaginatedStudentResponseDto>(url);
      },
      staleTime: 3 * 60 * 1000, // 3 minutes
    });
  };

  // Single student query
  const studentQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['students', 'single', unref(id) || ''],
      query: () => {
        const studentId = unref(id);
        if (!studentId) throw new Error('Student ID is required');
        return $apiFetch<Student>(`/Students/${studentId}`);
      },
      enabled: () => !!unref(id) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Student by user ID query
  const studentByUserQuery = (userId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['students', 'by-user', unref(userId) || ''],
      query: () => {
        const uId = unref(userId);
        if (!uId) throw new Error('User ID is required');
        return $apiFetch<Student>(`/Students/user/${uId}`);
      },
      enabled: () => !!unref(userId) && import.meta.client,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Students by grade query
  const studentsByGradeQuery = (gradeId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['students', 'by-grade', unref(gradeId) || ''],
      query: () => {
        const gId = unref(gradeId);
        if (!gId) throw new Error('Grade ID is required');
        return $apiFetch<Student[]>(`/Students/grade/${gId}`);
      },
      enabled: () => !!unref(gradeId) && import.meta.client,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Students by school query
  const studentsBySchoolQuery = (schoolId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['students', 'by-school', unref(schoolId) || ''],
      query: () => {
        const sId = unref(schoolId);
        if (!sId) throw new Error('School ID is required');
        return $apiFetch<Student[]>(`/Students/school/${sId}`);
      },
      enabled: () => !!unref(schoolId) && import.meta.client,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Students by university query
  const studentsByUniversityQuery = (universityId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['students', 'by-university', unref(universityId) || ''],
      query: () => {
        const uId = unref(universityId);
        if (!uId) throw new Error('University ID is required');
        return $apiFetch<Student[]>(`/Students/university/${uId}`);
      },
      enabled: () => !!unref(universityId) && import.meta.client,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Grade dashboard query with semester support
  const gradeDashboardQuery = (
    studentId: MaybeRef<string | null>,
    params: MaybeRef<SemesterAnalyticsParams | null> = ref(null)
  ) => {
    return useQuery({
      key: () => [
        'students',
        'grade-dashboard',
        unref(studentId) || '',
        unref(params)?.term || '',
        unref(params)?.academicYear || '',
        unref(params)?.semesterId || '',
      ],
      query: async () => {
        const sId = unref(studentId);
        if (!sId) throw new Error('Student ID is required');

        const queryParams = new URLSearchParams();
        const paramsValue = unref(params);

        if (paramsValue?.term) queryParams.append('term', paramsValue.term);
        if (paramsValue?.semesterId)
          queryParams.append('semesterId', paramsValue.semesterId);

        // Handle academic year logic
        if (
          paramsValue?.academicYear &&
          paramsValue.academicYear !== 'current' &&
          isValidUUID(paramsValue.academicYear)
        ) {
          queryParams.append('academicYear', paramsValue.academicYear);
        } else {
          const activeAcademicYearId = getActiveAcademicYearId();
          if (activeAcademicYearId) {
            queryParams.append('academicYear', activeAcademicYearId);
          }
        }

        const queryString = queryParams.toString();
        const url = `/Students/${sId}/grades/dashboard${queryString ? `?${queryString}` : ''}`;
        return $apiFetch<StudentGradeDashboardDto>(url);
      },
      enabled: () => !!unref(studentId) && import.meta.client,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Term grades query with semester support
  const termGradesQuery = (
    studentId: MaybeRef<string | null>,
    params: MaybeRef<SemesterAnalyticsParams | null> = ref(null)
  ) => {
    return useQuery({
      key: () => [
        'students',
        'term-grades',
        unref(studentId) || '',
        unref(params)?.term || '',
        unref(params)?.academicYear || '',
        unref(params)?.semesterId || '',
      ],
      query: async () => {
        const sId = unref(studentId);
        if (!sId) throw new Error('Student ID is required');

        const paramsValue = unref(params);

        // Backend requires both term and academicYear, so validate before making request
        if (
          !paramsValue?.term ||
          !VALID_SEMESTER_TYPES.includes(paramsValue.term)
        ) {
          throw new Error(
            `Valid term is required. Must be one of: ${VALID_SEMESTER_TYPES.join(', ')}`
          );
        }

        // Resolve academic year
        let resolvedAcademicYear = paramsValue.academicYear;
        if (!resolvedAcademicYear || resolvedAcademicYear === 'current') {
          const activeAcademicYearId = getActiveAcademicYearId();
          if (activeAcademicYearId) {
            resolvedAcademicYear = activeAcademicYearId;
          } else {
            throw new Error(
              'Academic year is required and no active academic year found'
            );
          }
        }

        const queryParams = new URLSearchParams();
        queryParams.append('term', paramsValue.term);
        queryParams.append('academicYear', resolvedAcademicYear);
        if (paramsValue.semesterId)
          queryParams.append('semesterId', paramsValue.semesterId);

        const queryString = queryParams.toString();
        const url = `/Students/${sId}/grades/term?${queryString}`;
        return $apiFetch<CourseGradeDto[]>(url);
      },
      enabled: () => {
        const studentIdValue = unref(studentId);
        const paramsValue = unref(params);

        return (
          !!studentIdValue &&
          !!paramsValue?.term &&
          VALID_SEMESTER_TYPES.includes(paramsValue.term) &&
          import.meta.client
        );
      },
      staleTime: 2 * 60 * 1000,
    });
  };

  // Transcript query
  const transcriptQuery = (studentId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['students', 'transcript', unref(studentId) || ''],
      query: () => {
        const sId = unref(studentId);
        if (!sId) throw new Error('Student ID is required');
        return $apiFetch<TranscriptDto>(`/Students/${sId}/grades/transcript`);
      },
      enabled: () => !!unref(studentId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Attendance insight query with semester support
  const attendanceInsightQuery = (
    studentId: MaybeRef<string | null>,
    params: MaybeRef<SemesterAnalyticsParams | null> = ref(null)
  ) => {
    return useQuery({
      key: () => [
        'students',
        'attendance-insight',
        unref(studentId) || '',
        unref(params)?.term || '',
        unref(params)?.academicYear || '',
        unref(params)?.semesterId || '',
      ],
      query: async () => {
        const sId = unref(studentId);
        if (!sId) throw new Error('Student ID is required');

        const queryParams = new URLSearchParams();
        const paramsValue = unref(params);

        if (paramsValue?.term) queryParams.append('term', paramsValue.term);
        if (paramsValue?.semesterId)
          queryParams.append('semesterId', paramsValue.semesterId);

        if (
          paramsValue?.academicYear &&
          paramsValue.academicYear !== 'current'
        ) {
          queryParams.append('academicYear', paramsValue.academicYear);
        } else {
          const activeAcademicYearId = getActiveAcademicYearId();
          if (activeAcademicYearId) {
            queryParams.append('academicYear', activeAcademicYearId);
          }
        }

        const queryString = queryParams.toString();
        const url = `/Students/${sId}/attendance/insight${queryString ? `?${queryString}` : ''}`;
        return $apiFetch<AttendancePerformanceInsightDto>(url);
      },
      enabled: () => !!unref(studentId) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Academic year insight query
  const academicYearInsightQuery = (
    studentId: MaybeRef<string | null>,
    academicYear: MaybeRef<string | null> = ref(null)
  ) => {
    return useQuery({
      key: () => [
        'students',
        'academic-year-insight',
        unref(studentId) || '',
        unref(academicYear) || '',
      ],
      query: async () => {
        const sId = unref(studentId);
        if (!sId) throw new Error('Student ID is required');

        const queryParams = new URLSearchParams();
        const academicYearValue = unref(academicYear);

        if (academicYearValue && academicYearValue !== 'current') {
          queryParams.append('academicYear', academicYearValue);
        } else {
          const activeAcademicYearId = getActiveAcademicYearId();
          if (activeAcademicYearId) {
            queryParams.append('academicYear', activeAcademicYearId);
          }
        }

        const queryString = queryParams.toString();
        const url = `/Students/${sId}/analytics/academic-year${queryString ? `?${queryString}` : ''}`;
        return $apiFetch<AcademicYearInsightDto>(url);
      },
      enabled: () => !!unref(studentId) && import.meta.client,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Create student mutation
  const createStudentMutation = useMutation({
    mutation: (studentData: StudentForm) => {
      const parsedData = studentFormSchema.parse(studentData);
      return $apiFetch<Student>('/Students', {
        method: 'POST',
        body: parsedData,
      });
    },
    onSuccess: (newStudent) => {
      students.value.push(newStudent);
      error.value = null;
    },
    onError: (err) => {
      console.error('Error creating student:', err);
      error.value = err.message || 'Failed to create student';
    },
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: StudentForm }) => {
      const parsedData = studentFormSchema.parse(data);
      return $apiFetch<Student>(`/Students/${id}`, {
        method: 'PUT',
        body: parsedData,
      });
    },
    onSuccess: (updatedStudent, { id }) => {
      const index = students.value.findIndex((s) => s.id === id);
      if (index !== -1) {
        students.value[index] = updatedStudent;
      }

      if (selectedStudent.value?.id === id) {
        selectedStudent.value = updatedStudent;
      }

      error.value = null;
    },
    onError: (err) => {
      console.error('Error updating student:', err);
      error.value = err.message || 'Failed to update student';
    },
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/Students/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) => {
      students.value = students.value.filter((s) => s.id !== id);

      if (selectedStudent.value?.id === id) {
        selectedStudent.value = null;
      }

      error.value = null;
    },
    onError: (err) => {
      console.error('Error deleting student:', err);
      error.value = err.message || 'Failed to delete student';
    },
  });

  // Export grades mutation with semester support
  const exportGradesMutation = useMutation({
    mutation: async ({
      studentId,
      format,
      params,
    }: {
      studentId: string;
      format: string;
      params?: SemesterAnalyticsParams;
    }) => {
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);

      if (params?.term) queryParams.append('term', params.term);
      if (params?.semesterId)
        queryParams.append('semesterId', params.semesterId);

      // Handle academic year logic
      if (params?.academicYear && params.academicYear !== 'current') {
        queryParams.append('academicYear', params.academicYear);
      } else {
        const activeAcademicYearId = getActiveAcademicYearId();
        if (activeAcademicYearId) {
          queryParams.append('academicYear', activeAcademicYearId);
        }
      }

      const queryString = queryParams.toString();
      const url = `/Students/${studentId}/grades/export${queryString ? `?${queryString}` : ''}`;

      return await $apiFetch(url, {
        method: 'GET',
        responseType: 'blob',
      });
    },
    onSuccess: (blob, { studentId, format }) => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `student-grades-${studentId}-${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    },
    onError: (err) => {
      console.error('Error exporting grades:', err);
      error.value = err.message || 'Failed to export grades';
    },
  });

  // Computed getters
  const studentOptions = computed(() => {
    return students.value.map((student) => ({
      label: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
      value: student.id,
    }));
  });

  const schoolStudents = computed(() => {
    return students.value.filter((student) => student.isSchoolStudent);
  });

  const universityStudents = computed(() => {
    return students.value.filter((student) => student.isUniversityStudent);
  });

  const filteredStudents = computed(() => {
    if (!searchQuery.value) return students.value;

    const query = searchQuery.value.toLowerCase();
    return students.value.filter(
      (student) =>
        (student.firstName &&
          student.firstName.toLowerCase().includes(query)) ||
        (student.lastName && student.lastName.toLowerCase().includes(query)) ||
        (student.email && student.email.toLowerCase().includes(query))
    );
  });

  // Action-like functions maintaining existing API
  const fetchStudents = async (params: SearchParams = {}) => {
    const searchParams: StudentSearchParams = {
      query: params.query,
      gradeId: params.gradeId,
      schoolId: params.schoolId,
      universityId: params.universityId,
      isSchoolStudent: params.isSchoolStudent,
      isUniversityStudent: params.isUniversityStudent,
      pageNumber: 1,
      pageSize: 1000,
      sortBy: 'FirstName',
      ascending: true,
    };

    const query = studentsQuery(ref(searchParams));
    await query.refetch();
    const data = query.data.value?.students || [];
    students.value = data;
    return data;
  };

  const fetchStudentsWithPagination = async (params: StudentSearchParams) => {
    const query = studentsQuery(ref(params));
    await query.refetch();
    const data = query.data.value;

    if (data) {
      students.value = data.students;
    }

    return (
      data || {
        students: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    );
  };

  const searchStudents = async (params: SearchParams = {}) => {
    searchQuery.value = params.query || '';

    try {
      await fetchStudents(params);
    } catch (error: any) {
      console.error('Error searching students:', error);
      if (students.value.length > 0 && params.query) {
        const query = params.query.toLowerCase();
        students.value = students.value.filter(
          (student) =>
            (student.firstName &&
              student.firstName.toLowerCase().includes(query)) ||
            (student.lastName &&
              student.lastName.toLowerCase().includes(query)) ||
            (student.email && student.email.toLowerCase().includes(query))
        );
      }
    }
  };

  const fetchByUserId = async (userId: string) => {
    const query = studentByUserQuery(ref(userId));
    await query.refetch();
    const student = query.data.value;

    if (student) {
      selectedStudent.value = student;
      error.value = null;
    } else {
      selectedStudent.value = null;
      error.value = 'Student not found';
    }

    return student;
  };

  const getStudent = async (id: string) => {
    const query = studentQuery(ref(id));
    await query.refetch();
    const student = query.data.value;

    if (student) {
      selectedStudent.value = student;
    }

    return student;
  };

  const fetchStudentsByGrade = async (gradeId: string) => {
    const query = studentsByGradeQuery(ref(gradeId));
    await query.refetch();
    const data = query.data.value || [];
    students.value = data;
    return data;
  };

  const fetchStudentsBySchool = async (schoolId: string) => {
    const query = studentsBySchoolQuery(ref(schoolId));
    await query.refetch();
    const data = query.data.value || [];
    students.value = data;
    return data;
  };

  const fetchStudentsByUniversity = async (universityId: string) => {
    const query = studentsByUniversityQuery(ref(universityId));
    await query.refetch();
    const data = query.data.value || [];
    students.value = data;
    return data;
  };

  const createStudent = async (studentData: StudentForm) => {
    return await createStudentMutation.mutateAsync(studentData);
  };

  const updateStudent = async (id: string, studentData: StudentForm) => {
    return await updateStudentMutation.mutateAsync({ id, data: studentData });
  };

  const deleteStudent = async (id: string) => {
    await deleteStudentMutation.mutateAsync(id);
  };

  const clearSearch = () => {
    searchQuery.value = '';
  };

  const fetchStudentGradeDashboard = async (
    studentId: string,
    params?: SemesterAnalyticsParams
  ) => {
    gradesError.value = null;

    const query = gradeDashboardQuery(ref(studentId), ref(params || null));
    await query.refetch();

    const dashboard = query.data.value;
    if (dashboard) {
      gradeDashboard.value = dashboard;
      // Update available semesters from dashboard
      if (dashboard.semesterBreakdown) {
        availableSemesters.value = dashboard.semesterBreakdown;
        // Set current semester if available
        if (dashboard.currentSemesterId) {
          currentSemester.value =
            dashboard.semesterBreakdown.find(
              (s) => s.semesterId === dashboard.currentSemesterId
            ) || null;
        }
      }
    }

    return dashboard;
  };

  const fetchStudentTermGrades = async (
    studentId: string,
    params: SemesterAnalyticsParams
  ) => {
    if (!params.term || !VALID_SEMESTER_TYPES.includes(params.term)) {
      gradesError.value = `Valid term is required. Must be one of: ${VALID_SEMESTER_TYPES.join(', ')}`;
      throw new Error(gradesError.value);
    }

    gradesError.value = null;

    // Resolve academic year if not provided
    const resolvedParams = { ...params };
    if (
      !resolvedParams.academicYear ||
      resolvedParams.academicYear === 'current'
    ) {
      const activeAcademicYearId = getActiveAcademicYearId();
      if (activeAcademicYearId) {
        resolvedParams.academicYear = activeAcademicYearId;
      } else {
        gradesError.value =
          'Academic year is required and no active academic year found';
        throw new Error(gradesError.value);
      }
    }

    const query = termGradesQuery(ref(studentId), ref(resolvedParams));
    await query.refetch();

    const courseGrades = query.data.value;
    if (courseGrades && gradeDashboard.value) {
      gradeDashboard.value.courses = courseGrades;
    }

    return courseGrades;
  };

  const fetchStudentTranscript = async (studentId: string) => {
    transcriptError.value = null;

    const query = transcriptQuery(ref(studentId));
    await query.refetch();

    const transcriptData = query.data.value;
    if (transcriptData) {
      transcript.value = transcriptData;
      // Update available semesters from transcript - convert Record to Array
      if (transcriptData.semesterSummaries) {
        availableSemesters.value = Object.values(
          transcriptData.semesterSummaries
        );
      }
    }

    return transcriptData;
  };

  const exportStudentGrades = async (
    studentId: string,
    format: string = 'pdf',
    params?: SemesterAnalyticsParams
  ) => {
    try {
      await exportGradesMutation.mutateAsync({
        studentId,
        format,
        params,
      });
      return true;
    } catch {
      return false;
    }
  };

  const fetchStudentAttendanceInsight = async (
    studentId: string,
    params?: SemesterAnalyticsParams
  ) => {
    attendanceInsightError.value = null;

    const query = attendanceInsightQuery(ref(studentId), ref(params || null));
    await query.refetch();

    const insightData = query.data.value;
    if (insightData) {
      attendanceInsight.value = insightData;
    }

    return insightData;
  };

  // Semester management functions
  const setSelectedSemester = (semester: SemesterSummaryDto | null) => {
    selectedSemester.value = semester;
  };

  const getCurrentSemester = () => {
    return currentSemester.value;
  };

  return {
    // State
    students: readonly(students),
    selectedStudent: readonly(selectedStudent),
    searchQuery: readonly(searchQuery),
    gradeDashboard: readonly(gradeDashboard),
    transcript: readonly(transcript),
    attendanceInsight: readonly(attendanceInsight),
    currentSemester: readonly(currentSemester),
    selectedSemester: readonly(selectedSemester),
    availableSemesters: readonly(availableSemesters),
    error: readonly(error),
    gradesError: readonly(gradesError),
    transcriptError: readonly(transcriptError),
    attendanceInsightError: readonly(attendanceInsightError),

    // Computed getters
    studentOptions,
    schoolStudents,
    universityStudents,
    filteredStudents,

    // Loading states
    loadingStudents: computed(() => false),
    searchLoading: computed(() => false),
    loadingGrades: computed(() => false),
    loadingTranscript: computed(() => false),
    loadingAttendanceInsight: computed(() => false),
    isCreatingStudent: computed(() => createStudentMutation.isLoading.value),
    isUpdatingStudent: computed(() => updateStudentMutation.isLoading.value),
    isDeletingStudent: computed(() => deleteStudentMutation.isLoading.value),
    isExportingGrades: computed(() => exportGradesMutation.isLoading.value),

    // Combined loading state
    isLoading: computed(
      () =>
        createStudentMutation.isLoading.value ||
        updateStudentMutation.isLoading.value ||
        deleteStudentMutation.isLoading.value ||
        exportGradesMutation.isLoading.value
    ),

    // Actions (maintaining existing API)
    fetchStudents,
    fetchStudentsWithPagination,
    searchStudents,
    fetchByUserId,
    getStudent,
    fetchStudentsByGrade,
    fetchStudentsBySchool,
    fetchStudentsByUniversity,
    createStudent,
    updateStudent,
    deleteStudent,
    clearSearch,
    fetchStudentGradeDashboard,
    fetchStudentTermGrades,
    fetchStudentTranscript,
    exportStudentGrades,
    fetchStudentAttendanceInsight,
    setSelectedSemester,
    getCurrentSemester,

    // Query factories for dynamic usage
    studentsQuery,
    studentQuery,
    studentByUserQuery,
    studentsByGradeQuery,
    studentsBySchoolQuery,
    studentsByUniversityQuery,
    gradeDashboardQuery,
    termGradesQuery,
    transcriptQuery,
    attendanceInsightQuery,
    academicYearInsightQuery,

    // Valid semester types constant for UI components
    VALID_SEMESTER_TYPES,
  };
});
