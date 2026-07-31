import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import PublicLayout from '../layouts/PublicLayout.vue';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import RegisterView from '../modules/register/views/RegisterView.vue';
import PlansView from '../modules/plans/views/PlansView.vue';
import ForgotPasswordView from '../modules/authentication/views/ForgotPasswordView.vue';
import ResetPasswordView from '../modules/authentication/views/ResetPasswordView.vue';
import DashboardView from '../pages/DashboardView.vue';
import PatientsView from '../modules/patients/views/PatientsView.vue';
import PatientDetailView from '../modules/patients/views/PatientDetailView.vue';
import AlertsView from '../modules/alerts/views/AlertsView.vue';
import SettingsView from '../modules/settings/views/SettingsView.vue';
import { useSubscriptionStore } from '../stores/subscriptionStore';

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'login', name: 'login', component: Login },
      { path: 'register', name: 'register', component: RegisterView },
      { path: 'plans', name: 'plans', component: PlansView },
      { path: 'forgot-password', name: 'forgot-password', component: ForgotPasswordView },
      { path: 'reset-password', name: 'reset-password', component: ResetPasswordView },
    ],
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: DashboardView },
    ],
  },
  {
    path: '/patients',
    component: DashboardLayout,
    meta: { requiresAuth: true, module: 'patients' },
    children: [
      { path: '', name: 'patients', component: PatientsView },
      { path: ':id', name: 'patient-detail', component: PatientDetailView },
    ],
  },
  {
    path: '/alerts',
    component: DashboardLayout,
    meta: { requiresAuth: true, module: 'alerts' },
    children: [
      { path: '', name: 'alerts', component: AlertsView },
    ],
  },
  {
    path: '/settings',
    component: DashboardLayout,
    meta: { requiresAuth: true, module: 'settings' },
    children: [
      { path: '', name: 'settings', component: SettingsView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
});

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    return { name: 'login' };
  }

  const sub = useSubscriptionStore();
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  if (storedUser?.plan) sub.setPlan(storedUser.plan);
  if (storedUser?.role) sub.setRole(storedUser.role);

  const routeModule = to.meta.module;
  if (to.meta.requiresAuth && routeModule && !sub.can(routeModule)) {
    return { name: 'dashboard' };
  }
});

export default router;
