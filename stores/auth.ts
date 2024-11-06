// store/auth.ts
import { defineStore } from 'pinia';
import type { z } from 'zod';
import type { loginSchema } from '~/schemas/login.schema';
import type { registerSchema } from '~/schemas/register.schema';
import type { LoginResponseDto } from '~/types/login-response.dto';

type LoginPayload = z.infer<typeof loginSchema>;
type RegisterPayload = z.infer<typeof registerSchema>;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: {} as LoginResponseDto,
    error: null as string | null,
    roles: null as { id: string; name: string }[] | null,
  }),
  actions: {
    async login(data: LoginPayload) {
      try {
        const user = await useNuxtApp().$api.post<LoginResponseDto>(
          '/Auth/login',
          data
        );
        this.isAuthenticated = true;
        this.user = user;
        this.error = null;
      } catch (error: any) {
        console.error('Login failed:', error);
        this.error = error.message;
      }
    },
    async register(data: RegisterPayload) {
      try {
        const user = await useNuxtApp().$api.post<LoginResponseDto>(
          '/Auth/register',
          data
        );
        this.isAuthenticated = true;
        this.user = user;
        this.error = null;
        await navigateTo({ path: '/login' });
      } catch (error: any) {
        console.error('Registration failed:', error);
        this.error = error.message;
      }
    },
    async forgotPassword(email: string) {
      try {
        await useNuxtApp().$api.post(
          `/api/Auth/forgot-password?email=${email}`,
          null
        );
        // Handle success logic (e.g., show notification)
      } catch (error: any) {
        console.error('Forgot password failed:', error);
        this.error = error;
      }
    },
    async logout() {
      try {
        await useNuxtApp().$api.post('/Auth/logout', undefined);
      } catch (error: any) {
        console.error('Logout failed:', error);
      }
    },
    async refreshToken() {
      try {
        await useNuxtApp().$api.post('/Auth/refresh-token', undefined);
        // Handle token refresh logic (e.g., update state if necessary)
      } catch (error: any) {
        console.error('Token refresh failed:', error);
      }
    },
    async getRoles() {
      try {
        this.roles = await useNuxtApp().$api.get<
          { id: string; name: string }[]
        >('/User/public');
        console.log(this.roles);
      } catch (error: any) {
        console.error('Forgot password failed:', error);
        this.error = error.message;
      }
    },
  },
});
