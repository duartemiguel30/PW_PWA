<template>
  <!-- Auditoria Aberta: Renderiza como card -->
  <template v-if="auditoria.status === 'aberta'">
    <div class="audit-item audit-open card-layout">
      <div class="image-container">
        <img :src="auditoria.imagem" alt="Imagem da Auditoria" class="audit-image" />
      </div>

      <div v-if="!editMode" class="details">
        <div class="header">
          <h2 class="title">{{ auditoria.peritoPrincipal }}</h2>
          <div class="actions">
            <button class="edit-btn" @click="toggleEditMode">
              <i data-feather="edit"></i> Editar
            </button>
          </div>
        </div>
        <p class="dates">
          {{ formatDate(auditoria.dataInicio) }} - {{ formatDate(auditoria.dataFim) }}
        </p>
        <div class="material">
          <h5 class="section-title">Material Necessário</h5>
          <p v-if="auditoria.materialNecessario.length === 0">
            Nenhum material especificado.
          </p>
          <ul v-else>
            <li v-for="(item, index) in auditoria.materialNecessario" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="cost">
          <p>
            <strong>Custo Estimado:</strong> {{ formatCurrency(auditoria.custoEstimado) }}
          </p>
        </div>
        <div class="additional-experts" v-if="auditoria.peritosAdicionais.length > 0">
          <h5 class="section-title">Peritos Adicionais</h5>
          <ul>
            <li v-for="(perito, index) in auditoria.peritosAdicionais" :key="index">
              {{ perito }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Formulário de Edição Inline -->
      <div v-else class="edit-form-inline">
        <div class="form-group">
          <label>Perito Principal:</label>
          <input v-model="editData.peritoPrincipal" type="text" />
        </div>
        <div class="form-group">
          <label>Data de Início:</label>
          <input v-model="editData.dataInicio" type="date" />
        </div>
        <div class="form-group">
          <label>Data de Fim:</label>
          <input v-model="editData.dataFim" type="date" />
        </div>
        <div class="form-group">
          <label>Custo Estimado:</label>
          <input v-model.number="editData.custoEstimado" type="number" step="0.01" />
        </div>
        <div class="form-group">
          <label>Material (separado por vírgula):</label>
          <input v-model="editData.materialNecessarioString" type="text" />
        </div>
        <div class="form-group">
          <label>Peritos (separado por vírgula):</label>
          <input v-model="editData.peritosAdicionaisString" type="text" />
        </div>
        <div class="edit-actions">
          <button @click="saveEdit">Salvar</button>
          <button @click="cancelEdit">Cancelar</button>
        </div>
      </div>

      <!-- Botão "Concluir" (apenas para auditorias abertas) -->
      <button class="delete-btn" @click="confirmComplete(auditoria.id)">
        <i data-feather="check-circle"></i> Concluir
      </button>
    </div>

    <!-- Modal de Confirmação -->
    <div v-if="showConfirmModal" class="alert-overlay">
      <div class="alert">
        <p>Tem certeza que deseja concluir esta auditoria? Essa ação não pode ser desfeita.</p>
        <div class="alert-actions">
          <button class="cancel-btn" @click="showConfirmModal = false">Cancelar</button>
          <button class="confirm-btn" @click="completeAudit(auditoria.id)">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </template>

  <!-- Auditoria Fechada: Renderiza como linha de tabela -->
  <template v-else-if="auditoria.status === 'terminada'">
    <tr class="table-row">
      <td>{{ auditoria.peritoPrincipal }}</td>
      <td>{{ formatDate(auditoria.dataInicio) }} - {{ formatDate(auditoria.dataFim) }}</td>
      <td>
        <ul v-if="auditoria.materialNecessario.length > 0">
          <li v-for="(item, index) in auditoria.materialNecessario" :key="index">
            {{ item }}
          </li>
        </ul>
        <p v-else>Nenhum material especificado.</p>
      </td>
      <td>{{ formatCurrency(auditoria.custoEstimado) }}</td>
      <td>
        <ul v-if="auditoria.peritosAdicionais.length > 0">
          <li v-for="(perito, index) in auditoria.peritosAdicionais" :key="index">
            {{ perito }}
          </li>
        </ul>
        <p v-else>Sem peritos adicionais.</p>
      </td>
    </tr>
  </template>
</template>

<script>
export default {
  name: "AuditItem",
  props: {
    auditoria: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showConfirmModal: false,
      editMode: false,
      editData: {},
    };
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
      if (this.editMode) {
        const aud = this.auditoria;
        this.editData = {
          id: aud.id,
          peritoPrincipal: aud.peritoPrincipal,
          dataInicio: aud.dataInicio,
          dataFim: aud.dataFim,
          custoEstimado: aud.custoEstimado,
          materialNecessarioString: aud.materialNecessario.join(", "),
          peritosAdicionaisString: aud.peritosAdicionais.join(", "),
        };
      }
    },
    openEditModal(aud) {
      this.toggleEditMode();
    },
    cancelEdit() {
      this.editMode = false;
    },
    saveEdit() {
      let auditorias = JSON.parse(localStorage.getItem("auditorias")) || [];
      const index = auditorias.findIndex(aud => aud.id === this.editData.id);
      if (index !== -1) {
        auditorias[index].peritoPrincipal = this.editData.peritoPrincipal;
        auditorias[index].dataInicio = this.editData.dataInicio;
        auditorias[index].dataFim = this.editData.dataFim;
        auditorias[index].custoEstimado = this.editData.custoEstimado;
        auditorias[index].materialNecessario = this.editData.materialNecessarioString.split(",").map(item => item.trim());
        auditorias[index].peritosAdicionais = this.editData.peritosAdicionaisString.split(",").map(item => item.trim());
        localStorage.setItem("auditorias", JSON.stringify(auditorias));
        this.$emit("update", auditorias[index]);
      }
      this.editMode = false;
    },
    formatDate(date) {
      if (!date) return "Data inválida";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("pt-PT", options);
    },
    formatCurrency(value) {
      if (!value) return "€0.00";
      return `€${Number(value).toFixed(2)}`;
    },
    confirmComplete(id) {
      this.showConfirmModal = true;
    },
    completeAudit(id) {
      let auditorias = JSON.parse(localStorage.getItem("auditorias")) || [];
      const index = auditorias.findIndex(aud => aud.id === id);
      if (index !== -1) {
        auditorias[index].status = "terminada";
        localStorage.setItem("auditorias", JSON.stringify(auditorias));
        this.$emit("update", auditorias[index]);
      }
      this.showConfirmModal = false;
    },
  },
};
</script>

<style scoped>
/* Card layout para auditorias abertas com tamanho reduzido */
.card-layout {
  max-width: 14rem;
  margin: 0.8rem;
}

/* Estilos gerais para AuditItem */
.audit-item {
  background: rgba(10, 85, 0, 0.42);
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  padding: 10px;
  position: relative;
}

.audit-item:hover {
  transform: scale(1.05);
}

.audit-open {
  background-color: rgba(2, 59, 28, 0.68);
}

.audit-complete {
  background-color: rgba(150, 35, 0, 0.6);
}

/* Layout para a linha de tabela (auditorias fechadas) */
.table-row {
  background-color: rgba(150, 35, 0, 0.6);
  color: white;
}

.table-row td {
  border: 1px solid #ddd;
  padding: 10px;
}

/* Imagem e container */
.image-container {
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;
}

.audit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Detalhes e texto */
.details {
  color: white;
  padding: 8px 0;
  flex-grow: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 1.1em;
  font-weight: bold;
  margin: 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}

.edit-btn i {
  width: 1.3rem;
  height: 1.3rem;
}

/* Botão Concluir (apenas para auditorias abertas) */
.delete-btn {
  background-color: rgba(2, 59, 28, 0.68);
  color: white;
  border: none;
  padding: 8px;
  width: 100%;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
}

.delete-btn:hover {
  background-color: rgb(12, 49, 1);
}

.delete-btn i {
  width: 1.3rem;
  height: 1.3rem;
}

/* Inline Edit Form */
.edit-form-inline {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}

.edit-form-inline .form-group {
  margin-bottom: 10px;
}

.edit-form-inline .form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.edit-form-inline .form-group input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.edit-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.edit-actions button {
  padding: 5px 10px;
  cursor: pointer;
}

/* Modal de Confirmação */
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.alert {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.alert-actions {
  margin-top: 15px;
  display: flex;
  justify-content: space-around;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 20px;
  cursor: pointer;
}

/* Responsividade */
@media (max-width: 600px) {
  .card-layout {
    max-width: 100%;
    margin: 0.5rem;
  }
  .image-container {
    height: 120px;
  }
  .details {
    font-size: 0.9em;
  }
  .delete-btn {
    font-size: 0.9rem;
  }
  .modal {
    width: 90%;
  }
}
</style>
