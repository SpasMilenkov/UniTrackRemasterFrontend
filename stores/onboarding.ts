import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import type { z } from 'zod';
import type { ApplicationResponseDto } from '~/interfaces/application-response.dto';
import type { codeAuthSchema } from '~/schemas/code-auth.schema';
import { InstitutionType } from '~/enums/institution-type.enum';
import type { initInstitutionApplicationSchema } from '~/schemas/init-institution-application.schema';
import type { InitUniversityDto } from '~/interfaces/organizations/init-university.dto';
import type { InitSchoolDto } from '~/interfaces/organizations/init-school.dto';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';
import { ApplicationStatus } from '~/enums/application-status.enum';
import type { PagedResult } from '~/interfaces/common/paged-result';

export const useOnboardingStore = defineStore('onboardingStore', () => {
  if (import.meta.server) {
    return {
      // State
      currentStep: readonly(ref(null)),
      canSubmit: readonly(ref(true)),
      passedVerification: readonly(ref(false)),
      processingSubmission: readonly(ref(false)),
      applicationData: readonly(ref(null)),
      applications: readonly(ref([])), // Initialize as empty array instead of null
      authenticated: readonly(ref(false)),
      error: readonly(ref(null)),
      currentApplicationId: readonly(ref(null)),
      institutionType: readonly(ref(null)),
      currentInstitutionId: readonly(ref(null)),
      isProcessing: readonly(ref(false)),
      selectedInstitution: readonly(ref(null)),
      selectedInstitutionCategory: readonly(ref(null)),

      // Pagination state
      applicationsPage: readonly(ref(1)),
      applicationsPageSize: readonly(ref(50)),
      applicationsTotalCount: readonly(ref(0)),
      applicationsTotalPages: readonly(ref(0)),

      // Computed getters
      availableInstitutionTypes: computed(() => []),

      // Loading states
      isLoadingApplications: computed(() => false),
      isCreatingApplication: computed(() => false),
      isInitializingInstitution: computed(() => false),
      isAuthenticating: computed(() => false),
      isApprovingApplication: computed(() => false),
      isDeletingApplication: computed(() => false),
      isLoading: computed(() => false),

      // Actions
      setInstitutionType: () => {},
      setInstitutionCategory: () => {},
      setCategoryFromType: () => {},
      initInstitution: async () => {},
      createInstitutionApplication: async () => {},
      getInstitutionById: async () => null,
      getApplications: async () => {},
      getApplicationById: async () => null,
      authenticateViaCode: async () => {},
      approveApplication: async () => {},
      deleteApplication: async () => {},
      checkAuthStatus: () => false,
      setApplicationsPage: () => {},
      setApplicationsPageSize: () => {},
      extractErrorMessage: () => 'An error occurred',

      // Query factories
      applicationQuery: () => null,
      institutionQuery: () => null,
      applicationsQuery: null,
    };
  }

  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State - Initialize applications as empty array and ensure it's always an array
  const currentStep = ref<ApplicationStatus | null>(null);
  const canSubmit = ref(true);
  const passedVerification = ref(false);
  const processingSubmission = ref(false);
  const applicationData = ref<ApplicationResponseDto | null>(null);
  const applications = ref<ApplicationResponseDto[]>([]); // Always initialize as array
  const authenticated = ref(false);
  const error = ref<unknown>(null);
  const currentApplicationId = ref<string | null>(null);
  const institutionType = ref<InstitutionType | null>(null);
  const currentInstitutionId = ref<string | null>(null);
  const isProcessing = ref(false);
  const selectedInstitution = ref<InstitutionResponseDto | null>(null);
  const selectedInstitutionCategory = ref<'school' | 'higher-ed' | null>(null);

  // Pagination state
  const applicationsPage = ref(1);
  const applicationsPageSize = ref(50);
  const applicationsTotalCount = ref(0);
  const applicationsTotalPages = ref(0);

  // Applications query with pagination
  const applicationsQuery = useQuery({
    key: () => [
      'applications',
      'all',
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
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Single application query
  const applicationQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['applications', 'single', unref(id) || ''],
      query: () => {
        const appId = unref(id);
        if (!appId) throw new Error('Application ID is required');
        return $apiFetch<ApplicationResponseDto>(`/Applications/${appId}`);
      },
      enabled: () => !!unref(id),
      staleTime: 1 * 60 * 1000, // 1 minute for single application
    });
  };

  // Institution query
  const institutionQuery = (id: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['institutions', 'single', unref(id) || ''],
      query: () => {
        const instId = unref(id);
        if (!instId) throw new Error('Institution ID is required');
        return $apiFetch<InstitutionResponseDto>(`/Institutions/${instId}`);
      },
      enabled: () => !!unref(id),
      staleTime: 5 * 60 * 1000, // 5 minutes for institutions
    });
  };

  // Create application mutation
  const createApplicationMutation = useMutation({
    mutation: (
      applicationPayload: z.infer<
        ReturnType<typeof initInstitutionApplicationSchema>
      >
    ) => {
      const transformedPayload = {
        firstName: applicationPayload.firstName,
        lastName: applicationPayload.lastName,
        email: applicationPayload.email,
        phone: applicationPayload.phoneNumber,
        institutionName: applicationPayload.institutionName,
        institutionType: applicationPayload.institutionType,
        address: {
          country: applicationPayload.country,
          settlement: applicationPayload.settlement,
          street: applicationPayload.street,
          postalCode: applicationPayload.postalCode,
        },
      };

      return $apiFetch<ApplicationResponseDto>('/Applications', {
        method: 'POST',
        body: transformedPayload,
      });
    },
    onMutate: () => {
      processingSubmission.value = true;
    },
    onSuccess: (response) => {
      applicationData.value = response;

      if (response?.institution.id) {
        currentInstitutionId.value = response.institution.id;
      }

      currentStep.value = ApplicationStatus.Pending;
      error.value = null;

      // Refetch applications list
      applicationsQuery.refetch();
    },
    onError: (err) => {
      error.value = err;
      console.error('Error submitting application:', err);
    },
    onSettled: () => {
      processingSubmission.value = false;
    },
  });

  // Initialize institution mutation
  const initInstitutionMutation = useMutation({
    mutation: ({
      institutionData,
      files,
      logoFile,
    }: {
      institutionData: InitUniversityDto | InitSchoolDto;
      files: File[];
      logoFile?: File;
    }) => {
      if (!applicationData.value?.institution.id) {
        throw new Error('No institution ID found in application data');
      }

      const formData = new FormData();

      // Add basic fields from the institution data
      Object.entries(institutionData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add ID from application
      formData.append('id', applicationData.value!.institution.id);

      // Handle logo file if provided
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // Handle additional images
      files.forEach((file) => {
        formData.append('additionalImages', file);
      });

      const endpoint =
        selectedInstitutionCategory.value === 'higher-ed'
          ? '/Universities/init'
          : '/School/init';

      return $apiFetch(endpoint, {
        method: 'POST',
        body: formData,
      });
    },
    onMutate: () => {
      isProcessing.value = true;
    },
    onSuccess: () => {
      currentStep.value = ApplicationStatus.Verified;
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to initialize institution';
      console.error('Failed to initialize institution:', err);
      throw new Error(errorMessage);
    },
    onSettled: () => {
      isProcessing.value = false;
    },
  });

  // Authenticate via code mutation - UPDATED to use request body
  const authenticateViaCodeMutation = useMutation({
    mutation: (values: z.infer<typeof codeAuthSchema>) =>
      $apiFetch<ApplicationResponseDto>('/Applications/verify-code', {
        method: 'POST',
        body: {
          code: values.code,
          email: values.email,
        },
      }),
    onMutate: () => {
      isProcessing.value = true;
    },
    onSuccess: (response) => {
      authenticated.value = true;
      applicationData.value = response;
      currentApplicationId.value = response.id;
      error.value = null;

      if (import.meta.client) {
        localStorage.setItem(
          'authStatus',
          JSON.stringify({
            authenticated: true,
            applicationId: response.id,
          })
        );
      }

      currentStep.value = response.status as ApplicationStatus;
      navigateTo(`/onboarding/institution/${response.id}`);
    },
    onError: (err) => {
      error.value = err;
    },
    onSettled: () => {
      isProcessing.value = false;
    },
  });

  // Approve application mutation
  const approveApplicationMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/Applications/approve/${id}`, {
        method: 'PUT',
      }),
    onMutate: () => {
      isProcessing.value = true;
    },
    onSuccess: () => {
      // Refetch applications to get updated status
      applicationsQuery.refetch();
    },
    onError: (err) => {
      console.error('Failed to approve application:', err);
    },
    onSettled: () => {
      isProcessing.value = false;
    },
  });

  // Delete application mutation
  const deleteApplicationMutation = useMutation({
    mutation: (id: string) =>
      $apiFetch(`/Applications/${id}`, {
        method: 'DELETE',
      }),
    onMutate: () => {
      isProcessing.value = true;
    },
    onSuccess: (_, id) => {
      // Remove from local state - ensure applications is always an array
      if (Array.isArray(applications.value)) {
        applications.value = applications.value.filter((app) => app.id !== id);
      }

      // Clear current application if it was deleted
      if (currentApplicationId.value === id) {
        applicationData.value = null;
        currentApplicationId.value = null;
      }

      // Refetch applications
      applicationsQuery.refetch();
    },
    onError: (err) => {
      console.error('Failed to delete application:', err);
    },
    onSettled: () => {
      isProcessing.value = false;
    },
  });

  // Watch for applications query data changes - IMPROVED error handling and safety
  watch(
    () => applicationsQuery.data.value,
    (newApplicationsResponse) => {
      // Always ensure applications is an array, even if response is invalid
      try {
        if (
          newApplicationsResponse &&
          typeof newApplicationsResponse === 'object' &&
          'items' in newApplicationsResponse &&
          Array.isArray(newApplicationsResponse.items)
        ) {
          applications.value = newApplicationsResponse.items;
          applicationsTotalCount.value =
            newApplicationsResponse.totalCount || 0;
          applicationsTotalPages.value =
            newApplicationsResponse.totalPages || 0;
        } else {
          // Fallback to empty array if data is invalid
          applications.value = [];
          applicationsTotalCount.value = 0;
          applicationsTotalPages.value = 0;
        }
      } catch (error) {
        console.warn('Error processing applications data:', error);
        // Ensure fallback in case of any error
        applications.value = [];
        applicationsTotalCount.value = 0;
        applicationsTotalPages.value = 0;
      }
    },
    { immediate: true }
  );

  // Computed getter for available institution types
  const availableInstitutionTypes = computed(() => {
    if (selectedInstitutionCategory.value === 'school') {
      return [
        InstitutionType.PublicSchool,
        InstitutionType.PrivateSchool,
        InstitutionType.CharterSchool,
        InstitutionType.InternationalSchool,
        InstitutionType.PrimarySchool,
        InstitutionType.SecondarySchool,
        InstitutionType.HighSchool,
        InstitutionType.VocationalSchool,
        InstitutionType.SpecialEducationSchool,
        InstitutionType.LanguageSchool,
      ];
    } else if (selectedInstitutionCategory.value === 'higher-ed') {
      return [
        InstitutionType.PublicUniversity,
        InstitutionType.PrivateUniversity,
        InstitutionType.CommunityCollege,
        InstitutionType.TechnicalCollege,
        InstitutionType.LiberalArtsCollege,
      ];
    }
    return [
      InstitutionType.PublicSchool,
      InstitutionType.PrivateSchool,
      InstitutionType.CharterSchool,
      InstitutionType.InternationalSchool,
      InstitutionType.PrimarySchool,
      InstitutionType.SecondarySchool,
      InstitutionType.HighSchool,
      InstitutionType.VocationalSchool,
      InstitutionType.SpecialEducationSchool,
      InstitutionType.LanguageSchool,
      InstitutionType.PublicUniversity,
      InstitutionType.PrivateUniversity,
      InstitutionType.CommunityCollege,
      InstitutionType.TechnicalCollege,
      InstitutionType.LiberalArtsCollege,
    ];
  });

  // Helper function to extract error message from API response
  const extractErrorMessage = (error: any): string => {
    // Handle ProblemDetails response
    if (error?.data?.detail) {
      return error.data.detail;
    }

    // Handle validation errors
    if (error?.data?.errors) {
      const validationErrors = Object.values(error.data.errors).flat();
      return validationErrors.join(', ');
    }

    // Handle generic error message
    if (error?.data?.message) {
      return error.data.message;
    }

    // Handle simple string errors
    if (typeof error?.data === 'string') {
      return error.data;
    }

    // Fallback to error message
    return error?.message || 'An unexpected error occurred';
  };

  // Action-like functions maintaining your existing API
  const setInstitutionType = (type: InstitutionType) => {
    institutionType.value = type;
  };

  const setInstitutionCategory = (category: 'school' | 'higher-ed') => {
    selectedInstitutionCategory.value = category;
  };

  const setCategoryFromType = () => {
    console.log(selectedInstitution.value);
    if (!selectedInstitution.value?.type) return;

    const schoolTypes = new Set([
      InstitutionType.PublicSchool,
      InstitutionType.PrivateSchool,
      InstitutionType.CharterSchool,
      InstitutionType.InternationalSchool,
      InstitutionType.PrimarySchool,
      InstitutionType.SecondarySchool,
      InstitutionType.HighSchool,
      InstitutionType.VocationalSchool,
      InstitutionType.SpecialEducationSchool,
      InstitutionType.LanguageSchool,
    ]);

    setInstitutionCategory(
      schoolTypes.has(selectedInstitution.value.type as InstitutionType)
        ? 'school'
        : 'higher-ed'
    );
  };

  const initInstitution = async (
    institutionData: InitUniversityDto | InitSchoolDto,
    files: File[],
    logoFile?: File
  ) => {
    console.log(institutionData);

    // Set the category based on the institution type
    setCategoryFromType();

    return await initInstitutionMutation.mutateAsync({
      institutionData,
      files,
      logoFile,
    });
  };

  const createInstitutionApplication = async (
    applicationPayload: z.infer<
      ReturnType<typeof initInstitutionApplicationSchema>
    >
  ) => {
    console.log(applicationPayload);
    await createApplicationMutation.mutateAsync(applicationPayload);
  };

  const getInstitutionById = async (id: string) => {
    const query = institutionQuery(ref(id));
    await query.refetch();
    const response = query.data.value;

    if (response) {
      selectedInstitution.value = response;
      setCategoryFromType();
    }

    return response;
  };

  const getApplications = async () => {
    await applicationsQuery.refetch();
  };

  const getApplicationById = async (id: string) => {
    isProcessing.value = true;

    try {
      const query = applicationQuery(ref(id));
      await query.refetch();
      const response = query.data.value;

      if (response) {
        applicationData.value = response;
        institutionType.value = response.institution.type as InstitutionType;
        await getInstitutionById(response.institution.id);
        currentApplicationId.value = id;
        console.log('application response', response);
        currentStep.value = response.status as ApplicationStatus;
        setCategoryFromType();
      }

      return response;
    } finally {
      isProcessing.value = false;
    }
  };

  const authenticateViaCode = async (
    values: z.infer<typeof codeAuthSchema>
  ) => {
    await authenticateViaCodeMutation.mutateAsync(values);
  };

  const approveApplication = async (id: string) => {
    await approveApplicationMutation.mutateAsync(id);
  };

  const deleteApplication = async (id: string) => {
    await deleteApplicationMutation.mutateAsync(id);
  };

  const checkAuthStatus = () => {
    isProcessing.value = true;

    try {
      if (!import.meta.client) return false;

      const authStatus = localStorage.getItem('authStatus');
      if (!authStatus) return false;

      const { authenticated: isAuth, applicationId } = JSON.parse(authStatus);
      authenticated.value = isAuth;
      currentApplicationId.value = applicationId;
      error.value = null;
      return isAuth;
    } catch (err) {
      error.value = err;
      return false;
    } finally {
      isProcessing.value = false;
    }
  };

  // Pagination actions
  const setApplicationsPage = (page: number) => {
    applicationsPage.value = page;
  };

  const setApplicationsPageSize = (pageSize: number) => {
    applicationsPageSize.value = pageSize;
  };

  // Initialize auth status check on store creation
  if (import.meta.client) {
    checkAuthStatus();
  }

  // Computed getter for applications that always returns an array - CRITICAL FIX
  const safeApplications = computed(() => {
    return Array.isArray(applications.value) ? applications.value : [];
  });

  return {
    // State
    currentStep: readonly(currentStep),
    canSubmit: readonly(canSubmit),
    passedVerification: readonly(passedVerification),
    processingSubmission: readonly(processingSubmission),
    applicationData: readonly(applicationData),
    applications: readonly(safeApplications), // Use safe computed property
    authenticated: readonly(authenticated),
    error: readonly(error),
    currentApplicationId: readonly(currentApplicationId),
    institutionType: readonly(institutionType),
    currentInstitutionId: readonly(currentInstitutionId),
    isProcessing: readonly(isProcessing),
    selectedInstitution: readonly(selectedInstitution),
    selectedInstitutionCategory: readonly(selectedInstitutionCategory),

    // Pagination state
    applicationsPage: readonly(applicationsPage),
    applicationsPageSize: readonly(applicationsPageSize),
    applicationsTotalCount: readonly(applicationsTotalCount),
    applicationsTotalPages: readonly(applicationsTotalPages),

    // Computed getters
    availableInstitutionTypes,

    // Loading states
    isLoadingApplications: computed(() => applicationsQuery.isLoading.value),
    isCreatingApplication: computed(
      () => createApplicationMutation.isLoading.value
    ),
    isInitializingInstitution: computed(
      () => initInstitutionMutation.isLoading.value
    ),
    isAuthenticating: computed(
      () => authenticateViaCodeMutation.isLoading.value
    ),
    isApprovingApplication: computed(
      () => approveApplicationMutation.isLoading.value
    ),
    isDeletingApplication: computed(
      () => deleteApplicationMutation.isLoading.value
    ),

    // Combined loading state
    isLoading: computed(
      () =>
        applicationsQuery.isLoading.value ||
        createApplicationMutation.isLoading.value ||
        initInstitutionMutation.isLoading.value ||
        authenticateViaCodeMutation.isLoading.value ||
        approveApplicationMutation.isLoading.value ||
        deleteApplicationMutation.isLoading.value ||
        isProcessing.value
    ),

    // Actions (maintaining existing API)
    setInstitutionType,
    setInstitutionCategory,
    setCategoryFromType,
    initInstitution,
    createInstitutionApplication,
    getInstitutionById,
    getApplications,
    getApplicationById,
    authenticateViaCode,
    approveApplication,
    deleteApplication,
    checkAuthStatus,
    setApplicationsPage,
    setApplicationsPageSize,
    extractErrorMessage,

    // Query factories for dynamic usage
    applicationQuery,
    institutionQuery,

    // Direct access to main queries
    applicationsQuery,
  };
});
