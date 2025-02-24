export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  addRouteMiddleware(
    'auth',
    async (to) => {
      const requiresAuth = to.meta.requiresAuth;

      if (!requiresAuth) {
        return;
      }

      const isAuthenticated = localStorage.getItem('isAuthenticated');

      if (!isAuthenticated) {
        return navigateTo('/login');
      }

      if (!authStore.isAuthenticated) {
        const isValid = await authStore.validateSession();
        if (!isValid) {
          return navigateTo('/login');
        }

        if (authStore.user?.id && !userStore.userDetails) {
          await userStore.fetchUserDetails(authStore.user.id);
        }
      }
    },
    { global: false }
  );
});
