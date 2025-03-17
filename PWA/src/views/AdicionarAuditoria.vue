<template>
  <div>
    <!-- Chama o componente Sidebar -->
    <Sidebar />

    <!-- Formulário de Auditoria -->
    <div class="form-container">
      <h2>Adicionar Nova Auditoria</h2>

      <form @submit.prevent="guardarAuditoria">
        <!-- Perito Principal -->
        <label>Perito Principal:</label>
        <input v-model="novaAuditoria.peritoPrincipal" type="text" required />

        <!-- Data de Início -->
        <label>Data de Início:</label>
        <input v-model="novaAuditoria.dataInicio" type="date" required />

        <!-- Data de Fim -->
        <label>Data de Fim:</label>
        <input v-model="novaAuditoria.dataFim" type="date" required />

        <!-- Hora de Chegada -->
        <label>Hora de Chegada:</label>
        <input v-model="novaAuditoria.horaChegada" type="time" required />

        <!-- Hora de Término -->
        <label>Hora de Término (opcional):</label>
        <input v-model="novaAuditoria.horaTermino" type="time" />

        <!-- Peritos Adicionais -->
        <label>Peritos Adicionais (separados por vírgula):</label>
        <input v-model="peritosAdicionaisInput" type="text" />

        <!-- Materiais Necessários (Checkboxes) -->
        <label>Materiais Necessários:</label>
        <div class="material-list">
          <div v-for="material in materiais" :key="material.nome">
            <input
              type="checkbox"
              :id="material.nome"
              :value="material.nome"
              v-model="materiaisSelecionados"
            />
            <label :for="material.nome">
              {{ material.nome }} ({{ material.preco }} €)
            </label>
          </div>
        </div>

        <!-- Cálculo de Orçamento -->
        <div>
          <p><strong>Orçamento Estimado:</strong> € {{ orcamentoEstimado }}</p>
        </div>

        <!-- Imagem -->
        <label>Imagem:</label>
        <input type="file" @change="handleImageUpload" />

        <!-- Botão de Submissão -->
        <button type="submit">Guardar Auditoria</button>
      </form>

      <router-link to="/admin-dashboard" class="back-link">Voltar ao Painel</router-link>
    </div>

    <!-- Bottom Bar (Somente para Mobile) -->
    <div v-if="isMobile" class="bottom-bar">
      <router-link to="/admin-dashboard" class="bottom-item" title="Dashboard">
        <i data-feather="activity"></i> <!-- Ícone de Dashboard -->
      </router-link>
      <router-link to="/admin-users" class="bottom-item" title="Users">
        <i data-feather="users"></i> <!-- Ícone de Users -->
      </router-link>
      <router-link to="/admin-settings" class="bottom-item" title="Settings">
        <i data-feather="settings"></i> <!-- Ícone de Settings -->
      </router-link>
      <router-link to="/admin-reports" class="bottom-item" title="Reports">
        <i data-feather="bar-chart-2"></i> <!-- Ícone de Reports -->
      </router-link>
    </div>
  </div>
</template>

<script>

import Sidebar from '@/components/SidebarMenu.vue';  

export default {
  components: {
    Sidebar 
  },
  data() {
    return {
      isMobile: window.innerWidth <= 768,
      novaAuditoria: {
        peritoPrincipal: "",
        dataInicio: "",
        dataFim: "",
        horaChegada: "",
        horaTermino: "",
        peritosAdicionais: [],
        materialNecessario: [],
        custoEstimado: 0
      },
      peritosAdicionaisInput: "",
      materiaisSelecionados: [],
      materiais: [
        { nome: "Laptop", preco: 1000 },
        { nome: "Projetor", preco: 500 },
        { nome: "Impressora portátil", preco: 150 },
        { nome: "Câmera fotográfica", preco: 800 },
        { nome: "Microfone", preco: 120 },
        { nome: "Smartphone", preco: 600 },
        { nome: "Documentos de referência", preco: 20 },
        { nome: "Planilhas de dados", preco: 10 },
        { nome: "Contrato de serviço", preco: 50 },
        { nome: "Formulários", preco: 69 }
      ]
    };
  },
  mounted() {
    window.addEventListener("resize", this.checkIfMobile);
    feather.replace(); 
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkIfMobile);
  },
  computed: {
    orcamentoEstimado() {
      let orcamento = 0;

      this.materiaisSelecionados.forEach(material => {
        const materialEncontrado = this.materiais.find(item => item.nome === material);
        if (materialEncontrado) {
          orcamento += materialEncontrado.preco;
        }
      });

      if (this.novaAuditoria.dataInicio && this.novaAuditoria.horaChegada) {
        const dataInicio = new Date(this.novaAuditoria.dataInicio + "T" + this.novaAuditoria.horaChegada);
        let dataFim = new Date(this.novaAuditoria.dataFim + "T" + (this.novaAuditoria.horaTermino || this.novaAuditoria.horaChegada));
        
        if (isNaN(dataFim.getTime())) {
          dataFim = new Date();
        }

        const diffMs = dataFim - dataInicio;
        const diffHrs = diffMs / (1000 * 3600); 
        orcamento += diffHrs * 8; 
      }

      return orcamento.toFixed(2);
    }
  },
  methods: {
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    guardarAuditoria() {
    this.novaAuditoria.peritosAdicionais = this.peritosAdicionaisInput
      ? this.peritosAdicionaisInput.split(",").map(item => item.trim())
      : [];
    this.novaAuditoria.materialNecessario = this.materiaisSelecionados;

    this.novaAuditoria.custoEstimado = this.orcamentoEstimado; 

    let auditorias = JSON.parse(localStorage.getItem("auditorias")) || [];
    auditorias.push(this.novaAuditoria);
    localStorage.setItem("auditorias", JSON.stringify(auditorias));

    alert("Auditoria adicionada com sucesso!");
    this.$router.push("/admin-dashboard");
  },

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.novaAuditoria.imagem = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 80px; 
  height: 100vh;
  background-color: #333;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
  z-index: 100;
}

.sidebar-menu {
  list-style-type: none;
  padding: 0;
}

.sidebar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  color: white;
  text-decoration: none;
  font-size: 2rem; 
}

.sidebar-item:hover {
  background-color: #444;
}

.form-container {
  margin-left: 80px; 
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  background-color: #f9f9f9;
}

h2 {
  margin-bottom: 1rem;
}

form {
  width: 100%;
  max-width: 600px; 
  display: flex;
  flex-direction: column;
  gap: 1.5rem; 
}

label {
  font-weight: bold;
}

input,
select {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 0.7rem;
  background-color: rgba(2, 59, 28, 0.68);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
}

button:hover {
  background-color: rgb(12, 49, 1);
}

.back-link {
  margin-top: 1rem;
  text-decoration: none;
  color:rgb(41, 95, 4);
}

.back-link:hover {
  text-decoration: underline;
}

.material-list input {
  margin-right: 10px;
}

.material-list label {
  font-size: 1rem;
}

.bottom-bar {
  display: flex;
  justify-content: space-around;
  background-color: #333;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 1rem 0;
  z-index: 100;
}

.bottom-item {
  color: white;
  text-decoration: none;
  font-size: 2rem;
}

.bottom-item:hover {
  color: #aaa;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .form-container {
    margin-left: 0; 
    padding: 1rem; 
    width: 100%; 
  }

  .bottom-bar {
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
</style>
