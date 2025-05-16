<template>
  <div class="card">
    <!-- Imagem no topo -->
    <div v-if="fotoData" class="card-image">
      <img :src="fotoData" alt="Foto da Auditoria" />
    </div>

    <!-- Cabeçalho com título e badge -->
    <div class="card-header">
      <h3 class="card-title">{{ auditoria.nome }}</h3>
      <span :class="badgeClass" class="badge">{{ statusLabel }}</span>
    </div>

    <!-- Conteúdo principal com informações adicionais -->
    <div class="card-content">
      <p><strong>Localidade:</strong> {{ auditoria.local }}</p>
      <p><strong>Tipo:</strong> {{ auditoria.tipo_ocorrencia }}</p>
      <p><strong>Data:</strong> {{ auditoria.data }}</p>
      <template v-if="status !== 'Pendente'">
        <p><strong>Custo:</strong> {{ form.custo }} €</p>
        <p><strong>Chegada:</strong> {{ form.horaChegada }}</p>
        <p><strong>Saída:</strong> {{ form.horaSaida }}</p>
        <p v-if="form.materiais.length"><strong>Materiais:</strong> {{ form.materiais.join(', ') }}</p>
      </template>
    </div>

    <!-- Barra de botões modernizados -->
    <div class="card-actions">
      <button
        v-if="status === 'Pendente'"
        class="btn modern accept"
        @click="accept"
      >Aceitar</button>
      <button
        v-if="status === 'Pendente'"
        class="btn modern refuse"
        @click="refuse"
      >Recusar</button>
      <button
        v-if="status === 'Aberto'"
        class="btn modern edit"
        @click="toggleEdit"
      >{{ editing ? 'Cancelar' : 'Editar Plano' }}</button>
      <button
        v-if="status === 'Aberto'"
        class="btn modern finalize"
        @click="confirmFinish"
      >Concluir</button>
    </div>

    <!-- Formulário inline repaginado -->
    <transition name="slide">
      <form v-if="editing" class="edit-form" @submit.prevent="savePlan">
        <!-- inputs estilizados -->
        <div class="field">
          <label>Foto (opcional):</label>
          <input type="file" @change="onFileChange" accept="image/*" />
        </div>
        <div class="field">
          <label>Custo Estimado (€):</label>
          <input type="number" v-model="form.custo" min="0" required />
        </div>
        <div class="field time-fields">
          <input type="time" v-model="form.horaChegada" required class="time-input" />
          <input type="time" v-model="form.horaSaida" required class="time-input" />
        </div>
        <div class="field materials-field">
          <label>Materiais:</label>
          <div class="materials-list">
            <label v-for="m in allMateriais" :key="m" class="mat-item">
              <input type="checkbox" :value="m" v-model="form.materiais" />
              {{ m }}
            </label>
          </div>
        </div>
        <button type="submit" class="btn modern save">Guardar Plano</button>
      </form>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AuditItem',
  props: ['auditoria'],
  data() {
    return {
      status: this.auditoria.estado,
      editing: false,
      form: {
        custo: this.auditoria.custo || '',
        horaChegada: this.auditoria.horaChegada || '',
        horaSaida: this.auditoria.horaSaida || '',
        materiais: [...(this.auditoria.materiais || [])],
      },
      fotoData: this.auditoria.foto || '',
      allMateriais: ['Portátil', 'Câmara', 'Bloco de Notas', 'Checklist'],
      storageKey: 'reports',
    };
  },
  computed: {
    badgeClass() {
      return {
        'badge-pendente':  this.status === 'Pendente',
        'badge-aberto':    this.status === 'Aberto',
        'badge-concluida': this.status === 'Concluída',
      };
    },
    statusLabel() {
      return this.status;
    }
  },
  methods: {
    reloadReports() {
      this.$emit('update');
    },
    accept() {
      this.updateEstado('Aberto');
    },
    refuse() {
      this.updateEstado('Concluída');
    },
    confirmFinish() {
      if (window.confirm('Tem a certeza que pretende concluir esta auditoria?')) {
        this.updateEstado('Concluída');
      }
    },
    updateEstado(novoEstado) {
      const reports = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const idx = reports.findIndex(r => r.id === this.auditoria.id);
      if (idx !== -1) {
        reports[idx] = {
          ...reports[idx],
          estado: novoEstado,
          custo: this.form.custo,
          horaChegada: this.form.horaChegada,
          horaSaida: this.form.horaSaida,
          materiais: this.form.materiais,
          foto: this.fotoData
        };
        localStorage.setItem(this.storageKey, JSON.stringify(reports));
        this.status = novoEstado;
        this.reloadReports();
      }
    },
    toggleEdit() {
      this.editing = !this.editing;
      if (this.editing) {
        this.form = {
          custo: this.auditoria.custo || '',
          horaChegada: this.auditoria.horaChegada || '',
          horaSaida: this.auditoria.horaSaida || '',
          materiais: [...(this.auditoria.materiais || [])],
        };
        this.fotoData = this.auditoria.foto || '';
      }
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => {
        this.fotoData = evt.target.result;
      };
      reader.readAsDataURL(file);
    },
    savePlan() {
      this.updateEstado(this.status);
      this.editing = false;
    }
  }
};
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.card-image img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
.card-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #222222;
}
.badge {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}
.badge-pendente  { background: #FFD666; color: #665200; }
.badge-aberto    { background: #A3E635; color: #3F6212; }
.badge-concluida { background: #CCCCCC; color: #595959; }
.card-content {
  padding: 0 1rem 1rem;
  color: #333333;
  font-size: 0.9rem;
  line-height: 1.4;
}
.card-content p { margin: 0.4rem 0; }
.card-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
}
.btn.modern {
  flex: 1;
  padding: 0.6rem 0;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn.modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.btn.accept   { background: #10B981; color: #ffffff; }
.btn.refuse   { background: #F87171; color: #ffffff; }
.btn.edit     { background: #10B981; color: #ffffff; }
.btn.finalize { background: #F87171; color: #ffffff; }
.edit-form {
  padding: 1rem;
  border-top: 1px solid #f0f0f0;
  background: #FAFAFA;
}
.field { margin-bottom: 1rem; }
.field label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: #444444;
  font-size: 0.9rem;
}
.field input[type="number"],
.field input[type="time"],
.field input[type="file"] {
  width: 100%;
  padding: 0.45rem;
  border: 1px solid #DDDDDD;
  border-radius: 6px;
  font-size: 0.9rem;
}
.time-fields { display: flex; gap: 0.5rem; }
.time-input { flex: 1; }
.materials-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.mat-item {
  display: inline-flex;
  align-items: center;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  transition: background 0.2s;
}
.mat-item input { margin-right: 0.4rem; }
.mat-item:hover { background: #F3F4F6; }
.btn.save {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  background: #6366F1;
  color: #ffffff;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn.save:hover { background: #4F46E5; }
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>
