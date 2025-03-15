<template>
  <div class="dashboard-container">
    <SidebarMenu />
    <div class="dashboard-content">
      <h1>Painel de Administração</h1>
      <p>Bem-vindo ao painel de administração!</p>
      <!-- O conteúdo do painel de administração vai aqui -->
    </div>
  </div>
</template>

<script>
import SidebarMenu from '@/components/SidebarMenu.vue';

export default {
  components: {
    SidebarMenu
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
}

.dashboard-content {
  margin-left: 250px; /* espaço para o menu lateral */
  padding: 20px;
  flex: 1;
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }

  .dashboard-content {
    margin-left: 0;
  }
}
</style>
