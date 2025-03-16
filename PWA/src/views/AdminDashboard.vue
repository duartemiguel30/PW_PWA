<template>
  <div class="dashboard-container">
    <SidebarMenu />
    <div class="dashboard-content">

      <div v-if="auditoriasData.length === 0" class="no-audit-message">
        Nenhuma auditoria ativa. <router-link to="/admin-adicionar-auditoria">Adicione uma agora!</router-link>
      </div>

      <div class="audit-list">
        <AuditItem v-for="(auditoria, index) in auditoriasData" :key="index" :auditoria="auditoria" />
      </div>
    </div>
  </div>
</template>

<script>
import SidebarMenu from '@/components/SidebarMenu.vue';
import AuditItem from '@/components/AuditItem.vue';
import auditImage from '@/assets/audit.jpg'; // Imagem fictícia

export default {
  components: {
    SidebarMenu,
    AuditItem
  },
  data() {
    return {
      auditoriasData: [] // Array de auditorias que será preenchido
    };
  },
  mounted() {
    this.carregarAuditorias(); // Carrega as auditorias quando o componente for montado
  },
  methods: {
    carregarAuditorias() {
      // Carrega auditorias do Local Storage
      const auditoriasSalvas = JSON.parse(localStorage.getItem("auditorias")) || [];
      
      // Adiciona auditorias padrão apenas se ainda não houver dados no Local Storage
      if (auditoriasSalvas.length === 0) {
        this.auditoriasData = [
          {
            imagem: auditImage,
            peritoPrincipal: 'João Silva',
            dataInicio: '2025-03-01',
            dataFim: '2025-03-05',
            peritosAdicionais: ['Maria Souza', 'Carlos Pereira'],
            materialNecessario: ['Laptop', 'Documentos de referência'],
            custoEstimado: 1500.00
          },
          {
            imagem: auditImage,
            peritoPrincipal: 'Ana Oliveira',
            dataInicio: '2025-03-10',
            dataFim: '2025-03-15',
            peritosAdicionais: ['Lucas Costa'],
            materialNecessario: ['Projetor', 'Relatório'],
            custoEstimado: 1200.50
          }
        ];
        // Salva as auditorias no Local Storage para evitar que sumam ao recarregar a página
        localStorage.setItem("auditorias", JSON.stringify(this.auditoriasData));
      } else {
        this.auditoriasData = auditoriasSalvas;
      }
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
  max-width: 75rem; /* Aproximadamente 1200px */
}

.audit-list {
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(18.75rem, 1fr)); /* 300px -> 18.75rem */
  gap: 1.5rem;
  justify-content: flex-start;
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

@media (max-width: 48rem) { /* 768px -> 48rem */
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
