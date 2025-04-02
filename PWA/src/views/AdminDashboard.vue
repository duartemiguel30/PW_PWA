<template>
  <div class="dashboard-container">
    <SidebarMenu />
    <div class="dashboard-content container mx-auto">
      <div v-if="auditoriasData.length > 0" class="filter-container">
        <label for="audit-filter">Estado</label>
        <select id="audit-filter" v-model="filtroSelecionado">
          <option value="abertas">Abertas</option>
          <option value="fechadas">Fechadas</option>
        </select>
      </div>

      <div v-if="auditoriasFiltradas.length === 0" class="no-audit-message">
        Nenhuma auditoria encontrada.
        <router-link to="/admin-add-audit">Adicione uma aqui.</router-link>
      </div>

      <div class="audit-list">
        <AuditItem
          v-for="auditoria in auditoriasFiltradas"
          :key="auditoria.id"
          :auditoria="auditoria"
          @edit="handleEdit"
          @update="handleUpdate"
          @conclude="handleConclude"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SidebarMenu from '@/components/SidebarMenu.vue';
import AuditItem from '@/components/AuditItem.vue';

export default {
  name: "AdminDashboard",
  components: {
    SidebarMenu,
    AuditItem,
  },
  data() {
    return {
      auditoriasData: [],
      filtroSelecionado: "abertas",
    };
  },
  computed: {
    auditoriasFiltradas() {
      return this.auditoriasData.filter(a =>
        this.filtroSelecionado === "abertas" ? a.status === "aberta" : a.status === "terminada"
      );
    },
  },
  mounted() {
    this.carregarAuditorias();
  },
  methods: {
    carregarAuditorias() {
      this.auditoriasData = JSON.parse(localStorage.getItem("auditorias")) || [];
    },
    handleEdit(id) {
      console.log("Editar auditoria com id:", id);
    },
    handleUpdate(auditoria) {
      this.carregarAuditorias();
    },
    handleConclude(auditoria) {
      const index = this.auditoriasData.findIndex(a => a.id === auditoria.id);
      if (index !== -1) {
        this.auditoriasData[index].status = "terminada";
        localStorage.setItem("auditorias", JSON.stringify(this.auditoriasData));
        this.carregarAuditorias();
        console.log("Auditoria concluída:", auditoria);
      }
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: #f0f0f0;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  margin-left: 2rem;
  max-width: calc(100% - 5rem);
  background: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.filter-container label {
  margin-right: 0.5rem;
  font-size: 0.9rem;
  color: #333;
}

.filter-container select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fafafa;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.filter-container select:focus {
  border-color: #007bff;
}

.no-audit-message {
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
}

.no-audit-message a {
  color: #007bff;
  text-decoration: underline;
}

/* Utiliza grid responsivo para ocupar mais itens conforme o espaço disponível */
.audit-list {
  display: grid;
  margin-top: 1rem;
  gap: 0.5rem; /* Espaço reduzido entre itens */
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  justify-content: center;
}

/* Ajustes responsivos */
@media (max-width: 1024px) {
  .audit-list {
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  }
}

@media (max-width: 600px) {
  .audit-list {
    grid-template-columns: 1fr;
  }
}
</style>
