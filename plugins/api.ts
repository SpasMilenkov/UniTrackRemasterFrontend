import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';

// Debug configuration
interface DebugConfig {
  enabled: boolean;
  logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug' | 'all';
  showTimings: boolean;
  colorize: boolean;
  showRequestBody: boolean;
  showResponseBody: boolean;
  expandJsonResponse: boolean;
  maxBodyLength: number;
}

// Default debug configuration
const defaultDebugConfig: DebugConfig = {
  enabled: process.env.NODE_ENV !== 'production',
  logLevel: 'all',
  showTimings: true,
  colorize: true,
  showRequestBody: true,
  showResponseBody: true,
  expandJsonResponse: true,
  maxBodyLength: 1000,
};

// Create logger with colors (same as before)
const createLogger = (config: DebugConfig) => {
  const colors = {
    GET: '#4CAF50',
    POST: '#2196F3',
    PUT: '#FF9800',
    DELETE: '#F44336',
    PATCH: '#9C27B0',
    success: '#4CAF50',
    error: '#F44336',
    warn: '#FF9800',
    info: '#2196F3',
    debug: '#9E9E9E',
  };

  const getPrefix = (method: string, endpoint: string) => {
    return config.colorize
      ? `%c[API ${method}]%c ${endpoint}`
      : `[API ${method}] ${endpoint}`;
  };

  const getStyles = (method: string) => {
    if (!config.colorize) return [];
    const methodColor = colors[method as keyof typeof colors] || '#000';
    return [
      `background-color: ${methodColor}; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;`,
      '',
    ];
  };

  const formatBody = (body: any): string => {
    if (!body) return 'none';
    try {
      if (body instanceof FormData) {
        const formDataObj: Record<string, any> = {};
        body.forEach((value, key) => {
          formDataObj[key] =
            value instanceof Blob ? `[Blob ${value.size} bytes]` : value;
        });
        return truncate(JSON.stringify(formDataObj, null, 2));
      }
      if (typeof body === 'string') {
        try {
          return truncate(JSON.stringify(JSON.parse(body), null, 2));
        } catch {
          return truncate(body);
        }
      }
      // Safely stringify, handling functions and other non-serializable values
      return truncate(
        JSON.stringify(
          body,
          (key, value) => {
            if (typeof value === 'function') {
              return '[Function]';
            }
            if (typeof value === 'undefined') {
              return '[Undefined]';
            }
            if (typeof value === 'symbol') {
              return '[Symbol]';
            }
            return value;
          },
          2
        )
      );
    } catch (e) {
      return `[Unable to format body: ${e}]`;
    }
  };

  const truncate = (str: string): string => {
    if (str.length <= config.maxBodyLength) return str;
    return str.substring(0, config.maxBodyLength) + '... [truncated]';
  };

  return {
    logRequest: (
      method: string,
      endpoint: string,
      options: any,
      _startTime: number
    ) => {
      // Only log on client and when enabled
      if (!config.enabled || config.logLevel === 'none' || import.meta.server)
        return;
      if (!['all', 'debug', 'info'].includes(config.logLevel)) return;
      if (process.env.NODE_ENV === 'production') return;

      const prefix = getPrefix(method, endpoint);
      const styles = getStyles(method);

      console.groupCollapsed(prefix, ...styles);
      console.log('Time:', new Date().toISOString());
      console.log('URL:', `${options.baseURL || ''}${endpoint}`);

      if (options.params && Object.keys(options.params).length > 0) {
        console.log('Query Params:', options.params);
      }

      if (options.headers) {
        console.log('Headers:', options.headers);
      }

      if (config.showRequestBody && options.body) {
        console.log('Request Body:', formatBody(options.body));
      }

      console.groupEnd();
    },

    logResponse: (
      method: string,
      endpoint: string,
      response: any,
      startTime: number
    ) => {
      // Only log on client and when enabled
      if (!config.enabled || config.logLevel === 'none' || import.meta.server)
        return;
      if (!['all', 'debug', 'info'].includes(config.logLevel)) return;
      if (process.env.NODE_ENV === 'production') return;

      const endTime = performance.now();
      const duration = endTime - startTime;

      const prefix = getPrefix(method, endpoint);
      const styles = getStyles(method);

      console.groupCollapsed(
        `${prefix} %c(${duration.toFixed(2)}ms)`,
        ...styles,
        'color: #4CAF50; font-weight: bold;'
      );
      console.log('Time:', new Date().toISOString());
      console.log('Status:', response.status || 'OK');

      if (config.showTimings) {
        console.log('Duration:', `${duration.toFixed(2)}ms`);
      }

      if (config.showResponseBody) {
        if (config.expandJsonResponse) {
          try {
            let responseData = response;
            if (response && typeof response === 'object' && response.data) {
              responseData = response.data;
            }
            if (typeof responseData === 'string') {
              try {
                responseData = JSON.parse(responseData);
              } catch {
                // Not JSON, keep as string
              }
            }
            if (responseData && typeof responseData === 'object') {
              console.log('Response JSON:');
              console.dir(responseData);
            } else {
              console.log('Response Body:', formatBody(response));
            }
          } catch {
            console.log('Response Body:', formatBody(response));
          }
        } else {
          console.log('Response Body:', formatBody(response));
        }
      }

      console.groupEnd();
    },

    logError: (
      method: string,
      endpoint: string,
      error: any,
      startTime: number
    ) => {
      // Only log on client and when enabled
      if (!config.enabled || config.logLevel === 'none' || import.meta.server)
        return;
      if (!['all', 'debug', 'info', 'warn', 'error'].includes(config.logLevel))
        return;
      if (process.env.NODE_ENV === 'production') return;

      const endTime = performance.now();
      const duration = endTime - startTime;

      const prefix = getPrefix(method, endpoint);
      const styles = getStyles(method);

      console.group(
        `${prefix} %c(${duration.toFixed(2)}ms) %cFAILED`,
        ...styles,
        'color: #F44336; font-weight: bold;',
        'color: white; background-color: #F44336; padding: 2px 4px; border-radius: 3px;'
      );
      console.log('Time:', new Date().toISOString());
      console.log('Error:', error);
      console.log('Status:', error.status || 'Unknown');
      console.log(
        'Message:',
        error.message || error.statusText || 'Unknown error'
      );

      if (config.showTimings) {
        console.log('Duration:', `${duration.toFixed(2)}ms`);
      }

      if (error.response && config.showResponseBody) {
        if (config.expandJsonResponse) {
          try {
            let responseData = error.response;
            if (
              responseData &&
              typeof responseData === 'object' &&
              responseData.data
            ) {
              responseData = responseData.data;
            }
            if (typeof responseData === 'string') {
              try {
                responseData = JSON.parse(responseData);
              } catch (e: any) {
                console.log('Error Response:', formatBody(e.response));
              }
            }
            if (responseData && typeof responseData === 'object') {
              console.log('Error Response JSON:');
              console.dir(responseData);
            } else {
              console.log('Error Response:', formatBody(error.response));
            }
          } catch {
            console.log('Error Response:', formatBody(error.response));
          }
        } else {
          console.log('Error Response:', formatBody(error.response));
        }
      }

      console.groupEnd();

      if (process.env.NODE_ENV !== 'production') {
        console.error(`API Error (${method} ${endpoint}):`, error);
      }
    },
  };
};

// Create the base fetch function with auth handling
const createBaseFetch = (logger: ReturnType<typeof createLogger>) => {
  const nuxtApp = useNuxtApp();
  const baseUrl = nuxtApp.$config.public.apiBaseURL;

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: () => void;
    reject: (error: any) => void;
  }> = [];

  const processQueue = (error: any = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });
    failedQueue = [];
  };

  const refreshToken = async () => {
    // Don't attempt token refresh on server
    if (import.meta.server) return false;

    try {
      const startTime = performance.now();
      logger.logRequest('POST', '/Auth/refresh-token', {}, startTime);

      await $fetch(`${baseUrl}/Auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      const duration = performance.now() - startTime;
      logger.logResponse(
        'POST',
        '/Auth/refresh-token',
        { status: 200 },
        duration
      );
      return true;
    } catch (error) {
      const startTime = performance.now();
      logger.logError('POST', '/Auth/refresh-token', error, startTime);
      return false;
    }
  };

  // Create the main fetch function that handles auth and retries
  const baseFetch = async <T = any>(
    endpoint: string,
    options: Partial<NitroFetchOptions<NitroFetchRequest>> = {}
  ): Promise<T> => {
    return _makeRequest<T>(endpoint, options, false);
  };

  // Internal function to handle the actual request with retry logic
  const _makeRequest = async <T = any>(
    endpoint: string,
    options: Partial<NitroFetchOptions<NitroFetchRequest>> = {},
    isRetry = false
  ): Promise<T> => {
    const startTime = performance.now();
    const method = options.method || 'GET';

    try {
      // Create clean options object without functions
      const cleanOptions = {
        ...options,
        baseURL: baseUrl,
        headers: {
          ...(options.body instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' }),
          ...options.headers,
        },
      };

      logger.logRequest(method, endpoint, cleanOptions, startTime);

      const response = (await $fetch(`${baseUrl}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
          ...(options.body instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' }),
          ...options.headers,
        },
      })) as T;

      logger.logResponse(method, endpoint, response, startTime);
      return response;
    } catch (error: any) {
      logger.logError(method, endpoint, error, startTime);

      // Handle authentication errors (401 and 403) - only on client
      if (
        (error.status === 401 || error.status === 403) &&
        !isRetry &&
        import.meta.client
      ) {
        if (endpoint === '/Auth/refresh-token') {
          // Only access stores on client
          try {
            const authStore = useAuthStore();
            authStore.clearAuth();
            await navigateTo('/login');
          } catch (e) {
            console.error('Error clearing auth or navigating:', e);
          }
          throw error;
        }

        if (isRefreshing) {
          return new Promise<T>((resolve, reject) => {
            failedQueue.push({
              resolve: () => {
                _makeRequest<T>(endpoint, options, true)
                  .then((response) => resolve(response as T))
                  .catch(reject);
              },
              reject,
            });
          });
        }

        isRefreshing = true;

        try {
          const refreshSuccess = await refreshToken();
          isRefreshing = false;

          if (refreshSuccess) {
            processQueue();
            return _makeRequest<T>(endpoint, options, true);
          } else {
            processQueue(new Error('Failed to refresh token'));
            try {
              const authStore = useAuthStore();
              authStore.clearAuth();
              await navigateTo('/login');
            } catch (e) {
              console.error('Error clearing auth or navigating:', e);
            }
            throw error;
          }
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError);
          try {
            const authStore = useAuthStore();
            authStore.clearAuth();
            await navigateTo('/login');
          } catch (e) {
            console.error('Error clearing auth or navigating:', e);
          }
          throw refreshError;
        }
      } else if (
        (error.status === 401 || error.status === 403) &&
        isRetry &&
        import.meta.client
      ) {
        console.warn(
          'Still getting 401/403 after token refresh, logging user out'
        );
        try {
          const authStore = useAuthStore();
          authStore.clearAuth();
          await navigateTo('/login');
        } catch (e) {
          console.error('Error clearing auth or navigating:', e);
        }
      }

      throw error;
    }
  };

  return baseFetch;
};

export default defineNuxtPlugin(() => {
  // Load debug settings
  let debugConfig: Partial<DebugConfig> = {};

  if (import.meta.client && process.env.NODE_ENV !== 'production') {
    try {
      const storedConfig = localStorage.getItem('api_debug_config');
      if (storedConfig) {
        debugConfig = JSON.parse(storedConfig);
      }
    } catch (e: unknown) {
      console.warn('Failed to load API debug config from localStorage', e);
    }
  } else if (process.env.NODE_ENV === 'production') {
    debugConfig = {
      enabled: false,
      showResponseBody: false,
      expandJsonResponse: false,
    };
  }

  const config: DebugConfig = { ...defaultDebugConfig, ...debugConfig };
  const logger = createLogger(config);
  const baseFetch = createBaseFetch(logger);

  return {
    provide: {
      // Basic fetch function for direct use or in Pinia Colada queries
      apiFetch: baseFetch,

      // Debug configuration helper
      apiDebug: {
        setConfig: (newConfig: Partial<DebugConfig>) => {
          if (process.env.NODE_ENV === 'production') {
            console.warn('API debugging is disabled in production');
            return;
          }

          Object.assign(config, newConfig);

          if (import.meta.client) {
            try {
              const currentConfig = localStorage.getItem('api_debug_config');
              const parsed = currentConfig ? JSON.parse(currentConfig) : {};
              const merged = { ...parsed, ...newConfig };
              localStorage.setItem('api_debug_config', JSON.stringify(merged));
            } catch (e) {
              console.warn(
                'Failed to save API debug config to localStorage',
                e
              );
            }
          }
        },
      },
    },
  };
});
