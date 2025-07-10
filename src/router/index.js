import {createRouter, createWebHistory} from 'vue-router';
import { useAuthStore } from '../stores/auth';
// Importar rutas del foro
import forumRoutes from '../forum/router/index.js';

const HomeComponent = () => import('../public/pages/home.component.vue');
const AboutComponent = () => import('../public/pages/about.component.vue');
const PageNotFoundComponent = () => import('../public/pages/page-not-found.component.vue');
const CategoryManagementComponent = () => import('../publishing/pages/category-management.component.vue');
const LoginComponent = () => import('../auth/pages/login.component.vue');
const RegisterComponent = () => import('../auth/pages/register.component.vue');
const DashboardComponent = () => import('../pages/dashboard.component.vue');

// Páginas de funcionalidades principales (lazy loading)
const EventsComponent = () => import('../pages/events.component.vue');
const PollsComponent = () => import('../pages/polls.component.vue');
const ProfileComponent = () => import('../pages/profile.component.vue');
const SettingsComponent = () => import('../pages/settings.component.vue');
const AdminComponent = () => import('../pages/admin.component.vue');

const routes = [
  ...forumRoutes,
    // Ruta raíz redirige a login o dashboard según autenticación
    {path: '/', name: 'default', redirect: () => {
      const authStore = useAuthStore();
      return authStore.isAuthenticated ? '/dashboard' : '/login';
    }},

    // Rutas de autenticación
    {path: '/login', name: 'login', component: LoginComponent, meta:{title: 'Iniciar sesión', guest: true}},
    {path: '/register', name: 'register', component: RegisterComponent, meta:{title: 'Registro', guest: true}},

    // Rutas principales tras iniciar sesión
    {path: '/dashboard', name: 'dashboard', component: DashboardComponent, meta:{title: 'Dashboard', requiresAuth: true}},

    // Otras rutas
    {path: '/events', name: 'events', component: EventsComponent, meta:{title: 'Events', requiresAuth: true}},
    {path: '/polls', name: 'polls', component: PollsComponent, meta:{title: 'Polls', requiresAuth: true}},
    {path: '/profile', name: 'profile', component: ProfileComponent, meta:{title: 'Profile', requiresAuth: true}},
    {path: '/settings', name: 'settings', component: SettingsComponent, meta:{title: 'Settings', requiresAuth: true}},
    {path: '/admin', name: 'admin', component: AdminComponent, meta:{title: 'Administration', requiresAuth: true, adminOnly: true}},

    // Rutas originales
    {path: '/home', name: 'home', component: HomeComponent, meta:{title: 'Home', requiresAuth: true}},
    {path: '/about', name: 'about', component: AboutComponent, meta:{title: 'About us', requiresAuth: true}},
    {path: '/publishing/categories', name: 'categories', component: CategoryManagementComponent, meta:{title: 'Category management', requiresAuth: true}},

    // Ruta de error
    {path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundComponent, meta:{title: 'Page not found'}}
]

const router = createRouter(
    {
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: routes,
    }
)

router.beforeEach((to, from, next) => {
    console.log(`Navegación: ${from.path} → ${to.path}`);
    console.log('Ruta completa:', to.name);

    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const adminOnly = to.matched.some(record => record.meta.adminOnly);
    const isGuestRoute = to.matched.some(record => record.meta.guest);

    console.log('Autenticado:', isAuthenticated);
    console.log('Requiere auth:', requiresAuth);
    console.log('Es ruta guest:', isGuestRoute);

    // Si es ruta guest y está autenticado, redirigir al dashboard
    if (isGuestRoute && isAuthenticated) {
        console.log('Usuario autenticado en ruta guest, redirigiendo al dashboard');
        return next('/dashboard');
    }

    // Si requiere auth y no está autenticado, redirigir a login
    if (requiresAuth && !isAuthenticated) {
        console.log('Ruta requiere auth pero no está autenticado, redirigiendo a login');
        return next('/login');
    }

    // Si es solo para admin y no es admin, redirigir al dashboard
    if (adminOnly && !authStore.isAdmin) {
        console.log('Solo para admin pero no es admin, redirigiendo al dashboard');
        return next('/dashboard');
    }

    // Continuar navegación normal
    console.log('Navegación permitida a:', to.path);
    // Set the page title
    let baseTitle = 'VeciHub';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
});

export default router;