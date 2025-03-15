<template>
  <div class="audit-item">
    <div class="image-container">
      <img :src="auditoria.imagem" alt="Imagem da Auditoria" class="audit-image"/>
    </div>

    <div class="details">
      <div class="header">
        <h2 class="title">{{ auditoria.peritoPrincipal }}</h2>
        <div class="actions">
          <button class="edit-btn" @click="toggleEditForm">
            <!-- Ícone de edição do Feather -->
            <i data-feather="edit"></i> 
          </button>
        </div>
      </div>

      <p class="dates">{{ formatDate(auditoria.dataInicio) }} - {{ formatDate(auditoria.dataFim) }}</p>

      <div class="material">
        <h5 class="section-title">Material Necessário</h5>
        <p v-if="auditoria.materialNecessario.length === 0">Nenhum material especificado.</p>
        <ul v-else>
          <li v-for="(item, index) in auditoria.materialNecessario" :key="index">{{ item }}</li>
        </ul>
      </div>

      <div class="cost">
        <p><strong>Custo Estimado:</strong> {{ formatCurrency(auditoria.custoEstimado) }}</p>
      </div>

      <div class="additional-experts" v-if="auditoria.peritosAdicionais.length > 0">
        <h5 class="section-title">Peritos Adicionais</h5>
        <ul>
          <li v-for="(perito, index) in auditoria.peritosAdicionais" :key="index">{{ perito }}</li>
        </ul>
      </div>
    </div>

    <button class="delete-btn" @click="showConfirmModal = true">
      <i data-feather="check-circle"></i> Concluir
    </button>

    <!-- Alerta de Confirmação -->
    <div v-if="showConfirmModal" class="alert-overlay">
      <div class="alert">
        <p>Tem certeza que deseja excluir esta auditoria? Essa ação não pode ser desfeita.</p>
        <div class="alert-actions">
          <button class="cancel-btn" @click="showConfirmModal = false">Cancelar</button>
          <button class="confirm-btn" @click="confirmDelete">Confirmar</button>
        </div>
      </div>
    </div>

    <!-- Componente de Edição -->
    <div v-if="isEditing">
      <div class="edit-form">
        <h5>Editar Auditoria</h5>
        <input type="text" v-model="editData.peritoPrincipal" placeholder="Nome do perito principal" />
        <input type="text" v-model="editData.peritosAdicionaisInput" placeholder="Peritos Adicionais (separados por vírgula)" />
        <input type="date" v-model="editData.dataInicio" placeholder="Data de Início" />
        <input type="date" v-model="editData.dataFim" placeholder="Data de Fim" />
        <input type="number" v-model="editData.custoEstimado" placeholder="Custo Estimado" />
        <input type="time" v-model="editData.horaSaida" placeholder="Hora de Saída" />
        <button @click="saveEdit">Guardar Edição</button>
        <button @click="toggleEditForm">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuditItem',
  props: {
    auditoria: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showConfirmModal: false,
      isEditing: false,
      editData: { 
        ...this.auditoria, 
        peritosAdicionaisInput: Array.isArray(this.auditoria.peritosAdicionais)
          ? this.auditoria.peritosAdicionais.join(', ')
          : this.auditoria.peritosAdicionais || '',
      },
    };
  },
  methods: {
    formatDate(date) {
      if (!date) return "Data inválida";
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('pt-PT', options);
    },
    formatCurrency(value) {
      if (!value) return "€0.00";
      return `€${Number(value).toFixed(2)}`;
    },
    confirmDelete() {
      // Elimina a auditoria do localStorage
      let auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
      const index = auditorias.findIndex(auditoria => auditoria.id === this.auditoria.id);

      if (index !== -1) {
        auditorias.splice(index, 1);  // Remove a auditoria do array
        localStorage.setItem('auditorias', JSON.stringify(auditorias));  // Atualiza o localStorage
      }

      this.showConfirmModal = false;

      // Emite a auditoria deletada para o componente pai
      this.$emit('delete', this.auditoria);

      console.log('Auditoria excluída:', this.auditoria);
    },
    toggleEditForm() {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.editData = { ...this.auditoria };  // Preenche os campos com os dados atuais
      }
    },
    saveEdit() {
      try {
        // Verificar se peritosAdicionaisInput tem um valor válido antes de dividir
        if (this.editData.peritosAdicionaisInput) {
          this.editData.peritosAdicionais = this.editData.peritosAdicionaisInput.split(',').map(perito => perito.trim());
        } else {
          this.editData.peritosAdicionais = []; // Se não houver valor, define como um array vazio
        }

        // Verificando se os campos obrigatórios estão preenchidos corretamente
        if (!this.editData.peritoPrincipal || this.editData.peritoPrincipal.length < 3) {
          alert('O nome do perito principal deve ter pelo menos 3 caracteres.');
          return;
        }

        if (!this.editData.custoEstimado || this.editData.custoEstimado <= 0) {
          alert('O custo estimado deve ser maior que 0.');
          return;
        }

        if (!this.editData.dataInicio || !this.editData.dataFim) {
          alert('As datas de início e fim são obrigatórias.');
          return;
        }

        if (!this.editData.horaSaida) {
          alert('A hora de saída é obrigatória.');
          return;
        }

        // Atualiza o localStorage
        let auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
        const index = auditorias.findIndex(auditoria => auditoria.id === this.auditoria.id);

        if (index !== -1) {
          auditorias[index] = { ...this.editData };  // Atualiza a auditoria existente
          localStorage.setItem('auditorias', JSON.stringify(auditorias)); // Salva no localStorage
        }

        this.$emit('update', this.editData); // Emite os dados atualizados para o componente pai
        this.toggleEditForm(); // Fecha o formulário após guardar
      } catch (error) {
        console.error('Erro ao guardar os dados da auditoria:', error);
      }
    }
  },
  mounted() {
    feather.replace(); // Atualiza os ícones do Feather
  },
  updated() {
    feather.replace(); // Atualiza os ícones após a atualização do componente
  }
}
</script>




<style scoped>
.audit-item {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #fff;
  transition: transform 0.3s ease;
  padding: 15px;
  position: relative;
}

.audit-item:hover {
  transform: scale(1.05);
}

.image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
}

.audit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details {
  padding: 10px 0;
  flex-grow: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.edit-btn i {
  width: 20px;
  height: 20px;
}

.delete-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.delete-btn:hover {
  background-color: darkred;
}

.delete-btn i {
  width: 20px;
  height: 20px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 300px;
}

.modal-input {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.cancel-btn,
.confirm-btn {
    padding: 0.6rem;
    width: 45%;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 0.7rem; 
}

.modal-actions .confirm-btn:last-child {
    margin-right: 0; 
}

.cancel-btn {
  background-color: #ccc;
}

.confirm-btn {
  background-color: green;
  color: white;
}

.cancel-btn:hover {
  background-color: #bbb;
}

.confirm-btn:hover {
  background-color: darkgreen;
}

/* Formulário de edição */
.edit-form {
margin-top: 1rem;
  display: flex;
  flex-direction: column;
}

.edit-form input {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.edit-form button {
    padding: 1rem;
    background-color:rgba(2, 112, 6, 0.73);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-bottom: 0.5rem; 
}

.edit-form button:hover {
  background-color: #45a049;
}
</style>
