import { defineStore } from 'pinia';
import type { z } from 'zod';
import type { loginSchema } from '~/schemas/login.schema';
import type { registerSchema } from '~/schemas/register.schema';
import type { LoginResponseDto } from '~/interfaces/login-response.dto';
import type { registerGuestSchema } from '~/schemas/register-guest.schema';
type LoginPayload = z.infer<typeof loginSchema>;
type RegisterPayload = z.infer<ReturnType<typeof registerSchema>>;
type RegisterGuestPayload = z.infer<ReturnType<typeof registerGuestSchema>>;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: {} as LoginResponseDto,
    emailForReset: null as string | null,
    error: null as string | null,
    roles: null as { id: string; name: string }[] | null,
  }),
  actions: {
    async login(data: LoginPayload) {
      try {
        const user = await useNuxtApp().$api.post<LoginResponseDto>(
          '/Auth/login',
          data,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        this.isAuthenticated = true;
        this.user = user;
        this.error = null;
        localStorage.setItem('isAuthenticated', 'true');
        await navigateTo('/users/dashboard');
      } catch (error: any) {
        console.error('Login failed:', error);
        this.error = error.message;
      }
    },

    async validateSession() {
      if (!this.user?.id) {
        this.clearAuth();
        return false;
      }

      try {
        const user =
          await useNuxtApp().$api.get<LoginResponseDto>('/User/current');
        if (user) {
          this.isAuthenticated = true;
          this.user = user;
          return true;
        }
      } catch {
        this.clearAuth();
        return false;
      }

      this.clearAuth();
      return false;
    },

    clearAuth() {
      this.isAuthenticated = false;
      this.user = {} as LoginResponseDto;
    },

    async register(data: RegisterPayload) {
      try {
        await useNuxtApp().$api.post<LoginResponseDto>('/Auth/register', data);
        this.error = null;
        await navigateTo({ path: '/login' });
      } catch (error: any) {
        console.error('Registration failed:', error);
        this.error = error.message;
      }
    },

    async registerGuest(data: RegisterGuestPayload) {
      try {
        await useNuxtApp().$api.post<LoginResponseDto>(
          '/Auth/register-guest',
          data
        );
        this.error = null;
        await navigateTo({ path: '/login' });
      } catch (error: any) {
        console.error('Registration of guest failed:', error);
        this.error = error.message;
      }
    },

    async forgotPassword(email: string) {
      try {
        await useNuxtApp().$api.post(
          `/Auth/forgot-password?email=${email}`,
          null
        );
        this.emailForReset = email;
      } catch (error: any) {
        console.error('Forgot password failed:', error);
        this.error = error;
      }
    },

    async resetPassword({
      email,
      token,
      password,
    }: {
      email: string;
      token: string;
      password: string;
    }) {
      try {
        await useNuxtApp().$api.post('/auth/reset-password', {
          email,
          token,
          newPassword: password,
        });
        return true;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    async logout() {
      try {
        await useNuxtApp().$api.post('/Auth/logout', undefined);
        this.isAuthenticated = false;
        this.user = {} as LoginResponseDto;
        localStorage.removeItem('isAuthenticated');
        await navigateTo('/login');
      } catch (error: any) {
        console.error('Logout failed:', error);
      }
    },

    async getRoles() {
      try {
        this.roles =
          await useNuxtApp().$api.get<{ id: string; name: string }[]>(
            '/User/public'
          );
      } catch (error: any) {
        console.error('Forgot password failed:', error);
        this.error = error.message;
      }
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
