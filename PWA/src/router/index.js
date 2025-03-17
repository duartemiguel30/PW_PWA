import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AdminDashboard from '../views/AdminDashboard.vue';  
import AdicionarAuditoria from '@/views/AdicionarAuditoria.vue';
import Dashboard from '@/views/Dashboard.vue';

// Definição das rotas
const routes = [
  { path: '/', redirect: '/login' },  
  { path: '/login', component: Login },  
  { path: '/register', component: Register },  
  { path: '/admin-dashboard', component: AdminDashboard, meta: { requiresAuth: true } },  
  { path: '/admin-adicionar-auditoria', component: AdicionarAuditoria, meta: { requiresAuth: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
];

// Criação do router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guarda de navegação global
router.beforeEach((to, from, next) => {
  // Se a rota exige autenticação
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Verifica se o utilizador está autenticado
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      next({ path: '/register' }); // Redireciona para o login se não estiver autenticado
    } else {
      next(); // Permite o acesso à rota protegida
    }
  } else {
    next(); // Permite o acesso às rotas que não exigem autenticação (login, register)
  }
});

export default router;
