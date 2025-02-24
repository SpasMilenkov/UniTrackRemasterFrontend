import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';

type RequestData =
  | BodyInit
  | Record<string, unknown>
  | FormData
  | null
  | undefined;

interface ApiService {
  get<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
  post<T>(
    endpoint: string,
    data?: RequestData,
    params?: Record<string, any>
  ): Promise<T>;
  put<T>(
    endpoint: string,
    data?: RequestData,
    params?: Record<string, any>
  ): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}

let apiInstance: ReturnType<typeof createApi> | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve('');
    }
  });
  failedQueue = [];
};

const createApi = () => {
  const nuxtApp = useNuxtApp();
  const baseUrl = nuxtApp.$config.public.apiBaseURL;

  const refreshToken = async () => {
    try {
      await $fetch(`${baseUrl}/Auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });
      return true;
    } catch {
      return false;
    }
  };

  const makeRequest = async <T>(
    endpoint: string,
    options: Partial<NitroFetchOptions<NitroFetchRequest>> = {}
  ) => {
    try {
      const headers: Record<string, string> = {};
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      return await $fetch<T>(`${baseUrl}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
          ...(options.body instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' }),
          ...options.headers,
        },
      });
    } catch (error: any) {
      // handle 401 and 403 errors
      if (error.status === 401 || error.status === 403) {
        if (endpoint === '/Auth/refresh-token') {
          // if refreshing token fails, clear auth and redirect to login 
          const authStore = useAuthStore();
          authStore.clearAuth();
          navigateTo('/login');
          throw error;
        }

        if (isRefreshing) {
          // wait for the token to be refreshed
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((): any => {
              // retry the original request
              return makeRequest<T>(endpoint, options);
            })
            .catch((err) => {
              throw err;
            });
        }

        isRefreshing = true;

        try {
          const refreshSuccess = await refreshToken();
          isRefreshing = false;

          if (refreshSuccess) {
            processQueue();
            // retry the original request
            return makeRequest<T>(endpoint, options);
          } else {
            processQueue(new Error('Failed to refresh token'));
            // clear auth and redirect to login
            const authStore = useAuthStore();
            authStore.clearAuth();
            navigateTo('/login');
            throw error;
          }
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError);
          throw refreshError;
        }
      }

      console.error('API request failed:', error);
      throw error;
    }
  };

  return {
    get: <T>(endpoint: string, params?: Record<string, any>) =>
      makeRequest<T>(endpoint, { params }),
    post: <T>(
      endpoint: string,
      data?: RequestData,
      params?: Record<string, any>
    ) => makeRequest<T>(endpoint, { method: 'POST', body: data, params }),
    put: <T>(
      endpoint: string,
      data?: RequestData,
      params?: Record<string, any>
    ) => makeRequest<T>(endpoint, { method: 'PUT', body: data, params }),
    delete: <T>(endpoint: string) =>
      makeRequest<T>(endpoint, { method: 'DELETE' }),
  };
};

export default defineNuxtPlugin(() => {
  if (!apiInstance) {
    apiInstance = createApi();
  }
  return {
    provide: {
      api: apiInstance as ApiService,
    },
  };
});
