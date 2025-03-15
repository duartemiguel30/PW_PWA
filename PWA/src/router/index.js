import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AdminDashboard from '../views/AdminDashboard.vue';  // Verifique o caminho correto da view

const routes = [
  { path: '/', redirect: '/login' },  // Redireciona para /login
  { path: '/login', component: Login },  // Rota para login
  { path: '/register', component: Register },  // Rota para registro
  { path: '/admin-dashboard', component: AdminDashboard },  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
