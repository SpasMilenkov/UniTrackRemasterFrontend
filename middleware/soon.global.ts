export default defineNuxtRouteMiddleware((to) => {
  const notAvailable = [
    '/support',
    '/sales',
    '/analytics',
    '/onboarding/university',
    '/cookie-policy',
    '/terms-of-service',
    '/partnerships',
    '/documentation'
  ];
  if (notAvailable.includes(to.fullPath)) return navigateTo('/soon');
});
