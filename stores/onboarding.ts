import { defineStore } from 'pinia';
import type { z } from 'zod';
import type { ApplicationResponseDto } from '~/interfaces/application-response.dto';
import type { codeAuthSchema } from '~/schemas/code-auth.schema';
import type { InstitutionType } from '~/enums/institution-type.enum';
import type { initInstitutionApplicationSchema } from '~/schemas/init-institution-application.schema';
import type { InitUniversityDto } from '~/interfaces/organizations/init-university.dto';

export const useOnboardingStore = defineStore('onboardingStore', {
  state: (): {
    currentStep: number;
    canSubmit: boolean;
    passedVerification: boolean;
    processingSubmission: boolean;
    applicationData: ApplicationResponseDto | null;
    applications: ApplicationResponseDto[] | null;
    authenticated: boolean;
    error: unknown;
    currentApplicationId: string | null;
    institutionType: InstitutionType | null;
    currentInstitutionId: string | null;
    isProcessing: boolean;
  } => ({
    currentStep: 1,
    canSubmit: true,
    passedVerification: false,
    processingSubmission: false,
    applicationData: null,
    applications: null,
    authenticated: false,
    error: null as unknown,
    currentApplicationId: null as string | null,
    institutionType: null,
    currentInstitutionId: null as string | null,
    isProcessing: false,
  }),
  actions: {
    setInstitutionType(type: InstitutionType) {
      this.institutionType = type;
    },
    async initUniversity(universityData: InitUniversityDto, files: File[]) {
      try {
        this.isProcessing = true;
        const { $api } = useNuxtApp();

        if (!this.applicationData?.institution.id) {
          throw new Error('No institution ID found in application data');
        }

        const formData = new FormData();

        // Basic Information
        formData.append('id', this.applicationData.institution.id);
        formData.append('name', universityData.name);
        formData.append('motto', universityData.motto);
        formData.append('description', universityData.description);

        // Contact Information
        formData.append('email', universityData.email);
        formData.append('phone', universityData.phone);
        formData.append('website', universityData.website);
        formData.append(
          'establishedDate',
          universityData.establishedDate.toISOString()
        );

        // Academic Information
        formData.append(
          'undergraduateCount',
          universityData.undergraduateCount.toString()
        );
        formData.append(
          'graduateCount',
          universityData.graduateCount.toString()
        );
        formData.append(
          'acceptanceRate',
          universityData.acceptanceRate.toString()
        );
        formData.append(
          'researchFunding',
          universityData.researchFunding.toString()
        );
        formData.append(
          'hasStudentHousing',
          universityData.hasStudentHousing.toString()
        );

        universityData.focusAreas.forEach((area) => {
          formData.append('focusAreas', area.toString());
        });

        universityData.departments.forEach((department) => {
          formData.append('departments', department);
        });

        universityData.accreditations.forEach((accreditation) => {
          formData.append('accreditations', accreditation.toString());
        });

        // Handle files
        // First file is treated as logo if present
        if (files.length > 0) {
          formData.append('logo', files[0]);

          // Remaining files are treated as additional images
          files.slice(1).forEach((file) => {
            formData.append('additionalImages', file);
          });
        }

        const response = await $api.post<{
          message: string;
          fileUrls: string[];
        }>('/universities/init', formData);

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to initialize university';
        console.error('Failed to initialize university:', err);
        throw new Error(errorMessage);
      } finally {
        this.isProcessing = false;
      }
    },
    async createInstitutionApplication(
      applicationPayload: z.infer<
        ReturnType<typeof initInstitutionApplicationSchema>
      >
    ) {
      const transformedPayload = {
        firstName: applicationPayload.firstName,
        lastName: applicationPayload.lastName,
        email: applicationPayload.email,
        phone: applicationPayload.phoneNumber,
        institutionName: applicationPayload.institutionName,
        institutionType: Number(this.institutionType),
        address: {
          country: applicationPayload.country,
          settlement: applicationPayload.settlement,
          street: applicationPayload.street,
          postalCode: applicationPayload.postalCode,
        },
      };

      try {
        const { $api } = useNuxtApp();
        this.applicationData = await $api.post<ApplicationResponseDto>(
          '/Applications',
          transformedPayload
        );

        if (this.applicationData && this.applicationData.institution.id) {
          this.currentInstitutionId = this.applicationData.institution.id;
        }

        this.currentStep = 3;
        this.processingSubmission = true;
      } catch (err) {
        this.error = err;
        console.error('Error submitting application:', err);
      }
    },
    async getSchoolApplications() {
      try {
        const { $api } = useNuxtApp();
        this.applications =
          await $api.get<ApplicationResponseDto[]>('/Applications');

      } catch (err) {
        this.error = err;
        console.error('Error fetching applications:', err);
      }
    },
    async getApplicationById(id: string) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api.get<ApplicationResponseDto>(
          `/Applications/${id}`
        );

        this.applicationData = response;
        this.institutionType = Number(response.institution.type);
        this.currentApplicationId = id;

        if (response) {
          this.setStepFromStatus(response.status);
        }

        return response;
      } catch (err) {
        console.error('Error fetching application:', err);
        throw err;
      }
    },

    checkAuthStatus() {
      try {
        const authStatus = localStorage.getItem('authStatus');
        if (!authStatus) return false;

        const { authenticated, applicationId } = JSON.parse(authStatus);
        this.authenticated = authenticated;
        this.currentApplicationId = applicationId;
        this.error = null;
        return authenticated;
      } catch (error) {
        this.error = error;
        return false;
      }
    },
    setStepFromStatus(status: number) {
      switch (status) {
        case 0: // Pending approval after the form has been initially submitted
          this.currentStep = 2;
          break;
        case 1: // The form has been approved and now the user has to submit detailed school information
          this.currentStep = 3;
          break;
        case 3: // The final form has been submitted successfully and now the integration process is completed
          this.currentStep = 4;
          break;
        default: // Redirect to the initial form.
          this.currentStep = 1;
      }
    },
    async authenticateViaCode(values: z.infer<typeof codeAuthSchema>) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api.post<ApplicationResponseDto>(
          '/Applications/verify-code',
          undefined,
          values
        );

        this.authenticated = true;
        this.applicationData = response;
        this.currentApplicationId = response.id;
        this.error = null;

        // Store authentication state in localStorage
        localStorage.setItem(
          'authStatus',
          JSON.stringify({
            authenticated: true,
            applicationId: response.id,
          })
        );

        // Determine correct step based on application status
        if (response) {
          this.setStepFromStatus(response.status);
        }

        // Navigate with ID in URL
        navigateTo(`/onboarding/institution/${response.id}`);
      } catch (err) {
        this.error = err;
      }
    },
    async approveApplication(id: string) {
      try {
        const { $api } = useNuxtApp();
        await $api.put(`/Applications/approve/${id}`);
      } catch (err) {
        console.error('Failed to approve application:', err);
        throw err;
      }
    },
    async deleteApplication(id: string) {
      try {
        const { $api } = useNuxtApp();
        await $api.delete(`/Applications/${id}`);
      } catch (err) {
        console.error('Failed to update application:', err);
        throw err;
      }
    },
  },
});
