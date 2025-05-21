<template>
  <div class="card shadow-sm mb-4">
    <img
      v-if="fotoData"
      :src="fotoData"
      class="card-img-top"
      alt="Foto da Auditoria"
      style="height: 150px; object-fit: cover;"
    />

    <div class="card-body p-3">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h5 class="card-title mb-1">{{ auditoria.nome }}</h5>
          <p class="small mb-0">
            <i v-if="auditoria.tipo_ocorrencia === 'Eletricidade'" class="bi bi-lightning-charge-fill"></i>
            {{ auditoria.local }} • {{ auditoria.data }}
          </p>
        </div>
        <span
          class="badge mt-1"
          :class="{
            'bg-warning text-dark': status === 'Pendente',
            'bg-success': status === 'Aberto',
            'bg-secondary': status === 'Concluída'
          }"
        >
          {{ status }}
        </span>
      </div>

      <p class="mb-1 small" v-if="status !== 'Pendente'">
        <i class="bi bi-clock"></i>
        {{ form.horaChegada }} – {{ form.horaSaida }}
        <span v-if="form.custo" class="ms-2">
          <i class="bi bi-currency-euro"></i> {{ form.custo }}
        </span>
      </p>
      <p class="mb-2 small" v-if="form.materiais.length">
        <i class="bi bi-box-seam"></i>
        {{ form.materiais.join(', ') }}
      </p>

      <div class="d-flex gap-2">
        <button
          v-if="status === 'Pendente'"
          class="btn btn-sm btn-outline-success flex-fill"
          @click="accept"
        >
          <i class="bi bi-check-circle"></i> Aceitar
        </button>
        <button
          v-if="status === 'Pendente'"
          class="btn btn-sm btn-outline-danger flex-fill"
          @click="refuse"
        >
          <i class="bi bi-x-circle"></i> Recusar
        </button>
        <button
          v-if="status === 'Aberto'"
          class="btn btn-sm btn-outline-primary flex-fill"
          @click="toggleEdit"
        >
          <i class="bi" :class="editing ? 'bi-x-lg' : 'bi-pencil-fill'"></i>
        </button>
        <button
          v-if="status === 'Aberto'"
          class="btn btn-sm btn-outline-success flex-fill"
          @click="confirmFinish"
        >
          <i class="bi bi-check2-circle"></i>
        </button>
      </div>

      <transition name="slide">
        <form v-if="editing" class="mt-3" @submit.prevent="savePlan">
          <div class="mb-2">
            <input
              type="file"
              class="form-control form-control-sm"
              @change="onFileChange"
              accept="image/*"
            />
          </div>
          <div class="mb-2">
            <input
              type="number"
              v-model="form.custo"
              class="form-control form-control-sm"
              placeholder="Custo (€)"
              min="0"
            />
          </div>
          <div class="mb-2 d-flex gap-2">
            <input
              type="time"
              v-model="form.horaChegada"
              class="form-control form-control-sm"
              required
            />
            <input
              type="time"
              v-model="form.horaSaida"
              class="form-control form-control-sm"
              required
            />
          </div>
          <div class="mb-3">
            <div
              class="form-check form-check-inline"
              v-for="m in allMateriais"
              :key="m"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :value="m"
                v-model="form.materiais"
                :id="'mat-' + m"
              />
              <label class="form-check-label small" :for="'mat-' + m">
                {{ m }}
              </label>
            </div>
          </div>
          <button type="submit" class="btn btn-sm btn-primary w-100">
            <i class="bi bi-save-fill"></i> Guardar
          </button>
        </form>
      </transition>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
      if (window.confirm('Concluir auditoria?')) {
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