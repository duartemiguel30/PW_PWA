<template>
  <!-- Auditoria Aberta: Renderiza como card com imagem e detalhes completos -->
  <template v-if="auditoria.status === 'aberta'">
    <div class="audit-item audit-open card-layout" @click="openDetailsModal">
      <div class="image-container" v-if="auditoria.imagem">
        <img :src="auditoria.imagem" alt="Imagem da Auditoria" class="audit-image" />
      </div>
      <div class="card-summary">
        <h2 class="title">{{ auditoria.nomeAuditoria }}</h2>
        <p class="location"><strong>Local:</strong> {{ auditoria.pais }}, {{ auditoria.distrito }}, {{ auditoria.morada }}</p>
        <p class="dates"><strong>Agendamento:</strong> {{ formatDate(auditoria.dataInicio, auditoria.horaChegada) }}
          <span v-if="auditoria.dataFim && auditoria.horaTermino"> - {{ formatDate(auditoria.dataFim, auditoria.horaTermino) }}</span>
        </p>
        <div class="material">
          <h5 class="section-title">Materiais Necessários</h5>
          <p v-if="auditoria.materialNecessario.length === 0">Nenhum material especificado.</p>
          <ul v-else>
            <li v-for="(item, index) in auditoria.materialNecessario" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes para auditorias abertas -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
      <div class="modal-content">
        <h2>Detalhes da Auditoria</h2>
        <div class="modal-body">
          <p><strong>Nome da Auditoria:</strong> {{ auditoria.nomeAuditoria }}</p>
          <p v-if="auditoria.descricaoAuditoria"><strong>Descrição:</strong> {{ auditoria.descricaoAuditoria }}</p>
          <p v-if="auditoria.tipo"><strong>Tipo:</strong> {{ auditoria.tipo }}</p>
          <p><strong>Local:</strong> {{ auditoria.pais }}, {{ auditoria.distrito }}, {{ auditoria.morada }}</p>
          <p>
            <strong>Agendamento:</strong> {{ formatDate(auditoria.dataInicio, auditoria.horaChegada) }}
            <span v-if="auditoria.dataFim && auditoria.horaTermino"> - {{ formatDate(auditoria.dataFim, auditoria.horaTermino) }}</span>
          </p>
          <div class="material">
            <h5>Materiais Necessários:</h5>
            <ul v-if="auditoria.materialNecessario.length > 0">
              <li v-for="(item, index) in auditoria.materialNecessario" :key="index">{{ item }}</li>
            </ul>
            <p v-else>Nenhum material especificado.</p>
          </div>
          <p><strong>Orçamento Estimado:</strong> {{ formatCurrency(auditoria.custoEstimado) }}</p>
        </div>
        <button @click="closeDetailsModal">Fechar</button>
      </div>
    </div>
  </template>

  <!-- Auditoria Terminada: Renderiza como card compacto -->
  <template v-else-if="auditoria.status === 'terminada'">
    <div class="audit-item audit-terminated card-layout" @click="openDetailsModal">
      <div class="card-summary">
        <h2 class="title">{{ auditoria.nomeAuditoria }}</h2>
        <p class="location"><strong>Local:</strong> {{ auditoria.pais }}, {{ auditoria.distrito }}, {{ auditoria.morada }}</p>
        <p class="dates"><strong>Agendamento:</strong> {{ formatDate(auditoria.dataInicio, auditoria.horaChegada) }}
          <span v-if="auditoria.dataFim && auditoria.horaTermino"> - {{ formatDate(auditoria.dataFim, auditoria.horaTermino) }}</span>
        </p>
        <p class="cost"><strong>Custo:</strong> {{ formatCurrency(auditoria.custoEstimado) }}</p>
      </div>
    </div>

    <!-- Modal de Detalhes para auditorias terminadas -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
      <div class="modal-content">
        <h2>Detalhes da Auditoria</h2>
        <div class="modal-body">
          <p><strong>Nome da Auditoria:</strong> {{ auditoria.nomeAuditoria }}</p>
          <p v-if="auditoria.descricaoAuditoria"><strong>Descrição:</strong> {{ auditoria.descricaoAuditoria }}</p>
          <p v-if="auditoria.tipo"><strong>Tipo:</strong> {{ auditoria.tipo }}</p>
          <p><strong>Local:</strong> {{ auditoria.pais }}, {{ auditoria.distrito }}, {{ auditoria.morada }}</p>
          <p>
            <strong>Agendamento:</strong> {{ formatDate(auditoria.dataInicio, auditoria.horaChegada) }}
            <span v-if="auditoria.dataFim && auditoria.horaTermino"> - {{ formatDate(auditoria.dataFim, auditoria.horaTermino) }}</span>
          </p>
          <div class="material" v-if="auditoria.materialNecessario.length > 0">
            <h5>Materiais Necessários:</h5>
            <ul>
              <li v-for="(item, index) in auditoria.materialNecessario" :key="index">{{ item }}</li>
            </ul>
          </div>
          <p><strong>Custo Estimado:</strong> {{ formatCurrency(auditoria.custoEstimado) }}</p>
        </div>
        <button @click="closeDetailsModal">Fechar</button>
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
      required: true,
    },
  },
  data() {
    return {
      showDetailsModal: false,
    };
  },
  methods: {
    openDetailsModal() {
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
    },
    formatDate(date, time) {
      if (!date || !time) return "Data/Hora inválida";
      const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(date + "T" + time).toLocaleDateString("pt-PT", options);
    },
    formatCurrency(value) {
      if (!value) return "€0.00";
      return `€${Number(value).toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
/* Layout geral do card */
.card-layout {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin: 1rem;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s ease;
}
.card-layout:hover {
  transform: scale(1.03);
}

/* Adiciona margem à esquerda no PC para evitar colisão com a sidebar */
@media (min-width: 1024px) {
  .card-layout {
    margin-left: 2rem;
  }
}

/* Conteúdo interno */
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

/* Auditorias Abertas */
.audit-open {
  border-left: 5px solid #2ecc71; /* Verde vivo */
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

/* Auditorias Terminadas */
.audit-terminated {
  border-left: 5px solid #e74c3c; /* Vermelho */
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
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
.modal-content button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.modal-content button:hover {
  background-color: #1e8449;
}

/* Responsividade para mobile, tablet e desktop */
@media (max-width: 768px) {
  .card-summary {
    padding: 0.8rem;
  }
  .title {
    font-size: 1rem;
  }
  .location,
  .dates,
  .cost {
    font-size: 0.8rem;
  }
}
</style>
