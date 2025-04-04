<!-- src/components/Login.vue -->
<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Iniciar Sessão</h2>
      <button @click="loginWithGoogle" class="google-button">
        Entrar com o Google
      </button>
    </div>
  </div>
</template>

<script>
import { auth, provider, signInWithPopup } from '../firebase';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const loginWithGoogle = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('loggedUser', JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }));
        router.push('/admin-dashboard');
      } catch (error) {
        console.error("Erro ao autenticar com o Google:", error);
      }
    };

    return { loginWithGoogle };
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.auth-box {
  padding: 20px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

.google-button {
  width: 100%;
  padding: 10px;
  background-color: #db4437;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.google-button:hover {
  background-color: #c1351d;
}
</style>
