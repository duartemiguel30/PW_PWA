<template>

  <div class="container py-4">
  <Sidebar />
    <h2 class="text-center mb-4">Painel de Estatísticas</h2>

    <!-- Cards de Estatísticas -->
    <div class="row text-center">
      <div class="col-md-4">
        <div class="card text-bg-primary mb-3">
          <div class="card-body">
            <h5 class="card-title">Total de Auditorias</h5>
            <p class="display-6">{{ totalAuditorias }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-bg-warning mb-3">
          <div class="card-body">
            <h5 class="card-title">Em Aberto</h5>
            <p class="display-6">{{ auditoriasAbertas }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-bg-success mb-3">
          <div class="card-body">
            <h5 class="card-title">Resolvidas</h5>
            <p class="display-6">{{ auditoriasResolvidas }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card text-bg-info mb-3">
          <div class="card-body">
            <h5 class="card-title">Utilizadores Registrados</h5>
            <p class="display-6">{{ totalUtilizadores }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card text-bg-danger mb-3">
          <div class="card-body">
            <h5 class="card-title">Faturação Total (€)</h5>
            <p class="display-6">{{ faturacaoTotal.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-center">Auditorias (Total vs. Abertas vs. Resolvidas)</h5>
            <canvas ref="auditoriasChart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-center">Faturação por Auditoria</h5>
            <canvas ref="faturacaoChart"></canvas>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import Sidebar from "@/components/SidebarMenu.vue"; 

Chart.register(...registerables);

export default {
  components: {
    Sidebar, 
  },

  data() {
    return {
      auditorias: [],
      totalUtilizadores: 0,
      faturacaoTotal: 0,
    };
  },
  computed: {
    totalAuditorias() {
      return this.auditorias.length;
    },
    auditoriasAbertas() {
      return this.auditorias.filter(a => new Date(a.dataFim) > new Date()).length;
    },
    auditoriasResolvidas() {
      return this.totalAuditorias - this.auditoriasAbertas;
    }
  },
  mounted() {
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      const auditoriasSalvas = JSON.parse(localStorage.getItem("auditorias")) || [];
      const utilizadoresSalvos = JSON.parse(localStorage.getItem("utilizadores")) || [];

      this.auditorias = auditoriasSalvas;
      this.totalUtilizadores = utilizadoresSalvos.length;

      this.faturacaoTotal = this.auditorias.reduce((acc, auditoria) => acc + (auditoria.custoEstimado || 0), 0);

      this.mostrarGraficos();
    },
    mostrarGraficos() {
      // Gráfico de Auditorias
      new Chart(this.$refs.auditoriasChart.getContext("2d"), {
        type: "bar",
        data: {
          labels: ["Total", "Em Aberto", "Resolvidas"],
          datasets: [{
            label: "Auditorias",
            data: [this.totalAuditorias, this.auditoriasAbertas, this.auditoriasResolvidas],
            backgroundColor: ["#0d6efd", "#ffc107", "#198754"]
          }]
        }
      });

      // Gráfico de Faturação
      new Chart(this.$refs.faturacaoChart.getContext("2d"), {
        type: "line",
        data: {
          labels: this.auditorias.map(a => a.dataInicio),
          datasets: [{
            label: "Faturação (€)",
            data: this.auditorias.map(a => a.custoEstimado || 0),
            borderColor: "#dc3545",
            fill: false
          }]
        }
      });
    }
  }
};
</script>
