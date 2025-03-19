<template>
  <div class="dashboard-container">
    <SidebarMenu />

    <div class="dashboard-content">
      <div v-if="auditoriasData.length === 0" class="no-audit-message">
        Nenhuma auditoria ativa.
        <router-link to="/admin-add-audit" class="link-add">
          Adiciona uma aqui!
        </router-link>
      </div>

      <!-- Grid para os cards de métricas -->
      <div class="cards-grid">
        <div class="metric-card card-total">
          <h6 class="card-title">Total de Auditorias</h6>
          <p class="display-number">{{ totalAuditorias }}</p>
        </div>
        <div class="metric-card card-abertas">
          <h6 class="card-title">Abertas</h6>
          <p class="display-number">{{ auditoriasAbertas }}</p>
        </div>
        <div class="metric-card card-terminadas">
          <h6 class="card-title">Terminadas</h6>
          <p class="display-number">{{ auditoriasTerminadas }}</p>
        </div>
        <div class="metric-card card-utilizadores">
          <h6 class="card-title">Utilizadores registados</h6>
          <p class="display-number">{{ totalUtilizadores }}</p>
        </div>
        <div class="metric-card card-faturacao">
          <h6 class="card-title">Faturação Total (€)</h6>
          <p class="display-number">{{ faturacaoTotal.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Grid para os gráficos de auditorias e faturação -->
      <div class="charts-grid">
        <div class="chart-card">
          <canvas ref="auditoriasChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas ref="faturacaoChart"></canvas>
        </div>
      </div>

      <!-- Novo gráfico de pizza para os materiais necessários -->
      <div class="charts-grid">
        <div class="chart-card">
          <canvas ref="materiaisChart"></canvas>
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
      this.auditoriasData = auditoriasSalvas;
      this.totalUtilizadores = (JSON.parse(localStorage.getItem("users")) || []).length;
      this.faturacaoTotal = this.auditoriasData.reduce(
        (acc, auditoria) => acc + (auditoria.custoEstimado || 0),
        0
      );
      this.mostrarGraficos();
    },
    mostrarGraficos() {
      // Gráfico de Auditorias (Bar Chart)
      if (this.$refs.auditoriasChart) {
        new Chart(this.$refs.auditoriasChart.getContext("2d"), {
          type: "bar",
          data: {
            labels: ["Total", "Em Aberto", "Terminadas"],
            datasets: [{
              label: "Auditorias",
              data: [this.totalAuditorias, this.auditoriasAbertas, this.auditoriasTerminadas],
              backgroundColor: ["#0d6efd", "#ffc107", "#198754"]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#333", font: { size: 12 } }
              },
              x: {
                ticks: { color: "#333", font: { size: 12 } }
              }
            }
          }
        });
      }

      // Gráfico de Faturação (Line Chart)
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
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#333", font: { size: 12 } }
              },
              x: {
                ticks: { color: "#333", font: { size: 12 } }
              }
            }
          }
        });
      }

      // Novo Gráfico de Pizza para Materiais Necessários
      if (this.$refs.materiaisChart) {
        // Agrupar e contar os materiais de todas as auditorias
        const materialsCount = {};
        this.auditoriasData.forEach(auditoria => {
          if (auditoria.materialNecessario && Array.isArray(auditoria.materialNecessario)) {
            auditoria.materialNecessario.forEach(material => {
              const trimmed = material.trim();
              if (trimmed) {
                materialsCount[trimmed] = (materialsCount[trimmed] || 0) + 1;
              }
            });
          }
        });
        const labels = Object.keys(materialsCount);
        const data = Object.values(materialsCount);

        new Chart(this.$refs.materiaisChart.getContext("2d"), {
          type: "pie",
          data: {
            labels: labels,
            datasets: [{
              label: "Materiais Necessários",
              data: data,
              backgroundColor: labels.map((_, index) => {
                const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
                return colors[index % colors.length];
              })
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: "#333",
                  font: { size: 12 }
                }
              }
            }
          }
        });
      }
    }
  }
};
</script>

<style scoped>
/* Layout geral */
.dashboard-container {
  display: flex;
  height: 100vh;
  overflow-x: hidden;
  background: #ffffff;
}

.dashboard-content {
  flex: 1;
  padding: 1rem;
  margin: 0 auto;
  max-width: 65rem;
}

/* Mensagem sem auditorias */
.no-audit-message {
  font-size: 1.2rem;
  text-align: center;
  margin: 1rem 0;
}
.link-add {
  color: #0d6efd;
  text-decoration: underline;
}

/* Grid para os cards de métricas */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

/* Estilo comum para os cards */
.metric-card {
  background-color: #02413d;
  color: #fff;
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  text-align: center;
}

/* Diferenciação de cores (opcional) */
.card-total { background-color: rgba(2, 59, 28, 0.68); }
.card-abertas { background-color: rgba(2, 59, 28, 0.68); }
.card-terminadas { background-color: rgba(2, 59, 28, 0.68); }
.card-utilizadores { background-color: rgba(2, 59, 28, 0.68); }
.card-faturacao { background-color: rgba(80, 94, 86, 0.8); }

/* Títulos e números dos cards */
.card-title {
  font-size: 0.9rem;
  margin: 0;
  text-transform: uppercase;
}
.display-number {
  font-size: 2.2rem;
  font-weight: bold;
  margin-top: 0.25rem;
  word-break: break-all;
}

/* Grid para os gráficos */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.chart-card {
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 250px;
}

.chart-card canvas {
  width: 100% !important;
  height: 100% !important;
}

/* Versão para telas médias ou maiores */
@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .charts-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Redução de espaçamentos para telemóvel */
@media (max-width: 480px) {
  .dashboard-content {
    padding: 0.5rem;
  }
  .metric-card {
    padding: 0.5rem;
    min-height: 100px;
  }
  .display-number {
    font-size: 1.8rem;
  }
  .chart-card {
    height: 200px;
  }
}
</style>
