<template>
  <div class="boat-ad-container">
    <div class="image-container">
      <img v-if="boat.slikePlovila && boat.slikePlovila.length" :src="getBoatImageUrl(boat.slikePlovila[0])" alt="Slika plovila" class="boat-image"/>
    </div>
    <h1>{{ boat.ime }}</h1>
    <div class="boat-specs">
      <h2>Specifikacije Plovila:</h2>
      <p><strong>Tip:</strong> {{ boat.tip }}</p>
      <p><strong>Snaga Motora:</strong> {{ boat.snagaMotora }} kW</p>
      <p><strong>Duljina Plovila:</strong> {{ boat.duljinaPlovila }} m</p>
      <p><strong>Cijena Plovila:</strong> {{ boat.cijenaPlovila }} €</p>
    </div>
    <div class="boat-description">
      <h2>Opis:</h2>
      <p>{{ boat.opis }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boat: {}
    };
  },
  async mounted() {
    try {
      const id = this.$route.params.id;
      const response = await fetch(`http://localhost:3000/boats/${id}`, {
        method: "GET",
      });
      this.boat = await response.json();
    } catch (error) {
      console.error('Error fetching boat details:', error);
    }
  },
  methods: {
    getBoatImageUrl(imageName) {
      const adjustedName = imageName.substring(8);
      return `http://localhost:3000/boats/slike/${adjustedName}`;
    }
  }
}
</script>

<style scoped>
.boat-ad-container {
  padding: 20px;
}

.image-container {
  width: 100%;
  height: 300px;
  background-color: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.boat-image {
  max-width: 100%;
  max-height: 100%;
}

.boat-specs, .boat-description {
  margin-top: 20px;
}

.boat-specs h2, .boat-description h2 {
  margin-bottom: 10px;
}
</style>
