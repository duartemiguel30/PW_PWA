import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AdminDashboard from '../views/AdminDashboard.vue';  
import AdicionarAuditoria from '@/views/AdicionarAuditoria.vue';
import Dashboard from '@/views/Dashboard.vue';


const routes = [
  { path: '/', redirect: '/login' },  
  { path: '/login', component: Login },  
  { path: '/register', component: Register },  
  { path: '/admin-dashboard', component: AdminDashboard },  
  { path: '/admin-adicionar-auditoria', component: AdicionarAuditoria }, 
  { path: '/dashboard', component: Dashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
