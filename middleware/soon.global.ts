export default defineNuxtRouteMiddleware((to) => {
  const { $i18n } = useNuxtApp(); // Access the $i18n instance
  const locale = $i18n?.locale?.value || '';
  const notAvailable = [
    '/support',
    '/sales',
    '/analytics',
    '/onboarding/university',
    '/cookie-policy',
    '/terms-of-service',
    '/partnerships',
    '/documentation',
  ];

  if (notAvailable.includes(to.fullPath)) {
    // Redirect to the locale-specific "soon" page
    if (locale === 'en') return navigateTo('/soon');
    return navigateTo(`/${locale}/soon`);
  }
});
