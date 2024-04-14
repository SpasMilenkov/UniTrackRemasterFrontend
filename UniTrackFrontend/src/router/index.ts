import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from '../stores/userStore'
const router = createRouter({
    routes: routes,
    history: createWebHistory(),
})

router.beforeEach((to, from, next) => {
    if (to.matched.some((page) => page.meta.requiresAuthentication)) {
        const store = useUserStore(); // Using Pinia store

        // Check if user is authenticated
        if (!store.authenticationStatus) {
            // If not authenticated, redirect to login page
            next({ name: 'login' });
            return
        }

        // Check if the route requires a specific role
        if (to.matched.some((page) => page.meta.requiresRole)) {
            // Get the required role from the route meta
            const requiredRole = to.meta.requiresRole;

            // Get the user's role from the store
            const userRole = store.getRole;

            // Check if the user has the required role
            if (userRole !== requiredRole) {
                // If user does not have the required role, redirect to a suitable page (e.g., access denied page)
                next({ name: 'register' });
                return; // Terminate the navigation guard
            }
        }
    }
  
    // If the route does not require authentication or the user meets the requirements, proceed with the navigation
    next();
})
export default router
