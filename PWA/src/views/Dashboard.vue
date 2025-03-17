<template>
  <div class="dashboard-container">
    <SidebarMenu />
    
    <div class="dashboard-content">
      <div v-if="auditoriasData.length === 0" class="no-audit-message text-center mt-4">
        Nenhuma auditoria ativa. 
        <router-link to="/admin-adicionar-auditoria" class="text-decoration-none text-primary">
          Adicione uma agora!
        </router-link>
      </div>
        
      <div class="row text-center mt-4">
        <div class="col-md-4">
          <div class="card text-bg-primary mb-3">
            <div class="card-body">
              <h6 class="card-title">Total de Auditorias</h6>
              <p class="display-6">{{ totalAuditorias }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-bg-warning mb-3">
            <div class="card-body">
              <h6 class="card-title">Abertas</h6>
              <p class="display-6">{{ auditoriasAbertas }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-bg-success mb-3">
            <div class="card-body">
              <h6 class="card-title">Terminadas</h6>
              <p class="display-6">{{ auditoriasTerminadas }}</p>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card text-bg-info mb-3">
            <div class="card-body">
              <h6 class="card-title">Utilizadores registados</h6>
              <p class="display-6">{{ totalUtilizadores }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card text-bg-danger mb-3">
            <div class="card-body">
              <h6 class="card-title">Faturação Total (€)</h6>
              <p class="display-6">{{ faturacaoTotal.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <canvas ref="auditoriasChart"></canvas>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <canvas ref="faturacaoChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import SidebarMenu from "@/components/SidebarMenu.vue";

Chart.register(...registerables);

export default {
  components: {
    SidebarMenu
  },

  data() {
    return {
      auditoriasData: [], 
      totalUtilizadores: 0, 
      faturacaoTotal: 0, 
    };
  },

  computed: {
    totalAuditorias() {
      return this.auditoriasData.length; 
    },
    auditoriasAbertas() {
      return this.auditoriasData.filter(a => a.status === "aberta").length; 
    },
    auditoriasTerminadas() {
      return this.auditoriasData.filter(a => a.status === "terminada").length; 
    }
  },

  mounted() {
    this.carregarDados(); 
  },

  methods: {
    carregarDados() {
      const auditoriasSalvas = JSON.parse(localStorage.getItem("auditorias")) || [];
      console.log("Auditorias carregadas:", auditoriasSalvas);

      this.auditoriasData = auditoriasSalvas; 
      this.totalUtilizadores = (JSON.parse(localStorage.getItem("users")) || []).length;
      this.faturacaoTotal = this.auditoriasData.reduce((acc, auditoria) => acc + (auditoria.custoEstimado || 0), 0);

      this.mostrarGraficos();
    },

    mostrarGraficos() {
      if (this.$refs.auditoriasChart) {
        new Chart(this.$refs.auditoriasChart.getContext("2d"), {
          type: "bar",
          data: {
            labels: ["Total", "Em Aberto", "Resolvidas"],
            datasets: [{
              label: "Auditorias",
              data: [this.totalAuditorias, this.auditoriasAbertas, this.auditoriasTerminadas],
              backgroundColor: ["#0d6efd", "#ffc107", "#198754"]
            }]
          }
        });
      }

      if (this.$refs.faturacaoChart) {
        new Chart(this.$refs.faturacaoChart.getContext("2d"), {
          type: "line",
          data: {
            labels: this.auditoriasData.map(a => a.dataInicio),
            datasets: [{
              label: "Faturação (€)",
              data: this.auditoriasData.map(a => a.custoEstimado || 0),
              borderColor: "#dc3545",
              fill: false
            }]
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  overflow-x: hidden;
}

.dashboard-content {
    padding: 1.5rem;
    flex: 1;
    max-width: calc(100% - 12rem);
    overflow-x: hidden;
    margin: 0 auto;
}

.card-title {
  margin-bottom: 0.5rem; 
}

.display-6 {
  margin-top: 0.5rem; 
}

.card-body {
  gap: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
}

.no-audit-message {
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
}

.row {
  display: flex;
  justify-content: center;
}

.card {
  width: 100%;
  max-width: 37rem;
  margin: 0.5rem;
  box-sizing: border-box;
  overflow: hidden;
}

canvas {
  max-width: 100%;
  height: auto;
}

@media (max-width: 1024px) {
  .dashboard-container {
    flex-direction: column;
  }

  .dashboard-content {
    margin-left: 2rem;  
    padding: 1rem;
    width: 90%;
    margin: 0 auto;
  }

  .card {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }

  .dashboard-content {
    margin-left: 0;
    padding: 1rem;
    width: 100%; 
    margin: 0 auto;
  }

  .card {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .card-body {
    flex-direction: column; 
    align-items: center;
  }

  .card {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
