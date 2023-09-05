<template>
  <form class="form-inline my-2 my-lg-0">
    <button @click="goToSearchResults" class="btn btn-outline-success my-2 my-sm-0" type="button">Pretraži</button>
  </form>
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
  