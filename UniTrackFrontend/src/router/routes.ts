import HomeView from '../views/landing/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import StudentDashboardView from '../views/student/StudentDashboardView.vue'
const routes = [
    {
        path: '/',
        home: 'home',
        component: HomeView,
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
    },
    {
        path: '/student',
        name: 'studentDashboard',
        component: StudentDashboardView
    },
]

export default routes
