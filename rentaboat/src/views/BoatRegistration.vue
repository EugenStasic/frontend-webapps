<template>
    <div>
      <h1>Prijavi plovilo</h1>
      <form @submit.prevent="registerBoat">
        <input type="text" v-model="ime" placeholder="Ime plovila" required />
        <input type="text" v-model="tip" placeholder="Tip plovila" required />
        <input type="number" v-model="snagaMotora" placeholder="Snaga motora" required />
        <input type="number" v-model="duljinaPlovila" placeholder="Duljina plovila" required />
        <input type="text" v-model="lokacijaPlovila" placeholder="Lokacija plovila" required />
        <textarea v-model="opis" placeholder="Opis plovila" required></textarea>
        <button type="submit">Registriraj Plovilo</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        ime: "",
        tip: "",
        snagaMotora: "",
        duljinaPlovila: "",
        lokacijaPlovila: "",
        opis: "",
        message: ""
      };
    },
    methods: {
      async registerBoat() {
        try {
          const response = await fetch("http://localhost:3000/boats/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ime: this.ime,
              tip: this.tip,
              snagaMotora: this.snagaMotora,
              duljinaPlovila: this.duljinaPlovila,
              lokacijaPlovila: this.lokacijaPlovila,
              opis: this.opis
            }),
            credentials: "include"
          });
          const data = await response.json();
          this.message = data.message;
          if (data._id) {
            this.$router.push("/my-boats");
          }
        } catch (error) {
          this.message = "Error registering boat!";
        }
      }
    }
  };
  </script>