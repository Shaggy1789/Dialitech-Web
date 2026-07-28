import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import PublicLayout from '../layouts/PublicLayout.vue';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import RegisterView from '../modules/register/views/RegisterView.vue';
import PlansView from '../modules/plans/views/PlansView.vue';
import DashboardView from '../pages/DashboardView.vue';
import PatientsView from '../modules/patients/views/PatientsView.vue';
import PatientDetailView from '../modules/patients/views/PatientDetailView.vue';
import UserManagementView from '../modules/user-management/views/UserManagementView.vue';
import AlertsView from '../modules/alerts/views/AlertsView.vue';
import SettingsView from '../modules/settings/views/SettingsView.vue';

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'login', name: 'login', component: Login },
      { path: 'register', name: 'register', component: RegisterView },
      { path: 'plans', name: 'plans', component: PlansView },
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
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'patients', component: PatientsView },
      { path: ':id', name: 'patient-detail', component: PatientDetailView },
    ],
  },
  {
    path: '/users',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'user-management', component: UserManagementView },
    ],
  },
  {
    path: '/alerts',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'alerts', component: AlertsView },
    ],
  },
  {
    path: '/settings',
    component: DashboardLayout,
    meta: { requiresAuth: true },
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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
