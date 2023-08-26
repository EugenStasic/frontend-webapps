<template>
    <div>
      <h2>Uredi Plovilo</h2>
      <form @submit.prevent="updateBoat">
        <input v-model="boat.ime" placeholder="Ime plovila" />
        <input v-model="boat.tip" placeholder="Tip plovila">
        <input v-model="boat.snagaMotora" placeholder="Snaga motora">
        <input v-model="boat.duljinaPlovila" placeholder="Duljina plovila">
        <input v-model="boat.lokacijaPlovila" placeholder="Lokacija plovila">
        <input v-model="boat.opis" placeholder="Opis plovila">
        <button type="submit">Spremi promjene</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        boat: {}
      };
    },
    methods: {
      async updateBoat() {
        try {
          const response = await fetch(`http://localhost:3000/boats/${this.$route.params.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.boat)
          });
  
          if (!response.ok) {
            throw new Error('Error updating the boat');
          }
  
          this.$router.push('/my-boats');
        } catch (error) {
          console.error('There was an error updating the boat:', error);
        }
      }
    },
    async mounted() {
      try {
        const response = await fetch(`http://localhost:3000/boats/${this.$route.params.id}`, {
          method: "GET",
          credentials: "include"
        });
  
        const data = await response.json();
        this.boat = data;
      } catch (error) {
        console.error('There was an error fetching the boat details:', error);
      }
    }
  }
  </script>
  