import { defineStore } from 'pinia';
import { IntegrationStatus } from '~/enums/integration-status.enum';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';

export const useInstitutionStore = defineStore('institution', {
  state: () => ({
    institutions: [] as InstitutionResponseDto[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUserInstitutions(userId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await useNuxtApp().$api.get<InstitutionResponseDto[]>(
          `/Institutions/user/${userId}`
        );
        this.institutions = response;
      } catch (error: any) {
        console.error('Failed to fetch institutions:', error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    hasInstitutions: (state) => state.institutions.length > 0,
    activeInstitutions: (state) =>
      state.institutions.filter(
        (inst) => inst.integrationStatus === IntegrationStatus.Active
      ),
    pendingInstitutions: (state) =>
      state.institutions.filter(
        (inst) => inst.integrationStatus === IntegrationStatus.Inactive
      ),
  },
});
