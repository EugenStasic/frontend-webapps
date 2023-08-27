<template>
    <div>
      <button @click="goToSearchResults">Pretraži</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goToSearchResults() {
        this.$router.push({ name: 'search-results' });
      }
    }
  }
  </script>
  