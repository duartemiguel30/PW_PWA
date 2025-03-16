
<template>
  <div>
    <div v-if="!isMobile" class="sidebar">
      <ul class="sidebar-menu">
        <li>
          <router-link to="/admin-dashboard" class="sidebar-item" title="Dashboard">
            <i data-feather="activity"></i> <!-- Ícone do Dashboard -->
          </router-link>
        </li>
        <li>
          <router-link to="/admin-users" class="sidebar-item" title="Users">
            <i data-feather="users"></i> <!-- Ícone de Users -->
          </router-link>
        </li>
        <li>
          <router-link to="/admin-settings" class="sidebar-item" title="Settings">
            <i data-feather="settings"></i> <!-- Ícone de Settings -->
          </router-link>
        </li>
        <li>
          <router-link to="/admin-reports" class="sidebar-item" title="Reports">
            <i data-feather="bar-chart-2"></i> <!-- Ícone de Reports -->
          </router-link>
        </li>
        <li>
      <router-link to="/admin-adicionar-auditoria" class="sidebar-item" title="Nova Auditoria">
        <i data-feather="plus-circle"></i> <!-- Ícone de Adicionar -->
      </router-link>
    </li>

      </ul>
    </div>

    <!-- Bottom Bar (Somente para Mobile) -->
    <div v-if="isMobile" class="bottom-bar">
      <router-link to="/admin-dashboard" class="bottom-item" title="Dashboard">
        <i data-feather="activity"></i> <!-- Ícone de Dashboard -->
      </router-link>
      <router-link to="/admin-users" class="bottom-item" title="Users">
        <i data-feather="users"></i> <!-- Ícone de Users -->
      </router-link>
      <router-link to="/admin-settings" class="bottom-item" title="Settings">
        <i data-feather="settings"></i> <!-- Ícone de Settings -->
      </router-link>
      <router-link to="/admin-reports" class="bottom-item" title="Reports">
        <i data-feather="bar-chart-2"></i> <!-- Ícone de Reports -->
      </router-link>
      <router-link to="/admin-adicionar-auditoria" class="sidebar-item" title="Nova Auditoria">
        <i data-feather="plus-circle"></i> <!-- Ícone de Adicionar -->
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMobile: window.innerWidth <= 768, // Detecta se é mobile (<= 768px)
    };
  },
  mounted() {
    window.addEventListener("resize", this.checkIfMobile);
    feather.replace(); // Substitui os ícones Feather no DOM
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkIfMobile);
  },
  methods: {
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
    }
  }
};
</script>

<style scoped>
/* Sidebar (Desktop) */
.sidebar {
  width: 80px; /* Aumentei um pouco para melhor visualização */
  height: 100vh;
  background-color: rgba(2, 59, 28, 0.68);/* Alterado para verde */
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
}

.sidebar-menu {
  list-style-type: none;
  padding: 0;
}

.sidebar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  color: white;
  text-decoration: none;
  font-size: 2rem; /* Ícones um pouco maiores */
}

/* Bottom Bar (Mobile) */
.bottom-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba(2, 59, 28, 0.68); /* Alterado para verde */
  display: flex;
  justify-content: space-around;
  padding: 1rem 0;
  z-index: 9999;
}

.bottom-item {
  color: white;
  text-decoration: none;
  font-size: 2rem; /* Ícones um pouco maiores */
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-item:hover {
  color: #aaa;
}

/* Esconder a sidebar no mobile */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
