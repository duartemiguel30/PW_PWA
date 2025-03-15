<template>
  <div class="audit-item">
    <div class="image-container">
      <img :src="auditoria.imagem" alt="Imagem da Auditoria" class="audit-image"/>
    </div>

    <div class="details">
      <h2 class="title">{{ auditoria.peritoPrincipal }}</h2>
      <p class="dates">{{ formatDate(auditoria.dataInicio) }} - {{ formatDate(auditoria.dataFim) }}</p>

      <div class="material">
        <h3>Material Necessário</h3>
        <p v-if="auditoria.materialNecessario.length === 0">Nenhum material especificado.</p>
        <ul v-else>
          <li v-for="(item, index) in auditoria.materialNecessario" :key="index">{{ item }}</li>
        </ul>
      </div>

      <div class="cost">
        <p><strong>Custo Estimado:</strong> {{ formatCurrency(auditoria.custoEstimado) }}</p>
      </div>

      <div class="additional-experts" v-if="auditoria.peritosAdicionais.length > 0">
        <h3>Peritos Adicionais</h3>
        <ul>
          <li v-for="(perito, index) in auditoria.peritosAdicionais" :key="index">{{ perito }}</li>
        </ul>
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
  methods: {
    formatDate(date) {
      if (!date) return "Data inválida";
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('pt-PT', options);
    },
    formatCurrency(value) {
      if (!value) return "€0.00";
      return `€${Number(value).toFixed(2)}`;
    }
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
}

.audit-item:hover {
  transform: scale(1.05);
}

.image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.audit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details {
  padding: 20px;
}

.title {
  font-size: 1.2em;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.dates {
  font-size: 0.9em;
  color: #666;
  margin: 10px 0;
}

.material h3, .cost h3, .additional-experts h3 {
  font-size: 1em;
  margin-top: 15px;
  color: #444;
}

.material ul, .additional-experts ul {
  list-style-type: none;
  padding: 0;
}

.material li, .additional-experts li {
  font-size: 0.9em;
  color: #333;
}

.cost p {
  font-size: 1em;
  font-weight: bold;
  margin-top: 10px;
  color: #333;
}

@media (max-width: 768px) {
  .audit-item {
    max-width: 100%;
  }

  .details {
    padding: 15px;
  }

  .title {
    font-size: 1em;
  }

  .dates {
    font-size: 0.8em;
  }
}
</style>
