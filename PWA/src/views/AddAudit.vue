<template>
  <div>
    <Sidebar />

    <div class="form-container">
      <h2>Criação do plano de auditoria</h2>

      <form @submit.prevent="guardarAuditoria">
        <!-- INFORMAÇÕES DO PLANO -->
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

        <!-- LOCAIS AUDITADOS -->
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

        <!-- EQUIPA DE AUDITORES -->
        <div class="section">
          <h3>Equipa de Auditores</h3>
          <!-- Lista fictícia (apenas exibição) -->
          <div class="equipa-list">
            <div
              v-for="(auditor, index) in equipaAuditoresFicticia"
              :key="index"
              class="equipa-row"
            >
              <p><strong>Nome:</strong> {{ auditor.nome }}</p>
              <p><strong>Email:</strong> {{ auditor.email }}</p>
              <p><strong>Tipo de Perito:</strong> {{ auditor.tipo }}</p>
              <hr v-if="index < equipaAuditoresFicticia.length - 1" />
            </div>
          </div>
        </div>

        <!-- MATERIAIS E EQUIPAMENTOS -->
        <div class="section">
          <h3>Materiais e Equipamentos</h3>
          <div class="material-list">
            <!-- Apenas exibe os itens que possuem preço -->
            <div
              v-for="material in materiaisComPreco"
              :key="material.nome"
            >
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

          <p class="orcamento">
            <strong>Orçamento Estimado:</strong> € {{ orcamentoEstimado }}
          </p>
        </div>

        <!-- AGENDAMENTO -->
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

        <!-- UPLOAD DE IMAGEM (opcional) -->
        <div class="section">
          <label>Imagem (opcional):</label>
          <input type="file" @change="handleImageUpload" />
        </div>

        <button type="submit">Criar Plano de Auditoria</button>
      </form>

      <router-link to="/admin-dashboard" class="back-link">Voltar ao Painel</router-link>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/SidebarMenu.vue";

export default {
  components: {
    Sidebar,
  },
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
      // Lista fictícia de auditores
      equipaAuditoresFicticia: [
        { nome: "Ana Silva", email: "ana.silva@exemplo.com", tipo: "Perito Financeiro" },
        { nome: "José Santos", email: "jose.santos@exemplo.com", tipo: "Perito Qualidade" },
      ],
      // Lista de materiais (todos com preço)
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
      // Lista de distritos de Portugal
      distritosPortugal: [
        "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora",
        "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém",
        "Setúbal", "Viana do Castelo", "Vila Real", "Viseu"
      ],
    };
  },
  computed: {
    // Filtra apenas materiais com preço > 0 (todos neste exemplo)
    materiaisComPreco() {
      return this.materiais.filter(material => material.preco > 0);
    },
    // Calcula o orçamento estimado somando os preços dos materiais e o custo adicional por hora (8€/hora)
    orcamentoEstimado() {
      let orcamento = 0;
      // Soma dos materiais selecionados
      this.materiaisSelecionados.forEach(material => {
        const item = this.materiais.find(m => m.nome === material);
        if (item) {
          orcamento += item.preco;
        }
      });
      // Se houver data/hora de início e de término válidas, adiciona custo por tempo
      if (this.novaAuditoria.dataInicio && this.novaAuditoria.horaChegada) {
        const dataInicio = new Date(
          this.novaAuditoria.dataInicio + "T" + this.novaAuditoria.horaChegada
        );
        if (this.novaAuditoria.dataFim && this.novaAuditoria.horaTermino) {
          const dataFim = new Date(
            this.novaAuditoria.dataFim + "T" + this.novaAuditoria.horaTermino
          );
          if (!isNaN(dataFim.getTime()) && dataFim > dataInicio) {
            const diffHrs = (dataFim - dataInicio) / (1000 * 3600);
            orcamento += diffHrs * 8;
          }
        }
      }
      return orcamento.toFixed(2);
    },
  },
  methods: {
    guardarAuditoria() {
      // Define os materiais selecionados
      this.novaAuditoria.materialNecessario = this.materiaisSelecionados;
      // Define o custo estimado
      this.novaAuditoria.custoEstimado = parseFloat(this.orcamentoEstimado);
      // Define o status: se não houver data/hora de fim, permanece "aberta"
      if (this.novaAuditoria.dataFim && this.novaAuditoria.horaTermino) {
        this.novaAuditoria.status = "terminada";
      } else {
        this.novaAuditoria.status = "aberta";
      }
      // Salva no localStorage
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

.form-container {
  margin-left: 80px;
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  background-color: #ffffff;
}

h2 {
  margin-bottom: 1rem;
  text-align: center;
}

form {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
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

.material-list input {
  margin-right: 10px;
}

.material-list label {
  font-size: 1rem;
  margin-right: 1rem;
}

.orcamento {
  margin-top: 1rem;
  font-size: 1rem;
}

button {
  padding: 0.7rem;
  background-color: rgba(2, 59, 28, 0.68);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  align-self: flex-end;
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
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: auto;
    padding: 1rem;
  }
  form {
    width: 90%;
    max-width: 100%;
  }
}

@media (min-width: 769px) {
  .form-container {
    margin-left: 120px;
  }
}

.form-container {
  padding-bottom: 80px;
}
</style>
