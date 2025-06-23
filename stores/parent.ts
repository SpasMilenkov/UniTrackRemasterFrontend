// stores/parent.ts
import { defineStore } from 'pinia';
import { useQuery, useMutation } from '@pinia/colada';
import { z } from 'zod';
import type { ProfileStatus } from '~/interfaces/invitation';
// Zod schemas for validation
export const updateParentSchema = z.object({
  occupation: z.string().max(100).optional(),
  emergencyContact: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
});

export type UpdateParentSchema = z.infer<typeof updateParentSchema>;

// Parent and Child interfaces based on the DTOs
export interface ParentResponseDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  occupation?: string;
  emergencyContact?: string;
  status: ProfileStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  children: ChildResponseDto[];
}

export interface ChildResponseDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isSchoolStudent: boolean;
  isUniversityStudent: boolean;
  status: ProfileStatus;
  gradeName?: string;
  majorName?: string;
}

export const useParentStore = defineStore('parent', () => {
  if (import.meta.server) {
    return {
      // State
      parent: readonly(ref(null)),
      selectedChild: readonly(ref(null)),
      error: readonly(ref(null)),

      // Computed getters
      displayName: '',
      hasChildren: false,
      activeChildren: [],
      childOptions: [],

      // Loading states
      loading: false,
      isLoading: false,
      isUpdatingParent: false,

      // Actions
      fetchParentByUserId: async () => null,
      fetchParentById: async () => null,
      updateParent: async () => null,
      selectChild: () => {},
      clearSelectedChild: () => {},

      // Query factories
      parentByUserIdQuery: () => null,
      parentByIdQuery: () => null,
      updateParentMutation: null,
    };
  }

  // Get the API fetch function
  const { $apiFetch } = useNuxtApp();

  // State
  const parent = ref<ParentResponseDto | null>(null);
  const selectedChild = ref<ChildResponseDto | null>(null);
  const error = ref<string | null>(null);

  // Parent by user ID query
  const parentByUserIdQuery = (userId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['parents', 'by-user', unref(userId) || ''],
      query: () => {
        const uId = unref(userId);
        if (!uId) throw new Error('User ID is required');
        return $apiFetch<ParentResponseDto>(`/Parents/user/${uId}`);
      },
      enabled: () => !!unref(userId) && import.meta.client,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Parent by ID query
  const parentByIdQuery = (parentId: MaybeRef<string | null>) => {
    return useQuery({
      key: () => ['parents', 'by-id', unref(parentId) || ''],
      query: () => {
        const pId = unref(parentId);
        if (!pId) throw new Error('Parent ID is required');
        return $apiFetch<ParentResponseDto>(`/Parents/${pId}`);
      },
      enabled: () => !!unref(parentId) && import.meta.client,
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // Update parent mutation
  const updateParentMutation = useMutation({
    mutation: ({ id, data }: { id: string; data: UpdateParentSchema }) => {
      const validatedData = updateParentSchema.parse(data);
      return $apiFetch<ParentResponseDto>(`/Parents/${id}`, {
        method: 'PUT',
        body: validatedData,
      });
    },
    onSuccess: (updatedParent) => {
      parent.value = updatedParent;
      error.value = null;
    },
    onError: (updateError) => {
      console.error('Error updating parent:', updateError);
      error.value = updateError.message || 'Failed to update parent profile';
    },
  });

  // Computed properties
  const displayName = computed(() => {
    if (!parent.value) return '';
    return `${parent.value.firstName} ${parent.value.lastName}`.trim();
  });

  const hasChildren = computed(() => {
    return parent.value?.children && parent.value.children.length > 0;
  });

  const activeChildren = computed(() => {
    if (!parent.value?.children) return [];
    return parent.value.children.filter(
      (child) => child.status === 'Active' // Assuming 'Active' is a valid status
    );
  });

  const childOptions = computed(() => {
    return activeChildren.value.map((child) => ({
      label: `${child.firstName} ${child.lastName}`,
      value: child.id,
      child: child,
    }));
  });

  // Loading states
  const loading = computed(() => false); // Can be enhanced to track specific queries
  const isLoading = computed(() => updateParentMutation.isLoading.value);
  const isUpdatingParent = computed(() => updateParentMutation.isLoading.value);

  // Actions
  const fetchParentByUserId = async (userId: string) => {
    error.value = null;

    try {
      const query = parentByUserIdQuery(ref(userId));
      await query.refetch();
      const data = query.data.value;

      if (data) {
        parent.value = data;
        // Auto-select first child if available
        if (data.children && data.children.length > 0) {
          selectedChild.value = data.children[0];
        }
      }

      return data;
    } catch (err: any) {
      console.error('Error fetching parent by user ID:', err);
      error.value = err.message || 'Failed to fetch parent profile';
      throw err;
    }
  };

  const fetchParentById = async (parentId: string) => {
    error.value = null;

    try {
      const query = parentByIdQuery(ref(parentId));
      await query.refetch();
      const data = query.data.value;

      if (data) {
        parent.value = data;
        // Auto-select first child if available
        if (data.children && data.children.length > 0) {
          selectedChild.value = data.children[0];
        }
      }

      return data;
    } catch (err: any) {
      console.error('Error fetching parent by ID:', err);
      error.value = err.message || 'Failed to fetch parent profile';
      throw err;
    }
  };

  const updateParent = async (id: string, data: UpdateParentSchema) => {
    return await updateParentMutation.mutateAsync({ id, data });
  };

  const selectChild = (child: ChildResponseDto) => {
    selectedChild.value = child;
  };

  const clearSelectedChild = () => {
    selectedChild.value = null;
  };

  return {
    // State
    parent: readonly(parent),
    selectedChild: readonly(selectedChild),
    error: readonly(error),

    // Computed getters
    displayName,
    hasChildren,
    activeChildren,
    childOptions,

    // Loading states
    loading,
    isLoading,
    isUpdatingParent,

    // Actions
    fetchParentByUserId,
    fetchParentById,
    updateParent,
    selectChild,
    clearSelectedChild,

    // Query factories for advanced usage
    parentByUserIdQuery,
    parentByIdQuery,

    // Mutations
    updateParentMutation,
  };
});
