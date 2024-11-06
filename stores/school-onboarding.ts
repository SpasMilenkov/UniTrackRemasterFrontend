import { defineStore } from 'pinia';
import type { z } from 'zod';
import type { initSchoolApplicationSchema } from '~/schemas/init-school-application.schema';
import type { ApplicationResponseDto } from '~/types/application-response.dto';
import type { codeAuthSchema } from '~/schemas/code-auth.schema';

export const useSchoolOnboardingStore = defineStore('schoolOnboardingStore', {
  state: (): {
    currentStep: number;
    canSubmit: boolean;
    passedVerification: boolean;
    processingSubmission: boolean;
    applicationData: ApplicationResponseDto | null;
    applications: ApplicationResponseDto[] | null;
    authenticated: boolean;
    error: unknown;
  } => ({
    currentStep: 1,
    canSubmit: true,
    passedVerification: false,
    processingSubmission: false,
    applicationData: null,
    applications: null,
    authenticated: false,
    error: null as unknown,
  }),
  actions: {
    async createSchoolApplication(
      applicationPayload: z.infer<typeof initSchoolApplicationSchema>
    ) {
      const transformApplicationPayload = (
        applicationPayload: z.infer<typeof initSchoolApplicationSchema>
      ) => {
        return {
          firstName: applicationPayload.firstName,
          lastName: applicationPayload.lastName,
          email: applicationPayload.email,
          phone: applicationPayload.phoneNumber,
          address: {
            country: applicationPayload.country,
            settlement: applicationPayload.city,
            street: applicationPayload.street,
            postalCode: applicationPayload.postcode,
          },
          schoolName: applicationPayload.schoolName,
        };
      };

      try {
        const { $api } = useNuxtApp();
        this.applicationData = await $api.post<ApplicationResponseDto>(
          '/Application',
          transformApplicationPayload(applicationPayload)
        );
        this.currentStep = 2;
        this.processingSubmission = true;
      } catch (err) {
        this.error = err;
        console.error('Error submitting application:', err);
      }
    },
    async getSchoolApplications() {
      try {
        const { $api } = useNuxtApp();
        this.applications = await $api.get<ApplicationResponseDto[]>(
          '/Application'
        );
      } catch (err) {
        this.error = err;
        console.error('Error fetching applications:', err);
      }
    },
    async authenticateViaCode(values: z.infer<typeof codeAuthSchema>) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api.post<ApplicationResponseDto>(
          '/Application/login-with-code',
          undefined,
          values
        );
        this.authenticated = true;
        this.applicationData = response;
        this.error = null;
        navigateTo('/onboarding/school');
      } catch (err) {
        this.error = err;
        console.error('Error authenticating via code', err);
      }
    },
    async approveApplication(id: string) {
      try {
        const { $api } = useNuxtApp();
        await $api.put(`/Application/approve`, undefined, {
          applicationId: id,
        });
      } catch (err) {
        console.error('Failed to approve application:', err);
        throw err;
      }
    },

    async deleteApplication(id: string) {
      try {
        const { $api } = useNuxtApp();
        await $api.delete(`/Application/${id}`);
      } catch (err) {
        console.error('Failed to update application:', err);
        throw err;
      }
    },
  },
});
