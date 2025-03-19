<template>
  <div class="dashboard-container">
    <SidebarMenu />
    <div class="dashboard-content">
      <!-- Filtro de Auditorias -->
      <div v-if="auditoriasData.length > 0" class="filter-container">
        <label for="audit-filter">Estado</label>
        <select id="audit-filter" v-model="filtroSelecionado">
          <option value="abertas">Abertas</option>
          <option value="fechadas">Fechadas</option>
        </select>
      </div>

      <!-- Mensagem quando não há auditorias -->
      <div v-if="auditoriasFiltradas.length === 0" class="no-audit-message">
        Nenhuma auditoria encontrada.
        <router-link to="/admin-add-audit">Adicione uma aqui.</router-link>
      </div>

      <!-- Exibição de Auditorias Abertas como Cards -->
      <div v-if="filtroSelecionado === 'abertas'" class="audit-list">
        <AuditItem
          v-for="auditoria in auditoriasFiltradas"
          :key="auditoria.id"
          :auditoria="auditoria"
          @edit="handleEdit"
          @update="handleUpdate"
        />
      </div>

      <!-- Exibição de Auditorias Fechadas em uma única Tabela -->
      <div v-else-if="filtroSelecionado === 'fechadas'" class="audit-table-container">
        <table class="audit-table">
          <thead>
            <tr>
              <th>Perito Principal</th>
              <th>Data Início - Fim</th>
              <th>Material</th>
              <th>Custo Estimado</th>
              <th>Peritos Adicionais</th>
            </tr>
          </thead>
          <tbody>
            <!-- Cada AuditItem renderiza uma linha (<tr>) -->
            <AuditItem
              v-for="auditoria in auditoriasFiltradas"
              :key="auditoria.id"
              :auditoria="auditoria"
              @update="handleUpdate"
            />
          </tbody>
        </table>
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
      if (this.filtroSelecionado === "abertas") {
        return this.auditoriasData.filter(a => a.status === "aberta");
      } else if (this.filtroSelecionado === "fechadas") {
        return this.auditoriasData.filter(a => a.status === "terminada");
      }
      return this.auditoriasData;
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
      // Lógica para editar auditoria
      console.log("Editar auditoria com id:", id);
    },
    handleUpdate(auditoria) {
      // Atualiza a lista se necessário
      this.carregarAuditorias();
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-content {
  padding: 1.5rem;
  flex: 1;
  max-width: 75rem;
  margin: 0 auto;
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

/* Grid responsivo para auditorias abertas */
.audit-list {
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  justify-content: center;
}

@media (max-width: 1024px) {
  .audit-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .audit-list {
    grid-template-columns: 1fr;
  }
}

/* Tabela de auditorias fechadas */
.audit-table-container {
  margin-top: 1rem;
  overflow-x: auto;
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}

.audit-table th,
.audit-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.audit-table th {
  background-color: rgb(7, 56, 1);
  color: white;
}

.no-audit-message {
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
}

.no-audit-message a {
  color: blue;
  text-decoration: underline;
}
</style>
