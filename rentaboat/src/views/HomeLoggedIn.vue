<template>
  <div>
    <h1>Dobrodošli na Rent a Boat Adriatic, {{ userName }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: 'Guest'
    };
  },
  async mounted() {
    try {
      const response = await fetch("http://localhost:3000/users/me", {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      if (data && data.ime) {
        this.userName = data.ime;
      }
    } catch (error) {
      console.error('There was an error fetching the user data:', error);
    }
  }
}
</script>
