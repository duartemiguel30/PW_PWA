<template>
  <div class="d-flex min-vh-100 bg-light profile-page">
    <SidebarMenu />

    <div class="content flex-grow-1 d-flex justify-content-center align-items-center p-4">
      <div class="card profile-card bg-white">
        <div class="text-center mb-4">
          <img
            :src="perito.fotografia"
            alt="Foto do Perito"
            class="rounded-circle shadow img-fluid profile-img"
          />
          <h3 class="mt-3 mb-1">{{ perito.nome }}</h3>
          <p class="text-muted mb-0">{{ perito.especialidade }}</p>
        </div>

        <div class="row info-row mb-4">
          <div class="col-12 col-md-6 mb-3 info-item">
            <i class="bi bi-envelope-fill me-2 text-success"></i>
            <span>{{ perito.email }}</span>
          </div>
          <div class="col-12 col-md-6 mb-3 info-item">
            <i class="bi bi-telephone-fill me-2 text-success"></i>
            <span>{{ perito.telemovel }}</span>
          </div>
          <div class="col-12 col-md-6 mb-3 info-item">
            <i class="bi bi-calendar-event-fill me-2 text-success"></i>
            <span>{{ formattedDOB }}</span>
          </div>
          <div class="col-12 col-md-6 mb-3 info-item">
            <i class="bi bi-geo-alt-fill me-2 text-success"></i>
            <span>{{ perito.morada }}</span>
          </div>
        </div>

        <div class="text-center">
          <router-link to="/admin-dashboard" class="btn btn-success return-btn">
            <i class="bi bi-arrow-left me-2"></i>Voltar ao Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarMenu from '@/components/SidebarMenu.vue';

export default {
  name: 'PeritoProfile',
  components: { SidebarMenu },
  data() {
    const logged = JSON.parse(localStorage.getItem('loggedUser')) || {};
    const emailLogado = logged.email || '';
    const peritos = JSON.parse(localStorage.getItem('peritos')) || [];
    const perfil = peritos.find(p => p.email === emailLogado) || {
      nome: '', fotografia: '', especialidade: '', email: '', telemovel: '', dataNascimento: '', morada: ''
    };
    return { perito: perfil };
  },
  computed: {
    formattedDOB() {
      if (!this.perito.dataNascimento) return '';
      return new Date(this.perito.dataNascimento)
        .toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }
};
</script>

<style scoped>

.content {
  flex: 1;
}
.profile-card {
  max-width: 600px;
  width: 100%;
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.profile-img {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border: 4px solid #198754;
}
h3 {
  color: #023b1c;
}
.info-row {
  margin: 0 -1rem;
}
.info-item {
  padding: 0 1rem;
  display: flex;
  align-items: center;
  font-size: 1rem;
}
.return-btn {
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
}

/* Mobile */
@media (max-width: 576px) {
  .d-flex.min-vh-100 {
    flex-direction: column;
  }

  .content {
    padding: 1rem;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-y: auto;
  }
  .profile-card {
    padding: 1rem;
    border-left: none;
    border-top: 6px solid #198754;
    border-radius: 0.75rem;
  }
  .profile-img {
    width: 90px !important;
    height: 90px !important;
    border-width: 3px !important;
  }
  h3 {
    font-size: 1.25rem;
  }
  .info-item {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  .return-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
