<template>
  <div class="auth-container">
    <div class="auth-left">
      <div class="auth-box">
        <h2>Sign Up</h2>
        <input type="text" placeholder="Full Name" v-model="name" />
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <input type="password" placeholder="Confirmar Password" v-model="confirmPassword" />
        <button @click="register">Sign Up</button>
        <p>Já tens uma conta? <router-link to="/login">Sign In</router-link></p>
      </div>
    </div>
    <div class="auth-right"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    register() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const user = {
        name: this.name,
        email: this.email,
        password: this.password,
      };

      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

      const userExists = existingUsers.find(u => u.email === this.email);

      if (userExists) {
        alert("Este email já está registado!");
      } else {
        existingUsers.push(user);
        
        localStorage.setItem("users", JSON.stringify(existingUsers));

        this.$router.push("/login");
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
  background:#295f04;
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
  .auth-left {
    background-size: cover;
    background-position: center;
  }

  .auth-right {
    
    background-image: url('/src/assets/slider-image.jpg');
    background-position: center;
    background-size: cover;
    background-color: #ff416c;
    flex: 1;
  }

  .auth-box {
    width: 80%;
    max-width: 400px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 10;
  }
}
</style>
