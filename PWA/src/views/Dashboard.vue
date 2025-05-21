<template>
  <div class="d-flex bg-light min-vh-100">
    <!-- Sidebar Menu -->
    <SidebarMenu />

    <!-- Main Content -->
    <div class="flex-fill p-3 p-md-5 content-area">
      <!-- Greeting -->
      <div class="alert alert-success text-center mb-4">
        Bem-vindo de volta, {{ user.name }}!
      </div>

      <!-- Mobile Tab Navigation -->
      <ul
        class="nav nav-pills mb-3 justify-content-center d-md-none"
        role="tablist"
      >
        <li class="nav-item" v-for="(tab, idx) in tabs" :key="idx">
          <button
            class="nav-link text-center"
            :class="{ active: currentPage === idx }"
            @click="currentPage = idx"
          >
            {{ tab }}
          </button>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Auditorias Tab -->
        <div
          class="tab-pane fade"
          :class="{ 'show active': currentPage === 0 }"
          role="tabpanel"
        >
          <div class="row g-3">
            <!-- Total Auditorias Card -->
            <div class="col-6 col-md-4">
              <div class="card text-center shadow-sm border-success">
                <div class="card-body">
                  <h6 class="card-title text-success">Total</h6>
                  <p class="display-5 mb-0 text-success">{{ totalAuditorias }}</p>
                  <small class="text-muted">Auditorias</small>
                </div>
              </div>
            </div>

            <!-- Abertas Card -->
            <div class="col-6 col-md-4">
              <div class="card text-center shadow-sm border-success">
                <div class="card-body">
                  <h6 class="card-title text-success">Abertas</h6>
                  <p class="display-5 mb-0 text-success">{{ auditoriasAbertas }}</p>
                  <small class="text-muted">Em progresso</small>
                </div>
              </div>
            </div>

            <!-- Concluídas Card -->
            <div class="col-6 col-md-4">
              <div class="card text-center shadow-sm border-success">
                <div class="card-body">
                  <h6 class="card-title text-success">Concluídas</h6>
                  <p class="display-5 mb-0 text-success">{{ auditoriasTerminadas }}</p>
                  <small class="text-muted">Finalizadas</small>
                </div>
              </div>
            </div>

            <!-- Auditorias Chart -->
            <div class="col-12">
              <div class="card shadow-sm border-success">
                <div class="card-body p-2" style="height: 200px;">
                  <canvas ref="auditoriasChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Faturação Tab -->
        <div
          class="tab-pane fade"
          :class="{ 'show active': currentPage === 1 }"
          role="tabpanel"
        >
          <div class="row g-3">
            <div class="col-6 col-md-4">
              <div class="card text-center shadow-sm border-success">
                <div class="card-body">
                  <h6 class="card-title text-success">Faturação (€)</h6>
                  <p class="display-5 mb-0 text-success">{{ faturacaoTotal.toFixed(2) }}</p>
                </div>
              </div>
            </div>


            <div class="col-6 col-md-4">
              <div class="card text-center shadow-sm border-success">
                <div class="card-body">
                  <h6 class="card-title text-success">Utilizadores</h6>
                  <p class="display-5 mb-0 text-success">{{ totalUtilizadores }}</p>
                </div>
              </div>
            </div>

            <!-- Linha de Faturação Chart -->
            <div class="col-12 col-md-4">
              <div class="card shadow-sm border-success">
                <div class="card-body p-2" style="height: 200px;">
                  <canvas ref="faturacaoChart"></canvas>
                </div>
              </div>
            </div>

            <!-- Materiais Pie Chart -->
            <div class="col-12">
              <div class="card shadow-sm border-success">
                <div class="card-body p-2" style="height: 200px;">
                  <canvas ref="materiaisChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Chart, registerables } from 'chart.js';
import SidebarMenu from '@/components/SidebarMenu.vue';

Chart.register(...registerables);

export default {
  name: 'AdminDashboard',
  components: { SidebarMenu },
  data() {
    return {
      tabs: ['Auditorias', 'Faturação'],
      currentPage: 0,
      auditoriasData: [],
      totalUtilizadores: 0,
      faturacaoTotal: 0,
      chartAuditorias: null,
      chartFaturacao: null,
      chartMateriais: null,
      user: { name: 'Utilizador' },
    };
  },
  computed: {
    totalAuditorias() {
      return this.auditoriasData.length;
    },
    auditoriasAbertas() {
      return this.auditoriasData.filter((a) => a.estado === 'Aberto')
        .length;
    },
    auditoriasTerminadas() {
      return this.auditoriasData.filter((a) => a.estado === 'Concluída')
        .length;
    },
  },
  mounted() {
    this.loadData();
    this.$nextTick(this.renderCharts);
  },
  methods: {
    loadData() {
      this.auditoriasData = JSON.parse(
        localStorage.getItem('reports') || '[]'
      );
      this.totalUtilizadores = JSON.parse(
        localStorage.getItem('users') || '[]'
      ).length;
      this.faturacaoTotal = this.auditoriasData.reduce(
        (sum, a) => sum + (a.custoEstimado || 0),
        0
      );
      const lg = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      if (lg.name) this.user = lg;
    },
    renderCharts() {
      // Auditorias Bar Chart
      if (this.chartAuditorias) this.chartAuditorias.destroy();
      this.chartAuditorias = new Chart(
        this.$refs.auditoriasChart.getContext('2d'),
        {
          type: 'bar',
          data: {
            labels: ['Total', 'Abertas', 'Concluídas'],
            datasets: [
              {
                data: [
                  this.totalAuditorias,
                  this.auditoriasAbertas,
                  this.auditoriasTerminadas,
                ],
                backgroundColor: ['#198754', '#20c997', '#218838'],
              },
            ],
          },
          options: { responsive: true, maintainAspectRatio: false },
        }
      );

      // Faturação Line Chart
      if (this.chartFaturacao) this.chartFaturacao.destroy();
      this.chartFaturacao = new Chart(
        this.$refs.faturacaoChart.getContext('2d'),
        {
          type: 'line',
          data: {
            labels: this.auditoriasData.map((a) => a.data),
            datasets: [
              {
                data: this.auditoriasData.map(
                  (a) => a.custoEstimado || 0
                ),
                borderColor: '#198754',
                fill: false,
                tension: 0.2,
              },
            ],
          },
          options: { responsive: true, maintainAspectRatio: false },
        }
      );

      // Materiais Pie Chart
      const count = {};
      this.auditoriasData.forEach((a) =>
        (a.materiais || []).forEach((m) => {
          count[m] = (count[m] || 0) + 1;
        })
      );
      if (this.chartMateriais) this.chartMateriais.destroy();
      this.chartMateriais = new Chart(
        this.$refs.materiaisChart.getContext('2d'),
        {
          type: 'pie',
          data: {
            labels: Object.keys(count),
            datasets: [
              {
                data: Object.values(count),
                backgroundColor: ['#198754', '#20c997', '#218838'],
              },
            ],
          },
          options: { responsive: true, maintainAspectRatio: false },
        }
      );
    },
  },
};
</script>

<style scoped>
/* Ajusta área de conteúdo para não sobrepor sidebar */
.content-area {
  /* sem margin default para mobile */
}

@media (min-width: 768px) {
  .content-area {
    margin-left: 5rem; /* desloca no desktop apenas */
  }
}

/* Layout geral */
.d-flex {
  display: flex !important;
}
.bg-light {
  background-color: #f8f9fa !important;
}
.min-vh-100 {
  min-height: 100vh !important;
}
.flex-fill {
  flex: 1 1 auto !important;
}

/* Cards */
.card {
  border: none;
  border-radius: 0.75rem;
}
.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}
.display-5 {
  font-size: 2.5rem;
  font-weight: 700;
}

/* Navegação mobile */
.nav-pills .nav-link {
  border-radius: 0 !important;
  text-align: center;
  color: #218838;
}
.nav-pills .nav-link.active {
  background-color: #218838 !important;
  color: #fff;
}

/* Responsividade */
@media (min-width: 768px) {
  .d-md-none {
    display: none !important;
  }
}
@media (max-width: 767.98px) {
  .p-md-5 {
    padding: 1rem !important;
  }
  .tab-content {
    text-align: center;
  }
}
</style>
