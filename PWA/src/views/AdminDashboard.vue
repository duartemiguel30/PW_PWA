<template>
  <div class="dashboard-container">
    <SidebarMenu />
    <div class="dashboard-content">

      <div v-if="auditoriasData.length > 0" class="filter-container">
      <label for="audit-filter">Estado</label>
      <select id="audit-filter" v-model="filtroSelecionado">
        <option value="todas">Todas</option>
        <option value="abertas">Abertas</option>
        <option value="fechadas">Fechadas</option>
      </select>
    </div>


      <div v-if="auditoriasFiltradas.length === 0" class="no-audit-message">
        Nenhuma auditoria encontrada.
        <router-link to="/admin-add-audit">Adiciona uma aqui.</router-link>
      </div>

      <div class="audit-list">
        <AuditItem v-for="(auditoria, index) in auditoriasFiltradas" :key="index" :auditoria="auditoria" />
      </div>

    </div>
  </div>
</template>

<script>
import SidebarMenu from '@/components/SidebarMenu.vue';
import AuditItem from '@/components/AuditItem.vue';

export default {
  components: {
    SidebarMenu,
    AuditItem
  },
  data() {
    return {
      auditoriasData: [], 
      filtroSelecionado: "abertas" 
    };
  },
  computed: {
    auditoriasFiltradas() {
      if (this.filtroSelecionado === "abertas") {
        return this.auditoriasData.filter(a => a.status === "aberta");
      } else if (this.filtroSelecionado === "fechadas") {
        return this.auditoriasData.filter(a => a.status === "terminada");
      }
      return this.auditoriasData;
    }
  },
  mounted() {
    this.carregarAuditorias();
  },
  methods: {
    carregarAuditorias() {
      this.auditoriasData = JSON.parse(localStorage.getItem("auditorias")) || [];
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
}

.dashboard-content {
  margin-left: 7rem;
  padding: 1.5rem;
  flex: 1;
  max-width: 75rem;
}

/* Filtro */
.filter-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: flex-end;
}

.filter-container select {
  padding: 0.3rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
}

/* Lista de auditorias */
.audit-list {
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(18.75rem, 1fr)); 
  gap: 1.5rem;
  justify-content: flex-start;
}

/* Mensagem quando não há auditorias */
.no-audit-message {
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
}

.no-audit-message a {
  color: blue;
  text-decoration: underline;
}

@media (max-width: 48rem) {
  .dashboard-container {
    flex-direction: column;
  }

  .dashboard-content {
    margin-left: 0;
  }

  .audit-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
