<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input type="text" v-model="ime" placeholder="First Name" required />
      <input type="text" v-model="prezime" placeholder="Last Name" required />
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
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
        const response = await fetch("http://localhost:3000/users/register", {
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
