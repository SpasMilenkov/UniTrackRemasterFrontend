import { defineStore } from 'pinia';
// import type { InitSchoolDto } from '~/interfaces/organizations/init-school.dto';
import type { School } from '~/interfaces/organizations/school';
import type { SchoolFilterParams } from '~/interfaces/school-filter.dto';

export const useSchoolStore = defineStore('school', {
  state: () => ({
    isLoading: true,
    schools: null as School[] | null,
    selectedSchool: null as School | null,
    error: null as string | null,
  }),
  actions: {
    async getSchoolById(schoolId: string) {
      try {
        this.isLoading = true;
        this.error = null;
        const { $api } = useNuxtApp();

        // Call the API endpoint to get the school details
        const response = await $api.get<School>(`/School/${schoolId}`);
        this.selectedSchool = response;
        return response;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Failed to fetch school';
        console.error('Failed to fetch school:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async getSchools(params: SchoolFilterParams) {
      try {
        const { $api } = useNuxtApp();
        const queryParams = new URLSearchParams();

        if (params.searchTerm) {
          queryParams.append('searchTerm', params.searchTerm);
        }

        queryParams.append('page', params.page.toString());
        queryParams.append('pageSize', params.pageSize.toString());

        const response = await $api.get<School[]>(
          `/School/list?${queryParams.toString()}`
        );
        this.schools = response;
      } catch (err) {
        console.error('Failed to fetch school list:', err);
        throw err;
      }
    },
  },
});
