<template>
  <div class="d-flex bg-light min-vh-100">
    <SidebarMenu />

    <div class="flex-fill p-3 p-md-5 content-area">
      <div class="alert alert-success text-center mb-4">
        Bem-vindo de volta, {{ user.name }}!
      </div>

      <ul class="nav nav-pills mb-3 justify-content-center" role="tablist">
        <li class="nav-item" v-for="(tab, idx) in tabs" :key="idx">
          <button
            class="nav-link"
            :class="{ active: currentPage === idx }"
            @click="currentPage = idx"
          >
            {{ tab }}
          </button>
        </li>
      </ul>

      <div class="tab-content">
        <div
          class="tab-pane fade"
          :class="{ 'show active': currentPage === 0 }"
          role="tabpanel"
        >
          <div class="row g-3">
            <div
              class="col-6 col-md-4"
              v-for="(label, i) in ['Total','Abertas','Concluídas']"
              :key="i"
            >
              <div class="card text-center shadow-sm border-success">
                <div class="card-body">
                  <h6 class="card-title text-success">{{ label }}</h6>
                  <p class="display-5 mb-0 text-success">
                    {{
                      i === 0 ? totalAuditorias :
                      i === 1 ? auditoriasAbertas :
                      auditoriasTerminadas
                    }}
                  </p>
                  <small class="text-muted">
                    {{
                      i === 0 ? 'Auditorias' :
                      i === 1 ? 'Em progresso' :
                      'Finalizadas'
                    }}
                  </small>
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="card shadow-sm border-success">
                <div class="card-body p-2" style="height: 200px;">
                  <canvas ref="auditoriasChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  <h6 class="card-title text-success">Peritos</h6>
                  <p class="display-5 mb-0 text-success">{{ totalPeritos }}</p>
                  <small class="text-muted">Cadastrados</small>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="card shadow-sm border-success">
                <div class="card-body p-2" style="height: 200px;">
                  <canvas ref="faturacaoChart"></canvas>
                </div>
              </div>
            </div>

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
      totalPeritos: 0,
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
      return this.auditoriasData.filter(a => a.estado === 'Aberto').length;
    },
    auditoriasTerminadas() {
      return this.auditoriasData.filter(a => a.estado === 'Concluída').length;
    },
  },
  mounted() {
    this.loadData();
    this.$nextTick(this.renderCharts);
  },
  watch: {
    currentPage() {
      this.$nextTick(this.renderCharts);
    },
  },
  methods: {
    loadData() {
      this.auditoriasData = JSON.parse(localStorage.getItem('reports') || '[]');
      this.totalPeritos = JSON.parse(localStorage.getItem('peritos') || '[]').length;
      this.faturacaoTotal = this.auditoriasData.reduce((sum, a) => sum + (a.custo || 0), 0);
      const lg = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      if (lg.name) this.user = lg;
    },
    renderCharts() {
      if (this.currentPage === 0) {
        const ctxA = this.$refs.auditoriasChart?.getContext('2d');
        if (ctxA) {
          this.chartAuditorias?.destroy();
          this.chartAuditorias = new Chart(ctxA, {
            type: 'bar',
            data: {
              labels: ['Total','Abertas','Concluídas'],
              datasets: [{
                data: [this.totalAuditorias, this.auditoriasAbertas, this.auditoriasTerminadas],
                backgroundColor: ['#198754','#20c997','#218838'],
              }]
            },
            options: { responsive: true, maintainAspectRatio: false }
          });
        }
      }

      if (this.currentPage === 1) {
        const ctxF = this.$refs.faturacaoChart?.getContext('2d');
        if (ctxF) {
          this.chartFaturacao?.destroy();
          this.chartFaturacao = new Chart(ctxF, {
            type: 'line',
            data: {
              labels: this.auditoriasData.map(a => a.data || ''),
              datasets: [{
                data: this.auditoriasData.map(a => a.custo || 0),
                borderColor: '#198754',
                fill: false,
                tension: 0.2
              }]
            },
            options: { responsive: true, maintainAspectRatio: false }
          });
        }

        const count = {};
        this.auditoriasData.forEach(a => {
          (a.materiais || []).forEach(m => {
            // m may be { name, qty }
            const name = m.name ?? m;
            const qty  = m.qty  ?? 1;
            count[name] = (count[name] || 0) + qty;
          });
        });
        const labels = Object.keys(count);
        const data   = Object.values(count);

        const ctxM = this.$refs.materiaisChart?.getContext('2d');
        if (ctxM) {
          this.chartMateriais?.destroy();
          if (labels.length) {
            this.chartMateriais = new Chart(ctxM, {
              type: 'pie',
              data: {
                labels,
                datasets: [{
                  data,
                  backgroundColor: ['#198754','#20c997','#218838']
                }]
              },
              options: { responsive: true, maintainAspectRatio: false }
            });
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.content-area {}
@media (min-width: 768px) {
  .content-area { margin-left: 5rem; }
}
.d-flex { display: flex !important; }
.bg-light { background-color: #f8f9fa !important; }
.min-vh-100 { min-height: 100vh !important; }
.flex-fill { flex: 1 1 auto !important; }
.card { border: none; border-radius: 0.75rem; }
.shadow-sm { box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075)!important; }
.display-5 { font-size: 2.5rem; font-weight: 700; }
.nav-pills .nav-link { border-radius: 0 !important; text-align: center; color: #218838; }
.nav-pills .nav-link.active { background-color: #218838 !important; color: #fff; }
@media (min-width: 768px) { .d-md-none { display: none !important; } }
@media (max-width: 767.98px) { .p-md-5 { padding: 1rem !important; } .tab-content { text-align: center; } }
</style>
