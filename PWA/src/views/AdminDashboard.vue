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
import auditImage from '@/assets/audit.jpg'; 

export default {
  components: {
    SidebarMenu,
    AuditItem
  },
  data() {
    return {
      auditoriasData: [] 
    };
  },
  mounted() {
    this.carregarAuditorias(); 
  },
  methods: {
    carregarAuditorias() {

      const auditoriasguardadas = JSON.parse(localStorage.getItem("auditorias")) || [];
      
      if (auditoriasguardadas.length === 0) {
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

        localStorage.setItem("auditorias", JSON.stringify(this.auditoriasData));
      } else {
        this.auditoriasData = auditoriasguardadas;
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
  max-width: 75rem;
}

.audit-list {
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(18.75rem, 1fr)); 
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
