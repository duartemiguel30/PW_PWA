<template>
  <div class="container">
    <Sidebar />
    <div class="form-container">
      <h2>Criação do plano de auditoria</h2>
      <form @submit.prevent="guardarAuditoria">
        <div v-if="isMobile">
          <div v-show="currentStep === 0" class="section">
            <h3>Informações do Plano</h3>
            <label>Nome da Auditoria:</label>
            <input v-model="novaAuditoria.nomeAuditoria" type="text" required />
            <label>Descrição da Auditoria:</label>
            <textarea v-model="novaAuditoria.descricaoAuditoria"></textarea>
            <label>Tipo:</label>
            <select v-model="novaAuditoria.tipo">
              <option value="">Selecione...</option>
              <option value="Externa">Externa</option>
              <option value="Interna">Interna</option>
              <option value="Revisão">Revisão</option>
              <option value="Manutenção">Manutenção</option>
            </select>
          </div>

          <div v-show="currentStep === 1" class="section">
            <h3>Locais Auditados</h3>
            <label>País:</label>
            <input v-model="novaAuditoria.pais" type="text" required />
            <label>Distrito:</label>
            <select v-model="novaAuditoria.distrito" required>
              <option value="">Selecione...</option>
              <option v-for="distrito in distritosPortugal" :key="distrito" :value="distrito">
                {{ distrito }}
              </option>
            </select>
            <label>Morada:</label>
            <input v-model="novaAuditoria.morada" type="text" required />
          </div>

          <div v-show="currentStep === 2" class="section">
            <h3>Equipa de Auditores</h3>
            <div class="equipa-list">
              <div v-for="(auditor, index) in equipaAuditoresFicticia" :key="index" class="equipa-row">
                <p><strong>Nome:</strong> {{ auditor.nome }}</p>
                <p><strong>Email:</strong> {{ auditor.email }}</p>
                <p><strong>Tipo de Perito:</strong> {{ auditor.tipo }}</p>
                <hr v-if="index < equipaAuditoresFicticia.length - 1" />
              </div>
            </div>
          </div>

          <div v-show="currentStep === 3" class="section">
            <h3>Materiais e Equipamentos</h3>
            <div class="material-list">
              <div v-for="material in materiaisComPreco" :key="material.nome" class="material-item">
                <input
                  type="checkbox"
                  :id="material.nome"
                  :value="material.nome"
                  v-model="materiaisSelecionados"
                />
                <label :for="material.nome">
                  {{ material.nome }} ({{ material.preco.toFixed(2) }} €)
                </label>
              </div>
            </div>
            <p class="orcamento">
              <strong>Orçamento Estimado:</strong> € {{ orcamentoEstimado }}
            </p>
          </div>

          <div v-show="currentStep === 4" class="section">
            <h3>Agendamento</h3>
            <label>Data de Início:</label>
            <input v-model="novaAuditoria.dataInicio" type="date" required />
            <label>Data de Fim (opcional):</label>
            <input v-model="novaAuditoria.dataFim" type="date" />
            <label>Hora de Chegada:</label>
            <input v-model="novaAuditoria.horaChegada" type="time" required />
            <label>Hora de Término (opcional):</label>
            <input v-model="novaAuditoria.horaTermino" type="time" />
          </div>

          <div v-show="currentStep === 5" class="section image-section">
            <h3>Upload de Imagem (opcional)</h3>
            <input type="file" @change="handleImageUpload" />
          </div>

          <div class="step-navigation">
            <button v-if="currentStep > 0" type="button" @click="prevStep">Anterior</button>
            <button v-if="currentStep < totalSteps - 1" type="button" @click="nextStep">
              Próximo
            </button>
            <button v-else type="submit">Criar</button>
          </div>
        </div>

        <div v-else>
          <div class="section">
            <h3>Informações do Plano</h3>
            <label>Nome da Auditoria:</label>
            <input v-model="novaAuditoria.nomeAuditoria" type="text" required />
            <label>Descrição da Auditoria:</label>
            <textarea v-model="novaAuditoria.descricaoAuditoria"></textarea>
            <label>Tipo:</label>
            <select v-model="novaAuditoria.tipo">
              <option value="">Selecione...</option>
              <option value="Externa">Externa</option>
              <option value="Interna">Interna</option>
              <option value="Revisão">Revisão</option>
              <option value="Manutenção">Manutenção</option>
            </select>
          </div>

          <div class="section">
            <h3>Locais Auditados</h3>
            <label>País:</label>
            <input v-model="novaAuditoria.pais" type="text" required />
            <label>Distrito:</label>
            <select v-model="novaAuditoria.distrito" required>
              <option value="">Selecione...</option>
              <option v-for="distrito in distritosPortugal" :key="distrito" :value="distrito">
                {{ distrito }}
              </option>
            </select>
            <label>Morada:</label>
            <input v-model="novaAuditoria.morada" type="text" required />
          </div>

          <div class="section">
            <h3>Equipa de Auditores</h3>
            <div class="equipa-list">
              <div v-for="(auditor, index) in equipaAuditoresFicticia" :key="index" class="equipa-row">
                <p><strong>Nome:</strong> {{ auditor.nome }}</p>
                <p><strong>Email:</strong> {{ auditor.email }}</p>
                <p><strong>Tipo de Perito:</strong> {{ auditor.tipo }}</p>
                <hr v-if="index < equipaAuditoresFicticia.length - 1" />
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Materiais e Equipamentos</h3>
            <div class="material-list">
              <div v-for="material in materiaisComPreco" :key="material.nome" class="material-item">
                <input
                  type="checkbox"
                  :id="material.nome"
                  :value="material.nome"
                  v-model="materiaisSelecionados"
                />
                <label :for="material.nome">
                  {{ material.nome }} ({{ material.preco.toFixed(2) }} €)
                </label>
              </div>
            </div>
            <p class="orcamento">
              <strong>Orçamento Estimado:</strong> € {{ orcamentoEstimado }}
            </p>
          </div>

          <div class="section">
            <h3>Agendamento</h3>
            <label>Data de Início:</label>
            <input v-model="novaAuditoria.dataInicio" type="date" required />
            <label>Data de Fim (opcional):</label>
            <input v-model="novaAuditoria.dataFim" type="date" />
            <label>Hora de Chegada:</label>
            <input v-model="novaAuditoria.horaChegada" type="time" required />
            <label>Hora de Término (opcional):</label>
            <input v-model="novaAuditoria.horaTermino" type="time" />
          </div>

          <div class="section image-section">
            <h3>Upload de Imagem (opcional)</h3>
            <input type="file" @change="handleImageUpload" />
          </div>

          <button type="submit">Criar Plano de Auditoria</button>
        </div>
      </form>
      <router-link to="/admin-dashboard" class="back-link">Voltar ao Painel</router-link>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/SidebarMenu.vue";

export default {
  components: { Sidebar },
  data() {
    return {
      novaAuditoria: {
        nomeAuditoria: "",
        descricaoAuditoria: "",
        tipo: "",
        pais: "",
        distrito: "",
        morada: "",
        dataInicio: "",
        dataFim: "",
        horaChegada: "",
        horaTermino: "",
        materialNecessario: [],
        custoEstimado: 0,
        imagem: null,
        status: "aberta",
      },
      equipaAuditoresFicticia: [
        { nome: "Ana Silva", email: "ana.silva@exemplo.com", tipo: "Perito Financeiro" },
        { nome: "José Santos", email: "jose.santos@exemplo.com", tipo: "Perito Qualidade" },
      ],
      materiais: [
        { nome: "Aluguer de computador", preco: 29.99 },
        { nome: "Gravação drone", preco: 25.99 },
        { nome: "Aluguer Grua", preco: 79.99 },
        { nome: "Barreira", preco: 10.99 },
        { nome: "Aluguer microfone", preco: 9.99 },
        { nome: "Intervenção do corpo de bombeiros", preco: 99.99 },
        { nome: "Documentos de referência", preco: 19.99 },
        { nome: "Contrato de serviço", preco: 4.99 },
      ],
      materiaisSelecionados: [],
      distritosPortugal: [
        "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora",
        "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém",
        "Setúbal", "Viana do Castelo", "Vila Real", "Viseu"
      ],
      currentStep: 0,
      totalSteps: 6,
      isMobile: false,
    };
  },
  computed: {
    materiaisComPreco() {
      return this.materiais.filter(material => material.preco > 0);
    },
    orcamentoEstimado() {
      let orcamento = 0;
      this.materiaisSelecionados.forEach(material => {
        const item = this.materiais.find(m => m.nome === material);
        if (item) {
          orcamento += item.preco;
        }
      });
      if (this.novaAuditoria.dataInicio && this.novaAuditoria.horaChegada) {
        const dataInicio = new Date(this.novaAuditoria.dataInicio + "T" + this.novaAuditoria.horaChegada);
        if (this.novaAuditoria.dataFim && this.novaAuditoria.horaTermino) {
          const dataFim = new Date(this.novaAuditoria.dataFim + "T" + this.novaAuditoria.horaTermino);
          if (!isNaN(dataFim.getTime()) && dataFim > dataInicio) {
            const diffHrs = (dataFim - dataInicio) / (1000 * 3600);
            orcamento += diffHrs * 8;
          }
        }
      }
      return orcamento.toFixed(2);
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 1024;
    },
    nextStep() {
      if (this.currentStep < this.totalSteps - 1) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    guardarAuditoria() {
      this.novaAuditoria.materialNecessario = this.materiaisSelecionados;
      this.novaAuditoria.custoEstimado = parseFloat(this.orcamentoEstimado);
      if (this.novaAuditoria.dataFim && this.novaAuditoria.horaTermino) {
        this.novaAuditoria.status = "terminada";
      } else {
        this.novaAuditoria.status = "aberta";
      }
      this.novaAuditoria.id = Date.now();
      let auditorias = JSON.parse(localStorage.getItem("auditorias")) || [];
      auditorias.push(this.novaAuditoria);
      localStorage.setItem("auditorias", JSON.stringify(auditorias));
      alert("Plano de Auditoria criado com sucesso!");
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
    },
  },
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background: #f0f0f0;
}

.form-container {
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

h2 {
  margin-bottom: 1rem;
  text-align: center;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section {
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  text-align: left;
}

.section h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #333;
}

label {
  font-weight: bold;
  margin-top: 0.5rem;
  display: block;
}

input[type="text"],
input[type="date"],
input[type="time"],
textarea,
select {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  margin-top: 0.25rem;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.material-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.material-item {
  display: flex;
  align-items: center;
}

.material-item input {
  margin-right: 0.5rem;
}

.orcamento {
  margin-top: 1rem;
  font-size: 1rem;
  text-align: center;
}

.step-navigation {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.step-navigation button {
  padding: 0.7rem;
  background-color: rgba(2, 59, 28, 0.68);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  width: 80%;
  max-width: 300px;
  margin: 0.5rem auto;
}

.step-navigation button:hover {
  background-color: rgb(12, 49, 1);
}

button[type="submit"] {
  padding: 0.7rem;
  background-color: rgba(2, 59, 28, 0.68);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  width: 80%;
  max-width: 300px;
  margin: 0.5rem auto;
}

button[type="submit"]:hover {
  background-color: rgb(12, 49, 1);
}

.image-section {
  padding: 0.5rem;
  text-align: center;
}
.image-section input[type="file"] {
  font-size: 0.9rem;
}

.back-link {
  margin-top: 1rem;
  text-decoration: none;
  color: rgb(41, 95, 4);
}

.back-link:hover {
  text-decoration: underline;
}

.equipa-list {
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 5px;
  background-color: #fff;
}
.equipa-row p {
  margin: 0.2rem 0;
}
.equipa-row hr {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .form-container {
    padding: 1rem;
    margin: 1rem auto;
  }
}
</style>
