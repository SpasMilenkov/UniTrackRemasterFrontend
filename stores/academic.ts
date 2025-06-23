// stores/academic.ts
import { defineStore } from 'pinia';
import { useDepartmentStore } from '~/stores/department';
import { useFacultyStore } from '~/stores/faculty';
import { useGradeStore } from '~/stores/grade';
import { useMajorStore } from '~/stores/major';
import { useSubjectStore } from '~/stores/subject';
import { useUserStore } from '~/stores/user';
// import type { University } from '~/interfaces/organizations/university';

/**
 * This store acts as a coordinator for all academic-related stores.
 * It doesn't hold any state itself but provides methods to initialize
 * and interact with all academic stores in a coordinated way.
 */
export const useAcademicStore = defineStore('academic', {
  // State is minimal since actual data is stored in respective stores
  state: () => ({
    initialized: false,
    institutionIdentifier: '' as string,
    isHigherEd: false,
  }),

  getters: {
    // Determine if we're viewing a university or school
    isUniversity: () => {
      const userStore = useUserStore();
      const activeInstitution = userStore.activeInstitution;

      if (!activeInstitution) return false;

      return isHigherEducation(activeInstitution?.type);
    },
  },

  actions: {
    /**
     * Initialize all academic stores based on the institution type
     */
    async initializeStore() {
      const isUniversity = this.isUniversity;
      // const facultyStore = useFacultyStore();
      const departmentStore = useDepartmentStore();
      const majorStore = useMajorStore();
      const gradeStore = useGradeStore();
      const subjectStore = useSubjectStore();
      // const clubStore = useClubStore();

      if (isUniversity) {
        // University-specific initialization
        // await facultyStore.initializeUniversities();
        // await facultyStore.fetchFaculties();
        await departmentStore.fetchDepartments();
        await majorStore.fetchMajors();
      } else {
        // School-specific initialization
        await gradeStore.fetchGrades();
        // await subjectStore.fetchSubjects();
      }

      // Common for both institution types
      // await clubStore.fetchClubs();

      this.initialized = true;
    },

    /**
     * Reset all academic stores when needed (e.g., switching institutions)
     */
    resetStores() {
      // const facultyStore = useFacultyStore();
      // const departmentStore = useDepartmentStore();
      // const majorStore = useMajorStore();
      // const gradeStore = useGradeStore();
      // const subjectStore = useSubjectStore();
      // const clubStore = useClubStore();

      // Use the $reset method from Pinia to reset each store to its initial state
      // facultyStore.$reset();
      // departmentStore.$reset();
      // majorStore.$reset();
      // gradeStore.$reset();
      // subjectStore.$reset();

      this.initialized = false;
    },
  },
});
