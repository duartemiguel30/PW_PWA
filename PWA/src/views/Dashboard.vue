<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <SidebarMenu />
    
    <div class="dashboard-content">
      <!-- Mensagem caso não haja auditorias -->
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
  </div>
</template>


<script>
import { Chart, registerables } from "chart.js";
import SidebarMenu from "@/components/SidebarMenu.vue";
import AuditItem from "@/components/AuditItem.vue"; // Se necessário

Chart.register(...registerables);

export default {
  components: {
    SidebarMenu, 
    AuditItem
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
      return this.auditoriasData.filter(a => new Date(a.dataFim) > new Date()).length;
    },
    auditoriasResolvidas() {
      return this.totalAuditorias - this.auditoriasAbertas;
    }
  },

  mounted() {
    this.carregarDados();  // Carregar os dados no carregamento inicial
  },

  methods: {
    carregarDados() {
      // Carregar os dados das auditorias e dos utilizadores do localStorage
      const auditoriasSalvas = JSON.parse(localStorage.getItem("auditorias")) || [];
      const utilizadoresSalvos = JSON.parse(localStorage.getItem("users")) || [];

      // Atualizar os dados
      this.auditoriasData = auditoriasSalvas;
      this.totalUtilizadores = utilizadoresSalvos.length;  // Atualizar o número total de utilizadores
      this.faturacaoTotal = this.auditoriasData.reduce((acc, auditoria) => acc + (auditoria.custoEstimado || 0), 0);

      // Mostrar os gráficos
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
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  overflow-x: hidden; /* Evita o scroll horizontal */
}

.dashboard-content {
  margin-left: 7rem; /* Deixa espaço para a sidebar */
  padding: 1.5rem;
  flex: 1;
  max-width: calc(100% - 7rem); /* Evita que o conteúdo ultrapasse a largura da tela */
  overflow-x: hidden;
  margin: 0 auto; /* Centraliza o conteúdo */
}

.card-body {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* Permite ajustes mais precisos para os filhos */
  padding: 0; /* Ajuste para evitar sobreposição de conteúdo */
}

.card-body img {
  max-width: 10em;
  margin-right: 1.4em;
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

.row {
  display: flex;
  justify-content: center;
}

.card {
  width: 100%;
  max-width: 37rem; /* Limita o tamanho do gráfico */
  margin: 0.5rem;
  box-sizing: border-box; /* Garante que o tamanho da caixa seja calculado corretamente */
  overflow: hidden; /* Evita o overflow */
}

.card-title {
  text-overflow: ellipsis; /* Garante que o título não ultrapasse a caixa */
  overflow: hidden;
  white-space: nowrap; /* Impede o título de quebrar para a linha seguinte */
  font-size: 1.2rem;
}

canvas {
  max-width: 100%; /* Garante que o canvas não ultrapasse a largura da caixa */
  height: auto; /* Ajusta a altura automaticamente para manter a proporção */
}

@media (max-width: 1024px) {
  .dashboard-container {
    flex-direction: column;
  }

  .dashboard-content {
    margin-left: 0;
    padding: 1rem;
    width: 90%; /* Reduz a largura do conteúdo no tablet */
    margin: 0 auto; /* Centraliza o conteúdo */
  }

  .card {
    max-width: 100%; /* Os gráficos ocupam toda a largura disponível */
  }

  .card-body {
    padding: 0.5rem;
  }

  .no-audit-message {
    font-size: 1rem;
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

  .card-body {
    padding: 0.5rem;
  }

  .no-audit-message {
    font-size: 1rem;
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
