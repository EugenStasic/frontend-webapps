<template>
  <div>
    <h1>Rezultati Pretrage</h1>
    <div class="layout-container">
      <div id="filter-bar">
        <input v-model="ime" placeholder="Ime plovila...">
        <select v-model="tip">
          <option value="">Svi tipovi</option>
          <option value="Gliser">Gliser</option>
          <option value="Gumenjak">Gumenjak</option>
          <option value="Jedrilica">Jedrilica</option>
        </select>
        <select v-model="lokacijaPlovila">
          <option value="">Sve Lokacije</option>
          <option v-for="location in uniqueLocations" :key="location">{{ location }}</option>
        </select>
        Snaga motora: <input type="range" v-model.number="snagaMotoraMax" :max="maxMotorPower" step="1">
        <p>{{ snagaMotoraMax }} HP</p>
        Duljina plovila: <input type="range" v-model.number="duljinaPlovilaMax" :max="maxBoatLength" step="0.1">
        <p>{{ duljinaPlovilaMax }} m</p>
        <button @click="getAllBoats">Filtriraj</button>
      </div>
      <div class="boat-cards-container">
        <div v-for="boat in boats" :key="boat._id" class="boat-card">
          <router-link :to="`/boat-ad/${boat._id}`" class="boat-card-link">
            <div class="image-container">
              <img v-if="boat.slikePlovila && boat.slikePlovila.length" :src="getBoatImageUrl(boat.slikePlovila[0])" alt="Slika plovila" class="boat-image"/>
            </div>
            <p v-if="boat.averageRating === 0">Plovilo nije ocijenjeno</p>
            <p v-else>Ocijene korisnika: {{ boat.averageRating.toFixed(1) }}</p>
            <h3>{{ boat.ime }}</h3>
            <p>Tip: {{ boat.tip }}</p>
            <p>Duljina: {{ boat.duljinaPlovila }} m</p>
            <p>Snaga: {{ boat.snagaMotora }} HP</p>
            <p>Cijena: {{ boat.cijenaPlovila }},00€</p>
            <p>Lokacija: {{ boat.lokacijaPlovila }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boats: [],
      ime: '',
      tip: '',
      lokacijaPlovila: '',
      uniqueLocations: [],
      snagaMotoraMax: 600,
      duljinaPlovilaMax: 20,
      maxMotorPower: 600,
      maxBoatLength: 20
    }
  },
  async mounted() {
    await this.getAllBoats();
    await this.fetchUniqueLocations();
    await this.fetchMaxMotorPower();
    await this.fetchMaxBoatLength();
  },
  methods: {
    async getAllBoats() {
      try {
        let url = new URL("http://localhost:3000/search/boats");

        if (this.ime) url.searchParams.append('ime', this.ime);
        if (this.tip) url.searchParams.append('tip', this.tip);
        if (this.lokacijaPlovila) url.searchParams.append('lokacijaPlovila', this.lokacijaPlovila);
        if (this.snagaMotoraMax) url.searchParams.append('snagaMotoraMax', this.snagaMotoraMax);
        if (this.duljinaPlovilaMax) url.searchParams.append('duljinaPlovilaMax', this.duljinaPlovilaMax);

        const response = await fetch(url);
        if (response.status === 200) {
          const boatsData = await response.json();
          this.boats = boatsData.map(boat => {
            if (boat.ocjene && boat.ocjene.length > 0) {
              const sum = boat.ocjene.reduce((a, b) => a + b, 0);
              const avg = sum / boat.ocjene.length;
              return { ...boat, averageRating: avg };
            }
            return { ...boat, averageRating: 0 };
          });
        } else {
          console.error("Error retrieving boats:", await response.text());
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    getBoatImageUrl(imageName) {
      const adjustedName = imageName.substring(8);
      return `http://localhost:3000/boats/slike/${adjustedName}`;
    },
    async fetchUniqueLocations() {
      try {
        const response = await fetch("http://localhost:3000/search/unique-locations");
        this.uniqueLocations = await response.json();
      } catch (error) {
        console.error("Error fetching unique locations:", error);
      }
    },
    async fetchMaxMotorPower() {
      try {
        const response = await fetch("http://localhost:3000/search/max-motor-power");
        const result = await response.json();
        this.maxMotorPower = result.snagaMotora;
      } catch (error) {
        console.error("Error fetching max motor power:", error);
      }
    },
    async fetchMaxBoatLength() {
      try {
        const response = await fetch("http://localhost:3000/search/max-boat-length");
        const result = await response.json();
        this.maxBoatLength = result.duljinaPlovila;
      } catch (error) {
        console.error("Error fetching max boat length:", error);
      }
    }
  }
}
</script>

<style scoped>
  .image-container {
    width: 100%;
    height: 200px;
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
  
  .layout-container {
    display: flex;
    padding-top: 60px;
  }
  
  #filter-bar {
    position: fixed;
    left: 0;
    top: 60px;
    width: 200px;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 20px;
    border-right: 1px solid #ccc;
    overflow-y: auto;
  }
  
  .boat-cards-container {
    margin-left: 280px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .boat-card {
    flex-basis: calc(33.3333% - 20px);
    padding: 15px;
    border: 1px solid #ccc;
    text-align: center;
  }
  
  .boat-card-link {
    text-decoration: none;
    color: inherit;
  }
  
  @media screen and (max-width: 1024px) {
    .boat-card {
      flex-basis: calc(50% - 20px);
    }
  }
</style>
