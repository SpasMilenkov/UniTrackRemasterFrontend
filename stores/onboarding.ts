import { defineStore } from 'pinia';
import type { z } from 'zod';
import type { ApplicationResponseDto } from '~/interfaces/application-response.dto';
import type { codeAuthSchema } from '~/schemas/code-auth.schema';
import { InstitutionType } from '~/enums/institution-type.enum';
import type { initInstitutionApplicationSchema } from '~/schemas/init-institution-application.schema';
import type { InitUniversityDto } from '~/interfaces/organizations/init-university.dto';
import type { InitSchoolDto } from '~/interfaces/organizations/init-school.dto';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';
import { ApplicationStatus } from '~/enums/application-status.enum';

export const useOnboardingStore = defineStore('onboardingStore', {
  state: () => ({
    currentStep: null as ApplicationStatus | null,
    canSubmit: true,
    passedVerification: false,
    processingSubmission: false,
    applicationData: null as ApplicationResponseDto | null,
    applications: null as ApplicationResponseDto[] | null,
    authenticated: false,
    error: null as unknown,
    currentApplicationId: null as string | null,
    institutionType: null as InstitutionType | null,
    currentInstitutionId: null as string | null,
    isProcessing: false,
    selectedInstitution: null as InstitutionResponseDto | null,
    selectedInstitutionCategory: null as 'school' | 'higher-ed' | null,
  }),

  getters: {
    availableInstitutionTypes: (state) => {
      if (state.selectedInstitutionCategory === 'school') {
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
      } else if (state.selectedInstitutionCategory === 'higher-ed') {
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
    },
  },

  actions: {
    setInstitutionType(type: InstitutionType) {
      this.institutionType = type;
    },

    setInstitutionCategory(category: 'school' | 'higher-ed') {
      this.selectedInstitutionCategory = category;
    },

    setCategoryFromType() {
      console.log(this.selectedInstitution)
      if (!this.selectedInstitution?.type) return;

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

      this.setInstitutionCategory(
        schoolTypes.has(this.selectedInstitution.type as InstitutionType)
          ? 'school'
          : 'higher-ed'
      );
    },

    async initInstitution(
      institutionData: InitUniversityDto | InitSchoolDto,
      files: File[],
      logoFile?: File
    ) {
      console.log(institutionData)
      try {
        this.isProcessing = true;

        if (!this.applicationData?.institution.id) {
          throw new Error('No institution ID found in application data');
        }

        // Set the category based on the institution type
        this.setCategoryFromType();

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
        formData.append('id', this.applicationData.institution.id);

        // Handle logo file if provided
        if (logoFile) {
          formData.append('logo', logoFile);
        }

        // Handle additional images
        files.forEach((file) => {
          formData.append('additionalImages', file);
        });

        const { $api } = useNuxtApp();
        const endpoint =
          this.selectedInstitutionCategory === 'higher-ed'
            ? '/Universities/init'
            : '/School/init';

        const response = await $api.post(endpoint, formData);
        this.currentStep = ApplicationStatus.Verified;
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to initialize institution';
        console.error('Failed to initialize institution:', err);
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
      console.log(applicationPayload)
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

      try {
        const { $api } = useNuxtApp();
        this.applicationData = await $api.post<ApplicationResponseDto>(
          '/Applications',
          transformedPayload
        );

        if (this.applicationData?.institution.id) {
          this.currentInstitutionId = this.applicationData.institution.id;
        }

        this.currentStep = ApplicationStatus.Pending;
        this.processingSubmission = true;
      } catch (err) {
        this.error = err;
        console.error('Error submitting application:', err);
      } finally {
        this.processingSubmission = false;
      }
    },

    async getInstitutionById(id: string) {
      try {
        this.isProcessing = true;
        const { $api } = useNuxtApp();

        const response = await $api.get<InstitutionResponseDto>(
          `/Institutions/${id}`
        );
        this.selectedInstitution = response;
        this.setCategoryFromType()
        return response;
      } catch (err) {
        console.error('Failed to fetch institution:', err);
        throw err;
      } finally {
        this.isProcessing = false;
      }
    },

    async getApplications() {
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
      this.isProcessing = true;
      try {
        const { $api } = useNuxtApp();
        const response = await $api.get<ApplicationResponseDto>(
          `/Applications/${id}`
        );

        this.applicationData = response;
        this.institutionType = response.institution.type as InstitutionType;
        this.getInstitutionById(response.institution.id)
        this.currentApplicationId = id;
        console.log('application response', response)
        this.currentStep = response.status as ApplicationStatus;  
        this.setCategoryFromType()
        return response;
      } catch (err) {
        console.error('Error fetching application:', err);
        throw err;
      } finally {
        this.isProcessing = false;
      }
    },

    async authenticateViaCode(values: z.infer<typeof codeAuthSchema>) {
      this.isProcessing = true;
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

        localStorage.setItem(
          'authStatus',
          JSON.stringify({
            authenticated: true,
            applicationId: response.id,
          })
        );

        this.currentStep = response.status as ApplicationStatus;

        navigateTo(`/onboarding/institution/${response.id}`);
      } catch (err) {
        this.error = err;
      } finally {
        this.isProcessing = false;
      }
    },

    async approveApplication(id: string) {
      this.isProcessing = true;
      try {
        const { $api } = useNuxtApp();
        await $api.put(`/Applications/approve/${id}`);
      } catch (err) {
        console.error('Failed to approve application:', err);
        throw err;
      } finally {
        this.isProcessing = false;
      }
    },

    async deleteApplication(id: string) {
      this.isProcessing = true;
      try {
        const { $api } = useNuxtApp();
        await $api.delete(`/Applications/${id}`);
      } catch (err) {
        console.error('Failed to delete application:', err);
        throw err;
      } finally {
        this.isProcessing = false;
      }
    },

    checkAuthStatus() {
      this.isProcessing = true;
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
      } finally {
        this.isProcessing = false;
      }
    },
  },
});
