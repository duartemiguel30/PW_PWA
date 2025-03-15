<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <h3>Editar Auditoria</h3>
      <input type="text" v-model="editData.peritoPrincipal" class="modal-input" placeholder="Nome do perito principal" />
      <input type="number" v-model="editData.custoEstimado" class="modal-input" placeholder="Custo Estimado" />
      
      <div class="modal-actions">
        <button class="cancel-btn" @click="cancelEdit">Cancelar</button>
        <button class="confirm-btn" @click="saveEdit">Salvar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    auditoria: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editData: { ...this.auditoria }
    };
  },
  methods: {
    cancelEdit() {
      this.$emit('update:visible', false);  // Fecha o modal
    },
    saveEdit() {
      this.$emit('update:visible', false);  // Fecha o modal
      this.$emit('update', this.editData);  // Envia os dados atualizados
    }
  }
};
</script>

<style scoped>
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
  z-index: 9999;
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

.cancel-btn {
  background: gray;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: darkgray;
}

.confirm-btn {
  background: red;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-btn:hover {
  background: darkred;
}
</style>
