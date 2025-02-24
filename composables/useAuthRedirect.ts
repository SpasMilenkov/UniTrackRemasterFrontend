export const useAuthRedirect = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  onMounted(() => {
    // If user is authenticated, redirect to dashboard
    if (authStore.isAuthenticated) {
      router.push('/dashboard');
    }
  });

  // Watch for auth state changes
  watch(
    () => authStore.isAuthenticated,
    (isAuthenticated) => {
      if (isAuthenticated) {
        router.push('/dashboard');
      }
    }
  );
};