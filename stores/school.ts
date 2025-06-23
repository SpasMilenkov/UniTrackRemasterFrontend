import { defineStore } from 'pinia';
import { useQuery } from '@pinia/colada';
import type { SchoolFilters } from '~/interfaces/school/school-filter';
import type { SchoolWithAddressResponseDto } from '~/interfaces/school/shcool-with-address-response.dto';
// import type { SchoolWithAddressResponseDto } from ;
// import type { SchoolFilterDto } from '~/interfaces/school-filter.dto';

// Types for the store




// ~/interfaces/schools/school-with-address-response.dto.ts

export const useSchoolStore = defineStore('school', () => {
  if (import.meta.server) {
    return {
      // State
      schools: readonly(ref([])),
      activeSchool: readonly(ref(null)),
      error: readonly(ref(null)),

      // Loading states
      loading: false,
      isLoading: false,
      isLoadingSchools: false,
      isLoadingSchool: false,
      isLoadingAny: false,

      // Actions
      fetchSchoolById: async () => null,
      fetchSchoolByInstitutionId: async () => null,
      getSchools: async () => [],
      setActiveSchool: () => {},
      clearActiveSchool: () => {},

      // Query factories
      schoolsQuery: () => null,
      schoolQuery: () => null,
      schoolByInstitutionQuery: () => null,
      watchSchoolQuery: () => null,
    };
  }

  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const schools = ref<SchoolWithAddressResponseDto[]>([]);
  const activeSchool = ref<SchoolWithAddressResponseDto | null>(null);
  const error = ref<string | null>(null);

  // All schools query with filtering
  const schoolsQuery = (params: MaybeRef<SchoolFilters | null>) => {
    return useQuery({
      key: () => {
        const filterParams = unref(params);
        if (!filterParams) return ['schools', 'list', 'none'];

        return [
          'schools',
          'list',
          {
            searchTerm: filterParams.searchTerm || '',
            types: filterParams.types?.join(',') || '',
            page: filterParams.page,
            pageSize: filterParams.pageSize,
          },
        ];
      },
      query: () => {
        const filterParams = unref(params);
        if (!filterParams) throw new Error('Filter parameters are required');

        const queryParams = new URLSearchParams();

        if (filterParams.searchTerm?.trim()) {
          queryParams.append('searchTerm', filterParams.searchTerm.trim());
        }
        if (filterParams.types?.length) {
          filterParams.types.forEach((type) => {
            queryParams.append('types', type);
          });
        }
        queryParams.append('page', filterParams.page.toString());
        queryParams.append('pageSize', filterParams.pageSize.toString());

        return $apiFetch<SchoolWithAddressResponseDto[]>(
          `/School?${queryParams.toString()}`
        );
      },
      enabled: () => !!unref(params) && import.meta.client,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Single school query by ID
  const schoolQuery = (schoolId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['schools', 'single', unref(schoolId) || ''],
      query: () => {
        const id = unref(schoolId);
        if (!id) throw new Error('School ID is required');
        return $apiFetch<SchoolWithAddressResponseDto>(`/School/${id}`);
      },
      enabled: () => !!unref(schoolId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes for single records
    });
  };

  // School query by institution ID
  const schoolByInstitutionQuery = (institutionId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['schools', 'institution', unref(institutionId) || ''],
      query: () => {
        const id = unref(institutionId);
        if (!id) throw new Error('Institution ID is required');
        return $apiFetch<SchoolWithAddressResponseDto>(
          `/School/institution/${id}`
        );
      },
      enabled: () => !!unref(institutionId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes for single records
    });
  };

  // Watch for school query data changes to update active school
  const watchSchoolQuery = (schoolId: MaybeRef<string | null>) => {
    const query = schoolQuery(schoolId);

    watch(
      () => query.data.value,
      (school) => {
        if (school) {
          activeSchool.value = school;
          error.value = null;
        }
      },
      { immediate: true }
    );

    watch(
      () => query.error.value,
      (queryError) => {
        if (queryError) {
          error.value =
            queryError instanceof Error
              ? queryError.message
              : 'Failed to fetch school';
        }
      }
    );

    return query;
  };

  // Fetch school by ID (matches the pattern expected by the enhanced page)
  const fetchSchoolById = async (schoolId: string) => {
    try {
      error.value = null;
      const query = schoolQuery(ref(schoolId));
      await query.refetch();

      const response = query.data.value;
      if (response) {
        activeSchool.value = response;
      }

      return response;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to fetch school';
      console.error('Failed to fetch school:', err);
      throw err;
    }
  };

  // Fetch school by institution ID
  const fetchSchoolByInstitutionId = async (institutionId: string) => {
    try {
      error.value = null;
      const query = schoolByInstitutionQuery(ref(institutionId));
      await query.refetch();

      const response = query.data.value;
      if (response) {
        activeSchool.value = response;
      }

      return response;
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Failed to fetch school by institution ID';
      console.error('Failed to fetch school by institution ID:', err);
      throw err;
    }
  };

  // Get schools with filtering (maintaining backward compatibility)
  const getSchools = async (params: SchoolFilters) => {
    try {
      const filterParams: SchoolFilters = {
        searchTerm: params.searchTerm,
        types: params.types,
        page: params.page || 1,
        pageSize: params.pageSize || 50,
      };

      const query = schoolsQuery(ref(filterParams));
      await query.refetch();

      const response = query.data.value;
      if (response) {
        schools.value = response;
      }

      return response || [];
    } catch (err) {
      console.error('Failed to fetch school list:', err);
      throw err;
    }
  };

  // Set active school (for programmatic selection)
  const setActiveSchool = (school: SchoolWithAddressResponseDto) => {
    activeSchool.value = school;
    error.value = null;
  };

  // Clear active school
  const clearActiveSchool = () => {
    activeSchool.value = null;
  };

  // Computed loading states
  const isLoadingSchools = computed(() => {
    // Could be enhanced to track specific queries if needed
    return false;
  });

  const isLoadingSchool = computed(() => {
    // Could be enhanced to track specific queries if needed
    return false;
  });

  const isLoadingAny = computed(() => {
    return isLoadingSchools.value || isLoadingSchool.value;
  });

  return {
    // State
    schools: readonly(schools),
    activeSchool: readonly(activeSchool),
    error: readonly(error),

    // Loading states (maintaining backward compatibility)
    loading: computed(() => isLoadingAny.value),
    isLoading: computed(() => isLoadingAny.value),
    isLoadingSchools,
    isLoadingSchool,
    isLoadingAny,

    // Actions
    fetchSchoolById,
    fetchSchoolByInstitutionId,
    getSchools,
    setActiveSchool,
    clearActiveSchool,

    // Query factories for dynamic usage
    schoolsQuery,
    schoolQuery,
    schoolByInstitutionQuery,
    watchSchoolQuery,
  };
});
