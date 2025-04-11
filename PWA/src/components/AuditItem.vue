<template>
  <!-- Card da auditoria -->
  <template v-if="auditoria.status === 'aberta'">
    <div class="audit-item audit-open card-layout" @click="openDetailsModal">
      <div class="image-container" v-if="auditoria.imagem">
        <img :src="auditoria.imagem" alt="Imagem da Auditoria" class="audit-image" />
      </div>
      <div class="card-summary">
        <h2 class="title">{{ auditoria.nomeAuditoria }}</h2>
        <p class="location">
          <strong>Local:</strong> {{ auditoria.pais }}, {{ auditoria.distrito }}, {{ auditoria.morada }}
        </p>
        <p class="dates">
          <strong>Agendamento:</strong> {{ formatDate(auditoria.dataInicio, auditoria.horaChegada) }}
          <span v-if="auditoria.dataFim && auditoria.horaTermino">
            - {{ formatDate(auditoria.dataFim, auditoria.horaTermino) }}
          </span>
        </p>
        <div class="material">
          <h5 class="section-title">Materiais Necessários</h5>
          <p v-if="auditoria.materialNecessario.length === 0">Nenhum material especificado.</p>
          <ul v-else>
            <li v-for="(item, index) in auditoria.materialNecessario" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modal de detalhes/edição -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
      <div class="modal-content">
        <h2>Detalhes da Auditoria</h2>
        <!-- Modo de visualização normal -->
        <div v-if="!editMode" class="modal-body">
          <p><strong>Nome da Auditoria:</strong> {{ auditoria.nomeAuditoria }}</p>
          <p v-if="auditoria.descricaoAuditoria"><strong>Descrição:</strong> {{ auditoria.descricaoAuditoria }}</p>
          <p v-if="auditoria.tipo"><strong>Tipo:</strong> {{ auditoria.tipo }}</p>
          <p><strong>Local:</strong> {{ auditoria.pais }}, {{ auditoria.distrito }}, {{ auditoria.morada }}</p>
          <p>
            <strong>Agendamento:</strong> {{ formatDate(auditoria.dataInicio, auditoria.horaChegada) }}
            <span v-if="auditoria.dataFim && auditoria.horaTermino">
              - {{ formatDate(auditoria.dataFim, auditoria.horaTermino) }}
            </span>
          </p>
          <div class="material">
            <h5>Materiais Necessários:</h5>
            <ul v-if="auditoria.materialNecessario.length > 0">
              <li v-for="(item, index) in auditoria.materialNecessario" :key="index">
                {{ item }}
              </li>
            </ul>
            <p v-else>Nenhum material especificado.</p>
          </div>
          <p><strong>Orçamento Estimado:</strong> {{ formatCurrency(auditoria.custoEstimado) }}</p>
          <div class="modal-actions">
            <button @click="activateEditMode">Editar</button>
            <button @click="concludeAudit">Concluir</button>
            <button @click="closeDetailsModal">Fechar</button>
          </div>
        </div>

        <!-- Modo edição: formulário unificado (multistep se mobile, completo se desktop) -->
        <div v-else class="modal-body">
          <!-- Se for dispositivo móvel, utiliza navegação por passos -->
          <form v-if="isMobile" @submit.prevent="saveEdits" class="edit-form">
            <!-- Passo 0: Informações do Plano -->
            <div v-show="currentStep === 0" class="section">
              <h3>Informações do Plano</h3>
              <label>Nome da Auditoria:</label>
              <input v-model="editedAuditoria.nomeAuditoria" type="text" required />
              <label>Descrição da Auditoria:</label>
              <textarea v-model="editedAuditoria.descricaoAuditoria"></textarea>
              <label>Tipo:</label>
              <select v-model="editedAuditoria.tipo">
                <option value="">Selecione...</option>
                <option value="Externa">Externa</option>
                <option value="Interna">Interna</option>
                <option value="Revisão">Revisão</option>
                <option value="Manutenção">Manutenção</option>
              </select>
            </div>
            <!-- Passo 1: Locais Auditados -->
            <div v-show="currentStep === 1" class="section">
              <h3>Locais Auditados</h3>
              <label>País:</label>
              <input v-model="editedAuditoria.pais" type="text" required />
              <label>Distrito:</label>
              <select v-model="editedAuditoria.distrito" required>
                <option value="">Selecione...</option>
                <option v-for="distrito in distritosPortugal" :key="distrito" :value="distrito">
                  {{ distrito }}
                </option>
              </select>
              <label>Morada:</label>
              <input v-model="editedAuditoria.morada" type="text" required />
            </div>
            <!-- Passo 2: Equipa de Auditores (apenas exibição) -->
            <div v-show="currentStep === 2" class="section">
              <h3>Equipa de Auditores</h3>
              <div class="equipa-list">
                <div v-for="(auditor, index) in equipeAuditoresFicticia" :key="index" class="equipa-row">
                  <p><strong>Nome:</strong> {{ auditor.nome }}</p>
                  <p><strong>Email:</strong> {{ auditor.email }}</p>
                  <p><strong>Tipo de Perito:</strong> {{ auditor.tipo }}</p>
                  <hr v-if="index < equipeAuditoresFicticia.length - 1" />
                </div>
              </div>
            </div>
            <!-- Passo 3: Materiais e Equipamentos -->
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
            <!-- Passo 4: Agendamento -->
            <div v-show="currentStep === 4" class="section">
              <h3>Agendamento</h3>
              <label>Data de Início:</label>
              <input v-model="editedAuditoria.dataInicio" type="date" required />
              <label>Hora de Chegada:</label>
              <input v-model="editedAuditoria.horaChegada" type="time" required />
              <label>Data de Fim (opcional):</label>
              <input v-model="editedAuditoria.dataFim" type="date" />
              <label>Hora de Término (opcional):</label>
              <input v-model="editedAuditoria.horaTermino" type="time" />
            </div>
            <!-- Passo 5: Upload de Imagem -->
            <div v-show="currentStep === 5" class="section image-section">
              <h3>Upload de Imagem (opcional)</h3>
              <input type="file" @change="handleImageUpload" />
              <div v-if="editedAuditoria.imagem">
                <img :src="editedAuditoria.imagem" alt="Pré-visualização" class="preview-image" />
              </div>
            </div>
            <!-- Navegação dos passos -->
            <div class="step-navigation">
              <button v-if="currentStep > 0" type="button" @click="prevStep">Anterior</button>
              <button v-if="currentStep < totalSteps - 1" type="button" @click="nextStep">
                Próximo
              </button>
              <button v-else type="submit">{{ "Guardar Alterações" }}</button>
            </div>
          </form>

          <!-- Se não for mobile, mostra formulário completo -->
          <form v-else @submit.prevent="saveEdits" class="edit-form">
            <div class="section">
              <h3>Informações do Plano</h3>
              <label>Nome da Auditoria:</label>
              <input v-model="editedAuditoria.nomeAuditoria" type="text" required />
              <label>Descrição da Auditoria:</label>
              <textarea v-model="editedAuditoria.descricaoAuditoria"></textarea>
              <label>Tipo:</label>
              <select v-model="editedAuditoria.tipo">
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
              <input v-model="editedAuditoria.pais" type="text" required />
              <label>Distrito:</label>
              <select v-model="editedAuditoria.distrito" required>
                <option value="">Selecione...</option>
                <option v-for="distrito in distritosPortugal" :key="distrito" :value="distrito">
                  {{ distrito }}
                </option>
              </select>
              <label>Morada:</label>
              <input v-model="editedAuditoria.morada" type="text" required />
            </div>

            <div class="section">
              <h3>Equipa de Auditores</h3>
              <div class="equipa-list">
                <div v-for="(auditor, index) in equipeAuditoresFicticia" :key="index" class="equipa-row">
                  <p><strong>Nome:</strong> {{ auditor.nome }}</p>
                  <p><strong>Email:</strong> {{ auditor.email }}</p>
                  <p><strong>Tipo de Perito:</strong> {{ auditor.tipo }}</p>
                  <hr v-if="index < equipeAuditoresFicticia.length - 1" />
                </div>
              </div>
            </div>

            <div class="section">
              <h3>Materiais e Equipamentos</h3>
              <div class="material-list">
                <div v-for="material in materiaisComPreco" :key="material.nome" class="material-item">
                  <input type="checkbox" :id="material.nome" :value="material.nome" v-model="materiaisSelecionados" />
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
              <input v-model="editedAuditoria.dataInicio" type="date" required />
              <label>Hora de Chegada:</label>
              <input v-model="editedAuditoria.horaChegada" type="time" required />
              <label>Data de Fim (opcional):</label>
              <input v-model="editedAuditoria.dataFim" type="date" />
              <label>Hora de Término (opcional):</label>
              <input v-model="editedAuditoria.horaTermino" type="time" />
            </div>

            <div class="section image-section">
              <h3>Upload de Imagem (opcional)</h3>
              <input type="file" @change="handleImageUpload" />
              <div v-if="editedAuditoria.imagem">
                <img :src="editedAuditoria.imagem" alt="Pré-visualização" class="preview-image" />
              </div>
            </div>

            <div class="modal-actions">
              <button type="submit">Guardar Alterações</button>
              <button type="button" @click="cancelEdit">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>

  <!-- Card e modal para auditoria com status "terminada" -->
  <template v-else-if="auditoria.status === 'terminada'">
    <div class="audit-item audit-terminated card-layout" @click="openDetailsModal">
      <div class="card-summary">
        <h2 class="title">{{ auditoria.nomeAuditoria }}</h2>
        <p class="location">
          <strong>Local:</strong> {{ auditoria.pais }}, {{ auditoria.distrito }}, {{ auditoria.morada }}
        </p>
        <p class="dates">
          <strong>Agendamento:</strong> {{ formatDate(auditoria.dataInicio, auditoria.horaChegada) }}
          <span v-if="auditoria.dataFim && auditoria.horaTermino">
            - {{ formatDate(auditoria.dataFim, auditoria.horaTermino) }}
          </span>
        </p>
        <p class="cost">
          <strong>Custo:</strong> {{ formatCurrency(auditoria.custoEstimado) }}
        </p>
      </div>
    </div>

    <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
      <div class="modal-content">
        <h2>Detalhes da Auditoria</h2>
        <div v-if="!editMode" class="modal-body">
          <p><strong>Nome da Auditoria:</strong> {{ auditoria.nomeAuditoria }}</p>
          <p v-if="auditoria.descricaoAuditoria"><strong>Descrição:</strong> {{ auditoria.descricaoAuditoria }}</p>
          <p v-if="auditoria.tipo"><strong>Tipo:</strong> {{ auditoria.tipo }}</p>
          <p>
            <strong>Local:</strong> {{ auditoria.pais }}, {{ auditoria.distrito }}, {{ auditoria.morada }}
          </p>
          <p>
            <strong>Agendamento:</strong> {{ formatDate(auditoria.dataInicio, auditoria.horaChegada) }}
            <span v-if="auditoria.dataFim && auditoria.horaTermino">
              - {{ formatDate(auditoria.dataFim, auditoria.horaTermino) }}
            </span>
          </p>
          <div class="material" v-if="auditoria.materialNecessario.length > 0">
            <h5>Materiais Necessários:</h5>
            <ul>
              <li v-for="(item, index) in auditoria.materialNecessario" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
          <p><strong>Custo Estimado:</strong> {{ formatCurrency(auditoria.custoEstimado) }}</p>
          <div class="modal-actions">
            <button @click="activateEditMode">Editar</button>
            <button @click="closeDetailsModal">Fechar</button>
          </div>
        </div>
        <div v-else class="modal-body">
          <!-- Para auditoria terminada, o formulário de edição segue a versão "desktop" -->
          <form @submit.prevent="saveEdits" class="edit-form">
            <label>Nome da Auditoria:</label>
            <input v-model="editedAuditoria.nomeAuditoria" type="text" required />
            <label>Descrição:</label>
            <textarea v-model="editedAuditoria.descricaoAuditoria"></textarea>
            <label>Tipo:</label>
            <input v-model="editedAuditoria.tipo" type="text" />
            <label>País:</label>
            <input v-model="editedAuditoria.pais" type="text" required />
            <label>Distrito:</label>
            <input v-model="editedAuditoria.distrito" type="text" required />
            <label>Morada:</label>
            <input v-model="editedAuditoria.morada" type="text" required />
            <label>Data de Início:</label>
            <input v-model="editedAuditoria.dataInicio" type="date" required />
            <label>Hora de Chegada:</label>
            <input v-model="editedAuditoria.horaChegada" type="time" required />
            <label>Data de Fim:</label>
            <input v-model="editedAuditoria.dataFim" type="date" />
            <label>Hora de Término:</label>
            <input v-model="editedAuditoria.horaTermino" type="time" />
            <div class="modal-actions">
              <button type="submit">Guardar</button>
              <button type="button" @click="cancelEdit">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
export default {
  name: "AuditItem",
  props: {
    auditoria: {
      type: Object,
      required: true
    }
  },
  emits: ["update", "conclude"],
  data() {
    return {
      showDetailsModal: false,
      editMode: false,
      editedAuditoria: {},
      // Propriedades para formulário multi‐passos (mobile)
      currentStep: 0,
      totalSteps: 6,
      isMobile: false,
      // Dados estáticos
      materiais: [
        { nome: "Aluguer de computador", preco: 29.99 },
        { nome: "Gravação drone", preco: 25.99 },
        { nome: "Aluguer Grua", preco: 79.99 },
        { nome: "Barreira", preco: 10.99 },
        { nome: "Aluguer microfone", preco: 9.99 },
        { nome: "Intervenção do corpo de bombeiros", preco: 99.99 },
        { nome: "Documentos de referência", preco: 19.99 },
        { nome: "Contrato de serviço", preco: 4.99 }
      ],
      distritosPortugal: [
        "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora",
        "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém",
        "Setúbal", "Viana do Castelo", "Vila Real", "Viseu"
      ],
      equipeAuditoresFicticia: [
        { nome: "Ana Silva", email: "ana.silva@exemplo.com", tipo: "Perito Financeiro" },
        { nome: "José Santos", email: "jose.santos@exemplo.com", tipo: "Perito Qualidade" }
      ],
      materiaisSelecionados: []
    };
  },
  computed: {
    materiaisComPreco() {
      return this.materiais.filter(material => material.preco > 0);
    },
    orcamentoEstimado() {
      let orcamento = 0;
      this.materiaisSelecionados.forEach(materialNome => {
        const item = this.materiais.find(m => m.nome === materialNome);
        if (item) {
          orcamento += item.preco;
        }
      });
      if (this.editedAuditoria.dataInicio && this.editedAuditoria.horaChegada) {
        const dataInicio = new Date(this.editedAuditoria.dataInicio + "T" + this.editedAuditoria.horaChegada);
        if (this.editedAuditoria.dataFim && this.editedAuditoria.horaTermino) {
          const dataFim = new Date(this.editedAuditoria.dataFim + "T" + this.editedAuditoria.horaTermino);
          if (!isNaN(dataFim.getTime()) && dataFim > dataInicio) {
            const diffHrs = (dataFim - dataInicio) / (1000 * 3600);
            orcamento += diffHrs * 8;
          }
        }
      }
      return orcamento.toFixed(2);
    }
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
    openDetailsModal() {
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.editMode = false;
      this.currentStep = 0;
    },
    activateEditMode() {
      this.editMode = true;
      // Cria uma cópia dos dados da auditoria para edição
      this.editedAuditoria = JSON.parse(JSON.stringify(this.auditoria));
      // Preenche os materiais selecionados, se houver
      this.materiaisSelecionados = this.editedAuditoria.materialNecessario
        ? [...this.editedAuditoria.materialNecessario]
        : [];
      this.currentStep = 0;
    },
    cancelEdit() {
      this.editMode = false;
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
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.editedAuditoria.imagem = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    saveEdits() {
      // Atualiza materiais e custo
      this.editedAuditoria.materialNecessario = this.materiaisSelecionados;
      this.editedAuditoria.custoEstimado = parseFloat(this.orcamentoEstimado);

      // Define status: se possui data/hora término, define como "terminada"
      if (this.editedAuditoria.dataFim && this.editedAuditoria.horaTermino) {
        this.editedAuditoria.status = "terminada";
      } else {
        this.editedAuditoria.status = "aberta";
      }
      
      // Atualiza a auditoria na localStorage
      let auditorias = JSON.parse(localStorage.getItem("auditorias")) || [];
      const index = auditorias.findIndex(a => a.id === this.editedAuditoria.id);
      if (index !== -1) {
        auditorias.splice(index, 1, this.editedAuditoria);
      } else {
        auditorias.push(this.editedAuditoria);
      }
      localStorage.setItem("auditorias", JSON.stringify(auditorias));
      alert("Auditoria atualizada com sucesso!");
      this.$emit("update", this.editedAuditoria);
      this.editMode = false;
      this.showDetailsModal = false;
    },
    concludeAudit() {
      this.$emit("conclude", this.auditoria);
      this.closeDetailsModal();
    },
    formatDate(date, time) {
      if (!date || !time) return "Data/Hora inválida";
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      };
      return new Date(date + "T" + time).toLocaleDateString("pt-PT", options);
    },
    formatCurrency(value) {
      if (!value) return "€0.00";
      return `€${Number(value).toFixed(2)}`;
    }
  }
};
</script>

<style scoped>
.card-layout {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s ease;
}
.card-layout:hover {
  transform: scale(1.03);
}
@media (min-width: 1024px) {
  .card-layout {
    margin-left: 2rem;
  }
}
.card-summary {
  padding: 0.8rem 1rem;
}
.title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #2c3e50;
}
.location,
.dates,
.cost {
  font-size: 0.85rem;
  margin: 0.2rem 0;
  color: #34495e;
}
.audit-open {
  border-left: 5px solid #2ecc71;
}
.image-container {
  width: 100%;
  height: 120px;
  overflow: hidden;
}
.audit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.material {
  margin-top: 0.6rem;
}
.section-title {
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
}
.audit-terminated {
  border-left: 5px solid #e74c3c;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.modal-content {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-content h2 {
  margin-top: 0;
  color: #2c3e50;
}
.modal-content .modal-body p {
  margin: 0.5rem 0;
  color: #34495e;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
.modal-actions button {
  padding: 0.5rem 1rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.modal-actions button:hover {
  background-color: #1e8449;
}
.edit-form label {
  margin-top: 1rem;
  display: block;
  font-weight: 500;
}
.edit-form input,
.edit-form textarea,
.edit-form select {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.25rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}
.edit-form textarea {
  min-height: 100px;
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
  align-items: center;
}
.step-navigation button {
  padding: 0.7rem;
  background-color: rgba(2,59,28,0.68);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  width: 80%;
  max-width: 300px;
}
.step-navigation button:hover {
  background-color: rgb(12,49,1);
}
.image-section {
  padding: 0.5rem;
  text-align: center;
}
.image-section input[type="file"] {
  font-size: 0.9rem;
}
.preview-image {
  max-width: 100%;
  margin-top: 0.5rem;
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
  .card-summary, .edit-form {
    padding: 0.8rem;
  }
  h2 {
    font-size: 1.2rem;
  }
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f0f0f0;
  min-height: 100vh;
}
.form-container {
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}
</style>
