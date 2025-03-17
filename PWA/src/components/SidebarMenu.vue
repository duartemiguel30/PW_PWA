<template>
  <div>
    <div v-if="!isMobile" class="sidebar">
      <ul class="sidebar-menu">
        <li>
          <router-link to="/admin-dashboard" class="sidebar-item" title="Dashboard">
            <i data-feather="activity"></i>
          </router-link>
        </li>
        <li>
          <router-link to="/Dashboard" class="sidebar-item" title="Reports">
            <i data-feather="bar-chart-2"></i>
          </router-link>
        </li>
        <li>
          <router-link to="/admin-adicionar-auditoria" class="sidebar-item" title="Nova Auditoria">
            <i data-feather="plus-circle"></i>
          </router-link>
        </li>
        <li>
          <a @click="logout" class="sidebar-item" title="Logout">
            <i data-feather="log-out"></i>
          </a>
        </li>
      </ul>
    </div>

    <div v-if="isMobile" class="bottom-bar">
      <router-link to="/admin-dashboard" class="bottom-item" title="Dashboard">
        <i data-feather="activity"></i>
      </router-link>
      <router-link to="/admin-reports" class="bottom-item" title="Reports">
        <i data-feather="bar-chart-2"></i>
      </router-link>
      <router-link to="/admin-adicionar-auditoria" class="sidebar-item" title="Nova Auditoria">
        <i data-feather="plus-circle"></i>
      </router-link>
      <a @click="logout" class="bottom-item" title="Logout">
        <i data-feather="log-out"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMobile: window.innerWidth <= 768, 
    };
  },
  mounted() {
    window.addEventListener("resize", this.checkIfMobile);
    feather.replace();  
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkIfMobile);
  },
  methods: {
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    logout() {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdmin');
      
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 80px;
  height: 100vh;
  background-color: rgba(2, 59, 28, 0.68);
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
  font-size: 2rem;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba(2, 59, 28, 0.68);
  display: flex;
  justify-content: space-around;
  padding: 1rem 0;
  z-index: 9999;
}

.bottom-item {
  color: white;
  text-decoration: none;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-item:hover {
  color: #aaa;
}

.sidebar-item:hover {
  color: #aaa;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
