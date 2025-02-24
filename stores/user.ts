import { defineStore } from 'pinia';
import type { AdminDto } from '~/interfaces/admin.dto';
import type { StudentResponseDto } from '~/interfaces/student.dto';
import type { UserDetails } from '~/interfaces/user/user-details';

export const useUserStore = defineStore('user', {
  state: () => ({
    userDetails: null as UserDetails | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUserDetails(userId: string) {
      if (!userId) return;

      this.loading = true;
      try {
        const adminData = await useNuxtApp().$api.get<AdminDto>(
          `/Admin/user/${userId}`
        );
        this.userDetails = {
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          isLinked: !!adminData.institutionId,
          role: 'admin',
          institutionId: adminData.institutionId,
        };
      } catch {
        try {
          const studentData = await useNuxtApp().$api.get<StudentResponseDto>(
            `/Students/${userId}`
          );
          this.userDetails = {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            isLinked:
              studentData.isSchoolStudent || studentData.isUniversityStudent,
            role: 'student',
            institutionId: studentData.schoolId || studentData.universityId,
          };
        } catch (error: any) {
          this.error = error.message;
        }
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    displayName: (state) => {
      if (!state.userDetails) return '';
      return `${state.userDetails.firstName} ${state.userDetails.lastName}`;
    },
    isInstitutionLinked: (state) => {
      return !!state.userDetails?.isLinked;
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
