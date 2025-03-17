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

    <div v-if="showConfirmModal" class="alert-overlay">
      <div class="alert">
        <p>Tem certeza que deseja excluir esta auditoria? Essa ação não pode ser desfeita.</p>
        <div class="alert-actions">
          <button class="cancel-btn" @click="showConfirmModal = false">Cancelar</button>
          <button class="confirm-btn" @click="confirmDelete">Confirmar</button>
        </div>
      </div>
    </div>

    <div v-if="isEditing">
      <div class="edit-form">
        <h6 style="color: black;">Editar Auditoria</h6>
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
      let auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
      const index = auditorias.findIndex(auditoria => auditoria.id === this.auditoria.id);

      if (index !== -1) {
        auditorias.splice(index, 1);  
        localStorage.setItem('auditorias', JSON.stringify(auditorias));  
      }

      this.showConfirmModal = false;

      this.$emit('delete', this.auditoria);

      console.log('Auditoria excluída:', this.auditoria);
    },
    toggleEditForm() {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.editData = { ...this.auditoria };  
      }
    },
    saveEdit() {
      try {
        if (this.editData.peritosAdicionaisInput) {
          this.editData.peritosAdicionais = this.editData.peritosAdicionaisInput.split(',').map(perito => perito.trim());
        } else {
          this.editData.peritosAdicionais = []; 
        }

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

        let auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
        const index = auditorias.findIndex(auditoria => auditoria.id === this.auditoria.id);

        if (index !== -1) {
          auditorias[index] = { ...this.editData };  
          localStorage.setItem('auditorias', JSON.stringify(auditorias)); 
        }

        this.$emit('update', this.editData);
        this.toggleEditForm(); 
      } catch (error) {
        console.error('Erro ao guardar os dados da auditoria:', error);
      }
    }
  },
  mounted() {
    feather.replace(); 
  },
  updated() {
    feather.replace(); 
  }
}
</script>

<style scoped>
.audit-item {
    background: rgba(10, 85, 0, 0.42);
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
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
  color: white;
  padding: 10px 0;
  flex-grow: 1;
}

.header {
  display: flex;
  
  justify-content: space-between;
  align-items: center;
}

.title {
  color: white;
  font-size: 1.2em;
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
  font-size: 1.2rem;
}

.edit-btn i {
  width: 1.5rem;
  height: 1.5rem;
}

.delete-btn {
  background-color: rgba(2, 59, 28, 0.68);
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
  gap: 0.5rem;
}

.delete-btn:hover {
  background-color:rgb(12, 49, 1);
}

.delete-btn i {
  width: 20px;
  height: 20px;
}

.edit-form {
    color: #ffffff;
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
    background-color:rgba(2, 59, 28, 0.68);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-bottom: 0.5rem; 
}

.edit-form button:hover {
  background-color: rgb(12, 49, 1);
}
</style>
