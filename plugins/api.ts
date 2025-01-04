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

const createApi = () => {
  const nuxtApp = useNuxtApp();
  const baseUrl = nuxtApp.$config.public.apiBaseURL;

  const makeRequest = async <T>(
    endpoint: string,
    options: Partial<NitroFetchOptions<NitroFetchRequest>> = {}
  ) => {
    try {
      return await $fetch<T>(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...(options.body instanceof FormData
            ? {} // Allow FormData to set its own headers, including boundaries
            : { 'Content-Type': 'application/json' }),
          ...options.headers,
        },
      });
    } catch (error) {
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
    ) =>
      makeRequest<T>(endpoint, {
        method: 'POST',
        body: data,
        params,
      }),

    put: <T>(
      endpoint: string,
      data?: RequestData,
      params?: Record<string, any>
    ) =>
      makeRequest<T>(endpoint, {
        method: 'PUT',
        body: data,
        params,
      }),

    delete: <T>(endpoint: string) =>
      makeRequest<T>(endpoint, {
        method: 'DELETE',
      }),
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
