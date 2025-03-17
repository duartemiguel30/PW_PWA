<template>
  <div>
    <Sidebar />

    <div class="form-container">
      <h2>Adicionar Nova Auditoria</h2>

      <form @submit.prevent="guardarAuditoria">
        <label>Perito Principal:</label>
        <input v-model="novaAuditoria.peritoPrincipal" type="text" required />

        <label>Data de Início:</label>
        <input v-model="novaAuditoria.dataInicio" type="date" required />

        <label>Data de Fim (opcional):</label>
        <input v-model="novaAuditoria.dataFim" type="date" />

        <label>Hora de Chegada:</label>
        <input v-model="novaAuditoria.horaChegada" type="time" required />

        <label>Hora de Término (opcional):</label>
        <input v-model="novaAuditoria.horaTermino" type="time" />

        <label>Peritos Adicionais (separados por vírgula):</label>
        <input v-model="peritosAdicionaisInput" type="text" />

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

        <div>
          <p><strong>Orçamento Estimado:</strong> € {{ orcamentoEstimado }}</p>
        </div>

        <label>Imagem:</label>
        <input type="file" @change="handleImageUpload" />

        <button type="submit">Guardar Auditoria</button>
      </form>

      <router-link to="/admin-dashboard" class="back-link">Voltar ao Painel</router-link>
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
    guardarAuditoria() {
  // Gerar um id único para a auditoria
  const id = Date.now(); // Usando Date.now() para gerar um id único com base no tempo

  this.novaAuditoria.peritosAdicionais = this.peritosAdicionaisInput
    ? this.peritosAdicionaisInput.split(",").map(item => item.trim())
    : [];
  this.novaAuditoria.materialNecessario = this.materiaisSelecionados;
  this.novaAuditoria.custoEstimado = parseFloat(this.orcamentoEstimado);
  this.novaAuditoria.id = id; // Atribui o id gerado

  // Determinar o status da auditoria
  if (this.novaAuditoria.dataFim && this.novaAuditoria.horaTermino) {
    this.novaAuditoria.status = "terminada";
  } else {
    this.novaAuditoria.status = "aberta";
  }

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

input {
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
  color: rgb(41, 95, 4);
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

.audit-item.terminada {
  background-color: rgba(220, 20, 60, 0.2);
  border-left: 5px solid crimson;
}
</style>
