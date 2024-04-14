import HomeView from '../views/landing/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import StudentDashboardView from '../views/student/StudentDashboardView.vue'
import TeacherDashboardView from '../views/teacher/TeacherDashboardView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
const routes = [
    {
        path: '/',
        home: 'home',
        component: HomeView,
        meta: {
            requiresAuthentication: false,
        },
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            requiresAuthentication: false,
        },
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: {
            requiresAuthentication: false,
        },
    },
    {
        path: '/student',
        name: 'studentDashboard',
        component: StudentDashboardView,
        meta: {
            requiresAuthentication: true,
            requiresRole: 'STUDENT',
        },
    },
    {
        path: '/teacher',
        name: 'teacherDashboard',
        component: TeacherDashboardView,
        meta: {
            requiresAuthentication: true,
            requiresRole: 'TEACHER',
        },
    },
    {
        path: '/admin',
        name: 'adminDashboard',
        component: AdminDashboardView,
        meta: {
            requiresAuthentication: true,
            requiresRole: 'ADMIN',
        },
    },
]

export default routes
