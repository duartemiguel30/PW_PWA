<template>
  <div class="dashboard-container">
    <SidebarMenu />
    <div class="dashboard-content">
      <template v-if="isDesktop">
        <!-- Top row: Gráfico de faturação destacado e cards -->
        <div class="top-row">
          <div class="faturacao-chart-highlight">
            <canvas ref="faturacaoChart"></canvas>
          </div>
          <div class="cards-side">
            <div class="metric-card card-faturacao">
              <h6 class="card-title">Faturação Total (€)</h6>
              <p class="display-number">{{ faturacaoTotal.toFixed(2) }}</p>
            </div>
            <div class="metric-card card-total">
              <h6 class="card-title">Total de Auditorias</h6>
              <p class="display-number">{{ totalAuditorias }}</p>
            </div>
          </div>
        </div>

        <!-- Segunda row: Gráficos de auditorias e materiais -->
        <div class="charts-grid desktop-charts">
          <div class="chart-card">
            <canvas ref="auditoriasChart"></canvas>
          </div>
          <div class="chart-card">
            <canvas ref="materiaisChart"></canvas>
          </div>
        </div>

        <!-- Terceira row: Lista de utilizadores registados -->
        <div class="users-list-container">
          <h3>Utilizadores Registados</h3>
          <table class="users-list">
            <tbody>
              <tr v-for="(user, index) in usersList" :key="index" class="user-row">
                <td class="user-info">
                  <h4>{{ user.name }}</h4>
                  <p>{{ user.email }}</p>
                </td>
                <td class="arrow-cell">
                  <span class="arrow">&#9654;</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else>
        <!-- Layout Mobile -->
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
      usersList: [],
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

      const users = JSON.parse(localStorage.getItem("users")) || [];
      this.totalUtilizadores = users.length;
      this.usersList = users;

      this.faturacaoTotal = this.auditoriasData.reduce(
        (acc, auditoria) => acc + (auditoria.custoEstimado || 0),
        0
      );
      this.mostrarGraficos();
    },
    mostrarGraficos() {
      // Gráfico de Auditorias
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

      // Gráfico de Faturação – linha com borderWidth para forçar exibição
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
              borderColor: "#003366",
              borderWidth: 2,
              fill: false,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#fff", font: { size: 12 } }
              },
              x: {
                ticks: { color: "#fff", font: { size: 12 } }
              }
            }
          }
        });
      }

      // Gráfico de Materiais
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
            labels,
            datasets: [{
              label: "Materiais Necessários",
              data,
              backgroundColor: labels.map((_, i) => {
                const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
                return colors[i % colors.length];
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
/* Fundo da página em cinza clarinho */
.dashboard-container {
  display: flex;
  height: 100vh;
  overflow-x: hidden;
  background: #f0f0f0;
}

/* Mantém max-width de 1100px */
.dashboard-content {
  flex: 1;
  max-width: 1100px;
  padding: 5rem 1.5rem 1.5rem;
  margin: 0 auto;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Layout Desktop */
.top-row {
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
}
/* Fundo do gráfico de faturação com azul mais escuro */
.faturacao-chart-highlight {
  flex: 2;
  background-color: #003366;
  border-radius: 0.5rem;
  padding: 1rem;
  position: relative;
  height: 300px;
}
.cards-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}

/* Cards */
.metric-card {
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  text-align: center;
}
.card-faturacao {
  background-color: #90EE90;
  color: #fff;
}
.card-total {
  background-color: #fff;
  color: #333;
}

/* Gráficos */
.charts-grid {
  display: grid;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 1rem;
}
.desktop-charts {
  grid-template-columns: repeat(2, 1fr);
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

/* Lista de Utilizadores */
.users-list-container {
  width: 100%;
  margin-top: 1rem;
  padding: 0 1rem;
}
.users-list {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
}
.user-row {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: background-color 0.2s ease;
}
.user-row:hover {
  background-color: #f9f9f9;
}
.user-info {
  padding: 0.75rem 1rem;
  text-align: left;
}
.arrow-cell {
  width: 2rem;
  text-align: center;
  color: #ccc;
}
.arrow {
  font-size: 1.2rem;
  color: #bbb;
}

/* Layout Mobile */
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
.cards-grid {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.mobile-cards {
  grid-template-columns: repeat(2, minmax(140px, 1fr));
}
.mobile-bottom-padding,
.faturacao-tab {
  padding-bottom: 4rem;
}

/* Mobile: alternar fundo dos cards entre verde e branco */
@media (max-width: 480px) {
  .dashboard-content {
    padding: 5rem 0.5rem 1.5rem;
  }
  .cards-grid {
    grid-template-columns: 1fr;
  }
  .mobile-cards .metric-card:nth-child(odd) {
    background-color: #90EE90 !important;
  }
  .mobile-cards .metric-card:nth-child(even) {
    background-color: #fff !important;
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

/* iPad mini: dispositivos entre 600px e 768px – layout igual ao mobile */
@media (min-width: 600px) and (max-width: 768px) {
  .dashboard-content {
    margin-left: 0 !important;
    padding: 5rem 0.5rem 1.5rem;
  }
}

/* iPad Air: dispositivos entre 769px e 1024px */
@media (min-width: 769px) and (max-width: 1024px) {
  .dashboard-content {
    position: relative;
    z-index: 1;
    margin-left: 20rem; /* Evita sobreposição da Sidebar */
    padding-top: 2rem;
  }
}

/* Responsividade adicional para telas maiores */
@media (min-width: 1025px) {
  .dashboard-content {
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 2rem;
  }
}
</style>
