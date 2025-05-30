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
          <router-link to="/dashboard" class="sidebar-item" title="Reports">
            <i data-feather="bar-chart-2"></i>
          </router-link>
        </li>
        <li>
          <router-link to="/PeritoProfile" class="sidebar-item" title="Perfil">
            <i data-feather="user"></i>
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
      <router-link to="/dashboard" class="bottom-item" title="Reports">
        <i data-feather="bar-chart-2"></i>
      </router-link>
      <router-link to="/PeritoProfile" class="bottom-item" title="Perfil">
        <i data-feather="user"></i>
      </router-link>
      <a @click="logout" class="bottom-item" title="Logout">
        <i data-feather="log-out"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarMenu',
  data() {
    return {
      isMobile: window.innerWidth <= 768,
    };
  },
  mounted() {
    window.addEventListener("resize", this.checkIfMobile);
    this.$nextTick(() => {
      if (window.feather) {
        window.feather.replace();
      }
    });
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
      localStorage.removeItem('loggedUser');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
html, body {
  overflow-x: hidden;
}

.sidebar {
  width: 5rem;
  height: 100vh;
  background-color: #023b1c;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
  overflow: hidden;
  z-index: 1000;
}

.sidebar-menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
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

.sidebar-item:hover {
  color: #aaa;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #023b1c;
  display: flex;
  justify-content: space-around;
  padding: 1rem 0;
  z-index: 1000;
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

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
