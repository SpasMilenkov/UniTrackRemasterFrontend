// stores/teacher.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import { z } from 'zod';// Semester Management DTOs// Academic Year DTO for semester queries// Grading System DTOs
import type { AbsenceResponseDto } from '~/interfaces/academic/absence.dto';
import type { AcademicYearResponseDto } from '~/interfaces/academic/academic-year.dto';
import type { MarkResponseDto } from '~/interfaces/academic/mark-response.dto';
import type { SemesterResponseDto } from '~/interfaces/academic/semester';
import type { SubjectResponseDto } from '~/interfaces/academic/subject.dto';
import type { StudentsByGradeDto } from '~/interfaces/event';
import type { TeacherResponseDto } from '~/interfaces/invitation';
import type { TeacherDashboardDto } from '~/interfaces/teacher/dashboard/teacher-dashboard.dto';
import type { AssignTeacherToGradesDto } from '~/interfaces/teacher/dtos/assign-teacher-to-grades.dto';
import type { CreateAbsenceDto } from '~/interfaces/teacher/dtos/create-absence.dto';
import type { CreateMarkDto } from '~/interfaces/teacher/dtos/create-mark.dto';
import type { TeacherGradeAssignmentResultDto } from '~/interfaces/teacher/dtos/teacher-grade-assignment-result.dto';
import type { TeacherGradeAssignmentSummaryDto } from '~/interfaces/teacher/dtos/teacher-grade-assignment-summary.dto';
import type { UnassignTeacherFromGradesDto } from '~/interfaces/teacher/dtos/unassign-teacher-from-grades.dto';
import type { UpdateAbsenceDto } from '~/interfaces/teacher/dtos/update-absence.dto';
import type { UpdateMarkDto } from '~/interfaces/teacher/dtos/update-mark.dto';
import type { UpdateTeacherGradeAssignmentsDto } from '~/interfaces/teacher/dtos/update-teacher-grade-assignments.dto';
import type { UpdateTeacherDto } from '~/interfaces/teacher/dtos/update-teacher.dto';
import type { AbsenceBreakdownFilterParams } from '~/interfaces/teacher/filters/absence-breakdown-filter-params';
import type { AtRiskStudentsFilterParams } from '~/interfaces/teacher/filters/at-risk-students-filter-params';
import type { AttendanceFilterParams } from '~/interfaces/teacher/filters/attendance-filter-params';
import type { StatisticsFilterParams } from '~/interfaces/teacher/filters/statistics-filter-params';
import type { TeacherSearchParams } from '~/interfaces/teacher/filters/teacher-search-params';
import type { AtRiskStudentsResponseDto } from '~/interfaces/teacher/responses/at-risk-students-response.dto';
import type { GradeAssignmentResponseDto } from '~/interfaces/teacher/responses/grade-assignment-response.dto';
import type { InstitutionGradingSystemDto } from '~/interfaces/teacher/responses/institution-grading-system.dto';
import type { TeacherWithGradeAssignmentsResponseDto } from '~/interfaces/teacher/responses/teacher-with-grade-assignments-response.dto';
import type { AttendanceOverviewDto } from '~/interfaces/teacher/stats/attendance-overview.dto';
import type { AttendanceStatisticsDto } from '~/interfaces/teacher/stats/attendance-statistics.dto';
import type { ExcusedUnexcusedBreakdownDto } from '~/interfaces/teacher/stats/excused-unexcused-breakdown.dto';
// Zod schema for form validation
export const teacherFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
  title: z.string().optional(),
  institutionId: z.string().uuid('Invalid institution ID'),
  classGradeId: z.string().uuid('Invalid class grade ID').optional().nullable(),
  departmentId: z.string().uuid('Invalid department ID').optional().nullable(),
  specialization: z.string().optional(),
  experience: z.number().optional().nullable(),
  certifications: z.string().optional(),
  academicLevel: z.string().optional().nullable(),
  researchAreas: z.string().optional(),
  qualification: z.string().optional().nullable(),
});

export type TeacherFormSchema = z.infer<typeof teacherFormSchema>;
// export type CreateAbsenceFormSchema = z.infer<typeof createAbsenceFormSchema>;

// Grade assignment validation schemas
export const assignTeacherToGradesSchema = z.object({
  gradeIds: z
    .array(z.string().uuid('Invalid grade ID'))
    .min(1, 'At least one grade must be selected'),
});

export const updateTeacherGradeAssignmentsSchema = z.object({
  gradeIds: z.array(z.string().uuid('Invalid grade ID')),
});

export const unassignTeacherFromGradesSchema = z.object({
  gradeIds: z
    .array(z.string().uuid('Invalid grade ID'))
    .min(1, 'At least one grade must be selected'),
});

export const useTeacherStore = defineStore('teacher', () => {
  // CRITICAL: SSR Guard - prevent execution on server
  if (import.meta.server) {
    return {
      // Stub implementation for SSR
      teachers: readonly(ref([])),
      selectedTeacher: readonly(ref(null)),
      dashboardData: readonly(ref(null)),
      absences: readonly(ref([])),
      attendanceOverview: readonly(ref(null)),
      excusedUnexcusedBreakdown: readonly(ref(null)),
      atRiskStudents: readonly(ref(null)),
      attendanceStatistics: readonly(ref(null)),
      gradeAssignments: readonly(ref([])),
      teacherWithGradeAssignments: readonly(ref(null)),
      gradeAssignmentSummary: readonly(ref(null)),
      semesters: readonly(ref([])),
      currentSemester: readonly(ref(null)),
      institutionGradingSystem: readonly(ref(null)),
      teacherOptions: computed(() => []),
      fullName: computed(() => ''),
      teacherSubjects: computed(() => []),
      recentMarks: computed(() => []),
      recentAbsences: computed(() => []),
      dashboardStats: computed(() => ({
        totalStudents: 0,
        totalSubjects: 0,
        totalMarksGiven: 0,
        totalAbsencesRecorded: 0,
      })),
      averageMarksBySubject: computed(() => ({})),
      studentsByGrade: computed(() => []),
      subjectOptions: computed(() => []),
      gradeOptions: computed(() => []),
      semesterOptions: computed(() => []),
      gradeScaleOptions: computed(() => []),
      isLoading: computed(() => false),
      loadingTeachers: computed(() => false),
      searchLoading: computed(() => false),
      loadingDashboard: computed(() => false),
      loadingAbsences: computed(() => false),
      loadingAttendanceOverview: computed(() => false),
      loadingExcusedUnexcused: computed(() => false),
      loadingAtRiskStudents: computed(() => false),
      loadingAttendanceStatistics: computed(() => false),
      loadingGradeAssignments: computed(() => false),
      loadingSemesters: computed(() => false),
      loadingGradingSystem: computed(() => false),
      // Stub methods
      fetchTeachers: async () => [],
      searchTeachers: async () => [],
      getTeacher: async () => null,
      createTeacher: async () => null,
      updateTeacher: async () => null,
      deleteTeacher: async () => {},
      fetchTeachersByInstitution: async () => [],
      selectTeacher: () => {},
      fetchDashboard: async () => null,
      createMark: async () => null,
      updateMark: async () => null,
      deleteMark: async () => {},
      createAbsence: async () => null,
      updateAbsence: async () => null,
      deleteAbsence: async () => {},
      fetchAttendanceOverview: async () => null,
      fetchExcusedUnexcusedBreakdown: async () => null,
      fetchAtRiskStudents: async () => null,
      fetchAttendanceStatistics: async () => null,
      fetchSemesters: async () => [],
      fetchCurrentSemester: async () => null,
      setCurrentSemester: () => {},
      fetchInstitutionGradingSystem: async () => null,
      convertGradeToScore: async () => null,
      convertScoreToGrade: async () => null,
      assignTeacherToGrades: async () => null,
      unassignTeacherFromGrades: async () => null,
      updateTeacherGradeAssignments: async () => null,
      getTeacherWithGradeAssignments: async () => null,
      getTeacherAssignedGrades: async () => null,
      getTeacherGradeAssignmentSummary: async () => null,
      // Stub queries
      teachersQuery: null,
      teachersByInstitutionQuery: () => null,
      teacherQuery: () => null,
      teacherByUserIdQuery: () => null,
      teacherDashboardQuery: () => null,
      teacherSubjectsQuery: () => null,
      studentsBySubjectQuery: () => null,
      teacherMarksQuery: () => null,
      markQuery: () => null,
      studentMarksQuery: () => null,
      teacherAbsencesQuery: () => null,
      absenceQuery: () => null,
      studentAbsencesQuery: () => null,
      subjectAbsencesQuery: () => null,
      attendanceOverviewQuery: () => null,
      excusedUnexcusedBreakdownQuery: () => null,
      atRiskStudentsQuery: () => null,
      attendanceStatisticsQuery: () => null,
      teacherWithGradeAssignmentsQuery: () => null,
      teacherAssignedGradesQuery: () => null,
      teacherGradeAssignmentSummaryQuery: () => null,
      semestersQuery: () => null,
      currentSemesterQuery: () => null,
      institutionGradingSystemQuery: () => null,
      // Stub mutations
      createTeacherMutation: null,
      updateTeacherMutation: null,
      deleteTeacherMutation: null,
      createMarkMutation: null,
      updateMarkMutation: null,
      deleteMarkMutation: null,
      createAbsenceMutation: null,
      updateAbsenceMutation: null,
      deleteAbsenceMutation: null,
      assignTeacherToGradesMutation: null,
      unassignTeacherFromGradesMutation: null,
      updateTeacherGradeAssignmentsMutation: null,
    };
  }

  // CLIENT-ONLY implementation
  const { $apiFetch } = useNuxtApp();

  // State
  const teachers = ref<TeacherResponseDto[]>([]);
  const selectedTeacher = ref<TeacherResponseDto | null>(null);
  const dashboardData = ref<TeacherDashboardDto | null>(null);
  const absences = ref<AbsenceResponseDto[]>([]);
  const attendanceOverview = ref<AttendanceOverviewDto | null>(null);
  const excusedUnexcusedBreakdown = ref<ExcusedUnexcusedBreakdownDto | null>(
    null
  );
  const atRiskStudents = ref<AtRiskStudentsResponseDto | null>(null);
  const attendanceStatistics = ref<AttendanceStatisticsDto | null>(null);

  // Grade assignment state
  const gradeAssignments = ref<GradeAssignmentResponseDto[]>([]);
  const teacherWithGradeAssignments =
    ref<TeacherWithGradeAssignmentsResponseDto | null>(null);
  const gradeAssignmentSummary = ref<TeacherGradeAssignmentSummaryDto | null>(
    null
  );

  // Semester and grading system state
  const semesters = ref<SemesterResponseDto[]>([]);
  const currentSemester = ref<SemesterResponseDto | null>(null);
  const institutionGradingSystem = ref<InstitutionGradingSystemDto | null>(
    null
  );

  // Search loading state
  const searchLoading = ref(false);

  // Helper function to build query params with semester support
  const buildQueryParams = (params: Record<string, any>) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    return queryParams.toString();
  };

  // ===== SEMESTER QUERIES =====

  // First get current academic year for institution
  const currentAcademicYearQuery = (institutionId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => [
        'academic-years',
        'current-for-semesters',
        unref(institutionId) || '',
      ],
      query: () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');
        return $apiFetch<AcademicYearResponseDto>(
          `/institutions/${instId}/academic-years/current`
        );
      },
      enabled: () => !!unref(institutionId) && import.meta.client,
      staleTime: 15 * 60 * 1000,
    });
  };

  // Then get semesters for that academic year
  const semestersQuery = (institutionId: MaybeRef<string | null>) => {
    const currentAcademicYear = currentAcademicYearQuery(institutionId);

    return useQuery({
      key: () => [
        'semesters',
        'by-institution',
        unref(institutionId) || '',
        currentAcademicYear.data.value?.id || '',
      ],
      query: async () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');

        // Wait for academic year data to be available
        if (!currentAcademicYear.data.value?.id) {
          return [];
        }

        // Get semesters for the current academic year
        return $apiFetch<SemesterResponseDto[]>(
          `/academic-years/${currentAcademicYear.data.value.id}/semesters/all`
        );
      },
      enabled: () =>
        !!unref(institutionId) &&
        import.meta.client &&
        !!currentAcademicYear.data.value?.id,
      staleTime: 15 * 60 * 1000,
    });
  };

  // Get current semester for academic year
  const currentSemesterQuery = (institutionId: MaybeRef<string | null>) => {
    const currentAcademicYear = currentAcademicYearQuery(institutionId);

    return useQuery({
      key: () => [
        'semesters',
        'current-by-institution',
        unref(institutionId) || '',
        currentAcademicYear.data.value?.id || '',
      ],
      query: async () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');

        // Wait for academic year data to be available
        if (!currentAcademicYear.data.value?.id) {
          throw new Error('No current academic year found');
        }

        // Get current semester for the current academic year
        return $apiFetch<SemesterResponseDto>(
          `/academic-years/${currentAcademicYear.data.value.id}/semesters/current`
        );
      },
      enabled: () =>
        !!unref(institutionId) &&
        import.meta.client &&
        !!currentAcademicYear.data.value?.id,
      staleTime: 15 * 60 * 1000,
    });
  };

  const institutionGradingSystemQuery = (
    institutionId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => ['grading-system', 'institution', unref(institutionId) || ''],
      query: () => {
        const instId = unref(institutionId);
        if (!instId) throw new Error('Institution ID is required');
        return $apiFetch<InstitutionGradingSystemDto>(
          `/GradingSystems/institution/${instId}/default`
        );
      },
      enabled: () => !!unref(institutionId) && import.meta.client,
      staleTime: 30 * 60 * 1000, // 30 minutes - grading system rarely changes
    });
  };

  // ===== EXISTING QUERIES (ENHANCED with semester support) =====

  // All teachers query
  const teachersQuery = useQuery({
    key: () => ['teachers', 'all'],
    query: () => $apiFetch<TeacherResponseDto[]>('/Teachers'),
    enabled: () => import.meta.client,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Teachers by institution query
  const teachersByInstitutionQuery = (
    institutionId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => ['teachers', 'institution', unref(institutionId) || ''],
      query: () =>
        $apiFetch<TeacherResponseDto[]>(
          `/Teachers/institution/${unref(institutionId)}`
        ),
      enabled: () => !!unref(institutionId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Single teacher query
  const teacherQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['teachers', 'single', unref(id) || ''],
      query: () => $apiFetch<TeacherResponseDto>(`/Teachers/${unref(id)}`),
      enabled: () => !!unref(id) && import.meta.client,
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // Teacher by user ID query
  const teacherByUserIdQuery = (userId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['teachers', 'user', unref(userId) || ''],
      query: () =>
        $apiFetch<TeacherResponseDto>(`/Teachers/user/${unref(userId)}`),
      enabled: () => !!unref(userId) && import.meta.client,
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // ENHANCED: Teacher dashboard query with semester support
  const teacherDashboardQuery = (
    teacherId: MaybeRef<string | null>,
    semesterId: MaybeRef<string | null> = ref(null)
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'dashboard',
        unref(teacherId) || '',
        unref(semesterId) || 'current',
      ],
      query: () => {
        const teacher = unref(teacherId);
        const semester = unref(semesterId);
        if (!teacher) return Promise.resolve(null);

        const queryString = semester ? `?semesterId=${semester}` : '';
        return $apiFetch<TeacherDashboardDto>(
          `/Teachers/${teacher}/dashboard${queryString}`
        );
      },
      enabled: () => !!unref(teacherId) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes - dashboard data changes frequently
    });
  };

  // Teacher subjects query
  const teacherSubjectsQuery = (teacherId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['teachers', 'subjects', unref(teacherId) || ''],
      query: () =>
        $apiFetch<SubjectResponseDto[]>(
          `/Teachers/${unref(teacherId)}/subjects`
        ),
      enabled: () => !!unref(teacherId) && import.meta.client,
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // Students by subject query
  const studentsBySubjectQuery = (
    teacherId: MaybeRef<string | null>,
    subjectId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'students-by-subject',
        unref(teacherId) || '',
        unref(subjectId) || '',
      ],
      query: () =>
        $apiFetch<StudentsByGradeDto[]>(
          `/Teachers/${unref(teacherId)}/subjects/${unref(subjectId)}/students`
        ),
      enabled: () =>
        !!unref(teacherId) && !!unref(subjectId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // ENHANCED: Teacher marks query with semester support
  const teacherMarksQuery = (
    teacherId: MaybeRef<string | null>,
    filters: MaybeRef<MarkFilterParams> = ref({})
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'marks',
        unref(teacherId) || '',
        JSON.stringify(unref(filters)),
      ],
      query: () => {
        const teacher = unref(teacherId);
        const filterParams = unref(filters);
        if (!teacher) return Promise.resolve([]);

        const queryString = buildQueryParams(filterParams);
        const url = `/Teachers/${teacher}/marks${
          queryString ? '?' + queryString : ''
        }`;

        return $apiFetch<MarkResponseDto[]>(url);
      },
      enabled: () => !!unref(teacherId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Individual mark query
  const markQuery = (
    teacherId: MaybeRef<string | null>,
    markId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'mark-single',
        unref(teacherId) || '',
        unref(markId) || '',
      ],
      query: () =>
        $apiFetch<MarkResponseDto>(
          `/Teachers/${unref(teacherId)}/marks/${unref(markId)}`
        ),
      enabled: () =>
        !!unref(teacherId) && !!unref(markId) && import.meta.client,
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // ENHANCED: Student marks query with semester support
  const studentMarksQuery = (
    teacherId: MaybeRef<string | null>,
    subjectId: MaybeRef<string | null>,
    studentId: MaybeRef<string | null>,
    semesterId: MaybeRef<string | null> = ref(null)
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'student-marks',
        unref(teacherId) || '',
        unref(subjectId) || '',
        unref(studentId) || '',
        unref(semesterId) || 'current',
      ],
      query: () => {
        const teacher = unref(teacherId);
        const subject = unref(subjectId);
        const student = unref(studentId);
        const semester = unref(semesterId);

        if (!teacher || !subject || !student) return Promise.resolve([]);

        const queryString = semester ? `?semesterId=${semester}` : '';
        return $apiFetch<MarkResponseDto[]>(
          `/Teachers/${teacher}/subjects/${subject}/students/${student}/marks${queryString}`
        );
      },
      enabled: () =>
        !!unref(teacherId) &&
        !!unref(subjectId) &&
        !!unref(studentId) &&
        import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // ENHANCED: Teacher absences query with semester support
  const teacherAbsencesQuery = (
    teacherId: MaybeRef<string | null>,
    filters: MaybeRef<Partial<AttendanceFilterParams>> = ref({})
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'absences',
        unref(teacherId) || '',
        JSON.stringify(unref(filters)),
      ],
      query: () => {
        const teacher = unref(teacherId);
        const filterParams = unref(filters);
        if (!teacher) return Promise.resolve([]);

        const queryString = buildQueryParams(filterParams);
        const url = `/Teachers/${teacher}/absences${
          queryString ? '?' + queryString : ''
        }`;

        return $apiFetch<AbsenceResponseDto[]>(url);
      },
      enabled: () => !!unref(teacherId) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes - absences change frequently
    });
  };

  // Individual absence query
  const absenceQuery = (
    teacherId: MaybeRef<string | null>,
    absenceId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'absence-single',
        unref(teacherId) || '',
        unref(absenceId) || '',
      ],
      query: () =>
        $apiFetch<AbsenceResponseDto>(
          `/Teachers/${unref(teacherId)}/absences/${unref(absenceId)}`
        ),
      enabled: () =>
        !!unref(teacherId) && !!unref(absenceId) && import.meta.client,
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // ENHANCED: Student absences query with semester support
  const studentAbsencesQuery = (
    teacherId: MaybeRef<string | null>,
    subjectId: MaybeRef<string | null>,
    studentId: MaybeRef<string | null>,
    semesterId: MaybeRef<string | null> = ref(null)
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'student-absences',
        unref(teacherId) || '',
        unref(subjectId) || '',
        unref(studentId) || '',
        unref(semesterId) || 'current',
      ],
      query: () => {
        const teacher = unref(teacherId);
        const subject = unref(subjectId);
        const student = unref(studentId);
        const semester = unref(semesterId);

        if (!teacher || !subject || !student) return Promise.resolve([]);

        const queryString = semester ? `?semesterId=${semester}` : '';
        return $apiFetch<AbsenceResponseDto[]>(
          `/Teachers/${teacher}/subjects/${subject}/students/${student}/absences${queryString}`
        );
      },
      enabled: () =>
        !!unref(teacherId) &&
        !!unref(subjectId) &&
        !!unref(studentId) &&
        import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // ENHANCED: Subject absences query with semester support
  const subjectAbsencesQuery = (
    teacherId: MaybeRef<string | null>,
    subjectId: MaybeRef<string | null>,
    semesterId: MaybeRef<string | null> = ref(null)
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'subject-absences',
        unref(teacherId) || '',
        unref(subjectId) || '',
        unref(semesterId) || 'current',
      ],
      query: () => {
        const teacher = unref(teacherId);
        const subject = unref(subjectId);
        const semester = unref(semesterId);

        if (!teacher || !subject) return Promise.resolve([]);

        const queryString = semester ? `?semesterId=${semester}` : '';
        return $apiFetch<AbsenceResponseDto[]>(
          `/Teachers/${teacher}/subjects/${subject}/absences${queryString}`
        );
      },
      enabled: () =>
        !!unref(teacherId) && !!unref(subjectId) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // ENHANCED: Attendance overview query with semester support
  const attendanceOverviewQuery = (
    teacherId: MaybeRef<string | null>,
    params: MaybeRef<AttendanceFilterParams>
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'attendance-overview',
        unref(teacherId) || '',
        JSON.stringify(unref(params)),
      ],
      query: () => {
        const teacher = unref(teacherId);
        const filters = unref(params);

        if (!teacher) return Promise.resolve(null);

        const queryString = buildQueryParams(filters);
        const url = `/Teachers/${teacher}/attendance-overview${
          queryString ? '?' + queryString : ''
        }`;

        return $apiFetch<AttendanceOverviewDto>(url);
      },
      enabled: () => !!unref(teacherId) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // ENHANCED: Excused/Unexcused breakdown query with semester support
  const excusedUnexcusedBreakdownQuery = (
    teacherId: MaybeRef<string | null>,
    params: MaybeRef<AbsenceBreakdownFilterParams>
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'excused-unexcused-breakdown',
        unref(teacherId) || '',
        JSON.stringify(unref(params)),
      ],
      query: () => {
        const teacher = unref(teacherId);
        const filters = unref(params);

        if (!teacher) return Promise.resolve(null);

        const queryString = buildQueryParams(filters);
        const url = `/Teachers/${teacher}/excused-unexcused-breakdown${
          queryString ? '?' + queryString : ''
        }`;

        return $apiFetch<ExcusedUnexcusedBreakdownDto>(url);
      },
      enabled: () => !!unref(teacherId) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // ENHANCED: At-risk students query with semester support
  const atRiskStudentsQuery = (
    teacherId: MaybeRef<string | null>,
    params: MaybeRef<AtRiskStudentsFilterParams>
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'at-risk-students',
        unref(teacherId) || '',
        JSON.stringify(unref(params)),
      ],
      query: () => {
        const teacher = unref(teacherId);
        const filters = unref(params);

        if (!teacher) return Promise.resolve(null);

        const queryString = buildQueryParams(filters);
        const url = `/Teachers/${teacher}/at-risk-students${
          queryString ? '?' + queryString : ''
        }`;

        return $apiFetch<AtRiskStudentsResponseDto>(url);
      },
      enabled: () => !!unref(teacherId) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // ENHANCED: Attendance statistics query with semester support
  const attendanceStatisticsQuery = (
    teacherId: MaybeRef<string | null>,
    params: MaybeRef<StatisticsFilterParams>
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'attendance-statistics',
        unref(teacherId) || '',
        JSON.stringify(unref(params)),
      ],
      query: () => {
        const teacher = unref(teacherId);
        const filters = unref(params);

        if (!teacher) return Promise.resolve(null);

        const queryString = buildQueryParams(filters);
        const url = `/Teachers/${teacher}/attendance-statistics${
          queryString ? '?' + queryString : ''
        }`;

        return $apiFetch<AttendanceStatisticsDto>(url);
      },
      enabled: () => !!unref(teacherId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes - statistics change less frequently
    });
  };

  // ===== GRADE ASSIGNMENT QUERIES (unchanged) =====

  // Teacher with grade assignments query (detailed)
  const teacherWithGradeAssignmentsQuery = (
    teacherId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'grade-assignments-detailed',
        unref(teacherId) || '',
      ],
      query: () =>
        $apiFetch<TeacherWithGradeAssignmentsResponseDto>(
          `/Teachers/${unref(teacherId)}/grade-assignments/detailed`
        ),
      enabled: () => !!unref(teacherId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Teacher assigned grades query
  const teacherAssignedGradesQuery = (teacherId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['teachers', 'assigned-grades', unref(teacherId) || ''],
      query: () =>
        $apiFetch<GradeAssignmentResponseDto[]>(
          `/Teachers/${unref(teacherId)}/grade-assignments`
        ),
      enabled: () => !!unref(teacherId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Teacher grade assignment summary query
  const teacherGradeAssignmentSummaryQuery = (
    teacherId: MaybeRef<string | null>
  ) => {
    return useQuery({
      key: () => [
        'teachers',
        'grade-assignment-summary',
        unref(teacherId) || '',
      ],
      query: () =>
        $apiFetch<TeacherGradeAssignmentSummaryDto>(
          `/Teachers/${unref(teacherId)}/grade-assignments/summary`
        ),
      enabled: () => !!unref(teacherId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // ===== MUTATIONS =====

  // Create teacher mutation
  const createTeacherMutation = useMutation({
    mutation: (teacherData: TeacherFormSchema) => {
      const parsedData = teacherFormSchema.parse(teacherData);
      return $apiFetch<TeacherResponseDto>('/Teachers', {
        method: 'POST',
        body: parsedData,
      });
    },
    onSuccess: (newTeacher) => {
      teachers.value.push(newTeacher);
      teachersQuery.refetch();
    },
    onError: (error) => {
      console.error('Error creating teacher:', error);
    },
  });

  // Update teacher mutation
  const updateTeacherMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: UpdateTeacherDto }) =>
      $apiFetch<TeacherResponseDto>(`/Teachers/${id}`, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: (updatedTeacher, { id }) => {
      const index = teachers.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        teachers.value[index] = updatedTeacher;
      }

      if (selectedTeacher.value?.id === id) {
        selectedTeacher.value = updatedTeacher;
      }

      teachersQuery.refetch();
    },
    onError: (error) => {
      console.error('Error updating teacher:', error);
    },
  });

  // Delete teacher mutation
  const deleteTeacherMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/Teachers/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      teachers.value = teachers.value.filter((t) => t.id !== id);

      if (selectedTeacher.value?.id === id) {
        selectedTeacher.value = null;
      }

      teachersQuery.refetch();
    },
    onError: (error) => {
      console.error('Error deleting teacher:', error);
    },
  });

  // ENHANCED: Create mark mutation with grading system support
  const createMarkMutation = useMutation({
    mutation: ({
      teacherId,
      data,
    }: {
      teacherId: string;
      data: CreateMarkDto;
    }) => {
      // If semesterId is not provided, use current semester
      const submissionData = {
        ...data,
        semesterId: data.semesterId || currentSemester.value?.id,
      };

      return $apiFetch<MarkResponseDto>(`/Teachers/${teacherId}/marks`, {
        method: 'POST',
        body: submissionData,
      });
    },
    onSuccess: (_, { teacherId }) => {
      // Refetch multiple related queries
      const dashboardQuery = teacherDashboardQuery(
        ref(teacherId),
        ref(currentSemester.value?.id)
      );
      dashboardQuery.refetch();
    },
    onError: (error) => {
      console.error('Error creating mark:', error);
    },
  });

  // ENHANCED: Update mark mutation
  const updateMarkMutation = useMutation({
    mutation: ({
      teacherId,
      markId,
      data,
    }: {
      teacherId: string;
      markId: string;
      data: UpdateMarkDto;
    }) =>
      $apiFetch<MarkResponseDto>(`/Teachers/${teacherId}/marks/${markId}`, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: (_, { teacherId }) => {
      const dashboardQuery = teacherDashboardQuery(
        ref(teacherId),
        ref(currentSemester.value?.id)
      );
      dashboardQuery.refetch();
    },
    onError: (error) => {
      console.error('Error updating mark:', error);
    },
  });

  // Delete mark mutation
  const deleteMarkMutation = useMutation({
    mutation: ({ teacherId, markId }: { teacherId: string; markId: string }) =>
      $apiFetch(`/Teachers/${teacherId}/marks/${markId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, { teacherId }) => {
      const dashboardQuery = teacherDashboardQuery(
        ref(teacherId),
        ref(currentSemester.value?.id)
      );
      dashboardQuery.refetch();
    },
    onError: (error) => {
      console.error('Error deleting mark:', error);
    },
  });

  // ENHANCED: Create absence mutation with semester support
  const createAbsenceMutation = useMutation({
    mutation: ({
      teacherId,
      data,
    }: {
      teacherId: string;
      data: CreateAbsenceDto;
    }) => {
      // If semesterId is not provided, use current semester
      const submissionData = {
        ...data,
        semesterId: data.semesterId || currentSemester.value?.id,
      };

      return $apiFetch<AbsenceResponseDto>(`/Teachers/${teacherId}/absences`, {
        method: 'POST',
        body: submissionData,
      });
    },
    onSuccess: (newAbsence, { teacherId }) => {
      absences.value.push(newAbsence);

      const dashboardQuery = teacherDashboardQuery(
        ref(teacherId),
        ref(currentSemester.value?.id)
      );
      dashboardQuery.refetch();
    },
    onError: (error) => {
      console.error('Error creating absence:', error);
    },
  });

  // Update absence mutation
  const updateAbsenceMutation = useMutation({
    mutation: ({
      teacherId,
      absenceId,
      data,
    }: {
      teacherId: string;
      absenceId: string;
      data: UpdateAbsenceDto;
    }) =>
      $apiFetch<AbsenceResponseDto>(
        `/Teachers/${teacherId}/absences/${absenceId}`,
        {
          method: 'PUT',
          body: data,
        }
      ),
    onSuccess: (updatedAbsence, { teacherId, absenceId }) => {
      const index = absences.value.findIndex((a) => a.id === absenceId);
      if (index !== -1) {
        absences.value[index] = updatedAbsence;
      }

      const dashboardQuery = teacherDashboardQuery(
        ref(teacherId),
        ref(currentSemester.value?.id)
      );
      dashboardQuery.refetch();
    },
    onError: (error) => {
      console.error('Error updating absence:', error);
    },
  });

  // Delete absence mutation
  const deleteAbsenceMutation = useMutation({
    mutation: ({
      teacherId,
      absenceId,
    }: {
      teacherId: string;
      absenceId: string;
    }) =>
      $apiFetch(`/Teachers/${teacherId}/absences/${absenceId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, { teacherId, absenceId }) => {
      absences.value = absences.value.filter((a) => a.id !== absenceId);

      const dashboardQuery = teacherDashboardQuery(
        ref(teacherId),
        ref(currentSemester.value?.id)
      );
      dashboardQuery.refetch();
    },
    onError: (error) => {
      console.error('Error deleting absence:', error);
    },
  });

  // ===== GRADE ASSIGNMENT MUTATIONS (unchanged) =====

  // Assign teacher to grades mutation
  const assignTeacherToGradesMutation = useMutation({
    mutation: ({
      teacherId,
      data,
    }: {
      teacherId: string;
      data: AssignTeacherToGradesDto;
    }) => {
      const parsedData = assignTeacherToGradesSchema.parse(data);
      return $apiFetch<TeacherGradeAssignmentResultDto>(
        `/Teachers/${teacherId}/grade-assignments`,
        {
          method: 'POST',
          body: parsedData,
        }
      );
    },
    onSuccess: (_, { teacherId }) => {
      // Refetch related queries
      const assignedGradesQuery = teacherAssignedGradesQuery(ref(teacherId));
      const detailedQuery = teacherWithGradeAssignmentsQuery(ref(teacherId));
      const summaryQuery = teacherGradeAssignmentSummaryQuery(ref(teacherId));
      const dashboardQuery = teacherDashboardQuery(
        ref(teacherId),
        ref(currentSemester.value?.id)
      );

      assignedGradesQuery.refetch();
      detailedQuery.refetch();
      summaryQuery.refetch();
      dashboardQuery.refetch();
    },
    onError: (error) => {
      console.error('Error assigning teacher to grades:', error);
    },
  });

  // Unassign teacher from grades mutation
  const unassignTeacherFromGradesMutation = useMutation({
    mutation: ({
      teacherId,
      data,
    }: {
      teacherId: string;
      data: UnassignTeacherFromGradesDto;
    }) => {
      const parsedData = unassignTeacherFromGradesSchema.parse(data);
      return $apiFetch<TeacherGradeAssignmentResultDto>(
        `/Teachers/${teacherId}/grade-assignments`,
        {
          method: 'DELETE',
          body: parsedData,
        }
      );
    },
    onSuccess: (_, { teacherId }) => {
      // Refetch related queries
      const assignedGradesQuery = teacherAssignedGradesQuery(ref(teacherId));
      const detailedQuery = teacherWithGradeAssignmentsQuery(ref(teacherId));
      const summaryQuery = teacherGradeAssignmentSummaryQuery(ref(teacherId));
      const dashboardQuery = teacherDashboardQuery(
        ref(teacherId),
        ref(currentSemester.value?.id)
      );

      assignedGradesQuery.refetch();
      detailedQuery.refetch();
      summaryQuery.refetch();
      dashboardQuery.refetch();
    },
    onError: (error) => {
      console.error('Error unassigning teacher from grades:', error);
    },
  });

  // Update teacher grade assignments mutation
  const updateTeacherGradeAssignmentsMutation = useMutation({
    mutation: ({
      teacherId,
      data,
    }: {
      teacherId: string;
      data: UpdateTeacherGradeAssignmentsDto;
    }) => {
      const parsedData = updateTeacherGradeAssignmentsSchema.parse(data);
      return $apiFetch<TeacherGradeAssignmentResultDto>(
        `/Teachers/${teacherId}/grade-assignments`,
        {
          method: 'PUT',
          body: parsedData,
        }
      );
    },
    onSuccess: (_, { teacherId }) => {
      // Refetch related queries
      const assignedGradesQuery = teacherAssignedGradesQuery(ref(teacherId));
      const detailedQuery = teacherWithGradeAssignmentsQuery(ref(teacherId));
      const summaryQuery = teacherGradeAssignmentSummaryQuery(ref(teacherId));
      const dashboardQuery = teacherDashboardQuery(
        ref(teacherId),
        ref(currentSemester.value?.id)
      );

      assignedGradesQuery.refetch();
      detailedQuery.refetch();
      summaryQuery.refetch();
      dashboardQuery.refetch();
    },
    onError: (error) => {
      console.error('Error updating teacher grade assignments:', error);
    },
  });

  // ===== WATCHERS =====

  // Watch for query data changes to update local state
  watch(
    () => teachersQuery.data.value,
    (newTeachers) => {
      if (newTeachers) {
        teachers.value = newTeachers;
      }
    },
    { immediate: true }
  );

  // Watch for grade assignments data changes
  watch(
    () => gradeAssignments.value,
    (newGradeAssignments) => {
      if (newGradeAssignments) {
        gradeAssignments.value = newGradeAssignments;
      }
    },
    { immediate: true }
  );

  // ===== COMPUTED =====

  // Computed getters
  const teacherOptions = computed(() => {
    return teachers.value.map((teacher) => ({
      label: `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim(),
      value: teacher.id,
    }));
  });

  const fullName = computed(() => {
    if (!selectedTeacher.value) return '';
    return `${selectedTeacher.value.firstName || ''} ${
      selectedTeacher.value.lastName || ''
    }`.trim();
  });

  const teacherSubjects = computed(() => {
    return dashboardData.value?.subjects || [];
  });

  const recentMarks = computed(() => {
    return dashboardData.value?.recentMarks || [];
  });

  const recentAbsences = computed(() => {
    return dashboardData.value?.recentAbsences || [];
  });

  const dashboardStats = computed(() => {
    if (!dashboardData.value) {
      return {
        totalStudents: 0,
        totalSubjects: 0,
        totalMarksGiven: 0,
        totalAbsencesRecorded: 0,
      };
    }
    return {
      totalStudents: dashboardData.value.totalStudents,
      totalSubjects: dashboardData.value.totalSubjects,
      totalMarksGiven: dashboardData.value.totalMarksGiven,
      totalAbsencesRecorded: dashboardData.value.totalAbsencesRecorded,
    };
  });

  const averageMarksBySubject = computed(() => {
    return dashboardData.value?.averageMarksBySubject || {};
  });

  const studentsByGrade = computed(() => {
    return dashboardData.value?.studentsByGrade || [];
  });

  const subjectOptions = computed(() => {
    if (!dashboardData.value?.subjects) return [];

    return dashboardData.value.subjects.map((subject) => ({
      label: subject.name,
      value: subject.id,
    }));
  });

  const gradeOptions = computed(() => {
    if (!dashboardData.value?.studentsByGrade) return [];

    return dashboardData.value.studentsByGrade.map((grade) => ({
      label: grade.gradeName,
      value: grade.gradeId,
    }));
  });

  // Semester and grading system computed properties
  const semesterOptions = computed(() => {
    return semesters.value.map((semester) => ({
      label: semester.name,
      value: semester.id,
    }));
  });

  const gradeScaleOptions = computed(() => {
    if (!institutionGradingSystem.value?.gradeScales) return []; 

    return institutionGradingSystem.value.gradeScales.map((scale) => ({
      label: `${scale.grade} (${scale.minimumScore}-${scale.maximumScore}) - ${scale.gpaValue} GPA`, 
      value: scale.grade,
      grade: scale.grade,
      minimumScore: scale.minimumScore, 
      maximumScore: scale.maximumScore, 
      gpaValue: scale.gpaValue, 
      status: scale.status,
    }));
  });

  // Loading states
  const loadingTeachers = computed(() => teachersQuery.isLoading.value);
  const loadingDashboard = computed(() => false); 
  const loadingAbsences = computed(() => false); 
  const loadingAttendanceOverview = computed(() => false);
  const loadingExcusedUnexcused = computed(() => false);
  const loadingAtRiskStudents = computed(() => false);
  const loadingAttendanceStatistics = computed(() => false);
  const loadingGradeAssignments = computed(
    () =>
      assignTeacherToGradesMutation.isLoading.value ||
      unassignTeacherFromGradesMutation.isLoading.value ||
      updateTeacherGradeAssignmentsMutation.isLoading.value
  );

  // Semester and grading system loading states
  const loadingSemesters = computed(() => false); 
  const loadingGradingSystem = computed(() => false); 

  // Combined loading state
  const isLoading = computed(
    () =>
      teachersQuery.isLoading.value ||
      createTeacherMutation.isLoading.value ||
      updateTeacherMutation.isLoading.value ||
      deleteTeacherMutation.isLoading.value ||
      createMarkMutation.isLoading.value ||
      updateMarkMutation.isLoading.value ||
      deleteMarkMutation.isLoading.value ||
      createAbsenceMutation.isLoading.value ||
      updateAbsenceMutation.isLoading.value ||
      deleteAbsenceMutation.isLoading.value ||
      assignTeacherToGradesMutation.isLoading.value ||
      unassignTeacherFromGradesMutation.isLoading.value ||
      updateTeacherGradeAssignmentsMutation.isLoading.value ||
      searchLoading.value
  );

  // ===== ACTION METHODS =====

  // Core CRUD operations
  const fetchTeachers = async () => {
    await teachersQuery.refetch();
    return teachers.value;
  };

  const searchTeachers = async (params: TeacherSearchParams = {}) => {
    searchLoading.value = true;
    try {
      const queryParams = new URLSearchParams();

      if (params.query) queryParams.append('query', params.query);
      if (params.institutionId)
        queryParams.append('institutionId', params.institutionId);
      if (params.departmentId)
        queryParams.append('departmentId', params.departmentId);
      if (params.classGradeId)
        queryParams.append('classGradeId', params.classGradeId);
      if (params.pageNumber)
        queryParams.append('pageNumber', params.pageNumber.toString());
      if (params.pageSize)
        queryParams.append('pageSize', params.pageSize.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.ascending !== undefined)
        queryParams.append('ascending', params.ascending.toString());

      const queryString = queryParams.toString();
      const url = `/Teachers/search${queryString ? `?${queryString}` : ''}`;

      const searchResults = await $apiFetch<TeacherResponseDto[]>(url);
      teachers.value = searchResults;
      return searchResults;
    } catch (error) {
      console.error('Error searching teachers:', error);
      throw error;
    } finally {
      searchLoading.value = false;
    }
  };

  const fetchTeachersByInstitution = async (institutionId: string) => {
    const query = teachersByInstitutionQuery(ref(institutionId));
    await query.refetch();
    const data = query.data.value || [];
    teachers.value = data;
    return data;
  };

  const getTeacher = async (id: string) => {
    const query = teacherQuery(ref(id));
    await query.refetch();
    const teacher = query.data.value;
    if (teacher) {
      selectedTeacher.value = teacher;
    }
    return teacher;
  };

  const createTeacher = async (teacherData: TeacherFormSchema) => {
    return await createTeacherMutation.mutateAsync(teacherData);
  };

  const updateTeacher = async (id: string, data: UpdateTeacherDto) => {
    return await updateTeacherMutation.mutateAsync({ id, data });
  };

  const deleteTeacher = async (id: string) => {
    await deleteTeacherMutation.mutateAsync(id);
  };

  // ENHANCED: Dashboard operations with semester support
  const fetchDashboard = async (teacherId: string, semesterId?: string) => {
    const query = teacherDashboardQuery(
      ref(teacherId),
      ref(semesterId || currentSemester.value?.id)
    );
    await query.refetch();
    dashboardData.value = query.data.value ?? null;
    return dashboardData.value;
  };

  const fetchSemesters = async (institutionId: string) => {
    const query = semestersQuery(ref(institutionId));
    await query.refetch();
    semesters.value = query.data.value || [];
    return semesters.value;
  };

  const fetchCurrentSemester = async (institutionId: string) => {
    const query = currentSemesterQuery(ref(institutionId));
    await query.refetch();
    currentSemester.value = query.data.value ?? null;
    return currentSemester.value;
  };

  const setCurrentSemester = (semester: SemesterResponseDto | null) => {
    currentSemester.value = semester;
  };

  const fetchInstitutionGradingSystem = async (institutionId: string) => {
    const query = institutionGradingSystemQuery(ref(institutionId));
    await query.refetch();
    institutionGradingSystem.value = query.data.value ?? null;
    return institutionGradingSystem.value;
  };

  const convertGradeToScore = async (grade: string, institutionId: string) => {
    try {
      const response = await $apiFetch<{
        score: number;
        gpaPoints: number;
        status: string;
      }>(
        `/GradingSystems/institution/${institutionId}/convert-grade-to-score`,
        {
          method: 'POST',
          body: { grade },
        }
      );
      return response;
    } catch (error) {
      console.error('Error converting grade to score:', error);
      throw error;
    }
  };

  const convertScoreToGrade = async (score: number, institutionId: string) => {
    try {
      const response = await $apiFetch<{
        grade: string;
        gpaPoints: number;
        status: string;
      }>(
        `/GradingSystems/institution/${institutionId}/convert-score-to-grade`,
        {
          method: 'POST',
          body: { score },
        }
      );
      return response;
    } catch (error) {
      console.error('Error converting score to grade:', error);
      throw error;
    }
  };

  // Mark operations
  const createMark = async (teacherId: string, data: CreateMarkDto) => {
    return await createMarkMutation.mutateAsync({ teacherId, data });
  };

  const updateMark = async (
    teacherId: string,
    markId: string,
    data: UpdateMarkDto
  ) => {
    return await updateMarkMutation.mutateAsync({ teacherId, markId, data });
  };

  const deleteMark = async (teacherId: string, markId: string) => {
    return await deleteMarkMutation.mutateAsync({ teacherId, markId });
  };

  // Absence operations
  const createAbsence = async (teacherId: string, data: CreateAbsenceDto) => {
    return await createAbsenceMutation.mutateAsync({ teacherId, data });
  };

  const updateAbsence = async (
    teacherId: string,
    absenceId: string,
    data: UpdateAbsenceDto
  ) => {
    return await updateAbsenceMutation.mutateAsync({
      teacherId,
      absenceId,
      data,
    });
  };

  const deleteAbsence = async (teacherId: string, absenceId: string) => {
    return await deleteAbsenceMutation.mutateAsync({ teacherId, absenceId });
  };

  // Analytics operations
  const fetchAttendanceOverview = async (
    teacherId: string,
    params: AttendanceFilterParams
  ) => {
    const query = attendanceOverviewQuery(ref(teacherId), ref(params));
    await query.refetch();
    attendanceOverview.value = query.data.value ?? null;
    return attendanceOverview.value;
  };

  const fetchExcusedUnexcusedBreakdown = async (
    teacherId: string,
    params: AbsenceBreakdownFilterParams
  ) => {
    const query = excusedUnexcusedBreakdownQuery(ref(teacherId), ref(params));
    await query.refetch();
    excusedUnexcusedBreakdown.value = query.data.value ?? null;
    return excusedUnexcusedBreakdown.value;
  };

  const fetchAtRiskStudents = async (
    teacherId: string,
    params: AtRiskStudentsFilterParams
  ) => {
    const query = atRiskStudentsQuery(ref(teacherId), ref(params));
    await query.refetch();
    atRiskStudents.value = query.data.value ?? null;
    return atRiskStudents.value;
  };

  const fetchAttendanceStatistics = async (
    teacherId: string,
    params: StatisticsFilterParams
  ) => {
    const query = attendanceStatisticsQuery(ref(teacherId), ref(params));
    await query.refetch();
    attendanceStatistics.value = query.data.value ?? null;
    return attendanceStatistics.value;
  };

  // ===== GRADE ASSIGNMENT OPERATIONS =====

  // Assign teacher to grades
  const assignTeacherToGrades = async (
    teacherId: string,
    data: AssignTeacherToGradesDto
  ) => {
    return await assignTeacherToGradesMutation.mutateAsync({ teacherId, data });
  };

  // Unassign teacher from grades
  const unassignTeacherFromGrades = async (
    teacherId: string,
    data: UnassignTeacherFromGradesDto
  ) => {
    return await unassignTeacherFromGradesMutation.mutateAsync({
      teacherId,
      data,
    });
  };

  // Update teacher grade assignments
  const updateTeacherGradeAssignments = async (
    teacherId: string,
    data: UpdateTeacherGradeAssignmentsDto
  ) => {
    return await updateTeacherGradeAssignmentsMutation.mutateAsync({
      teacherId,
      data,
    });
  };

  // Get teacher with grade assignments (detailed)
  const getTeacherWithGradeAssignments = async (teacherId: string) => {
    const query = teacherWithGradeAssignmentsQuery(ref(teacherId));
    await query.refetch();
    teacherWithGradeAssignments.value = query.data.value ?? null;
    return teacherWithGradeAssignments.value;
  };

  // Get teacher assigned grades
  const getTeacherAssignedGrades = async (teacherId: string) => {
    const query = teacherAssignedGradesQuery(ref(teacherId));
    await query.refetch();
    gradeAssignments.value = query.data.value || [];
    return gradeAssignments.value;
  };

  // Get teacher grade assignment summary
  const getTeacherGradeAssignmentSummary = async (teacherId: string) => {
    const query = teacherGradeAssignmentSummaryQuery(ref(teacherId));
    await query.refetch();
    gradeAssignmentSummary.value = query.data.value ?? null;
    return gradeAssignmentSummary.value;
  };

  // Select teacher helper
  const selectTeacher = (teacher: TeacherResponseDto | null) => {
    selectedTeacher.value = teacher;
  };

  // Return store with all exports
  return {
    // State
    teachers,
    selectedTeacher,
    dashboardData,
    absences,
    attendanceOverview,
    excusedUnexcusedBreakdown,
    atRiskStudents,
    attendanceStatistics,
    gradeAssignments,
    teacherWithGradeAssignments,
    gradeAssignmentSummary,
    semesters,
    currentSemester,
    institutionGradingSystem,

    // Queries
    teachersQuery,
    teachersByInstitutionQuery,
    teacherQuery,
    teacherByUserIdQuery,
    teacherDashboardQuery,
    teacherSubjectsQuery,
    studentsBySubjectQuery,
    teacherMarksQuery,
    markQuery,
    studentMarksQuery,
    teacherAbsencesQuery,
    absenceQuery,
    studentAbsencesQuery,
    subjectAbsencesQuery,
    attendanceOverviewQuery,
    excusedUnexcusedBreakdownQuery,
    atRiskStudentsQuery,
    attendanceStatisticsQuery,
    teacherWithGradeAssignmentsQuery,
    teacherAssignedGradesQuery,
    teacherGradeAssignmentSummaryQuery,
    semestersQuery,
    currentSemesterQuery,
    institutionGradingSystemQuery,

    // Computed Properties
    teacherOptions,
    fullName,
    teacherSubjects,
    recentMarks,
    recentAbsences,
    dashboardStats,
    averageMarksBySubject,
    studentsByGrade,
    subjectOptions,
    gradeOptions,
    semesterOptions,
    gradeScaleOptions,

    // Loading States
    isLoading,
    loadingTeachers,
    searchLoading,
    loadingDashboard,
    loadingAbsences,
    loadingAttendanceOverview,
    loadingExcusedUnexcused,
    loadingAtRiskStudents,
    loadingAttendanceStatistics,
    loadingGradeAssignments,
    loadingSemesters,
    loadingGradingSystem,

    // Actions
    fetchTeachers,
    searchTeachers,
    fetchTeachersByInstitution,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    selectTeacher,
    fetchDashboard,

    // Mark Actions
    createMark,
    updateMark,
    deleteMark,

    // Absence Actions
    createAbsence,
    updateAbsence,
    deleteAbsence,

    // Analytics Actions
    fetchAttendanceOverview,
    fetchExcusedUnexcusedBreakdown,
    fetchAtRiskStudents,
    fetchAttendanceStatistics,

    // Semester Actions
    fetchSemesters,
    fetchCurrentSemester,
    setCurrentSemester,

    // Grading System Actions
    fetchInstitutionGradingSystem,
    convertGradeToScore,
    convertScoreToGrade,

    // Grade Assignment Actions
    assignTeacherToGrades,
    unassignTeacherFromGrades,
    updateTeacherGradeAssignments,
    getTeacherWithGradeAssignments,
    getTeacherAssignedGrades,
    getTeacherGradeAssignmentSummary,

    // Mutations (exposed for advanced use cases)
    createTeacherMutation,
    updateTeacherMutation,
    deleteTeacherMutation,
    createMarkMutation,
    updateMarkMutation,
    deleteMarkMutation,
    createAbsenceMutation,
    updateAbsenceMutation,
    deleteAbsenceMutation,
    assignTeacherToGradesMutation,
    unassignTeacherFromGradesMutation,
    updateTeacherGradeAssignmentsMutation,
  };
});
