<template>
  <div class="dashboard-container">
    <SidebarMenu />
    <div class="dashboard-content">
      <template v-if="isDesktop">
        <div v-if="auditoriasData.length === 0" class="no-audit-message">
          Nenhuma auditoria ativa.
          <router-link to="/admin-add-audit" class="link-add">
            Adiciona uma aqui!
          </router-link>
        </div>
        <div class="cards-grid desktop-cards">
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

        <div class="charts-grid desktop-charts">
          <div class="chart-card">
            <canvas ref="auditoriasChart"></canvas>
          </div>
          <div class="chart-card">
            <canvas ref="faturacaoChart"></canvas>
          </div>
        </div>

        <div class="charts-grid desktop-charts">
          <div class="chart-card">
            <canvas ref="materiaisChart"></canvas>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="mobile-nav">
          <button @click="prevPage" :disabled="currentPage === 0" class="nav-arrow">
            &#9664;
          </button>
          <h2 class="page-title">{{ currentPageTitle }}</h2>
          <button @click="nextPage" :disabled="currentPage === tabs.length - 1" class="nav-arrow">
            &#9654;
          </button>
        </div>

        <div v-if="currentPage === 0" class="tab-content">
          <div v-if="auditoriasData.length === 0" class="no-audit-message">
            Nenhuma auditoria ativa.
            <router-link to="/admin-add-audit" class="link-add">
              Adiciona uma aqui!
            </router-link>
          </div>
          <div class="cards-grid mobile-cards">
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
          </div>
          <div class="charts-grid mobile-charts">
            <div class="chart-card">
              <canvas ref="auditoriasChart"></canvas>
            </div>
          </div>
          <div class="mobile-bottom-padding"></div>
        </div>

        <div v-else-if="currentPage === 1" class="tab-content faturacao-tab">
          <div class="cards-grid mobile-cards">
            <div class="metric-card card-faturacao">
              <h6 class="card-title">Faturação Total (€)</h6>
              <p class="display-number">{{ faturacaoTotal.toFixed(2) }}</p>
            </div>
            <div class="metric-card card-utilizadores">
              <h6 class="card-title">Utilizadores registados</h6>
              <p class="display-number">{{ totalUtilizadores }}</p>
            </div>
          </div>
          <div class="charts-grid mobile-charts">
            <div class="chart-card">
              <canvas ref="faturacaoChart"></canvas>
            </div>
            <div class="chart-card">
              <canvas ref="materiaisChart"></canvas>
            </div>
          </div>
          <div class="mobile-bottom-padding"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import SidebarMenu from "@/components/SidebarMenu.vue";

Chart.register(...registerables);

export default {
  components: { SidebarMenu },
  data() {
    return {
      tabs: ["Auditorias", "Faturação & Materiais"],
      currentPage: 0,
      auditoriasData: [],
      totalUtilizadores: 0,
      faturacaoTotal: 0,
      isDesktop: window.innerWidth > 768,
      chartAuditorias: null,
      chartFaturacao: null,
      chartMateriais: null,
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
    },
    currentPageTitle() {
      return this.tabs[this.currentPage];
    }
  },
  mounted() {
    this.carregarDados();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  watch: {
    currentPage() {
      this.$nextTick(() => {
        this.mostrarGraficos();
      });
    }
  },
  methods: {
    handleResize() {
      this.isDesktop = window.innerWidth > 768;
      this.$nextTick(() => {
        this.mostrarGraficos();
      });
    },
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
      if (this.chartAuditorias) {
        this.chartAuditorias.destroy();
      }
      if (this.$refs.auditoriasChart) {
        this.chartAuditorias = new Chart(this.$refs.auditoriasChart.getContext("2d"), {
          type: "bar",
          data: {
            labels: ["Total", "Em Aberto", "Terminadas"],
            datasets: [{
              label: "Auditorias",
              data: [this.totalAuditorias, this.auditoriasAbertas, this.auditoriasTerminadas],
              backgroundColor: ["#0d6efd", "#ffc107", "#198754"],
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

      if (this.chartFaturacao) {
        this.chartFaturacao.destroy();
      }
      if (this.$refs.faturacaoChart) {
        this.chartFaturacao = new Chart(this.$refs.faturacaoChart.getContext("2d"), {
          type: "line",
          data: {
            labels: this.auditoriasData.map(a => a.dataInicio),
            datasets: [{
              label: "Faturação (€)",
              data: this.auditoriasData.map(a => a.custoEstimado || 0),
              borderColor: "#dc3545",
              fill: false,
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

      if (this.chartMateriais) {
        this.chartMateriais.destroy();
      }
      if (this.$refs.materiaisChart) {
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
        this.chartMateriais = new Chart(this.$refs.materiaisChart.getContext("2d"), {
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
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.tabs.length - 1) {
        this.currentPage++;
      }
    }
  }
};
</script>

<style scoped>
.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 110;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 4rem;
}

.page-title {
  font-size: 1.2rem;
  margin: 0;
  flex-grow: 1;
  text-align: center;
  color: #333;
}

.nav-arrow {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #006400 !important;
  padding: 0.25rem 0.5rem;
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: default;
}

.dashboard-container {
  display: flex;
  height: 100vh;
  overflow-x: hidden;
  background: #ffffff;
}

.dashboard-content {
  flex: 1;
  padding: 5rem 1.5rem 1.5rem; 
  margin: 0 auto;
  max-width: 90rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.no-audit-message {
  font-size: 1.2rem;
  text-align: center;
  margin: 1rem 0;
}

.link-add {
  color: #006400;
  text-decoration: underline;
}

.cards-grid {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.desktop-cards {
  grid-template-columns: repeat(5, 1fr);
}
.mobile-cards {
  grid-template-columns: repeat(2, minmax(140px, 1fr));
}

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
.card-total { background-color: rgba(2, 59, 28, 0.68); }
.card-abertas { background-color: rgba(2, 59, 28, 0.68); }
.card-terminadas { background-color: rgba(2, 59, 28, 0.68); }
.card-utilizadores { background-color: rgba(2, 59, 28, 0.68); }
.card-faturacao { background-color: rgba(80, 94, 86, 0.8); }
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

.charts-grid {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.desktop-charts {
  grid-template-columns: repeat(2, 1fr);
}
.mobile-charts {
  grid-template-columns: 1fr;
}
.chart-card {
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 250px;
}
.chart-card canvas {
  width: 100% !important;
  height: 100% !important;
}

.tab-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 3rem;
}

.mobile-bottom-padding,
.faturacao-tab {
  padding-bottom: 4rem;
}

.card-actions {
  padding: 0.5rem 1rem;
  text-align: right;
}

.edit-form .form-group {
  margin-bottom: 1rem;
}
.edit-form label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.3rem;
}
.edit-form input,
.edit-form textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .dashboard-content {
    padding-left: 7rem;
    padding-top: 2rem;
  }
  .desktop-cards {
    grid-template-columns: repeat(5, 1fr);
  }
  .desktop-charts {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .dashboard-content {
    padding: 5rem 0.5rem 1.5rem;
  }
  .cards-grid {
    grid-template-columns: 1fr;
  }
  .metric-card {
    padding: 0.5rem;
    min-height: 100px;
  }
  .display-number {
    font-size: 1.8rem;
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .chart-card {
    height: 200px;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    max-width: 100%;
    padding: 5rem 1rem 1.5rem;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .dashboard-content {
    max-width: 100%;
    margin: 0 auto;
    padding: 4rem 2rem 1.5rem;
  }
}
</style>
