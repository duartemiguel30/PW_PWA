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
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h5 class="card-title mb-1">{{ auditoria.nome }}</h5>
          <p class="small mb-1">
            <i v-if="auditoria.tipo_ocorrencia === 'Eletricidade'" class="bi bi-lightning-charge-fill"></i>
            <i v-if="auditoria.tipo_ocorrencia === 'Árvores Caídas/Risco de Cair'" class="bi bi-tree-fill"></i>
            <i v-if="auditoria.tipo_ocorrencia === 'Águas Poluídas'" class="bi bi-water"></i>
            {{ auditoria.local }} • {{ auditoria.freguesia }} • {{ auditoria.concelho }}
          </p>
          <p class="small text-muted mb-2">
            {{ auditoria.descricao_ocorrencia }}
          </p>
          <p class="small text-muted">
            Código Postal: {{ auditoria.codigo_postal }} • Distrito: {{ auditoria.distrito }}
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

      <p class="small text-muted mb-3">
        Submetido em {{ auditoria.data_submissao }} • Urgência: {{ auditoria.grau_urgencia }}
      </p>

      <p class="mb-1 small" v-if="status !== 'Pendente'">
        <i class="bi bi-clock"></i>
        {{ form.horaChegada }} – {{ form.horaSaida }}
        <span class="ms-2">
          <i class="bi bi-currency-euro"></i> {{ computedCost.toFixed(2) }}
        </span>
      </p>

      <div v-if="auditoria.anexo && Object.keys(auditoria.anexo).length" class="mb-3">
        <strong>Anexos:</strong>
        <ul class="small">
          <li v-for="(url, key) in auditoria.anexo" :key="key">
            <a :href="url" target="_blank">{{ key }}</a>
          </li>
        </ul>
      </div>

      <template v-if="editing">
        <transition name="slide">
          <form class="mt-3" @submit.prevent="savePlan">
            <div class="mb-2">
              <input
                type="file"
                class="form-control form-control-sm"
                @change="onFileChange"
                accept="image/*"
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

            <div
              class="form-check form-check-inline mb-2"
              v-for="mat in allMateriais"
              :key="mat.name"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :id="`mat-${mat.name}`"
                :value="mat.name"
                v-model="selectedNames"
              />
              <label class="form-check-label small" :for="`mat-${mat.name}`">
                {{ mat.name }} (€{{ mat.unitPrice }})
              </label>
              <div
                v-if="selectedNames.includes(mat.name)"
                class="ms-2 d-inline-block"
              >
                <input
                  type="number"
                  class="form-control form-control-sm"
                  style="width: 4rem;"
                  min="1"
                  v-model.number="quantities[mat.name]"
                />
              </div>
            </div>

            <div class="mb-3">
              <strong>Custo calculado: €{{ computedCost.toFixed(2) }}</strong>
            </div>

            <button type="submit" class="btn btn-sm btn-primary w-100">
              <i class="bi bi-save-fill"></i> Guardar
            </button>
          </form>
        </transition>
      </template>

      <template v-else>
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
            <i class="bi bi-check2-circle"></i> Concluir
          </button>
          <button
            v-if="status === 'Aberto' && auditoria.nome_utilizador"
            class="btn btn-sm btn-outline-info flex-fill"
            @click="startChat"
          >
            <i class="bi bi-chat-dots"></i> Chat
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  name: 'AuditItem',
  props: {
    auditoria: { type: Object, required: true },
    index: { type: Number, required: true }
  },
  data() {
    const all = [
      { name: 'Mangueira', unitPrice: 10 },
      { name: 'Escada',    unitPrice: 30 },
      { name: 'Lâmpada',   unitPrice: 5 },
      { name: 'Pregos',    unitPrice: 2.5 },
      { name: 'Martelo',   unitPrice: 15 }
    ];
    const prev = this.auditoria.materiais || [];
    const selectedNames = prev.map(m => m.name);
    const quantities = {};
    all.forEach(mat => {
      const found = prev.find(m => m.name === mat.name);
      quantities[mat.name] = found ? found.qty : 1;
    });
    return {
      editing: false,
      allMateriais: all,
      selectedNames,
      quantities,
      form: {
        horaChegada: this.auditoria.horaChegada || '',
        horaSaida:   this.auditoria.horaSaida   || ''
      },
      fotoData: this.auditoria.foto || '',
      storageKey: 'reports'
    };
  },
  computed: {
    status() {
      return this.auditoria.estado;
    },
    computedCost() {
      return this.allMateriais
        .filter(mat => this.selectedNames.includes(mat.name))
        .reduce((sum, mat) => sum + mat.unitPrice * (this.quantities[mat.name]||1), 0);
    }
  },
  methods: {
    reloadReports() {
      this.$emit('update');
    },
    accept() { this.updateEstado('Aberto'); },
    refuse() { this.updateEstado('Concluída'); },
    confirmFinish() {
      if (confirm('Concluir auditoria?')) this.updateEstado('Concluída');
    },
    savePlan() {
      this.updateEstado(this.status);
    },
    updateEstado(novoEstado) {
      const reports = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      if (!reports[this.index]) return;
      const mats = this.allMateriais
        .filter(mat => this.selectedNames.includes(mat.name))
        .map(mat => ({ name: mat.name, qty: this.quantities[mat.name] }));
      reports[this.index] = {
        ...reports[this.index],
        estado: novoEstado,
        horaChegada: this.form.horaChegada,
        horaSaida:   this.form.horaSaida,
        materiais:   mats,
        custo:       this.computedCost,
        foto:        this.fotoData
      };
      localStorage.setItem(this.storageKey, JSON.stringify(reports));
      this.reloadReports();
      this.editing = false;
    },
    toggleEdit() { this.editing = !this.editing; },
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => { this.fotoData = evt.target.result; };
      reader.readAsDataURL(file);
    },
    startChat() {
      this.$emit('start-chat', { userName: this.auditoria.nome_utilizador });
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
