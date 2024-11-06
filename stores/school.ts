import { defineStore } from 'pinia';

export type School = {
  id: string;
  name: string;
  motto: string;
  shortDescription: string;
  image: string;
};

export const useSchoolStore = defineStore('school', {
  state: (): {
    isLoading: boolean;
    schools: School[] | null;
  } => ({
    isLoading: true,
    schools: null,
  }),
  actions: {
    async getSchools(page = 1, pageSize = 10) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api.get<School[]>(`/School/list`, {
          page,
          pageSize,
        });
        this.schools = response;
      } catch (err) {
        console.error('Failed to fetch school list:', err);
        throw err;
      }
    },
  },
});
