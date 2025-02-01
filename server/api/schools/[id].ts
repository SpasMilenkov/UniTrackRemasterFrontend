import { defineEventHandler, getRouterParam } from 'h3';
import type { School } from '~/interfaces/organizations/school';

const config = useRuntimeConfig();
const API_BASE_URL = config.public.apiBaseURL;

export default defineEventHandler(async (event): Promise<School> => {
  try {
    const id = getRouterParam(event, 'id');

    const school = await $fetch<School>(`${API_BASE_URL}/School/${id}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    return school;
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message,
    });
  }
});
