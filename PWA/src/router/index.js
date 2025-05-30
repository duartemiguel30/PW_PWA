import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AdminDashboard from '../views/AdminDashboard.vue';  
import AddAudit from '@/views/AddAudit.vue';
import Dashboard from '@/views/Dashboard.vue';
import PeritoProfile   from '@/views/PeritoProfile.vue'; 


const routes = [
  { path: '/', redirect: '/login' },  
  { path: '/login', component: Login },  
  { path: '/register', component: Register },  
  { path: '/admin-dashboard', component: AdminDashboard, meta: { requiresAuth: true } },  
  { path: '/admin-add-audit', component: AddAudit, meta: { requiresAuth: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/peritoProfile', component: PeritoProfile, meta: { requiresAuth: true } }


];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      next({ path: '/register' });
    } else {
      next();
    }
  } else {
    next(); 
  }
});

export default router;
