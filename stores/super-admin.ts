// stores/enhanced-superadmin.ts - Using Paginated Responses for Both Institutions and Applications
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import type { AcademicYearResponseDto } from '~/interfaces/academic/academic-year.dto';
import type { StudentResponseDto } from '~/interfaces/academic/student.dto';
import type { TeacherResponseDto } from '~/interfaces/academic/teacher.dto';
import type { AdminDto } from '~/interfaces/admin.dto';
import type { ApplicationResponseDto } from '~/interfaces/application-response.dto';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';
import type { InstitutionFormType } from '~/schemas/institution.schema';
import { IntegrationStatus } from '~/enums/integration-status.enum';
import type { PagedResult } from '~/interfaces/common/paged-result';
import type { CreateEntityMeta } from '~/interfaces/super-admin/create-entity-meta';
import type { GradingSystem } from '~/interfaces/super-admin/grading-system';

export const useSuperAdminStore = defineStore('superadmin', () => {
  // CRITICAL: NEVER execute on server side to prevent serialization issues
  if (import.meta.server) {
    // Return comprehensive stub implementation for SSR
    return {
      loading: readonly(ref(false)),
      error: readonly(ref(null)),
      stats: computed(() => ({
        institutionsCount: 0,
        studentsCount: 0,
        teachersCount: 0,
        adminsCount: 0,
        applicationsCount: 0,
        pendingApplicationsCount: 0,
      })),
      institutions: readonly(ref([])),
      admins: readonly(ref([])),
      students: readonly(ref([])),
      teachers: readonly(ref([])),
      applications: readonly(ref([])),
      academicYears: readonly(ref([])),
      gradingSystems: readonly(ref([])),

      // Pagination state for institutions
      institutionsPage: readonly(ref(1)),
      institutionsPageSize: readonly(ref(50)),
      institutionsTotalCount: readonly(ref(0)),
      institutionsTotalPages: readonly(ref(0)),
      institutionsHasNextPage: readonly(ref(false)),
      institutionsHasPreviousPage: readonly(ref(false)),

      // Pagination state for applications
      applicationsPage: readonly(ref(1)),
      applicationsPageSize: readonly(ref(100)),
      applicationsTotalCount: readonly(ref(0)),
      applicationsTotalPages: readonly(ref(0)),
      applicationsHasNextPage: readonly(ref(false)),
      applicationsHasPreviousPage: readonly(ref(false)),

      isLoading: computed(() => false),
      loadingInstitutions: computed(() => false),
      loadingApplications: computed(() => false),
      loadingAdmins: computed(() => false),
      loadingTeachers: computed(() => false),
      loadingStudents: computed(() => false),
      isCreatingInstitution: computed(() => false),
      isUpdatingInstitution: computed(() => false),
      isDeletingInstitution: computed(() => false),
      isCreatingAdmin: computed(() => false),
      isRemovingAdmin: computed(() => false),
      isApprovingApplication: computed(() => false),

      // Stub methods for SSR
      initializeDashboard: async () => {},
      refreshData: async () => {},
      createEntity: async () => null,
      fetchInstitutions: async () => [],
      fetchPendingApplications: async () => [],
      fetchAdmins: async () => [],
      fetchTeachers: async () => [],
      fetchStudents: async () => [],
      fetchAcademicYears: async () => [],
      fetchGradingSystems: async () => [],
      fetchAllUsers: async () => {},
      getInstitutionById: async () => null,
      getAdminById: async () => null,
      createInstitution: async () => null,
      createAdmin: async () => null,
      updateInstitution: async () => null,
      deleteInstitution: async () => {},
      suspendInstitution: async () => {},
      approveApplication: async () => {},
      removeAdmin: async () => {},
      setInstitutionsPage: () => {},
      setInstitutionsPageSize: () => {},
      setApplicationsPage: () => {},
      setApplicationsPageSize: () => {},
      institutionQuery: () => null,
      adminQuery: () => null,
      institutionsQuery: null,
      applicationsQuery: null,
      adminsQuery: null,
      teachersQuery: null,
      studentsQuery: null,
      academicYearsQuery: null,
      gradingSystemsQuery: null,
    };
  }

  // CLIENT-ONLY implementation
  const { $apiFetch } = useNuxtApp();

  // Internal state - not readonly
  const _loading = ref(false);
  const _error = ref<string | null>(null);

  // Data collections - using internal refs
  const _institutions = ref<InstitutionResponseDto[]>([]);
  const _admins = ref<AdminDto[]>([]);
  const _students = ref<StudentResponseDto[]>([]);
  const _teachers = ref<TeacherResponseDto[]>([]);
  const _applications = ref<ApplicationResponseDto[]>([]);
  const _academicYears = ref<AcademicYearResponseDto[]>([]);
  const _gradingSystems = ref<GradingSystem[]>([]);

  // Pagination state for institutions
  const institutionsPage = ref(1);
  const institutionsPageSize = ref(50); // Reasonable page size for institutions
  const institutionsTotalCount = ref(0);
  const institutionsTotalPages = ref(0);
  const institutionsHasNextPage = ref(false);
  const institutionsHasPreviousPage = ref(false);

  // Pagination state for applications
  const applicationsPage = ref(1);
  const applicationsPageSize = ref(100); // Larger page size for admin overview
  const applicationsTotalCount = ref(0);
  const applicationsTotalPages = ref(0);
  const applicationsHasNextPage = ref(false);
  const applicationsHasPreviousPage = ref(false);

  // Computed stats - automatically updates when data changes, uses total counts from pagination
  const stats = computed(() => {
    return {
      institutionsCount: institutionsTotalCount.value, // Use total count from pagination
      studentsCount: _students.value.length,
      teachersCount: _teachers.value.length,
      adminsCount: _admins.value.length,
      applicationsCount: applicationsTotalCount.value, // Use total count from pagination
      pendingApplicationsCount: _applications.value.filter(
        (app) => app.status === 'Pending'
      ).length,
    };
  });

  /**
   * Map of entities that can be created, with their endpoints and formatters
   */
  const entityMeta: Record<string, CreateEntityMeta> = {
    'all-institutions': {
      endpoint: '/Institutions',
      formatter: (data: InstitutionFormType) => data,
    },
    admins: {
      endpoint: '/Admin',
      formatter: (data: any) => data,
    },
  };

  // ===== QUERIES - ALL DISABLED BY DEFAULT AND CLIENT-ONLY =====

  // Institutions query - UPDATED to handle PagedResult
  const institutionsQuery = useQuery({
    key: () => [
      'superadmin',
      'institutions',
      institutionsPage.value,
      institutionsPageSize.value,
    ],
    query: () =>
      $apiFetch<PagedResult<InstitutionResponseDto>>('/Institutions', {
        query: {
          page: institutionsPage.value,
          pageSize: institutionsPageSize.value,
        },
      }),
    enabled: () => import.meta.client,
    staleTime: 5 * 60 * 1000,
  });

  // Applications query - keeping pagination
  const applicationsQuery = useQuery({
    key: () => [
      'superadmin',
      'applications',
      applicationsPage.value,
      applicationsPageSize.value,
    ],
    query: () =>
      $apiFetch<PagedResult<ApplicationResponseDto>>('/Applications', {
        query: {
          page: applicationsPage.value,
          pageSize: applicationsPageSize.value,
        },
      }),
    enabled: () => import.meta.client,
    staleTime: 2 * 60 * 1000,
  });

  // Admins query
  const adminsQuery = useQuery({
    key: () => ['superadmin', 'admins'],
    query: () => $apiFetch<AdminDto[]>('/Admin'),
    enabled: () => import.meta.client,
    staleTime: 10 * 60 * 1000,
  });

  // Teachers query
  const teachersQuery = useQuery({
    key: () => ['superadmin', 'teachers'],
    query: () => $apiFetch<TeacherResponseDto[]>('/Teachers'),
    enabled: () => import.meta.client,
    staleTime: 10 * 60 * 1000,
  });

  // Students query - depends on institutions being loaded first
  const studentsQuery = useQuery({
    key: () => [
      'superadmin',
      'students',
      JSON.stringify(_institutions.value.map((i) => i.id)),
    ],
    query: async () => {
      if (!import.meta.client || _institutions.value.length === 0) return [];

      let allStudents: StudentResponseDto[] = [];

      for (const institution of _institutions.value) {
        try {
          if (institution.type?.includes('School')) {
            const schoolStudents = await $apiFetch<StudentResponseDto[]>(
              `/Students/school/${institution.id}`
            );
            allStudents = [...allStudents, ...schoolStudents];
          } else if (institution.type?.includes('University')) {
            const universityStudents = await $apiFetch<StudentResponseDto[]>(
              `/Students/university/${institution.id}`
            );
            allStudents = [...allStudents, ...universityStudents];
          }
        } catch (error) {
          console.warn(
            `Failed to fetch students for institution ${institution.id}:`,
            error
          );
        }
      }

      return allStudents;
    },
    enabled: () => import.meta.client && _institutions.value.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  // Academic years query
  const academicYearsQuery = useQuery({
    key: () => [
      'superadmin',
      'academic-years',
      JSON.stringify(_institutions.value.map((i) => i.id)),
    ],
    query: async () => {
      if (!import.meta.client || _institutions.value.length === 0) return [];

      let allAcademicYears: AcademicYearResponseDto[] = [];

      for (const institution of _institutions.value) {
        try {
          const years = await $apiFetch<AcademicYearResponseDto[]>(
            `/institutions/${institution.id}/academic-years`
          );
          allAcademicYears = [...allAcademicYears, ...years];
        } catch (error) {
          console.warn(
            `Failed to fetch academic years for institution ${institution.id}:`,
            error
          );
        }
      }

      return allAcademicYears;
    },
    enabled: () => import.meta.client && _institutions.value.length > 0,
    staleTime: 15 * 60 * 1000,
  });

  // Grading systems query
  const gradingSystemsQuery = useQuery({
    key: () => [
      'superadmin',
      'grading-systems',
      JSON.stringify(_institutions.value.map((i) => i.id)),
    ],
    query: async () => {
      if (!import.meta.client || _institutions.value.length === 0) return [];

      let allGradingSystems: GradingSystem[] = [];

      for (const institution of _institutions.value) {
        try {
          const systems = await $apiFetch<GradingSystem[]>(
            `/GradingSystems/institution/${institution.id}`
          );
          allGradingSystems = [...allGradingSystems, ...systems];
        } catch (error) {
          console.warn(
            `Failed to fetch grading systems for institution ${institution.id}:`,
            error
          );
        }
      }

      return allGradingSystems;
    },
    enabled: () => import.meta.client && _institutions.value.length > 0,
    staleTime: 15 * 60 * 1000,
  });

  // Single institution query factory
  const institutionQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['superadmin', 'institution', unref(id) || ''],
      query: () =>
        $apiFetch<InstitutionResponseDto>(`/Institutions/${unref(id)}`),
      enabled: () => !!unref(id) && import.meta.client,
      staleTime: 10 * 60 * 1000,
    });
  };

  // Single admin query factory
  const adminQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['superadmin', 'admin', unref(id) || ''],
      query: () => $apiFetch<AdminDto>(`/Admin/${unref(id)}`),
      enabled: () => !!unref(id) && import.meta.client,
      staleTime: 10 * 60 * 1000,
    });
  };

  // ===== MUTATIONS =====

  // Create institution mutation
  const createInstitutionMutation = useMutation({
    mutation: (data: InstitutionFormType) =>
      $apiFetch<InstitutionResponseDto>('/Institutions', {
        method: 'POST',
        body: data,
      }),
    onSuccess: (newInstitution) => {
      // Add to local state for immediate UI update
      _institutions.value.push(newInstitution);
      // Update total count
      institutionsTotalCount.value += 1;
    },
    onError: (error) => {
      console.error('Error creating institution:', error);
    },
  });

  // Update institution mutation
  const updateInstitutionMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: any }) =>
      $apiFetch<InstitutionResponseDto>(`/Institutions/${id}`, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: (updatedInstitution, { id }) => {
      // Update in local state
      const index = _institutions.value.findIndex((inst) => inst.id === id);
      if (index !== -1) {
        _institutions.value[index] = updatedInstitution;
      }
    },
    onError: (error) => {
      console.error('Error updating institution:', error);
    },
  });

  // Delete institution mutation
  const deleteInstitutionMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/Institutions/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      // Remove from local state
      _institutions.value = _institutions.value.filter(
        (inst) => inst.id !== id
      );
      // Update total count
      institutionsTotalCount.value -= 1;
    },
    onError: (error) => {
      console.error('Error deleting institution:', error);
    },
  });

  // Create admin mutation
  const createAdminMutation = useMutation({
    mutation: (data: any) =>
      $apiFetch<AdminDto>('/Admin', {
        method: 'POST',
        body: data,
      }),
    onSuccess: (newAdmin) => {
      // Add to local state for immediate UI update
      _admins.value.push(newAdmin);
    },
    onError: (error) => {
      console.error('Error creating admin:', error);
    },
  });

  // Remove admin mutation
  const removeAdminMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/Admin/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      // Remove from local state
      _admins.value = _admins.value.filter((admin) => admin.id !== id);
    },
    onError: (error) => {
      console.error('Error removing admin:', error);
    },
  });

  // Approve application mutation
  const approveApplicationMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/Applications/approve/${id}`, {
        method: 'PUT',
      }),
    onSuccess: (_, id) => {
      // Update application status in local state
      const index = _applications.value.findIndex((app) => app.id === id);
      if (index !== -1) {
        _applications.value[index] = {
          ..._applications.value[index],
          status: 'Approved' as any,
        };
      }
    },
    onError: (error) => {
      console.error('Error approving application:', error);
    },
  });

  // ===== WATCHERS =====

  // Watch for institutions query data changes - UPDATED for PagedResult
  watch(
    () => institutionsQuery.data.value,
    (newInstitutionsResponse) => {
      try {
        if (
          newInstitutionsResponse &&
          typeof newInstitutionsResponse === 'object' &&
          'items' in newInstitutionsResponse &&
          Array.isArray(newInstitutionsResponse.items)
        ) {
          _institutions.value = newInstitutionsResponse.items;
          institutionsTotalCount.value =
            newInstitutionsResponse.totalCount || 0;
          institutionsTotalPages.value =
            newInstitutionsResponse.totalPages || 0;
          institutionsHasNextPage.value =
            newInstitutionsResponse.hasNextPage || false;
          institutionsHasPreviousPage.value =
            newInstitutionsResponse.hasPreviousPage || false;
        } else {
          // Fallback to empty array if data is invalid
          _institutions.value = [];
          institutionsTotalCount.value = 0;
          institutionsTotalPages.value = 0;
          institutionsHasNextPage.value = false;
          institutionsHasPreviousPage.value = false;
        }
      } catch (error) {
        console.warn(
          'Error processing institutions data in superadmin store:',
          error
        );
        _institutions.value = [];
        institutionsTotalCount.value = 0;
        institutionsTotalPages.value = 0;
        institutionsHasNextPage.value = false;
        institutionsHasPreviousPage.value = false;
      }
    },
    { immediate: true }
  );

  // Watch for applications query data changes - keeping pagination
  watch(
    () => applicationsQuery.data.value,
    (newApplicationsResponse) => {
      try {
        if (
          newApplicationsResponse &&
          typeof newApplicationsResponse === 'object' &&
          'items' in newApplicationsResponse &&
          Array.isArray(newApplicationsResponse.items)
        ) {
          _applications.value = newApplicationsResponse.items;
          applicationsTotalCount.value =
            newApplicationsResponse.totalCount || 0;
          applicationsTotalPages.value =
            newApplicationsResponse.totalPages || 0;
          applicationsHasNextPage.value =
            newApplicationsResponse.hasNextPage || false;
          applicationsHasPreviousPage.value =
            newApplicationsResponse.hasPreviousPage || false;
        } else {
          // Fallback to empty array if data is invalid
          _applications.value = [];
          applicationsTotalCount.value = 0;
          applicationsTotalPages.value = 0;
          applicationsHasNextPage.value = false;
          applicationsHasPreviousPage.value = false;
        }
      } catch (error) {
        console.warn(
          'Error processing applications data in superadmin store:',
          error
        );
        _applications.value = [];
        applicationsTotalCount.value = 0;
        applicationsTotalPages.value = 0;
        applicationsHasNextPage.value = false;
        applicationsHasPreviousPage.value = false;
      }
    },
    { immediate: true }
  );

  watch(
    () => adminsQuery.data.value,
    (newAdmins) => {
      if (newAdmins) {
        _admins.value = newAdmins;
      }
    },
    { immediate: true }
  );

  watch(
    () => teachersQuery.data.value,
    (newTeachers) => {
      if (newTeachers) {
        _teachers.value = newTeachers;
      }
    },
    { immediate: true }
  );

  watch(
    () => studentsQuery.data.value,
    (newStudents) => {
      if (newStudents) {
        _students.value = newStudents;
      }
    },
    { immediate: true }
  );

  watch(
    () => academicYearsQuery.data.value,
    (newAcademicYears) => {
      if (newAcademicYears) {
        _academicYears.value = newAcademicYears;
      }
    },
    { immediate: true }
  );

  watch(
    () => gradingSystemsQuery.data.value,
    (newGradingSystems) => {
      if (newGradingSystems) {
        _gradingSystems.value = newGradingSystems;
      }
    },
    { immediate: true }
  );

  // Watch for pagination changes to refetch data
  watch([institutionsPage, institutionsPageSize], () => {
    if (import.meta.client) {
      institutionsQuery.refetch();
    }
  });

  watch([applicationsPage, applicationsPageSize], () => {
    if (import.meta.client) {
      applicationsQuery.refetch();
    }
  });

  // ===== COMPUTED =====

  // Loading states
  const isLoading = computed(
    () =>
      institutionsQuery.isLoading.value ||
      applicationsQuery.isLoading.value ||
      adminsQuery.isLoading.value ||
      teachersQuery.isLoading.value ||
      studentsQuery.isLoading.value ||
      academicYearsQuery.isLoading.value ||
      gradingSystemsQuery.isLoading.value ||
      createInstitutionMutation.isLoading.value ||
      updateInstitutionMutation.isLoading.value ||
      deleteInstitutionMutation.isLoading.value ||
      createAdminMutation.isLoading.value ||
      removeAdminMutation.isLoading.value ||
      approveApplicationMutation.isLoading.value
  );

  // Individual loading states
  const loadingInstitutions = computed(() => institutionsQuery.isLoading.value);
  const loadingApplications = computed(() => applicationsQuery.isLoading.value);
  const loadingAdmins = computed(() => adminsQuery.isLoading.value);
  const loadingTeachers = computed(() => teachersQuery.isLoading.value);
  const loadingStudents = computed(() => studentsQuery.isLoading.value);

  // ===== ACTION METHODS =====

  // Pagination actions for institutions
  const setInstitutionsPage = (page: number) => {
    institutionsPage.value = page;
  };

  const setInstitutionsPageSize = (pageSize: number) => {
    institutionsPageSize.value = pageSize;
  };

  // Pagination actions for applications
  const setApplicationsPage = (page: number) => {
    applicationsPage.value = page;
  };

  const setApplicationsPageSize = (pageSize: number) => {
    applicationsPageSize.value = pageSize;
  };

  // Initialization
  const initializeDashboard = async () => {
    _loading.value = true;
    _error.value = null;

    try {
      // Fetch initial data
      await Promise.all([
        institutionsQuery.refetch(),
        applicationsQuery.refetch(),
      ]);
    } catch (err: any) {
      console.error('Failed to initialize dashboard:', err);
      _error.value = err.message || 'Failed to initialize dashboard';
    } finally {
      _loading.value = false;
    }
  };

  // Data refresh methods
  const refreshData = async (section: string) => {
    _loading.value = true;
    _error.value = null;

    try {
      switch (section) {
        case 'all-institutions':
          await institutionsQuery.refetch();
          break;
        case 'pending-institutions':
        case 'pending-applications':
          await applicationsQuery.refetch();
          break;
        case 'all-users':
          await Promise.all([
            adminsQuery.refetch(),
            teachersQuery.refetch(),
            studentsQuery.refetch(),
          ]);
          break;
        case 'admins':
          await adminsQuery.refetch();
          break;
        case 'teachers':
          await teachersQuery.refetch();
          break;
        case 'students':
          await studentsQuery.refetch();
          break;
        case 'academic-years':
          await academicYearsQuery.refetch();
          break;
        case 'grading-systems':
          await gradingSystemsQuery.refetch();
          break;
        default:
          console.warn(`No refresh method for section: ${section}`);
      }
    } catch (err: any) {
      console.error(`Failed to refresh ${section}:`, err);
      _error.value = err.message || `Failed to refresh ${section}`;
    } finally {
      _loading.value = false;
    }
  };

  // Fetch methods (maintaining existing API)
  const fetchInstitutions = async () => {
    await institutionsQuery.refetch();
    return _institutions.value;
  };

  const fetchPendingApplications = async () => {
    await applicationsQuery.refetch();
    return _applications.value;
  };

  const fetchAdmins = async () => {
    await adminsQuery.refetch();
    return _admins.value;
  };

  const fetchTeachers = async () => {
    await teachersQuery.refetch();
    return _teachers.value;
  };

  const fetchStudents = async () => {
    await studentsQuery.refetch();
    return _students.value;
  };

  const fetchAcademicYears = async () => {
    await academicYearsQuery.refetch();
    return _academicYears.value;
  };

  const fetchGradingSystems = async () => {
    await gradingSystemsQuery.refetch();
    return _gradingSystems.value;
  };

  const fetchAllUsers = async () => {
    await Promise.all([
      adminsQuery.refetch(),
      teachersQuery.refetch(),
      studentsQuery.refetch(),
    ]);
  };

  // Single item fetch methods
  const getInstitutionById = async (id: string) => {
    const query = institutionQuery(ref(id));
    await query.refetch();
    return query.data.value;
  };

  const getAdminById = async (id: string) => {
    const query = adminQuery(ref(id));
    await query.refetch();
    return query.data.value;
  };

  // Create methods
  const createInstitution = async (data: InstitutionFormType) => {
    return await createInstitutionMutation.mutateAsync(data);
  };

  const createAdmin = async (data: any) => {
    return await createAdminMutation.mutateAsync(data);
  };

  // Generic entity creation method that uses the metadata
  const createEntity = async (section: string, data: any) => {
    if (!entityMeta[section]) {
      throw new Error(`Creating entities in ${section} is not supported`);
    }

    const { formatter } = entityMeta[section];
    const formattedData = formatter ? formatter(data) : data;

    switch (section) {
      case 'all-institutions':
        return await createInstitution(formattedData);
      case 'admins':
        return await createAdmin(formattedData);
      default:
        throw new Error(`Creating entities in ${section} is not implemented`);
    }
  };

  // Update methods
  const updateInstitution = async (id: string, data: any) => {
    return await updateInstitutionMutation.mutateAsync({ id, data });
  };

  // Delete methods
  const deleteInstitution = async (id: string) => {
    await deleteInstitutionMutation.mutateAsync(id);
  };

  // Specialized actions
  const suspendInstitution = async (id: string, reason: string) => {
    try {
      // Get the institution first
      const institution = await getInstitutionById(id);

      if (institution) {
        const updatedData: any = {
          integrationStatus: IntegrationStatus.Inactive,
          suspensionReason: reason,
        };

        await updateInstitution(id, updatedData);
      }
    } catch (err: any) {
      console.error(`Failed to suspend institution ${id}:`, err);
      throw err;
    }
  };

  const approveApplication = async (id: string) => {
    await approveApplicationMutation.mutateAsync(id);
  };

  const removeAdmin = async (id: string) => {
    await removeAdminMutation.mutateAsync(id);
  };

  return {
    // State
    loading: readonly(_loading),
    error: readonly(_error),
    stats,
    institutions: readonly(_institutions),
    admins: readonly(_admins),
    students: readonly(_students),
    teachers: readonly(_teachers),
    applications: readonly(_applications),
    academicYears: readonly(_academicYears),
    gradingSystems: readonly(_gradingSystems),

    // Pagination state for institutions
    institutionsPage: readonly(institutionsPage),
    institutionsPageSize: readonly(institutionsPageSize),
    institutionsTotalCount: readonly(institutionsTotalCount),
    institutionsTotalPages: readonly(institutionsTotalPages),
    institutionsHasNextPage: readonly(institutionsHasNextPage),
    institutionsHasPreviousPage: readonly(institutionsHasPreviousPage),

    // Pagination state for applications
    applicationsPage: readonly(applicationsPage),
    applicationsPageSize: readonly(applicationsPageSize),
    applicationsTotalCount: readonly(applicationsTotalCount),
    applicationsTotalPages: readonly(applicationsTotalPages),
    applicationsHasNextPage: readonly(applicationsHasNextPage),
    applicationsHasPreviousPage: readonly(applicationsHasPreviousPage),

    // Loading states
    isLoading,
    loadingInstitutions,
    loadingApplications,
    loadingAdmins,
    loadingTeachers,
    loadingStudents,

    // Individual mutation loading states
    isCreatingInstitution: computed(
      () => createInstitutionMutation.isLoading.value
    ),
    isUpdatingInstitution: computed(
      () => updateInstitutionMutation.isLoading.value
    ),
    isDeletingInstitution: computed(
      () => deleteInstitutionMutation.isLoading.value
    ),
    isCreatingAdmin: computed(() => createAdminMutation.isLoading.value),
    isRemovingAdmin: computed(() => removeAdminMutation.isLoading.value),
    isApprovingApplication: computed(
      () => approveApplicationMutation.isLoading.value
    ),

    // Methods
    initializeDashboard,
    refreshData,
    createEntity,

    // Pagination actions
    setInstitutionsPage,
    setInstitutionsPageSize,
    setApplicationsPage,
    setApplicationsPageSize,

    // Fetch methods
    fetchInstitutions,
    fetchPendingApplications,
    fetchAdmins,
    fetchTeachers,
    fetchStudents,
    fetchAcademicYears,
    fetchGradingSystems,
    fetchAllUsers,

    // Single item fetch methods
    getInstitutionById,
    getAdminById,

    // Create methods
    createInstitution,
    createAdmin,

    // Update methods
    updateInstitution,

    // Delete methods
    deleteInstitution,

    // Specialized actions
    suspendInstitution,
    approveApplication,
    removeAdmin,

    // Query factories for dynamic usage
    institutionQuery,
    adminQuery,

    // Direct access to main queries
    institutionsQuery,
    applicationsQuery,
    adminsQuery,
    teachersQuery,
    studentsQuery,
    academicYearsQuery,
    gradingSystemsQuery,
  };
});
