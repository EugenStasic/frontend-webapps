<template>
  <div>
    <h1 class="header-register">Registracija</h1>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="ime" class="custom-label">Ime:</label>
        <input type="text" 
               id="ime" 
               class="form-control custom-input" 
               v-model="ime" 
               placeholder="Ime"
               required>
      </div>
      <div class="form-group">
        <label for="prezime" class="custom-label">Prezime:</label>
        <input type="text" 
               id="prezime" 
               class="form-control custom-input" 
               v-model="prezime" 
               placeholder="Prezime"
               required>
      </div>
      <div class="form-group">
        <label for="email" class="custom-label">Email:</label>
        <input type="email" 
               id="email" 
               class="form-control custom-input" 
               v-model="email" 
               placeholder="Email"
               required>
      </div>
      <div class="form-group">
        <label for="password" class="custom-label">Password:</label>
        <input type="password" 
               id="password" 
               class="form-control custom-input" 
               v-model="password" 
               placeholder="Vaša Zaporka"
               required>
      </div>
      <button type="submit" class="btn btn-primary custom-button">Registrirajte se</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import config from '../config.js';

export default {
  data() {
    return {
      ime: "",
      prezime: "",
      email: "",
      password: "",
      message: ""
    };
  },
  methods: {
    async register() {
      try {
        const response = await fetch(config.baseUrl + '/users/register', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ime: this.ime,
            prezime: this.prezime,
            email: this.email,
            password: this.password
          }),
          credentials: "include"
        });
        const data = await response.json();
        this.message = data.message;
        if (data.success) {
          this.$router.push("/login");
        }
      } catch (error) {
        this.message = "Error registering user!";
      }
    }
  }
};
</script>

<style scoped>
.header-register {
  font-family: 'Arial', sans-serif;
  font-size: 2em;
}

.custom-label {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
}

.custom-input {
  width: 20%;
  margin: auto;
  text-align: center; 
}

.register-form {
  text-align: center;
}

.custom-button {
  margin-top: 10px;
}
</style>