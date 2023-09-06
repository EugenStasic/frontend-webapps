<template>
  <div>
    <h1 class="header-login">Prijava</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email" class="custom-label">Email:</label>
        <input type="email" 
               id="email" 
               class="form-control custom-input" 
               v-model="email" 
               placeholder="Unesite Email"
               required>

      </div>
      <div class="form-group">
        <label for="password" class="custom-label">Password:</label>
        <input type="password" 
               id="password" 
               class="form-control custom-input" 
               v-model="password" 
               placeholder="Unesite Zaporku"
               required>
      </div>
      <button type="submit" class="btn btn-primary custom-button">Prijavite se</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import config from '../config.js';

export default {
  data() {
    return {
      email: "",
      password: "",
      message: ""
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch(config.baseUrl + '/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          }),
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          this.message = data.message;

          if (data.success) {
            this.$router.push('/home');
          }
        } else {
          this.message = 'Error logging in!';
        }
      } catch (error) {
        console.log("Error:", error);
        this.message = 'Error logging in!';
      }
    }
  }
};
</script>

<style scoped>
.header-login {
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

.login-form {
  text-align: center;
}

.custom-button {
  margin-top: 10px;
}
</style>