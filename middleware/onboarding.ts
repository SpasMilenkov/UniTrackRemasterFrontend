export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const store = useOnboardingStore();
  const isAuthenticated = store.checkAuthStatus();

  // If trying to access onboarding with an ID but not authenticated
  if (to.path.includes('/onboarding/school/') && !isAuthenticated) {
    return navigateTo('/onboarding/auth/');
  }
});
