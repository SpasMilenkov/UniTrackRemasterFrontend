import { defineStore } from 'pinia';

export type School = {
  name: string;
  motto: string;
  shortDescription: string;
  image: string;
};

export const useSchoolStore = defineStore('school', {
  state: () => ({
    isLoading: true,
  }),
  actions: {
    async fetchSchools(): Promise<School[]> {
      this.isLoading = false;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              name: 'Greenfield High',
              motto: 'Excellence and Integrity',
              shortDescription:
                'Greenfield High is dedicated to academic excellence and nurturing well-rounded individuals.',
              image: '/img/UniTrack.png',
            },
            {
              name: 'Greenfield High2',
              motto: 'Excellence and Integrity',
              shortDescription:
                'Greenfield High is dedicated to academic excellence and nurturing well-rounded individuals.',
              image: '/img/UniTrack.png',
            },
            {
              name: 'Greenfield High3',
              motto: 'Excellence and Integrity',
              shortDescription:
                'Greenfield High is dedicated to academic excellence and nurturing well-rounded individuals.',
              image: '/img/UniTrack.png',
            },
          ]);
        }, 3000);
      }).then((resolve) => {
        this.isLoading = true;
        return resolve as School[];
      });
    },
  },
});
