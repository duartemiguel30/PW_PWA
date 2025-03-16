<template>
  <div class="auth-container">
    <div class="auth-left">
      <div class="auth-box">
        <h2>Sign in</h2>
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <button @click="login">Sign In</button>
        <p>Ainda não tens uma conta? <router-link to="/register">Regista-te</router-link></p>
      </div>
    </div>
    <div class="auth-right"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      const adminEmail = 'admin@admin.com';
      const adminPassword = '1234';

      if (this.email === adminEmail && this.password === adminPassword) {
        // Salva no localStorage a informação de que o usuário é admin
        localStorage.setItem('isAdmin', true);
        // Redireciona para o painel de admin
        this.$router.push('/admin-dashboard');
      } else {
        alert('Credenciais inválidas!');
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  height: 100vh;
}

.auth-left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.auth-box {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background: rgb(41, 95, 4);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

p {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
  }

  .auth-left {
    background-image: url('/src/assets/slider-image.jpg');
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    padding: 40px 20px;
    box-sizing: border-box;
    border-radius: 0;
    text-align: center;
  }

  .auth-right {
    display: none;
  }

  .auth-box {
    width: 100%;
    max-width: 400px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 10px;
    box-shadow: none;
  }
}

@media (min-width: 769px) {
  .auth-right {
    background-image: url('/src/assets/slider-image.jpg');
    background-size: cover;
    background-position: center;
    flex: 1;
  }

  .auth-box {
    width: 80%;
    max-width: 400px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 10;
  }
}
</style>
