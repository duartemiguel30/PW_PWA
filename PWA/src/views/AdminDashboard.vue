<template>
  <div class="dashboard-container">
    <SidebarMenu />
    <div class="dashboard-content">

      <div class="dashboard-header">
        <div class="stats">
          <div class="stat-item">
            <strong>{{ countAbertas }}</strong>
            <span>Abertas</span>
          </div>
          <div class="stat-item">
            <strong>{{ countFechadas }}</strong>
            <span>Concluídas</span>
          </div>
        </div>
        <div class="toggle-group">
          <label class="switch">
            <input type="checkbox" v-model="mostrarAbertas" />
            <span class="slider"></span>
          </label>
          <span class="toggle-label">
            {{ mostrarAbertas ? "Mostrando Abertas" : "Mostrando Concluídas" }}
          </span>
        </div>
      </div>

      <div v-if="auditoriasFiltradas.length === 0" class="no-audit-message">
        Nenhuma auditoria encontrada.
      </div>

      <div class="audit-list">
        <AuditItem
          v-for="(aud, idx) in auditoriasFiltradas"
          :key="idx"
          :auditoria="aud"
          :index="getGlobalIndex(aud)"
          @update="carregarAuditorias"
          @start-chat="openChat"
        />
      </div>

      <ChatBox
        :userName="utilizadorChat"
        :peritoName="nomePerito"
        :isOpen="chatAberto"
        @close="chatAberto = false"
      />

    </div>
  </div>
</template>

<script>
import SidebarMenu from '@/components/SidebarMenu.vue';
import AuditItem   from '@/components/AuditItem.vue';
import ChatBox     from '@/components/ChatBox.vue';

export default {
  name: 'AdminDashboard',
  components: { SidebarMenu, AuditItem, ChatBox },
  data() {
    return {
      auditoriasData: [],
      mostrarAbertas: true,
      chatAberto: false,
      utilizadorChat: '',
      nomePerito: ''
    };
  },
  computed: {
    countAbertas() {
      return this.auditoriasData.filter(a => a.estado !== 'Concluída').length;
    },
    countFechadas() {
      return this.auditoriasData.filter(a => a.estado === 'Concluída').length;
    },
    auditoriasFiltradas() {
      return this.auditoriasData.filter(a =>
        this.mostrarAbertas ? a.estado !== 'Concluída' : a.estado === 'Concluída'
      );
    }
  },
  mounted() {
    this.carregarAuditorias();
  },
  methods: {
    carregarAuditorias() {
      const user = JSON.parse(localStorage.getItem('loggedUser')) || {};
      const emailLogado = user.email || '';
      const peritos = JSON.parse(localStorage.getItem('peritos')) || [];
      const peritoLogado = peritos.find(p => p.email === emailLogado);
      const nomePerito = peritoLogado ? peritoLogado.nome : '';

      this.nomePerito = nomePerito;
      const reports = JSON.parse(localStorage.getItem('reports')) || [];
      this.auditoriasData = nomePerito
        ? reports.filter(r => r.perito === nomePerito)
        : [];
    },
    getGlobalIndex(aud) {
      return this.auditoriasData.findIndex(r => r === aud);
    },
    openChat({ userName }) {
      this.utilizadorChat = userName;
      this.chatAberto = true;
    }
  }
};
</script>


<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f0f0f0;
}
.dashboard-content {
  --content-padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--content-padding);
  overflow: auto;
  transition: margin 0.2s, padding 0.2s;
}
@media (min-width: 769px) {
  .dashboard-content {
    margin-left: 5rem;
    --content-padding: 1rem;
  }
}
@media (max-width: 768px) {
  .dashboard-content {
    margin-left: 0;
    margin-bottom: 4rem;
    --content-padding: 0;
  }
}
.dashboard-header {
  background: #023b1c;
  color: #fff;
  padding: 1rem;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  border-radius: 8px;
}
@media (max-width: 768px) {
  .dashboard-header {
    width: 100vw;
    left: calc(-1 * var(--content-padding));
    border-radius: 0;
    margin-top: 0;
  }
}
.stats { display: flex; gap: 1rem; }
.stat-item { text-align: center; }
.stat-item strong { display: block; font-size: 1.25rem; }
.toggle-group { display: flex; align-items: center; }
.switch {
  position: relative; width: 42px; height: 24px;
  margin-right: 0.5rem;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute; inset: 0;
  background-color: #a3d9a5;
  border-radius: 24px;
  transition: .2s;
}
.slider:before {
  content: "";
  position: absolute;
  width: 18px; height: 18px;
  left: 3px; bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: .2s;
}
input:checked + .slider {
  background-color: #4caf50;
}
input:checked + .slider:before {
  transform: translateX(18px);
}
.toggle-label { font-size: .9rem; }
.audit-list {
  display: flex;
  flex-direction: column;  
  gap: 1rem;
}
.no-audit-message {
  font-size: 1.1rem;
  text-align: center;
  margin: 2rem 0;
}
.no-audit-message a {
  color: hsl(213,56%,52%);
  text-decoration: underline;
}
@media (max-width: 768px) {
  .dashboard-header { flex-direction: column; gap: .5rem; text-align: center; }
  .stats { justify-content: center; }
}
@media (max-width: 480px) {
  .stat-item strong { font-size: 1.1rem; }
}
</style>
