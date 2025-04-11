<template>
  <div class="dashboard-container container-fluid">
    <SidebarMenu />
    <div class="dashboard-content container">
      <div class="alert alert-info text-center w-100 greeting-msg" role="alert">
        Bem vindo de volta, {{ user.name }}!
      </div>

      <template v-if="isDesktop">
        <div class="top-row row w-100 mb-3">
          <div class="faturacao-chart-highlight col-md-8">
            <canvas ref="faturacaoChart"></canvas>
          </div>
          <div class="cards-side col-md-4 d-flex flex-column justify-content-center">
            <div class="metric-card card-faturacao mb-3">
              <h6 class="card-title">Faturação Total (€)</h6>
              <p class="display-number">{{ faturacaoTotal.toFixed(2) }}</p>
            </div>
            <div class="metric-card card-total">
              <h6 class="card-title">Total de Auditorias</h6>
              <p class="display-number">{{ totalAuditorias }}</p>
            </div>
          </div>
        </div>

        <div class="charts-grid desktop-charts row w-100 mb-2">
          <div class="chart-card col-md-6 mb-3 mb-md-0">
            <canvas ref="auditoriasChart"></canvas>
          </div>
          <div class="chart-card col-md-6">
            <canvas ref="materiaisChart"></canvas>
          </div>
        </div>

        <div class="users-list-container w-100">
          <h3>Utilizadores Registados</h3>
          <table class="users-list table table-borderless">
            <tbody>
              <tr v-for="(userItem, index) in usersList" :key="index" class="user-row">
                <td class="user-info">
                  <h4>{{ userItem.name }}</h4>
                  <p>{{ userItem.email }}</p>
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
        <div class="mobile-nav fixed-top d-flex justify-content-between align-items-center px-3 py-2 bg-white shadow-sm">
          <button @click="prevPage" :disabled="currentPage === 0" class="nav-arrow btn btn-link p-0">
            &#9664;
          </button>
          <h2 class="page-title flex-grow-1 text-center m-0 text-dark">{{ currentPageTitle }}</h2>
          <button @click="nextPage" :disabled="currentPage === tabs.length - 1" class="nav-arrow btn btn-link p-0">
            &#9654;
          </button>
        </div>

        <div v-if="currentPage === 0" class="tab-content mt-3 pt-3">
          <div v-if="auditoriasData.length === 0" class="no-audit-message">
            Nenhuma auditoria ativa.
            <router-link to="/admin-add-audit" class="link-add">
              Adiciona uma aqui!
            </router-link>
          </div>
          <div class="cards-grid mobile-cards row">
            <div class="metric-card mobile-card col-6">
              <h6 class="card-title">Total de Auditorias</h6>
              <p class="display-number">{{ totalAuditorias }}</p>
            </div>
            <div class="metric-card mobile-card col-6">
              <h6 class="card-title">Abertas</h6>
              <p class="display-number">{{ auditoriasAbertas }}</p>
            </div>
            <div class="metric-card mobile-card col-6">
              <h6 class="card-title">Terminadas</h6>
              <p class="display-number">{{ auditoriasTerminadas }}</p>
            </div>
          </div>
          <div class="charts-grid mobile-charts row mb-3">
            <div class="chart-card col-12">
              <canvas ref="auditoriasChart"></canvas>
            </div>
          </div>
          <div class="mobile-bottom-padding"></div>
        </div>

        <div v-else-if="currentPage === 1" class="tab-content faturacao-tab mt-3 pt-3">
          <div class="cards-grid mobile-cards row">
            <div class="metric-card mobile-card col-6">
              <h6 class="card-title">Faturação Total (€)</h6>
              <p class="display-number">{{ faturacaoTotal.toFixed(2) }}</p>
            </div>
            <div class="metric-card mobile-card col-6">
              <h6 class="card-title">Utilizadores registados</h6>
              <p class="display-number">{{ totalUtilizadores }}</p>
            </div>
          </div>
          <div class="charts-grid mobile-charts row mb-3">
            <div class="chart-card faturacao-chart-mobile col-6">
              <canvas ref="faturacaoChart"></canvas>
            </div>
            <div class="chart-card col-6">
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
      user: { name: "Utilizador" },
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

      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      if (loggedUser) {
        this.user = loggedUser;
      }

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
        const config = { fill: false, borderColor: "#90EE90", backgroundColor: "transparent" };
        this.chartFaturacao = new Chart(this.$refs.faturacaoChart.getContext("2d"), {
          type: "line",
          data: {
            labels: this.auditoriasData.map(a => a.dataInicio),
            datasets: [{
              label: "Faturação (€)",
              data: this.auditoriasData.map(a => a.custoEstimado || 0),
              borderColor: config.borderColor,
              borderWidth: 2,
              fill: config.fill,
              backgroundColor: config.backgroundColor,
              tension: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#ffffff", font: { size: 12 } }
              },
              x: {
                ticks: { color: "#ffffff", font: { size: 12 } }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: "#ffffff",
                  font: { size: 12 }
                }
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
.dashboard-container {
  display: flex;
  background: #f0f0f0;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
}
@media (min-width: 769px) {
  .dashboard-container {
    height: 100vh;
  }
}
@media (max-width: 768px) {
  .dashboard-container {
    height: auto;
  }
}

.dashboard-content {
  flex: 1;
  max-width: 1100px;
  padding: 3rem 1.5rem 1.5rem;
  margin: 0 auto;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  .dashboard-content {
    padding-top: 3rem;
  }
  .greeting-msg {
    margin-bottom: 0.5rem;
  }
}

.top-row {
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
}
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

.metric-card {
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  text-align: center;
  margin-bottom: 1rem;
}
.card-faturacao {
  background-color: #90EE90;
  color: #fff;
}
.card-total {
  background-color: #fff;
  color: #333;
}

@media (max-width: 768px) {
  .mobile-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .mobile-cards .mobile-card {
    background-color: #90EE90 !important;
    color: #fff !important;
    flex: 0 0 calc(50% - 1rem);
    padding: 0.5rem;
  }
}

.chart-card {
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 250px;
}
.faturacao-chart-mobile {
  background-color: #003366 !important;
}
.chart-card canvas {
  width: 100% !important;
  height: 100% !important;
}

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
  color: #008000;
}

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
  color: #008000 !important;
  padding: 0.25rem 0.5rem;
}
.nav-arrow:disabled {
  opacity: 0.3;
  cursor: default;
}
</style>
